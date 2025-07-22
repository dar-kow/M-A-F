import { IconButton, Tooltip } from '@mui/material';
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { toggleTheme } from '../../../store/themeSlice';
import './ThemeToggle.scss';

function ThemeToggle() {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: RootState) => state.theme.mode);

    const handleThemeToggle = () => {
        // Dodaj klasę animacji do body
        document.body.classList.add('theme-transitioning');
        
        dispatch(toggleTheme());
        
        // Usuń klasę animacji po zakończeniu
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    };

    return (
        <Tooltip title={themeMode === 'dark' ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}>
            <IconButton 
                onClick={handleThemeToggle} 
                color="inherit" 
                className="theme-toggle-button"
                aria-label="toggle theme"
            >
                <div className="icon-wrapper">
                    <LightModeIcon className={`theme-icon light-icon ${themeMode === 'light' ? 'active' : ''}`} />
                    <DarkModeIcon className={`theme-icon dark-icon ${themeMode === 'dark' ? 'active' : ''}`} />
                </div>
            </IconButton>
        </Tooltip>
    );
}

export default ThemeToggle;
