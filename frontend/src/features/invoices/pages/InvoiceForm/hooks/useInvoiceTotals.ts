import { useState, useEffect } from 'react';

type InvoiceItem = {
    quantity: number;
    unitPrice: number;
    vatRate: number;
};

export function useInvoiceTotals(items?: InvoiceItem[]) {
    const [totals, setTotals] = useState({
        netTotal: 0,
        vatTotal: 0,
        grossTotal: 0
    });

    // Dodaj dependencję na stringifikowany obiekt items
    const itemsString = JSON.stringify(items);

    useEffect(() => {
        if (items && items.length > 0) {
            let netTotal = 0;
            let vatTotal = 0;

            items.forEach(item => {
                // Bezpieczna konwersja i parsowanie wartości
                const quantity = parseFloat(String(item.quantity || 0));
                const unitPrice = parseFloat(String(item.unitPrice || 0));
                const vatRate = parseFloat(String(item.vatRate || 0));

                // Obliczenie wartości dla pozycji
                const itemNet = quantity * unitPrice;
                const itemVat = itemNet * (vatRate / 100);

                netTotal += itemNet;
                vatTotal += itemVat;
            });

            const grossTotal = netTotal + vatTotal;

            setTotals({
                netTotal,
                vatTotal,
                grossTotal
            });
        } else {
            setTotals({ netTotal: 0, vatTotal: 0, grossTotal: 0 });
        }
    }, [itemsString]); // Używaj stringifikowanej wersji jako zależności

    return totals;
}