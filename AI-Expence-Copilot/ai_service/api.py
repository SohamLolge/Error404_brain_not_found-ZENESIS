from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
import pytesseract
import io
import fitz
import hashlib
import json

from invoice_parser import extract_invoice_data


# ======================================================
# FASTAPI APP
# ======================================================

app = FastAPI(
    title="AI Expense Copilot - Invoice AI Service",
    description="OCR and intelligent invoice processing service",
    version="1.2.0"
)


# ======================================================
# TESSERACT CONFIGURATION
# ======================================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# ======================================================
# DUPLICATE STORAGE
# ======================================================
#
# Hackathon MVP:
# Keep fingerprints in memory while the server runs.
#
# A production version can later move this to the
# team's database.
# ======================================================

processed_invoice_hashes = set()
processed_invoice_fingerprints = set()


# ======================================================
# HEALTH CHECK
# ======================================================

@app.get("/")
def root():
    return {
        "service": "AI Expense Copilot - Invoice AI Service",
        "status": "running"
    }


# ======================================================
# IMAGE OCR
# ======================================================

def ocr_image(image):
    """Run Tesseract OCR on a PIL image."""

    return pytesseract.image_to_string(
        image
    )


# ======================================================
# PDF OCR
# ======================================================

def ocr_pdf(contents):
    """
    Convert every PDF page into an image
    and run Tesseract OCR.
    """

    try:

        pdf = fitz.open(
            stream=contents,
            filetype="pdf"
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid PDF file: {str(error)}"
        )

    all_text = []

    try:

        for page in pdf:

            # Render page at a good OCR resolution
            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(2, 2)
            )

            image_bytes = pixmap.tobytes(
                "png"
            )

            image = Image.open(
                io.BytesIO(image_bytes)
            )

            page_text = ocr_image(
                image
            )

            all_text.append(
                page_text
            )

    finally:

        pdf.close()

    return "\n\n".join(
        all_text
    )


# ======================================================
# FILE HASH
# ======================================================

def calculate_file_hash(contents):
    """
    Generate a SHA-256 hash of the uploaded file.

    This catches the exact same file being uploaded again.
    """

    return hashlib.sha256(
        contents
    ).hexdigest()


# ======================================================
# INVOICE FINGERPRINT
# ======================================================

def create_invoice_fingerprint(data):
    """
    Create a fingerprint from extracted invoice fields.

    This helps identify the same invoice even if the
    uploaded file itself is different.
    """

    vendor = data.get("vendor") or ""
    invoice_number = data.get("invoiceNumber") or ""
    date = data.get("date") or ""
    amount = data.get("amount")

    # Normalize vendor text
    vendor = str(vendor).strip().lower()

    # Normalize invoice number
    invoice_number = str(
        invoice_number
    ).strip().lower()

    # Normalize amount
    if amount is None:
        amount = ""

    fingerprint = (
        f"{vendor}|"
        f"{invoice_number}|"
        f"{date}|"
        f"{amount}"
    )

    return fingerprint


# ======================================================
# DUPLICATE CHECK
# ======================================================

def check_duplicate(
    file_hash,
    invoice_fingerprint
):
    """
    Check whether this invoice has already been
    processed during the current server session.
    """

    duplicate_by_file = (
        file_hash in processed_invoice_hashes
    )

    duplicate_by_invoice = (
        invoice_fingerprint
        in processed_invoice_fingerprints
    )

    duplicate = (
        duplicate_by_file
        or duplicate_by_invoice
    )

    # Store for future requests
    processed_invoice_hashes.add(
        file_hash
    )

    processed_invoice_fingerprints.add(
        invoice_fingerprint
    )

    return duplicate


# ======================================================
# PROCESS INVOICE
# ======================================================

@app.post("/process-invoice")
async def process_invoice(
    file: UploadFile = File(...)
):
    """
    Process an invoice image or PDF.

    Supported:
        PNG
        JPG
        JPEG
        WEBP
        PDF
    """

    # --------------------------------------------------
    # Allowed file types
    # --------------------------------------------------

    allowed_types = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "application/pdf"
    ]

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only PNG, JPG, JPEG, WEBP "
                "and PDF files are supported."
            )
        )

    # --------------------------------------------------
    # Read file
    # --------------------------------------------------

    contents = await file.read()

    if not contents:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # --------------------------------------------------
    # Calculate file hash
    # --------------------------------------------------

    file_hash = calculate_file_hash(
        contents
    )

    # ==================================================
    # PDF
    # ==================================================

    if file.content_type == "application/pdf":

        text = ocr_pdf(
            contents
        )

    # ==================================================
    # IMAGE
    # ==================================================

    else:

        try:

            image = Image.open(
                io.BytesIO(contents)
            )

        except Exception:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Uploaded file is not "
                    "a valid image."
                )
            )

        try:

            text = ocr_image(
                image
            )

        except Exception as error:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"OCR processing failed: "
                    f"{str(error)}"
                )
            )

    # ==================================================
    # EXTRACT DATA
    # ==================================================

    result = extract_invoice_data(
        text
    )

    # ==================================================
    # CREATE DUPLICATE FINGERPRINT
    # ==================================================

    invoice_fingerprint = (
        create_invoice_fingerprint(
            result
        )
    )

    # ==================================================
    # CHECK DUPLICATE
    # ==================================================

    duplicate = check_duplicate(
        file_hash,
        invoice_fingerprint
    )

    result["duplicate"] = duplicate

    # ==================================================
    # OCR TEXT
    # ==================================================
    #
    # Kept for development/demo debugging.
    # We can remove it from the production response
    # after backend integration.
    # ==================================================

    result["ocrText"] = text

    # ==================================================
    # RETURN JSON
    # ==================================================

    return result


# ======================================================
# DEBUG ENDPOINT
# ======================================================

@app.get("/duplicate-status")
def duplicate_status():
    """
    Show how many invoice fingerprints/files have
    been processed during the current server session.
    """

    return {
        "processedFiles": len(
            processed_invoice_hashes
        ),
        "processedInvoices": len(
            processed_invoice_fingerprints
        )
    }