from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
import pytesseract
import io
import fitz

from invoice_parser import extract_invoice_data


# ======================================================
# FASTAPI APP
# ======================================================

app = FastAPI(
    title="AI Expense Copilot - Invoice AI Service",
    description="OCR and intelligent invoice processing service",
    version="1.1.0"
)


# ======================================================
# TESSERACT CONFIGURATION
# ======================================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


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
# OCR IMAGE
# ======================================================

def ocr_image(image):
    """Run Tesseract OCR on a PIL image."""

    return pytesseract.image_to_string(
        image
    )


# ======================================================
# OCR PDF
# ======================================================

def ocr_pdf(contents):
    """
    Convert each PDF page into an image
    and run OCR on every page.
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

            # Render PDF page at good OCR resolution
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

    contents = await file.read()

    if not contents:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
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
                detail="Uploaded file is not a valid image."
            )

        try:

            text = ocr_image(
                image
            )

        except Exception as error:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"OCR processing failed: {str(error)}"
                )
            )

    # ==================================================
    # EXTRACT STRUCTURED DATA
    # ==================================================

    result = extract_invoice_data(
        text
    )

    # ==================================================
    # OCR TEXT
    # ==================================================

    result["ocrText"] = text

    # ==================================================
    # RETURN RESPONSE
    # ==================================================

    return result