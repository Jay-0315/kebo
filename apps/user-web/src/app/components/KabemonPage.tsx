import { useState } from "react";
import {
  Trophy, Lock, BookOpen, User,
  Flame, Star, Zap, Sparkles, CheckCircle2, Shield, Gamepad2,
} from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import PixelCharacter, { PixelSprite } from "./PixelCharacter";
import {
  CHARACTERS, getCurrentCharacter, getNextCharacter,
  RARITY_LABEL, RARITY_COLOR, RARITY_BORDER,
} from "../data/characters";
import type { CharacterRarity } from "../data/characters";

const RARITY_BG: Record<CharacterRarity, string> = {
  common:    "bg-gray-500/10",
  uncommon:  "bg-green-500/10",
  rare:      "bg-blue-500/10",
  epic:      "bg-purple-500/10",
  legendary: "bg-amber-500/10",
  mythic:    "bg-pink-500/10",
};

const RARITY_GLOW: Record<CharacterRarity, string> = {
  common:    "shadow-gray-400/20",
  uncommon:  "shadow-green-400/30",
  rare:      "shadow-blue-400/30",
  epic:      "shadow-purple-400/40",
  legendary: "shadow-amber-400/50",
  mythic:    "shadow-pink-400/60",
};

const MISSIONS = [
  { icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,  label: "출석 체크",  reward: "+5P",  desc: "앱을 열고 하루 한 번 출석" },
  { icon: <Flame        className="w-4 h-4 text-orange-400" />, label: "지출 기록",  reward: "+3P",  desc: "지출 내역 1건 추가" },
  { icon: <Star         className="w-4 h-4 text-yellow-400" />, label: "내역 공유",  reward: "+8P",  desc: "커뮤니티에 지출 공유" },
  { icon: <Zap          className="w-4 h-4 text-blue-400"   />, label: "글 작성",    reward: "+5P",  desc: "커뮤니티 게시글 작성" },
  { icon: <Sparkles     className="w-4 h-4 text-pink-400"   />, label: "연속 기록",  reward: "+2P",  desc: "매일 연속 기록 보너스" },
];

type Tab = "character" | "pokedex";
type Filter = "all" | CharacterRarity;

export default function KabemonPage() {
  const { rewardSummary, equipCharacter } = useAppData();
  const [tab, setTab] = useState<Tab>("character");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [equipping, setEquipping] = useState(false);

  const { level, missionPoints, nextLevelTarget, attendanceDays, streakDays, equippedCharacterId } = rewardSummary;

  const currentChar = equippedCharacterId
    ? (CHARACTERS.find((c) => c.id === equippedCharacterId) ?? getCurrentCharacter(level))
    : getCurrentCharacter(level);
  const nextChar = getNextCharacter(level);

  const handleEquip = async (characterId: number) => {
    setEquipping(true);
    try {
      await equipCharacter(characterId);
      setSelected(null);
    } finally {
      setEquipping(false);
    }
  };

  const progress    = Math.min((missionPoints / nextLevelTarget) * 100, 100);
  const remaining   = Math.max(nextLevelTarget - missionPoints, 0);
  const unlockedCount = CHARACTERS.filter((c) => c.unlockLevel <= level).length;

  const rarities: Filter[] = ["all", "common", "uncommon", "rare", "epic", "legendary", "mythic"];
  const filtered = filter === "all" ? CHARACTERS : CHARACTERS.filter((c) => c.rarity === filter);
  const selectedChar = selected !== null ? CHARACTERS.find((c) => c.id === selected) : null;

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            캐보몬 도감
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unlockedCount}/100 해금 · Lv.{level}
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold">
          Lv.{level}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl">
        <button
          onClick={() => setTab("character")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "character" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          내 캐릭터
        </button>
        <button
          onClick={() => setTab("pokedex")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "pokedex" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          도감
        </button>
      </div>

      {/* ══════════════ CHARACTER TAB ══════════════ */}
      {tab === "character" && (
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* ── Left column: Hero + Stats ── */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {/* Hero — animated idle float + react on hover */}
            <div
              className={`bg-card rounded-2xl border-2 ${RARITY_BORDER[currentChar.rarity]} p-6 shadow-lg ${RARITY_GLOW[currentChar.rarity]}`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-5 rounded-2xl ${RARITY_BG[currentChar.rarity]} relative`}>
                  <div
                    className={`absolute inset-0 rounded-2xl blur-md opacity-30 ${RARITY_BG[currentChar.rarity]}`}
                    style={{ transform: "scale(1.1)" }}
                  />
                  <div className="relative z-10">
                    <PixelCharacter characterId={currentChar.id} size={140} float />
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${RARITY_BG[currentChar.rarity]} ${RARITY_COLOR[currentChar.rarity]}`}>
                      {RARITY_LABEL[currentChar.rarity]}
                    </span>
                    <span className="text-xs text-muted-foreground">#{currentChar.id}</span>
                  </div>
                  <p className={`text-2xl font-bold ${RARITY_COLOR[currentChar.rarity]}`}>
                    {currentChar.korName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{currentChar.description}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-2">
                    마우스를 올리면 반응 모션을 볼 수 있어요
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Trophy className="w-4 h-4 text-primary" />
                캐릭터 스탯
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "출석 일수",   value: attendanceDays, unit: "일", color: "text-primary/80" },
                  { label: "미션 포인트", value: missionPoints,  unit: "P",  color: "text-primary/80" },
                  { label: "연속 기록",   value: streakDays,     unit: "일", color: "text-accent" },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    <p className="text-[10px] text-muted-foreground">{unit}</p>
                  </div>
                ))}
              </div>

              {nextChar ? (
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <PixelSprite type={nextChar.type} colors={nextChar.colors} size={28} />
                    <div className="flex-1">
                      <p className="text-xs font-medium">
                        다음 해금: <span className={RARITY_COLOR[nextChar.rarity]}>{nextChar.korName}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">Lv.{nextChar.unlockLevel} 도달 시 해금</p>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">Lv.{nextChar.unlockLevel}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>다음 레벨까지 {remaining}P</span>
                    <span>{missionPoints}/{nextLevelTarget}P</span>
                  </div>
                  <div className="h-2 bg-card rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-3 text-center text-sm text-muted-foreground">
                  🎉 모든 캐릭터 해금 완료!
                </div>
              )}
            </div>
          </div>

          {/* ── Right column: Mission guide (desktop) / Bottom (mobile) ── */}
          <div className="lg:w-64 lg:shrink-0 bg-card rounded-xl border border-border p-5">
            <h3 className="mb-3 text-sm font-semibold">미션 가이드</h3>
            <div className="space-y-2">
              {MISSIONS.map(({ icon, label, reward, desc }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">{reward}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 text-center">
              포인트가 쌓이면 레벨이 오르고 새 캐릭터가 해금됩니다
            </p>
          </div>
        </div>
      )}

      {/* ══════════════ POKÉDEX TAB ══════════════ */}
      {tab === "pokedex" && (
        <div className="space-y-4">
          {/* Selected character detail panel */}
          {selectedChar && (
            <div className={`bg-card rounded-xl border ${RARITY_BORDER[selectedChar.rarity]} p-4`}>
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-xl ${RARITY_BG[selectedChar.rarity]} ${
                    selectedChar.unlockLevel > level ? "grayscale opacity-50" : ""
                  }`}
                >
                  <PixelSprite
                    type={selectedChar.type}
                    colors={selectedChar.colors}
                    size={56}
                    float={selectedChar.unlockLevel <= level}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${RARITY_BG[selectedChar.rarity]} ${RARITY_COLOR[selectedChar.rarity]}`}>
                      {RARITY_LABEL[selectedChar.rarity]}
                    </span>
                    <span className="text-xs text-muted-foreground">#{selectedChar.id}</span>
                  </div>
                  <p className="font-bold">{selectedChar.korName}</p>
                  <p className="text-xs text-muted-foreground">{selectedChar.description}</p>
                </div>
                <div className="shrink-0">
                  {selectedChar.unlockLevel > level ? (
                    <div className="text-center">
                      <Lock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Lv.{selectedChar.unlockLevel}</p>
                    </div>
                  ) : equippedCharacterId === selectedChar.id ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1.5 rounded-lg">
                      <Shield className="w-3.5 h-3.5" />
                      장착 중
                    </span>
                  ) : (
                    <button
                      onClick={() => void handleEquip(selectedChar.id)}
                      disabled={equipping}
                      className="flex items-center gap-1 text-xs font-semibold bg-primary/80 text-primary-foreground px-2.5 py-1.5 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {equipping ? "..." : "장착"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rarity filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {rarities.map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  filter === r
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {r === "all" ? "전체" : RARITY_LABEL[r as CharacterRarity]}
              </button>
            ))}
          </div>

          {/* Counter */}
          <p className="text-xs text-muted-foreground">
            {filter === "all"
              ? `${unlockedCount}/100 해금`
              : `${filtered.filter((c) => c.unlockLevel <= level).length}/${filtered.length} 해금`}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-5 gap-2">
            {filtered.map((char) => {
              const isUnlocked = char.unlockLevel <= level;
              const isEquipped  = char.id === equippedCharacterId;
              const isSelected  = char.id === selected;

              return (
                <button
                  key={char.id}
                  onClick={() => setSelected(isSelected ? null : char.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    isEquipped
                      ? `${RARITY_BORDER[char.rarity]} bg-primary/10 ring-1 ring-primary/40`
                      : isSelected
                      ? "border-foreground/40 bg-muted/70"
                      : "border-border bg-muted hover:bg-muted/70"
                  }`}
                >
                  <div className={`relative ${!isUnlocked ? "grayscale opacity-40" : ""}`}>
                    <PixelSprite type={char.type} colors={char.colors} size={40} />
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    {isEquipped && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                        <Shield className="w-2 h-2 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className={`text-[9px] leading-tight text-center truncate w-full ${
                    isUnlocked ? RARITY_COLOR[char.rarity] : "text-muted-foreground"
                  }`}>
                    {isUnlocked ? char.korName : `Lv.${char.unlockLevel}`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
