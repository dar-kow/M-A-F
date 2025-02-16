export const sortData = <T>(
  data: T[],
  sortColumn: string,
  sortOrder: "asc" | "desc",
  getValue: (item: T, column: string) => any,
): T[] => {
  return data.slice().sort((a, b) => {
    const aValue = getValue(a, sortColumn);
    const bValue = getValue(b, sortColumn);

    // Jeśli sortujemy po numerze faktury, musimy uwzględnić specjalne sortowanie
    if (sortColumn === "number") {
      const aNumber = parseInt(aValue.split("/")[0]);
      const bNumber = parseInt(bValue.split("/")[0]);

      if (aNumber < bNumber) return sortOrder === "asc" ? -1 : 1;
      if (aNumber > bNumber) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};
