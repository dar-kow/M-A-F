export interface Contractor {
  id: number;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  taxId: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  city: string;
  postalCode: string;
  createdAt: string;
}

export enum PaymentStatus {
  Paid = "Paid",
  PartiallyPaid = "PartiallyPaid",
  Unpaid = "Unpaid",
  Overdue = "Overdue",
}

export enum PaymentMethod {
  Cash = "Cash",
  Transfer = "Transfer",
  Card = "Card",
  Other = "Other",
}

export enum VatRate {
  Zero = 0,
  Three = 3,
  Five = 5,
  Eight = 8,
  TwentyThree = 23,
}

export enum Unit {
  l = "l",
  szt = "szt",
  m = "m",
  kg = "kg",
}

export interface InvoiceItem {
  id?: number;
  lineNumber: number;
  description: string;
  quantity: number;
  unit: Unit;
  vatRate: VatRate;
  netPrice: number;
  invoiceId: number;
}

export interface Invoice {
  id: number;
  number: string;
  date: Date;
  amount: number;
  paymentStatus: PaymentStatus;
  dueDate?: Date;
  paidAmount?: number;
  contractorId: number;
  contractor?: Contractor;
  paymentMethod: PaymentMethod;
  invoiceItems?: InvoiceItem[];
}
