from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
import pytesseract
import io

from invoice_parser import extract_invoice_data


# ======================================================
# FASTAPI APP
# ======================================================

app = FastAPI(
    title="AI Expense Copilot - Invoice AI Service",
    description="OCR and intelligent invoice processing service",
    version="1.0.0"
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
        "service": "AI Expense Copilot - Invoice AI",
        "status": "running"
    }


# ======================================================
# PROCESS INVOICE
# ======================================================

@app.post("/process-invoice")
async def process_invoice(
    file: UploadFile = File(...)
):
    """
    Receive an invoice image and return
    structured invoice information.
    """

    # --------------------------------------------------
    # Validate file type
    # --------------------------------------------------

    allowed_types = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PNG, JPG, JPEG and WEBP images are supported."
        )

    # --------------------------------------------------
    # Read uploaded file
    # --------------------------------------------------

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # --------------------------------------------------
    # Convert bytes to image
    # --------------------------------------------------

    try:

        image = Image.open(
            io.BytesIO(contents)
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image."
        )

    # --------------------------------------------------
    # OCR
    # --------------------------------------------------

    try:

        text = pytesseract.image_to_string(
            image
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(error)}"
        )

    # --------------------------------------------------
    # Extract invoice data
    # --------------------------------------------------

    result = extract_invoice_data(
        text
    )

    # --------------------------------------------------
    # Add OCR text for debugging
    # --------------------------------------------------

    result["ocrText"] = text

    # --------------------------------------------------
    # Return structured response
    # --------------------------------------------------

    return result