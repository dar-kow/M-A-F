import React from "react";
import { Invoice, PaymentMethod, PaymentStatus } from "../types/types";
import TruncatedCell from "./TruncatedCell";
import { formatMoney } from "../utils/formatMoney";
import { VscFile, VscEllipsis } from "react-icons/vsc";
import InvoiceActionsDropdown from "./InvoiceActionsDropdown";
import "../styles/fancyTables.scss";

interface InvoiceTableRowProps {
  invoice: Invoice;
  activeMenu: number | null;
  setActiveMenu: (id: number | null) => void;
  menuRef: React.RefObject<HTMLDivElement | null>; // Allowing null here
  getContractorNameById: (id: number) => string;
  getPaymentStatusDisplay: (status: PaymentStatus) => string;
  getPaymentMethodDisplay: (method: PaymentMethod) => string;
  onAction: (action: string, invoice: Invoice) => void;
  handlePreview: (invoice: Invoice) => void;
}

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({
  invoice,
  activeMenu,
  setActiveMenu,
  menuRef,
  getContractorNameById,
  getPaymentStatusDisplay,
  getPaymentMethodDisplay,
  onAction,
  handlePreview,
}) => {
  const remaining = invoice.amount - (invoice.paidAmount || 0);

  return (
    <tr key={invoice.id} data-testid={`invoice_table_row_${invoice.id}`}>
      <TruncatedCell text={invoice.number} className="tooltip-cell name-column">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span>{invoice.number}</span>
          {/* Invoice preview icon */}
          <VscFile
            size={16}
            style={{ cursor: "pointer" }}
            title="Podgląd faktury"
            onClick={() => handlePreview(invoice)}
            data-testid={`invoice_preview_icon_${invoice.id}`}
          />
        </div>
      </TruncatedCell>
      <TruncatedCell
        text={getContractorNameById(invoice.contractorId)}
        className="tooltip-cell name-column"
      />
      <TruncatedCell
        text={formatMoney(invoice.amount)}
        className="tooltip-cell taxId-column"
      />
      <TruncatedCell
        text={new Date(invoice.date).toLocaleString()}
        className="tooltip-cell date-column"
      />
      <TruncatedCell
        text={getPaymentStatusDisplay(invoice.paymentStatus)}
        className="tooltip-cell name-column"
      />
      <TruncatedCell
        text={getPaymentMethodDisplay(invoice.paymentMethod)}
        className="tooltip-cell name-column"
      />
      <TruncatedCell
        text={formatMoney(remaining)}
        className="tooltip-cell taxId-column"
      />
      <TruncatedCell
        text={
          invoice.dueDate ? new Date(invoice.dueDate).toLocaleString() : "-"
        }
        className="tooltip-cell date-column"
      />
      <td style={{ position: "relative" }} className="actions-column">
        <button
          className="ellipsis-button"
          onClick={() =>
            setActiveMenu(activeMenu === invoice.id ? null : invoice.id)
          }
          data-testid={`invoice_ellipsis_button_${invoice.id}`}
        >
          <VscEllipsis size={24} />
        </button>
        {activeMenu === invoice.id && (
          <InvoiceActionsDropdown
            invoice={invoice}
            onAction={onAction}
            closeDropdown={() => setActiveMenu(null)}
            menuRef={menuRef}
            offsetX={20}
          />
        )}
      </td>
    </tr>
  );
};

export default InvoiceTableRow;
