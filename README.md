# MAF - Moja Aplikacja Faktur
[Zobacz changelog](https://github.com/darek9k/M-A-F/blob/main/changelog.md)


## Opis projektu
MAF to aplikacja webowa do zarządzania fakturami i kontrahentami, zbudowana w oparciu o React oraz backend w .NET z bazą danych PostgreSQL. Projekt rozwijany jest z myślą o dobrych praktykach programistycznych oraz organizacji kodu według wzorca Atomic Design.

## Technologie
- **Frontend:** React, Redux, Redux-Saga, TypeScript, SCSS (SASS), Vite, Axios, Lazy Loading & React Suspense, Memoization
- **Backend:** .NET, PostgreSQL (uruchamiane w kontenerze, tryb normalny i developerski)
- **Inne:** Semantyczne HTML, Controlled & Uncontrolled Components, useEffect, useState, useCallback

## Kluczowe funkcjonalności
- **Zarządzanie fakturami:** dodawanie, edycja, usuwanie, aktualizacja statusu płatności
- **Zarządzanie kontrahentami:** dodawanie, edycja, usuwanie (tylko jeśli nie mają powiązanych faktur)
- **Dashboard:** podsumowanie danych, dynamiczne bloki z funkcjonalnościami
- **Lista faktur i kontrahentów:** filtrowanie, sortowanie, akcje dostępne w menu kontekstowym (prawoklik)
- **Obsługa formularzy:** walidacja pól (tylko frontend), pageHeader z identyfikacją edycji/dodawania
- **UI/UX:**
  - Menu hamburgerowe z animacją `fadeInDown`
  - Ukrywanie menu po kliknięciu poza jego obszar
  - TruncatedCell z tooltipem dla długich treści
  - Sticky nagłówki kolumn
  - Animacja ikon w menu i na stronie głównej
  - Globalna czcionka Mulish
  - Toastery (`react-toastify`) do powiadomień (np. usunięcie kontrahenta)

## Przykładowa implementacja zamykania menu po kliknięciu poza
```tsx
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

## TO DO
- **Rozbudowa formularzy:** dodanie nowych pól, walidacja, aktualizacja modeli
- **Obsługa płatności:** możliwość rozliczania faktury z listy faktur
- **Poprawki w logice kwot VAT:** przeliczenia per stawka VAT w podsumowaniach
- **Dopracowanie wydruku faktury**
- **Rozszerzenie modelu kontrahenta:** migracje, testowe dane
- **Obsługa filtrów:** osobne komponenty dla filtrów, czyszczenie, zatwierdzanie
- **Poprawki w UI:** wyrównanie ikon i tekstów w menu, ujednolicenie kolorów
- **Dodanie sticky nagłówków do list**
- **Integracja z repozytorium:** dodanie changelog, linków do repo

[Zobacz changelog](https://github.com/darek9k/M-A-F/blob/main/changelog.md)
<br><br><br> <!-- 3 puste linie -->

# React i spółka – na chłopski rozum

## Podstawowe zasady działania React, DOM itp.
React to taki sprytny magik, który operuje na wirtualnym DOM-ie zamiast na prawdziwym drzewie HTML. Dzięki temu zmiany są szybkie, bo zamiast mieszać w całym DOM-ie, React porównuje stare i nowe drzewo, a potem wprowadza tylko te zmiany, które są naprawdę potrzebne.

## Komponenty funkcyjne
Dawniej w React mieliśmy jeszcze komponenty klasowe, ale teraz wszyscy lecą na funkcjach. Proste do zrozumienia: bierzesz funkcję, zwracasz JSX i masz komponent. Lekkie, szybkie i przyjemne w użyciu.

## Hooki Reacta
To taki zestaw narzędzi, który pozwala funkcjonalnym komponentom mieć „mózg” – czyli stan (`useState`), efekty (`useEffect`), kontekst (`useContext`) i inne bajery bez potrzeby używania klas.

## Props & State
- **Propsy** – dane przekazywane z rodzica do dziecka. Taki argument do funkcji.
- **State** – zmienne, które żyją wewnątrz komponentu i mogą się zmieniać. Można je zmieniać np. przez `useState`, ale nie wolno edytować ich bezpośrednio.

## Lifting State Up
Gdy dwa komponenty muszą korzystać z tych samych danych, to zamiast dublować stan, wynosimy go wyżej – do wspólnego rodzica. Dzięki temu obie części aplikacji są zsynchronizowane.

## Controlled & Uncontrolled Components
- **Controlled** – stan elementu formularza (inputa) kontrolujemy w React przez `useState`. Każda zmiana wartości inputa idzie przez Reacta.
- **Uncontrolled** – inputy same sobie żyją, a my możemy np. pobrać ich wartość przez `ref`.

## Redux - Store, Reducers, Actions, useSelector, useDispatch
Redux to trochę jak globalna baza danych dla frontendu.
- **Store** – trzyma cały stan aplikacji.
- **Reducers** – funkcje, które mówią, jak zmieniać stan na podstawie akcji.
- **Actions** – obiekty, które mówią, co chcemy zmienić w stanie.
- **useSelector** – pozwala wyciągnąć dane ze store’a do komponentu.
- **useDispatch** – pozwala wysyłać akcje, żeby zmieniać stan.

## Redux-Saga
To taki pomocnik do zarządzania asynchronicznymi operacjami w Reduxie. Używa generatorów (`function*`), dzięki czemu można w wygodny sposób obsługiwać np. API i czekać na odpowiedzi.

## SASS (SCSS)
CSS na sterydach. Można robić zagnieżdżenia (`.header .title`), zmienne (`$primary-color: red`), funkcje (`lighten($color, 10%)`) i dużo innych bajerów, które ułatwiają życie.

## Atomic Design
Podział aplikacji na małe, niezależne klocki:
- **Atoms** – najmniejsze elementy (przyciski, inputy).
- **Molecules** – połączenie atomów (np. input + label + przycisk).
- **Organisms** – większe komponenty zbudowane z molekuł (np. formularz logowania).
- **Templates** – układ strony bez konkretnych danych.
- **Pages** – całe strony z rzeczywistymi danymi.

## Axios
Biblioteka do wysyłania zapytań HTTP (GET, POST itd.). Wygodniejsza od `fetch`, bo obsługuje automatycznie nagłówki, błędy i inne pierdoły.

## Vite
Narzędzie do budowania i uruchamiania aplikacji w React. Jest dużo szybsze niż Webpack i działa niemal natychmiast, bo korzysta z ESM (ładowanie modułów w przeglądarce).

## Lazy Loading & React Suspense
Jak nie chcesz ładować od razu całej aplikacji (bo np. niektóre strony są rzadko używane), to możesz użyć `React.lazy()` i `Suspense`, żeby komponenty ładowały się dopiero wtedy, gdy są potrzebne.

## Memoization
Optymalizacja, która zapobiega niepotrzebnym renderom. `useMemo` zapamiętuje wynik funkcji, a `useCallback` zapamiętuje referencję do funkcji, żeby nie generować jej na nowo przy każdym renderze.

## Semantyka elementów HTML
Zamiast `div` wszędzie, lepiej używać znaczących tagów: `header`, `nav`, `section`, `article`. Pomaga to w SEO i dostępności (lepiej działa np. czytnik ekranu).

<br>

# HOW TO 

## Po ściągnięciu repo - budujemy apkę w dockerze : (tryb dev - aktualizację w kodzie widoczne live)
```ts
docker-compose -f docker-compose.dev.yml up --build
```
w katalogu backendu wbijamy komende do załadowania danych testowych :
```ts
dotnet ef database update
```


