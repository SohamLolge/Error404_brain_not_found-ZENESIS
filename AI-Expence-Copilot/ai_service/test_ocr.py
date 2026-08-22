import pytesseract
from PIL import Image


# ======================================================
# TESSERACT CONFIGURATION
# ======================================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# ======================================================
# IMAGE PATH
# ======================================================

image_path = (
    r"C:\Users\atharv gorule\Downloads\invoice.png"
)


# ======================================================
# OPEN IMAGE
# ======================================================

image = Image.open(
    image_path
)


# ======================================================
# RUN OCR
# ======================================================

text = pytesseract.image_to_string(
    image
)


# ======================================================
# DISPLAY RESULT
# ======================================================

print()
print("================================")
print("        OCR OUTPUT")
print("================================")

print(text)

print("================================")