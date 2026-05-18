import { useRef, useState } from "react";
import { Trophy, Calendar, TrendingUp, Heart, LogOut, Globe2, Camera, X, Pencil, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router";
import PixelCharacter from "./PixelCharacter";
import { useAppData } from "../context/AppDataContext";
import { formatCurrency, getCountryByCode } from "../data/currency";
import { clearAuthSession } from "../lib/auth";
import { CHARACTERS, getCurrentCharacter, RARITY_LABEL, RARITY_COLOR } from "../data/characters";

export default function MyPage() {
  const navigate = useNavigate();
  const { profile, rewardSummary, monthlyTotals, expenses, posts, profilePhoto, updateProfilePhoto, updateProfileName } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);

  const handleSaveName = async () => {
    const trimmed = draftName.trim();
    if (!trimmed || trimmed === profile.name) { setEditingName(false); return; }
    await updateProfileName(trimmed);
    setEditingName(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") updateProfilePhoto(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.baseAmount, 0);
  const averageSpend = expenses.length ? Math.round(totalSpent / expenses.length) : 0;
  const myPosts = posts.filter((post) => post.authorId === profile.id);
  const country = getCountryByCode(profile.baseCountryCode);

  const displayChar = rewardSummary.equippedCharacterId
    ? (CHARACTERS.find((c) => c.id === rewardSummary.equippedCharacterId) ?? getCurrentCharacter(rewardSummary.level))
    : getCurrentCharacter(rewardSummary.level);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* Profile photo */}
        <div className="relative shrink-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-primary/10"
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-primary">{profile.name[0]}</span>
            )}
          </div>
          {profilePhoto && (
            <button
              onClick={() => updateProfilePhoto(null)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center hover:bg-destructive/80 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            <Camera className="w-3 h-3" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2>마이페이지</h2>
          {editingName ? (
            <div className="flex items-center gap-1.5 mt-1">
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSaveName();
                  if (e.key === "Escape") setEditingName(false);
                }}
                autoFocus
                maxLength={20}
                className="text-sm px-2 py-0.5 rounded border border-border bg-input-background focus:outline-none focus:ring-1 focus:ring-ring w-32"
              />
              <button onClick={() => void handleSaveName()} className="text-primary hover:text-primary/70 transition-colors">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setEditingName(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-medium truncate">{profile.name}</span>
              <button
                onClick={() => { setDraftName(profile.name); setEditingName(true); }}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {country.flag} {country.name} · {profile.baseCurrency} 기준
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 text-sm shrink-0"
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

        <button
          onClick={() => navigate("/mypage/character")}
          className="w-full bg-muted rounded-xl p-6 mb-4 hover:bg-muted/70 transition-colors group"
        >
          <div className="flex justify-center mb-2">
            <PixelCharacter characterId={displayChar.id} size={128} />
          </div>
          <p className={`text-sm font-semibold ${RARITY_COLOR[displayChar.rarity]}`}>
            {displayChar.korName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground transition-colors">
            {RARITY_LABEL[displayChar.rarity]} · 상세 보기 →
          </p>
        </button>

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
