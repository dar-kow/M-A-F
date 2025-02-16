import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import { setInvoices, fetchInvoices } from "./invoiceSlice";
import { SagaIterator } from "redux-saga";

const API_URL = "http://localhost:5000/api/invoices";

// Saga to fetch invoices from the API
function* fetchInvoicesSaga(): SagaIterator {
  try {
    const response = yield call(axios.get, API_URL);
    yield put(setInvoices(response.data)); // Add fetched data to the state
  } catch (error) {
    console.error("Error fetching invoices:", error);
  }
}

// Watcher saga that listens for the fetchInvoices action
export function* watchInvoices(): SagaIterator {
  yield takeLatest(fetchInvoices.type, fetchInvoicesSaga);
}
