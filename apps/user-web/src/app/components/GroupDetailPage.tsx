import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft, Users, Crown, Calendar, TrendingUp,
  Copy, Check, UserPlus, Plus, X, Swords, Pencil, Camera, ChevronRight,
  LogOut, Trash2, RefreshCw, AlertTriangle,
} from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { useLang } from "../context/LangContext";
import { api } from "../lib/api";
import type { CurrencyCode } from "../types/domain";
import { PixelSprite } from "./PixelCharacter";
import { CHARACTERS } from "../data/characters";
import type { CharacterDef } from "../data/characters";
import { getPixelEmoji } from "./PixelEmojis";
import { loadStories, formatRelativeTime } from "../lib/story-storage";
import type { StoryEntry } from "../lib/story-storage";

interface GroupMember {
  id: string;
  name: string;
  isHost: boolean;
  equippedCharacterId: number | null;
}

interface Group {
  id: string;
  name: string;
  code: string;
  isPublic: boolean;
  codeExpiresAt: string | null;
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

function getMemberCharacter(equippedCharacterId: number | null): CharacterDef {
  if (equippedCharacterId == null) return CHARACTERS[0];
  return CHARACTERS.find((c) => c.id === equippedCharacterId) ?? CHARACTERS[0];
}

const STORY_GRADIENTS = [
  "linear-gradient(145deg,#667eea,#764ba2)",
  "linear-gradient(145deg,#f093fb,#f5576c)",
  "linear-gradient(145deg,#4facfe,#00f2fe)",
  "linear-gradient(145deg,#43e97b,#38f9d7)",
  "linear-gradient(145deg,#fa709a,#fee140)",
  "linear-gradient(145deg,#a18cd1,#fbc2eb)",
];
const getMemberGradient = (id: string) => {
  const hash = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return STORY_GRADIENTS[hash % STORY_GRADIENTS.length];
};
const CATEGORY_EMOJI: Record<string, string> = {
  식비: "🍜", 교통: "🚌", 카페: "☕", 쇼핑: "🛍", 숙박: "🏨", 엔터테인먼트: "🎭", 기타: "💳",
};

export default function GroupDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expenses, profile, profilePhoto, isLoading } = useAppData();
  const { t, lang } = useLang();

  const [group, setGroup] = useState<Group | undefined>(location.state?.group);

  const [showInvite, setShowInvite] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [localExpenses] = useState<LocalExpense[]>([]);
  const [stories] = useState<Record<string, StoryEntry>>(loadStories);

  /* ── Group management ── */
  const [showManage, setShowManage] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedNewHost, setSelectedNewHost] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  /* ── Story overlay ── */
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyViewMembers, setStoryViewMembers] = useState<GroupMember[]>([]);
  const [storyMemberIdx, setStoryMemberIdx] = useState(0);
  const [storyFrameIdx, setStoryFrameIdx] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyPausedRef = useRef(false);
  const storyViewMembersRef = useRef<GroupMember[]>([]);
  const storyMemberIdxRef = useRef(0);
  const storyFrameIdxRef = useRef(0);
  storyViewMembersRef.current = storyViewMembers;
  storyMemberIdxRef.current = storyMemberIdx;
  storyFrameIdxRef.current = storyFrameIdx;
  const pointerDownTimeRef = useRef(0);

  const openStory = (members: GroupMember[], startMemberIdx: number) => {
    setStoryViewMembers(members);
    setStoryMemberIdx(startMemberIdx);
    setStoryFrameIdx(0);
    setStoryProgress(0);
    storyPausedRef.current = false;
    setStoryOpen(true);
  };

  const closeStory = () => setStoryOpen(false);

  const storyGoNext = useCallback(() => {
    const members = storyViewMembersRef.current;
    const mIdx = storyMemberIdxRef.current;
    const fIdx = storyFrameIdxRef.current;
    const currentStory = stories[members[mIdx]?.id];
    const frameCount = currentStory?.frames.length ?? 1;

    if (fIdx < frameCount - 1) {
      setStoryFrameIdx(fIdx + 1);
      setStoryProgress(0);
    } else {
      const nextMember = mIdx + 1;
      if (nextMember >= members.length) {
        setStoryOpen(false);
      } else {
        setStoryMemberIdx(nextMember);
        setStoryFrameIdx(0);
        setStoryProgress(0);
      }
    }
  }, [stories]);

  const storyGoPrev = () => {
    const members = storyViewMembersRef.current;
    const mIdx = storyMemberIdxRef.current;
    const fIdx = storyFrameIdxRef.current;

    if (fIdx > 0) {
      setStoryFrameIdx(fIdx - 1);
      setStoryProgress(0);
    } else if (mIdx > 0) {
      const prevMemberIdx = mIdx - 1;
      const prevStory = stories[members[prevMemberIdx]?.id];
      const lastFrame = Math.max(0, (prevStory?.frames.length ?? 1) - 1);
      setStoryMemberIdx(prevMemberIdx);
      setStoryFrameIdx(lastFrame);
      setStoryProgress(0);
    }
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
  }, [storyOpen, storyMemberIdx, storyFrameIdx]);

  useEffect(() => {
    if (storyProgress >= 100) storyGoNext();
  }, [storyProgress, storyGoNext]);

  /* ── Group management handlers ── */
  const handleDeleteGroup = async () => {
    if (!group) return;
    setActionLoading(true);
    try {
      await api.delete(`/groups/${group.id}`);
      navigate("/groups");
    } catch (e: any) {
      alert(e.message || "그룹 삭제에 실패했습니다.");
    } finally {
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleTransferHost = async () => {
    if (!group || !selectedNewHost) return;
    setActionLoading(true);
    try {
      const updated = await api.patch<Group>(`/groups/${group.id}/host`, { newHostId: selectedNewHost });
      setGroup(updated);
      setShowTransferModal(false);
      setShowManage(false);
      setSelectedNewHost("");
    } catch (e: any) {
      alert(e.message || "호스트 양도에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group) return;
    setActionLoading(true);
    try {
      await api.delete(`/groups/${group.id}/members/me`);
      navigate("/groups");
    } catch (e: any) {
      alert(e.message || "그룹 탈퇴에 실패했습니다.");
    } finally {
      setActionLoading(false);
      setShowLeaveConfirm(false);
    }
  };

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

  const isCurrentUser = (m: { id: string }) => m.id === profile.id;

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

  const nonHostMembers = group.members.filter((m) => !m.isHost);

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

        {/* Members Section */}
        <div className="bg-card rounded-md border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {t("group.members")}
            </h3>
            <span className="text-sm text-muted-foreground">{group.members.length}{t("group.member_suffix")}</span>
          </div>

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
                  <p className="text-[11px] font-medium text-center w-full truncate leading-tight">
                    {isMe ? t("group.my_story") : member.name}
                  </p>
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

        {/* 그룹 지출 */}
        <div className="bg-card rounded-md border border-border overflow-hidden">
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
            <button
              onClick={() => goToExpenses(true)}
              className="w-full flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all border border-dashed border-primary/40 text-primary hover:bg-primary/5"
            >
              <Plus className="w-4 h-4" />
              {t("group.add_expense")}
            </button>

            {isLoading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted animate-pulse">
                    <div className="w-10 h-10 rounded-md bg-muted-foreground/20 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                      <div className="h-2.5 bg-muted-foreground/20 rounded w-1/2" />
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
                    </div>
                  </div>
                ))}
                {allExpenses.length > 3 && (
                  <button
                    onClick={() => navigate(`/groups/${group.id}/expenses`, { state: { group, localExpenses } })}
                    className="w-full text-center text-xs text-muted-foreground hover:text-primary py-2 transition-colors"
                  >
                    +{allExpenses.length - 3}{t("expense.count_suffix")} {t("group.view_more")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 파티 캐릭터 섹션 */}
        <div className="bg-card rounded-md border border-border overflow-hidden">
          <div className="px-5 pt-4 pb-3">
            <h3 className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-primary" />
              {t("group.party")}
            </h3>
          </div>
          <div className="mx-4 mb-4 rounded-md bg-background flex items-end justify-around pb-3 px-2" style={{ height: 120 }}>
            {group.members.map((member) => {
              const char = getMemberCharacter(member.equippedCharacterId);
              return (
                <div key={member.id} className="flex flex-col items-center">
                  {member.isHost && <Crown className="w-3 h-3 text-amber-400 mb-0.5" />}
                  <PixelSprite type={char.type} colors={char.colors} size={48} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 그룹 관리 ── */}
        <div className="bg-card rounded-md border border-border overflow-hidden">
          <button
            onClick={() => setShowManage(!showManage)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-sm font-medium text-muted-foreground">{t("group.management")}</h3>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showManage ? "rotate-90" : ""}`} />
          </button>

          {showManage && (
            <div className="px-5 pb-4 space-y-2 border-t border-border">
              {group.isHost ? (
                <>
                  <button
                    onClick={() => { setShowManage(false); setShowTransferModal(true); }}
                    disabled={nonHostMembers.length === 0}
                    className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{t("group.transfer_host")}</p>
                      <p className="text-xs text-muted-foreground">{t("group.transfer_host_desc")}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-destructive/10 transition-colors text-left"
                  >
                    <Trash2 className="w-4 h-4 text-destructive shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-destructive">{t("group.delete")}</p>
                      <p className="text-xs text-muted-foreground">{t("group.delete_desc")}</p>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-destructive shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-destructive">{t("group.leave")}</p>
                    <p className="text-xs text-muted-foreground">{t("group.leave_desc")}</p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 호스트 양도 모달 ── */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="mb-1">{t("group.transfer_host")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("group.transfer_select")}</p>
            <div className="space-y-2 mb-5 max-h-48 overflow-y-auto">
              {nonHostMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedNewHost(m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all text-left ${
                    selectedNewHost === m.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center text-white font-bold shrink-0">
                    {m.name[0]}
                  </div>
                  <span className="font-medium text-sm">{m.name}</span>
                  {selectedNewHost === m.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowTransferModal(false); setSelectedNewHost(""); }}
                className="flex-1 py-2.5 rounded-md bg-muted text-muted-foreground text-sm font-medium"
              >
                {t("settings.cancel")}
              </button>
              <button
                onClick={handleTransferHost}
                disabled={!selectedNewHost || actionLoading}
                className="flex-1 py-2.5 rounded-md bg-primary/80 text-primary-foreground text-sm font-medium disabled:opacity-40"
              >
                {actionLoading ? t("group.processing") : t("group.transfer_btn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 그룹 삭제 확인 모달 ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <h3 className="text-destructive">{t("group.delete")}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              <span className="font-semibold text-foreground">"{group.name}"</span> {t("group.delete_confirm_suffix")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-md bg-muted text-muted-foreground text-sm font-medium"
              >
                {t("settings.cancel")}
              </button>
              <button
                onClick={handleDeleteGroup}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-md bg-destructive text-white text-sm font-medium disabled:opacity-50"
              >
                {actionLoading ? t("group.deleting") : t("group.delete_btn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 그룹 탈퇴 확인 모달 ── */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="mb-3">{t("group.leave")}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              <span className="font-semibold text-foreground">"{group.name}"</span> {t("group.leave_confirm_suffix")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 rounded-md bg-muted text-muted-foreground text-sm font-medium"
              >
                {t("settings.cancel")}
              </button>
              <button
                onClick={handleLeaveGroup}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-md bg-destructive text-white text-sm font-medium disabled:opacity-50"
              >
                {actionLoading ? t("group.processing") : t("group.leave_btn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          스토리 뷰어 오버레이
          ════════════════════════════════════════ */}
      {storyOpen && (() => {
        const member = storyViewMembers[storyMemberIdx];
        if (!member) return null;
        const story = stories[member.id] ?? null;
        const frame = story?.frames[storyFrameIdx] ?? null;
        const frameCount = story?.frames.length ?? 1;
        const isOwn = isCurrentUser(member);

        return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col select-none touch-none">

            {/* 상단 진행 바 — 현재 멤버의 프레임 수만큼 */}
            <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-10 pb-2">
              {Array.from({ length: frameCount }, (_, i) => (
                <div key={i} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width:
                        i < storyFrameIdx ? "100%"
                        : i === storyFrameIdx ? `${storyProgress}%`
                        : "0%",
                      transition: i === storyFrameIdx ? "none" : undefined,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* 헤더 */}
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
                    <p className="text-white/55 text-xs">
                      {formatRelativeTime(story.createdAt, lang)}
                      {frameCount > 1 && ` · ${storyFrameIdx + 1}/${frameCount}`}
                    </p>
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

            {/* 배경 */}
            <div className="absolute inset-0 z-0">
              {frame?.photo ? (
                <img src={frame.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: getMemberGradient(member.id) }} />
              )}
              <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>

            {/* 스토리 없는 멤버 */}
            {!story && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-white font-bold text-3xl">
                  {member.name[0]}
                </div>
                <p className="text-white/50 text-sm">{t("group.no_story")}</p>
                {isOwn && (
                  <button
                    onClick={() => { closeStory(); navigate("/story/create", { state: { member, group } }); }}
                    className="mt-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-semibold"
                  >
                    {t("group.write_story")}
                  </button>
                )}
              </div>
            )}

            {/* 이모지 */}
            {frame?.emojis?.map((emoji, i) => {
              const def = getPixelEmoji(emoji.key);
              if (!def) return null;
              const { Component } = def;
              return (
                <div
                  key={`${emoji.key}-${i}`}
                  className="absolute z-10 pointer-events-none"
                  style={{
                    left: `${emoji.x}%`,
                    top: `${emoji.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div style={{ transform: "scale(2.8)", transformOrigin: "center" }}>
                    <Component />
                  </div>
                </div>
              );
            })}

            {/* 텍스트 — 저장된 위치에 표시 */}
            {frame?.text && (
              <div
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${frame.textX ?? 50}%`,
                  top: `${frame.textY ?? 72}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <p
                  className="text-white text-xl font-semibold leading-relaxed break-words text-center max-w-[80vw]"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)", whiteSpace: "pre-wrap" }}
                >
                  {frame.text}
                </p>
              </div>
            )}

            {/* 내 스토리 편집 버튼 */}
            {isOwn && story && (
              <button
                onClick={() => { closeStory(); navigate("/story/create", { state: { member, group } }); }}
                className="absolute bottom-24 right-5 z-30 w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}

            {/* 탭 존 */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; pointerDownTimeRef.current = Date.now(); }}
              onPointerUp={() => { storyPausedRef.current = false; if (Date.now() - pointerDownTimeRef.current < 200) storyGoPrev(); }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
            <div
              className="absolute left-1/3 right-1/3 top-0 bottom-0 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; }}
              onPointerUp={() => { storyPausedRef.current = false; }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
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
