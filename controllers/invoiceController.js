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

module.exports = {
  createInvoice,
  getInvoices,
};