export type CharacterType =
  | "slime" | "cat" | "rabbit" | "ghost" | "plant"
  | "fish" | "owl" | "bear" | "turtle" | "fox"
  | "wolf" | "robot" | "dragon" | "phoenix" | "unicorn";

export type CharacterRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
export type ObtainMethod = "starter" | "achievement" | "gacha";
export type AchievementType = "attendance" | "streak" | "expense_count" | "share_count" | "post_count" | "points";

export interface CharacterDef {
  id: number;
  name: string;
  korName: string;
  type: CharacterType;
  rarity: CharacterRarity;
  obtainMethod: ObtainMethod;
  hiddenAchievement: boolean;
  description: string;
  colors: { p: string; s: string; a: string };
}

export interface AchievementDef {
  characterId: number;
  type: AchievementType;
  value: number;
  hidden: boolean;
  label: string;
}

const c = (
  id: number, name: string, korName: string,
  type: CharacterType, rarity: CharacterRarity, obtainMethod: ObtainMethod,
  hiddenAchievement: boolean,
  description: string, p: string, s: string, a: string
): CharacterDef => ({ id, name, korName, type, rarity, obtainMethod, hiddenAchievement, description, colors: { p, s, a } });

export const RARITY_LABEL: Record<CharacterRarity, string> = {
  common: "커먼", uncommon: "언커먼", rare: "레어",
  epic: "에픽", legendary: "레전더리", mythic: "신화",
};

export const RARITY_COLOR: Record<CharacterRarity, string> = {
  common: "text-gray-400",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-amber-400",
  mythic: "text-pink-400",
};

export const RARITY_BORDER: Record<CharacterRarity, string> = {
  common: "border-gray-400/40",
  uncommon: "border-green-400/50",
  rare: "border-blue-400/50",
  epic: "border-purple-400/60",
  legendary: "border-amber-400/70",
  mythic: "border-pink-400/80",
};

export const RARITY_DUPLICATE_POINTS: Record<CharacterRarity, number> = {
  common: 5,
  uncommon: 10,
  rare: 20,
  epic: 30,
  legendary: 60,
  mythic: 120,
};

// Gacha pull rates (sum = 100)
export const GACHA_RATES: Record<CharacterRarity, number> = {
  common: 45,
  uncommon: 30,
  rare: 15,
  epic: 6,
  legendary: 3,
  mythic: 1,
};

export const GACHA_COST_SINGLE = 120;
export const GACHA_COST_TEN = 1200;

export const CHARACTERS: CharacterDef[] = [
  // ── Starter (1–3) ──
  c(1,  "Green Slime",    "초록 슬라임",    "slime",  "common", "starter", false, "여행의 첫 발걸음",     "#7CB342","#AED581","#FFF176"),
  c(2,  "Orange Cat",     "주황 고양이",    "cat",    "common", "starter", false, "호기심 많은 야옹이",   "#EF6C00","#FFA726","#FFF176"),
  c(3,  "White Rabbit",   "흰 토끼",        "rabbit", "common", "starter", false, "순수한 마음",          "#ECEFF1","#CFD8DC","#F48FB1"),

  // ── Achievement – Common (4–9) ──
  c(4,  "Blue Ghost",     "파란 유령",      "ghost",  "common", "achievement", false, "평화로운 유령",        "#90CAF9","#BBDEFB","#FFFFFF"),
  c(5,  "Green Sprout",   "초록 새싹",      "plant",  "common", "achievement", false, "작은 용기",            "#66BB6A","#A5D6A7","#FFF176"),
  c(6,  "Blue Fish",      "파란 물고기",    "fish",   "common", "achievement", false, "자유로운 영혼",        "#42A5F5","#90CAF9","#B3E5FC"),
  c(7,  "Brown Owl",      "갈색 부엉이",    "owl",    "common", "achievement", false, "지혜의 첫 걸음",       "#8D6E63","#A1887F","#FFF176"),
  c(8,  "Brown Bear",     "갈색 곰",        "bear",   "common", "achievement", false, "든든한 동반자",        "#795548","#A1887F","#FFB74D"),
  c(9,  "Green Turtle",   "초록 거북이",    "turtle", "common", "achievement", false, "천천히 꾸준히",        "#558B2F","#8BC34A","#FFD54F"),

  // ── Gacha – Common (10–15) ──
  c(10, "Orange Fox",     "주황 여우",      "fox",    "common", "gacha", false, "영리한 여행자",        "#EF6C00","#FFA726","#FFFFFF"),
  c(11, "Gray Wolf",      "회색 늑대",      "wolf",   "common", "gacha", false, "용감한 파수꾼",        "#757575","#9E9E9E","#FFD54F"),
  c(12, "Silver Robot",   "은색 로봇",      "robot",  "common", "gacha", false, "계산기 천재",          "#90A4AE","#B0BEC5","#80DEEA"),
  c(13, "Purple Slime",   "보라 슬라임",    "slime",  "common", "gacha", false, "신비로운 젤리",        "#AB47BC","#CE93D8","#FFFFFF"),
  c(14, "Gray Cat",       "회색 고양이",    "cat",    "common", "gacha", false, "도도한 여행자",        "#616161","#9E9E9E","#FFB74D"),
  c(15, "Brown Rabbit",   "갈색 토끼",      "rabbit", "common", "gacha", false, "따뜻한 마음씨",        "#A1887F","#BCAAA4","#F8BBD0"),

  // ── Achievement – Uncommon (16–22) ──
  c(16, "Purple Ghost",   "보라 유령",      "ghost",  "uncommon", "achievement", false, "신비로운 존재",      "#7E57C2","#B39DDB","#EDE7F6"),
  c(17, "Yellow Flower",  "노란 꽃새싹",    "plant",  "uncommon", "achievement", false, "빛나는 생명력",      "#F9A825","#FFD54F","#A5D6A7"),
  c(18, "Gold Fish",      "황금 물고기",    "fish",   "uncommon", "achievement", false, "행운을 부르는",      "#FFB300","#FFD54F","#FF8F00"),
  c(19, "White Owl",      "흰 부엉이",      "owl",    "uncommon", "achievement", false, "달빛을 품은",        "#ECEFF1","#B0BEC5","#FFF176"),
  c(20, "Black Bear",     "검정 곰",        "bear",   "uncommon", "achievement", false, "밤의 수호자",        "#212121","#424242","#FF8F00"),
  c(21, "Blue Turtle",    "파란 거북이",    "turtle", "uncommon", "achievement", false, "깊은 바다의 꿈",     "#1565C0","#42A5F5","#FFF176"),
  c(22, "White Fox",      "흰 여우",        "fox",    "uncommon", "achievement", false, "순백의 지혜",        "#ECEFF1","#90A4AE","#E91E63"),

  // ── Gacha – Uncommon (23–30) ──
  c(23, "Brown Wolf",     "갈색 늑대",      "wolf",   "uncommon", "gacha", false, "대지의 파수꾼",      "#5D4037","#8D6E63","#FFD54F"),
  c(24, "Blue Robot",     "파란 로봇",      "robot",  "uncommon", "gacha", false, "업그레이드 완료",    "#1565C0","#42A5F5","#FFD54F"),
  c(25, "Red Slime",      "빨간 슬라임",    "slime",  "uncommon", "gacha", false, "열정적인 젤리",      "#E53935","#EF9A9A","#FFFFFF"),
  c(26, "Black Cat",      "검정 고양이",    "cat",    "uncommon", "gacha", false, "신비로운 야옹이",    "#212121","#424242","#4CAF50"),
  c(27, "Blue Rabbit",    "파란 토끼",      "rabbit", "uncommon", "gacha", false, "꿈꾸는 토끼",        "#1565C0","#64B5F6","#FFFFFF"),
  c(28, "Green Ghost",    "초록 유령",      "ghost",  "uncommon", "gacha", false, "숲의 정령",          "#2E7D32","#66BB6A","#FFFFFF"),
  c(29, "Purple Flower",  "보라 꽃",        "plant",  "uncommon", "gacha", false, "마법의 정원",        "#6A1B9A","#AB47BC","#FFF176"),
  c(30, "Red Fish",       "빨간 물고기",    "fish",   "uncommon", "gacha", false, "용감한 물고기",      "#C62828","#EF5350","#FFFFFF"),

  // ── Achievement – Rare (31–40) ──
  c(31, "Purple Owl",     "보라 부엉이",    "owl",    "rare", "achievement", false, "예언자의 눈",           "#4527A0","#7E57C2","#FFD54F"),
  c(32, "Panda",          "판다",           "bear",   "rare", "achievement", false, "흑백의 조화",           "#ECEFF1","#212121","#FF80AB"),
  c(33, "Gold Turtle",    "황금 거북이",    "turtle", "rare", "achievement", false, "재물운의 상징",         "#F57F17","#FFB300","#FFFFFF"),
  c(34, "Blue Fox",       "파란 여우",      "fox",    "rare", "achievement", false, "얼음의 여우",           "#1565C0","#42A5F5","#FFFFFF"),
  c(35, "Black Wolf",     "검정 늑대",      "wolf",   "rare", "achievement", false, "밤의 사냥꾼",           "#212121","#424242","#F44336"),
  c(36, "Gold Robot",     "황금 로봇",      "robot",  "rare", "achievement", false, "최고급 합금 기계",      "#F57F17","#FFD54F","#FF8F00"),
  c(37, "Gold Slime",     "황금 슬라임",    "slime",  "rare", "achievement", false, "행운의 젤리",           "#F9A825","#FFD54F","#FF8F00"),
  c(38, "White Cat",      "흰 고양이",      "cat",    "rare", "achievement", false, "귀족의 혈통",           "#ECEFF1","#B0BEC5","#F48FB1"),
  c(39, "Purple Rabbit",  "보라 토끼",      "rabbit", "rare", "achievement", false, "마법의 토끼",           "#6A1B9A","#AB47BC","#FFFFFF"),
  c(40, "Gold Ghost",     "황금 유령",      "ghost",  "rare", "achievement", false, "부의 정령",             "#F57F17","#FFD54F","#FFFFFF"),

  // ── Gacha – Rare (41–50) ──
  c(41, "Rainbow Plant",  "무지개 새싹",    "plant",  "rare", "gacha", false, "색채의 기적",           "#E91E63","#7E57C2","#FFD54F"),
  c(42, "Rainbow Fish",   "무지개 물고기",  "fish",   "rare", "gacha", false, "빛의 유영",             "#1565C0","#7E57C2","#FF8F00"),
  c(43, "Gold Owl",       "황금 부엉이",    "owl",    "rare", "gacha", false, "부와 지혜의 상징",      "#F57F17","#FFD54F","#FFFFFF"),
  c(44, "Polar Bear",     "북극곰",         "bear",   "rare", "gacha", false, "설원의 수호자",         "#E1F5FE","#B3E5FC","#FFD54F"),
  c(45, "Crystal Turtle", "수정 거북이",    "turtle", "rare", "gacha", false, "투명한 갑옷",           "#80DEEA","#B2EBF2","#FFFFFF"),
  c(46, "Gold Fox",       "황금 여우",      "fox",    "rare", "gacha", false, "행운의 꼬리",           "#F57F17","#FFD54F","#FFFFFF"),
  c(47, "Arctic Wolf",    "북극 늑대",      "wolf",   "rare", "gacha", false, "얼음의 군주",           "#E1F5FE","#90CAF9","#FFD54F"),
  c(48, "Pink Robot",     "분홍 로봇",      "robot",  "rare", "gacha", false, "귀여운 합금",           "#880E4F","#F48FB1","#FFD54F"),
  c(49, "Crystal Slime",  "수정 슬라임",    "slime",  "rare", "gacha", false, "투명한 보석",           "#80DEEA","#E0F7FA","#FFFFFF"),
  c(50, "Baby Dragon",    "아기 용",        "dragon", "rare", "gacha", false, "용의 첫 번째 알",       "#558B2F","#8BC34A","#7CB342"),

  // ── Achievement – Epic / Hidden (51–60) ──
  c(51, "Blue Cat",       "파란 고양이",    "cat",    "epic", "achievement", true, "바다의 정령",           "#0D47A1","#42A5F5","#FFD54F"),
  c(52, "Gold Rabbit",    "황금 토끼",      "rabbit", "epic", "achievement", true, "전설 속의 토끼",        "#F57F17","#FFD54F","#FFFFFF"),
  c(53, "Crystal Ghost",  "수정 유령",      "ghost",  "epic", "achievement", true, "정화된 영혼",           "#80DEEA","#E0F7FA","#B2EBF2"),
  c(54, "Crystal Plant",  "수정 새싹",      "plant",  "epic", "achievement", true, "얼음의 정원",           "#80DEEA","#B2EBF2","#FFD54F"),
  c(55, "Crystal Fish",   "수정 물고기",    "fish",   "epic", "achievement", true, "빛 속의 유영",          "#80DEEA","#FFFFFF","#42A5F5"),
  c(56, "Crystal Owl",    "수정 부엉이",    "owl",    "epic", "achievement", true, "투명한 지혜",           "#80DEEA","#FFFFFF","#FFD54F"),
  c(57, "Crystal Bear",   "수정 곰",        "bear",   "epic", "achievement", true, "빛의 수호자",           "#80DEEA","#B2EBF2","#FF80AB"),
  c(58, "Dragon Turtle",  "드래곤 거북이",  "turtle", "epic", "achievement", true, "용의 혈통",             "#2E7D32","#388E3C","#FFD54F"),
  c(59, "Shadow Fox",     "그림자 여우",    "fox",    "epic", "achievement", true, "어둠의 사냥꾼",         "#212121","#424242","#9C27B0"),
  c(60, "Fire Wolf",      "불꽃 늑대",      "wolf",   "epic", "achievement", true, "화염의 군주",           "#BF360C","#FF5722","#FFD54F"),

  // ── Gacha – Epic (61–70) ──
  c(61, "Diamond Robot",  "다이아 로봇",    "robot",  "epic", "gacha", false, "최강의 기계",           "#4DD0E1","#80DEEA","#FFFFFF"),
  c(62, "Shadow Slime",   "어둠 슬라임",    "slime",  "epic", "gacha", false, "밤의 정수",             "#212121","#6A1B9A","#9C27B0"),
  c(63, "Fire Cat",       "불꽃 고양이",    "cat",    "epic", "gacha", false, "화염의 야옹이",         "#BF360C","#FF5722","#FFD54F"),
  c(64, "Shadow Rabbit",  "어둠 토끼",      "rabbit", "epic", "gacha", false, "달의 그림자",           "#4A148C","#7B1FA2","#CE93D8"),
  c(65, "Flame Ghost",    "불꽃 유령",      "ghost",  "epic", "gacha", false, "불꽃 속의 영혼",        "#BF360C","#FF5722","#FFD54F"),
  c(66, "Fire Plant",     "불꽃 새싹",      "plant",  "epic", "gacha", false, "화염의 생명",           "#BF360C","#FF5722","#F9A825"),
  c(67, "Lava Fish",      "용암 물고기",    "fish",   "epic", "gacha", false, "화산의 영혼",           "#BF360C","#FF5722","#FFD54F"),
  c(68, "Shadow Owl",     "어둠 부엉이",    "owl",    "epic", "gacha", false, "밤의 예언자",           "#212121","#6A1B9A","#4DD0E1"),
  c(69, "Fire Bear",      "불꽃 곰",        "bear",   "epic", "gacha", false, "화염의 수호자",         "#BF360C","#FF5722","#FFD54F"),
  c(70, "Young Phoenix",  "어린 불사조",    "phoenix","epic", "gacha", false, "재생의 시작",           "#DD2C00","#FF6B6B","#FFD93D"),

  // ── Achievement – Legendary / Hidden (71–80) ──
  c(71, "Spirit Fox",     "령호 여우",      "fox",    "legendary", "achievement", true, "영혼의 수호자",     "#9C27B0","#E040FB","#FFFFFF"),
  c(72, "Spirit Wolf",    "령호 늑대",      "wolf",   "legendary", "achievement", true, "영혼의 파수꾼",     "#4A148C","#7B1FA2","#E040FB"),
  c(73, "Spirit Robot",   "령호 로봇",      "robot",  "legendary", "achievement", true, "영혼의 기계",       "#4A148C","#7B1FA2","#E040FB"),
  c(74, "Cosmic Slime",   "우주 슬라임",    "slime",  "legendary", "achievement", true, "별의 정수",         "#1A237E","#283593","#40C4FF"),
  c(75, "Cosmic Cat",     "우주 고양이",    "cat",    "legendary", "achievement", true, "별빛 야옹이",       "#1A237E","#283593","#E040FB"),
  c(76, "Cosmic Rabbit",  "우주 토끼",      "rabbit", "legendary", "achievement", true, "은하의 토끼",       "#1A237E","#3949AB","#40C4FF"),
  c(77, "Cosmic Ghost",   "우주 유령",      "ghost",  "legendary", "achievement", true, "성운의 정령",       "#1A237E","#283593","#40C4FF"),
  c(78, "Cosmic Plant",   "우주 새싹",      "plant",  "legendary", "achievement", true, "별의 생명",         "#1A237E","#283593","#40C4FF"),
  c(79, "Cosmic Fish",    "우주 물고기",    "fish",   "legendary", "achievement", true, "성간 여행자",       "#1A237E","#3949AB","#40C4FF"),
  c(80, "Cosmic Owl",     "우주 부엉이",    "owl",    "legendary", "achievement", true, "은하의 현자",       "#1A237E","#283593","#E040FB"),

  // ── Gacha – Legendary (81–90) ──
  c(81, "Unicorn",        "유니콘",         "unicorn","legendary", "gacha", false, "전설의 뿔",         "#F8F8F8","#FFFFFF","#b7607e"),
  c(82, "Cosmic Bear",    "우주 곰",        "bear",   "legendary", "gacha", false, "성운의 수호자",     "#1A237E","#283593","#FF80AB"),
  c(83, "Cosmic Turtle",  "우주 거북이",    "turtle", "legendary", "gacha", false, "우주의 등껍질",     "#1A237E","#283593","#40C4FF"),
  c(84, "Storm Dragon",   "폭풍 용",        "dragon", "legendary", "gacha", false, "번개를 부르는 용",  "#0D47A1","#1565C0","#FFD54F"),
  c(85, "Cosmic Fox",     "우주 여우",      "fox",    "legendary", "gacha", false, "성간 사냥꾼",       "#1A237E","#3949AB","#E040FB"),
  c(86, "Thunder Wolf",   "번개 늑대",      "wolf",   "legendary", "gacha", false, "번개의 군주",       "#F57F17","#FFD54F","#212121"),
  c(87, "Cosmic Robot",   "우주 로봇",      "robot",  "legendary", "gacha", false, "우주 탐험가",       "#1A237E","#283593","#40C4FF"),
  c(88, "Divine Slime",   "신성 슬라임",    "slime",  "legendary", "gacha", false, "신의 젤리",         "#FFD54F","#FFFFFF","#FF80AB"),
  c(89, "Divine Cat",     "신성 고양이",    "cat",    "legendary", "gacha", false, "신의 야옹이",       "#FFD54F","#FFF9C4","#FF80AB"),
  c(90, "Sacred Phoenix", "성스러운 불사조","phoenix","legendary", "gacha", false, "불멸의 새",         "#E65100","#FF8F00","#FFD54F"),

  // ── Achievement – Mythic / Hidden (91–94) ──
  c(91, "Divine Rabbit",    "신성 토끼",    "rabbit", "mythic", "achievement", true, "달의 신사",         "#FFD54F","#FFFFFF","#FF80AB"),
  c(92, "Divine Ghost",     "신성 유령",    "ghost",  "mythic", "achievement", true, "천상의 영혼",       "#FFD54F","#FFFDE7","#FFFFFF"),
  c(93, "World Tree",       "세계수 새싹",  "plant",  "mythic", "achievement", true, "세상의 근원",       "#1B5E20","#2E7D32","#FFD54F"),
  c(94, "Leviathan",        "리바이어던",   "fish",   "mythic", "achievement", true, "심해의 군주",       "#01579B","#0277BD","#40C4FF"),

  // ── Gacha – Mythic (95–100) ──
  c(95,  "Rainbow Unicorn",  "무지개 유니콘","unicorn","mythic", "gacha", false, "빛의 화신",         "#FF80AB","#CE93D8","#FFD54F"),
  c(96,  "Eternal Dragon",   "영원의 용",    "dragon", "mythic", "gacha", false, "시간을 초월한 용",  "#B71C1C","#C62828","#FFD54F"),
  c(97,  "Ancient Owl",      "고대 부엉이",  "owl",    "mythic", "gacha", false, "시간의 현자",       "#4E342E","#6D4C41","#FFD54F"),
  c(98,  "Ancient Bear",     "고대 곰",      "bear",   "mythic", "gacha", false, "원시의 수호자",     "#1B0000","#3E2723","#FFD54F"),
  c(99,  "Legendary Dragon", "전설의 용",    "dragon", "mythic", "gacha", false, "가장 강력한 용",    "#9C27B0","#AB47BC","#FFD700"),
  c(100, "Mythic Phoenix",   "신화 불사조",  "phoenix","mythic", "gacha", false, "신화가 된 새",      "#B71C1C","#FF6B6B","#FFD93D"),
];

// Character ID sets by method
export const STARTER_IDS = [1, 2, 3];
export const GACHA_IDS = CHARACTERS
  .filter((ch) => ch.obtainMethod === "gacha")
  .map((ch) => ch.id);

// Achievement definitions – maps achievement condition to character reward
export const ACHIEVEMENTS: AchievementDef[] = [
  // Common
  { characterId: 4,  type: "expense_count", value: 1,      hidden: false, label: "첫 번째 지출 기록" },
  { characterId: 5,  type: "attendance",    value: 3,      hidden: false, label: "3일 출석" },
  { characterId: 6,  type: "share_count",   value: 1,      hidden: false, label: "첫 지출 공유" },
  { characterId: 7,  type: "expense_count", value: 5,      hidden: false, label: "지출 5회 기록" },
  { characterId: 8,  type: "attendance",    value: 7,      hidden: false, label: "7일 출석" },
  { characterId: 9,  type: "post_count",    value: 1,      hidden: false, label: "첫 커뮤니티 글 작성" },
  // Uncommon
  { characterId: 16, type: "expense_count", value: 10,     hidden: false, label: "지출 10회 기록" },
  { characterId: 17, type: "streak",        value: 3,      hidden: false, label: "3일 연속 출석" },
  { characterId: 18, type: "points",        value: 100,    hidden: false, label: "포인트 100P 달성" },
  { characterId: 19, type: "post_count",    value: 3,      hidden: false, label: "커뮤니티 글 3개 작성" },
  { characterId: 20, type: "share_count",   value: 3,      hidden: false, label: "지출 3회 공유" },
  { characterId: 21, type: "attendance",    value: 14,     hidden: false, label: "14일 출석" },
  { characterId: 22, type: "expense_count", value: 20,     hidden: false, label: "지출 20회 기록" },
  // Rare
  { characterId: 31, type: "expense_count", value: 30,     hidden: false, label: "지출 30회 기록" },
  { characterId: 32, type: "share_count",   value: 10,     hidden: false, label: "지출 10회 공유" },
  { characterId: 33, type: "points",        value: 200,    hidden: false, label: "포인트 200P 달성" },
  { characterId: 34, type: "attendance",    value: 30,     hidden: false, label: "30일 출석" },
  { characterId: 35, type: "streak",        value: 7,      hidden: false, label: "7일 연속 출석" },
  { characterId: 36, type: "post_count",    value: 10,     hidden: false, label: "커뮤니티 글 10개 작성" },
  { characterId: 37, type: "expense_count", value: 50,     hidden: false, label: "지출 50회 기록" },
  { characterId: 38, type: "points",        value: 500,    hidden: false, label: "포인트 500P 달성" },
  { characterId: 39, type: "streak",        value: 14,     hidden: false, label: "14일 연속 출석" },
  { characterId: 40, type: "share_count",   value: 20,     hidden: false, label: "지출 20회 공유" },
  // Epic – hidden
  { characterId: 51, type: "points",        value: 1000,   hidden: true,  label: "포인트 1000P 달성" },
  { characterId: 52, type: "expense_count", value: 100,    hidden: true,  label: "지출 100회 기록" },
  { characterId: 53, type: "attendance",    value: 50,     hidden: true,  label: "50일 출석" },
  { characterId: 54, type: "share_count",   value: 30,     hidden: true,  label: "지출 30회 공유" },
  { characterId: 55, type: "post_count",    value: 30,     hidden: true,  label: "커뮤니티 글 30개 작성" },
  { characterId: 56, type: "streak",        value: 30,     hidden: true,  label: "30일 연속 출석" },
  { characterId: 57, type: "points",        value: 2000,   hidden: true,  label: "포인트 2000P 달성" },
  { characterId: 58, type: "expense_count", value: 200,    hidden: true,  label: "지출 200회 기록" },
  { characterId: 59, type: "attendance",    value: 90,     hidden: true,  label: "90일 출석" },
  { characterId: 60, type: "share_count",   value: 50,     hidden: true,  label: "지출 50회 공유" },
  // Legendary – hidden
  { characterId: 71, type: "points",        value: 5000,   hidden: true,  label: "포인트 5000P 달성" },
  { characterId: 72, type: "expense_count", value: 500,    hidden: true,  label: "지출 500회 기록" },
  { characterId: 73, type: "attendance",    value: 180,    hidden: true,  label: "180일 출석" },
  { characterId: 74, type: "streak",        value: 60,     hidden: true,  label: "60일 연속 출석" },
  { characterId: 75, type: "share_count",   value: 100,    hidden: true,  label: "지출 100회 공유" },
  { characterId: 76, type: "post_count",    value: 100,    hidden: true,  label: "커뮤니티 글 100개 작성" },
  { characterId: 77, type: "points",        value: 10000,  hidden: true,  label: "포인트 10000P 달성" },
  { characterId: 78, type: "expense_count", value: 1000,   hidden: true,  label: "지출 1000회 기록" },
  { characterId: 79, type: "attendance",    value: 365,    hidden: true,  label: "365일 출석" },
  { characterId: 80, type: "streak",        value: 100,    hidden: true,  label: "100일 연속 출석" },
  // Mythic – hidden
  { characterId: 91, type: "points",        value: 50000,  hidden: true,  label: "포인트 50000P 달성" },
  { characterId: 92, type: "share_count",   value: 500,    hidden: true,  label: "지출 500회 공유" },
  { characterId: 93, type: "expense_count", value: 5000,   hidden: true,  label: "지출 5000회 기록" },
  { characterId: 94, type: "streak",        value: 365,    hidden: true,  label: "365일 연속 출석" },
];

// Lookup map for quick access
export const ACHIEVEMENT_BY_CHARACTER = new Map(
  ACHIEVEMENTS.map((a) => [a.characterId, a])
);
