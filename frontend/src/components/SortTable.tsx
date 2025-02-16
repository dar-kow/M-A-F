import React, { useState } from "react";
import { sortData } from "../utils/sortUtils";

interface SortTableProps<T> {
  data: T[];
  columns: { key: string; label: string }[];
  getValue: (item: T, column: string) => any;
  renderRow: (item: T) => React.ReactNode;
}

const SortTable = <T,>({
  data,
  columns,
  getValue,
  renderRow,
}: SortTableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<string>(columns[0].key);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData = sortData(data, sortColumn, sortOrder, getValue);

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="table-container">
      <table className="fancy">
        <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  textAlign: col.key === "actions" ? "center" : "left",
                  cursor: "pointer",
                }}
              >
                {col.label}
                {renderSortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{sortedData.map((item) => renderRow(item))}</tbody>
      </table>
    </div>
  );
};

export default SortTable;
