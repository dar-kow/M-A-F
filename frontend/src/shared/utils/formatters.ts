/**
 * Zbiór funkcji pomocniczych do formatowania danych w aplikacji
 */

/**
 * Formatuje datę do lokalnego formatu
 * @param date - Data w formacie string lub Date
 * @returns Sformatowana data lub '-' w przypadku braku lub błędu
 */
export const formatDate = (date: any): string => {
    if (!date) return '-';

    try {
        return new Date(date).toLocaleDateString('pl-PL');
    } catch (e) {
        console.error("Error formatting date:", date, e);
        return '-';
    }
};

/**
 * Formatuje kwotę do lokalnego formatu z symbolem waluty
 * @param amount - Kwota do sformatowania
 * @returns Sformatowana kwota lub '-' w przypadku braku lub błędu
 */
export const formatAmount = (amount: any): string => {
    if (amount === undefined || amount === null) return '-';

    try {
        return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(Number(amount));
    } catch (e) {
        console.error("Error formatting amount:", amount, e);
        return '-';
    }
};

/**
 * Formatuje metodę płatności na czytelny tekst po polsku
 * @param method - Kod metody płatności
 * @returns Przetłumaczona nazwa metody płatności
 */
export const formatPaymentMethod = (method: string): string => {
    switch (method) {
        case 'Cash': return 'Gotówka';
        case 'Transfer': return 'Przelew';
        case 'Card': return 'Karta';
        case 'Other': return 'Inne';
        default: return method || '-';
    }
};