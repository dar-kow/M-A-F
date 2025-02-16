import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/InvoiceForm.scss";
import {
  Invoice,
  InvoiceItem,
  PaymentMethod,
  PaymentStatus,
  Unit,
  VatRate,
} from "../../types/types";
import PageHeader from "../../components/PageHeader";
import { VscFile } from "react-icons/vsc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFetchInvoices from "../../hooks/useFetchInvoices";
import useFetchContractors from "../../hooks/useFetchContractors";
import InvoiceItems from "../../components/InvoiceItems";
import Summary from "../../components/Summary";
import { convertNumberToWords } from "../../utils/convertNumberToWords";

const InvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, loading: invoicesLoading, fetchInvoices } = useFetchInvoices();
  const { contractors, loading: contractorsLoading } = useFetchContractors();

  // Extended invoice state with items, amount in words and remarks
  const [invoice, setInvoice] = useState<Omit<Invoice, "createdAt">>({
    id: 0,
    number: "",
    date: new Date(),
    amount: 0,
    paymentStatus: PaymentStatus.Unpaid,
    dueDate: new Date(),
    paidAmount: 0,
    contractorId: 0,
    paymentMethod: PaymentMethod.Cash,
    invoiceItems: [
      {
        lineNumber: 1,
        description: "",
        quantity: 0,
        unit: "szt",
        vatRate: 23,
        netPrice: 0,
        invoiceId: 0,
      },
    ],
  });
  const [amountInWords, setAmountInWords] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const isEditing = Boolean(id);

  // Calculate summary of invoice items: net, VAT and gross totals
  const calculateSummary = useCallback(() => {
    const totalNet =
      invoice.invoiceItems?.reduce((sum, item) => sum + item.netPrice * item.quantity, 0) || 0;
    const totalVat =
      invoice.invoiceItems?.reduce(
        (sum, item) => sum + item.netPrice * item.quantity * (item.vatRate / 100),
        0,
      ) || 0;
    const totalGross = totalNet + totalVat;
    return { totalNet, totalVat, totalGross };
  }, [invoice.invoiceItems]);

  useEffect(() => {
    // Update amount in words whenever summary changes
    const { totalGross } = calculateSummary();
    setAmountInWords(convertNumberToWords(totalGross));
  }, [invoice.invoiceItems, invoice.paidAmount, calculateSummary]);

  useEffect(() => {
    if (isEditing) {
      const fetchInvoice = async () => {
        try {
          const response = await api.get<Invoice>(`/invoices/${id}`);
          setInvoice(response.data);
        } catch (error) {
          console.error("Error fetching invoice", error);
          toast.error("Błąd pobierania danych faktury");
        }
      };
      fetchInvoice();
    } else {
      fetchInvoices();
    }
  }, [id, isEditing, fetchInvoices]);

  useEffect(() => {
    if (!isEditing && invoices.length > 0) {
      const generateNextInvoiceNumber = () => {
        if (invoices.length === 0) {
          return "1/2025";
        }
        const lastInvoiceNumber = invoices.reduce((prev, current) => {
          const prevNum = parseInt(prev.number.split("/")[0]);
          const currentNum = parseInt(current.number.split("/")[0]);
          return prevNum > currentNum ? prev : current;
        }).number;
        const lastNumber = parseInt(lastInvoiceNumber.split("/")[0]);
        const nextNumber = lastNumber + 1;
        return `${nextNumber}/2025`;
      };

      if (!invoice.number) {
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          number: generateNextInvoiceNumber(),
        }));
      }
    }
  }, [isEditing, invoices, invoice.number]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === "paidAmount") {
        let parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
          parsedValue = 0;
        }
        const { totalGross } = calculateSummary();
        if (parsedValue > totalGross) {
          parsedValue = totalGross;
        }
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          paidAmount: parsedValue,
        }));
      } else if (name === "contractorId") {
        setInvoice({ ...invoice, [name]: parseInt(value) });
      } else if (name === "paymentMethod") {
        const newInvoice = {
          ...invoice,
          paymentMethod: value as PaymentMethod,
        };
        if (value !== PaymentMethod.Transfer) {
          newInvoice.dueDate = new Date();
        }
        setInvoice(newInvoice);
      } else {
        setInvoice({ ...invoice, [name]: value });
      }
    },
    [invoice, calculateSummary],
  );

  const handleDateChange = (date: Date | null, name: string) => {
    if (date) {
      setInvoice({ ...invoice, [name]: date });
    }
  };

  // Handle change for an invoice item field
  const handleInvoiceItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.invoiceItems?.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [field]:
            field === "quantity" || field === "netPrice"
              ? parseFloat(value)
              : field === "vatRate"
                ? (parseInt(value) as VatRate)
                : value,
        };
      }
      return item;
    });
    setInvoice({ ...invoice, invoiceItems: updatedItems });
  };

  // Add a new invoice item
  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      lineNumber: (invoice.invoiceItems?.length || 0) + 1,
      description: "",
      quantity: 0,
      unit: Unit.szt,
      vatRate: VatRate.TwentyThree,
      netPrice: 0,
      invoiceId: invoice.id || 0,
    };
    setInvoice({
      ...invoice,
      invoiceItems: [...(invoice.invoiceItems || []), newItem],
    });
  };

  // Remove an invoice item
  const removeInvoiceItem = (index: number) => {
    const updatedItems = invoice.invoiceItems
      ?.filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, lineNumber: idx + 1 }));
    setInvoice({ ...invoice, invoiceItems: updatedItems });
  };

  const { totalNet, totalVat, totalGross } = calculateSummary();
  const remaining = totalGross - (invoice.paidAmount ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice.number.trim() || !invoice.date || !invoice.contractorId) {
      alert("Wszystkie pola są wymagane!");
      return;
    }
    try {
      const payload = {
        ...invoice,
        invoiceItems: invoice.invoiceItems,
        amountInWords,
        remarks,
        createdAt: invoice.date,
        amount: remaining,
      };
      if (isEditing) {
        await api.put(`/invoices/${id}`, payload);
        toast.success("Edycja faktury zakończona pomyślnie");
      } else {
        const { id, ...newInvoice } = payload;
        await api.post("/invoices", newInvoice);
        toast.success("Faktura dodana pomyślnie");
      }
      navigate("/invoices");
    } catch (error) {
      console.error("Error saving invoice", error);
      toast.error(
        isEditing ? "Edycja faktury nieudana" : "Dodanie faktury nie powiodło się",
      );
    }
  };

  if (invoicesLoading || contractorsLoading) {
    return <div data-testid="loading_indicator">Loading...</div>;
  }

  return (
    <>
      <PageHeader
        title={isEditing ? "Edytuj fakturę" : "Dodaj fakturę"}
        icon={<VscFile data-testid="page_icon" />}
      />
      <div className="invoice-form-container">
        <form onSubmit={handleSubmit} className="invoice-form" data-testid="invoice_form">
          {/* Row 1: Invoice number and issue date */}
          <div className="form-row">
            <div className="form-group half">
              <label data-testid="invoice_number_label">Numer faktury:</label>
              <input
                type="text"
                name="number"
                value={invoice.number}
                onChange={handleChange}
                required
                placeholder="Numer faktury"
                title="Pole Numer faktury jest wymagane."
                data-testid="invoice_number_input"
              />
            </div>
            <div className="form-group half">
              <label data-testid="invoice_date_label">Data wystawienia:</label>
              <DatePicker
                selected={invoice.date}
                onChange={(date: Date | null) => handleDateChange(date, "date")}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                placeholderText="Wybierz datę"
                minDate={new Date()}
                data-testid="invoice_date_picker"
              />
            </div>
          </div>

          {/* Row 2: Contractor */}
          <div className="form-row">
            <div className="form-group full">
              <label data-testid="invoice_contractor_label">Kontrahent:</label>
              <select
                name="contractorId"
                value={invoice.contractorId}
                onChange={handleChange}
                required
                title="Wybierz kontrahenta"
                data-testid="invoice_contractor_select"
              >
                <option value="">Wybierz kontrahenta</option>
                {// ...existing code...
                  contractors.map((contractor) => (
                    <option key={contractor.id} value={contractor.id}>
                      {contractor.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Row 3: Payment due date and Payment method */}
          <div className="form-row">
            <div className="form-group half">
              <label data-testid="invoice_due_date_label">Termin płatności:</label>
              <DatePicker
                selected={invoice.dueDate}
                onChange={(date: Date | null) => handleDateChange(date, "dueDate")}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                placeholderText="Wybierz datę"
                disabled={invoice.paymentMethod !== PaymentMethod.Transfer}
                minDate={invoice.date}
                data-testid="invoice_due_date_picker"
              />
            </div>
            <div className="form-group half">
              <label data-testid="invoice_payment_method_label">Metoda płatności:</label>
              <select
                name="paymentMethod"
                value={invoice.paymentMethod}
                onChange={handleChange}
                required
                title="Wybierz metodę płatności"
                data-testid="invoice_payment_method_select"
              >
                <option value="" disabled>
                  Wybierz metodę płatności
                </option>
                <option value={PaymentMethod.Cash}>Gotówka</option>
                <option value={PaymentMethod.Transfer}>Przelew</option>
                <option value={PaymentMethod.Card}>Karta</option>
                <option value={PaymentMethod.Other}>Inne</option>
              </select>
            </div>
          </div>

          {/* Invoice items component */}
          <InvoiceItems
            items={invoice.invoiceItems || []}
            onItemChange={handleInvoiceItemChange}
            addItem={addInvoiceItem}
            removeItem={removeInvoiceItem}
            isEditing={isEditing}
          />

          {/* Summary section */}
          <Summary
            totalNet={totalNet}
            totalVat={totalVat}
            totalGross={totalGross}
            paidAmount={invoice.paidAmount ?? 0}
            remaining={remaining}
            remarks={remarks}
            setRemarks={setRemarks}
            handleChange={handleChange}
          />

          <button
            type="submit"
            className={`submit-button ${isEditing ? "update-button" : "add-button"}`}
            data-testid="invoice_submit_button"
          >
            {isEditing ? "Aktualizuj" : "Dodaj"}
          </button>
        </form>
      </div>
    </>
  );
};

export default InvoiceForm;
