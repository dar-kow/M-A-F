import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { Invoice } from "../types/types";
import { formatMoney } from "../utils/formatMoney";
import "../styles/InvoicePreviewModal.scss";
import useFetchContractors from "../hooks/useFetchContractors";
import { getPaymentMethodDisplay } from "../utils/getPaymentMethodDisplay";
import useFetchInvoiceItems from "../hooks/useFetchInvoiceItems";
import { getVatRateValue } from "../utils/getVatRateValue";

interface InvoicePreviewModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onRequestClose: () => void;
  onEdit: (invoice: Invoice) => void;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  invoice,
  onRequestClose,
  onEdit,
}) => {
  // Determine the modal container
  const modalRoot = document.getElementById("modal-root") || document.body;
  const { contractors, loading: contractorsLoading, error: contractorsError } = useFetchContractors();
  const contractor = contractors.find((c) => c.id === invoice?.contractorId) || null;
  const { invoiceItems, loading, error } = useFetchInvoiceItems(invoice?.id || 0);

  if (!invoice) return null;

  return ReactDOM.createPortal(
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Podgląd faktury"
      className="modal"
      overlayClassName="overlay"
      data-testid="invoice_preview_modal"
    >
      {/* Modal Title */}
      <h2 data-testid="invoice_preview_title">Podgląd faktury</h2>
      <div className="modal-content">
        {/* Invoice Details Section */}
        <div className="form-row" data-testid="invoice_details_row">
          <div className="form-group half">
            <label data-testid="invoice_number_label">Numer faktury:</label>
            <p data-testid="invoice_number_value">{invoice.number}</p>
          </div>
          <div className="form-group half">
            <label data-testid="invoice_date_label">Data wystawienia:</label>
            <p data-testid="invoice_date_value">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="form-row" data-testid="invoice_contractor_row">
          <div className="form-group full">
            <label data-testid="invoice_contractor_label">Kontrahent:</label>
            {contractorsLoading ? (
              <p data-testid="invoice_contractor_loading">Ładowanie kontrahenta...</p>
            ) : contractorsError ? (
              <p data-testid="invoice_contractor_error">Błąd: {contractorsError}</p>
            ) : (
              <p data-testid="invoice_contractor_value">{contractor?.name}</p>
            )}
          </div>
        </div>
        <div className="form-row" data-testid="invoice_payment_details">
          <div className="form-group half">
            <label data-testid="invoice_due_date_label">Termin płatności:</label>
            <p data-testid="invoice_due_date_value">
              {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
            </p>
          </div>
          <div className="form-group half">
            <label data-testid="invoice_payment_method_label">Metoda płatności:</label>
            <p data-testid="invoice_payment_method_value">
              {getPaymentMethodDisplay(invoice.paymentMethod)}
            </p>
          </div>
        </div>
        {/* Invoice Items Section */}
        <h3 data-testid="invoice_items_title">Pozycje faktury:</h3>
        {loading && <p data-testid="invoice_items_loading">Ładowanie...</p>}
        {error && <p data-testid="invoice_items_error">Błąd: {error}</p>}
        {!loading && !error && (
          <table className="invoice-items-table" data-testid="invoice_items_table">
            <thead>
              <tr>
                <th>Lp.</th>
                <th>Nazwa artykułu/usługi</th>
                <th>Ilość</th>
                <th>Jednostka</th>
                <th>Stawka VAT</th>
                <th>Cena netto</th>
                <th>Cena brutto</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems && invoiceItems.length > 0 ? (
                invoiceItems.map((item, index) => {
                  const gross = item.quantity * item.netPrice * (1 + getVatRateValue(item.vatRate) / 100);
                  return (
                    <tr key={item.id} data-testid={`invoice_item_row_${item.id}`}>
                      <td>{index + 1}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{getVatRateValue(item.vatRate)}%</td>
                      <td>{formatMoney(item.netPrice)}</td>
                      <td>{formatMoney(gross)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr data-testid="invoice_items_empty">
                  <td colSpan={7}>Brak pozycji faktury</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {/* Invoice Summary Section */}
        <div className="summary" data-testid="invoice_summary_section">
          <p>
            <strong>Wartość netto:</strong> {formatMoney(invoice.amount)}
          </p>
          <p>
            <strong>Wartość VAT:</strong> {formatMoney(0)}
          </p>
          <p>
            <strong>Wartość brutto:</strong> {formatMoney(invoice.amount)}
          </p>
        </div>
      </div>
      {/* Modal Action Buttons */}
      <div className="modal-actions" data-testid="invoice_preview_actions">
        <button onClick={() => onEdit(invoice)} data-testid="invoice_preview_edit_button">
          Edytuj
        </button>
        <button onClick={onRequestClose} data-testid="invoice_preview_close_button">
          Zamknij
        </button>
      </div>
    </Modal>,
    modalRoot,
  );
};

export default InvoicePreviewModal;
