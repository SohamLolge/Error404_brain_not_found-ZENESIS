import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import UploadInvoice from './pages/UploadInvoice'
import Invoices from './pages/Invoices'
import InvoiceDetails from './pages/InvoiceDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/upload" element={<UploadInvoice />} />
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App