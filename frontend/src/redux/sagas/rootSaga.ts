import { all } from "redux-saga/effects";
import { watchContractors } from "./contractorSaga";
// import other sagas as needed, e.g. watchInvoices

export default function* rootSaga() {
  yield all([
    watchContractors(),
    // add other sagas here
  ]);
}
