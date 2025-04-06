# Changelog

## v0.5.3 - sidebar toggle aktywacyjny - 2025.04.06
- Dodano automatyczną detekcję pozycji kursora myszy po zakończeniu animacji zwijania
- Przycisk toggle pojawia się teraz prawidłowo, gdy kursor znajduje się nad ikonami menu
- Zaimplementowano precyzyjną detekcję pozycji kursora względem obszaru menu
- Przycisk toggle znika teraz poprawnie po opuszczeniu obszaru sidebara
- Poprawka na wykresie w dashboard - wyświetlanie tooltipa też przy linni miesiąca
- Dodanie tootlipów na liście faktur

## v0.5.2 - Kosmetyka dashboard'u
- zmiana reakcji toogle na hover w sidebarze
- wyrównanie kafelków

## v0.5.1 - Poprawa funkcjonalności faktur
- walidacja daty płatości nie może być wcześnejsza niż wystawienia
- pobieranie daty podczas edycji faktury
- Polski format daty dd.mm.yyyy
- polskie nazewnictwo w dataPickerze

## v0.5.0 - Refaktoryzacja i poprawki TypeScript - 2025.03.04
- Rozwiązanie wszystkich błędów kompatybilności TypeScript w aplikacji
- Optymalizacja typów w komponentach React
- Usunięcie nieużywanych zmiennych i importów
- Poprawki w interfejsach komponentów dla lepszej kompatybilności
- Aktualizacja referencji typów dla pracy z Vite

## v0.4.9 - System wydruku i raportowania - 2025.02.25
- Implementacja serwisu PrintService do generowania wydruków
- Możliwość drukowania listy faktur z filtrami
- Generowanie raportów PDF z podsumowaniem finansowym
- Eksport danych do formatów CSV/Excel
- Interfejs do personalizacji wydruków

## v0.4.8 - Rozszerzona obsługa DataGrid - 2025.02.14
- Implementacja komponentu TableLoadingOverlay dla lepszego UX
- Animacje przy ładowaniu danych w tabelach
- Optymalizacja renderowania dużych zestawów danych
- Obsługa błędów ładowania danych w tabelach

## v0.4.7 - Optymalizacja sortowania i filtrowania - 2025.02.07
- Przepisanie obsługi filtrów do komponentu InvoiceFilterHeader
- Zaawansowane menu sortowania kolumn z zapisem preferencji
- Możliwość resetowania ustawień kolumn do wartości domyślnych
- Zapisywanie ustawień kolumn w lokalnym storage

## v0.4.6 - Rozszerzone formularze - 2025.01.28
- Rozbudowa InvoiceBasicInfo o nowe pola
- Refaktoryzacja InvoiceItemsTable dla lepszej wydajności i UX
- Dynamiczne obliczanie sum i wartości podatku w formularzu
- Obsługa różnych jednostek miary i stawek VAT

## v0.4.5 - Zaawansowane filtry - 2025.01.20
- Implementacja filtrów w nagłówkach kolumn DataGrid
- Pamięć ostatnio używanych filtrów
- Filtrowanie danych po wielu kryteriach jednocześnie
- Wskaźniki wizualne aktywnych filtrów

## v0.4.4 - Integracja MUI X DataGrid Pro - 2025.01.12
- Wymiana tabel na komponenty DataGrid z Material-UI X
- Implementacja zaawansowanych opcji sortowania i filtrowania
- Eksport danych z tabel do CSV/PDF
- Dostosowanie wyglądu DataGrid do stylizacji aplikacji
- Wsparcie dla responsywnych tabel na urządzeniach mobilnych

## v0.4.3 - Rozbudowa dashboardu - 2025.01.05
- Dodanie wykresów sprzedaży i należności
- Widżety z podsumowaniem faktur oczekujących na zapłatę
- Interaktywne wykresy z filtracją po datach
- Prezentacja trendów sprzedażowych
- Widget z najnowszymi fakturami

## v0.4.2 - Pełna integracja React Hook Form - 2024.12.28
- Refaktoryzacja wszystkich formularzy do React Hook Form
- Utworzenie własnych komponentów do obsługi formularzy
- Obsługa walidacji i wyświetlania błędów w formularzach
- Implementacja useInvoiceForm i useInvoiceTotals hooks
- Optymalizacja wydajności przy renderowaniu formularzy

## v0.4.1 - Obsługa płatności
- Aktualizacja statusu płatności faktury
- Logika ograniczająca wprowadzanie kwoty większej niż brutto
- Obsługa różnych stawek VAT w podsumowaniu

## v0.4.0 - Filtrowanie i organizacja kodu
- Wyniesienie logiki filtrów/list/akcji do osobnych komponentów
- Komponenty do obsługi filtrów
- Możliwość czyszczenia poszczególnych filtrów
- Wizualne ujednolicenie ikon w menu akcji

## v0.3.9 - Zaawansowany UX dla tabel - 2024.12.10
- Możliwość zmiany kolejności kolumn przez przeciąganie
- Zapisywanie preferowanej szerokości kolumn
- Niestandardowe nagłówki kolumn z ikonami i tooltipami
- Warunkowo kolorowane wiersze w zależności od statusu

## v0.3.8 - Optymalizacja stanów aplikacji - 2024.12.01
- Refaktoryzacja zarządzania stanem globalnym
- Optymalizacja selektorów Redux
- Implementacja pamięci podręcznej dla często używanych danych
- Redukcja ilości przerenderowań komponentów

## v0.3.7 - Rozszerzone akcje na listach - 2024.11.23
- Implementacja menu kontekstowego dla wierszy w tabelach
- Szybkie akcje bezpośrednio z listy (zmiana statusu, kopiowanie)
- Akcje masowe dla wybranych elementów
- Potwierdzenia akcji nieodwracalnych

## v0.3.6 - Stylizacja i animacje - 2024.11.15
- Przebudowa systemu animacji przejść między widokami
- Udoskonalenie animacji rozwijania/zwijania menu
- Efekty hover dla elementów interaktywnych
- Animowane powiadomienia i modalne okna
- Spójny system cieni i głębokości elementów

## v0.3.5 - Optymalizacja formularzy - 2024.11.07
- Implementacja mechanizmu krokowego dla rozbudowanych formularzy
- Obsługa autouzupełniania pól formularzy
- Zapisywanie wersji roboczych formularzy
- Dynamiczne walidatory zależne od kontekstu

## v0.3.4 - Rozbudowa narzędzi deweloperskich - 2024.10.30
- Implementacja trybu deweloperskiego z dodatkowymi informacjami
- Narzędzia do debugowania stanu Redux
- Lepsza obsługa błędów z informacjami dla developera
- Metryki wydajności i śledzenie renderowania

## v0.3.3 - Obsługa błędów - 2024.10.22
- Rozbudowane mechanizmy obsługi błędów API
- Inteligentne ponowne próby dla nieudanych zapytań
- Użytkownikowi przyjazne komunikaty błędów
- System statusów dla długotrwałych operacji

## v0.3.2 - Rozbudowa funkcjonalności drukowania - 2024.10.15
- Podgląd wydruku faktur przed drukowaniem
- Opcje dostosowania formatu wydruku
- Różne szablony wydruków do wyboru
- Generowanie faktur w formacie PDF

## v0.3.1 - Poprawki w interfejsie użytkownika
- PageHeader dla formularza z informacją „Dodaj/Edycja"
- Search jako props do PageHeadera
- Poprawki stylów listy faktur
- Sticky nagłówki kolumn

## v0.3.0 - System powiadomień
- Dodanie `react-toastify` dla operacji edycji i usuwania kontrahenta
- Powiadomienia przy usuwaniu faktur
- TruncatedCell - tooltip dla zawiniętych tekstów

## v0.2.2 - Walidacja i UX
- Dodanie walidacji pól formularzy (tylko frontend)
- Poprawa UX listy faktur i kontrahentów
- Dodanie modalnego okna przy usuwaniu kontrahenta

## v0.2.1 - Optymalizacja wydajności
- Memoizacja fetchInvoices za pomocą useCallback
- Tłumaczenie enumów na nazwy polskie

## v0.2.0 - Rozbudowa modelu i funkcjonalności
- Dodanie pola PaymentStatus do modelu faktury
- Rozszerzenie modelu kontrahenta
- Implementacja obsługi metod płatności
- Blokowanie daty wystawienia faktury w przeszłości
- Termin płatności >= data wystawienia

## v0.1.4 - Stylizacja
- Poprawa wyglądu menu
- Owinięcie przycisku "Dodaj fakturę" w kontener
- Globalna czcionka ustawiona na Mulish
- Animacje ikon Home i menu hamburgera
- Menu hamburgera z efektem fadeInDown
- Poprawki z-index dla poprawnego wyświetlania menu

## v0.1.3 - Usprawnienia interakcji
- Dodanie menu hamburgerowego
- PageHeader z opcjami nawigacyjnymi
- Ukrywanie menu po kliknięciu poza jego obszar

## v0.1.2 - Dashboard i UI
- Zbudowanie dashboardu
- Ostylowanie list faktur i kontrahentów
- Dodanie buttonów z odpowiednimi stylami

## v0.1.1 - Podstawowa funkcjonalność faktur
- Dodawanie, edycja, usuwanie faktur
- Dodawanie, edycja kontrahentów (usuwanie tylko tych, którzy nie mają faktur)

## v0.1.0 - Inicjalizacja projektu
- Utworzenie aplikacji backendowej w .NET z PostgreSQL w kontenerze
- Tryby uruchamiania: normalny i developerski
- Struktura projektu frontendu w React

## Planowane funkcjonalności:
- Testy i poprawki walidacji formularzy
- Dalsza rozbudowa pozycji na fakturze
- Szablony faktur do wyboru przy wydruku
- Integracja z API banków do śledzenia płatności
- Panel raportów i analityki
- System powiadomień o zbliżających się terminach płatności
- Aplikacja mobilna do szybkiego dostępu
- Tryb offline z synchronizacją po połączeniu