import { useParams, Link } from "react-router-dom";

function InvoiceDetails() {
  const { id } = useParams();

  const invoices = {
    "INV-1001": {
      invoiceNumber: "INV-1001",
      vendor: "ABC Technologies",
      date: "22 Aug 2026",
      amount: "₹45,000",
      status: "Approved",
      category: "Software",
      tax: "₹8,100",
      subtotal: "₹36,900",
    },

    "INV-1002": {
      invoiceNumber: "INV-1002",
      vendor: "XYZ Solutions",
      date: "21 Aug 2026",
      amount: "₹28,500",
      status: "Pending",
      category: "Travel",
      tax: "₹5,130",
      subtotal: "₹23,370",
    },

    "INV-1003": {
      invoiceNumber: "INV-1003",
      vendor: "Global Supplies",
      date: "20 Aug 2026",
      amount: "₹12,800",
      status: "Approved",
      category: "Office Supplies",
      tax: "₹2,304",
      subtotal: "₹10,496",
    },

    "INV-1004": {
      invoiceNumber: "INV-1004",
      vendor: "Office Mart",
      date: "19 Aug 2026",
      amount: "₹8,500",
      status: "Rejected",
      category: "Office Supplies",
      tax: "₹1,530",
      subtotal: "₹6,970",
    },

    "INV-1005": {
      invoiceNumber: "INV-1005",
      vendor: "Tech Solutions",
      date: "18 Aug 2026",
      amount: "₹35,200",
      status: "Pending",
      category: "Software",
      tax: "₹6,336",
      subtotal: "₹28,864",
    },
  };

  const invoice = invoices[id] || invoices["INV-1001"];

  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "status-approved";
    }

    if (status === "Pending") {
      return "status-pending";
    }

    if (status === "Rejected") {
      return "status-rejected";
    }

    return "";
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Invoice Details</h1>
          <p>
            View invoice information, validation, and approval status.
          </p>
        </div>

        <Link to="/invoices" className="back-button">
          ← Back to Invoices
        </Link>
      </div>

      <div className="invoice-details-grid">

        <section className="details-card">
          <div className="card-header">
            <div>
              <h2>Invoice Information</h2>
              <p>Basic invoice details</p>
            </div>

            <span
              className={`status-badge ${getStatusClass(invoice.status)}`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="details-list">

            <div className="detail-row">
              <span>Invoice Number</span>
              <strong>{invoice.invoiceNumber}</strong>
            </div>

            <div className="detail-row">
              <span>Vendor</span>
              <strong>{invoice.vendor}</strong>
            </div>

            <div className="detail-row">
              <span>Invoice Date</span>
              <strong>{invoice.date}</strong>
            </div>

            <div className="detail-row">
              <span>Category</span>
              <strong>{invoice.category}</strong>
            </div>

            <div className="detail-row total-row">
              <span>Total Amount</span>
              <strong>{invoice.amount}</strong>
            </div>

          </div>
        </section>


        <section className="details-card">

          <div className="card-header">
            <div>
              <h2>Amount Breakdown</h2>
              <p>Invoice amount details</p>
            </div>
          </div>

          <div className="details-list">

            <div className="detail-row">
              <span>Subtotal</span>
              <strong>{invoice.subtotal}</strong>
            </div>

            <div className="detail-row">
              <span>Tax</span>
              <strong>{invoice.tax}</strong>
            </div>

            <div className="detail-row total-row">
              <span>Total</span>
              <strong>{invoice.amount}</strong>
            </div>

          </div>
        </section>


        <section className="details-card">

          <div className="card-header">
            <div>
              <h2>Validation</h2>
              <p>Automated invoice checks</p>
            </div>

            <span className="validation-passed">
              ✓ Passed
            </span>
          </div>

          <div className="validation-list">

            <div className="validation-item">
              <span>✓</span>

              <div>
                <strong>Vendor information</strong>
                <p>
                  Vendor details verified successfully.
                </p>
              </div>
            </div>


            <div className="validation-item">
              <span>✓</span>

              <div>
                <strong>Invoice number</strong>
                <p>
                  Invoice number is valid.
                </p>
              </div>
            </div>


            <div className="validation-item">
              <span>✓</span>

              <div>
                <strong>Amount</strong>
                <p>
                  Invoice amount has been validated.
                </p>
              </div>
            </div>


            <div className="validation-item">
              <span>✓</span>

              <div>
                <strong>Duplicate check</strong>
                <p>
                  No duplicate invoice was detected.
                </p>
              </div>
            </div>

          </div>
        </section>


        <section className="details-card">

          <div className="card-header">
            <div>
              <h2>Approval</h2>
              <p>Invoice approval status</p>
            </div>
          </div>


          <div className="approval-box">

            <div
              className={`large-status ${getStatusClass(invoice.status)}`}
            >
              {invoice.status}
            </div>


            {invoice.status === "Approved" && (
              <p>
                This invoice has been reviewed and approved.
              </p>
            )}


            {invoice.status === "Pending" && (
              <p>
                This invoice is waiting for approval.
              </p>
            )}


            {invoice.status === "Rejected" && (
              <p>
                This invoice has been rejected and requires review.
              </p>
            )}

          </div>


          <div className="approval-actions">

            {invoice.status === "Pending" && (
              <>
                <button className="approve-button">
                  ✓ Approve Invoice
                </button>

                <button className="reject-button">
                  ✕ Reject Invoice
                </button>
              </>
            )}


            <Link
              to="/invoices"
              className="secondary-button"
            >
              View All Invoices
            </Link>

          </div>

        </section>

      </div>
    </div>
  );
}

export default InvoiceDetails;