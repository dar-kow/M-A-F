import {
  FETCH_CONTRACTORS_REQUEST,
  FETCH_CONTRACTORS_SUCCESS,
  FETCH_CONTRACTORS_FAILURE,
} from "../actions/contractorActions";
import { Contractor } from "../../types/types";

interface ContractorState {
  contractors: Contractor[];
  loading: boolean;
  error: string | null;
}

const initialState: ContractorState = {
  contractors: [],
  loading: false,
  error: null,
};

const contractorReducer = (state = initialState, action: any): ContractorState => {
  switch (action.type) {
    case FETCH_CONTRACTORS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CONTRACTORS_SUCCESS:
      return { ...state, loading: false, contractors: action.payload };
    case FETCH_CONTRACTORS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default contractorReducer;
