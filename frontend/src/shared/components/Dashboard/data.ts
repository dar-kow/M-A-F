// Dane do wyświetlania na dashboardzie

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
            "Zarządzanie fakturami",
            "Zarządzanie kontrahentami",
            "Zaawansowane filtry w tabeli faktur",
            "Nowy responsywny interfejs",
            "System sortowania kolumn",
            "Drukowanie tabeli faktur",
            "Sekcja podsumowania nowej faktury",
            "Loader podczas ładowania danych",
            "Optymalizacja wydajności",
        ]
    },
    {
        title: "W trakcie",
        color: "info",
        items: [
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
            "Dodanie debounce do wyszukiwarki",
            "Wdrożenie x-data-grid do Kontrahenci",
            "Podgląd faktury w nowym oknie",
            "Rozliczanie faktur z listy",
            "AKtualizacja płatności na podstawie wpłat",
            "Ostylowanie dla wersji mobilnej",
            "Testy API",
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