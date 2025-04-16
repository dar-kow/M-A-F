import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Lazy loading dla lepszej wydajności
const ContractorList = lazy(() => import('./features/contractors/pages/ContractorList/ContractorList'));
const ContractorForm = lazy(() => import('./features/contractors/pages/ContractorForm/ContractorForm'));
const InvoiceList = lazy(() => import('./features/invoices/pages/InvoiceList/InvoiceList'));
const InvoiceForm = lazy(() => import('./features/invoices/pages/InvoiceForm/InvoiceForm'));

// Dashboard - możesz dodać komponent dashboard później
const Dashboard = lazy(() => import('./shared/components/Dashboard/Dashboard'));

// Definicja ścieżek aplikacji
const routes: RouteObject[] = [
    {
        path: '/',
        element: <Dashboard />,
        index: true,
    },
    {
        path: '/contractors',
        children: [
            { index: true, element: <ContractorList /> },
            { path: 'new', element: <ContractorForm /> },
            { path: 'edit/:id', element: <ContractorForm /> }
        ]
    },
    {
        path: '/invoices',
        children: [
            { index: true, element: <InvoiceList /> },
            { path: 'new', element: <InvoiceForm /> },
            { path: 'edit/:id', element: <InvoiceForm /> }
        ]
    },
    {
        path: '*',
        element: <div>404 - Nie znaleziono strony</div>
    }
];

export default routes;