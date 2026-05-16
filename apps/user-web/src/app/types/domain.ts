export type CurrencyCode = "KRW" | "JPY";

export interface CountryOption {
  code: string;
  name: string;
  currency: CurrencyCode;
  flag: string;
}

export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  updatedAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  spentAmount: number;
  spentCurrency: CurrencyCode;
  baseAmount: number;
  baseCurrency: CurrencyCode;
  exchangeRate: number;
  countryCode: string;
  memo: string;
  group?: string;
  participants?: number;
  receipt?: string;
  sharedToCommunity: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseDraft {
  date: string;
  category: string;
  spentAmount: number;
  spentCurrency: CurrencyCode;
  countryCode: string;
  memo: string;
  group?: string;
  participants?: number;
  receipt?: string;
}

export interface SharedExpenseSnapshot {
  expenseId: string;
  category: string;
  memo: string;
  date: string;
  spentAmount: number;
  spentCurrency: CurrencyCode;
  baseAmount: number;
  baseCurrency: CurrencyCode;
  exchangeRate: number;
  countryCode: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  sharedExpenses: SharedExpenseSnapshot[];
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostDraft {
  content: string;
  sharedExpenseIds: string[];
}

export interface RewardSummary {
  attendanceDays: number;
  missionPoints: number;
  level: number;
  nextLevelTarget: number;
  streakDays: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  baseCountryCode: string;
  baseCurrency: CurrencyCode;
}

export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  autoBackup: boolean;
}

export interface AppData {
  profile: UserProfile;
  settings: AppSettings;
  countries: CountryOption[];
  exchangeRates: ExchangeRate[];
  expenses: Expense[];
  posts: CommunityPost[];
}
