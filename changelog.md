# Changelog

##
- poprawienie formularza dodawania faktur na urządzeniach mobilnych (responsywność)



## v0.4.1 - Obsługa płatności
- Aktualizacja statusu płatności faktury
- Logika ograniczająca wprowadzanie kwoty większej niż brutto
- Obsługa różnych stawek VAT w podsumowaniu

## v0.4.0 - Filtrowanie i organizacja kodu
- Wyniesienie logiki filtrów/list/akcji do osobnych komponentów
- Komponenty do obsługi filtrów
- Możliwość czyszczenia poszczególnych filtrów
- Wizualne ujednolicenie ikon w menu akcji

## v0.3.1 - Poprawki w interfejsie użytkownika
- PageHeader dla formularza z informacją „Dodaj/Edycja”
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

## TO DO:
- Testy i poprawki walidacji formularzy
- Obsługa pozycji na fakturze
- Doprecyzowanie wydruku faktury