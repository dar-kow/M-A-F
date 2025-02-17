import React from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import { InvoiceItem, Unit, VatRate } from "../types/types";
import { getVatRateValue } from "../utils/getVatRateValue";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onItemChange: (index: number, field: keyof InvoiceItem, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  isEditing: boolean;
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  items,
  onItemChange,
  addItem,
  removeItem,
  isEditing,
}) => {
  return (
    <div className="invoice-items-section" data-testid="invoice_items_section">
      <h3 data-testid="invoice_items_title">Pozycje faktury</h3>
      <table className="invoice-items-table responsive-table" data-testid="invoice_items_table">
        <thead>
          <tr>
            <th>Lp</th>
            <th className="long-input">Nazwa artykułu/usługi</th>
            <th>Ilość</th>
            <th>Jednostka</th>
            <th>Stawka VAT</th>
            <th>Cena netto</th>
            <th>Cena brutto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const gross = item.quantity * item.netPrice * (1 + getVatRateValue(item.vatRate) / 100);
            return (
              <tr key={item.id} data-testid={`invoice_item_row_${index}`}>
                <td data-label="Lp">{index + 1}</td>
                <td data-label="Nazwa artykułu">
                  <input
                    type="text"
                    className="long-input"
                    value={item.description}
                    onChange={(e) => onItemChange(index, "description", e.target.value)}
                    placeholder="Opis artykułu/usługi"
                    data-testid={`invoice_item_description_input_${index}`}
                  />
                </td>
                <td data-label="Ilość">
                  <input
                    type="number"
                    className="number-input"
                    value={item.quantity === 0 ? "" : item.quantity}
                    onChange={(e) => onItemChange(index, "quantity", e.target.value)}
                    placeholder="Ilość"
                    data-testid={`invoice_item_quantity_input_${index}`}
                  />
                </td>
                <td data-label="Jednostka">
                  <select
                    className="large-select"
                    value={item.unit}
                    onChange={(e) => onItemChange(index, "unit", e.target.value)}
                    data-testid={`invoice_item_unit_select_${index}`}
                  >
                    <option value={Unit.l}>litr</option>
                    <option value={Unit.szt}>sztuka</option>
                    <option value={Unit.m}>metr</option>
                    <option value={Unit.kg}>kilogram</option>
                  </select>
                </td>
                <td data-label="Stawka VAT">
                  <select
                    className="large-select"
                    value={getVatRateValue(item.vatRate)}
                    onChange={(e) => onItemChange(index, "vatRate", e.target.value)}
                    data-testid={`invoice_item_vat_select_${index}`}
                  >
                    <option value={VatRate.Zero}>0%</option>
                    <option value={VatRate.Three}>3%</option>
                    <option value={VatRate.Five}>5%</option>
                    <option value={VatRate.Eight}>8%</option>
                    <option value={VatRate.TwentyThree}>23%</option>
                  </select>
                </td>
                <td data-label="Cena netto">
                  <input
                    type="number"
                    className="net-input"
                    value={item.netPrice === 0 ? "" : item.netPrice}
                    onChange={(e) => onItemChange(index, "netPrice", e.target.value)}
                    placeholder="Cena netto"
                    data-testid={`invoice_item_net_price_input_${index}`}
                  />
                </td>
                <td data-label="Cena brutto">
                  <input
                    type="text"
                    readOnly
                    className="read-only price-input"
                    value={gross.toFixed(2)}
                    data-testid={`invoice_item_gross_price_${index}`}
                  />
                </td>
                <td data-label="" style={{ width: "50px", textAlign: "center" }}>
                  {index > 0 && (
                    <button
                      type="button"
                      className="delete-item"
                      onClick={() => removeItem(index)}
                      style={{ width: "30px", height: "30px" }}
                      data-testid={`invoice_item_delete_button_${index}`}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="add-item-container" style={{ marginTop: "20px" }}>
        <button
          type="button"
          className="add-item-button"
          onClick={addItem}
          disabled={isEditing}
          data-testid="add_invoice_item_button"
        >
          <FaPlus style={{ marginRight: "0px" }} />
        </button>
      </div>
    </div>
  );
};

export default InvoiceItems;
