import { Contractor } from '../../../types/types';

// Action Types
export const FETCH_CONTRACTORS_REQUEST = 'contractors/FETCH_CONTRACTORS_REQUEST';
export const FETCH_CONTRACTORS_SUCCESS = 'contractors/FETCH_CONTRACTORS_SUCCESS';
export const FETCH_CONTRACTORS_FAILURE = 'contractors/FETCH_CONTRACTORS_FAILURE';

export const FETCH_CONTRACTOR_REQUEST = 'contractors/FETCH_CONTRACTOR_REQUEST';
export const FETCH_CONTRACTOR_SUCCESS = 'contractors/FETCH_CONTRACTOR_SUCCESS';
export const FETCH_CONTRACTOR_FAILURE = 'contractors/FETCH_CONTRACTOR_FAILURE';

export const CREATE_CONTRACTOR_REQUEST = 'contractors/CREATE_CONTRACTOR_REQUEST';
export const CREATE_CONTRACTOR_SUCCESS = 'contractors/CREATE_CONTRACTOR_SUCCESS';
export const CREATE_CONTRACTOR_FAILURE = 'contractors/CREATE_CONTRACTOR_FAILURE';

export const UPDATE_CONTRACTOR_REQUEST = 'contractors/UPDATE_CONTRACTOR_REQUEST';
export const UPDATE_CONTRACTOR_SUCCESS = 'contractors/UPDATE_CONTRACTOR_SUCCESS';
export const UPDATE_CONTRACTOR_FAILURE = 'contractors/UPDATE_CONTRACTOR_FAILURE';

export const DELETE_CONTRACTOR_REQUEST = 'contractors/DELETE_CONTRACTOR_REQUEST';
export const DELETE_CONTRACTOR_SUCCESS = 'contractors/DELETE_CONTRACTOR_SUCCESS';
export const DELETE_CONTRACTOR_FAILURE = 'contractors/DELETE_CONTRACTOR_FAILURE';

export const CLEAR_CONTRACTOR = 'contractors/CLEAR_CONTRACTOR';
export const CLEAR_ERRORS = 'contractors/CLEAR_ERRORS';

// Action Creators
export const fetchContractorsRequest = () => ({
    type: FETCH_CONTRACTORS_REQUEST
});

export const fetchContractorsSuccess = (contractors: Contractor[]) => ({
    type: FETCH_CONTRACTORS_SUCCESS,
    payload: contractors
});

export const fetchContractorsFailure = (error: string) => ({
    type: FETCH_CONTRACTORS_FAILURE,
    payload: error
});

export const fetchContractorRequest = (id: number) => ({
    type: FETCH_CONTRACTOR_REQUEST,
    payload: id
});

export const fetchContractorSuccess = (contractor: Contractor) => ({
    type: FETCH_CONTRACTOR_SUCCESS,
    payload: contractor
});

export const fetchContractorFailure = (error: string) => ({
    type: FETCH_CONTRACTOR_FAILURE,
    payload: error
});

export const createContractorRequest = (contractor: Omit<Contractor, 'id'>) => ({
    type: CREATE_CONTRACTOR_REQUEST,
    payload: contractor
});

export const createContractorSuccess = (contractor: Contractor) => ({
    type: CREATE_CONTRACTOR_SUCCESS,
    payload: contractor
});

export const createContractorFailure = (error: string) => ({
    type: CREATE_CONTRACTOR_FAILURE,
    payload: error
});

export const updateContractorRequest = (contractor: Contractor) => ({
    type: UPDATE_CONTRACTOR_REQUEST,
    payload: contractor
});

export const updateContractorSuccess = (contractor: Contractor) => ({
    type: UPDATE_CONTRACTOR_SUCCESS,
    payload: contractor
});

export const updateContractorFailure = (error: string) => ({
    type: UPDATE_CONTRACTOR_FAILURE,
    payload: error
});

export const deleteContractorRequest = (id: number) => ({
    type: DELETE_CONTRACTOR_REQUEST,
    payload: id
});

export const deleteContractorSuccess = (id: number) => ({
    type: DELETE_CONTRACTOR_SUCCESS,
    payload: id
});

export const deleteContractorFailure = (error: string) => ({
    type: DELETE_CONTRACTOR_FAILURE,
    payload: error
});

export const clearContractor = () => ({
    type: CLEAR_CONTRACTOR
});

export const clearErrors = () => ({
    type: CLEAR_ERRORS
});