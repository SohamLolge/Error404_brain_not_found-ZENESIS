const Invoice = require("../models/Invoice");

const createInvoice = async (req, res) => {
  try {
    const {
      vendor,
      invoiceNumber,
      date,
      amount,
      gst,
      category,
    } = req.body;

    const invoice = await Invoice.create({
      vendor,
      invoiceNumber,
      date,
      amount,
      gst,
      category,
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error.message);

    res.status(500).json({
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error.message);

    res.status(500).json({
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error.message);

    res.status(500).json({
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
};