import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App';
import store from './store/store';
import '@styles/global.scss';
import { trackPageView } from './analytics';

const PageTracker: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);

    return null;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <PageTracker />
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);