import React from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa"; // <-- import ikony GitHub
import "../styles/HomePage.scss";
import { VscCheck } from "react-icons/vsc";

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container" data-testid="homepage_container">
      {/* Graphic Section with logo and subtitle */}
      <div className="graphic-container" data-testid="graphic_section">
        <h1 className="maf-logo" data-testid="logo_text">MAF</h1>
        <p className="maf-subtitle" data-testid="subtitle_text">Moja Aplikacja Faktur</p>
      </div>

      <p className="homepage-description" data-testid="homepage_description">
        Zarządzaj swoimi fakturami i kontrahentami w prosty i intuicyjny sposób.
      </p>

      <div className="homepage-buttons">
        <Link to="/invoices" className="homepage-button" data-testid="homepage_invoices_button">
          Faktury
        </Link>
        <Link to="/contractors" className="homepage-button" data-testid="homepage_contractors_button">
          Kontrahenci
        </Link>
      </div>

      {/* Dashboard cards section */}
      <div className="dashboard-cards" data-testid="dashboard_cards">
        <div className="dashboard-card">
          <h2>Korekty</h2>
          <p>Wkrótce dostępne korekty i noty dla faktur.</p>
        </div>
        <div className="dashboard-card">
          <h2>Powiadomienia</h2>
          <p>Otrzymuj przypomnienia o terminach płatności.</p>
        </div>
        <div className="dashboard-card status-card">
          <div className="status-box">
            <VscCheck className="status-icon" />
          </div>
          <h2>Statusy płatności</h2>
          <p>Analizuj, które faktury wciąż są nieopłacone.</p>
        </div>
        <div className="dashboard-card">
          <h2>Terminy</h2>
          <p>Kontroluj nadchodzące terminy w jednym miejscu.</p>
        </div>
      </div>

      {/* GitHub repo link in the bottom-right corner */}
      <a
        href="https://github.com/darek9k/M-A-F"
        title="Repo na GitHubie"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
      >
        <FaGithub className="github-icon" />
      </a>
    </div>
  );
};

export default HomePage;