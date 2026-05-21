export type CharacterType =
  | "slime" | "cat" | "rabbit" | "ghost" | "plant"
  | "fish" | "owl" | "bear" | "turtle" | "fox"
  | "wolf" | "robot" | "dragon" | "phoenix" | "unicorn"
  | "horse" | "tiger" | "lion" | "snake" | "deer";

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

export const CHARACTER_JP_NAMES: Record<number, string> = {
  1: "緑のスライム",
  2: "オレンジのネコ",
  3: "白いウサギ",
  4: "青いゴースト",
  5: "緑の新芽",
  6: "青い魚",
  7: "茶色のフクロウ",
  8: "茶色のクマ",
  9: "緑のカメ",
  10: "オレンジのキツネ",
  11: "灰色のオオカミ",
  12: "銀のロボット",
  13: "紫のスライム",
  14: "灰色のネコ",
  15: "茶色のウサギ",
  16: "紫のゴースト",
  17: "黄色い花の芽",
  18: "金魚",
  19: "白いフクロウ",
  20: "黒いクマ",
  21: "青いカメ",
  22: "白いキツネ",
  23: "茶色のオオカミ",
  24: "青いロボット",
  25: "赤いスライム",
  26: "黒いネコ",
  27: "青いウサギ",
  28: "緑のゴースト",
  29: "紫の花",
  30: "赤い魚",
  31: "紫のフクロウ",
  32: "パンダ",
  33: "黄金のカメ",
  34: "青いキツネ",
  35: "黒いオオカミ",
  36: "黄金のロボット",
  37: "黄金のスライム",
  38: "白いネコ",
  39: "紫のウサギ",
  40: "黄金のゴースト",
  41: "虹色の新芽",
  42: "虹色の魚",
  43: "黄金のフクロウ",
  44: "シロクマ",
  45: "水晶のカメ",
  46: "黄金のキツネ",
  47: "北極オオカミ",
  48: "ピンクのロボット",
  49: "水晶のスライム",
  50: "ベビードラゴン",
  51: "青いネコ",
  52: "黄金のウサギ",
  53: "水晶のゴースト",
  54: "水晶の新芽",
  55: "水晶の魚",
  56: "水晶のフクロウ",
  57: "水晶のクマ",
  58: "ドラゴンカメ",
  59: "影のキツネ",
  60: "炎のオオカミ",
  61: "ダイヤモンドロボット",
  62: "闇のスライム",
  63: "炎のネコ",
  64: "影のウサギ",
  65: "炎のゴースト",
  66: "炎の新芽",
  67: "溶岩の魚",
  68: "闇のフクロウ",
  69: "炎のクマ",
  70: "若き不死鳥",
  71: "霊狐",
  72: "霊狼",
  73: "霊のロボット",
  74: "宇宙スライム",
  75: "宇宙ネコ",
  76: "宇宙ウサギ",
  77: "宇宙ゴースト",
  78: "宇宙の新芽",
  79: "宇宙の魚",
  80: "宇宙フクロウ",
  81: "ユニコーン",
  82: "宇宙クマ",
  83: "宇宙カメ",
  84: "嵐の竜",
  85: "宇宙キツネ",
  86: "雷のオオカミ",
  87: "宇宙ロボット",
  88: "神聖スライム",
  89: "神聖ネコ",
  90: "聖なる不死鳥",
  91: "神聖ウサギ",
  92: "神聖ゴースト",
  93: "世界樹の芽",
  94: "リヴァイアサン",
  95: "虹色ユニコーン",
  96: "永遠の竜",
  97: "古代のフクロウ",
  98: "古代のクマ",
  99: "伝説の竜",
  100: "神話の不死鳥",
  101: "河童",
  102: "トッケビ",
  103: "狸",
  104: "プーカ",
  105: "クー・シー",
  106: "犬神",
  107: "鬼火",
  108: "ヴォルパーティンガー",
  109: "ジャカロープ",
  110: "ドモヴォイ",
  111: "鎌鼬",
  112: "ミシペシュ",
  113: "バニップ",
  114: "ホーダック",
  115: "バンシー",
  116: "インプ",
  117: "ゴブリン",
  118: "スコフィン",
  119: "ブラウニー",
  120: "アウフホッカー",
  121: "九尾の狐",
  122: "天狗",
  123: "鬼",
  124: "獏",
  125: "雷獣",
  126: "鵺",
  127: "シーサー",
  128: "狛犬",
  129: "貔貅",
  130: "饕餮",
  131: "白沢",
  132: "白虎",
  133: "天犬",
  134: "狐仙",
  135: "ヘテ",
  136: "鳳凰",
  137: "朱雀",
  138: "玄武",
  139: "イムギ",
  140: "天馬",
  141: "麒麟",
  142: "人面鳥",
  143: "三足烏",
  144: "スレイプニル",
  145: "ラタトスク",
  146: "フギン",
  147: "ムニン",
  148: "ゲリ",
  149: "フレキ",
  150: "フレースヴェルグ",
  151: "アウドゥンブラ",
  152: "グリンブルスティ",
  153: "ヘイズルーン",
  154: "ニーズホッグ",
  155: "アヌビス",
  156: "ホルス",
  157: "トト",
  158: "セクメト",
  159: "ソベク",
  160: "ワジェト",
  161: "アピス",
  162: "ケプリ",
  163: "ナーガ",
  164: "ガルーダ",
  165: "マカラ",
  166: "サラバ",
  167: "ケシャリ",
  168: "アイラーヴァタ",
  169: "ペガサス",
  170: "キマイラ",
  171: "グリフィン",
  172: "ヒュドラ",
  173: "ケルベロス",
  174: "ラドン",
  175: "ネメアのライオン",
  176: "スティムファロス鳥",
  177: "カリュドンの猪",
  178: "クレタの牡牛",
  179: "カルカダン",
  180: "ヒッポグリフ",
  181: "青龍",
  182: "八岐大蛇",
  183: "ヨルムンガンド",
  184: "ケツァルコアトル",
  185: "ジズ",
  186: "ベヒモス",
  187: "ウロボロス",
  188: "天龍",
  189: "竜王",
  190: "アポピス",
  191: "アンミット",
  192: "ヴリトラ",
  193: "ティアマト",
  194: "アンズー",
  195: "ラマッス",
  196: "烏天狗",
  197: "竜神",
  198: "ヴォジャノイ",
  199: "火の鳥",
  200: "黄龍",
};

export const RARITY_LABEL_JA: Record<CharacterRarity, string> = {
  common: "コモン", uncommon: "アンコモン", rare: "レア",
  epic: "エピック", legendary: "レジェンダリー", mythic: "神話",
};

export function getCharName(char: CharacterDef, lang: string): string {
  if (lang === "ja") return CHARACTER_JP_NAMES[char.id] ?? char.name;
  return char.korName;
}

export function getRarityLabel(rarity: CharacterRarity, lang: string): string {
  if (lang === "ja") return RARITY_LABEL_JA[rarity];
  return RARITY_LABEL[rarity];
}

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

  // ── Gacha – Rare · 민담·요괴 (101–120) ──
  c(101, "Kappa",            "카파",          "turtle", "rare", "gacha", false, "물가의 장난꾸러기",       "#388E3C","#66BB6A","#FFD54F"),
  c(102, "Dokkaebi",         "도깨비",        "ghost",  "rare", "gacha", false, "도깨비방망이의 주인",     "#D84315","#FF7043","#FFEB3B"),
  c(103, "Tanuki",           "타누키",        "fox",    "rare", "gacha", false, "둔갑의 명수",             "#5D4037","#8D6E63","#F8BBD0"),
  c(104, "Pooka",            "푸카",          "rabbit", "rare", "gacha", false, "변신하는 장난꾸러기",     "#212121","#424242","#FFEB3B"),
  c(105, "Cu Sith",          "쿠 시스",       "wolf",   "rare", "gacha", false, "켈트의 녹색 사냥개",      "#388E3C","#66BB6A","#FFFFFF"),
  c(106, "Inugami",          "이누가미",      "wolf",   "rare", "gacha", false, "개의 신령",               "#5D4037","#8D6E63","#FFD54F"),
  c(107, "Will-o-Wisp",      "도깨비불",      "ghost",  "rare", "gacha", false, "늪지의 푸른 불꽃",        "#00ACC1","#4DD0E1","#FFEB3B"),
  c(108, "Wolpertinger",     "볼퍼팅거",      "rabbit", "rare", "gacha", false, "뿔 달린 합성 토끼",       "#795548","#A1887F","#FFD54F"),
  c(109, "Jackalope",        "재칼로프",      "rabbit", "rare", "gacha", false, "사슴뿔의 산토끼",         "#A1887F","#BCAAA4","#5D4037"),
  c(110, "Domovoi",          "도모보이",      "ghost",  "rare", "gacha", false, "집을 지키는 정령",        "#8D6E63","#A1887F","#FFD54F"),
  c(111, "Kamaitachi",       "카마이타치",    "fox",    "rare", "gacha", false, "바람의 족제비",           "#37474F","#607D8B","#FFEB3B"),
  c(112, "Mishipeshu",       "미시페슈",      "cat",    "rare", "gacha", false, "물속의 살쾡이",           "#0277BD","#4FC3F7","#FFEB3B"),
  c(113, "Bunyip",           "번니프",        "bear",   "rare", "gacha", false, "늪지의 괴물",             "#4E342E","#6D4C41","#FFEB3B"),
  c(114, "Hodag",            "호닥",          "bear",   "rare", "gacha", false, "위스콘신의 도시전설",     "#2E7D32","#4CAF50","#F44336"),
  c(115, "Banshee",          "반시",          "ghost",  "rare", "gacha", false, "곡소리의 정령",           "#37474F","#90A4AE","#FFFFFF"),
  c(116, "Imp",              "임프",          "ghost",  "rare", "gacha", false, "장난꾸러기 작은 악마",    "#B71C1C","#E53935","#FFEB3B"),
  c(117, "Goblin",           "고블린",        "slime",  "rare", "gacha", false, "동굴 속 고블린",          "#558B2F","#7CB342","#A1887F"),
  c(118, "Skoffin",          "스코핀",        "cat",    "rare", "gacha", false, "아이슬란드의 합성수",     "#E65100","#FF8F00","#FFFFFF"),
  c(119, "Brownie",          "브라우니",      "ghost",  "rare", "gacha", false, "집을 돕는 작은 영",       "#6D4C41","#8D6E63","#FFB300"),
  c(120, "Aufhocker",        "아우프호커",    "wolf",   "rare", "gacha", false, "등에 올라타는 늑대",      "#212121","#4E342E","#F44336"),

  // ── Gacha – Epic · 주요 신화 동물 (121–150) ──
  c(121, "Kitsune",          "키츠네",        "fox",    "epic", "gacha", false, "여우 영의 여신",          "#E65100","#FF8F00","#FFFFFF"),
  c(122, "Tengu",            "텐구",          "owl",    "epic", "gacha", false, "산속의 천구",             "#BF360C","#FF5722","#212121"),
  c(123, "Oni",              "오니",          "ghost",  "epic", "gacha", false, "뿔 달린 귀신",            "#B71C1C","#E53935","#FFEB3B"),
  c(124, "Baku",             "바쿠",          "bear",   "epic", "gacha", false, "꿈을 먹는 짐승",          "#37474F","#607D8B","#F8BBD0"),
  c(125, "Raiju",            "라이쥬",        "tiger",  "epic", "gacha", false, "번개의 짐승",             "#F57F17","#FFD54F","#212121"),
  c(126, "Nue",              "누에",          "cat",    "epic", "gacha", false, "원숭이 머리의 합성수",    "#4E342E","#6D4C41","#FFEB3B"),
  c(127, "Shisa",            "시사",          "lion",   "epic", "gacha", false, "수호의 사자견",           "#E65100","#FF8F00","#FFD54F"),
  c(128, "Komainu",          "코마이누",      "lion",   "epic", "gacha", false, "신사의 수호자",           "#5D4037","#8D6E63","#FFEB3B"),
  c(129, "Pixiu",            "비휴",          "lion",   "epic", "gacha", false, "재물의 영수",             "#F57F17","#FFD54F","#212121"),
  c(130, "Taotie",           "도철",          "bear",   "epic", "gacha", false, "탐욕의 청동수",           "#4E342E","#5D4037","#FFD54F"),
  c(131, "Baize",            "백택",          "lion",   "epic", "gacha", false, "만물을 아는 영수",        "#ECEFF1","#FFFFFF","#FFD54F"),
  c(132, "Bai Hu",           "백호",          "tiger",  "epic", "gacha", false, "서방의 흰 호랑이",        "#ECEFF1","#FFFFFF","#212121"),
  c(133, "Tiangou",          "천견",          "wolf",   "epic", "gacha", false, "해와 달을 먹는 개",       "#212121","#424242","#F57F17"),
  c(134, "Husian",           "호선",          "fox",    "epic", "gacha", false, "도를 닦은 여우",          "#E65100","#FF8F00","#FFFFFF"),
  c(135, "Haetae",           "해태",          "lion",   "epic", "gacha", false, "정의의 영수",             "#FFD54F","#FFEB3B","#BF360C"),
  c(136, "Bonghwang",        "봉황",          "phoenix","epic", "gacha", false, "오색의 봉황",             "#E91E63","#F06292","#FFD54F"),
  c(137, "Jujak",            "주작",          "phoenix","epic", "gacha", false, "남방의 붉은 새",          "#D32F2F","#F44336","#FFEB3B"),
  c(138, "Hyeonmu",          "현무",          "turtle", "epic", "gacha", false, "북방의 흑거북",           "#212121","#37474F","#388E3C"),
  c(139, "Imugi",            "이무기",        "snake",  "epic", "gacha", false, "용이 되려는 큰 뱀",       "#33691E","#558B2F","#FFEB3B"),
  c(140, "Cheonma",          "천마",          "horse",  "epic", "gacha", false, "하늘을 달리는 말",        "#1A237E","#3949AB","#FFFFFF"),
  c(141, "Girin",            "기린",          "deer",   "epic", "gacha", false, "성인의 출현을 알리는",    "#33691E","#558B2F","#FFD54F"),
  c(142, "Inmyeonjo",        "인면조",        "owl",    "epic", "gacha", false, "사람 얼굴의 새",          "#8D6E63","#A1887F","#F8BBD0"),
  c(143, "Samjokgo",         "삼족오",        "owl",    "epic", "gacha", false, "세 발 까마귀",            "#212121","#424242","#F57F17"),
  c(144, "Sleipnir",         "슬레이프니르",  "horse",  "epic", "gacha", false, "오딘의 여덟 다리 말",     "#37474F","#607D8B","#FFFFFF"),
  c(145, "Ratatoskr",        "라타토스크",    "fox",    "epic", "gacha", false, "세계수의 전령",           "#BF360C","#FF7043","#FFEB3B"),
  c(146, "Huginn",           "후긴",          "owl",    "epic", "gacha", false, "오딘의 사색 까마귀",      "#212121","#37474F","#9C27B0"),
  c(147, "Muninn",           "무닌",          "owl",    "epic", "gacha", false, "오딘의 기억 까마귀",      "#212121","#37474F","#3F51B5"),
  c(148, "Geri",             "게리",          "wolf",   "epic", "gacha", false, "오딘의 탐욕 늑대",        "#5D4037","#8D6E63","#F57F17"),
  c(149, "Freki",            "프레키",        "wolf",   "epic", "gacha", false, "오딘의 굶주린 늑대",      "#4E342E","#6D4C41","#F57F17"),
  c(150, "Hraesvelgr",       "흐레스벨그",    "phoenix","epic", "gacha", false, "바람을 일으키는 거대 새", "#37474F","#607D8B","#80DEEA"),

  // ── Gacha – Legendary · 위대한 신화 존재 (151–180) ──
  c(151, "Audumla",          "아우둠라",      "bear",   "legendary", "gacha", false, "원시의 어머니 짐승", "#ECEFF1","#FFFFFF","#FFD54F"),
  c(152, "Gullinbursti",     "굴린부르스티",  "bear",   "legendary", "gacha", false, "황금 갈기의 멧돼지", "#F57F17","#FFD54F","#FFFFFF"),
  c(153, "Heidrun",          "헤이드룬",      "deer",   "legendary", "gacha", false, "벌꿀술의 신수",      "#FFFDE7","#FFF59D","#FFB300"),
  c(154, "Nidhogg",          "니드호그",      "dragon", "legendary", "gacha", false, "세계수 뿌리의 용",   "#212121","#37474F","#F44336"),
  c(155, "Anubis",           "아누비스",      "wolf",   "legendary", "gacha", false, "사자의 인도자",      "#212121","#424242","#F57F17"),
  c(156, "Horus",            "호루스",        "phoenix","legendary", "gacha", false, "하늘의 매신",        "#0D47A1","#1976D2","#FFD54F"),
  c(157, "Thoth",            "토트",          "owl",    "legendary", "gacha", false, "지혜와 기록의 신",   "#1A237E","#3949AB","#FFD54F"),
  c(158, "Sekhmet",          "세크메트",      "lion",   "legendary", "gacha", false, "전쟁의 암사자",      "#BF360C","#FF5722","#FFD54F"),
  c(159, "Sobek",            "소베크",        "turtle", "legendary", "gacha", false, "나일의 악어신",      "#33691E","#558B2F","#FFD54F"),
  c(160, "Wadjet",           "와제트",        "snake",  "legendary", "gacha", false, "이집트의 코브라신",  "#1B5E20","#2E7D32","#FFD54F"),
  c(161, "Apis",             "아피스",        "bear",   "legendary", "gacha", false, "신성한 황소",        "#212121","#424242","#FFD54F"),
  c(162, "Khepri",           "케페르",        "slime",  "legendary", "gacha", false, "여명의 풍뎅이신",    "#2E7D32","#43A047","#FFD54F"),
  c(163, "Naga",             "나가",          "snake",  "legendary", "gacha", false, "물과 보석의 뱀신",   "#00695C","#26A69A","#FFD54F"),
  c(164, "Garuda",           "가루다",        "phoenix","legendary", "gacha", false, "비슈누의 탈것",      "#FF6F00","#FFB300","#1976D2"),
  c(165, "Makara",           "마카라",        "fish",   "legendary", "gacha", false, "강의 신수",          "#0277BD","#4FC3F7","#FFD54F"),
  c(166, "Sarabha",          "사라바",        "lion",   "legendary", "gacha", false, "여덟 다리의 영수",   "#E65100","#FF8F00","#FFFFFF"),
  c(167, "Kesari",           "케샤리",        "lion",   "legendary", "gacha", false, "사자왕",             "#F57F17","#FFD54F","#BF360C"),
  c(168, "Airavata",         "아이라바타",    "bear",   "legendary", "gacha", false, "인드라의 흰 코끼리", "#ECEFF1","#FFFFFF","#90CAF9"),
  c(169, "Pegasus",          "페가수스",      "horse",  "legendary", "gacha", false, "날개 달린 천마",     "#ECEFF1","#FFFFFF","#FFD54F"),
  c(170, "Chimera",          "키마이라",      "lion",   "legendary", "gacha", false, "사자-염소-뱀의 괴수","#BF360C","#FF5722","#FFEB3B"),
  c(171, "Griffin",          "그리핀",        "lion",   "legendary", "gacha", false, "사자 독수리",        "#5D4037","#8D6E63","#FFD54F"),
  c(172, "Hydra",            "히드라",        "dragon", "legendary", "gacha", false, "여러 머리의 물뱀",   "#00695C","#26A69A","#FFEB3B"),
  c(173, "Cerberus",         "케르베로스",    "wolf",   "legendary", "gacha", false, "지옥문의 세머리 개", "#212121","#424242","#F44336"),
  c(174, "Ladon",            "라돈",          "dragon", "legendary", "gacha", false, "황금사과의 수호룡",  "#33691E","#558B2F","#FFD54F"),
  c(175, "Nemean Lion",      "네메아 사자",   "lion",   "legendary", "gacha", false, "강철 가죽의 사자",   "#F57F17","#FFD54F","#5D4037"),
  c(176, "Stymphalian",      "스팀팔로스 새", "phoenix","legendary", "gacha", false, "청동 부리의 식인새", "#5D4037","#8D6E63","#FFD54F"),
  c(177, "Calydon Boar",     "칼리도니아 멧돼지","bear","legendary", "gacha", false, "칼리돈의 거수",      "#4E342E","#6D4C41","#FFEB3B"),
  c(178, "Cretan Bull",      "크레타 황소",   "bear",   "legendary", "gacha", false, "미궁의 황소",        "#3E2723","#5D4037","#FFFFFF"),
  c(179, "Karkadann",        "카르카단",      "unicorn","legendary", "gacha", false, "페르시아의 외뿔수",  "#5D4037","#8D6E63","#FFD54F"),
  c(180, "Hippogriff",       "히포그리프",    "horse",  "legendary", "gacha", false, "독수리-말의 혼혈수", "#A1887F","#BCAAA4","#FFD54F"),

  // ── Gacha – Mythic · 최고 신화 존재 (181–200) ──
  c(181, "Cheongryong",      "청룡",          "dragon", "mythic", "gacha", false, "동방의 수호룡",         "#0D47A1","#1976D2","#FFFFFF"),
  c(182, "Yamata-Orochi",    "야마타노 오로치","dragon", "mythic", "gacha", false, "여덟 머리의 대뱀",      "#311B92","#5E35B1","#F44336"),
  c(183, "Jormungandr",      "요르문간드",    "snake",  "mythic", "gacha", false, "미드가르드의 세계뱀",   "#01579B","#0277BD","#1B5E20"),
  c(184, "Quetzalcoatl",     "케찰코아틀",    "dragon", "mythic", "gacha", false, "깃털 달린 뱀신",        "#1B5E20","#388E3C","#F57F17"),
  c(185, "Ziz",              "지즈",          "phoenix","mythic", "gacha", false, "하늘을 가리는 거대새",  "#1A237E","#3949AB","#FFEB3B"),
  c(186, "Behemoth",         "베헤모스",      "bear",   "mythic", "gacha", false, "땅의 거수",             "#3E2723","#5D4037","#FFD54F"),
  c(187, "Ouroboros",        "우로보로스",    "snake",  "mythic", "gacha", false, "자신을 삼키는 영원",    "#F57F17","#FFD54F","#BF360C"),
  c(188, "Tianlong",         "천룡",          "dragon", "mythic", "gacha", false, "하늘을 떠받치는 용",    "#1A237E","#3949AB","#FFD54F"),
  c(189, "Yong Wang",        "용왕",          "dragon", "mythic", "gacha", false, "바다의 용왕",           "#006064","#0097A7","#FFD54F"),
  c(190, "Apophis",          "아포피스",      "snake",  "mythic", "gacha", false, "혼돈의 대뱀",           "#000000","#212121","#F44336"),
  c(191, "Ammit",            "암미트",        "bear",   "mythic", "gacha", false, "영혼을 삼키는 자",      "#4E342E","#6D4C41","#FF5722"),
  c(192, "Vritra",           "브리트라",      "dragon", "mythic", "gacha", false, "가뭄의 대룡",           "#BF360C","#FF7043","#F57F17"),
  c(193, "Tiamat",           "티아마트",      "dragon", "mythic", "gacha", false, "원초의 바다 여신",      "#01579B","#0277BD","#9C27B0"),
  c(194, "Anzu",             "안주",          "phoenix","mythic", "gacha", false, "폭풍의 사자머리 새",    "#5D4037","#8D6E63","#FFEB3B"),
  c(195, "Lamassu",          "라마수",        "lion",   "mythic", "gacha", false, "수메르의 수호 신수",    "#F57F17","#FFD54F","#1976D2"),
  c(196, "Karasu Tengu",     "까마귀 텐구",   "owl",    "mythic", "gacha", false, "검은 산의 왕",          "#000000","#212121","#F57F17"),
  c(197, "Ryujin",           "류진",          "dragon", "mythic", "gacha", false, "바다의 용신",           "#006064","#00838F","#FFD54F"),
  c(198, "Vodyanoy",         "보댜노이",      "fish",   "mythic", "gacha", false, "강의 늙은 영",          "#1B5E20","#2E7D32","#80DEEA"),
  c(199, "Zhar-Ptitsa",      "자르 프티차",   "phoenix","mythic", "gacha", false, "러시아의 불새",         "#D84315","#FF5722","#FFEB3B"),
  c(200, "Hwangnyong",       "황룡",          "dragon", "mythic", "gacha", false, "중앙의 황금룡",         "#F57F17","#FFD54F","#FFFFFF"),
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
