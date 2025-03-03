import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { fetchInvoicesRequest } from '../redux/invoiceActions';

export default function useFetchInvoices() {
    const dispatch = useDispatch();
    const invoices = useSelector((state: RootState) => state.invoices.data);
    const loading = useSelector((state: RootState) => state.invoices.loading);
    const error = useSelector((state: RootState) => state.invoices.error);

    useEffect(() => {
        dispatch(fetchInvoicesRequest());
    }, [dispatch]);

    return { invoices, loading, error };
}