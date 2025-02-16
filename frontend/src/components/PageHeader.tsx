import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { VscHome, VscMenu } from "react-icons/vsc";
import "../styles/pageHeader.scss";

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actionLink?: string;
  actionIcon?: React.ReactNode;
  actionTooltip?: string;
  onSearch?: (searchTerm: string) => void;
  filterComponent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  actionLink,
  actionIcon,
  actionTooltip,
  onSearch,
  filterComponent,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="page-header" data-testid="page_header">
      {/* Left Section - Home Link */}
      <div className="left-section" data-testid="page_header_left">
        <div className="home-container">
          <Link
            to="/"
            className="home-link"
            data-tooltip="Home"
            data-testid="page_header_home_link"
          >
            <VscHome size={24} />
          </Link>
        </div>
      </div>
      {/* Center Section - Title and Icon */}
      <div className="center-section">
        {icon && <div className="header-icon" data-testid="page_header_icon">{icon}</div>}
        <div className="title-container" data-testid="page_header_title">
          <h1>{title}</h1>
        </div>
      </div>
      {/* Right Section - Search, Filter, Action Link & Menu */}
      <div className="right-section" data-testid="page_header_right">
        {onSearch && (
          <input
            type="text"
            placeholder="Szukaj..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            data-testid="header_search_input"
          />
        )}
        {filterComponent && (
          <div className="header-" style={{ marginRight: "20px" }} data-testid="header_filter_component">
            {filterComponent}
          </div>
        )}
        {actionLink && actionIcon && (
          <Link
            to={actionLink}
            className="header-action"
            data-tooltip={actionTooltip}
            data-testid="header_action_link"
          >
            {actionIcon}
          </Link>
        )}
        <button
          onClick={toggleMenu}
          className="menu-button"
          aria-label="Menu"
          data-testid="header_menu_button"
        >
          <VscMenu />
        </button>
        {isMenuOpen && (
          <nav ref={menuRef} className="header-nav" data-testid="page_header_nav">
            <ul>
              <li>
                <Link to="/contractors" onClick={handleLinkClick} data-testid="nav_link_contractors">
                  Kontrahenci
                </Link>
              </li>
              <li>
                <Link to="/invoices" onClick={handleLinkClick} data-testid="nav_link_invoices">
                  Faktury
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
