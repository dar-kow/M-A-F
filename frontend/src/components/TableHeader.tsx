import React from "react";

interface TableHeaderProps {
    columns: { key: string; label: string }[];
    sortColumn: string;
    sortOrder: "asc" | "desc";
    onSort: (column: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
    columns,
    sortColumn,
    sortOrder,
    onSort,
}) => {
    const renderSortIcon = (column: string) => {
        if (sortColumn !== column) return null;
        return sortOrder === "asc" ? " ▲" : " ▼";
    };

    return (
        <table className="fancy header-table" style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
                {columns.map((col) => (
                    // Przykładowe szerokości – dopasuj do swoich klas, np.:
                    <col key={col.key} className={`${col.key}-column`} />
                ))}
            </colgroup>
            <thead
                style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#4a90e2",
                    zIndex: 2,
                }}
            >
                <tr>
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            onClick={() => onSort(col.key)}
                            className={`${col.key}-column`}
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
        </table>
    );
};

export default TableHeader;