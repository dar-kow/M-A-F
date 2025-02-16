export const formatMoney = (amount: number): string => {
  // Format number as a Polish currency string with correct spacing.
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace(/\u00A0/g, " ");
};
