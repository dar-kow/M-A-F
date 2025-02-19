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
import { Contractor } from "../../types/types";

interface ContractorState {
  loading: boolean;
  error: string | null;
  contractors: Contractor[];
}

const initialState: ContractorState = {
  loading: false,
  error: null,
  contractors: [],
};

const contractorReducer = (state = initialState, action: any): ContractorState => {
  switch (action.type) {
    case FETCH_CONTRACTORS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CONTRACTORS_SUCCESS:
      return { ...state, loading: false, contractors: action.payload };
    case FETCH_CONTRACTORS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_CONTRACTOR_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_CONTRACTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        contractors: [...state.contractors, action.payload],
      };
    case ADD_CONTRACTOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_CONTRACTOR_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_CONTRACTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        contractors: state.contractors.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case UPDATE_CONTRACTOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_CONTRACTOR_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_CONTRACTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        contractors: state.contractors.filter((c) => c.id !== action.payload),
      };
    case DELETE_CONTRACTOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default contractorReducer;