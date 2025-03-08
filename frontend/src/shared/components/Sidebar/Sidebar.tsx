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

// Klucz dla localStorage
const SIDEBAR_STATE_KEY = 'maf_sidebar_collapsed';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    // Pobierz zapisany stan sidebara z localStorage lub użyj false jako domyślny
    const savedCollapsedState = localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
    const [collapsed, setCollapsed] = useState(savedCollapsedState);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showTitle, setShowTitle] = useState(!savedCollapsedState);
    const [showVerticalIcons, setShowVerticalIcons] = useState(savedCollapsedState);
    const [showMenuIcons, setShowMenuIcons] = useState(true);
    const [showLogoIcon, setShowLogoIcon] = useState(savedCollapsedState);
    // Ustaw toggleActive na true jeśli sidebar jest rozwinięty
    const [toggleActive, setToggleActive] = useState(!savedCollapsedState);
    const sidebarRef = useRef<HTMLElement>(null);
    const toggleRef = useRef<HTMLDivElement>(null);

    const tooltipProps = {
        arrow: true,
        enterDelay: 700,
        leaveDelay: 100,
    };

    const isMobile = useMediaQuery('(max-width: 768px)');

    // Funkcja przełączająca sidebar
    const toggleSidebar = () => {
        setIsTransitioning(true);

        if (!collapsed) {
            // Zwijamy sidebar
            setShowTitle(false);
            setShowVerticalIcons(false);
            setShowMenuIcons(false);
            setShowLogoIcon(false);
            // Toggle aktywny podczas zwijania
            setToggleActive(true);
        } else {
            // Rozwijamy sidebar
            setShowVerticalIcons(false);
            setShowMenuIcons(false);
            setShowLogoIcon(false);
            // Toggle aktywny podczas rozwijania
            setToggleActive(true);
        }

        const newCollapsedState = !collapsed;
        setCollapsed(newCollapsedState);

        // Zapisz stan w localStorage
        localStorage.setItem(SIDEBAR_STATE_KEY, String(newCollapsedState));

        setTimeout(() => {
            setIsTransitioning(false);

            if (collapsed) {
                // Po rozwinięciu sidebara
                setTimeout(() => {
                    setShowTitle(true);
                    setShowMenuIcons(true);
                }, 50);
            } else {
                // Po zwinięciu sidebara
                setTimeout(() => {
                    setShowVerticalIcons(true);
                    setShowMenuIcons(true);
                    setShowLogoIcon(true);
                    // Toggle dezaktywowany po zakończeniu zwijania
                    setToggleActive(false);
                }, 50);
            }
        }, 300);
    };

    const handleToggleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSidebar();
    };

    useEffect(() => {
        document.body.classList.toggle('sidebar-collapsed', collapsed);
        return () => {
            document.body.classList.remove('sidebar-collapsed');
        };
    }, [collapsed]);

    const handleTransitionEnd = () => {
        if (!collapsed) {
            if (!showTitle) setShowTitle(true);
            if (!showMenuIcons) setShowMenuIcons(true);
        } else {
            if (!showVerticalIcons) setShowVerticalIcons(true);
            if (!showMenuIcons) setShowMenuIcons(true);
            if (!showLogoIcon) setShowLogoIcon(true);
        }
    };

    const isActive = (path: string) => {
        return location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path));
    };

    const handleNavigation = (path: string) => {
        if (location.pathname === path) return;
        if (isMobile) setMobileOpen(false);
        navigate(path);
    };

    const handleMobileToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains('mobile-overlay')) {
            setMobileOpen(false);
        }
    };

    const sidebarClass = isMobile
        ? `sidebar mobile-sidebar ${mobileOpen ? 'mobile-open' : 'mobile-closed'}`
        : `sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${isTransitioning ? 'is-transitioning' : ''}`;

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

            {isMobile && mobileOpen && (
                <div className="mobile-overlay" onClick={handleOverlayClick}></div>
            )}

            <aside
                className={sidebarClass}
                ref={sidebarRef}
                onTransitionEnd={handleTransitionEnd}
            >
                {!isMobile && (
                    <div
                        className={`sidebar-toggle ${toggleActive ? 'active' : ''}`}
                        onClick={handleToggleClick}
                        ref={toggleRef}
                    />
                )}

                {(!collapsed || isMobile) && (
                    <div className="sidebar-header">
                        <div className={`header-content ${showTitle ? 'show-title' : 'hide-title'}`}>
                            <h3 className="app-title">M-A-F</h3>
                            <h4 className="app-title">Moja Aplikacja Faktur</h4>
                        </div>
                    </div>
                )}

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