import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft, Users, Crown, Calendar, TrendingUp,
  Copy, Check, UserPlus, Plus, X, Swords, Pencil, Camera, ChevronRight,
} from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { useLang } from "../context/LangContext";
import type { CurrencyCode } from "../types/domain";
import { PixelSprite } from "./PixelCharacter";
import { CHARACTERS } from "../data/characters";
import type { CharacterDef } from "../data/characters";
import { getPixelEmoji } from "./PixelEmojis";
import { loadStories, formatRelativeTime } from "../lib/story-storage";
import type { StoryEntry } from "../lib/story-storage";

interface GroupMember {
  id: number;
  name: string;
  isHost: boolean;
}

interface Group {
  id: number;
  name: string;
  code: string;
  members: GroupMember[];
  isHost: boolean;
}

interface LocalExpense {
  id: string;
  date: string;
  category: string;
  spentAmount: number;
  spentCurrency: CurrencyCode;
  memo: string;
  participants?: number;
}

/* ── 멤버 대표 캐릭터: memberId 기반 결정론적 배정 ── */
function getMemberCharacter(memberId: number): CharacterDef {
  return CHARACTERS[(memberId * 17 + 3) % CHARACTERS.length];
}



const STORY_GRADIENTS = [
  "linear-gradient(145deg,#667eea,#764ba2)",
  "linear-gradient(145deg,#f093fb,#f5576c)",
  "linear-gradient(145deg,#4facfe,#00f2fe)",
  "linear-gradient(145deg,#43e97b,#38f9d7)",
  "linear-gradient(145deg,#fa709a,#fee140)",
  "linear-gradient(145deg,#a18cd1,#fbc2eb)",
];
const getMemberGradient = (id: number) => STORY_GRADIENTS[id % STORY_GRADIENTS.length];
const CATEGORY_EMOJI: Record<string, string> = {
  식비: "🍜", 교통: "🚌", 카페: "☕", 쇼핑: "🛍", 숙박: "🏨", 엔터테인먼트: "🎭", 기타: "💳",
};

export default function GroupDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expenses, profile, profilePhoto, isLoading } = useAppData();
  const { t } = useLang();

  const group: Group | undefined = location.state?.group;

  const [showInvite, setShowInvite] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [localExpenses] = useState<LocalExpense[]>([]);
  const [stories] = useState<Record<number, StoryEntry>>(loadStories);

  /* ── Story overlay ── */
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyViewMembers, setStoryViewMembers] = useState<GroupMember[]>([]);
  const [storyIdx, setStoryIdx] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyPausedRef = useRef(false);
  const storyViewMembersRef = useRef<GroupMember[]>([]);
  storyViewMembersRef.current = storyViewMembers;
  const pointerDownTimeRef = useRef(0);

  const openStory = (members: GroupMember[], startIdx: number) => {
    setStoryViewMembers(members);
    setStoryIdx(startIdx);
    setStoryProgress(0);
    storyPausedRef.current = false;
    setStoryOpen(true);
  };

  const closeStory = () => setStoryOpen(false);

  const storyGoNext = useCallback(() => {
    setStoryIdx((prev) => {
      const next = prev + 1;
      if (next >= storyViewMembersRef.current.length) {
        setStoryOpen(false);
        return prev;
      }
      setStoryProgress(0);
      return next;
    });
  }, []);

  const storyGoPrev = () => {
    setStoryIdx((prev) => {
      if (prev <= 0) return 0;
      setStoryProgress(0);
      return prev - 1;
    });
  };

  /* 자동 진행 타이머 */
  useEffect(() => {
    if (!storyOpen) return;
    setStoryProgress(0);
    const DURATION = 5000;
    const TICK = 50;
    const increment = (TICK / DURATION) * 100;
    const id = setInterval(() => {
      if (storyPausedRef.current) return;
      setStoryProgress((p) => Math.min(p + increment, 100));
    }, TICK);
    return () => clearInterval(id);
  }, [storyOpen, storyIdx]);

  /* 100% 도달 시 다음으로 */
  useEffect(() => {
    if (storyProgress >= 100) storyGoNext();
  }, [storyProgress, storyGoNext]);

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="mb-4">{t("group.not_found")}</p>
        <button
          onClick={() => navigate("/groups")}
          className="bg-primary/80 text-primary-foreground rounded px-4 py-2 text-sm font-medium"
        >
          {t("group.back_to_list")}
        </button>
      </div>
    );
  }

  const isCurrentUser = (m: { name: string }) => m.name === profile.name || m.name === "나";

  const copyCode = () => {
    navigator.clipboard.writeText(group.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const serverExpenses = expenses.filter((e) => e.group === group.name);

  const allExpenses = [
    ...localExpenses.map((e) => ({ ...e, baseAmount: Math.round(e.spentAmount * (e.spentCurrency === "JPY" ? 9.1 : 1)) })),
    ...serverExpenses,
  ];

  const goToExpenses = (openForm = false) =>
    navigate(`/groups/${group.id}/expenses`, { state: { group, localExpenses, openForm } });

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/groups")}
          className="p-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2>{group.name}</h2>
            {group.isHost && <Crown className="w-5 h-5 text-amber-500" />}
          </div>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-all ${
            showInvite
              ? "bg-primary/10 text-primary border border-primary/30"
              : "bg-muted hover:bg-muted/70 text-foreground"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          {t("group.invite")}
        </button>
      </div>

      {/* 초대 코드 패널 */}
      {showInvite && (
        <div className="bg-card rounded-md border border-primary/20 p-5">
          <p className="text-sm text-muted-foreground mb-3">{t("group.share_code")}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded px-4 py-3 font-mono text-xl font-bold text-center tracking-widest">
              {group.code}
            </div>
            <button
              onClick={copyCode}
              className="bg-primary/80 text-primary-foreground rounded px-4 py-3 flex items-center gap-2 transition-all hover:shadow-md"
            >
              {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {codeCopied ? t("group.copied") : t("group.copy")}
            </button>
          </div>
        </div>
      )}

      {/* ── Members Section ── */}
      <div className="bg-card rounded-md border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            {t("group.members")}
          </h3>
          <span className="text-sm text-muted-foreground">{group.members.length}{t("group.member_suffix")}</span>
        </div>

        {/* Member story avatars — Instagram 스타일 */}
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none">
          {group.members.map((member) => {
            const isMe = isCurrentUser(member);
            const hasStory = Boolean(stories[member.id]);
            const membersWithStories = group.members.filter((m) => stories[m.id]);

            const handleAvatarClick = () => {
              if (isMe && !hasStory) {
                navigate("/story/create", { state: { member, group } });
                return;
              }
              if (!hasStory) return;
              const startIdx = membersWithStories.findIndex((m) => m.id === member.id);
              openStory(membersWithStories, startIdx >= 0 ? startIdx : 0);
            };

            return (
              <button
                key={member.id}
                onClick={handleAvatarClick}
                className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
              >
                {/* Ring */}
                <div
                  className={`p-[2.5px] rounded-full transition-all group-active:scale-95 ${
                    hasStory
                      ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                      : isMe
                      ? "border-2 border-dashed border-muted-foreground/40"
                      : member.isHost
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : "border-2 border-transparent"
                  }`}
                >
                  <div className={`rounded-full ${hasStory ? "p-[2px] bg-card" : ""}`}>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/70 to-accent/80 flex items-center justify-center overflow-hidden">
                      {profilePhoto && isMe ? (
                        <img src={profilePhoto} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-xl leading-none">{member.name[0]}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 이름 */}
                <p className="text-[11px] font-medium text-center w-full truncate leading-tight">
                  {isMe ? t("group.my_story") : member.name}
                </p>

                {/* 상태 힌트 */}
                {isMe && !hasStory ? (
                  <span className="text-[10px] text-muted-foreground/60 group-hover:text-primary transition-colors flex items-center gap-0.5">
                    <Camera className="w-2.5 h-2.5" />
                    {t("group.add")}
                  </span>
                ) : member.isHost ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500">
                    <Crown className="w-2.5 h-2.5" />
                    {t("group.host")}
                  </span>
                ) : hasStory ? (
                  <span className="text-[10px] text-primary/70">{t("group.story")}</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground/40">{t("group.member")}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 그룹 지출 ── */}
      <div className="bg-card rounded-md border border-border overflow-hidden">
        {/* Section header — 클릭 시 전체 목록 페이지 이동 */}
        <button
          onClick={() => goToExpenses(false)}
          className="w-full flex items-center justify-between px-5 pt-4 pb-3 hover:bg-muted/50 transition-colors"
        >
          <h3 className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {t("group.expenses")}
            {allExpenses.length > 0 && (
              <span className="text-xs text-muted-foreground font-normal">· {allExpenses.length}건</span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t("group.view_all")}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>

        <div className="px-5 pb-4 space-y-3">
          {/* 지출 추가 → 전체 목록 페이지에서 폼 열기 */}
          <button
            onClick={() => goToExpenses(true)}
            className="w-full flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all border border-dashed border-primary/40 text-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4" />
            {t("group.add_expense")}
          </button>

          {/* Recent 3 expenses — skeleton or cards */}
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted animate-pulse">
                  <div className="w-10 h-10 rounded-md bg-muted-foreground/20 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                    <div className="h-2.5 bg-muted-foreground/20 rounded w-1/2" />
                  </div>
                  <div className="space-y-2 shrink-0">
                    <div className="h-3 bg-muted-foreground/20 rounded w-20" />
                    <div className="h-2.5 bg-muted-foreground/20 rounded w-14 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : allExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-7 h-7 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{t("group.no_expenses")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allExpenses.slice(0, 3).map((expense) => (
                <div key={expense.id} className="flex items-center gap-3 p-3 rounded-md bg-muted">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-lg shrink-0">
                    {CATEGORY_EMOJI[expense.category] ?? "💳"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{expense.memo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {expense.date} · {expense.category}
                      {"participants" in expense && expense.participants ? ` · ${expense.participants}명` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-primary leading-tight">
                      {expense.spentCurrency === "JPY"
                        ? `¥${expense.spentAmount.toLocaleString()} → ₩${expense.baseAmount.toLocaleString()}`
                        : `₩${expense.spentAmount.toLocaleString()}`}
                    </p>
                    {"participants" in expense && expense.participants && expense.participants > 1 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        1인 ₩{Math.round(expense.baseAmount / expense.participants).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {allExpenses.length > 3 && (
                <button
                  onClick={() => navigate(`/groups/${group.id}/expenses`, { state: { group, localExpenses } })}
                  className="w-full text-center text-xs text-muted-foreground hover:text-primary py-2 transition-colors"
                >
                  +{allExpenses.length - 3}{t("expense.count_suffix")} 더 보기
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 파티 캐릭터 섹션 ── */}
      <div className="bg-card rounded-md border border-border overflow-hidden">
        <div className="px-5 pt-4 pb-3">
          <h3 className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            {t("group.party")}
          </h3>
        </div>

        <div className="mx-4 mb-4 rounded-md bg-background flex items-end justify-around pb-3 px-2" style={{ height: 120 }}>
          {group.members.map((member) => {
            const char = getMemberCharacter(member.id);
            return (
              <div key={member.id} className="flex flex-col items-center">
                {member.isHost && (
                  <Crown className="w-3 h-3 text-amber-400 mb-0.5" />
                )}
                <PixelSprite type={char.type} colors={char.colors} size={48} />
              </div>
            );
          })}
        </div>
      </div>
    </div>

      {/* ════════════════════════════════════════
          Instagram 스타일 스토리 뷰어 오버레이
          ════════════════════════════════════════ */}
      {storyOpen && (() => {
        const member = storyViewMembers[storyIdx];
        if (!member) return null;
        const story = stories[member.id] ?? null;
        const isOwn = isCurrentUser(member);

        return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col select-none touch-none">

            {/* ── 상단 진행 바 ── */}
            <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-10 pb-2">
              {storyViewMembers.map((m, i) => (
                <div key={m.id} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width:
                        i < storyIdx ? "100%"
                        : i === storyIdx ? `${storyProgress}%`
                        : "0%",
                      transition: i === storyIdx ? "none" : undefined,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* ── 헤더 (아바타 + 이름 + 시간 + X) ── */}
            <div className="absolute top-14 left-0 right-0 z-30 flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0 flex items-center justify-center bg-gradient-to-br from-violet-500 to-pink-500">
                  {profilePhoto && isOwn
                    ? <img src={profilePhoto} className="w-full h-full object-cover" alt="" />
                    : <span className="text-white font-bold text-sm">{member.name[0]}</span>
                  }
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{member.name}</p>
                  {story && (
                    <p className="text-white/55 text-xs">{formatRelativeTime(story.createdAt)}</p>
                  )}
                </div>
              </div>
              <button
                onClick={closeStory}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── 배경 (사진 or 그라데이션) ── */}
            <div className="absolute inset-0 z-0">
              {story?.photo ? (
                <img
                  src={story.photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: getMemberGradient(member.id) }}
                />
              )}
              {/* 상단 그라데이션 */}
              <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
              {/* 하단 그라데이션 */}
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>

            {/* ── 스토리 없는 멤버 안내 ── */}
            {!story && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-white font-bold text-3xl">
                  {member.name[0]}
                </div>
                <p className="text-white/50 text-sm">{t("group.no_story")}</p>
                {isOwn && (
                  <button
                    onClick={() => { closeStory(); navigate("/story/create", { state: { member, group } }); }}
                    className="mt-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    {t("group.write_story")}
                  </button>
                )}
              </div>
            )}

            {/* ── 콘텐츠 (이모지 + 텍스트) ── */}
            {story && (
              <div className="absolute bottom-24 left-5 right-16 z-10">
                {story.emojis && story.emojis.length > 0 && (
                  <div className="flex gap-5 mb-5">
                    {story.emojis.map((key, i) => {
                      const def = getPixelEmoji(key);
                      if (!def) return null;
                      const { Component } = def;
                      return (
                        <div key={`${key}-${i}`} style={{ transform: "scale(2.8)", transformOrigin: "bottom left" }}>
                          <Component />
                        </div>
                      );
                    })}
                  </div>
                )}
                {story.text && (
                  <p className="text-white text-xl font-semibold leading-relaxed break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {story.text}
                  </p>
                )}
              </div>
            )}

            {/* ── 내 스토리 편집 버튼 ── */}
            {isOwn && story && (
              <button
                onClick={() => { closeStory(); navigate("/story/create", { state: { member, group } }); }}
                className="absolute bottom-24 right-5 z-10 w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}

            {/* ── 탭 존 (좌: 이전 / 우: 다음 / 홀드: 일시정지) ── */}
            {/* 왼쪽 */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; pointerDownTimeRef.current = Date.now(); }}
              onPointerUp={() => { storyPausedRef.current = false; if (Date.now() - pointerDownTimeRef.current < 200) storyGoPrev(); }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
            {/* 중앙 (홀드 전용) */}
            <div
              className="absolute left-1/3 right-1/3 top-0 bottom-0 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; }}
              onPointerUp={() => { storyPausedRef.current = false; }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
            {/* 오른쪽 */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; pointerDownTimeRef.current = Date.now(); }}
              onPointerUp={() => { storyPausedRef.current = false; if (Date.now() - pointerDownTimeRef.current < 200) storyGoNext(); }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
          </div>
        );
      })()}
    </>
  );
}
