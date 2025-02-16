import { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../../styles/pageHeader.scss";

export interface Option<T> {
  label: string;
  value: T;
}

export interface CheckboxFilterProps<T> {
  label: string;
  selected: T[];
  options: Option<T>[];
  onChange: (value: T) => void;
  onClear: () => void;
  isOpen: boolean;
  toggleOpen: () => void;
}

const CheckboxFilter = <T extends string | number>({
  label,
  selected,
  options,
  onChange,
  onClear,
  isOpen,
  toggleOpen,
}: CheckboxFilterProps<T>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  // Calculate dropdown menu position when open
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
  }, [isOpen]);

  const dropdownMenu =
    isOpen &&
    ReactDOM.createPortal(
      <div
        className="filter-dropdown"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          top: menuPosition.top,
          left: menuPosition.left,
        }}
        data-testid="dropdown_menu"
      >
        {options.map((opt) => (
          <label
            className="filter-label"
            key={JSON.stringify(opt.value)}
            data-testid={`checkbox_label_${opt.value}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onChange(opt.value)}
              style={{ marginRight: "5px" }}
              data-testid={`checkbox_input_${opt.value}`}
            />
            {opt.label}
          </label>
        ))}
      </div>,
      document.body,
    );

  return (
    <div className="dropdown-filter" style={{ position: "relative" }}>
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleOpen}
        className="header-nav-btn"
        data-testid="filter_toggle_button"
      >
        {`Filtr: ${label}`}
        {selected.length > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            style={{
              color: "red",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "5px",
            }}
            data-testid="clear_filter_button"
          >
            ×
          </span>
        )}
      </button>
      {dropdownMenu}
    </div>
  );
};

export default CheckboxFilter;
