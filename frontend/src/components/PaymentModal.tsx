import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Modal from "react-modal";
import TruncatedCell from "./TruncatedCell";
import { Invoice } from "../types/types";
import { formatMoney } from "../utils/formatMoney";
import "../styles/ModalStyles.scss";

Modal.setAppElement("#root");

interface PaymentModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onRequestClose: () => void;
  onConfirm: (paymentAmount: number) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  invoice,
  onRequestClose,
  onConfirm,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Clear state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentAmount("");
      setError("");
    }
  }, [isOpen]);

  // Pre-fill with remaining amount when modal opens
  useEffect(() => {
    if (isOpen && invoice) {
      const alreadyPaid = invoice.paidAmount || 0;
      const remaining = invoice.amount - alreadyPaid;
      setPaymentAmount(remaining.toString());
    }
  }, [isOpen, invoice]);

  if (!isOpen || !invoice) {
    return null;
  }

  const alreadyPaid = invoice.paidAmount || 0;
  const remaining = invoice.amount - alreadyPaid;

  const handleBlur = () => {
    const amount = Number(paymentAmount);
    if (paymentAmount && !isNaN(amount) && amount > remaining) {
      setError("Kwota opłaty nie może przekraczać pozostałej kwoty do zapłaty!");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(paymentAmount);

    if (!paymentAmount || isNaN(amount) || amount <= 0) {
      setError("Podaj prawidłową kwotę opłaty!");
      return;
    }
    if (amount > remaining) {
      setError("Kwota opłaty nie może przekraczać pozostałej kwoty do zapłaty!");
      return;
    }
    setError("");
    onConfirm(amount);
    setPaymentAmount("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Opłać fakturę"
      className="react-modal-content"
      overlayClassName="react-modal-overlay"
      style={{
        overlay: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "static",
          width: "600px",
          maxWidth: "90%",
        },
      }}
      data-testid="payment_modal"
    >
      {/* Modal Title with Invoice Number */}
      <h2
        style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}
        data-testid="payment_modal_title"
      >
        Opłać fakturę
        <span style={{ marginLeft: "10px" }}>
          <TruncatedCell text={invoice.number} className="tooltip-cell" />
        </span>
      </h2>
      {/* Invoice Details */}
      <p data-testid="payment_invoice_amount">Wartość faktury: {formatMoney(invoice.amount)}</p>
      <p data-testid="payment_already_paid">Już opłacono: {formatMoney(alreadyPaid)}</p>
      <p data-testid="payment_remaining">Pozostało do zapłaty: {formatMoney(remaining)}</p>
      <form onSubmit={handleSubmit}>
        <label data-testid="payment_modal_label">
          Kwota opłaty:
          <input
            type="number"
            step="0.01"
            value={paymentAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid="payment_modal_input"
          />
        </label>
        {error && (
          <div style={{ color: "red", marginTop: "5px" }} data-testid="payment_modal_error">
            {error}
          </div>
        )}
        <div className="modal-buttons">
          <button
            type="button"
            className="modal-button cancel"
            onClick={onRequestClose}
            data-testid="payment_modal_cancel_button"
          >
            Anuluj
          </button>
          <button type="submit" className="modal-button" data-testid="payment_modal_confirm_button">
            Potwierdź opłatę
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
