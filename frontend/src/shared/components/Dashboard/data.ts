export interface ProjectStatusSection {
    title: string;
    color: string;
    items: string[];
}

export const projectStatus = [
    {
        title: "Zaimplementowane",
        color: "primary",
        items: [
            "Dodanie tooltipów na liście faktur",
            "Poprawki sidebra",
            "Testy API",
            "Refaktoryzacja kodu InvoiceDataGrid - wydzielenie hooków",
            "Dodanie animacje do sidebaru",
            "Optymalizacja wydajności",
            "Loader podczas ładowania danych",
            "Sekcja podsumowania nowej faktury",
            "Drukowanie tabeli faktur",
            "System sortowania kolumn",
            "Nowy responsywny interfejs",
            "Zaawansowane filtry w tabeli faktur",
            "Zarządzanie kontrahentami",
            "Zarządzanie fakturami"
        ]
    },
    {
        title: "W trakcie",
        color: "info",
        items: [
            "Poprawa funkcjonalności Faktury",
            "Poprawa statusów płaności",
            "Dashboard z dynamicznymi wykresami",
            "System powiadomień",
            "Optymalizacja wydajności",
            "Ostylowanie tabeli",
            "Aktualizacja paczek npm",
            "Komunikacja z backendem",
        ]
    },
    {
        title: "Do zrobienia",
        color: "secondary",
        items: [
            "Dopracowanie typów stawka Vat",
            "Dodanie debounce do wyszukiwarki",
            "Wdrożenie x-data-grid do Kontrahenci",
            "Podgląd faktury w nowym oknie",
            "Rozliczanie faktur z listy",
            "AKtualizacja płatności na podstawie wpłat",
            "Ostylowanie dla wersji mobilnej",
            "Testy E2E Frontendu"
        ]
    }
];

// Opcje dla wykresów
export const chartOptions = {
    payments: {
        labels: ["Opłacone", "Zaległe", "Oczekujące"],
        colors: ["#4CAF50", "#f44336", "#FFC107"]
    },

    monthlyRevenue: {
        labels: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"]
    },

    categories: {
        labels: ["Usługi", "Produkty", "Konsultacje", "Szkolenia", "Wsparcie"],
        colors: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
        ]
    }
};