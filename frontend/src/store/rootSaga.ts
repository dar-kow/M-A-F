// Zaimportuj wszystkie saga watchery
import { all, fork } from 'redux-saga/effects';
import { watchContractorSagas } from '../features/contractors/redux/contractorSaga';
import { watchInvoiceSagas } from '../features/invoices/redux/invoiceSaga';

export default function* rootSaga() {
    yield all([
        fork(watchContractorSagas),
        fork(watchInvoiceSagas),
    ]);
}