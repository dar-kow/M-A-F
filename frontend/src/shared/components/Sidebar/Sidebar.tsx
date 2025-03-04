import { useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Receipt as ReceiptIcon,
    People as PeopleIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Api as SwaggerIcon
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import './Sidebar.scss';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Efekt do automatycznego zarządzania stanem menu opartego na lokalizacji
    useEffect(() => {
        // Jeśli jesteśmy na dashboardzie i nie jesteśmy w trakcie przejścia, rozwijamy menu
        if (location.pathname === '/' && !isTransitioning) {
            const timer = setTimeout(() => {
                setCollapsed(false);
            }, 100); // Małe opóźnienie po załadowaniu dashboardu

            return () => clearTimeout(timer);
        }
        //zwijamy menu jeśli nie jesteśmy na stronie głównej
        else if (location.pathname !== '/' && !isTransitioning) {
            const timer = setTimeout(() => {
                setCollapsed(true);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [location.pathname, isTransitioning]);

    // Sprawdzanie aktywnej ścieżki
    const isActive = (path: string) => {
        return location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path));
    };

    // Obsługa nawigacji z animacją menu
    const handleNavigation = (path: string) => {
        // Jeśli już jesteśmy na tej ścieżce, nie robimy nic
        if (location.pathname === path) return;

        // Jeśli przechodzimy z dashboardu do innej strony, najpierw zwijamy menu
        if (location.pathname === '/' && path !== '/') {
            setIsTransitioning(true);
            setCollapsed(true);

            // Po zwinięciu menu przechodzimy do wybranej strony
            setTimeout(() => {
                navigate(path);
                setIsTransitioning(false);
            }, 300); // Poczekaj 300ms na animację zwinięcia menu
        }
        // W przeciwnym razie przechodzimy od razu
        else {
            navigate(path);
        }
    };

    return (
        <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Nagłówek tylko dla rozwiniętego menu */}
            {!collapsed ? (
                <div className="sidebar-header">
                    <h3 className="app-title">M-A-F</h3>
                    <h4 className="app-title">Moja Aplikacja Faktur</h4>
                </div>
            ) : null}

            <ul className="menu">
                <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                    <a
                        className="menu-link"
                        title="Dashboard"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigation('/');
                        }}
                    >
                        <DashboardIcon className="menu-icon" />
                        {!collapsed && <span className="menu-text">Dashboard</span>}
                    </a>
                </li>
                <li className={`menu-item ${isActive('/invoices') ? 'active' : ''}`}>
                    <a
                        className="menu-link"
                        title="Faktury"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigation('/invoices');
                        }}
                    >
                        <ReceiptIcon className="menu-icon" />
                        {!collapsed && <span className="menu-text">Faktury</span>}
                    </a>
                </li>
                <li className={`menu-item ${isActive('/contractors') ? 'active' : ''}`}>
                    <a
                        className="menu-link"
                        title="Kontrahenci"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigation('/contractors');
                        }}
                    >
                        <PeopleIcon className="menu-icon" />
                        {!collapsed && <span className="menu-text">Kontrahenci</span>}
                    </a>
                </li>
            </ul>

            {/* Social media icons - only when sidebar is expanded */}
            {!collapsed && (
                <div className="sidebar-social">
                    <Tooltip title="Swagger - Dokumentacja API" placement="top">
                        <a
                            href="http://srv10.mikr.us:44484/swagger/index.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon-link"
                        >
                            <SwaggerIcon className="social-icon" />
                        </a>
                    </Tooltip>
                    <Tooltip title="GitHub - Zobacz kod źródłowy" placement="top">
                        <a
                            href="https://github.com/darek9k/M-A-F"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon-link"
                        >
                            <GitHubIcon className="social-icon" />
                        </a>
                    </Tooltip>

                    <Tooltip title="LinkedIn - Skontaktuj się ze mną" placement="top">
                        <a
                            href="https://www.linkedin.com/in/darecki9k/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon-link"
                        >
                            <LinkedInIcon className="social-icon" />
                        </a>
                    </Tooltip>
                </div>
            )}

            {/* Pionowy napis M-A-F na dole dla zwiniętego menu */}
            {collapsed && (
                <div className="vertical-logo">
                    <span className="vertical-text">M-A-F - Moja Aplikacja Faktur</span>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;