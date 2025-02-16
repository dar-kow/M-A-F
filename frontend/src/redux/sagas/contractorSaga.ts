import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../services/api";
import {
  FETCH_CONTRACTORS_REQUEST,
  fetchContractorsSuccess,
  fetchContractorsFailure,
} from "../actions/contractorActions";

// Saga to load contractors data from API
function* fetchContractors(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, "/Contractors");
    yield put(fetchContractorsSuccess(response.data));
  } catch (error) {
    yield put(
      fetchContractorsFailure(
        error instanceof Error ? error.message : String(error)
      )
    );
  }
}

// Watcher saga for contractor actions
export function* watchContractors() {
  yield takeLatest(FETCH_CONTRACTORS_REQUEST, fetchContractors);
}
