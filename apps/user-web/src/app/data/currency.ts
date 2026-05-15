import type { CountryOption, CurrencyCode, ExchangeRate } from "../types/domain";

export const countries: CountryOption[] = [
  { code: "KR", name: "대한민국", currency: "KRW", flag: "🇰🇷" },
  { code: "JP", name: "일본", currency: "JPY", flag: "🇯🇵" },
  { code: "US", name: "미국", currency: "USD", flag: "🇺🇸" },
  { code: "DE", name: "유럽", currency: "EUR", flag: "🇪🇺" },
];

export const exchangeRates: ExchangeRate[] = [
  { from: "KRW", to: "KRW", rate: 1, updatedAt: "2026-05-15" },
  { from: "JPY", to: "JPY", rate: 1, updatedAt: "2026-05-15" },
  { from: "USD", to: "USD", rate: 1, updatedAt: "2026-05-15" },
  { from: "EUR", to: "EUR", rate: 1, updatedAt: "2026-05-15" },
  { from: "JPY", to: "KRW", rate: 9.1, updatedAt: "2026-05-15" },
  { from: "KRW", to: "JPY", rate: 0.11, updatedAt: "2026-05-15" },
  { from: "USD", to: "KRW", rate: 1385, updatedAt: "2026-05-15" },
  { from: "KRW", to: "USD", rate: 0.00072, updatedAt: "2026-05-15" },
  { from: "EUR", to: "KRW", rate: 1506, updatedAt: "2026-05-15" },
  { from: "KRW", to: "EUR", rate: 0.00066, updatedAt: "2026-05-15" },
  { from: "USD", to: "JPY", rate: 154.2, updatedAt: "2026-05-15" },
  { from: "JPY", to: "USD", rate: 0.00648, updatedAt: "2026-05-15" },
  { from: "EUR", to: "JPY", rate: 167.4, updatedAt: "2026-05-15" },
  { from: "JPY", to: "EUR", rate: 0.00597, updatedAt: "2026-05-15" },
  { from: "USD", to: "EUR", rate: 0.92, updatedAt: "2026-05-15" },
  { from: "EUR", to: "USD", rate: 1.09, updatedAt: "2026-05-15" },
];

export function getCountryByCode(code: string) {
  return countries.find((country) => country.code === code) ?? countries[0];
}

export function getCurrencySymbol(currency: CurrencyCode) {
  switch (currency) {
    case "KRW":
      return "₩";
    case "JPY":
      return "¥";
    case "USD":
      return "$";
    case "EUR":
      return "€";
  }
}

export function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRate[],
) {
  const rate = rates.find((item) => item.from === from && item.to === to);
  return rate?.rate ?? 1;
}

export function formatCurrency(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "KRW" || currency === "JPY" ? 0 : 2,
  }).format(amount);
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRate[],
) {
  const converted = amount * getExchangeRate(from, to, rates);
  return from === "USD" || from === "EUR" || to === "USD" || to === "EUR"
    ? Math.round(converted * 100) / 100
    : Math.round(converted);
}
