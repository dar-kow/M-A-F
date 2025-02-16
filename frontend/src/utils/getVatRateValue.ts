export const getVatRateValue = (vat: string | number): number => {
  // If 'vat' is already a number, return as is.
  if (typeof vat === "number") return vat;

  // Mapping string VAT identifiers to number values
  const mapping: Record<string, number> = {
    Zero: 0,
    Three: 3,
    Five: 5,
    Eight: 8,
    TwentyThree: 23,
  };

  return mapping[vat] ?? 0;
};
