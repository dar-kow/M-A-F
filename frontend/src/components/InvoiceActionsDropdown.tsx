import React from "react";
import { Invoice } from "../types/types";
import { VscEdit, VscTrash, VscCheck } from "react-icons/vsc";
import { MdPrint } from "react-icons/md";
import "../styles/main.scss";

interface InvoiceActionsDropdownProps {
  invoice: Invoice;
  onAction: (action: string, invoice: Invoice) => void;
  closeDropdown: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  offsetX: number;
}

const InvoiceActionsDropdown: React.FC<InvoiceActionsDropdownProps> = ({
  invoice,
  onAction,
  closeDropdown,
  menuRef,
  offsetX,
}) => {
  return (
    <nav
      ref={menuRef}
      className="header-nav"
      style={{
        width: "70px",
        top: "5px",
        left: offsetX ? `${offsetX}px` : "0px",
        padding: "4px",
        zIndex: 9999,
      }}
      data-testid="invoice_actions_dropdown"
    >
      {/* Actions List */}
      <ul>
        <li>
          <button
            className="invoice-action-button"
            onClick={() => {
              onAction("edit", invoice);
              closeDropdown();
            }}
            data-testid="action_edit_button"
          >
            <VscEdit size={16} style={{ marginRight: "4px" }} />
            Edytuj
          </button>
        </li>
        <li>
          <button
            className="invoice-action-button"
            onClick={() => {
              onAction("delete", invoice);
              closeDropdown();
            }}
            data-testid="action_delete_button"
          >
            <VscTrash size={16} style={{ marginRight: "4px" }} />
            Usuń
          </button>
        </li>
        <li>
          <button
            className="invoice-action-button"
            onClick={() => {
              onAction("pay", invoice);
              closeDropdown();
            }}
            data-testid="action_pay_button"
          >
            <VscCheck size={16} style={{ marginRight: "4px" }} />
            Opłać
          </button>
        </li>
        <li>
          <button
            className="invoice-action-button"
            onClick={() => {
              onAction("print", invoice);
              closeDropdown();
            }}
            data-testid="action_print_button"
          >
            <MdPrint size={16} style={{ marginRight: "4px" }} />
            Drukuj
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default InvoiceActionsDropdown;
