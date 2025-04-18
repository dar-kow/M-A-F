/* eslint-disable @typescript-eslint/no-explicit-any */
import { put, call, takeLatest } from 'redux-saga/effects';
import api from '@/shared/services/api';
import * as actions from './contractorActions';

// Fetch all contractors
function* fetchContractorsSaga() {
    try {
        // Poprawione wywołanie call
        const response = yield call(api.getContractors.bind(api));
        yield put(actions.fetchContractorsSuccess(response.data));
    } catch (error: any) {
        yield put(actions.fetchContractorsFailure(error.message || 'Failed to fetch contractors'));
    }
}

// Fetch single contractor
function* fetchContractorSaga(action: ReturnType<typeof actions.fetchContractorRequest>) {
    try {
        // Poprawione wywołanie call
        const response = yield call(api.getContractor.bind(api), action.payload);
        yield put(actions.fetchContractorSuccess(response.data));
    } catch (error: any) {
        yield put(actions.fetchContractorFailure(error.message || 'Failed to fetch contractor'));
    }
}

// Create contractor
function* createContractorSaga(action: ReturnType<typeof actions.createContractorRequest>) {
    try {
        // Poprawione wywołanie call
        const response = yield call(api.createContractor.bind(api), action.payload);
        yield put(actions.createContractorSuccess(response.data));
    } catch (error: any) {
        yield put(actions.createContractorFailure(error.message || 'Failed to create contractor'));
    }
}

// Update contractor
function* updateContractorSaga(action: ReturnType<typeof actions.updateContractorRequest>) {
    try {
        // Poprawione wywołanie call
        const response = yield call(api.updateContractor.bind(api), action.payload.id, action.payload);
        yield put(actions.updateContractorSuccess(response.data));
    } catch (error: any) {
        yield put(actions.updateContractorFailure(error.message || 'Failed to update contractor'));
    }
}

// Delete contractor
function* deleteContractorSaga(action: ReturnType<typeof actions.deleteContractorRequest>) {
    try {
        // Poprawione wywołanie call
        yield call(api.deleteContractor.bind(api), action.payload);
        yield put(actions.deleteContractorSuccess(action.payload));
    } catch (error: any) {
        yield put(actions.deleteContractorFailure(error.message || 'Failed to delete contractor'));
    }
}

export function* watchContractorSagas() {
    yield takeLatest(actions.FETCH_CONTRACTORS_REQUEST, fetchContractorsSaga);
    yield takeLatest(actions.FETCH_CONTRACTOR_REQUEST, fetchContractorSaga);
    yield takeLatest(actions.CREATE_CONTRACTOR_REQUEST, createContractorSaga);
    yield takeLatest(actions.UPDATE_CONTRACTOR_REQUEST, updateContractorSaga);
    yield takeLatest(actions.DELETE_CONTRACTOR_REQUEST, deleteContractorSaga);
}