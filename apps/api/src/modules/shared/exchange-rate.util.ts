const exchangeRates = [
  { from: "KRW", to: "KRW", rate: 1 },
  { from: "JPY", to: "JPY", rate: 1 },
  { from: "JPY", to: "KRW", rate: 9.1 },
  { from: "KRW", to: "JPY", rate: 0.11 },
];

export function getExchangeRate(from: string, to: string) {
  return exchangeRates.find((rate) => rate.from === from && rate.to === to)?.rate ?? 1;
}

export function convertCurrency(amount: number, from: string, to: string) {
  return Math.round(amount * getExchangeRate(from, to));
}

export function listExchangeRates() {
  return exchangeRates.map((rate) => ({
    ...rate,
    updatedAt: "2026-05-15",
  }));
}
