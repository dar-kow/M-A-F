import { Invoice } from "../../types/types";

export const FETCH_INVOICES_REQUEST = "FETCH_INVOICES_REQUEST";
export const FETCH_INVOICES_SUCCESS = "FETCH_INVOICES_SUCCESS";
export const FETCH_INVOICES_FAILURE = "FETCH_INVOICES_FAILURE";

export const ADD_INVOICE_REQUEST = "ADD_INVOICE_REQUEST";
export const ADD_INVOICE_SUCCESS = "ADD_INVOICE_SUCCESS";
export const ADD_INVOICE_FAILURE = "ADD_INVOICE_FAILURE";

export const UPDATE_INVOICE_REQUEST = "UPDATE_INVOICE_REQUEST";
export const UPDATE_INVOICE_SUCCESS = "UPDATE_INVOICE_SUCCESS";
export const UPDATE_INVOICE_FAILURE = "UPDATE_INVOICE_FAILURE";

export const DELETE_INVOICE_REQUEST = "DELETE_INVOICE_REQUEST";
export const DELETE_INVOICE_SUCCESS = "DELETE_INVOICE_SUCCESS";
export const DELETE_INVOICE_FAILURE = "DELETE_INVOICE_FAILURE";

// Przykładowe akcje
export const fetchInvoicesRequest = () => ({
  type: FETCH_INVOICES_REQUEST,
});

export const fetchInvoicesSuccess = (invoices: Invoice[]) => ({
  type: FETCH_INVOICES_SUCCESS,
  payload: invoices,
});

export const fetchInvoicesFailure = (error: string) => ({
  type: FETCH_INVOICES_FAILURE,
  payload: error,
});

// Analogicznie możesz utworzyć akcje dla dodawania, aktualizacji i usuwania
