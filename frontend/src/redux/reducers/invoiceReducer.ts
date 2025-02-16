import { Invoice } from "../../types/types";
import {
  FETCH_INVOICES_REQUEST,
  FETCH_INVOICES_SUCCESS,
  FETCH_INVOICES_FAILURE,
  ADD_INVOICE_REQUEST,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAILURE,
  UPDATE_INVOICE_REQUEST,
  UPDATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_FAILURE,
  DELETE_INVOICE_REQUEST,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAILURE,
} from "../actions/invoiceActions";

interface InvoiceState {
  data: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  data: [],
  loading: false,
  error: null,
};

const invoiceReducer = (state = initialState, action: any): InvoiceState => {
  switch (action.type) {
    // Request actions set loading true
    case FETCH_INVOICES_REQUEST:
    case ADD_INVOICE_REQUEST:
    case UPDATE_INVOICE_REQUEST:
    case DELETE_INVOICE_REQUEST:
      return { ...state, loading: true };

    // Successful fetch updates invoice data
    case FETCH_INVOICES_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    // Successful add appends new invoice
    case ADD_INVOICE_SUCCESS:
      return { ...state, loading: false, data: [...state.data, action.payload] };

    // Successful update modifies invoice in list
    case UPDATE_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.map((invoice) =>
          invoice.id === action.payload.id ? action.payload : invoice
        ),
      };

    // Successful delete filters out the removed invoice
    case DELETE_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter((invoice) => invoice.id !== action.payload),
      };

    // Failure actions capture the error
    case FETCH_INVOICES_FAILURE:
    case ADD_INVOICE_FAILURE:
    case UPDATE_INVOICE_FAILURE:
    case DELETE_INVOICE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default invoiceReducer;
