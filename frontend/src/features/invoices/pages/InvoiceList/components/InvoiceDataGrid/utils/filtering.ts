import { Invoice, PaymentStatus } from '@app-types/types';
import { formatDate } from '@shared/utils/formatters';
import { getPaymentStatusLabel } from '@shared/utils/statusHelpers';

/**
 * Filtruje listę faktur według określonych filtrów kolumn
 */
export function filterInvoices(
    invoices: (Invoice & { contractorName?: string })[],
    columnFilters: { [key: string]: string }
): (Invoice & { contractorName?: string })[] {
    if (Object.keys(columnFilters).length === 0) return invoices;

    return invoices.filter(invoice => {
        return Object.entries(columnFilters).every(([field, filterValue]) => {
            if (!filterValue) return true;

            let value;
            if (field === 'paymentStatus') {
                value = getPaymentStatusLabel(invoice[field as keyof typeof invoice] as PaymentStatus).toLowerCase();
            } else if (field === 'issueDate' || field === 'dueDate') {
                value = formatDate(invoice[field as keyof typeof invoice]).toLowerCase();
            } else if (field === 'totalAmount' || field === 'paidAmount') {
                const amount = Number(invoice[field as keyof typeof invoice] || 0);
                value = amount.toString().toLowerCase();
            } else {
                value = String(invoice[field as keyof typeof invoice] || '').toLowerCase();
            }

            return value.includes(filterValue.toLowerCase());
        });
    });
}