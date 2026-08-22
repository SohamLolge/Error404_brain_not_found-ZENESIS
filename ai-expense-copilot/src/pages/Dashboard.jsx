function Dashboard() {
  const summaryData = [
    {
      title: 'Total Expenses',
      value: '₹2,45,000',
      description: 'Total processed expenses',
    },
    {
      title: 'Invoices',
      value: '24',
      description: 'Total invoices uploaded',
    },
    {
      title: 'Approved',
      value: '15',
      description: 'Invoices approved',
    },
    {
      title: 'Pending',
      value: '6',
      description: 'Invoices awaiting approval',
    },
  ]

  const recentInvoices = [
    {
      vendor: 'ABC Technologies',
      invoiceNumber: 'INV-1001',
      amount: '₹45,000',
      status: 'Approved',
    },
    {
      vendor: 'XYZ Solutions',
      invoiceNumber: 'INV-1002',
      amount: '₹28,500',
      status: 'Pending',
    },
    {
      vendor: 'Global Supplies',
      invoiceNumber: 'INV-1003',
      amount: '₹12,800',
      status: 'Approved',
    },
    {
      vendor: 'Office Mart',
      invoiceNumber: 'INV-1004',
      amount: '₹8,500',
      status: 'Rejected',
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your invoice and expense activity.</p>
      </div>

      <div className="summary-grid">
        {summaryData.map((item) => (
          <div className="summary-card" key={item.title}>
            <h3>{item.title}</h3>
            <p className="value">{item.value}</p>
            <p className="description">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Recent Invoices</h2>

          <div className="invoice-list">
            {recentInvoices.map((invoice) => (
              <div className="invoice-item" key={invoice.invoiceNumber}>
                <div className="invoice-info">
                  <h4>{invoice.vendor}</h4>
                  <p>{invoice.invoiceNumber}</p>
                </div>

                <div>
                  <p className="invoice-amount">{invoice.amount}</p>

                  <span
                    className={`status-badge status-${invoice.status.toLowerCase()}`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Expense Categories</h2>

          <div className="category-list">
            <div className="category-row">
              <span className="category-name">Office Supplies</span>
              <span className="category-value">₹65,000</span>
            </div>

            <div className="category-row">
              <span className="category-name">Travel</span>
              <span className="category-value">₹48,000</span>
            </div>

            <div className="category-row">
              <span className="category-name">Software</span>
              <span className="category-value">₹72,000</span>
            </div>

            <div className="category-row">
              <span className="category-name">Utilities</span>
              <span className="category-value">₹30,000</span>
            </div>

            <div className="category-row">
              <span className="category-name">Other</span>
              <span className="category-value">₹30,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard