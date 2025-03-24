// Enums based on your OpenAPI schema
export enum PaymentMethod {
    Cash = 'Cash',
    Transfer = 'Transfer',
    Card = 'Card',
    Other = 'Other'
}

export enum PaymentStatus {
    Paid = 'Paid',
    PartiallyPaid = 'PartiallyPaid',
    Unpaid = 'Unpaid',
    Overdue = 'Overdue'
}

export enum Unit {
    l = 'l',
    szt = 'szt',
    m = 'm',
    kg = 'kg'
}

export enum VatRate {
    Zero = 'Zero',
    Three = 'Three',
    Five = 'Five',
    Eight = 'Eight',
    TwentyThree = 'TwentyThree'
}

// Interface definitions for better typing
export interface Contractor {
    id?: number;
    createdAt?: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    taxId: string;
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    city: string;
    postalCode: string;
}

export interface InvoiceItem {
    id?: number;
    lineNumber: number;
    description: string;
    quantity: number;
    unit: Unit;
    vatRate: VatRate;
    netPrice: number;
    invoiceId?: number;
}

export interface Invoice {
    id?: number;
    createdAt?: string;
    number: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    paidAmount: number;
    description: string;
    contractorId: number;
    paymentMethod: PaymentMethod;
    invoiceItems: InvoiceItem[];
}