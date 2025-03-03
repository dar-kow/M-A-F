import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../../../shared/services/api';
import * as actions from './invoiceActions';

// Fetch all invoices
function* fetchInvoicesSaga() {
    try {
        const response = yield call([api, api.getInvoices]);
        yield put(actions.fetchInvoicesSuccess(response.data));
    } catch (error: any) {
        yield put(actions.fetchInvoicesFailure(error.message || 'Failed to fetch invoices'));
    }
}

// Fetch single invoice
function* fetchInvoiceSaga(action: ReturnType<typeof actions.fetchInvoiceRequest>) {
    try {
        const response = yield call([api, api.getInvoice], action.payload);
        yield put(actions.fetchInvoiceSuccess(response.data));
    } catch (error: any) {
        yield put(actions.fetchInvoiceFailure(error.message || 'Failed to fetch invoice'));
    }
}

// Create invoice
function* createInvoiceSaga(action: ReturnType<typeof actions.createInvoiceRequest>) {
    try {
        const response = yield call([api, api.createInvoice], action.payload);
        yield put(actions.createInvoiceSuccess(response.data));
    } catch (error: any) {
        yield put(actions.createInvoiceFailure(error.message || 'Failed to create invoice'));
    }
}

// Update invoice
function* updateInvoiceSaga(action: ReturnType<typeof actions.updateInvoiceRequest>) {
    try {
        const response = yield call([api, api.updateInvoice], action.payload.id, action.payload);
        yield put(actions.updateInvoiceSuccess(response.data));
    } catch (error: any) {
        yield put(actions.updateInvoiceFailure(error.message || 'Failed to update invoice'));
    }
}

// Delete invoice
function* deleteInvoiceSaga(action: ReturnType<typeof actions.deleteInvoiceRequest>) {
    try {
        yield call([api, api.deleteInvoice], action.payload);
        yield put(actions.deleteInvoiceSuccess(action.payload));
    } catch (error: any) {
        yield put(actions.deleteInvoiceFailure(error.message || 'Failed to delete invoice'));
    }
}

function* fetchLastInvoiceNumberSaga() {
    try {
        console.log("Wywołuję API: getLastInvoiceNumber");
        const response = yield call([api, api.getLastInvoiceNumber]);
        console.log("Otrzymana odpowiedź:", response.data);
        yield put(actions.fetchLastInvoiceNumberSuccess(response.data));
    } catch (error: any) {
        console.error("Błąd podczas pobierania numeru faktury:", error);
        // Bardziej szczegółowa obsługa błędu
        let errorMessage = 'Błąd pobierania ostatniego numeru faktury';
        if (error.response) {
            console.error("Status błędu:", error.response.status);
            console.error("Dane odpowiedzi:", error.response.data);
            errorMessage = `${errorMessage}: ${error.response.status}`;
        } else if (error.request) {
            console.error("Brak odpowiedzi:", error.request);
            errorMessage = `${errorMessage}: Brak odpowiedzi z serwera`;
        } else {
            console.error("Błąd konfiguracji:", error.message);
            errorMessage = `${errorMessage}: ${error.message}`;
        }
        yield put(actions.fetchLastInvoiceNumberFailure(errorMessage));
    }
}

export function* watchInvoiceSagas() {
    yield takeLatest(actions.FETCH_INVOICES_REQUEST, fetchInvoicesSaga);
    yield takeLatest(actions.FETCH_INVOICE_REQUEST, fetchInvoiceSaga);
    yield takeLatest(actions.CREATE_INVOICE_REQUEST, createInvoiceSaga);
    yield takeLatest(actions.UPDATE_INVOICE_REQUEST, updateInvoiceSaga);
    yield takeLatest(actions.DELETE_INVOICE_REQUEST, deleteInvoiceSaga);
    yield takeLatest(actions.FETCH_LAST_INVOICE_NUMBER_REQUEST, fetchLastInvoiceNumberSaga);
}