const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },

    approver: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Approved", "Rejected"],
      required: true,
    },

    comment: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Approval", approvalSchema);