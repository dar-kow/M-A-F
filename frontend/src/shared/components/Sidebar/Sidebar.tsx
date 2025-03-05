import { useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Receipt as ReceiptIcon,
    People as PeopleIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Api as SwaggerIcon,
    Menu as MenuIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { Tooltip, useMediaQuery, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import './Sidebar.scss';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Sprawdzanie czy jest to urządzenie mobilne
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Efekt do automatycznego zarządzania stanem menu opartego na lokalizacji
    useEffect(() => {
        // Na urządzeniach mobilnych nie zmieniamy stanu automatycznie
        if (isMobile) return;

        // Jeśli jesteśmy na dashboardzie i nie jesteśmy w trakcie przejścia, rozwijamy menu
        if (location.pathname === '/' && !isTransitioning) {
            const timer = setTimeout(() => {
                setCollapsed(false);
            }, 100);

            return () => clearTimeout(timer);
        }
        // Zwijamy menu jeśli nie jesteśmy na stronie głównej
        else if (location.pathname !== '/' && !isTransitioning) {
            const timer = setTimeout(() => {
                setCollapsed(true);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [location.pathname, isTransitioning, isMobile]);

    // Sprawdzanie aktywnej ścieżki
    const isActive = (path: string) => {
        return location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path));
    };

    // Obsługa nawigacji z animacją menu
    const handleNavigation = (path: string) => {
        // Jeśli już jesteśmy na tej ścieżce, nie robimy nic
        if (location.pathname === path) return;

        // Jeśli to urządzenie mobilne, zamykamy menu
        if (isMobile) {
            setMobileOpen(false);
        }
        // Jeśli przechodzimy z dashboardu do innej strony, najpierw zwijamy menu
        else if (location.pathname === '/' && path !== '/') {
            setIsTransitioning(true);
            setCollapsed(true);

            // Po zwinięciu menu przechodzimy do wybranej strony
            setTimeout(() => {
                navigate(path);
                setIsTransitioning(false);
            }, 300);
        }
        // W przeciwnym razie przechodzimy od razu
        else {
            navigate(path);
        }
    };

    // Obsługa kliknięcia przycisku hamburger
    const handleMobileToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Zamknięcie menu mobilnego po kliknięciu poza nim
    const handleOverlayClick = (e: React.MouseEvent) => {
        // Sprawdzamy, czy kliknięcie było na overlay, a nie na samym menu
        if ((e.target as HTMLElement).classList.contains('mobile-overlay')) {
            setMobileOpen(false);
        }
    };

    const sidebarClass = isMobile
        ? `sidebar mobile-sidebar ${mobileOpen ? 'mobile-open' : 'mobile-closed'}`
        : `sidebar ${collapsed ? 'sidebar-collapsed' : ''}`;

    return (
        <>
            {/* Przycisk hamburgera dla urządzeń mobilnych */}
            {isMobile && (
                <div className="mobile-hamburger-container">
                    <IconButton
                        onClick={handleMobileToggle}
                        className="mobile-hamburger"
                        size="large"
                        color="inherit"
                        aria-label="menu"
                    >
                        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </div>
            )}

            {/* Przyciemnione tło dla menu mobilnego */}
            {isMobile && mobileOpen && (
                <div className="mobile-overlay" onClick={handleOverlayClick}></div>
            )}

            <aside className={sidebarClass}>
                {/* Nagłówek tylko dla rozwiniętego menu */}
                {(!collapsed || isMobile) && (
                    <div className="sidebar-header">
                        <h3 className="app-title">M-A-F</h3>
                        <h4 className="app-title">Moja Aplikacja Faktur</h4>
                    </div>
                )}

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
                            {(!collapsed || isMobile) && <span className="menu-text">Dashboard</span>}
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
                            {(!collapsed || isMobile) && <span className="menu-text">Faktury</span>}
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
                            {(!collapsed || isMobile) && <span className="menu-text">Kontrahenci</span>}
                        </a>
                    </li>
                </ul>

                {/* Social media icons - only when sidebar is expanded */}
                {(!collapsed || isMobile) && (
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
                {collapsed && !isMobile && (
                    <div className="vertical-logo">
                        <span className="vertical-text">M-A-F - Moja Aplikacja Faktur</span>
                    </div>
                )}
            </aside>
        </>
    );
}

export default Sidebar;