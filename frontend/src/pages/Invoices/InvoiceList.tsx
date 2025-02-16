import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VscAdd, VscFile } from "react-icons/vsc";
import { Invoice, PaymentStatus } from "../../types/types";
import "../../styles/fancyTables.scss";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SortTable from "../../components/SortTable";
import useFetchData from "../../hooks/useFetchData";
import api from "../../services/api";
import { getPaymentMethodDisplay } from "../../utils/getPaymentMethodDisplay";
import { getPaymentStatusDisplay } from "../../utils/getPaymentStatusDisplay";
import { printInvoicePDF } from "../../utils/pdfUtils";
import InvoicePreviewModal from "../../components/InvoicePreviewModal";
import PaymentModal from "../../components/PaymentModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import InvoiceTableRow from "../../components/InvoiceTableRow";
import CheckboxFilter, {
  Option,
} from "../../components/Filters/CheckboxFilter";
import FilterSelection from "../../components/Filters/FilterSelection";

const InvoiceList: React.FC = () => {
  // Data and modals
  const { invoices, contractors, loading, setInvoices, fetchData } =
    useFetchData();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(
    null,
  );

  // Filter states
  const [selectedContractors, setSelectedContractors] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<PaymentStatus[]>([]);
  const [contractorDropdownOpen, setContractorDropdownOpen] =
    useState<boolean>(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<boolean>(false);

  // Filter selection menu state
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [selectedFilterKeys, setSelectedFilterKeys] = useState<string[]>([]);

  // Define available filters for selection
  const availableFilters = [
    { key: "contractor", label: "Kontrahent" },
    { key: "paymentStatus", label: "Status płatności" },
  ];

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const contractorRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns when klknięto poza elementy
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contractorRef.current &&
        !contractorRef.current.contains(event.target as Node)
      ) {
        setContractorDropdownOpen(false);
      }
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getContractorNameById = (id: number) => {
    const contractor = contractors.find((c) => c.id === id);
    return contractor?.name || "-";
  };

  const getValue = (invoice: Invoice, column: string) => {
    switch (column) {
      case "number":
        return invoice.number;
      case "date":
        return new Date(invoice.date).getTime();
      case "amount":
        return invoice.amount;
      case "paymentStatus":
        return getPaymentStatusDisplay(invoice.paymentStatus);
      case "dueDate":
        return invoice.dueDate ? new Date(invoice.dueDate).getTime() : 0;
      case "contractor":
        return getContractorNameById(invoice.contractorId);
      case "paymentMethod":
        return getPaymentMethodDisplay(invoice.paymentMethod);
      case "remaining":
        return invoice.amount - (invoice.paidAmount || 0);
      default:
        return invoice.number;
    }
  };

  const handlePrint = (invoice: Invoice) => {
    const contractorName = getContractorNameById(invoice.contractorId);
    printInvoicePDF(invoice, contractorName);
  };

  const handleAction = (action: string, invoice: Invoice) => {
    setActiveMenu(null);
    switch (action) {
      case "edit":
        navigate(`/invoices/edit/${invoice.id}`);
        break;
      case "delete":
        setInvoiceToDelete(invoice);
        setConfirmModalOpen(true);
        break;
      case "pay":
        setInvoiceToPay(invoice);
        setPaymentModalOpen(true);
        break;
      case "print":
        handlePrint(invoice);
        break;
      default:
        break;
    }
  };

  const handlePaymentConfirm = async (paymentAmount: number) => {
    if (!invoiceToPay) return;
    try {
      const newPaidAmount = (invoiceToPay.paidAmount || 0) + paymentAmount;
      let newPaymentStatus: PaymentStatus;

      if (newPaidAmount >= invoiceToPay.amount) {
        newPaymentStatus = PaymentStatus.Paid;
      } else if (newPaidAmount > 0) {
        newPaymentStatus = PaymentStatus.PartiallyPaid;
      } else {
        newPaymentStatus = PaymentStatus.Unpaid;
      }

      const updatedInvoiceData = {
        ...invoiceToPay,
        paidAmount: newPaidAmount,
        paymentStatus: newPaymentStatus,
      };

      const response = await api.put(
        `/invoices/${invoiceToPay.id}`,
        updatedInvoiceData,
      );
      const updatedInvoice = response.data;

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === updatedInvoice.id ? updatedInvoice : inv,
        ),
      );
      toast.success("Faktura została opłacona.");
      fetchData();
    } catch (error) {
      console.error("Błąd przy opłacaniu faktury", error);
      toast.error("Nie udało się opłacić faktury.");
    }
    setPaymentModalOpen(false);
    setInvoiceToPay(null);
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    try {
      await api.delete(`/invoices/${invoiceToDelete.id}`);
      toast.success("Faktura została usunięta.");
      setInvoices((prev) =>
        prev.filter((inv) => inv.id !== invoiceToDelete.id),
      );
    } catch (error) {
      console.error("Błąd przy usuwaniu faktury", error);
      toast.error("Nie udało się usunąć faktury.");
    } finally {
      setConfirmModalOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handlePreview = (invoice: Invoice) => {
    setInvoiceToPreview(invoice);
    setPreviewModalOpen(true);
  };

  const handleContractorFilterChange = (contractorId: number) => {
    setSelectedContractors((prev) =>
      prev.includes(contractorId)
        ? prev.filter((id) => id !== contractorId)
        : [...prev, contractorId],
    );
  };

  const handleStatusFilterChange = (status: PaymentStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  // Filtrowanie faktur
  const filteredInvoices = invoices.filter((inv) => {
    const contractorMatch =
      selectedContractors.length === 0 ||
      selectedContractors.includes(inv.contractorId);
    const statusMatch =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(inv.paymentStatus);
    return contractorMatch && statusMatch;
  });

  const paymentStatusOptions: PaymentStatus[] = [
    PaymentStatus.Paid,
    PaymentStatus.PartiallyPaid,
    PaymentStatus.Unpaid,
    PaymentStatus.Overdue,
  ];

  // Przygotowanie opcji dla CheckboxFilter
  const contractorFilterOptions: Option<number>[] = contractors
    .slice(0, 10)
    .map((contractor) => ({
      label: contractor.name,
      value: contractor.id,
    }));

  const statusFilterOptions: Option<PaymentStatus>[] = paymentStatusOptions.map(
    (status) => ({
      label: getPaymentStatusDisplay(status),
      value: status,
    }),
  );

  const handleApplyFilters = (filters: string[]) => {
    setSelectedFilterKeys(filters);
  };

  // Używamy wyodrębnionego komponentu FilterSelection.
  const filterComponent = (
    <FilterSelection
      availableFilters={availableFilters}
      selectedFilterKeys={selectedFilterKeys}
      onApplyFilters={handleApplyFilters}
      showFilterMenu={showFilterMenu}
      setShowFilterMenu={setShowFilterMenu}
    // filterId={uuidv4()}
    >
      {selectedFilterKeys.includes("contractor") && (
        <div ref={contractorRef}>
          <CheckboxFilter<number>
            label="Kontrahent"
            selected={selectedContractors}
            options={contractorFilterOptions}
            onChange={handleContractorFilterChange}
            onClear={() => setSelectedContractors([])}
            isOpen={contractorDropdownOpen}
            toggleOpen={() => setContractorDropdownOpen((prev) => !prev)}
          />
        </div>
      )}
      {selectedFilterKeys.includes("paymentStatus") && (
        <div ref={statusRef}>
          <CheckboxFilter<PaymentStatus>
            label="Status płatności"
            selected={selectedStatuses}
            options={statusFilterOptions}
            onChange={handleStatusFilterChange}
            onClear={() => setSelectedStatuses([])}
            isOpen={statusDropdownOpen}
            toggleOpen={() => setStatusDropdownOpen((prev) => !prev)}
          />
        </div>
      )}
    </FilterSelection>
  );

  const renderRow = (inv: Invoice) => (
    <InvoiceTableRow
      key={inv.id}
      invoice={inv}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      menuRef={menuRef}
      getContractorNameById={getContractorNameById}
      getPaymentStatusDisplay={getPaymentStatusDisplay}
      getPaymentMethodDisplay={getPaymentMethodDisplay}
      onAction={handleAction}
      handlePreview={handlePreview}
      data-testid={`invoice_table_row_${inv.id}`}
    />
  );

  return (
    <div data-testid="invoice_list_page">
      <PageHeader
        title="Lista faktur"
        icon={<VscFile />}
        actionLink="/invoices/new"
        actionIcon={<VscAdd size={24} />}
        actionTooltip="Dodaj nową fakturę"
        filterComponent={filterComponent}
        data-testid="page_header"
      />
      {loading ? (
        <Loader data-testid="loader" />
      ) : (
        <SortTable
          data={filteredInvoices}
          columns={[
            { key: "number", label: "Numer" },
            { key: "contractor", label: "Kontrahent" },
            { key: "amount", label: "Wartość" },
            { key: "date", label: "Data wystawienia" },
            { key: "paymentStatus", label: "Status płatności" },
            { key: "paymentMethod", label: "Metoda płatności" },
            { key: "remaining", label: "Do zapłaty" },
            { key: "dueDate", label: "Termin płatności" },
            { key: "actions", label: "Akcje" },
          ]}
          getValue={getValue}
          renderRow={renderRow}
          data-testid="sort_table"
        />
      )}
      <PaymentModal
        isOpen={paymentModalOpen}
        invoice={invoiceToPay}
        onRequestClose={() => {
          setPaymentModalOpen(false);
          setInvoiceToPay(null);
        }}
        onConfirm={handlePaymentConfirm}
        data-testid="payment_modal"
      />
      <InvoicePreviewModal
        isOpen={previewModalOpen}
        invoice={invoiceToPreview}
        onRequestClose={() => setPreviewModalOpen(false)}
        onEdit={(invoice) => {
          setPreviewModalOpen(false);
          handleAction("edit", invoice);
        }}
        data-testid="invoice_preview_modal"
      />
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onRequestClose={() => {
          setConfirmModalOpen(false);
          setInvoiceToDelete(null);
        }}
        onConfirm={handleDeleteInvoice}
        title="Potwierdzenie usunięcia"
        message={`Czy na pewno chcesz usunąć fakturę ${invoiceToDelete ? invoiceToDelete.number : ""}?`}
        data-testid="confirmation_modal_wrapper"
      />
    </div>
  );
};

export default InvoiceList;
