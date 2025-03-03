// Zaimportuj wszystkie reduktory z feature
import { combineReducers } from 'redux';
import contractorReducer from '../features/contractors/redux/contractorReducer';
import invoiceReducer from '../features/invoices/redux/invoiceReducer';

const rootReducer = combineReducers({
    contractors: contractorReducer,
    invoices: invoiceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;