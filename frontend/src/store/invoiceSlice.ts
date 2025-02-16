import { createSlice } from "@reduxjs/toolkit";

// Define interfaces for invoice state
interface Invoice {
  id: number;
  amount: number;
  date: string;
  isPaid: boolean;
}

interface InvoiceState {
  invoices: Invoice[];
}

const initialState: InvoiceState = {
  invoices: [],
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    // Reducer to set invoices
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    // Reducer to add a new invoice
    addInvoice: (state, action) => {
      state.invoices.push(action.payload);
    },
    // Reducer to update an existing invoice
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    // Reducer to delete an invoice
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload
      );
    },
    // Saga trigger placeholder for fetching invoices
    fetchInvoices: () => { }
  },
});

// Expose actions and reducer
export const {
  setInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  fetchInvoices,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
