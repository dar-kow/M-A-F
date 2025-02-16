import React from "react";
import Modal from "react-modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Potwierdzenie"
      className="react-modal-content"
      overlayClassName="react-modal-overlay"
      ariaHideApp={false}
    >
      {/* Modal Title */}
      <h2 data-testid="confirmation_title">{title}</h2>

      {/* Modal Message */}
      <p data-testid="confirmation_message">{message}</p>

      {/* Modal Buttons */}
      <div className="modal-buttons">
        <button
          className="modal-button cancel"
          onClick={onRequestClose}
          data-testid="cancel_button"
        >
          Anuluj
        </button>
        <button
          className="modal-button"
          onClick={onConfirm}
          data-testid="confirm_button"
        >
          Zatwierdź
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
