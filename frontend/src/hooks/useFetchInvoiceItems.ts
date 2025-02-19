import { useEffect, useState } from "react";
import { InvoiceItem } from "../types/types";
import api from "../services/api";

const useFetchInvoiceItems = (invoiceId: number) => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceItems = async () => {
      setLoading(true);
      try {
        const response = await api.getInvoiceItems(invoiceId);
        setInvoiceItems(response.data);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceItems();
  }, [invoiceId]);

  return { invoiceItems, loading, error };
};

export default useFetchInvoiceItems;