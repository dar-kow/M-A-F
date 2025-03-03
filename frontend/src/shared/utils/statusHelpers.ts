import { PaymentStatus } from '@app-types/types';

/**
 * Zwraca kolor chipu dla danego statusu płatności
 * @param status - Status płatności
 * @returns Nazwa koloru dla komponentu Chip
 */
export const getStatusChipColor = (status: PaymentStatus): string => {
    switch (status) {
        case PaymentStatus.Paid:
            return 'success';
        case PaymentStatus.PartiallyPaid:
            return 'info';
        case PaymentStatus.Unpaid:
            return 'default';
        case PaymentStatus.Overdue:
            return 'error';
        default:
            return 'default';
    }
};

/**
 * Zwraca przetłumaczoną nazwę statusu płatności
 * @param status - Status płatności
 * @returns Nazwa statusu po polsku
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
    switch (status) {
        case PaymentStatus.Paid:
            return 'Opłacona';
        case PaymentStatus.PartiallyPaid:
            return 'Częściowo opłacona';
        case PaymentStatus.Unpaid:
            return 'Nieopłacona';
        case PaymentStatus.Overdue:
            return 'Zaległa';
        default:
            return status || '-';
    }
};