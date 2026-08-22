import { useState } from "react"

function Invoices() {
  const [search, setSearch] = useState("")

  const invoices = [
    {
      id: "INV-1001",
      vendor: "ABC Technologies",
      amount: "₹45,000",
      date: "22 Aug 2026",
      status: "Approved",
    },
    {
      id: "INV-1002",
      vendor: "XYZ Solutions",
      amount: "₹28,500",
      date: "21 Aug 2026",
      status: "Pending",
    },
    {
      id: "INV-1003",
      vendor: "Global Supplies",
      amount: "₹12,800",
      date: "20 Aug 2026",
      status: "Approved",
    },
    {
      id: "INV-1004",
      vendor: "Office Mart",
      amount: "₹8,500",
      date: "19 Aug 2026",
      status: "Rejected",
    },
    {
      id: "INV-1005",
      vendor: "Tech Solutions",
      amount: "₹35,200",
      date: "18 Aug 2026",
      status: "Pending",
    },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = search.toLowerCase()

    return (
      invoice.id.toLowerCase().includes(searchText) ||
      invoice.vendor.toLowerCase().includes(searchText) ||
      invoice.status.toLowerCase().includes(searchText) ||
      invoice.date.toLowerCase().includes(searchText) ||
      invoice.amount.toLowerCase().includes(searchText)
    )
  })

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p>View and manage all your invoices.</p>
        </div>

        <a href="/upload" className="primary-button">
          + Upload Invoice
        </a>
      </div>

      {/* Summary Cards */}
      <div className="invoice-summary">
        <div className="summary-card">
          <span>Total Invoices</span>
          <strong>24</strong>
        </div>

        <div className="summary-card">
          <span>Approved</span>
          <strong>15</strong>
        </div>

        <div className="summary-card">
          <span>Pending</span>
          <strong>6</strong>
        </div>

        <div className="summary-card">
          <span>Rejected</span>
          <strong>3</strong>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="invoice-table-card">
        <div className="table-header">
          <h2>All Invoices</h2>

          <input
            type="text"
            placeholder="Search invoices..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="invoice-table-wrapper">
          <div className="invoice-table">
            {/* Table Header */}
            <div className="table-row table-heading">
              <span>Invoice</span>
              <span>Vendor</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Invoice Rows */}
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div className="table-row" key={invoice.id}>
                  <span className="invoice-id">
                    {invoice.id}
                  </span>

                  <span className="vendor-name">
                    {invoice.vendor}
                  </span>

                  <span>{invoice.date}</span>

                  <span className="amount">
                    {invoice.amount}
                  </span>

                  <span>
                    <span
                      className={`status ${invoice.status.toLowerCase()}`}
                    >
                      {invoice.status}
                    </span>
                  </span>

                  <span>
                    <a
                      href={`/invoices/${invoice.id}`}
                      className="view-button"
                    >
                      View
                    </a>
                  </span>
                </div>
              ))
            ) : (
              <div className="no-results">
                No invoices found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoices