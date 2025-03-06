import { useLocation, useNavigate } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    Receipt as ReceiptIcon,
    People as PeopleIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Api as SwaggerIcon,
    Menu as MenuIcon,
    Close as CloseIcon,
    ReceiptLong as ReceiptLongIcon
} from '@mui/icons-material';
import { Tooltip, useMediaQuery, IconButton, tooltipClasses, TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import './Sidebar.scss';

// Stworzenie stylizowanego komponentu tooltipa dla ujednoliconego wyglądu
const StyledTooltip = styled(({ className, ...props }: { className?: string } & Omit<TooltipProps, 'classes'>) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#1e293b',
        color: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        padding: '8px 12px',
        fontSize: '13px',
        fontWeight: 400,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        maxWidth: '220px',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: '#1e293b',
    },
}));

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showTitle, setShowTitle] = useState(true);
    const [showVerticalIcons, setShowVerticalIcons] = useState(false);
    const [showMenuIcons, setShowMenuIcons] = useState(true);
    const [showLogoIcon, setShowLogoIcon] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);

    // Konfiguracje dla tooltipów - wspólne właściwości
    const tooltipProps = {
        arrow: true,
        enterDelay: 700,
        leaveDelay: 100,
    };

    // Sprawdzanie czy jest to urządzenie mobilne
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Efekt do wykrywania kliknięć w wybrzuszenie
    useEffect(() => {
        if (isMobile) return; // Na urządzeniach mobilnych nie używamy wybrzuszenia

        const handleClick = (event: MouseEvent) => {
            if (!sidebarRef.current) return;

            const sidebarRect = sidebarRef.current.getBoundingClientRect();

            // Obliczamy obszar kliknięcia dla wybrzuszenia
            const bulgeTop = sidebarRect.top + 50; // Pozycja wybrzuszenia
            const bulgeBottom = bulgeTop + 30; // wysokość 50px
            const bulgeLeft = sidebarRect.right - 4; // początek 8px przed krawędzią
            const bulgeRight = sidebarRect.right + 8; // 8px szerokości

            // Sprawdzamy, czy kliknięcie było w obszarze wybrzuszenia
            if (
                event.clientX >= bulgeLeft &&
                event.clientX <= bulgeRight &&
                event.clientY >= bulgeTop &&
                event.clientY <= bulgeBottom
            ) {
                toggleSidebar();
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [isMobile]);

    // Funkcja przełączająca sidebar
    const toggleSidebar = () => {
        setIsTransitioning(true);

        if (!collapsed) {
            // Jeśli zwijamy sidebar:
            setShowTitle(false);
            setShowVerticalIcons(false);
            setShowMenuIcons(false); // Ukrywamy ikony menu
            setShowLogoIcon(false); // Ukrywamy ikonę logo
        } else {
            // Jeśli rozwijamy sidebar:
            setShowVerticalIcons(false);
            setShowMenuIcons(false); // Ukrywamy ikony menu podczas animacji
            setShowLogoIcon(false); // Ukrywamy ikonę logo
        }

        setCollapsed(prev => !prev);

        // Po zakończeniu animacji zmiany szerokości
        setTimeout(() => {
            setIsTransitioning(false);

            if (collapsed) {
                // Jeśli rozwijaliśmy sidebar
                setTimeout(() => {
                    setShowTitle(true);
                    setShowMenuIcons(true); // Pokazujemy ikony menu
                }, 50);
            } else {
                // Jeśli zwijaliśmy sidebar
                setTimeout(() => {
                    setShowVerticalIcons(true);
                    setShowMenuIcons(true); // Pokazujemy ikony menu
                    setShowLogoIcon(true); // Pokazujemy ikonę logo
                }, 50);
            }
        }, 300); // 300ms to czas animacji
    };

    // Aktualizacja klasy na body
    useEffect(() => {
        document.body.classList.toggle('sidebar-collapsed', collapsed);

        return () => {
            document.body.classList.remove('sidebar-collapsed');
        };
    }, [collapsed]);

    // Obsługa zakończenia animacji sidebara
    const handleTransitionEnd = () => {
        // Dodatkowe zabezpieczenie - pokazujemy odpowiednie elementy po zakończeniu animacji
        if (!collapsed) {
            if (!showTitle) setShowTitle(true);
            if (!showMenuIcons) setShowMenuIcons(true);
        } else {
            if (!showVerticalIcons) setShowVerticalIcons(true);
            if (!showMenuIcons) setShowMenuIcons(true);
            if (!showLogoIcon) setShowLogoIcon(true);
        }
    };

    // Sprawdzanie aktywnej ścieżki
    const isActive = (path: string) => {
        return location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path));
    };

    // Obsługa nawigacji
    const handleNavigation = (path: string) => {
        if (location.pathname === path) return;

        if (isMobile) {
            setMobileOpen(false);
        }

        navigate(path);
    };

    // Obsługa kliknięcia przycisku hamburger
    const handleMobileToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Zamknięcie menu mobilnego po kliknięciu poza nim
    const handleOverlayClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('mobile-overlay')) {
            setMobileOpen(false);
        }
    };

    const sidebarClass = isMobile
        ? `sidebar mobile-sidebar ${mobileOpen ? 'mobile-open' : 'mobile-closed'}`
        : `sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${isTransitioning ? 'is-transitioning' : ''}`;

    // Social media links array - do użycia w obu widokach
    const socialLinks = [
        {
            title: "Swagger - Dokumentacja API",
            href: "http://srv10.mikr.us:44484/swagger/index.html",
            icon: <SwaggerIcon className="social-icon" />
        },
        {
            title: "GitHub - Zobacz kod źródłowy",
            href: "https://github.com/darek9k/M-A-F",
            icon: <GitHubIcon className="social-icon" />
        },
        {
            title: "LinkedIn - Skontaktuj się ze mną",
            href: "https://www.linkedin.com/in/darecki9k/",
            icon: <LinkedInIcon className="social-icon" />
        }
    ];

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
            <aside
                className={sidebarClass}
                ref={sidebarRef}
                onTransitionEnd={handleTransitionEnd}
            >
                {/* Nagłówek dla rozwiniętego menu */}
                {(!collapsed || isMobile) && (
                    <div className="sidebar-header">
                        <div className={`header-content ${showTitle ? 'show-title' : 'hide-title'}`}>
                            <h3 className="app-title">M-A-F</h3>
                            <h4 className="app-title">Moja Aplikacja Faktur</h4>
                        </div>
                    </div>
                )}

                {/* Ikona logo dla zwiniętego sidebara z ujednoliconym tooltipem */}
                {collapsed && !isMobile && (
                    <div className="sidebar-header">
                        <div className={`logo-icon-container ${showLogoIcon ? 'show-logo-icon' : 'hide-logo-icon'}`}>
                            <StyledTooltip
                                title="M-A-F: Moja Aplikacja Faktur"
                                placement="right"
                                {...tooltipProps}
                            >
                                <ReceiptLongIcon className="logo-icon" />
                            </StyledTooltip>
                        </div>
                    </div>
                )}

                <ul className="menu">
                    <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                        <a
                            className="menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation('/');
                            }}
                        >
                            {/* Dodany tooltip dla ikony menu w zwiniętym sidebarze */}
                            {collapsed && !isMobile ? (
                                <StyledTooltip title="Dashboard" placement="right" {...tooltipProps}>
                                    <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                        <DashboardIcon className="menu-icon" />
                                    </div>
                                </StyledTooltip>
                            ) : (
                                <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                    <DashboardIcon className="menu-icon" />
                                </div>
                            )}
                            {(!collapsed || isMobile) && (
                                <span className={`menu-text ${showTitle ? 'show-title' : 'hide-title'}`}>
                                    Dashboard
                                </span>
                            )}
                        </a>
                    </li>
                    <li className={`menu-item ${isActive('/invoices') ? 'active' : ''}`}>
                        <a
                            className="menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation('/invoices');
                            }}
                        >
                            {/* Dodany tooltip dla ikony menu w zwiniętym sidebarze */}
                            {collapsed && !isMobile ? (
                                <StyledTooltip title="Faktury" placement="right" {...tooltipProps}>
                                    <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                        <ReceiptIcon className="menu-icon" />
                                    </div>
                                </StyledTooltip>
                            ) : (
                                <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                    <ReceiptIcon className="menu-icon" />
                                </div>
                            )}
                            {(!collapsed || isMobile) && (
                                <span className={`menu-text ${showTitle ? 'show-title' : 'hide-title'}`}>
                                    Faktury
                                </span>
                            )}
                        </a>
                    </li>
                    <li className={`menu-item ${isActive('/contractors') ? 'active' : ''}`}>
                        <a
                            className="menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation('/contractors');
                            }}
                        >
                            {/* Dodany tooltip dla ikony menu w zwiniętym sidebarze */}
                            {collapsed && !isMobile ? (
                                <StyledTooltip title="Kontrahenci" placement="right" {...tooltipProps}>
                                    <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                        <PeopleIcon className="menu-icon" />
                                    </div>
                                </StyledTooltip>
                            ) : (
                                <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                    <PeopleIcon className="menu-icon" />
                                </div>
                            )}
                            {(!collapsed || isMobile) && (
                                <span className={`menu-text ${showTitle ? 'show-title' : 'hide-title'}`}>
                                    Kontrahenci
                                </span>
                            )}
                        </a>
                    </li>
                </ul>

                {/* Social media icons z ujednoliconymi tooltipami */}
                {(!collapsed || isMobile) && (
                    <div className={`sidebar-social ${showTitle ? 'show-title' : 'hide-title'}`}>
                        {socialLinks.map((link, index) => (
                            <StyledTooltip
                                key={index}
                                title={link.title}
                                placement="top"
                                {...tooltipProps}
                            >
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon-link"
                                >
                                    {link.icon}
                                </a>
                            </StyledTooltip>
                        ))}
                    </div>
                )}

                {/* Pionowe ikony social media z ujednoliconymi tooltipami */}
                {collapsed && !isMobile && (
                    <div className={`vertical-social ${showVerticalIcons ? 'show-vertical-icons' : 'hide-vertical-icons'}`}>
                        {socialLinks.map((link, index) => (
                            <StyledTooltip
                                key={index}
                                title={link.title}
                                placement="right"
                                {...tooltipProps}
                            >
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="vertical-social-icon-link"
                                >
                                    {link.icon}
                                </a>
                            </StyledTooltip>
                        ))}
                    </div>
                )}
            </aside>
        </>
    );
}

export default Sidebar;