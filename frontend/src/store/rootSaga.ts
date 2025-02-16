import { all, call } from "redux-saga/effects";
import { watchInvoices } from "./invoiceSaga";

export default function* rootSaga() {
  yield all([call(watchInvoices)]);
}
