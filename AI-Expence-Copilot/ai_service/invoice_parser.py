import re
import json
from datetime import datetime


def clean_number(value):
    """Convert an OCR-extracted number into a float."""

    if not value:
        return None

    value = value.replace(",", "").strip()

    try:
        return float(value)
    except ValueError:
        return None


def extract_invoice_data(text):
    """
    Extract structured invoice information from OCR text.

    Returns:
        vendor
        invoiceNumber
        date
        amount
        gst
        category
        missingFields
    """

    data = {
        "vendor": None,
        "invoiceNumber": None,
        "date": None,
        "amount": None,
        "gst": None,
        "category": None,
        "missingFields": []
    }

    # ==================================================
    # NORMALIZE OCR TEXT
    # ==================================================

    if not text:
        return data

    text = text.replace("\r", "\n")

    # ==================================================
    # INVOICE NUMBER
    # ==================================================

    invoice_patterns = [

        # Examples:
        # Invoice #: (123456)
        # Invoice #: INV-1023
        # Invoice No: INV-1023
        # Invoice Number: ABC123
        # Inv #: 12345

        r"(?:invoice\s*(?:no|number)|invoice\s*#|inv\s*(?:no|number|#))"
        r"\s*[:#\-|]*\s*"
        r"[\(\[]?\s*([A-Z0-9][A-Z0-9\/\-_]*)\s*[\)\]]?"
    ]

    for pattern in invoice_patterns:

        invoice_match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if invoice_match:

            candidate = invoice_match.group(1).strip()

            # Ignore obvious OCR mistakes
            invalid_values = {
                "on",
                "no",
                "number",
                "date",
                "id"
            }

            if (
                len(candidate) >= 3
                and candidate.lower() not in invalid_values
            ):
                data["invoiceNumber"] = candidate
                break

    # ==================================================
    # DATE
    # ==================================================

    date_patterns = [

        # Invoice Date: 20/08/2026
        # Date: 20-08-2026

        r"(?:invoice\s*date|date)"
        r"\s*[:\-]?\s*"
        r"(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})",

        # Fallback:
        # 20/08/2026
        # 20-08-2026

        r"\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b"
    ]

    raw_date = None

    for pattern in date_patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:
            raw_date = match.group(1)
            break

    if raw_date:

        date_formats = [
            "%d/%m/%Y",
            "%d-%m-%Y",
            "%m/%d/%Y",
            "%m-%d-%Y",
            "%d/%m/%y",
            "%d-%m-%y"
        ]

        for fmt in date_formats:

            try:

                parsed_date = datetime.strptime(
                    raw_date,
                    fmt
                )

                data["date"] = parsed_date.strftime(
                    "%Y-%m-%d"
                )

                break

            except ValueError:
                continue

    # ==================================================
    # GST
    # ==================================================

    gst_values = []

    # Handles:
    #
    # GST: 4410
    # GST 4410
    # CGST: 2205
    # SGST: 2205
    # IGST: 4410

    gst_matches = re.findall(

        r"\b(?:GST|IGST|CGST|SGST)"
        r"\s*[:\-]?\s*"
        r"(?:₹|Rs\.?|INR)?"
        r"\s*"
        r"(\d+(?:,\d{3})*(?:\.\d+)?)",

        text,

        re.IGNORECASE
    )

    for value in gst_matches:

        number = clean_number(value)

        if number is not None:
            gst_values.append(number)

    if gst_values:

        data["gst"] = sum(gst_values)

    # ==================================================
    # TOTAL AMOUNT
    # ==================================================

    amount_patterns = [

        # Grand Total
        r"(?:grand\s*total)"
        r"\s*[:\-]?\s*"
        r"(?:₹|Rs\.?|INR)?"
        r"\s*"
        r"(\d+(?:,\d{3})*(?:\.\d+)?)",

        # Total Amount
        r"(?:total\s*amount)"
        r"\s*[:\-]?\s*"
        r"(?:₹|Rs\.?|INR)?"
        r"\s*"
        r"(\d+(?:,\d{3})*(?:\.\d+)?)",

        # Amount Payable
        r"(?:amount\s*payable)"
        r"\s*[:\-]?\s*"
        r"(?:₹|Rs\.?|INR)?"
        r"\s*"
        r"(\d+(?:,\d{3})*(?:\.\d+)?)",

        # Net Amount
        r"(?:net\s*amount)"
        r"\s*[:\-]?\s*"
        r"(?:₹|Rs\.?|INR)?"
        r"\s*"
        r"(\d+(?:,\d{3})*(?:\.\d+)?)",

        # Total
        r"(?:total)"
        r"\s*[:\-]?\s*"
        r"(?:₹|Rs\.?|INR)?"
        r"\s*"
        r"(\d+(?:,\d{3})*(?:\.\d+)?)"
    ]

    for pattern in amount_patterns:

        amount_match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if amount_match:

            amount = clean_number(
                amount_match.group(1)
            )

            if amount is not None:

                data["amount"] = amount

                break

    # ==================================================
    # VENDOR
    # ==================================================

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    ignored_vendor_lines = {
        "invoice",
        "tax invoice",
        "tax invoice.",
        "bill",
        "receipt",
        "invoice receipt",
        "quotation",
        "estimate"
    }

    for line in lines[:10]:

        normalized = re.sub(
            r"[^a-zA-Z ]",
            "",
            line
        ).strip().lower()

        # Skip common invoice headings

        if normalized in ignored_vendor_lines:
            continue

        # Skip invoice-number lines

        if re.search(
            r"invoice\s*(no|number|#)",
            line,
            re.IGNORECASE
        ):
            continue

        # Skip date lines

        if re.search(
            r"\bdate\b",
            line,
            re.IGNORECASE
        ):
            continue

        # Skip obvious placeholder lines

        if "[" in line and "]" in line:
            continue

        # Skip phone/address lines

        if re.search(
            r"\b(phone|fax|website|email|address)\b",
            line,
            re.IGNORECASE
        ):
            continue

        data["vendor"] = line

        break

    # ==================================================
    # CATEGORY
    # ==================================================

    lower_text = text.lower()

    category_rules = {

        "Office Supplies": [
            "stationery",
            "office supplies",
            "printer",
            "paper",
            "pen",
            "notebook",
            "desk",
            "office"
        ],

        "Software": [
            "software",
            "subscription",
            "saas",
            "hosting",
            "license",
            "cloud",
            "application"
        ],

        "Travel": [
            "travel",
            "hotel",
            "flight",
            "uber",
            "taxi",
            "cab",
            "airline"
        ],

        "Food": [
            "food",
            "restaurant",
            "catering",
            "lunch",
            "dinner",
            "meal"
        ]
    }

    for category, keywords in category_rules.items():

        if any(
            keyword in lower_text
            for keyword in keywords
        ):

            data["category"] = category

            break

    # ==================================================
    # MISSING FIELDS
    # ==================================================

    required_fields = [
        "vendor",
        "invoiceNumber",
        "date",
        "amount"
    ]

    for field in required_fields:

        if data[field] is None:

            data["missingFields"].append(
                field
            )

    return data


# ======================================================
# TEST
# ======================================================

if __name__ == "__main__":

    import pytesseract
    from PIL import Image

    # --------------------------------------------------
    # TESSERACT LOCATION
    # --------------------------------------------------

    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

    # --------------------------------------------------
    # INVOICE IMAGE
    # --------------------------------------------------

    image_path = (
    r"C:\Users\atharv gorule\Downloads\invoice.png"
)
    # IMPORTANT:
    # If your Windows username is "atharv gorule"
    # instead of "atharav gorule", change the path above.

    # --------------------------------------------------
    # OCR
    # --------------------------------------------------

    image = Image.open(image_path)

    text = pytesseract.image_to_string(
        image
    )

    print("\n----- OCR OUTPUT -----")

    print(text)

    print("----------------------")

    # --------------------------------------------------
    # EXTRACTION
    # --------------------------------------------------

    result = extract_invoice_data(
        text
    )

    # --------------------------------------------------
    # JSON
    # --------------------------------------------------

    print("\n----- STRUCTURED JSON -----")

    print(
        json.dumps(
            result,
            indent=4
        )
    )

    print("---------------------------")