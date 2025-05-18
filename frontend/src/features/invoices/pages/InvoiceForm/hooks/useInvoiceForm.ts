import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";

import { RootState } from "../../../../../store/rootReducer";
import {
  fetchInvoiceRequest,
  createInvoiceRequest,
  updateInvoiceRequest,
  clearInvoice,
  clearErrors,
  fetchLastInvoiceNumberRequest,
} from "../../../redux/invoiceActions";
import useFetchContractors from "../../../../contractors/hooks/useFetchContractors";
import {
  PaymentMethod,
  PaymentStatus,
  VatRate,
  Unit,
  Invoice,
  InvoiceItem,
} from "@app-types/types";
import { useInvoiceTotals } from "./useInvoiceTotals";

// Constants
const emptyItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  unit: Unit.szt,
  vatRate: VatRate.TwentyThree,
};

// Types
export type FormData = {
  invoiceNumber: string;
  issueDate: DateTime;
  dateDue: DateTime;
  contractorId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  description: string;
  paidAmount: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    unit: Unit;
    vatRate: VatRate;
  }[];
};

// Helper functions for enum type conversion
const convertVatRate = (vatRate: any): VatRate => {
  if (typeof vatRate === "string") {
    // Map names to enum values
    const mapping: Record<string, VatRate> = {
      Zero: VatRate.Zero,
      Three: VatRate.Three,
      Five: VatRate.Five,
      Eight: VatRate.Eight,
      TwentyThree: VatRate.TwentyThree,
    };
    return mapping[vatRate] || VatRate.TwentyThree; // default 23%
  }
  return vatRate as VatRate;
};

const convertUnit = (unit: any): Unit => {
  if (typeof unit === "string") {
    // Check if this is one of the Unit enum values
    const unitValues = ["l", "szt", "m", "kg"];
    if (unitValues.includes(unit)) {
      return unit as Unit;
    }

    // If this is a Unit key name, not value
    if (unit in Unit) {
      return Unit[unit as keyof typeof Unit];
    }
  }
  return unit as Unit;
};

export function useInvoiceForm(isEdit: boolean, invoiceId?: number) {
  const [updateCounter, setUpdateCounter] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const invoice = useSelector(
    (state: RootState) => state.invoices.currentInvoice
  );
  const lastInvoiceNumber = useSelector(
    (state: RootState) => state.invoices.lastInvoiceNumber
  );

  // Contractors
  const { contractors } = useFetchContractors();

  // Force update function
  const forceUpdate = useCallback(() => {
    setUpdateCounter((prev) => prev + 1);
  }, []);

  // Form initialization
  const formMethods = useForm<FormData>({
    defaultValues: {
      invoiceNumber: "",
      issueDate: DateTime.now(),
      dateDue: DateTime.now().plus({ days: 14 }),
      contractorId: 0,
      paymentMethod: PaymentMethod.Transfer,
      paymentStatus: PaymentStatus.Unpaid,
      description: "",
      paidAmount: 0,
      items: [{ ...emptyItem }],
    },
  });

  const { control, reset, watch, setValue } = formMethods;

  // Invoice items field array configuration
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watching invoice items
  const watchedItems = watch("items");

  // Calculating totals
  const totals = useInvoiceTotals(watchedItems);

  // Effect for watching field changes
  useEffect(() => {
    // This forces recalculation of values on every change in items
    const subscription = formMethods.watch((_, { name }) => {
      // If the change concerns invoice items
      if (
        name?.startsWith("items.") &&
        (name.includes(".quantity") ||
          name.includes(".unitPrice") ||
          name.includes(".vatRate"))
      ) {
        // Force re-render by a slight state update
        forceUpdate();
      }
    });

    return () => subscription.unsubscribe();
  }, [formMethods, forceUpdate]);

  // Effect for debugging changes
  useEffect(() => {
    console.log(
      "Items updated or updateCounter changed:",
      watchedItems,
      "Counter:",
      updateCounter
    );
  }, [watchedItems, updateCounter]);

  // Fetch last invoice number on initialization
  useEffect(() => {
    if (!isEdit) {
      dispatch(fetchLastInvoiceNumberRequest());
    }
  }, [dispatch, isEdit]);

  // Automatically set invoice number for new invoice
  useEffect(() => {
    if (!isEdit && lastInvoiceNumber && !watch("invoiceNumber")) {
      try {
        const currentDate = DateTime.now();
        const year = currentDate.year;

        // Default number in case of error
        let nextNumber = 1;

        // Analyze the last invoice number
        if (lastInvoiceNumber) {
          console.log("Last invoice number from API:", lastInvoiceNumber);
          // Format: FV/numer/rok
          const regex = /FV\/(\d+)\/(\d+)/;
          const match = lastInvoiceNumber.match(regex);

          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1;
          }
        } else {
          console.log("No last invoice number - using default 1");
        }

        // Format new number
        const newInvoiceNumber = `FV/${nextNumber}/${year}`;
        console.log("Generated new invoice number:", newInvoiceNumber);

        // Set new invoice number
        setValue("invoiceNumber", newInvoiceNumber);
      } catch (error) {
        console.error("Error generating invoice number:", error);
        // Set fallback invoice number
        const fallbackNumber = `FV/1/${DateTime.now().year}`;
        setValue("invoiceNumber", fallbackNumber);
      }
    }
  }, [lastInvoiceNumber, isEdit, setValue, watch]);

  // Load invoice data for editing
  useEffect(() => {
    if (isEdit && invoiceId) {
      dispatch(fetchInvoiceRequest(invoiceId));
    }

    return () => {
      dispatch(clearInvoice());
      dispatch(clearErrors());
    };
  }, [dispatch, isEdit, invoiceId]);

  // Fill form with invoice data
  useEffect(() => {
    if (isEdit && invoice && invoice.invoiceItems) {
      console.log("Invoice data from API:", invoice);

      // Helper function for safe date conversion
      const safeToDateTime = (date: any) => {
        if (!date) return DateTime.now();

        try {
          if (date instanceof Date) {
            return DateTime.fromJSDate(date);
          }

          if (typeof date === "string") {
            // Try parsing as ISO string
            const dt = DateTime.fromISO(date);
            if (dt.isValid) return dt;

            // If ISO fails, try normal Date constructor
            return DateTime.fromJSDate(new Date(date));
          }

          return DateTime.now();
        } catch (error) {
          console.error("Date conversion error:", error);
          return DateTime.now();
        }
      };

      // Use helper function for safe date conversion
      const issueDateObj = safeToDateTime(invoice.issueDate);
      const dueDateObj = safeToDateTime(invoice.dueDate);

      console.log("Converted to DateTime:", {
        issueDate: issueDateObj.toISO(),
        dueDate: dueDateObj.toISO(),
      });

      // IMPORTANT: Log invoice item data before conversion
      console.log("Original invoice items:", invoice.invoiceItems);

      // Mapping invoice items with enum conversion
      const mappedItems = invoice.invoiceItems.map((item) => {
        const result = {
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.netPrice,
          unit: convertUnit(item.unit),
          vatRate: convertVatRate(item.vatRate),
        };

        // Logging for debugging
        console.log(`Item conversion:`, {
          original: item,
          converted: result,
        });

        return result;
      });

      reset({
        invoiceNumber: invoice.number,
        issueDate: issueDateObj,
        dateDue: dueDateObj,
        contractorId: invoice.contractorId,
        paymentMethod: invoice.paymentMethod,
        paymentStatus: invoice.paymentStatus,
        description: invoice.description || "",
        paidAmount: invoice.paidAmount || 0,
        items: mappedItems,
      });

      // Force recalculation after data load
      forceUpdate();
    }
  }, [reset, invoice, isEdit, forceUpdate]);

  // Handle adding item
  const handleAddItem = useCallback(() => {
    append({ ...emptyItem });
    // Force recalculation after adding item
    setTimeout(forceUpdate, 0);
  }, [append, forceUpdate]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate("/invoices");
  }, [navigate]);

  // Handle form submission
  const handleSubmit = useCallback(
    (data: FormData) => {
      console.log("Form data before submission:", data);

      // Prepare data for submission
      const invoiceData: Partial<Invoice> = {
        number: data.invoiceNumber,
        issueDate: data.issueDate.toJSDate(),
        dueDate: data.dateDue.toJSDate(),
        contractorId: data.contractorId,
        paymentMethod: data.paymentMethod,
        description: data.description,
        paidAmount: data.paidAmount,
        totalAmount: totals.grossTotal,
        // netAmount: totals.netTotal,
        // vatAmount: totals.vatTotal,
        invoiceItems: data.items.map((item, index) => {
          // Ensure vatRate is a correct numeric value
          const vatRateValue =
            typeof item.vatRate === "string"
              ? convertVatRate(item.vatRate)
              : item.vatRate;

          return {
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit,
            vatRate: vatRateValue,
            netValue: item.quantity * item.unitPrice,
            vatValue: item.quantity * item.unitPrice * (vatRateValue / 100),
            grossValue:
              item.quantity * item.unitPrice * (1 + vatRateValue / 100),
            lineNumber: index + 1,
            netPrice: item.unitPrice,
            invoiceId: isEdit && invoiceId ? invoiceId : 0,
          } as InvoiceItem;
        }),
      };

      // Logging for debugging
      console.log("Prepared invoice data for submission:", invoiceData);

      if (isEdit && invoiceId) {
        dispatch(
          updateInvoiceRequest({
            ...invoiceData,
            id: invoiceId,
            createdAt: invoice?.issueDate || new Date().toISOString(),
          } as Invoice)
        );
      } else {
        dispatch(
          createInvoiceRequest({
            ...invoiceData,
            createdAt: new Date().toISOString(),
          } as Invoice)
        );
      }
    },
    [totals, isEdit, invoiceId, invoice, dispatch]
  );

  return {
    formMethods,
    totals,
    contractors,
    handleSubmit,
    handleCancel,
    handleAddItem,
    fields,
    remove,
    watchedItems,
    updateCounter,
    forceUpdate,
  };
}
