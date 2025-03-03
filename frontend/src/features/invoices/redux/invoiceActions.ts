import { Invoice } from '../../../types/types';

// Action Types
export const FETCH_INVOICES_REQUEST = 'invoices/FETCH_INVOICES_REQUEST';
export const FETCH_INVOICES_SUCCESS = 'invoices/FETCH_INVOICES_SUCCESS';
export const FETCH_INVOICES_FAILURE = 'invoices/FETCH_INVOICES_FAILURE';

export const FETCH_INVOICE_REQUEST = 'invoices/FETCH_INVOICE_REQUEST';
export const FETCH_INVOICE_SUCCESS = 'invoices/FETCH_INVOICE_SUCCESS';
export const FETCH_INVOICE_FAILURE = 'invoices/FETCH_INVOICE_FAILURE';

export const CREATE_INVOICE_REQUEST = 'invoices/CREATE_INVOICE_REQUEST';
export const CREATE_INVOICE_SUCCESS = 'invoices/CREATE_INVOICE_SUCCESS';
export const CREATE_INVOICE_FAILURE = 'invoices/CREATE_INVOICE_FAILURE';

export const UPDATE_INVOICE_REQUEST = 'invoices/UPDATE_INVOICE_REQUEST';
export const UPDATE_INVOICE_SUCCESS = 'invoices/UPDATE_INVOICE_SUCCESS';
export const UPDATE_INVOICE_FAILURE = 'invoices/UPDATE_INVOICE_FAILURE';

export const DELETE_INVOICE_REQUEST = 'invoices/DELETE_INVOICE_REQUEST';
export const DELETE_INVOICE_SUCCESS = 'invoices/DELETE_INVOICE_SUCCESS';
export const DELETE_INVOICE_FAILURE = 'invoices/DELETE_INVOICE_FAILURE';

export const FETCH_LAST_INVOICE_NUMBER_REQUEST = 'invoices/FETCH_LAST_INVOICE_NUMBER_REQUEST';
export const FETCH_LAST_INVOICE_NUMBER_SUCCESS = 'invoices/FETCH_LAST_INVOICE_NUMBER_SUCCESS';
export const FETCH_LAST_INVOICE_NUMBER_FAILURE = 'invoices/FETCH_LAST_INVOICE_NUMBER_FAILURE';


export const CLEAR_INVOICE = 'invoices/CLEAR_INVOICE';
export const CLEAR_ERRORS = 'invoices/CLEAR_ERRORS';

export const fetchInvoicesRequest = () => ({
    type: FETCH_INVOICES_REQUEST
});

export const fetchInvoicesSuccess = (invoices: Invoice[]) => ({
    type: FETCH_INVOICES_SUCCESS,
    payload: invoices
});

export const fetchInvoicesFailure = (error: string) => ({
    type: FETCH_INVOICES_FAILURE,
    payload: error
});

export const fetchInvoiceRequest = (id: number) => ({
    type: FETCH_INVOICE_REQUEST,
    payload: id
});

export const fetchInvoiceSuccess = (invoice: Invoice) => ({
    type: FETCH_INVOICE_SUCCESS,
    payload: invoice
});

export const fetchInvoiceFailure = (error: string) => ({
    type: FETCH_INVOICE_FAILURE,
    payload: error
});

export const createInvoiceRequest = (invoice: Omit<Invoice, 'id'>) => ({
    type: CREATE_INVOICE_REQUEST,
    payload: invoice
});

export const createInvoiceSuccess = (invoice: Invoice) => ({
    type: CREATE_INVOICE_SUCCESS,
    payload: invoice
});

export const createInvoiceFailure = (error: string) => ({
    type: CREATE_INVOICE_FAILURE,
    payload: error
});

export const updateInvoiceRequest = (invoice: Invoice) => ({
    type: UPDATE_INVOICE_REQUEST,
    payload: invoice
});

export const updateInvoiceSuccess = (invoice: Invoice) => ({
    type: UPDATE_INVOICE_SUCCESS,
    payload: invoice
});

export const updateInvoiceFailure = (error: string) => ({
    type: UPDATE_INVOICE_FAILURE,
    payload: error
});

export const deleteInvoiceRequest = (id: number) => ({
    type: DELETE_INVOICE_REQUEST,
    payload: id
});

export const deleteInvoiceSuccess = (id: number) => ({
    type: DELETE_INVOICE_SUCCESS,
    payload: id
});

export const deleteInvoiceFailure = (error: string) => ({
    type: DELETE_INVOICE_FAILURE,
    payload: error
});

export const fetchLastInvoiceNumberRequest = () => ({
    type: FETCH_LAST_INVOICE_NUMBER_REQUEST
});

export const fetchLastInvoiceNumberSuccess = (lastNumber: string) => ({
    type: FETCH_LAST_INVOICE_NUMBER_SUCCESS,
    payload: lastNumber
});

export const fetchLastInvoiceNumberFailure = (error: string) => ({
    type: FETCH_LAST_INVOICE_NUMBER_FAILURE,
    payload: error
});

export const clearInvoice = () => ({
    type: CLEAR_INVOICE
});

export const clearErrors = () => ({
    type: CLEAR_ERRORS
});