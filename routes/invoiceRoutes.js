const express = require("express");

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  getDashboard,
} = require("../controllers/invoiceController");

const router = express.Router();

router.post("/upload-invoice", createInvoice);

router.get("/invoices", getInvoices);

router.get("/invoices/:id", getInvoiceById);

router.patch("/invoices/:id/status", updateInvoiceStatus);

router.get("/dashboard", getDashboard);

module.exports = router;