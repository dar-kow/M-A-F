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
      "Dark mode dla całej aplikacji",
      "Automatyczne rozliczanie faktur z poziomu listy",
      "Rozliczanie faktur po stronie backendu",
      "Rozbudowa systemu powiadomień o zdarzeniach płatności",
      "Domyślne sortowanie faktur po dacie wystawienia malejąco",
      "Dashboard z dynamicznymi wykresami",
      "Dodanie tooltipów na liście kontrahentów",
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
      "Zarządzanie fakturami",
    ],
  },
  {
    title: "W trakcie",
    color: "info",
    items: [
      "System powiadomień",
      "Optymalizacja wydajności",
      "Ostylowanie tabeli",
      "Aktualizacja paczek npm",
      "Komunikacja z backendem",
    ],
  },
  {
    title: "Do zrobienia",
    color: "secondary",
    items: [
      "Dopracowanie typów stawka Vat",
      "Dodanie debounce do wyszukiwarki",
      "Wdrożenie x-data-grid do Kontrahenci",
      "Podgląd faktury w nowym oknie",
      "Ostylowanie dla wersji mobilnej",
      "Testy E2E Frontendu",
      "Integracja z API banków do śledzenia płatności",
      "System powiadomień o zbliżających się terminach płatności",
    ],
  },
];

// Kolory dla jasnego motywu
export const lightChartColors = {
  payments: {
    labels: ["Opłacone", "Nieopłacone", "Częściowo opłacone"],
    colors: ["#4CAF50", "#f44336", "#FFC107"],
  },
  monthlyRevenue: {
    borderColor: '#3f51b5',
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
  },
  categories: {
    labels: ["Usługi", "Produkty", "Konsultacje", "Szkolenia", "Wsparcie"],
    colors: [
      "rgba(75, 192, 192, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ],
  },
};

// Kolory dla ciemnego motywu
export const darkChartColors = {
  payments: {
    labels: ["Opłacone", "Nieopłacone", "Częściowo opłacone"],
    colors: ["#66bb6a", "#ff5252", "#ffca28"],
  },
  monthlyRevenue: {
    borderColor: '#42a5f5',
    backgroundColor: 'rgba(66, 165, 245, 0.1)',
  },
  categories: {
    labels: ["Usługi", "Produkty", "Konsultacje", "Szkolenia", "Wsparcie"],
    colors: [
      "rgba(102, 187, 106, 0.7)",
      "rgba(66, 165, 245, 0.7)",
      "rgba(255, 238, 88, 0.7)",
      "rgba(171, 71, 188, 0.7)",
      "rgba(255, 167, 38, 0.7)",
    ],
  },
};

export const chartOptions = {
  monthlyRevenue: {
    labels: [
      "Sty",
      "Lut",
      "Mar",
      "Kwi",
      "Maj",
      "Cze",
      "Lip",
      "Sie",
      "Wrz",
      "Paź",
      "Lis",
      "Gru",
    ],
  },
};

// Funkcja do generowania opcji wykresu w zależności od motywu
export const getChartOptions = (isDarkMode: boolean) => {
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  
  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(33, 33, 33, 0.95)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
          borderColor: gridColor,
        },
      },
      y: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
          borderColor: gridColor,
        },
      },
    },
  };
};
