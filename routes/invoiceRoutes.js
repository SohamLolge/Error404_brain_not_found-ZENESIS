const express = require("express");

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
} = require("../controllers/invoiceController");

const router = express.Router();

router.post("/upload-invoice", createInvoice);

router.get("/invoices", getInvoices);

router.get("/invoices/:id", getInvoiceById);

module.exports = router;