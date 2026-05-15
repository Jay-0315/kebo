import { Link } from "react-router";
import { Plus, Globe2 } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { formatCurrency, getCountryByCode } from "../data/currency";

export default function HomePage() {
  const { expenses, profile, rewardSummary } = useAppData();
  const recentExpenses = expenses.slice(0, 4);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.baseAmount, 0);
  const sharedSpent = expenses
    .filter((expense) => expense.sharedToCommunity)
    .reduce((sum, expense) => sum + expense.baseAmount, 0);
  const categoryTotals = Object.entries(
    expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.baseAmount;
      return acc;
    }, {}),
  )
    .map(([name, amount], index) => ({
      name,
      amount,
      color: ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4"][index % 4],
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
  const country = getCountryByCode(profile.baseCountryCode);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-6 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-1">안녕하세요</p>
        <h2 className="mb-6">{profile.name}님의 환율 가계부</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs opacity-80 mb-1">메인국가 기준 총지출</p>
            <p className="text-xl font-bold">{formatCurrency(totalSpent, profile.baseCurrency)}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs opacity-80 mb-1">공유된 내역 합계</p>
            <p className="text-xl font-bold">{formatCurrency(sharedSpent, profile.baseCurrency)}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs opacity-80 mb-1">리워드 포인트</p>
            <p className="text-xl font-bold">{rewardSummary.missionPoints}P</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-card rounded-lg p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3>최근 지출</h3>
            <Link to="/expenses" className="text-primary text-sm hover:underline">
              전체보기
            </Link>
          </div>
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted hover:bg-accent/20 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-lg">{getCountryByCode(expense.countryCode).flag}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{expense.memo}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{expense.date} · {expense.category}</span>
                    <span>{getCountryByCode(expense.countryCode).name}</span>
                    {expense.sharedToCommunity && (
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">
                        커뮤니티 공유
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    사용 금액 {formatCurrency(expense.spentAmount, expense.spentCurrency)}
                  </p>
                </div>
                <p className="font-bold text-destructive">
                  {formatCurrency(expense.baseAmount, expense.baseCurrency)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg p-5 border border-border">
            <h3 className="mb-4">카테고리별 지출</h3>
            <div className="space-y-4">
              {categoryTotals.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{category.name}</span>
                    <span className="font-bold text-destructive">
                      {formatCurrency(category.amount, profile.baseCurrency)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} rounded-full`}
                      style={{ width: `${totalSpent ? (category.amount / totalSpent) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg p-5 border border-border">
            <h3 className="mb-4">기준 통화</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Globe2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {country.flag} {country.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    모든 통계는 {profile.baseCurrency} 기준으로 고정 표시됩니다.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">출석 일수</p>
                  <p className="text-xl font-bold text-primary/80">{rewardSummary.attendanceDays}일</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">연속 기록</p>
                  <p className="text-xl font-bold text-accent">{rewardSummary.streakDays}일</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link to="/expenses">
        <button className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
}
