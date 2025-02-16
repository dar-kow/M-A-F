import { useState, useEffect } from "react";
import api from "../services/api";
import { Invoice, Contractor, PaymentStatus } from "../types/types";
import { toast } from "react-toastify";

const useFetchData = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [invoicesResponse, contractorsResponse] = await Promise.all([
        api.get<Invoice[]>("/invoices"),
        api.get<Contractor[]>("/contractors"),
      ]);

      const updatedInvoices = invoicesResponse.data.map((invoice) => {
        let newPaymentStatus: PaymentStatus;
        if ((invoice.paidAmount ?? 0) >= invoice.amount) {
          newPaymentStatus = PaymentStatus.Paid;
        } else if ((invoice.paidAmount ?? 0) > 0) {
          newPaymentStatus = PaymentStatus.PartiallyPaid;
        } else {
          newPaymentStatus = PaymentStatus.Unpaid;
        }

        return {
          ...invoice,
          paymentStatus: newPaymentStatus,
        };
      });

      setInvoices(updatedInvoices);
      setContractors(contractorsResponse.data);
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Błąd pobierania danych");
      toast.error("Błąd pobierania danych");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { invoices, contractors, loading, error, setInvoices, fetchData };
};

export default useFetchData;
