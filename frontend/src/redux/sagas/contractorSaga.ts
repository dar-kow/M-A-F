import { takeLatest, call, put } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import api from "../../services/api";
import {
  FETCH_CONTRACTORS_REQUEST,
  FETCH_CONTRACTORS_SUCCESS,
  FETCH_CONTRACTORS_FAILURE,
  ADD_CONTRACTOR_REQUEST,
  ADD_CONTRACTOR_SUCCESS,
  ADD_CONTRACTOR_FAILURE,
  UPDATE_CONTRACTOR_REQUEST,
  UPDATE_CONTRACTOR_SUCCESS,
  UPDATE_CONTRACTOR_FAILURE,
  DELETE_CONTRACTOR_REQUEST,
  DELETE_CONTRACTOR_SUCCESS,
  DELETE_CONTRACTOR_FAILURE,
} from "../actions/contractorActions";

function* fetchContractorsSaga(): SagaIterator {
  try {
    const response = yield call(api.getContractors);
    yield put({
      type: FETCH_CONTRACTORS_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: FETCH_CONTRACTORS_FAILURE,
      payload: error.message || "Error fetching contractors",
    });
  }
}

function* addContractorSaga(action: any): SagaIterator {
  try {
    const newContractor = action.payload;
    const response = yield call(api.createContractor, newContractor);
    yield put({
      type: ADD_CONTRACTOR_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: ADD_CONTRACTOR_FAILURE,
      payload: error.message || "Error adding contractor",
    });
  }
}

function* updateContractorSaga(action: any): SagaIterator {
  try {
    const updatedContractor = action.payload;
    const response = yield call(
      api.updateContractor,
      updatedContractor.id,
      updatedContractor
    );
    yield put({
      type: UPDATE_CONTRACTOR_SUCCESS,
      payload: response.data,
    });
  } catch (error: any) {
    yield put({
      type: UPDATE_CONTRACTOR_FAILURE,
      payload: error.message || "Error updating contractor",
    });
  }
}

function* deleteContractorSaga(action: any): SagaIterator {
  try {
    const contractorId = action.payload;
    yield call(api.deleteContractor, contractorId);
    yield put({
      type: DELETE_CONTRACTOR_SUCCESS,
      payload: contractorId,
    });
  } catch (error: any) {
    yield put({
      type: DELETE_CONTRACTOR_FAILURE,
      payload: error.message || "Error deleting contractor",
    });
  }
}

export function* watchContractors(): SagaIterator {
  yield takeLatest(FETCH_CONTRACTORS_REQUEST, fetchContractorsSaga);
  yield takeLatest(ADD_CONTRACTOR_REQUEST, addContractorSaga);
  yield takeLatest(UPDATE_CONTRACTOR_REQUEST, updateContractorSaga);
  yield takeLatest(DELETE_CONTRACTOR_REQUEST, deleteContractorSaga);
}