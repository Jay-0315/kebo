export type CharacterType =
  | "slime" | "cat" | "rabbit" | "ghost" | "plant"
  | "fish" | "owl" | "bear" | "turtle" | "fox"
  | "wolf" | "robot" | "dragon" | "phoenix" | "unicorn";

export type CharacterRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export interface CharacterDef {
  id: number;
  name: string;
  korName: string;
  type: CharacterType;
  rarity: CharacterRarity;
  unlockLevel: number;
  description: string;
  colors: { p: string; s: string; a: string };
}

const c = (
  id: number, name: string, korName: string,
  type: CharacterType, rarity: CharacterRarity, unlockLevel: number,
  description: string, p: string, s: string, a: string
): CharacterDef => ({ id, name, korName, type, rarity, unlockLevel, description, colors: { p, s, a } });

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

export const CHARACTERS: CharacterDef[] = [
  // ── Common (1–15) ──
  c(1,  "Green Slime",    "초록 슬라임",    "slime",  "common", 1,  "여행의 첫 발걸음",     "#7CB342","#AED581","#FFF176"),
  c(2,  "Orange Cat",     "주황 고양이",    "cat",    "common", 2,  "호기심 많은 야옹이",   "#EF6C00","#FFA726","#FFF176"),
  c(3,  "White Rabbit",   "흰 토끼",        "rabbit", "common", 3,  "순수한 마음",          "#ECEFF1","#CFD8DC","#F48FB1"),
  c(4,  "Blue Ghost",     "파란 유령",      "ghost",  "common", 4,  "평화로운 유령",        "#90CAF9","#BBDEFB","#FFFFFF"),
  c(5,  "Green Sprout",   "초록 새싹",      "plant",  "common", 5,  "작은 용기",            "#66BB6A","#A5D6A7","#FFF176"),
  c(6,  "Blue Fish",      "파란 물고기",    "fish",   "common", 6,  "자유로운 영혼",        "#42A5F5","#90CAF9","#B3E5FC"),
  c(7,  "Brown Owl",      "갈색 부엉이",    "owl",    "common", 7,  "지혜의 첫 걸음",       "#8D6E63","#A1887F","#FFF176"),
  c(8,  "Brown Bear",     "갈색 곰",        "bear",   "common", 8,  "든든한 동반자",        "#795548","#A1887F","#FFB74D"),
  c(9,  "Green Turtle",   "초록 거북이",    "turtle", "common", 9,  "천천히 꾸준히",        "#558B2F","#8BC34A","#FFD54F"),
  c(10, "Orange Fox",     "주황 여우",      "fox",    "common", 10, "영리한 여행자",        "#EF6C00","#FFA726","#FFFFFF"),
  c(11, "Gray Wolf",      "회색 늑대",      "wolf",   "common", 11, "용감한 파수꾼",        "#757575","#9E9E9E","#FFD54F"),
  c(12, "Silver Robot",   "은색 로봇",      "robot",  "common", 12, "계산기 천재",          "#90A4AE","#B0BEC5","#80DEEA"),
  c(13, "Purple Slime",   "보라 슬라임",    "slime",  "common", 13, "신비로운 젤리",        "#AB47BC","#CE93D8","#FFFFFF"),
  c(14, "Gray Cat",       "회색 고양이",    "cat",    "common", 14, "도도한 여행자",        "#616161","#9E9E9E","#FFB74D"),
  c(15, "Brown Rabbit",   "갈색 토끼",      "rabbit", "common", 15, "따뜻한 마음씨",        "#A1887F","#BCAAA4","#F8BBD0"),
  // ── Uncommon (16–30) ──
  c(16, "Purple Ghost",   "보라 유령",      "ghost",  "uncommon", 16, "신비로운 존재",      "#7E57C2","#B39DDB","#EDE7F6"),
  c(17, "Yellow Flower",  "노란 꽃새싹",    "plant",  "uncommon", 17, "빛나는 생명력",      "#F9A825","#FFD54F","#A5D6A7"),
  c(18, "Gold Fish",      "황금 물고기",    "fish",   "uncommon", 18, "행운을 부르는",      "#FFB300","#FFD54F","#FF8F00"),
  c(19, "White Owl",      "흰 부엉이",      "owl",    "uncommon", 19, "달빛을 품은",        "#ECEFF1","#B0BEC5","#FFF176"),
  c(20, "Black Bear",     "검정 곰",        "bear",   "uncommon", 20, "밤의 수호자",        "#212121","#424242","#FF8F00"),
  c(21, "Blue Turtle",    "파란 거북이",    "turtle", "uncommon", 21, "깊은 바다의 꿈",     "#1565C0","#42A5F5","#FFF176"),
  c(22, "White Fox",      "흰 여우",        "fox",    "uncommon", 22, "순백의 지혜",        "#ECEFF1","#90A4AE","#E91E63"),
  c(23, "Brown Wolf",     "갈색 늑대",      "wolf",   "uncommon", 23, "대지의 파수꾼",      "#5D4037","#8D6E63","#FFD54F"),
  c(24, "Blue Robot",     "파란 로봇",      "robot",  "uncommon", 24, "업그레이드 완료",    "#1565C0","#42A5F5","#FFD54F"),
  c(25, "Red Slime",      "빨간 슬라임",    "slime",  "uncommon", 25, "열정적인 젤리",      "#E53935","#EF9A9A","#FFFFFF"),
  c(26, "Black Cat",      "검정 고양이",    "cat",    "uncommon", 26, "신비로운 야옹이",    "#212121","#424242","#4CAF50"),
  c(27, "Blue Rabbit",    "파란 토끼",      "rabbit", "uncommon", 27, "꿈꾸는 토끼",        "#1565C0","#64B5F6","#FFFFFF"),
  c(28, "Green Ghost",    "초록 유령",      "ghost",  "uncommon", 28, "숲의 정령",          "#2E7D32","#66BB6A","#FFFFFF"),
  c(29, "Purple Flower",  "보라 꽃",        "plant",  "uncommon", 29, "마법의 정원",        "#6A1B9A","#AB47BC","#FFF176"),
  c(30, "Red Fish",       "빨간 물고기",    "fish",   "uncommon", 30, "용감한 물고기",      "#C62828","#EF5350","#FFFFFF"),
  // ── Rare (31–50) ──
  c(31, "Purple Owl",     "보라 부엉이",    "owl",    "rare", 31, "예언자의 눈",           "#4527A0","#7E57C2","#FFD54F"),
  c(32, "Panda",          "판다",           "bear",   "rare", 32, "흑백의 조화",           "#ECEFF1","#212121","#FF80AB"),
  c(33, "Gold Turtle",    "황금 거북이",    "turtle", "rare", 33, "재물운의 상징",         "#F57F17","#FFB300","#FFFFFF"),
  c(34, "Blue Fox",       "파란 여우",      "fox",    "rare", 34, "얼음의 여우",           "#1565C0","#42A5F5","#FFFFFF"),
  c(35, "Black Wolf",     "검정 늑대",      "wolf",   "rare", 35, "밤의 사냥꾼",           "#212121","#424242","#F44336"),
  c(36, "Gold Robot",     "황금 로봇",      "robot",  "rare", 36, "최고급 합금 기계",      "#F57F17","#FFD54F","#FF8F00"),
  c(37, "Gold Slime",     "황금 슬라임",    "slime",  "rare", 37, "행운의 젤리",           "#F9A825","#FFD54F","#FF8F00"),
  c(38, "White Cat",      "흰 고양이",      "cat",    "rare", 38, "귀족의 혈통",           "#ECEFF1","#B0BEC5","#F48FB1"),
  c(39, "Purple Rabbit",  "보라 토끼",      "rabbit", "rare", 39, "마법의 토끼",           "#6A1B9A","#AB47BC","#FFFFFF"),
  c(40, "Gold Ghost",     "황금 유령",      "ghost",  "rare", 40, "부의 정령",             "#F57F17","#FFD54F","#FFFFFF"),
  c(41, "Rainbow Plant",  "무지개 새싹",    "plant",  "rare", 41, "색채의 기적",           "#E91E63","#7E57C2","#FFD54F"),
  c(42, "Rainbow Fish",   "무지개 물고기",  "fish",   "rare", 42, "빛의 유영",             "#1565C0","#7E57C2","#FF8F00"),
  c(43, "Gold Owl",       "황금 부엉이",    "owl",    "rare", 43, "부와 지혜의 상징",      "#F57F17","#FFD54F","#FFFFFF"),
  c(44, "Polar Bear",     "북극곰",         "bear",   "rare", 44, "설원의 수호자",         "#E1F5FE","#B3E5FC","#FFD54F"),
  c(45, "Crystal Turtle", "수정 거북이",    "turtle", "rare", 45, "투명한 갑옷",           "#80DEEA","#B2EBF2","#FFFFFF"),
  c(46, "Gold Fox",       "황금 여우",      "fox",    "rare", 46, "행운의 꼬리",           "#F57F17","#FFD54F","#FFFFFF"),
  c(47, "Arctic Wolf",    "북극 늑대",      "wolf",   "rare", 47, "얼음의 군주",           "#E1F5FE","#90CAF9","#FFD54F"),
  c(48, "Pink Robot",     "분홍 로봇",      "robot",  "rare", 48, "귀여운 합금",           "#880E4F","#F48FB1","#FFD54F"),
  c(49, "Crystal Slime",  "수정 슬라임",    "slime",  "rare", 49, "투명한 보석",           "#80DEEA","#E0F7FA","#FFFFFF"),
  c(50, "Baby Dragon",    "아기 용",        "dragon", "rare", 50, "용의 첫 번째 알",       "#558B2F","#8BC34A","#7CB342"),
  // ── Epic (51–70) ──
  c(51, "Blue Cat",       "파란 고양이",    "cat",    "epic", 51, "바다의 정령",           "#0D47A1","#42A5F5","#FFD54F"),
  c(52, "Gold Rabbit",    "황금 토끼",      "rabbit", "epic", 52, "전설 속의 토끼",        "#F57F17","#FFD54F","#FFFFFF"),
  c(53, "Crystal Ghost",  "수정 유령",      "ghost",  "epic", 53, "정화된 영혼",           "#80DEEA","#E0F7FA","#B2EBF2"),
  c(54, "Crystal Plant",  "수정 새싹",      "plant",  "epic", 54, "얼음의 정원",           "#80DEEA","#B2EBF2","#FFD54F"),
  c(55, "Crystal Fish",   "수정 물고기",    "fish",   "epic", 55, "빛 속의 유영",          "#80DEEA","#FFFFFF","#42A5F5"),
  c(56, "Crystal Owl",    "수정 부엉이",    "owl",    "epic", 56, "투명한 지혜",           "#80DEEA","#FFFFFF","#FFD54F"),
  c(57, "Crystal Bear",   "수정 곰",        "bear",   "epic", 57, "빛의 수호자",           "#80DEEA","#B2EBF2","#FF80AB"),
  c(58, "Dragon Turtle",  "드래곤 거북이",  "turtle", "epic", 58, "용의 혈통",             "#2E7D32","#388E3C","#FFD54F"),
  c(59, "Shadow Fox",     "그림자 여우",    "fox",    "epic", 59, "어둠의 사냥꾼",         "#212121","#424242","#9C27B0"),
  c(60, "Fire Wolf",      "불꽃 늑대",      "wolf",   "epic", 60, "화염의 군주",           "#BF360C","#FF5722","#FFD54F"),
  c(61, "Diamond Robot",  "다이아 로봇",    "robot",  "epic", 61, "최강의 기계",           "#4DD0E1","#80DEEA","#FFFFFF"),
  c(62, "Shadow Slime",   "어둠 슬라임",    "slime",  "epic", 62, "밤의 정수",             "#212121","#6A1B9A","#9C27B0"),
  c(63, "Fire Cat",       "불꽃 고양이",    "cat",    "epic", 63, "화염의 야옹이",         "#BF360C","#FF5722","#FFD54F"),
  c(64, "Shadow Rabbit",  "어둠 토끼",      "rabbit", "epic", 64, "달의 그림자",           "#4A148C","#7B1FA2","#CE93D8"),
  c(65, "Flame Ghost",    "불꽃 유령",      "ghost",  "epic", 65, "불꽃 속의 영혼",        "#BF360C","#FF5722","#FFD54F"),
  c(66, "Fire Plant",     "불꽃 새싹",      "plant",  "epic", 66, "화염의 생명",           "#BF360C","#FF5722","#F9A825"),
  c(67, "Lava Fish",      "용암 물고기",    "fish",   "epic", 67, "화산의 영혼",           "#BF360C","#FF5722","#FFD54F"),
  c(68, "Shadow Owl",     "어둠 부엉이",    "owl",    "epic", 68, "밤의 예언자",           "#212121","#6A1B9A","#4DD0E1"),
  c(69, "Fire Bear",      "불꽃 곰",        "bear",   "epic", 69, "화염의 수호자",         "#BF360C","#FF5722","#FFD54F"),
  c(70, "Young Phoenix",  "어린 불사조",    "phoenix","epic", 70, "재생의 시작",           "#DD2C00","#FF6B6B","#FFD93D"),
  // ── Legendary (71–90) ──
  c(71, "Spirit Fox",     "령호 여우",      "fox",    "legendary", 71, "영혼의 수호자",     "#9C27B0","#E040FB","#FFFFFF"),
  c(72, "Spirit Wolf",    "령호 늑대",      "wolf",   "legendary", 72, "영혼의 파수꾼",     "#4A148C","#7B1FA2","#E040FB"),
  c(73, "Spirit Robot",   "령호 로봇",      "robot",  "legendary", 73, "영혼의 기계",       "#4A148C","#7B1FA2","#E040FB"),
  c(74, "Cosmic Slime",   "우주 슬라임",    "slime",  "legendary", 74, "별의 정수",         "#1A237E","#283593","#40C4FF"),
  c(75, "Cosmic Cat",     "우주 고양이",    "cat",    "legendary", 75, "별빛 야옹이",       "#1A237E","#283593","#E040FB"),
  c(76, "Cosmic Rabbit",  "우주 토끼",      "rabbit", "legendary", 76, "은하의 토끼",       "#1A237E","#3949AB","#40C4FF"),
  c(77, "Cosmic Ghost",   "우주 유령",      "ghost",  "legendary", 77, "성운의 정령",       "#1A237E","#283593","#40C4FF"),
  c(78, "Cosmic Plant",   "우주 새싹",      "plant",  "legendary", 78, "별의 생명",         "#1A237E","#283593","#40C4FF"),
  c(79, "Cosmic Fish",    "우주 물고기",    "fish",   "legendary", 79, "성간 여행자",       "#1A237E","#3949AB","#40C4FF"),
  c(80, "Cosmic Owl",     "우주 부엉이",    "owl",    "legendary", 80, "은하의 현자",       "#1A237E","#283593","#E040FB"),
  c(81, "Unicorn",        "유니콘",         "unicorn","legendary", 81, "전설의 뿔",         "#F8F8F8","#FFFFFF","#b7607e"),
  c(82, "Cosmic Bear",    "우주 곰",        "bear",   "legendary", 82, "성운의 수호자",     "#1A237E","#283593","#FF80AB"),
  c(83, "Cosmic Turtle",  "우주 거북이",    "turtle", "legendary", 83, "우주의 등껍질",     "#1A237E","#283593","#40C4FF"),
  c(84, "Storm Dragon",   "폭풍 용",        "dragon", "legendary", 84, "번개를 부르는 용",  "#0D47A1","#1565C0","#FFD54F"),
  c(85, "Cosmic Fox",     "우주 여우",      "fox",    "legendary", 85, "성간 사냥꾼",       "#1A237E","#3949AB","#E040FB"),
  c(86, "Thunder Wolf",   "번개 늑대",      "wolf",   "legendary", 86, "번개의 군주",       "#F57F17","#FFD54F","#212121"),
  c(87, "Cosmic Robot",   "우주 로봇",      "robot",  "legendary", 87, "우주 탐험가",       "#1A237E","#283593","#40C4FF"),
  c(88, "Divine Slime",   "신성 슬라임",    "slime",  "legendary", 88, "신의 젤리",         "#FFD54F","#FFFFFF","#FF80AB"),
  c(89, "Divine Cat",     "신성 고양이",    "cat",    "legendary", 89, "신의 야옹이",       "#FFD54F","#FFF9C4","#FF80AB"),
  c(90, "Sacred Phoenix", "성스러운 불사조","phoenix","legendary", 90, "불멸의 새",         "#E65100","#FF8F00","#FFD54F"),
  // ── Mythic (91–100) ──
  c(91,  "Divine Rabbit",    "신성 토끼",    "rabbit", "mythic", 91,  "달의 신사",         "#FFD54F","#FFFFFF","#FF80AB"),
  c(92,  "Divine Ghost",     "신성 유령",    "ghost",  "mythic", 92,  "천상의 영혼",       "#FFD54F","#FFFDE7","#FFFFFF"),
  c(93,  "World Tree",       "세계수 새싹",  "plant",  "mythic", 93,  "세상의 근원",       "#1B5E20","#2E7D32","#FFD54F"),
  c(94,  "Leviathan",        "리바이어던",   "fish",   "mythic", 94,  "심해의 군주",       "#01579B","#0277BD","#40C4FF"),
  c(95,  "Rainbow Unicorn",  "무지개 유니콘","unicorn","mythic", 95,  "빛의 화신",         "#FF80AB","#CE93D8","#FFD54F"),
  c(96,  "Eternal Dragon",   "영원의 용",    "dragon", "mythic", 96,  "시간을 초월한 용",  "#B71C1C","#C62828","#FFD54F"),
  c(97,  "Ancient Owl",      "고대 부엉이",  "owl",    "mythic", 97,  "시간의 현자",       "#4E342E","#6D4C41","#FFD54F"),
  c(98,  "Ancient Bear",     "고대 곰",      "bear",   "mythic", 98,  "원시의 수호자",     "#1B0000","#3E2723","#FFD54F"),
  c(99,  "Legendary Dragon", "전설의 용",    "dragon", "mythic", 99,  "가장 강력한 용",    "#9C27B0","#AB47BC","#FFD700"),
  c(100, "Mythic Phoenix",   "신화 불사조",  "phoenix","mythic", 100, "신화가 된 새",      "#B71C1C","#FF6B6B","#FFD93D"),
];

export function getCurrentCharacter(level: number): CharacterDef {
  const unlocked = CHARACTERS.filter((ch) => ch.unlockLevel <= level);
  return unlocked.length > 0
    ? unlocked.reduce((best, ch) => ch.unlockLevel > best.unlockLevel ? ch : best)
    : CHARACTERS[0];
}

export function getNextCharacter(level: number): CharacterDef | null {
  const locked = CHARACTERS.filter((ch) => ch.unlockLevel > level);
  return locked.length > 0
    ? locked.reduce((next, ch) => ch.unlockLevel < next.unlockLevel ? ch : next)
    : null;
}
