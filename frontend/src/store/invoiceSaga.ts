import { takeLatest, call, put } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import api from "../../services/api";
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

function* fetchInvoicesSaga(): SagaIterator {
  try {
    const response = yield call(api.getInvoices);
    yield put({
      type: FETCH_INVOICES_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: FETCH_INVOICES_FAILURE,
      payload: error.message || "Error fetching invoices",
    });
  }
}

function* addInvoiceSaga(action: any): SagaIterator {
  try {
    const newInvoice = action.payload;
    const response = yield call(api.createInvoice, newInvoice);
    yield put({
      type: ADD_INVOICE_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: ADD_INVOICE_FAILURE,
      payload: error.message || "Error adding invoice",
    });
  }
}

function* updateInvoiceSaga(action: any): SagaIterator {
  try {
    const updatedInvoice = action.payload;
    const response = yield call(api.updateInvoice, updatedInvoice.id, updatedInvoice);
    yield put({
      type: UPDATE_INVOICE_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: UPDATE_INVOICE_FAILURE,
      payload: error.message || "Error updating invoice",
    });
  }
}

function* deleteInvoiceSaga(action: any): SagaIterator {
  try {
    const invoiceId = action.payload;
    yield call(api.deleteInvoice, invoiceId);
    yield put({
      type: DELETE_INVOICE_SUCCESS,
      payload: invoiceId,
    });
  } catch (error: any) {
    yield put({
      type: DELETE_INVOICE_FAILURE,
      payload: error.message || "Error deleting invoice",
    });
  }
}

export function* watchInvoices(): SagaIterator {
  yield takeLatest(FETCH_INVOICES_REQUEST, fetchInvoicesSaga);
  yield takeLatest(ADD_INVOICE_REQUEST, addInvoiceSaga);
  yield takeLatest(UPDATE_INVOICE_REQUEST, updateInvoiceSaga);
  yield takeLatest(DELETE_INVOICE_REQUEST, deleteInvoiceSaga);
}