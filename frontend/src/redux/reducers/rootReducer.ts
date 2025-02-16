import { combineReducers } from "redux";
import contractorReducer from "./contractorReducer";
import invoiceReducer from "./invoiceReducer";

// Combine contractor and invoice reducers
const rootReducer = combineReducers({
  contractors: contractorReducer,
  invoices: invoiceReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
