import { Contractor } from "../../types/types";

// Action type constants for contractors
export const FETCH_CONTRACTORS_REQUEST = "FETCH_CONTRACTORS_REQUEST";
export const FETCH_CONTRACTORS_SUCCESS = "FETCH_CONTRACTORS_SUCCESS";
export const FETCH_CONTRACTORS_FAILURE = "FETCH_CONTRACTORS_FAILURE";

// Action creators for fetching contractors
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
