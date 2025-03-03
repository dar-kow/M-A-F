import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import Loader from './shared/components/Loader/Loader';

import Navbar from './shared/components/Navbar/Navbar';
import Sidebar from './shared/components/Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Global, css } from '@emotion/react';

// Globalne style aplikacji
const globalStyles = css`
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
    background-color: #f8f9fa;
    padding: 24px;
  }
  
  /* Style dla responsywności */
  @media (max-width: 768px) {
    .content {
      padding: 16px;
    }
  }
`;

function App() {
  // Użyj useRoutes do renderowania tras
  const routeElements = useRoutes(routes);

  return (
    <>
      {/* Dodajemy globalne style jako element */}
      <Global styles={globalStyles} />

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
        />
      </div>
    </>
  );
}

export default App;