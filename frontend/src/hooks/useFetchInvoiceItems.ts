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
        const response = await api.get<InvoiceItem[]>(
          `/InvoiceItems?invoiceId=${invoiceId}`,
        ); // Zaktualizuj URL
        setInvoiceItems(response.data);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceItems();
  }, [invoiceId]);

  return { invoiceItems, loading, error };
};

export default useFetchInvoiceItems;
