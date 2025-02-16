import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import contractorReducer from "./reducers/contractorReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import rootSaga from "./sagas/rootSaga";

// Combine all reducers
const rootReducer = combineReducers({
  contractors: contractorReducer,
  invoices: invoiceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

// Create Redux store with saga middleware
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

// Reminder: When creating UI components, add data-test-id attributes to clickable elements, inputs, labels, etc.
export default store;
