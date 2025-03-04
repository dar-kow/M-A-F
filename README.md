# M-A-F - Moja Aplikacja Faktur

![Version](https://img.shields.io/badge/version-0.5.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?logo=typescript)
![Material UI](https://img.shields.io/badge/MUI-5.14.0-007FFF?logo=mui)

Zaawansowana aplikacja do zarządzania fakturami i kontrahentami zbudowana na bazie React, TypeScript oraz Material UI.

[Zobacz changelog](https://github.com/darek9k/M-A-F/blob/main/changelog.md)

## Spis treści

- Przegląd projektu
- Technologie
- Kluczowe funkcjonalności
- Architektura
- Komponenty
- Hooki własne
- Instalacja i uruchomienie
- TODO

## Przegląd projektu

MAF to kompleksowa aplikacja webowa do zarządzania fakturami i kontrahentami, zbudowana w oparciu o React oraz backend w .NET z bazą danych PostgreSQL. Projekt został zorganizowany według wzorca Atomic Design i implementuje najlepsze praktyki programistyczne.

## Technologie

### Frontend
- **React 18** - Biblioteka UI z funkcyjnymi komponentami i hookami
- **TypeScript** - Statyczne typowanie dla bezpieczniejszego kodu
- **Redux** + **Redux-Saga** - Zarządzanie globalnym stanem i operacjami asynchronicznymi
- **Material UI** - Biblioteka komponentów UI zgodna z Material Design
- **MUI X DataGrid** - Zaawansowane komponenty tabelaryczne z filtrowaniem i sortowaniem
- **React Hook Form** - Zarządzanie formularzami z walidacją
- **Luxon** - Obsługa dat i formatów czasowych
- **Axios** - Klient HTTP do komunikacji z API
- **SCSS** - Rozszerzone style CSS z modułami
- **Vite** - Narzędzie do budowania aplikacji

### Backend
- **.NET** - Framework do aplikacji serwerowych
- **PostgreSQL** - System bazy danych (uruchamiany w kontenerze Docker)
- **Entity Framework** - ORM do zarządzania bazą danych

## Kluczowe funkcjonalności

### Zarządzanie fakturami
- ✅ Dodawanie, edycja i usuwanie faktur
- ✅ Dynamiczne obliczanie wartości netto, VAT i brutto
- ✅ Automatyczne generowanie numerów faktur
- ✅ Zarządzanie pozycjami faktury (dodawanie/usuwanie)
- ✅ Różne stawki VAT i jednostki miary

### Zaawansowane tabele danych (MUI X DataGrid)
- ✅ Filtry nagłówkowe aktywowane przez prawy przycisk myszy
- ✅ Zapisywanie preferencji użytkownika (widoczność i kolejność kolumn)
- ✅ Responsywna wysokość tabeli dopasowana do ekranu
- ✅ Niestandardowe komponenty filtrowania i sortowania
- ✅ Optymalizacja wydajności dla dużych zbiorów danych

```tsx
// Przykład zaawansowanego filtra nagłówkowego z InvoiceDataGrid
const renderFilterHeader = React.useCallback((params: any, placeholder: string) => (
    <ClickAwayListener onClickAway={handleClickAwayFilter}>
        <div>
            <InvoiceFilterHeader
                params={params}
                placeholder={placeholder}
                value={columnFilters[params.field] || ''}
                onChange={handleColumnFilterChange}
                onClear={clearColumnFilter}
                isActive={activeFilterField === params.field}
            />
        </div>
    </ClickAwayListener>
), [columnFilters, handleColumnFilterChange, clearColumnFilter, activeFilterField]);
```

### Interfejs użytkownika
- ✅ Responsywne menu boczne (dynamiczne zwijanie/rozwijanie)
- ✅ Płynne animacje przejść między stronami
- ✅ System powiadomień z react-toastify
- ✅ Modalne okna podglądu i potwierdzenia akcji
- ✅ Responsywny layout dostosowany do różnych urządzeń

```tsx
// Przykład animowanego menu z Sidebar.tsx
const handleNavigation = (path: string) => {
    if (location.pathname === path) return;

    if (location.pathname === '/' && path !== '/') {
        setIsTransitioning(true);
        setCollapsed(true);

        setTimeout(() => {
            navigate(path);
            setIsTransitioning(false);
        }, 300); // Animacja zwinięcia menu
    } else {
        navigate(path);
    }
};
```

### System drukowania i raportów
- ✅ Generowanie wydruków dla list faktur
- ✅ Formatowanie danych do wydruku
- ✅ Filtrowanie danych przed wydrukiem
- ✅ Dostosowywanie wyglądu wydruków

### Zarządzanie formularzami
- ✅ Wykorzystanie React Hook Form do obsługi formularzy
- ✅ Walidacja danych wejściowych
- ✅ Dynamiczne obliczanie wartości podczas edycji
- ✅ Zaawansowane formatowanie pól liczbowych i dat

## Architektura

### Struktura katalogów
```
frontend/
├── src/
│   ├── features/              # Funkcjonalności podzielone tematycznie
│   │   ├── invoices/          # Moduł faktur
│   │   ├── contractors/       # Moduł kontrahentów
│   │   └── dashboard/         # Moduł dashboardu
│   ├── shared/                # Komponenty współdzielone
│   │   ├── components/        # Komponenty UI
│   │   ├── layouts/           # Układy stron
│   │   ├── services/          # Usługi (API, drukowanie)
│   │   └── utils/             # Funkcje pomocnicze
│   ├── store/                 # Konfiguracja Redux
│   └── types/                 # Definicje typów TypeScript
└── public/                    # Zasoby statyczne
```

### Wzorzec przepływu danych
Aplikacja wykorzystuje jednokierunkowy przepływ danych:
1. **Actions** - Akcje Redux definiujące intencje użytkownika
2. **Sagas** - Obsługa efektów ubocznych (API, asynchro)
3. **Reducers** - Aktualizacja stanu na podstawie wyników akcji
4. **Selectors** - Pobieranie i transformacja danych ze stanu
5. **Components** - Renderowanie UI na podstawie danych

## Komponenty

### InvoiceDataGrid
Zaawansowana tabela do wyświetlania faktur z rozszerzeniami MUI X DataGrid:

```tsx
<DataGrid
    rows={showData ? filteredData : []}
    columns={sortedColumns}
    loading={isLoading || !showData}
    columnVisibilityModel={columnVisibilityModel}
    onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
    slots={{
        loadingOverlay: TableLoadingOverlay,
    }}
    disableColumnMenu={true}
    // ...więcej właściwości konfiguracyjnych
/>
```

Funkcje:
- Zapisywanie preferencji użytkownika w localStorage
- Responsywna wysokość z użyciem ResizeObserver
- Niestandardowe filtry nagłówkowe
- Sortowanie i przestawianie kolumn
- Optymalizowane filtrowanie danych

### InvoiceFilterHeader
Zaawansowany komponent filtrowania dla nagłówków tabeli:

```tsx
const InvoiceFilterHeader = ({
    params,
    placeholder,
    value,
    onChange,
    onClear,
    isActive = false
}: InvoiceFilterHeaderProps) => {
    // Implementacja filtrowania z portali React dla popupów
    // i tooltipów poza strukturą DOM tabeli
};
```

Funkcje:
- Aktywacja filtra przez prawy przycisk myszy
- Tooltip podpowiadający sposób użycia
- Automatyczne pozycjonowanie popupów
- Zachowywanie stanu aktywnych filtrów

### InvoiceItemsTable
Dynamiczna tabela do zarządzania pozycjami faktury:

```tsx
<Table size="small" className="invoice-items-table">
    <TableHead>
        {/* Nagłówki kolumn */}
    </TableHead>
    <TableBody>
        {fields.map((field, index) => (
            <TableRow key={field.id}>
                {/* Komórki z edytowalnymi polami */}
            </TableRow>
        ))}
        {/* Wiersz podsumowania */}
    </TableBody>
</Table>
```

Funkcje:
- Dynamiczne dodawanie/usuwanie pozycji
- Automatyczne obliczanie wartości netto, VAT i brutto
- Natychmiastowe przeliczanie przy zmianach
- Obsługa różnych jednostek i stawek VAT

### Sidebar
Interaktywne menu boczne z animacjami:

```tsx
<aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
    {/* Zawartość menu */}
    <ul className="menu">
        <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
            <a className="menu-link" onClick={/* handler */}>
                <DashboardIcon className="menu-icon" />
                {!collapsed && <span className="menu-text">Dashboard</span>}
            </a>
        </li>
        {/* Więcej pozycji menu */}
    </ul>
</aside>
```

Funkcje:
- Animowane przejścia między stronami
- Automatyczne zwijanie przy przejściu z dashboardu
- Podświetlanie aktywnych elementów menu
- Responsywne zachowanie na różnych ekranach

## Hooki własne

### useInvoiceForm
Zaawansowany hook zarządzający logiką formularza faktur:

```typescript
export function useInvoiceForm(isEdit: boolean, invoiceId?: number) {
    // Stan formularza, walidacja i obsługa dynamicznych pól
    
    // Obserwowanie zmian w polach faktury
    useEffect(() => {
        const subscription = formMethods.watch((_, { name }) => {
            if (name?.startsWith('items.') && (
                name.includes('.quantity') ||
                name.includes('.unitPrice') ||
                name.includes('.vatRate')
            )) {
                forceUpdate();
            }
        });
        return () => subscription.unsubscribe();
    }, [formMethods, forceUpdate]);
    
    // Automatyczne generowanie numeru faktury
    useEffect(() => {
        if (!isEdit && lastInvoiceNumber && !watch('invoiceNumber')) {
            // Logika generowania numeru faktury
        }
    }, [lastInvoiceNumber, isEdit]);
    
    // Więcej logiki formularza...
}
```

Funkcje:
- Zarządzanie stanem formularza z React Hook Form
- Obserwowanie zmian w pozycjach faktury
- Automatyczne generowanie numerów faktur
- Wypełnianie formularza danymi do edycji

### useInvoiceTotals
Hook obliczający sumy dla faktury:

```typescript
export function useInvoiceTotals(items?: InvoiceItem[]) {
    const [totals, setTotals] = useState({
        netTotal: 0,
        vatTotal: 0,
        grossTotal: 0
    });

    // Stringifikacja dla stabilności zależności
    const itemsString = JSON.stringify(items);

    useEffect(() => {
        if (items && items.length > 0) {
            let netTotal = 0;
            let vatTotal = 0;

            items.forEach(item => {
                // Bezpieczna konwersja i obliczenia
                const quantity = parseFloat(String(item.quantity || 0));
                const unitPrice = parseFloat(String(item.unitPrice || 0));
                const vatRate = parseFloat(String(item.vatRate || 0));

                const itemNet = quantity * unitPrice;
                const itemVat = itemNet * (vatRate / 100);

                netTotal += itemNet;
                vatTotal += itemVat;
            });

            const grossTotal = netTotal + vatTotal;

            setTotals({ netTotal, vatTotal, grossTotal });
        } else {
            setTotals({ netTotal: 0, vatTotal: 0, grossTotal: 0 });
        }
    }, [itemsString]);

    return totals;
}
```

## Instalacja i uruchomienie

### Wymagania
- Node.js 16+ i npm
- Docker dla bazy danych
- .NET 7 SDK dla backendu

### Uruchomienie w trybie deweloperskim

1. **Uruchomienie backendu z bazą danych**
```bash
cd backend
docker-compose -f docker-compose.dev.yml up --build
dotnet ef database update  # Aktualizacja schematu bazy danych
dotnet run --environment Development
```

2. **Uruchomienie frontendu**
```bash
cd frontend
npm install
npm run dev
```

### Reset zależności (w razie problemów)
```bash
npm run rebuild:full  # Usuwa node_modules, cache i instaluje wszystko na nowo
```

## Przykładowe implementacje

### Dynamiczne filtry nagłówkowe

```tsx
// Filtrowanie danych w tabeli
const filteredData = React.useMemo(() => {
    if (Object.keys(columnFilters).length === 0) return invoices;

    return invoices.filter(invoice => {
        return Object.entries(columnFilters).every(([field, filterValue]) => {
            if (!filterValue) return true;

            let value;
            if (field === 'paymentStatus') {
                value = getPaymentStatusLabel(invoice[field] as PaymentStatus).toLowerCase();
            } else if (field === 'issueDate' || field === 'dueDate') {
                value = formatDate(invoice[field]).toLowerCase();
            } else if (field === 'totalAmount' || field === 'paidAmount') {
                const amount = Number(invoice[field] || 0);
                value = amount.toString().toLowerCase();
            } else {
                value = String(invoice[field] || '').toLowerCase();
            }

            return value.includes(filterValue.toLowerCase());
        });
    });
}, [invoices, columnFilters]);
```

### System wydruku faktur

```typescript
// Generowanie wydruku listy faktur
static printInvoiceList(
    invoices: InvoiceWithContractorName[],
    searchTerm: string = '',
    config: PrintConfig = {}
): boolean {
    // Konfiguracja i generowanie HTML do wydruku
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${settings.title} - Wydruk</title>
            <meta charset="utf-8" />
            <style>
                /* Style do wydruku */
            </style>
        </head>
        <body>
            <h1>${settings.title}</h1>
            <table>
                <!-- Nagłówki tabeli -->
                <tbody>
                    ${filteredInvoices.map(invoice => `
                        <tr>
                            <!-- Komórki danych -->
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Otwieranie okna wydruku i przekazanie HTML
    printWindow.document.write(printContent);
}
```

## TODO

- [x] ~~Refaktoryzacja komponentów TypeScript~~
- [ ] Testy jednostkowe dla komponentów React
- [ ] Migracja do React Query dla lepszego zarządzania stanem asynchronicznym
- [ ] Rozszerzenie systemu raportów i wydruków
- [ ] Eksport danych do formatów CSV/Excel
- [ ] Panel administracyjny
- [ ] Integracja z API banków do śledzenia płatności
- [ ] Szablony faktur do wyboru przy wydruku
- [ ] Tryb offline z synchronizacją po połączeniu

---

## Dla deweloperów

### Hooki React - Na chłopski rozum

- **useState** - Dodawanie pamięci do komponentów funkcyjnych
- **useEffect** - Wykonywanie efektów ubocznych (np. pobieranie danych)
- **useMemo** - Zapamiętywanie kosztownych obliczeń
- **useCallback** - Zapamiętywanie funkcji między renderami
- **useRef** - Dostęp do elementów DOM lub przechowywanie wartości bez powodowania renderowania

### Redux - Krótko i na temat

- **Store** - Centralne miejsce przechowywania stanu aplikacji
- **Actions** - Komunikaty informujące o zamiarze zmiany stanu
- **Reducers** - Funkcje przekształcające stary stan w nowy na podstawie akcji
- **Selectors** - Funkcje wyciągające i transformujące dane ze stanu

### Dobre praktyki

- Używaj TypeScript dla silnego typowania
- Komponenty funkcyjne z hookami zamiast klas
- Walidacja danych wejściowych formularzy
- Optymalizacja renderowania z useMemo i useCallback
- Dzielenie komponentów na mniejsze, reużywalne części

[Zobacz pełny changelog](https://github.com/darek9k/M-A-F/blob/main/changelog.md)

---

© 2025 M-A-F Team. Korzystaj, kopiuj, modyfikuj.