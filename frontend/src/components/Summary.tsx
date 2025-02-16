import React from "react";

interface SummaryProps {
  totalNet: number;
  totalVat: number;
  totalGross: number;
  paidAmount: number;
  remaining: number;
  remarks: string;
  setRemarks: (value: string) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const Summary: React.FC<SummaryProps> = ({
  totalNet,
  totalVat,
  totalGross,
  paidAmount,
  remaining,
  remarks,
  setRemarks,
  handleChange,
}) => {
  const safePaidAmount = paidAmount || 0;
  const calculatedVatRate =
    totalNet > 0 ? ((totalGross / totalNet - 1) * 100).toFixed(0) + "%" : "–";

  return (
    <div className="summary-section" data-testid="summary_section">
      <h3 data-testid="summary_title">Podsumowanie</h3>
      <table className="summary-table" data-testid="summary_table">
        <thead>
          <tr>
            <th></th>
            <th data-testid="summary_header_vat_rate">Stawka VAT</th>
            <th data-testid="summary_header_net">Wartość Netto</th>
            <th data-testid="summary_header_vat">VAT</th>
            <th data-testid="summary_header_gross">Wartość Brutto</th>
          </tr>
        </thead>
        <tbody>
          <tr className="summary-row" data-testid="summary_row_amount">
            <td>Kwota:</td>
            <td>{calculatedVatRate}</td>
            <td>{totalNet.toFixed(2)}</td>
            <td>{totalVat.toFixed(2)}</td>
            <td>{totalGross.toFixed(2)}</td>
          </tr>
          <tr className="summary-row" data-testid="summary_row_paid">
            <td colSpan={2}>Zapłacono:</td>
            <td colSpan={3}>
              <input
                type="number"
                name="paidAmount"
                value={safePaidAmount === 0 ? "" : safePaidAmount}
                onChange={handleChange}
                placeholder="Zapłacono"
                data-testid="paid_amount_input"
              />
            </td>
          </tr>
          <tr className="summary-row" data-testid="summary_row_remaining">
            <td colSpan={2}>Pozostało do zapłaty:</td>
            <td colSpan={3}>{remaining.toFixed(2)}</td>
          </tr>
          <tr className="summary-row" data-testid="summary_row_remarks">
            <td>Uwagi / Opis:</td>
            <td colSpan={4}>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Wprowadź uwagi"
                className="large-textarea"
                data-testid="remarks_textarea"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
