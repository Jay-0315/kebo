import React, { useState } from "react";
import {
  Trophy, Lock, BookOpen, User, Sparkles, Shield, Gamepad2,
  CheckCircle2, Flame, Star, Zap, Gift, RotateCcw,
} from "lucide-react";
import { useAppData, type GachaResult } from "../context/AppDataContext";
import { useLang } from "../context/LangContext";
import PixelCharacter, { PixelSprite } from "./PixelCharacter";
import {
  CHARACTERS, ACHIEVEMENTS, ACHIEVEMENT_BY_CHARACTER,
  GACHA_COST_SINGLE, GACHA_COST_TEN, RARITY_DUPLICATE_POINTS,
  RARITY_LABEL, RARITY_COLOR, RARITY_BORDER,
} from "../data/characters";
import type { CharacterDef, CharacterRarity, AchievementType } from "../data/characters";

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
  { icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,  label: "출석 기록", reward: "+5P",  desc: "앱 접속 시 매일" },
  { icon: <Flame        className="w-4 h-4 text-orange-400" />, label: "지출 기록", reward: "+3P",  desc: "지출 1건당 (최대 30건)" },
  { icon: <Star         className="w-4 h-4 text-yellow-400" />, label: "지출 공유", reward: "+8P",  desc: "커뮤니티 공유 시" },
  { icon: <Zap          className="w-4 h-4 text-blue-400"   />, label: "글 작성",   reward: "+5P",  desc: "커뮤니티 글 작성 시" },
  { icon: <Sparkles     className="w-4 h-4 text-pink-400"   />, label: "연속 출석", reward: "+2P",  desc: "연속 출석 1일당" },
];

type Tab = "character" | "collection" | "gacha" | "achievement";
type Filter = "all" | CharacterRarity;

// ─── Gacha Result Modal ───────────────────────────────────────────────────
function GachaResultModal({
  result,
  onClose,
}: {
  result: GachaResult;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-sm max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">뽑기 결과</h3>
          <div className="text-xs text-muted-foreground">
            {result.bonusPoints > 0 && (
              <span className="text-primary font-semibold">+{result.bonusPoints}P 환산</span>
            )}
          </div>
        </div>

        <div className="overflow-y-auto p-3 grid grid-cols-5 gap-2 flex-1">
          {result.results.map((r, i) => {
            const char = CHARACTERS.find((c) => c.id === r.characterId);
            if (!char) return null;
            return (
              <div
                key={i}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${
                  r.isDuplicate
                    ? "border-border bg-muted/40 opacity-60"
                    : `${RARITY_BORDER[char.rarity]} ${RARITY_BG[char.rarity]}`
                }`}
              >
                <PixelSprite type={char.type} colors={char.colors} size={36} />
                <p className={`text-[8px] text-center leading-tight font-medium ${
                  r.isDuplicate ? "text-muted-foreground" : RARITY_COLOR[char.rarity]
                }`}>
                  {r.isDuplicate ? `+${r.bonusPoints}P` : char.korName}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────
export default function KabemonPage() {
  const { rewardSummary, equipCharacter, checkAchievements, performGacha } = useAppData();
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>("character");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [equipping, setEquipping] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [gachaResult, setGachaResult] = useState<GachaResult | null>(null);
  const [checkingAchievements, setCheckingAchievements] = useState(false);
  const [newAchievements, setNewAchievements] = useState<number[]>([]);

  const { missionPoints, attendanceDays, streakDays, equippedCharacterId, ownedCharacterIds, gachaPityCount } = rewardSummary;

  const ownedSet = new Set(ownedCharacterIds);

  const equippedChar = equippedCharacterId
    ? (CHARACTERS.find((c) => c.id === equippedCharacterId) ?? CHARACTERS[0])
    : CHARACTERS.find((c) => ownedSet.has(c.id)) ?? CHARACTERS[0];

  const handleEquip = async (characterId: number) => {
    setEquipping(true);
    try {
      await equipCharacter(characterId);
      setSelected(null);
    } finally {
      setEquipping(false);
    }
  };

  const handleGacha = async (count: 1 | 10) => {
    setPulling(true);
    try {
      const result = await performGacha(count);
      setGachaResult(result);
    } finally {
      setPulling(false);
    }
  };

  const handleCheckAchievements = async () => {
    setCheckingAchievements(true);
    try {
      const unlocked = await checkAchievements();
      setNewAchievements(unlocked);
    } finally {
      setCheckingAchievements(false);
    }
  };

  const rarities: Filter[] = ["all", "common", "uncommon", "rare", "epic", "legendary", "mythic"];
  const filtered = filter === "all" ? CHARACTERS : CHARACTERS.filter((c) => c.rarity === filter);
  const selectedChar = selected !== null ? CHARACTERS.find((c) => c.id === selected) : null;

  const canAffordSingle = missionPoints >= GACHA_COST_SINGLE;
  const canAffordTen = missionPoints >= GACHA_COST_TEN;

  return (
    <>
      <div className="space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              {t("kabemon.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {ownedCharacterIds.length}/100 수집 · {missionPoints}P
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold">
            {missionPoints}P
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl">
          {(["character", "collection", "gacha", "achievement"] as Tab[]).map((t_) => {
            const icons = {
              character: <User className="w-3.5 h-3.5" />,
              collection: <BookOpen className="w-3.5 h-3.5" />,
              gacha: <Sparkles className="w-3.5 h-3.5" />,
              achievement: <Trophy className="w-3.5 h-3.5" />,
            };
            const labels = { character: t("kabemon.my_character"), collection: t("kabemon.pokedex"), gacha: t("kabemon.gacha_tab"), achievement: t("kabemon.achievement_tab") };
            return (
              <button
                key={t_}
                onClick={() => setTab(t_)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  tab === t_ ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {icons[t_]}
                {labels[t_]}
              </button>
            );
          })}
        </div>

        {/* ══════════════ CHARACTER TAB ══════════════ */}
        {tab === "character" && (
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* ── Hero card ── */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className={`bg-card rounded-2xl border-2 ${RARITY_BORDER[equippedChar.rarity]} p-6 shadow-lg ${RARITY_GLOW[equippedChar.rarity]}`}>
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-5 rounded-2xl ${RARITY_BG[equippedChar.rarity]} relative`}>
                    <div className={`absolute inset-0 rounded-2xl blur-md opacity-30 ${RARITY_BG[equippedChar.rarity]}`} style={{ transform: "scale(1.1)" }} />
                    <div className="relative z-10">
                      <PixelCharacter characterId={equippedChar.id} size={140} float />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${RARITY_BG[equippedChar.rarity]} ${RARITY_COLOR[equippedChar.rarity]}`}>
                        {RARITY_LABEL[equippedChar.rarity]}
                      </span>
                      <span className="text-xs text-muted-foreground">#{equippedChar.id}</span>
                    </div>
                    <p className={`text-2xl font-bold ${RARITY_COLOR[equippedChar.rarity]}`}>{equippedChar.korName}</p>
                    <p className="text-sm text-muted-foreground mt-1">{equippedChar.description}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-2">{t("kabemon.mouse_hint")}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Trophy className="w-4 h-4 text-primary" />
                  {t("kabemon.stats")}
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: t("kabemon.attendance"),     value: attendanceDays, unit: t("kabemon.days") },
                    { label: t("kabemon.mission_points"), value: missionPoints,  unit: "P" },
                    { label: t("kabemon.streak"),         value: streakDays,     unit: t("kabemon.days") },
                  ].map(({ label, value, unit }) => (
                    <div key={label} className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                      <p className="text-2xl font-bold text-primary/80">{value}</p>
                      <p className="text-[10px] text-muted-foreground">{unit}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setTab("achievement")}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-muted text-sm font-medium hover:bg-muted/70 transition-all"
                >
                  <Trophy className="w-4 h-4 text-primary" />
                  {t("kabemon.achievement_check_btn")}
                </button>
              </div>
            </div>

            {/* ── Mission guide ── */}
            <div className="lg:w-64 lg:shrink-0 bg-card rounded-xl border border-border p-5">
              <h3 className="mb-3 text-sm font-semibold">{t("kabemon.mission_guide")}</h3>
              <div className="space-y-2">
                {MISSIONS.map(({ icon, label, reward, desc }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">{reward}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3 text-center">{t("kabemon.mission_footer")}</p>
            </div>
          </div>
        )}

        {/* ══════════════ COLLECTION TAB ══════════════ */}
        {tab === "collection" && (
          <CollectionTab
            ownedSet={ownedSet}
            equippedCharacterId={equippedCharacterId}
            selected={selected}
            selectedChar={selectedChar}
            filter={filter}
            filtered={filtered}
            rarities={rarities}
            equipping={equipping}
            onSelectFilter={setFilter}
            onSelectChar={(id) => setSelected(selected === id ? null : id)}
            onEquip={(id) => void handleEquip(id)}
            t={t}
          />
        )}

        {/* ══════════════ GACHA TAB ══════════════ */}
        {tab === "gacha" && (
          <GachaTab
            missionPoints={missionPoints}
            gachaPityCount={gachaPityCount}
            canAffordSingle={canAffordSingle}
            canAffordTen={canAffordTen}
            pulling={pulling}
            onPull={handleGacha}
            t={t}
          />
        )}

        {/* ══════════════ ACHIEVEMENT TAB ══════════════ */}
        {tab === "achievement" && (
          <AchievementTab
            ownedSet={ownedSet}
            attendanceDays={attendanceDays}
            streakDays={streakDays}
            missionPoints={missionPoints}
            checking={checkingAchievements}
            newlyUnlocked={newAchievements}
            onCheck={() => void handleCheckAchievements()}
            t={t}
          />
        )}
      </div>

      {/* ── Gacha result modal ── */}
      {gachaResult && (
        <GachaResultModal result={gachaResult} onClose={() => setGachaResult(null)} />
      )}
    </>
  );
}

// ─── Collection Tab ───────────────────────────────────────────────────────
function CollectionTab({
  ownedSet, equippedCharacterId, selected, selectedChar, filter, filtered, rarities,
  equipping, onSelectFilter, onSelectChar, onEquip, t,
}: {
  ownedSet: Set<number>;
  equippedCharacterId: number | null;
  selected: number | null;
  selectedChar: CharacterDef | null | undefined;
  filter: Filter;
  filtered: CharacterDef[];
  rarities: Filter[];
  equipping: boolean;
  onSelectFilter: (f: Filter) => void;
  onSelectChar: (id: number) => void;
  onEquip: (id: number) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-4">
      {/* Selected char detail */}
      {selectedChar && (
        <CharacterDetail
          char={selectedChar}
          isOwned={ownedSet.has(selectedChar.id)}
          isEquipped={selectedChar.id === equippedCharacterId}
          equipping={equipping}
          onEquip={onEquip}
          t={t}
        />
      )}

      {/* Rarity filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {rarities.map((r) => (
          <button
            key={r}
            onClick={() => onSelectFilter(r)}
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

      <p className="text-xs text-muted-foreground">
        {filtered.filter((c) => ownedSet.has(c.id)).length}/{filtered.length} {t("kabemon.collection_count")}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2">
        {filtered.map((char) => {
          const isOwned = ownedSet.has(char.id);
          const isEquipped = char.id === equippedCharacterId;
          const isSelected = char.id === selected;
          const ach = ACHIEVEMENT_BY_CHARACTER.get(char.id);
          const isHidden = char.hiddenAchievement && !isOwned;

          return (
            <button
              key={char.id}
              onClick={() => onSelectChar(char.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                isEquipped
                  ? `${RARITY_BORDER[char.rarity]} bg-primary/10 ring-1 ring-primary/40`
                  : isSelected
                  ? "border-foreground/40 bg-muted/70"
                  : "border-border bg-muted hover:bg-muted/70"
              }`}
            >
              <div className={`relative ${!isOwned ? "grayscale opacity-40" : ""}`}>
                {isHidden ? (
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                ) : (
                  <PixelSprite type={char.type} colors={char.colors} size={40} />
                )}
                {!isOwned && !isHidden && (
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
                isOwned ? RARITY_COLOR[char.rarity] : "text-muted-foreground/60"
              }`}>
                {isHidden ? "???" : char.korName}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Character Detail Panel ───────────────────────────────────────────────
function CharacterDetail({
  char, isOwned, isEquipped, equipping, onEquip, t,
}: {
  char: CharacterDef;
  isOwned: boolean;
  isEquipped: boolean;
  equipping: boolean;
  onEquip: (id: number) => void;
  t: (key: string) => string;
}) {
  const ach = ACHIEVEMENT_BY_CHARACTER.get(char.id);
  const isHidden = char.hiddenAchievement && !isOwned;

  return (
    <div className={`bg-card rounded-xl border ${RARITY_BORDER[char.rarity]} p-4`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl ${RARITY_BG[char.rarity]} ${!isOwned ? "grayscale opacity-50" : ""}`}>
          {isHidden ? (
            <div className="w-14 h-14 flex items-center justify-center">
              <Lock className="w-7 h-7 text-muted-foreground/40" />
            </div>
          ) : (
            <PixelSprite type={char.type} colors={char.colors} size={56} float={isOwned} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${RARITY_BG[char.rarity]} ${RARITY_COLOR[char.rarity]}`}>
              {RARITY_LABEL[char.rarity]}
            </span>
            <span className="text-xs text-muted-foreground">#{char.id}</span>
          </div>
          <p className="font-bold">{isHidden ? "???" : char.korName}</p>
          <p className="text-xs text-muted-foreground">
            {isHidden
              ? "히든 업적을 달성하면 공개됩니다"
              : char.obtainMethod === "achievement" && ach
              ? ach.label
              : char.obtainMethod === "starter"
              ? "스타팅 케보몬"
              : "가챠로 획득 가능"}
          </p>
          {isOwned && (
            <p className="text-xs text-muted-foreground mt-0.5">{char.description}</p>
          )}
        </div>
        <div className="shrink-0">
          {!isOwned ? (
            <Lock className="w-4 h-4 text-muted-foreground" />
          ) : isEquipped ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1.5 rounded-lg">
              <Shield className="w-3.5 h-3.5" />
              {t("kabemon.equipped")}
            </span>
          ) : (
            <button
              onClick={() => onEquip(char.id)}
              disabled={equipping}
              className="flex items-center gap-1 text-xs font-semibold bg-primary/80 text-primary-foreground px-2.5 py-1.5 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
            >
              <Shield className="w-3.5 h-3.5" />
              {equipping ? "..." : t("kabemon.equip")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Gacha Tab ────────────────────────────────────────────────────────────
function GachaTab({
  missionPoints, gachaPityCount, canAffordSingle, canAffordTen, pulling, onPull, t,
}: {
  missionPoints: number;
  gachaPityCount: number;
  canAffordSingle: boolean;
  canAffordTen: boolean;
  pulling: boolean;
  onPull: (count: 1 | 10) => void;
  t: (key: string) => string;
}) {
  const pityLeft = Math.max(0, 10 - (gachaPityCount % 10));

  return (
    <div className="space-y-4">
      {/* Points display */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t("kabemon.gacha_points_label")}</p>
          <p className="text-2xl font-bold text-primary">{missionPoints}P</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{t("kabemon.gacha_pity_label")}</p>
          <p className="text-lg font-bold">{pityLeft}{t("kabemon.days")}</p>
        </div>
      </div>

      {/* Gacha buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => !pulling && onPull(1)}
          disabled={!canAffordSingle || pulling}
          className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
            canAffordSingle
              ? "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:shadow-md"
              : "border-border bg-muted opacity-50"
          }`}
        >
          <Sparkles className="w-8 h-8 text-primary" />
          <div className="text-center">
            <p className="font-bold text-sm">{t("kabemon.gacha_single")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{GACHA_COST_SINGLE}P</p>
          </div>
          {pulling && <RotateCcw className="w-4 h-4 animate-spin text-primary" />}
        </button>

        <button
          onClick={() => !pulling && onPull(10)}
          disabled={!canAffordTen || pulling}
          className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
            canAffordTen
              ? "border-amber-400/60 bg-amber-400/5 hover:bg-amber-400/10 hover:shadow-md"
              : "border-border bg-muted opacity-50"
          }`}
        >
          <div className="relative">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1" />
          </div>
          <div className="text-center">
            <p className="font-bold text-sm">{t("kabemon.gacha_ten")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{GACHA_COST_TEN}P</p>
          </div>
          <span className="text-[10px] font-semibold text-amber-500 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
            {t("kabemon.gacha_ten_guarantee")}
          </span>
        </button>
      </div>

      {/* Rate table */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold mb-3">{t("kabemon.gacha_rates_title")}</h3>
        <div className="space-y-1.5">
          {(["common", "uncommon", "rare", "epic", "legendary", "mythic"] as CharacterRarity[]).map((r) => {
            const rates: Record<CharacterRarity, number> = {
              common: 45, uncommon: 30, rare: 15, epic: 6, legendary: 3, mythic: 1,
            };
            return (
              <div key={r} className="flex items-center gap-2">
                <span className={`text-xs font-medium w-16 ${RARITY_COLOR[r]}`}>{RARITY_LABEL[r]}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current opacity-60"
                    style={{ width: `${rates[r]}%`, color: "currentColor" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{rates[r]}%</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-border space-y-1">
          <p className="text-[11px] text-muted-foreground">· {t("kabemon.gacha_dupe_note")}</p>
          <p className="text-[11px] text-muted-foreground">
            · {t("kabemon.gacha_dupe_rate")} {(["common", "uncommon", "rare", "epic", "legendary", "mythic"] as CharacterRarity[]).map((r) => `${RARITY_LABEL[r]} ${RARITY_DUPLICATE_POINTS[r]}P`).join(" / ")}
          </p>
        </div>
      </div>

    </div>
  );
}

// ─── Achievement Tab ──────────────────────────────────────────────────────
const CATEGORY_ICON: Record<AchievementType, { icon: React.ReactNode; color: string; labelKey: string }> = {
  attendance:    { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-blue-400",   labelKey: "kabemon.cat_attendance" },
  streak:        { icon: <Flame        className="w-4 h-4" />, color: "text-orange-400", labelKey: "kabemon.cat_streak" },
  expense_count: { icon: <Zap          className="w-4 h-4" />, color: "text-yellow-400", labelKey: "kabemon.cat_expense" },
  share_count:   { icon: <Star         className="w-4 h-4" />, color: "text-green-400",  labelKey: "kabemon.cat_share" },
  post_count:    { icon: <Sparkles     className="w-4 h-4" />, color: "text-purple-400", labelKey: "kabemon.cat_post" },
  points:        { icon: <Gift         className="w-4 h-4" />, color: "text-primary",    labelKey: "kabemon.cat_points" },
};

function AchievementTab({
  ownedSet, attendanceDays, streakDays, missionPoints, checking, newlyUnlocked, onCheck, t,
}: {
  ownedSet: Set<number>;
  attendanceDays: number;
  streakDays: number;
  missionPoints: number;
  checking: boolean;
  newlyUnlocked: number[];
  onCheck: () => void;
  t: (key: string) => string;
}) {
  const visibleAchs = ACHIEVEMENTS.filter((a) => !a.hidden);
  const hiddenAchs  = ACHIEVEMENTS.filter((a) => a.hidden);
  const totalDone   = ACHIEVEMENTS.filter((a) => ownedSet.has(a.characterId)).length;

  const progressOf = (type: AchievementType, value: number) => {
    switch (type) {
      case "attendance": return Math.min(attendanceDays, value);
      case "streak":     return Math.min(streakDays, value);
      case "points":     return Math.min(missionPoints, value);
      default:           return null;
    }
  };

  const categories = (Object.keys(CATEGORY_ICON) as AchievementType[]).filter(
    (cat) => visibleAchs.some((a) => a.type === cat)
  );

  return (
    <div className="space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">{t("kabemon.achievement_total")}</p>
          <p className="text-lg font-bold">
            <span className="text-primary">{totalDone}</span>
            <span className="text-muted-foreground font-normal text-sm"> / {ACHIEVEMENTS.length}</span>
          </p>
        </div>
        <button
          onClick={onCheck}
          disabled={checking}
          className="flex items-center gap-1.5 bg-primary/80 text-primary-foreground text-xs font-semibold px-3 py-2 rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
        >
          <Gift className="w-3.5 h-3.5" />
          {checking ? t("kabemon.achievement_checking") : t("kabemon.achievement_claim")}
        </button>
      </div>

      {/* Newly unlocked banner */}
      {newlyUnlocked.length > 0 && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 space-y-1.5">
          <p className="text-xs font-bold text-primary">{t("kabemon.achievement_new")}</p>
          {newlyUnlocked.map((id) => {
            const char = CHARACTERS.find((c) => c.id === id);
            return char ? (
              <div key={id} className="flex items-center gap-2">
                <PixelSprite type={char.type} colors={char.colors} size={28} />
                <p className={`text-xs font-medium ${RARITY_COLOR[char.rarity]}`}>
                  {char.korName} <span className="text-muted-foreground font-normal">({RARITY_LABEL[char.rarity]})</span>
                </p>
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* Category groups */}
      {categories.map((cat) => {
        const achs = visibleAchs.filter((a) => a.type === cat);
        const meta = CATEGORY_ICON[cat];
        return (
          <div key={cat} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
              <span className={meta.color}>{meta.icon}</span>
              <span className="text-xs font-bold">{t(meta.labelKey)}</span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {achs.filter((a) => ownedSet.has(a.characterId)).length}/{achs.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {achs.map((ach) => {
                const char = CHARACTERS.find((c) => c.id === ach.characterId);
                if (!char) return null;
                const isOwned = ownedSet.has(ach.characterId);
                const progress = progressOf(ach.type as AchievementType, ach.value);
                const pct = progress !== null ? Math.min(100, Math.round((progress / ach.value) * 100)) : null;

                return (
                  <div
                    key={ach.characterId}
                    className={`flex items-center gap-3 px-4 py-3 ${isOwned ? "bg-primary/5" : "hover:bg-muted/20"}`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      isOwned ? RARITY_BG[char.rarity] : "bg-muted"
                    } ${!isOwned ? "grayscale opacity-50" : ""}`}>
                      <PixelSprite type={char.type} colors={char.colors} size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-tight ${
                        isOwned ? RARITY_COLOR[char.rarity] : "text-foreground"
                      }`}>
                        {char.korName}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{ach.label}</p>
                      {pct !== null && !isOwned && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground shrink-0">{progress}/{ach.value}</span>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {isOwned ? (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Hidden achievements */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
          <span className="text-muted-foreground/60"><Lock className="w-4 h-4" /></span>
          <span className="text-xs font-bold text-muted-foreground">{t("kabemon.achievement_hidden")}</span>
          <span className="ml-auto text-[10px] text-muted-foreground">
            {hiddenAchs.filter((a) => ownedSet.has(a.characterId)).length}/{hiddenAchs.length}
          </span>
        </div>
        <div className="divide-y divide-border">
          {hiddenAchs.map((ach) => {
            const isOwned = ownedSet.has(ach.characterId);
            const char = CHARACTERS.find((c) => c.id === ach.characterId);
            return (
              <div key={ach.characterId} className={`flex items-center gap-3 px-4 py-3 ${isOwned ? "bg-primary/5" : ""}`}>
                <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  isOwned && char ? RARITY_BG[char.rarity] : "bg-muted"
                } ${!isOwned ? "grayscale opacity-40" : ""}`}>
                  {isOwned && char
                    ? <PixelSprite type={char.type} colors={char.colors} size={32} />
                    : <span className="text-base font-bold text-muted-foreground/30">?</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    isOwned && char ? RARITY_COLOR[char.rarity] : "text-muted-foreground/40"
                  }`}>
                    {isOwned && char ? char.korName : "???"}
                  </p>
                  <p className="text-[11px] text-muted-foreground/50">
                    {isOwned ? ach.label : t("kabemon.achievement_condition_hidden")}
                  </p>
                </div>
                <div className="shrink-0">
                  {isOwned ? (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
