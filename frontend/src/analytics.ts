import ReactGA from 'react-ga4';

// Uniwersalny dostęp do zmiennych środowiskowych
const getEnv = (key: string): string | undefined => {
    // Sprawdź czy używamy Vite (import.meta.env)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key];
    }

    // Sprawdź czy mamy dostęp do process.env (CRA)
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }

    // Fallback dla innych środowisk
    return undefined;
};

// Sprawdzenie czy jesteśmy w środowisku produkcyjnym
const isProduction = (): boolean => {
    return getEnv('NODE_ENV') === 'production' ||
        getEnv('PROD') === 'true';
};

// Sprawdzenie czy testowanie GA jest włączone
const isGADevEnabled = (): boolean => {
    return getEnv('REACT_APP_ENABLE_GA_DEV') === 'true' ||
        getEnv('VITE_ENABLE_GA_DEV') === 'true';
};

// Funkcja inicjalizująca Google Analytics
export const initializeGA = (appName: string = 'main-site'): void => {
    // Inicjalizujemy GA tylko w środowisku produkcyjnym lub jeśli uruchomiono lokalne testowanie GA
    if (isProduction() || isGADevEnabled()) {
        ReactGA.initialize('G-563H76S9WB', {
            gaOptions: {
                siteSpeedSampleRate: 100,
                cookieDomain: 'auto'
            }
        });

        // Ustawienie parametru app_name dla wszystkich zdarzeń
        ReactGA.set({
            app_name: appName
        });

        console.log(`Google Analytics initialized for app: ${appName}`);
    } else {
        console.log('Google Analytics not initialized in development mode');
    }
};

// Funkcja do śledzenia odsłon stron
export const trackPageView = (path: string): void => {
    if (isProduction() || isGADevEnabled()) {
        ReactGA.send({ hitType: 'pageview', page: path });
        console.log(`Page view tracked: ${path}`);
    }
};

// Funkcja do śledzenia zdarzeń
export const trackEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number
): void => {
    if (isProduction() || isGADevEnabled()) {
        ReactGA.event({
            category,
            action,
            label,
            value
        });
        console.log(`Event tracked: ${category} - ${action}`);
    }
};