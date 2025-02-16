import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContractorList from "./pages/Contractors/ContractorList";
import ContractorForm from "./pages/Contractors/ContractorForm";
import InvoiceList from "./pages/Invoices/InvoiceList";
import InvoiceForm from "./pages/Invoices/InvoiceForm";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";

// App component with route configuration and error handling.
const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contractors" element={<ContractorList />} />
          <Route path="/contractors/new" element={<ContractorForm />} />
          <Route path="/contractors/edit/:id" element={<ContractorForm />} />
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
          <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
        </Routes>
        <ToastContainer />
      </ErrorBoundary>
    </Router>
  );
};

export default App;
