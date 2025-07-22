import { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import routes from './routes';
import Loader from './shared/components/Loader/Loader';

import Navbar from './shared/components/Navbar/Navbar';
import Sidebar from './shared/components/Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Global, css } from '@emotion/react';
import { initializeGA } from './analytics';
import { RootState } from './store/rootReducer';
import { getTheme } from './styles/theme';

const getGlobalStyles = (isDarkMode: boolean) => css`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  }
  
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  
  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .content {
    flex: 1;
    overflow: auto;
    background-color: ${isDarkMode ? '#121212' : '#f8f9fa'};
    padding: 24px;
    transition: background-color 0.3s ease;
  }
  
  /* Style dla responsywności */
  @media (max-width: 768px) {
    .content {
      padding: 16px;
    }
  }

  /* Toast notification dark mode support */
  .Toastify__toast-theme--dark {
    background: #1e1e1e;
    color: rgba(255, 255, 255, 0.87);
  }

  /* Smooth transitions for all elements */
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
`;

function App() {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const theme = getTheme(themeMode);

  useEffect(() => {
    initializeGA('maf');
  }, []);

  // Ustaw data-theme na body
  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const routeElements = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Dodajemy globalne style jako element */}
      <Global styles={getGlobalStyles(themeMode === 'dark')} />

      <div className="app">
        <Navbar />
        <div className="main-container">
          <Sidebar />
          <main className="content">
            <Suspense fallback={<Loader />}>
              {routeElements}
            </Suspense>
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={themeMode}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
