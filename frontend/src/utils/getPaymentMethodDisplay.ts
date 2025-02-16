import { PaymentMethod } from "../types/types";

export const getPaymentMethodDisplay = (
  method: PaymentMethod | string,
): string => {
  // Convert payment method enum to a human-readable Polish string.
  switch (method) {
    case PaymentMethod.Cash:
      return "Gotówka";
    case PaymentMethod.Transfer:
      return "Przelew";
    case PaymentMethod.Card:
      return "Karta";
    case PaymentMethod.Other:
      return "Inny";
    default:
      return method;
  }
};
