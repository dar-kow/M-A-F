import { useLocation } from 'react-router-dom';
import {
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import { IconButton, Badge, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { useState, MouseEvent } from 'react';
import './Navbar.scss';

interface NavbarProps {
    pageTitle?: string;
    onPrint?: () => void;
}

function Navbar({ pageTitle, onPrint }: NavbarProps) {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Użyj przekazanego pageTitle jeśli istnieje, w przeciwnym razie określ go na podstawie ścieżki
    const displayTitle = pageTitle || (() => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.includes('/invoices')) return 'Faktury';
        if (path.includes('/contractors')) return 'Kontrahenci';
        return 'Moja Aplikacja Faktur';
    })();

    return (
        <nav className="navbar">
            <div className="navbar-section">
                <h1 className="section-title">{displayTitle}</h1>
            </div>
            <div className="navbar-actions">
                {/* Dodajemy przycisk do drukowania, jeśli onPrint zostało przekazane */}
                {onPrint && (
                    <Tooltip title="Drukuj">
                        <IconButton onClick={onPrint} color="inherit" className="navbar-icon">
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                )}

                <Tooltip title="Powiadomienia">
                    <IconButton color="inherit" className="navbar-icon">
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Ustawienia">
                    <IconButton color="inherit" className="navbar-icon">
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Profil użytkownika">
                    <IconButton
                        edge="end"
                        onClick={handleMenu}
                        color="inherit"
                        className="navbar-icon"
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    keepMounted
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>Profil</MenuItem>
                    <MenuItem onClick={handleClose}>Ustawienia</MenuItem>
                    <MenuItem onClick={handleClose}>Wyloguj się</MenuItem>
                </Menu>
            </div>
        </nav>
    );
}

export default Navbar;