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
import { useMediaQuery, IconButton } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import './Sidebar.scss';
import StyledTooltip, { tooltipDefaultProps } from '../../components/StyledTooltip/StyledTooltip';

// Key for localStorage
const SIDEBAR_STATE_KEY = 'maf_sidebar_collapsed';

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    // Get saved sidebar state from localStorage or use false as default
    const savedCollapsedState = localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
    const [collapsed, setCollapsed] = useState(savedCollapsedState);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showTitle, setShowTitle] = useState(!savedCollapsedState);
    const [showVerticalIcons, setShowVerticalIcons] = useState(savedCollapsedState);
    const [showMenuIcons, setShowMenuIcons] = useState(true);
    const [showLogoIcon, setShowLogoIcon] = useState(savedCollapsedState);
    // Set toggleActive to true if sidebar is expanded
    const [toggleActive, setToggleActive] = useState(!savedCollapsedState);
    // New state for controlling toggle button visibility
    const [showToggle, setShowToggle] = useState(!savedCollapsedState);
    // New state tracking last mouse cursor position
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

    const sidebarRef = useRef<HTMLElement>(null);
    const toggleRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    const tooltipProps = {
        arrow: true,
        enterDelay: 700,
        leaveDelay: 100,
    };

    const isMobile = useMediaQuery('(max-width: 768px)');

    // Effect tracking mouse cursor position
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setLastMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Menu hover handlers
    const handleMenuMouseEnter = () => {
        if (collapsed && !isMobile && !isTransitioning) {
            setShowToggle(true);
        }
    };

    const handleMenuMouseLeave = () => {
        if (collapsed && !isMobile && !toggleActive) {
            setShowToggle(false);
        }
    };

    // Handler for onMouseLeave event for the entire sidebar
    const handleSidebarMouseLeave = () => {
        if (collapsed && !isMobile && !toggleActive) {
            setShowToggle(false);
        }
    };

    // Effect for handling hover on toggle
    const handleToggleMouseEnter = () => {
        setShowToggle(true);
    };

    // Handler for onMouseLeave event for the toggle
    const handleToggleMouseLeave = () => {
        if (collapsed && !isMobile && !toggleActive) {
            // Check if mouse is over the menu
            if (menuRef.current) {
                const menuRect = menuRef.current.getBoundingClientRect();
                const mouseX = lastMousePosition.x;
                const mouseY = lastMousePosition.y;

                // If cursor is over the menu, do not hide the toggle
                if (
                    mouseX >= menuRect.left &&
                    mouseX <= menuRect.right &&
                    mouseY >= menuRect.top &&
                    mouseY <= menuRect.bottom
                ) {
                    return;
                }
            }
            setShowToggle(false);
        }
    };

    // Function to check cursor position relative to menu
    const checkMouseOverMenu = () => {
        if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const mouseX = lastMousePosition.x;
            const mouseY = lastMousePosition.y;

            return (
                mouseX >= menuRect.left &&
                mouseX <= menuRect.right &&
                mouseY >= menuRect.top &&
                mouseY <= menuRect.bottom
            );
        }
        return false;
    };

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsTransitioning(true);

        if (!collapsed) {
            // Collapse sidebar
            setShowTitle(false);
            setShowVerticalIcons(false);
            setShowMenuIcons(false);
            setShowLogoIcon(false);
            // Toggle active during collapsing
            setToggleActive(true);
        } else {
            // Expand sidebar
            setShowVerticalIcons(false);
            setShowMenuIcons(false);
            setShowLogoIcon(false);
            // Toggle active during expanding
            setToggleActive(true);
        }

        const newCollapsedState = !collapsed;
        setCollapsed(newCollapsedState);

        // Save state in localStorage
        localStorage.setItem(SIDEBAR_STATE_KEY, String(newCollapsedState));

        setTimeout(() => {
            setIsTransitioning(false);

            if (collapsed) {
                // After expanding sidebar
                setTimeout(() => {
                    setShowTitle(true);
                    setShowMenuIcons(true);
                    setShowToggle(true); // Always show toggle for expanded sidebar
                }, 50);
            } else {
                // After collapsing sidebar
                setTimeout(() => {
                    setShowVerticalIcons(true);
                    setShowMenuIcons(true);
                    setShowLogoIcon(true);
                    // Toggle deactivated after collapsing
                    setToggleActive(false);

                    // Check mouse position relative to menu
                    if (checkMouseOverMenu()) {
                        setShowToggle(true);
                    } else {
                        setShowToggle(false);
                    }
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

            // Check if cursor is over the menu
            if (checkMouseOverMenu()) {
                setShowToggle(true);
            }
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
            title: "Swagger - API Documentation",
            href: "https://maf.sdet.pl/swagger/index.html",
            icon: <SwaggerIcon className="social-icon" />
        },
        {
            title: "GitHub - View source code",
            href: "https://github.com/dar-kow/M-A-F",
            icon: <GitHubIcon className="social-icon" />
        },
        {
            title: "LinkedIn - Contact me",
            href: "https://www.linkedin.com/in/dar-kow/",
            icon: <LinkedInIcon className="social-icon" />
        }
    ];

    return (
        <>
            {isMobile && (
                <div className="mobile-hamburger-container" data-testid="sidebar-mobile-hamburger-container">
                    <IconButton
                        onClick={handleMobileToggle}
                        className="mobile-hamburger"
                        size="large"
                        color="inherit"
                        aria-label="menu"
                        data-testid="sidebar-mobile-hamburger"
                    >
                        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </div>
            )}

            {isMobile && mobileOpen && (
                <div className="mobile-overlay" onClick={handleOverlayClick} data-testid="sidebar-mobile-overlay"></div>
            )}

            <aside
                className={sidebarClass}
                ref={sidebarRef}
                onTransitionEnd={handleTransitionEnd}
                onMouseLeave={handleSidebarMouseLeave}
                data-testid="sidebar-root"
            >
                {!isMobile && (
                    <div
                        className={`sidebar-toggle ${toggleActive ? 'active' : ''} ${showToggle ? 'show-toggle' : ''}`}
                        onClick={handleToggleClick}
                        ref={toggleRef}
                        onMouseEnter={handleToggleMouseEnter}
                        onMouseLeave={handleToggleMouseLeave}
                        data-testid="sidebar-toggle"
                    />
                )}

                {(!collapsed || isMobile) && (
                    <div className="sidebar-header" data-testid="sidebar-header">
                        <div className={`header-content ${showTitle ? 'show-title' : 'hide-title'}`}>
                            <h3 className="app-title" data-testid="sidebar-app-title">M-A-F</h3>
                            <h4 className="app-title" data-testid="sidebar-app-subtitle">Moja Aplikacja Faktur</h4>
                        </div>
                    </div>
                )}

                {collapsed && !isMobile && (
                    <div className="sidebar-header" data-testid="sidebar-header-collapsed">
                        <div className={`logo-icon-container ${showLogoIcon ? 'show-logo-icon' : 'hide-logo-icon'}`}>
                            <StyledTooltip
                                title="M-A-F: Moja Aplikacja Faktur"
                                placement="right"
                                {...tooltipDefaultProps}
                            >
                                <ReceiptLongIcon className="logo-icon" data-testid="sidebar-logo-icon" />
                            </StyledTooltip>
                        </div>
                    </div>
                )}

                <ul
                    className="menu"
                    ref={menuRef}
                    onMouseEnter={handleMenuMouseEnter}
                    onMouseLeave={handleMenuMouseLeave}
                    data-testid="sidebar-menu"
                >
                    <li className={`menu-item ${isActive('/') ? 'active' : ''}`} data-testid="sidebar-menu-dashboard">
                        <a
                            className="menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation('/');
                            }}
                            data-testid="sidebar-link-dashboard"
                        >
                            {collapsed && !isMobile ? (
                                <StyledTooltip title="Dashboard" placement="right" {...tooltipProps}>
                                    <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                        <DashboardIcon className="menu-icon" data-testid="sidebar-icon-dashboard" />
                                    </div>
                                </StyledTooltip>
                            ) : (
                                <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                    <DashboardIcon className="menu-icon" data-testid="sidebar-icon-dashboard" />
                                </div>
                            )}
                            {(!collapsed || isMobile) && (
                                <span className={`menu-text ${showTitle ? 'show-title' : 'hide-title'}`} data-testid="sidebar-text-dashboard">
                                    Dashboard
                                </span>
                            )}
                        </a>
                    </li>
                    <li className={`menu-item ${isActive('/invoices') ? 'active' : ''}`} data-testid="sidebar-menu-invoices">
                        <a
                            className="menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation('/invoices');
                            }}
                            data-testid="sidebar-link-invoices"
                        >
                            {collapsed && !isMobile ? (
                                <StyledTooltip title="Faktury" placement="right" {...tooltipProps}>
                                    <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                        <ReceiptIcon className="menu-icon" data-testid="sidebar-icon-invoices" />
                                    </div>
                                </StyledTooltip>
                            ) : (
                                <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                    <ReceiptIcon className="menu-icon" data-testid="sidebar-icon-invoices" />
                                </div>
                            )}
                            {(!collapsed || isMobile) && (
                                <span className={`menu-text ${showTitle ? 'show-title' : 'hide-title'}`} data-testid="sidebar-text-invoices">
                                    Faktury
                                </span>
                            )}
                        </a>
                    </li>
                    <li className={`menu-item ${isActive('/contractors') ? 'active' : ''}`} data-testid="sidebar-menu-contractors">
                        <a
                            className="menu-link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation('/contractors');
                            }}
                            data-testid="sidebar-link-contractors"
                        >
                            {collapsed && !isMobile ? (
                                <StyledTooltip title="Kontrahenci" placement="right" {...tooltipProps}>
                                    <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                        <PeopleIcon className="menu-icon" data-testid="sidebar-icon-contractors" />
                                    </div>
                                </StyledTooltip>
                            ) : (
                                <div className={`menu-icon-container ${showMenuIcons ? 'show-menu-icon' : 'hide-menu-icon'}`}>
                                    <PeopleIcon className="menu-icon" data-testid="sidebar-icon-contractors" />
                                </div>
                            )}
                            {(!collapsed || isMobile) && (
                                <span className={`menu-text ${showTitle ? 'show-title' : 'hide-title'}`} data-testid="sidebar-text-contractors">
                                    Kontrahenci
                                </span>
                            )}
                        </a>
                    </li>
                </ul>

                {(!collapsed || isMobile) && (
                    <div className={`sidebar-social ${showTitle ? 'show-title' : 'hide-title'}`} data-testid="sidebar-social">
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
                                    data-testid={`sidebar-social-link-${index}`}
                                >
                                    {link.icon}
                                </a>
                            </StyledTooltip>
                        ))}
                    </div>
                )}

                {collapsed && !isMobile && (
                    <div className={`vertical-social ${showVerticalIcons ? 'show-vertical-icons' : 'hide-vertical-icons'}`} data-testid="sidebar-vertical-social">
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
                                    data-testid={`sidebar-vertical-social-link-${index}`}
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