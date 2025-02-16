import React, { useEffect, useRef, useState } from "react";
import "../../styles/pageHeader.scss";

interface FilterSelectionProps {
  availableFilters: { key: string; label: string }[];
  selectedFilterKeys: string[];
  onApplyFilters: (filters: string[]) => void;
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;
  children: React.ReactNode;
  filterId: string;
}

const FilterSelection: React.FC<FilterSelectionProps> = ({
  availableFilters,
  selectedFilterKeys,
  onApplyFilters,
  showFilterMenu,
  setShowFilterMenu,
  children,
  filterId,
}) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [tempSelectedFilters, setTempSelectedFilters] =
    useState<string[]>(selectedFilterKeys);

  // Za każdym razem gdy menu się otworzy, kopiujemy aktualne filtry do lokalnego stanu
  useEffect(() => {
    if (showFilterMenu) {
      setTempSelectedFilters(selectedFilterKeys);
    }
  }, [showFilterMenu, selectedFilterKeys]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node) &&
        showFilterMenu
      ) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowFilterMenu, showFilterMenu]);

  const toggleTempFilter = (key: string) => {
    setTempSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters(tempSelectedFilters);
    setShowFilterMenu(false);
  };

  const handleClearFilters = () => {
    setTempSelectedFilters([]);
    onApplyFilters([]);
    setShowFilterMenu(false);
  };

  const handleToggleMenu = () => {
    // Jeśli menu ma się otworzyć, obliczamy pozycję guzika na ekranie
    if (!showFilterMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom, left: rect.left });
    }
    setShowFilterMenu(!showFilterMenu);
  };

  return (
    <div style={{ position: "relative" }} ref={menuContainerRef}>
      {/* Kontener z wybranymi filtrami oraz guzikiem – wszystkie w jednym wierszu */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          gap: "10px",
          marginBottom: "0px",
          overflowX: "auto",
        }}
      >
        {children}
        <button
          ref={buttonRef}
          onClick={handleToggleMenu}
          className="header-nav-btn"
          aria-label="Filtry"
        >
          Wybierz filtry
        </button>
      </div>
      {showFilterMenu && (
        <div
          style={{
            position: "fixed",
            top: menuPosition.top,
            left: menuPosition.left,
            border: "1px solid #ccc",
            padding: "10px",
            background: "#fff",
            zIndex: 1000,
            width: "200px",
          }}
        >
          {availableFilters.map((filter) => (
            <div key={filter.key}>
              <label className="filter-label">
                <input
                  type="checkbox"
                  checked={tempSelectedFilters.includes(filter.key)}
                  onChange={() => toggleTempFilter(filter.key)}
                />
                {filter.label}
              </label>
            </div>
          ))}
          <div>
            <button
              className={`header-nav-btn ${tempSelectedFilters.length === 0 ? "disabled" : ""}`}
              onClick={handleApplyFilters}
              disabled={tempSelectedFilters.length === 0}
            >
              Zatwierdź
            </button>
            <button
              className={`header-nav-btn ${tempSelectedFilters.length === 0 ? "disabled" : ""}`}
              onClick={handleClearFilters}
              disabled={tempSelectedFilters.length === 0}
            >
              Wyczyść
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSelection;
