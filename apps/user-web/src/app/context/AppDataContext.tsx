import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { countries, exchangeRates, getCountryByCode, getExchangeRate } from "../data/currency";
import { initialAppData } from "../data/seed";
import { api } from "../lib/api";
import { getStoredUser } from "../lib/auth";
import type {
  AppSettings,
  CommunityPost,
  CommunityPostDraft,
  CurrencyCode,
  ExchangeRate,
  Expense,
  ExpenseDraft,
  RewardSummary,
  SharedExpenseSnapshot,
  UserProfile,
} from "../types/domain";

const SETTINGS_STORAGE_KEY = "kebo-local-settings";
const LIKES_STORAGE_KEY = "kebo-liked-posts";

interface AppDataContextValue {
  profile: UserProfile;
  settings: AppSettings;
  countries: typeof countries;
  exchangeRates: ExchangeRate[];
  expenses: Expense[];
  posts: CommunityPost[];
  rewardSummary: RewardSummary;
  monthlyTotals: { month: string; amount: number }[];
  createExpense: (draft: ExpenseDraft) => Promise<void>;
  updateExpense: (expenseId: string, draft: ExpenseDraft) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  createPost: (draft: CommunityPostDraft) => Promise<void>;
  updatePost: (postId: string, draft: CommunityPostDraft) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  togglePostLike: (postId: string) => Promise<void>;
  updateProfileCurrency: (countryCode: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  equipCharacter: (characterId: number) => Promise<void>;
  getCountryName: (code: string) => string;
  refreshData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function mapExpense(apiExpense: Record<string, unknown>): Expense {
  return {
    id: String(apiExpense.id),
    date: String(apiExpense.expenseDate).slice(0, 10),
    category: String(apiExpense.category),
    spentAmount: Number(apiExpense.spentAmount),
    spentCurrency: String(apiExpense.spentCurrency) as CurrencyCode,
    baseAmount: Number(apiExpense.baseAmount),
    baseCurrency: String(apiExpense.baseCurrency) as CurrencyCode,
    exchangeRate: Number(apiExpense.exchangeRate),
    countryCode: String(apiExpense.countryCode),
    memo: String(apiExpense.memo),
    group: (apiExpense.groupName as string | null) ?? undefined,
    participants: (apiExpense.participants as number | null) ?? undefined,
    receipt: (apiExpense.receiptUrl as string | null) ?? undefined,
    sharedToCommunity: Boolean(apiExpense.sharedToCommunity),
    createdAt: String(apiExpense.createdAt),
    updatedAt: String(apiExpense.updatedAt),
  };
}

function mapSnapshot(snapshot: Record<string, unknown>): SharedExpenseSnapshot {
  return {
    expenseId: String(snapshot.expenseId),
    category: String(snapshot.category),
    memo: String(snapshot.memo),
    date: String(snapshot.expenseDate).slice(0, 10),
    spentAmount: Number(snapshot.spentAmount),
    spentCurrency: String(snapshot.spentCurrency) as CurrencyCode,
    baseAmount: Number(snapshot.baseAmount),
    baseCurrency: String(snapshot.baseCurrency) as CurrencyCode,
    exchangeRate: Number(snapshot.exchangeRate),
    countryCode: String(snapshot.countryCode),
  };
}

function getLikedPostIds() {
  const raw = localStorage.getItem(LIKES_STORAGE_KEY);
  return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set<string>();
}

function setLikedPostIds(ids: Set<string>) {
  localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

function mapPost(apiPost: Record<string, unknown>, likedPostIds: Set<string>): CommunityPost {
  const user = (apiPost.user as Record<string, unknown> | undefined) ?? {};
  return {
    id: String(apiPost.id),
    authorId: String(apiPost.userId),
    authorName: String(user.name ?? "사용자"),
    content: String(apiPost.content),
    sharedExpenses: Array.isArray(apiPost.sharedExpenses)
      ? (apiPost.sharedExpenses as Record<string, unknown>[]).map(mapSnapshot)
      : [],
    likes: Number(apiPost.likesCount ?? 0),
    isLiked: likedPostIds.has(String(apiPost.id)),
    createdAt: String(apiPost.createdAt),
    updatedAt: String(apiPost.updatedAt),
  };
}

function getMonthlyTotals(expenses: Expense[]) {
  const grouped = expenses.reduce<Record<string, number>>((acc, expense) => {
    const month = `${Number(expense.date.slice(5, 7))}월`;
    acc[month] = (acc[month] ?? 0) + expense.baseAmount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, amount]) => ({ month, amount }));
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const storedUser = getStoredUser();
  const [profile, setProfile] = useState<UserProfile>(storedUser ?? initialAppData.profile);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppSettings) : initialAppData.settings;
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [rewardSummary, setRewardSummary] = useState<RewardSummary>({
    attendanceDays: 0,
    missionPoints: 0,
    level: 1,
    nextLevelTarget: 120,
    streakDays: 0,
    equippedCharacterId: null,
  });
  const [remoteExchangeRates, setRemoteExchangeRates] = useState<ExchangeRate[]>(exchangeRates);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const refreshData = async () => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      return;
    }

    const likedPostIds = getLikedPostIds();
    const [profileResult, expensesResult, postsResult, rewardsResult, ratesResult] =
      await Promise.allSettled([
        api.get<{
          id: string;
          name: string;
          email: string;
          baseCountryCode: string;
          baseCurrency: CurrencyCode;
          settings?: AppSettings;
        }>(`/users/${currentUser.id}/profile`),
        api.get<Record<string, unknown>[]>(`/expenses?userId=${currentUser.id}`),
        api.get<Record<string, unknown>[]>(`/community/posts?userId=${currentUser.id}`),
        api.get<RewardSummary>(`/rewards/summary?userId=${currentUser.id}`),
        api.get<ExchangeRate[]>("/exchange-rates"),
      ]);

    if (profileResult.status === "fulfilled") {
      const p = profileResult.value;
      setProfile({
        id: p.id,
        name: p.name,
        email: p.email,
        baseCountryCode: p.baseCountryCode,
        baseCurrency: p.baseCurrency,
      });
      if (p.settings) setSettings(p.settings);
    }
    if (expensesResult.status === "fulfilled") {
      setExpenses(expensesResult.value.map(mapExpense));
    }
    if (postsResult.status === "fulfilled") {
      setPosts(postsResult.value.map((post) => mapPost(post, likedPostIds)));
    }
    if (rewardsResult.status === "fulfilled") {
      setRewardSummary(rewardsResult.value);
    }
    if (ratesResult.status === "fulfilled") {
      setRemoteExchangeRates(ratesResult.value);
    }
  };

  useEffect(() => {
    if (storedUser) {
      refreshData().catch((error) => {
        console.error(error);
      });
    }
  }, []);

  const createExpense = async (draft: ExpenseDraft) => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      return;
    }

    await api.post("/expenses", {
      userId: currentUser.id,
      expenseDate: draft.date,
      category: draft.category,
      spentAmount: draft.spentAmount,
      spentCurrency: draft.spentCurrency,
      baseAmount: Math.round(
        draft.spentAmount *
          getExchangeRate(draft.spentCurrency, profile.baseCurrency, remoteExchangeRates),
      ),
      baseCurrency: profile.baseCurrency,
      exchangeRate: getExchangeRate(draft.spentCurrency, profile.baseCurrency, remoteExchangeRates),
      countryCode: draft.countryCode,
      memo: draft.memo,
      groupName: draft.group || undefined,
      participants: draft.participants,
      receiptUrl: draft.receipt,
      sharedToCommunity: false,
    });

    await refreshData();
  };

  const updateExpense = async (expenseId: string, draft: ExpenseDraft) => {
    await api.patch(`/expenses/${expenseId}`, {
      expenseDate: draft.date,
      category: draft.category,
      spentAmount: draft.spentAmount,
      spentCurrency: draft.spentCurrency,
      baseAmount: Math.round(
        draft.spentAmount *
          getExchangeRate(draft.spentCurrency, profile.baseCurrency, remoteExchangeRates),
      ),
      baseCurrency: profile.baseCurrency,
      exchangeRate: getExchangeRate(draft.spentCurrency, profile.baseCurrency, remoteExchangeRates),
      countryCode: draft.countryCode,
      memo: draft.memo,
      groupName: draft.group || undefined,
      participants: draft.participants,
      receiptUrl: draft.receipt,
    });

    await refreshData();
  };

  const deleteExpense = async (expenseId: string) => {
    await api.delete(`/expenses/${expenseId}`);
    await refreshData();
  };

  const createPost = async (draft: CommunityPostDraft) => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      return;
    }

    const sharedExpenses = expenses
      .filter((expense) => draft.sharedExpenseIds.includes(expense.id))
      .map((expense) => ({
        expenseId: expense.id,
        category: expense.category,
        memo: expense.memo,
        expenseDate: expense.date,
        spentAmount: expense.spentAmount,
        spentCurrency: expense.spentCurrency,
        baseAmount: expense.baseAmount,
        baseCurrency: expense.baseCurrency,
        exchangeRate: expense.exchangeRate,
        countryCode: expense.countryCode,
      }));

    await api.post("/community/posts", {
      userId: currentUser.id,
      content: draft.content,
      sharedExpenses,
    });

    await refreshData();
  };

  const updatePost = async (postId: string, draft: CommunityPostDraft) => {
    const currentUser = getStoredUser();
    const sharedExpenses = expenses
      .filter((expense) => draft.sharedExpenseIds.includes(expense.id))
      .map((expense) => ({
        expenseId: expense.id,
        category: expense.category,
        memo: expense.memo,
        expenseDate: expense.date,
        spentAmount: expense.spentAmount,
        spentCurrency: expense.spentCurrency,
        baseAmount: expense.baseAmount,
        baseCurrency: expense.baseCurrency,
        exchangeRate: expense.exchangeRate,
        countryCode: expense.countryCode,
      }));

    await api.patch(`/community/posts/${postId}`, {
      userId: currentUser?.id,
      content: draft.content,
      sharedExpenses,
    });

    await refreshData();
  };

  const deletePost = async (postId: string) => {
    await api.delete(`/community/posts/${postId}`);
    await refreshData();
  };

  const togglePostLike = async (postId: string) => {
    await api.post(`/community/posts/${postId}/like`);
    const liked = getLikedPostIds();
    liked.add(postId);
    setLikedPostIds(liked);
    await refreshData();
  };

  const updateProfileCurrency = async (countryCode: string) => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      return;
    }

    const country = getCountryByCode(countryCode);
    const updatedProfile = await api.patch<UserProfile>(`/users/${currentUser.id}/profile`, {
      baseCountryCode: country.code,
      baseCurrency: country.currency,
    });
    localStorage.setItem(
      "kebo-auth-user",
      JSON.stringify({
        ...currentUser,
        baseCountryCode: updatedProfile.baseCountryCode,
        baseCurrency: updatedProfile.baseCurrency,
      }),
    );
    await refreshData();
  };

  const equipCharacter = async (characterId: number) => {
    const currentUser = getStoredUser();
    if (!currentUser) return;
    await api.patch("/rewards/equip", { userId: currentUser.id, characterId });
    setRewardSummary((prev) => ({ ...prev, equippedCharacterId: characterId }));
  };

  const updateSettings = async (nextSettings: Partial<AppSettings>) => {
    const currentUser = getStoredUser();
    setSettings((current) => ({ ...current, ...nextSettings }));

    if (!currentUser) {
      return;
    }

    await api.patch(`/users/${currentUser.id}/settings`, nextSettings);
    await refreshData();
  };

  const monthlyTotals = useMemo(() => getMonthlyTotals(expenses), [expenses]);

  const value: AppDataContextValue = {
    profile,
    settings,
    countries,
    exchangeRates: remoteExchangeRates,
    expenses,
    posts,
    rewardSummary,
    monthlyTotals,
    createExpense,
    updateExpense,
    deleteExpense,
    createPost,
    updatePost,
    deletePost,
    togglePostLike,
    updateProfileCurrency,
    updateSettings,
    equipCharacter,
    getCountryName: (code: string) => getCountryByCode(code).name,
    refreshData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }

  return context;
}
