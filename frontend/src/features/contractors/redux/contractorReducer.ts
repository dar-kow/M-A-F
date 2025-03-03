import { Contractor } from '../../../types/types';
import * as actions from './contractorActions';

interface ContractorState {
    contractors: Contractor[];
    contractor: Contractor | null;
    loading: boolean;
    error: string | null;
    actionSuccess: boolean;
}

const initialState: ContractorState = {
    contractors: [],
    contractor: null,
    loading: false,
    error: null,
    actionSuccess: false
};

const contractorReducer = (state = initialState, action: any): ContractorState => {
    switch (action.type) {
        // FETCH ALL
        case actions.FETCH_CONTRACTORS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.FETCH_CONTRACTORS_SUCCESS:
            return {
                ...state,
                contractors: action.payload,
                loading: false,
                error: null
            };
        case actions.FETCH_CONTRACTORS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // FETCH SINGLE
        case actions.FETCH_CONTRACTOR_REQUEST:
            return {
                ...state,
                contractor: null,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.FETCH_CONTRACTOR_SUCCESS:
            return {
                ...state,
                contractor: action.payload,
                loading: false,
                error: null
            };
        case actions.FETCH_CONTRACTOR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // CREATE
        case actions.CREATE_CONTRACTOR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.CREATE_CONTRACTOR_SUCCESS:
            return {
                ...state,
                contractors: [...state.contractors, action.payload],
                contractor: action.payload,
                loading: false,
                error: null,
                actionSuccess: true
            };
        case actions.CREATE_CONTRACTOR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                actionSuccess: false
            };

        // UPDATE
        case actions.UPDATE_CONTRACTOR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.UPDATE_CONTRACTOR_SUCCESS:
            return {
                ...state,
                contractors: state.contractors.map(contractor =>
                    contractor.id === action.payload.id ? action.payload : contractor
                ),
                contractor: action.payload,
                loading: false,
                error: null,
                actionSuccess: true
            };
        case actions.UPDATE_CONTRACTOR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                actionSuccess: false
            };

        // DELETE
        case actions.DELETE_CONTRACTOR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                actionSuccess: false
            };
        case actions.DELETE_CONTRACTOR_SUCCESS:
            return {
                ...state,
                contractors: state.contractors.filter(
                    contractor => contractor.id !== action.payload
                ),
                loading: false,
                error: null,
                actionSuccess: true
            };
        case actions.DELETE_CONTRACTOR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                actionSuccess: false
            };

        // OTHER ACTIONS
        case actions.CLEAR_CONTRACTOR:
            return {
                ...state,
                contractor: null,
                actionSuccess: false
            };
        case actions.CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                actionSuccess: false
            };
        default:
            return state;
    }
};

export default contractorReducer;