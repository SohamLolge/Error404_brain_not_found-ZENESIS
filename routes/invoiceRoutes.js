const express = require("express");
const { createInvoice } = require("../controllers/invoiceController");

const router = express.Router();

router.post("/upload-invoice", createInvoice);

module.exports = router;