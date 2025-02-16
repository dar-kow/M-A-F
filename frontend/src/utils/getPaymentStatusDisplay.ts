import { PaymentStatus } from "../types/types";

export const getPaymentStatusDisplay = (status: PaymentStatus): string => {
  // Translate payment status to Polish display text.
  switch (status) {
    case PaymentStatus.Paid:
      return "Opłacona";
    case PaymentStatus.PartiallyPaid:
      return "Częściowo opłacona";
    case PaymentStatus.Unpaid:
      return "Nieopłacona";
    case PaymentStatus.Overdue:
      return "Przeterminowana";
    default:
      return status;
  }
};
