import { Invoice } from '../../../types/types';
import * as actions from './invoiceActions';

interface InvoiceState {
    data: Invoice[];
    currentInvoice: Invoice | null;
    loading: boolean;
    error: string | null;
    actionSuccess: boolean;
    lastInvoiceNumber: string | null;
}

const initialState: InvoiceState = {
    data: [],
    currentInvoice: null,
    loading: false,
    error: null,
    actionSuccess: false,
    lastInvoiceNumber: null,

};

const invoiceReducer = (state = initialState, action: any): InvoiceState => {
    switch (action.type) {
        // FETCH ALL
        case actions.FETCH_INVOICES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.FETCH_INVOICES_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: null
            };
        case actions.FETCH_INVOICES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // FETCH SINGLE
        case actions.FETCH_INVOICE_REQUEST:
            return {
                ...state,
                currentInvoice: null,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.FETCH_INVOICE_SUCCESS:
            return {
                ...state,
                currentInvoice: action.payload,
                loading: false,
                error: null
            };
        case actions.FETCH_INVOICE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // CREATE
        case actions.CREATE_INVOICE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.CREATE_INVOICE_SUCCESS:
            return {
                ...state,
                data: [...state.data, action.payload],
                currentInvoice: action.payload,
                loading: false,
                error: null,
                actionSuccess: true
            };
        case actions.CREATE_INVOICE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                actionSuccess: false
            };

        // UPDATE
        case actions.UPDATE_INVOICE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.UPDATE_INVOICE_SUCCESS:
            return {
                ...state,
                data: state.data.map(invoice =>
                    invoice.id === action.payload.id ? action.payload : invoice
                ),
                currentInvoice: action.payload,
                loading: false,
                error: null,
                actionSuccess: true
            };
        case actions.UPDATE_INVOICE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                actionSuccess: false
            };

        // DELETE
        case actions.DELETE_INVOICE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.DELETE_INVOICE_SUCCESS:
            return {
                ...state,
                data: state.data.filter(
                    invoice => invoice.id !== action.payload
                ),
                loading: false,
                error: null,
                actionSuccess: true
            };
        case actions.DELETE_INVOICE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                actionSuccess: false
            };
        case actions.FETCH_LAST_INVOICE_NUMBER_SUCCESS:
            return {
                ...state,
                lastInvoiceNumber: action.payload,
                loading: false
            };

        case actions.FETCH_LAST_INVOICE_NUMBER_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case actions.FETCH_LAST_INVOICE_NUMBER_REQUEST:
            return {
                ...state,
                loading: true
            };

        // OTHER ACTIONS
        case actions.CLEAR_INVOICE:
            return {
                ...state,
                currentInvoice: null,
                actionSuccess: false
            };
        case actions.CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                actionSuccess: false
            };
        default:
            return state;
    }
};

export default invoiceReducer;