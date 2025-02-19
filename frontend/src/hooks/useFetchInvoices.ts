import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoicesRequest } from "../redux/actions/invoiceActions";
import { RootState } from "../redux/store";

const useFetchInvoicesRedux = () => {
  const dispatch = useDispatch();
  const invoices = useSelector((state: RootState) => state.invoices.data);
  const loading = useSelector((state: RootState) => state.invoices.loading);
  const error = useSelector((state: RootState) => state.invoices.error);

  useEffect(() => {
    dispatch(fetchInvoicesRequest());
  }, [dispatch]);

  return { invoices, loading, error };
};

export default useFetchInvoicesRedux;