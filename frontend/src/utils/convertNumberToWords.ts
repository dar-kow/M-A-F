export const convertNumberToWords = (num: number): string => {
  // Convert a number into its Polish word representation.
  if (num === 0) return "zero";

  const units = [
    "",
    "jeden",
    "dwa",
    "trzy",
    "cztery",
    "pięć",
    "sześć",
    "siedem",
    "osiem",
    "dziewięć",
  ];
  const teens = [
    "dziesięć",
    "jedenaście",
    "dwanaście",
    "trzynaście",
    "czternaście",
    "piętnaście",
    "szesnaście",
    "siedemnaście",
    "osiemnaście",
    "dziewiętnaście",
  ];
  const tens = [
    "",
    "",
    "dwadzieścia",
    "trzydzieści",
    "czterdzieści",
    "pięćdziesiąt",
    "sześćdziesiąt",
    "siedemdziesiąt",
    "osiemdziesiąt",
    "dziewięćdziesiąt",
  ];
  const hundreds = [
    "",
    "sto",
    "dwieście",
    "trzysta",
    "czterysta",
    "pięćset",
    "sześćset",
    "siedemset",
    "osiemset",
    "dziewięćset",
  ];

  let words = "";

  // Handle thousands
  if (num >= 1000) {
    const tys = Math.floor(num / 1000);
    words += (tys === 1 ? "tysiąc" : `${convertNumberToWords(tys)} tysięcy`) + " ";
    num %= 1000;
  }

  // Handle hundreds
  if (num >= 100) {
    const h = Math.floor(num / 100);
    words += hundreds[h] + " ";
    num %= 100;
  }

  // Handle tens and teens
  if (num >= 20) {
    const t = Math.floor(num / 10);
    words += tens[t] + " ";
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + " ";
    num = 0;
  }

  // Handle units
  if (num > 0) {
    words += units[num] + " ";
  }

  return words.trim();
};

export const convertAmountToWords = (amount: number): string => {
  // Split amount into integer and fractional parts and convert to words.
  const integerPart = Math.floor(amount);
  const fractionalPart = Math.round((amount - integerPart) * 100);
  const words = convertNumberToWords(integerPart);
  return `${words} ${fractionalPart.toString().padStart(2, "0")}/100`;
};
