import { Contractor } from "../../types/types";

export const FETCH_CONTRACTORS_REQUEST = "FETCH_CONTRACTORS_REQUEST";
export const FETCH_CONTRACTORS_SUCCESS = "FETCH_CONTRACTORS_SUCCESS";
export const FETCH_CONTRACTORS_FAILURE = "FETCH_CONTRACTORS_FAILURE";

export const ADD_CONTRACTOR_REQUEST = "ADD_CONTRACTOR_REQUEST";
export const ADD_CONTRACTOR_SUCCESS = "ADD_CONTRACTOR_SUCCESS";
export const ADD_CONTRACTOR_FAILURE = "ADD_CONTRACTOR_FAILURE";

export const UPDATE_CONTRACTOR_REQUEST = "UPDATE_CONTRACTOR_REQUEST";
export const UPDATE_CONTRACTOR_SUCCESS = "UPDATE_CONTRACTOR_SUCCESS";
export const UPDATE_CONTRACTOR_FAILURE = "UPDATE_CONTRACTOR_FAILURE";

export const DELETE_CONTRACTOR_REQUEST = "DELETE_CONTRACTOR_REQUEST";
export const DELETE_CONTRACTOR_SUCCESS = "DELETE_CONTRACTOR_SUCCESS";
export const DELETE_CONTRACTOR_FAILURE = "DELETE_CONTRACTOR_FAILURE";

export const fetchContractorsRequest = () => ({
  type: FETCH_CONTRACTORS_REQUEST,
});

export const fetchContractorsSuccess = (contractors: Contractor[]) => ({
  type: FETCH_CONTRACTORS_SUCCESS,
  payload: contractors,
});

export const fetchContractorsFailure = (error: string) => ({
  type: FETCH_CONTRACTORS_FAILURE,
  payload: error,
});

export const addContractorRequest = (contractor: Contractor) => ({
  type: ADD_CONTRACTOR_REQUEST,
  payload: contractor,
});

export const addContractorSuccess = (contractor: Contractor) => ({
  type: ADD_CONTRACTOR_SUCCESS,
  payload: contractor,
});

export const addContractorFailure = (error: string) => ({
  type: ADD_CONTRACTOR_FAILURE,
  payload: error,
});

export const updateContractorRequest = (contractor: Contractor) => ({
  type: UPDATE_CONTRACTOR_REQUEST,
  payload: contractor,
});

export const updateContractorSuccess = (contractor: Contractor) => ({
  type: UPDATE_CONTRACTOR_SUCCESS,
  payload: contractor,
});

export const updateContractorFailure = (error: string) => ({
  type: UPDATE_CONTRACTOR_FAILURE,
  payload: error,
});

export const deleteContractorRequest = (contractorId: number) => ({
  type: DELETE_CONTRACTOR_REQUEST,
  payload: contractorId,
});

export const deleteContractorSuccess = (contractorId: number) => ({
  type: DELETE_CONTRACTOR_SUCCESS,
  payload: contractorId,
});

export const deleteContractorFailure = (error: string) => ({
  type: DELETE_CONTRACTOR_FAILURE,
  payload: error,
});