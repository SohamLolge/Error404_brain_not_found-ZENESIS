import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>AI Expense</h2>
        <span>Copilot</span>
      </div>

      <nav className="sidebar-nav">
        <Link to="/">Dashboard</Link>
        <Link to="/invoices">Invoices</Link>
        <Link to="/upload">Upload Invoice</Link>
      </nav>
    </aside>
  )
}

export default Sidebar