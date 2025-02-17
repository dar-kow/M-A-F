import React from "react";

interface TableBodyProps<T> {
    data: T[];
    renderRow: (item: T) => React.ReactNode;
}

const TableBody = <T,>({ data, renderRow }: TableBodyProps<T>) => {
    return (
        <table className="fancy body-table" style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
                <col className="number-column" />
                <col className="contractor-column" />
                <col className="amount-column" />
                <col className="date-column" />
                <col className="paymentStatus-column" />
                <col className="paymentMethod-column" />
                <col className="remaining-column" />
                <col className="dueDate-column" />
                <col className="action-column" />
            </colgroup>
            <tbody>
                {data.map((item) => renderRow(item))}
            </tbody>
        </table>
    );
};

export default TableBody;