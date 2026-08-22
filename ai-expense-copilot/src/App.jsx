import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import './App.css'

import Dashboard from './pages/Dashboard'
import UploadInvoice from './pages/UploadInvoice'
import Invoices from './pages/Invoices'
import InvoiceDetails from './pages/InvoiceDetails'

function App() {
  return (
    <BrowserRouter>
  <div className="app-layout">
    <Sidebar />

    <main className="main-content">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/upload" element={<UploadInvoice />} />
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
            </Routes>
    </main>
  </div>
</BrowserRouter>
  )
}

export default App