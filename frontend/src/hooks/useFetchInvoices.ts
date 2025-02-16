import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { Invoice } from "../types/types";
import { toast } from "react-toastify";

const useFetchInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await api.get<Invoice[]>("/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices", error);
      setError("Błąd pobierania danych faktur");
      toast.error("Błąd pobierania danych faktur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, fetchInvoices };
};

export default useFetchInvoices;
