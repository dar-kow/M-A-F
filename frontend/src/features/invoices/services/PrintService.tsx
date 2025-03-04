import { toast } from 'react-toastify';
import { Invoice } from '@app-types/types';

/**
 * Interfejs dla faktury z nazwą kontrahenta
 */
export interface InvoiceWithContractorName extends Invoice {
    contractorName?: string;
}

/**
 * Konfiguracja wydruku
 */
interface PrintConfig {
    title?: string;
    dateFormat?: Intl.DateTimeFormatOptions;
    currencyFormat?: Intl.NumberFormatOptions;
    locale?: string;
}

/**
 * Serwis do generowania i obsługi wydruków
 */
export class PrintService {
    /**
     * Generuje i otwiera okno wydruku dla listy faktur
     * 
     * @param invoices Lista faktur do wydruku
     * @param searchTerm Opcjonalny termin wyszukiwania do filtrowania listy
     * @param config Opcjonalna konfiguracja wydruku
     * @returns true jeśli wydruk został zainicjowany pomyślnie
     */
    static printInvoiceList(
        invoices: InvoiceWithContractorName[],
        searchTerm: string = '',
        config: PrintConfig = {}
    ): boolean {
        // Ustawienia domyślne
        const defaultConfig: PrintConfig = {
            title: 'Lista faktur',
            dateFormat: { day: '2-digit', month: '2-digit', year: 'numeric' },
            currencyFormat: { style: 'currency', currency: 'PLN' },
            locale: 'pl-PL'
        };

        // Łączenie konfiguracji
        const settings = { ...defaultConfig, ...config };

        // Tworzymy nowe okno do wydruku
        const printWindow = window.open('', '_blank', 'height=600,width=800');

        if (!printWindow) {
            toast.error('Nie można otworzyć okna wydruku. Sprawdź blokadę wyskakujących okienek.');
            return false;
        }

        // Filtrowanie faktur jeśli podano searchTerm
        const filteredInvoices = searchTerm
            ? invoices.filter(invoice =>
                invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (invoice.contractorName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            )
            : invoices;

        // Przygotowujemy dane do wydruku
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${settings.title} - Wydruk</title>
                <meta charset="utf-8" />
                <style>
                    body { 
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table { 
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td { 
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                        font-size: 12px;
                    }
                    th { 
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    h1 { 
                        text-align: center;
                        font-size: 18px;
                        margin-bottom: 5px;
                    }
                    .print-date { 
                        text-align: right;
                        font-size: 12px;
                        color: #666;
                        margin-bottom: 20px;
                    }
                    @media print {
                        body { margin: 0; }
                        h1 { font-size: 16px; }
                        th, td { font-size: 11px; padding: 5px; }
                        .print-date { font-size: 10px; }
                    }
                </style>
            </head>
            <body>
                <h1>${settings.title}</h1>
                <div class="print-date">Data wydruku: ${new Date().toLocaleString(settings.locale)}</div>
                <table>
                    <thead>
                        <tr>
                            <th>Numer</th>
                            <th>Kontrahent</th>
                            <th>Data wystawienia</th>
                            <th>Metoda płatności</th>
                            <th>Kwota</th>
                            <th>Termin płatności</th>
                            <th>Status</th>
                            <th>Zapłacono</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredInvoices.map(invoice => `
                            <tr>
                                <td>${invoice.number}</td>
                                <td>${invoice.contractorName || '-'}</td>
                                <td>${new Date(invoice.issueDate).toLocaleDateString(settings.locale, settings.dateFormat)}</td>
                                <td>${invoice.paymentMethod}</td>
                                <td>${new Intl.NumberFormat(settings.locale, settings.currencyFormat).format(Number(invoice.totalAmount))}</td>
                                <td>${new Date(invoice.dueDate).toLocaleDateString(settings.locale, settings.dateFormat)}</td>
                                <td>${invoice.paymentStatus}</td>
                                <td>${new Intl.NumberFormat(settings.locale, settings.currencyFormat).format(Number(invoice.paidAmount || 0))}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        // Wstawiamy zawartość do okna wydruku i drukujemy
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Czekamy na załadowanie zawartości i wywołujemy drukowanie
        printWindow.onload = function () {
            printWindow.print();
        };

        return true;
    }

    /**
     * Generuje i otwiera okno wydruku dla pojedynczej faktury (szczegóły)
     * Możesz rozszerzyć tę metodę w przyszłości
     * 
     * @param invoice Faktura do wydruku
     * @param config Opcjonalna konfiguracja wydruku
     * @returns true jeśli wydruk został zainicjowany pomyślnie
     */
    static printInvoiceDetails(
        _invoice: InvoiceWithContractorName,
        _config: PrintConfig = {}
    ): boolean {
        // Implementacja drukowania szczegółów faktury
        // Możesz ją dodać w przyszłości

        toast.info('Funkcja drukowania szczegółów faktury zostanie dodana wkrótce.');
        return false;
    }
}

export default PrintService;