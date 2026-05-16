import { Trophy, Calendar, TrendingUp, Heart, LogOut, Globe2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router";
import PixelCharacter from "./PixelCharacter";
import { useAppData } from "../context/AppDataContext";
import { formatCurrency, getCountryByCode } from "../data/currency";
import { clearAuthSession } from "../lib/auth";

export default function MyPage() {
  const navigate = useNavigate();
  const { profile, rewardSummary, monthlyTotals, expenses, posts } = useAppData();

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.baseAmount, 0);
  const averageSpend = expenses.length ? Math.round(totalSpent / expenses.length) : 0;
  const myPosts = posts.filter((post) => post.authorId === profile.id);
  const country = getCountryByCode(profile.baseCountryCode);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>마이페이지</h2>
          <p className="text-sm text-muted-foreground">
            {country.flag} {country.name} · {profile.baseCurrency} 기준
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 text-sm"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-sm border-2 border-primary/80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary/80" />
            나의 캐릭터
          </h3>
          <span className="bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Lv.{rewardSummary.level}
          </span>
        </div>

        <div className="bg-muted rounded-xl p-6 mb-4">
          <div className="flex justify-center mb-2">
            <PixelCharacter level={rewardSummary.level} size={128} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">출석 일수</p>
            <p className="text-2xl font-bold text-primary/80">{rewardSummary.attendanceDays}일</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">미션 포인트</p>
            <p className="text-2xl font-bold text-primary/80">{rewardSummary.missionPoints}P</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">연속 기록</p>
            <p className="text-2xl font-bold text-accent">{rewardSummary.streakDays}일</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">다음 레벨까지</span>
            <span className="font-medium">
              {Math.max(rewardSummary.nextLevelTarget - rewardSummary.missionPoints, 0)}P
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/80 rounded-full transition-all"
              style={{
                width: `${(rewardSummary.missionPoints / rewardSummary.nextLevelTarget) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary/80" />
          월별 지출 합계
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#A3A3A3" }} />
            <YAxis tick={{ fontSize: 12, fill: "#A3A3A3" }} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value, profile.baseCurrency)}
              contentStyle={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="amount" fill="#b7607e" fillOpacity={0.85} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            이번 달 요약
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">총 지출</p>
              <p className="text-xl font-bold text-destructive">
                {formatCurrency(totalSpent, profile.baseCurrency)}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-1">평균 기록 금액</p>
              <p className="text-xl font-bold text-accent">
                {formatCurrency(averageSpend, profile.baseCurrency)}
              </p>
            </div>
          </div>
          <div className="mt-4 bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="w-4 h-4 text-primary" />
              <p className="font-medium">리워드 기준</p>
            </div>
            <p className="text-sm text-muted-foreground">출석 5P · 내역 기록 3P · 내역 공유 8P · 글 작성 5P</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary/80" />
            내가 작성한 게시글
          </h3>
          <div className="space-y-2">
            {myPosts.length === 0 ? (
              <div className="p-4 rounded-lg bg-muted text-sm text-muted-foreground">
                아직 작성한 게시글이 없습니다.
              </div>
            ) : (
              myPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-accent/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{post.content}</p>
                    <p className="text-sm text-muted-foreground">
                      공유 내역 {post.sharedExpenses.length}건 · 좋아요 {post.likes}
                    </p>
                  </div>
                  <Heart className="w-5 h-5 text-primary/80 fill-current shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
