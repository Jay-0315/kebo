const exchangeRates = [
  { from: "KRW", to: "KRW", rate: 1 },
  { from: "JPY", to: "JPY", rate: 1 },
  { from: "USD", to: "USD", rate: 1 },
  { from: "EUR", to: "EUR", rate: 1 },
  { from: "JPY", to: "KRW", rate: 9.1 },
  { from: "KRW", to: "JPY", rate: 0.11 },
  { from: "USD", to: "KRW", rate: 1385 },
  { from: "KRW", to: "USD", rate: 0.00072 },
  { from: "EUR", to: "KRW", rate: 1506 },
  { from: "KRW", to: "EUR", rate: 0.00066 },
  { from: "USD", to: "JPY", rate: 154.2 },
  { from: "JPY", to: "USD", rate: 0.00648 },
  { from: "EUR", to: "JPY", rate: 167.4 },
  { from: "JPY", to: "EUR", rate: 0.00597 },
  { from: "USD", to: "EUR", rate: 0.92 },
  { from: "EUR", to: "USD", rate: 1.09 },
];

export function getExchangeRate(from: string, to: string) {
  return exchangeRates.find((rate) => rate.from === from && rate.to === to)?.rate ?? 1;
}

export function convertCurrency(amount: number, from: string, to: string) {
  const converted = amount * getExchangeRate(from, to);
  return from === "USD" || from === "EUR" || to === "USD" || to === "EUR"
    ? Math.round(converted * 100) / 100
    : Math.round(converted);
}

export function listExchangeRates() {
  return exchangeRates.map((rate) => ({
    ...rate,
    updatedAt: "2026-05-15",
  }));
}
