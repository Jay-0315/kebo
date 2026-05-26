import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const TITLE_ACHIEVEMENTS: { titleId: number; type: string; value: number }[] = [
  { titleId: 1,  type: "expense_count", value: 1 },
  { titleId: 2,  type: "attendance",    value: 3 },
  { titleId: 3,  type: "points",        value: 100 },
  { titleId: 4,  type: "expense_count", value: 30 },
  { titleId: 5,  type: "attendance",    value: 30 },
  { titleId: 6,  type: "post_count",    value: 5 },
  { titleId: 7,  type: "post_count",    value: 10 },
  { titleId: 8,  type: "expense_count", value: 100 },
  { titleId: 9,  type: "streak",        value: 30 },
  { titleId: 10, type: "points",        value: 2000 },
  { titleId: 11, type: "streak",        value: 50 },
  { titleId: 12, type: "expense_count", value: 500 },
  { titleId: 13, type: "attendance",    value: 180 },
  { titleId: 14, type: "points",        value: 10000 },
  { titleId: 15, type: "post_count",    value: 100 },
  { titleId: 16, type: "expense_count", value: 1000 },
  { titleId: 17, type: "attendance",    value: 365 },
  { titleId: 18, type: "points",        value: 50000 },
  { titleId: 19, type: "streak",        value: 100 },
  { titleId: 20, type: "expense_count", value: 5000 },
];

// Character rarity duplicate point values (mirrors frontend constants)
const RARITY_DUPLICATE_POINTS: Record<string, number> = {
  common: 50,
  uncommon: 100,
  rare: 200,
  epic: 300,
  legendary: 600,
  mythic: 1200,
};

// Gacha pool: characterId → rarity (212 gacha characters)
const GACHA_POOL: { id: number; rarity: string }[] = [
  // ── Block 1 (1-100) ───────────────────────────────────────
  // Common
  { id: 1,  rarity: "common" }, { id: 2,  rarity: "common" }, { id: 3,  rarity: "common" },
  { id: 10, rarity: "common" }, { id: 11, rarity: "common" }, { id: 12, rarity: "common" },
  { id: 13, rarity: "common" }, { id: 14, rarity: "common" }, { id: 15, rarity: "common" },
  // Uncommon
  { id: 23, rarity: "uncommon" }, { id: 24, rarity: "uncommon" }, { id: 25, rarity: "uncommon" },
  { id: 26, rarity: "uncommon" }, { id: 27, rarity: "uncommon" }, { id: 28, rarity: "uncommon" },
  { id: 29, rarity: "uncommon" }, { id: 30, rarity: "uncommon" },
  // Rare
  { id: 41, rarity: "rare" }, { id: 42, rarity: "rare" }, { id: 43, rarity: "rare" },
  { id: 44, rarity: "rare" }, { id: 45, rarity: "rare" }, { id: 46, rarity: "rare" },
  { id: 47, rarity: "rare" }, { id: 48, rarity: "rare" }, { id: 49, rarity: "rare" },
  { id: 50, rarity: "rare" },
  // Epic
  { id: 61, rarity: "epic" }, { id: 62, rarity: "epic" }, { id: 63, rarity: "epic" },
  { id: 64, rarity: "epic" }, { id: 65, rarity: "epic" }, { id: 66, rarity: "epic" },
  { id: 67, rarity: "epic" }, { id: 68, rarity: "epic" }, { id: 69, rarity: "epic" },
  { id: 70, rarity: "epic" },
  // Legendary
  { id: 81, rarity: "legendary" }, { id: 82, rarity: "legendary" }, { id: 83, rarity: "legendary" },
  { id: 84, rarity: "legendary" }, { id: 85, rarity: "legendary" }, { id: 86, rarity: "legendary" },
  { id: 87, rarity: "legendary" }, { id: 88, rarity: "legendary" }, { id: 89, rarity: "legendary" },
  { id: 90, rarity: "legendary" },
  // Mythic
  { id: 95, rarity: "mythic" }, { id: 96, rarity: "mythic" }, { id: 97, rarity: "mythic" },
  { id: 98, rarity: "mythic" }, { id: 99, rarity: "mythic" }, { id: 100, rarity: "mythic" },
  // ── Block 2 (101-200) ─────────────────────────────────────
  // Common
  { id: 101, rarity: "common" }, { id: 102, rarity: "common" }, { id: 103, rarity: "common" },
  { id: 110, rarity: "common" }, { id: 111, rarity: "common" }, { id: 112, rarity: "common" },
  { id: 113, rarity: "common" }, { id: 114, rarity: "common" }, { id: 115, rarity: "common" },
  // Uncommon
  { id: 123, rarity: "uncommon" }, { id: 124, rarity: "uncommon" }, { id: 125, rarity: "uncommon" },
  { id: 126, rarity: "uncommon" }, { id: 127, rarity: "uncommon" }, { id: 128, rarity: "uncommon" },
  { id: 129, rarity: "uncommon" }, { id: 130, rarity: "uncommon" },
  // Rare
  { id: 141, rarity: "rare" }, { id: 142, rarity: "rare" }, { id: 143, rarity: "rare" },
  { id: 144, rarity: "rare" }, { id: 145, rarity: "rare" }, { id: 146, rarity: "rare" },
  { id: 147, rarity: "rare" }, { id: 148, rarity: "rare" }, { id: 149, rarity: "rare" },
  { id: 150, rarity: "rare" },
  // Epic
  { id: 161, rarity: "epic" }, { id: 162, rarity: "epic" }, { id: 163, rarity: "epic" },
  { id: 164, rarity: "epic" }, { id: 165, rarity: "epic" }, { id: 166, rarity: "epic" },
  { id: 167, rarity: "epic" }, { id: 168, rarity: "epic" }, { id: 169, rarity: "epic" },
  { id: 170, rarity: "epic" },
  // Legendary
  { id: 181, rarity: "legendary" }, { id: 182, rarity: "legendary" }, { id: 183, rarity: "legendary" },
  { id: 184, rarity: "legendary" }, { id: 185, rarity: "legendary" }, { id: 186, rarity: "legendary" },
  { id: 187, rarity: "legendary" }, { id: 188, rarity: "legendary" }, { id: 189, rarity: "legendary" },
  { id: 190, rarity: "legendary" },
  // Mythic
  { id: 195, rarity: "mythic" }, { id: 196, rarity: "mythic" }, { id: 197, rarity: "mythic" },
  { id: 198, rarity: "mythic" }, { id: 199, rarity: "mythic" }, { id: 200, rarity: "mythic" },
  // ── Block 3 (201-300) ─────────────────────────────────────
  // Common
  { id: 201, rarity: "common" }, { id: 202, rarity: "common" }, { id: 203, rarity: "common" },
  { id: 210, rarity: "common" }, { id: 211, rarity: "common" }, { id: 212, rarity: "common" },
  { id: 213, rarity: "common" }, { id: 214, rarity: "common" }, { id: 215, rarity: "common" },
  // Uncommon
  { id: 223, rarity: "uncommon" }, { id: 224, rarity: "uncommon" }, { id: 225, rarity: "uncommon" },
  { id: 226, rarity: "uncommon" }, { id: 227, rarity: "uncommon" }, { id: 228, rarity: "uncommon" },
  { id: 229, rarity: "uncommon" }, { id: 230, rarity: "uncommon" },
  // Rare
  { id: 241, rarity: "rare" }, { id: 242, rarity: "rare" }, { id: 243, rarity: "rare" },
  { id: 244, rarity: "rare" }, { id: 245, rarity: "rare" }, { id: 246, rarity: "rare" },
  { id: 247, rarity: "rare" }, { id: 248, rarity: "rare" }, { id: 249, rarity: "rare" },
  { id: 250, rarity: "rare" },
  // Epic
  { id: 261, rarity: "epic" }, { id: 262, rarity: "epic" }, { id: 263, rarity: "epic" },
  { id: 264, rarity: "epic" }, { id: 265, rarity: "epic" }, { id: 266, rarity: "epic" },
  { id: 267, rarity: "epic" }, { id: 268, rarity: "epic" }, { id: 269, rarity: "epic" },
  { id: 270, rarity: "epic" },
  // Legendary
  { id: 281, rarity: "legendary" }, { id: 282, rarity: "legendary" }, { id: 283, rarity: "legendary" },
  { id: 284, rarity: "legendary" }, { id: 285, rarity: "legendary" }, { id: 286, rarity: "legendary" },
  { id: 287, rarity: "legendary" }, { id: 288, rarity: "legendary" }, { id: 289, rarity: "legendary" },
  { id: 290, rarity: "legendary" },
  // Mythic
  { id: 295, rarity: "mythic" }, { id: 296, rarity: "mythic" }, { id: 297, rarity: "mythic" },
  { id: 298, rarity: "mythic" }, { id: 299, rarity: "mythic" }, { id: 300, rarity: "mythic" },
  // ── Block 4 (301-400) ─────────────────────────────────────
  // Common
  { id: 301, rarity: "common" }, { id: 302, rarity: "common" }, { id: 303, rarity: "common" },
  { id: 310, rarity: "common" }, { id: 311, rarity: "common" }, { id: 312, rarity: "common" },
  { id: 313, rarity: "common" }, { id: 314, rarity: "common" }, { id: 315, rarity: "common" },
  // Uncommon
  { id: 323, rarity: "uncommon" }, { id: 324, rarity: "uncommon" }, { id: 325, rarity: "uncommon" },
  { id: 326, rarity: "uncommon" }, { id: 327, rarity: "uncommon" }, { id: 328, rarity: "uncommon" },
  { id: 329, rarity: "uncommon" }, { id: 330, rarity: "uncommon" },
  // Rare
  { id: 341, rarity: "rare" }, { id: 342, rarity: "rare" }, { id: 343, rarity: "rare" },
  { id: 344, rarity: "rare" }, { id: 345, rarity: "rare" }, { id: 346, rarity: "rare" },
  { id: 347, rarity: "rare" }, { id: 348, rarity: "rare" }, { id: 349, rarity: "rare" },
  { id: 350, rarity: "rare" },
  // Epic
  { id: 361, rarity: "epic" }, { id: 362, rarity: "epic" }, { id: 363, rarity: "epic" },
  { id: 364, rarity: "epic" }, { id: 365, rarity: "epic" }, { id: 366, rarity: "epic" },
  { id: 367, rarity: "epic" }, { id: 368, rarity: "epic" }, { id: 369, rarity: "epic" },
  { id: 370, rarity: "epic" },
  // Legendary
  { id: 381, rarity: "legendary" }, { id: 382, rarity: "legendary" }, { id: 383, rarity: "legendary" },
  { id: 384, rarity: "legendary" }, { id: 385, rarity: "legendary" }, { id: 386, rarity: "legendary" },
  { id: 387, rarity: "legendary" }, { id: 388, rarity: "legendary" }, { id: 389, rarity: "legendary" },
  { id: 390, rarity: "legendary" },
  // Mythic
  { id: 395, rarity: "mythic" }, { id: 396, rarity: "mythic" }, { id: 397, rarity: "mythic" },
  { id: 398, rarity: "mythic" }, { id: 399, rarity: "mythic" }, { id: 400, rarity: "mythic" },
];

// Gacha rates (sum = 100)
const GACHA_RATES: Record<string, number> = {
  common: 35, uncommon: 26, rare: 20, epic: 10, legendary: 6, mythic: 3,
};

const GACHA_COST_SINGLE = 120;
const GACHA_COST_TEN = 1200;
const STARTER_IDS = [1, 2, 3];

// Achievement definitions: which stat value unlocks which character
const ACHIEVEMENTS: { characterId: number; type: string; value: number }[] = [
  // ── Block 1 (1-100) ───────────────────────────────────────
  { characterId: 4,  type: "expense_count", value: 1 },
  { characterId: 5,  type: "attendance",    value: 3 },
  { characterId: 6,  type: "post_count",    value: 2 },
  { characterId: 7,  type: "expense_count", value: 5 },
  { characterId: 8,  type: "attendance",    value: 7 },
  { characterId: 9,  type: "post_count",    value: 1 },
  { characterId: 16, type: "expense_count", value: 10 },
  { characterId: 17, type: "streak",        value: 3 },
  { characterId: 18, type: "points",        value: 100 },
  { characterId: 19, type: "post_count",    value: 3 },
  { characterId: 20, type: "expense_count", value: 2 },
  { characterId: 21, type: "attendance",    value: 14 },
  { characterId: 22, type: "expense_count", value: 20 },
  { characterId: 31, type: "expense_count", value: 30 },
  { characterId: 32, type: "attendance",    value: 21 },
  { characterId: 33, type: "points",        value: 200 },
  { characterId: 34, type: "attendance",    value: 30 },
  { characterId: 35, type: "streak",        value: 7 },
  { characterId: 36, type: "post_count",    value: 10 },
  { characterId: 37, type: "expense_count", value: 50 },
  { characterId: 38, type: "points",        value: 500 },
  { characterId: 39, type: "streak",        value: 14 },
  { characterId: 40, type: "streak",        value: 21 },
  { characterId: 51, type: "points",        value: 1000 },
  { characterId: 52, type: "expense_count", value: 100 },
  { characterId: 53, type: "attendance",    value: 50 },
  { characterId: 54, type: "post_count",    value: 20 },
  { characterId: 55, type: "post_count",    value: 30 },
  { characterId: 56, type: "streak",        value: 30 },
  { characterId: 57, type: "points",        value: 2000 },
  { characterId: 58, type: "expense_count", value: 200 },
  { characterId: 59, type: "attendance",    value: 90 },
  { characterId: 60, type: "expense_count", value: 150 },
  { characterId: 71, type: "points",        value: 5000 },
  { characterId: 72, type: "expense_count", value: 500 },
  { characterId: 73, type: "attendance",    value: 180 },
  { characterId: 74, type: "streak",        value: 60 },
  { characterId: 75, type: "post_count",    value: 50 },
  { characterId: 76, type: "post_count",    value: 100 },
  { characterId: 77, type: "points",        value: 10000 },
  { characterId: 78, type: "expense_count", value: 1000 },
  { characterId: 79, type: "attendance",    value: 365 },
  { characterId: 80, type: "streak",        value: 100 },
  { characterId: 91, type: "points",        value: 50000 },
  { characterId: 92, type: "expense_count", value: 2000 },
  { characterId: 93, type: "expense_count", value: 5000 },
  { characterId: 94, type: "streak",        value: 365 },
  // ── Block 2 (101-200) ─────────────────────────────────────
  { characterId: 104, type: "expense_count", value: 3 },
  { characterId: 105, type: "attendance",    value: 5 },
  { characterId: 106, type: "post_count",    value: 5 },
  { characterId: 107, type: "expense_count", value: 7 },
  { characterId: 108, type: "attendance",    value: 10 },
  { characterId: 109, type: "streak",        value: 5 },
  { characterId: 116, type: "expense_count", value: 15 },
  { characterId: 117, type: "streak",        value: 10 },
  { characterId: 118, type: "points",        value: 150 },
  { characterId: 119, type: "post_count",    value: 7 },
  { characterId: 120, type: "expense_count", value: 25 },
  { characterId: 121, type: "attendance",    value: 28 },
  { characterId: 122, type: "expense_count", value: 40 },
  { characterId: 131, type: "expense_count", value: 60 },
  { characterId: 132, type: "attendance",    value: 42 },
  { characterId: 133, type: "points",        value: 300 },
  { characterId: 134, type: "attendance",    value: 60 },
  { characterId: 135, type: "streak",        value: 28 },
  { characterId: 136, type: "post_count",    value: 15 },
  { characterId: 137, type: "expense_count", value: 75 },
  { characterId: 138, type: "points",        value: 750 },
  { characterId: 139, type: "streak",        value: 45 },
  { characterId: 140, type: "streak",        value: 50 },
  { characterId: 151, type: "points",        value: 1500 },
  { characterId: 152, type: "expense_count", value: 120 },
  { characterId: 153, type: "attendance",    value: 75 },
  { characterId: 154, type: "post_count",    value: 25 },
  { characterId: 155, type: "post_count",    value: 40 },
  { characterId: 156, type: "streak",        value: 35 },
  { characterId: 157, type: "points",        value: 2500 },
  { characterId: 158, type: "expense_count", value: 250 },
  { characterId: 159, type: "attendance",    value: 120 },
  { characterId: 160, type: "expense_count", value: 175 },
  { characterId: 171, type: "points",        value: 7500 },
  { characterId: 172, type: "expense_count", value: 750 },
  { characterId: 173, type: "attendance",    value: 270 },
  { characterId: 174, type: "streak",        value: 75 },
  { characterId: 175, type: "post_count",    value: 60 },
  { characterId: 176, type: "post_count",    value: 120 },
  { characterId: 177, type: "points",        value: 15000 },
  { characterId: 178, type: "expense_count", value: 1500 },
  { characterId: 179, type: "attendance",    value: 400 },
  { characterId: 180, type: "streak",        value: 120 },
  { characterId: 191, type: "points",        value: 75000 },
  { characterId: 192, type: "expense_count", value: 3000 },
  { characterId: 193, type: "expense_count", value: 7500 },
  { characterId: 194, type: "streak",        value: 400 },
  // ── Block 3 (201-300) ─────────────────────────────────────
  { characterId: 204, type: "expense_count", value: 4 },
  { characterId: 205, type: "attendance",    value: 6 },
  { characterId: 206, type: "post_count",    value: 6 },
  { characterId: 207, type: "expense_count", value: 9 },
  { characterId: 208, type: "attendance",    value: 12 },
  { characterId: 209, type: "streak",        value: 6 },
  { characterId: 216, type: "expense_count", value: 18 },
  { characterId: 217, type: "streak",        value: 12 },
  { characterId: 218, type: "points",        value: 250 },
  { characterId: 219, type: "post_count",    value: 8 },
  { characterId: 220, type: "expense_count", value: 35 },
  { characterId: 221, type: "attendance",    value: 35 },
  { characterId: 222, type: "expense_count", value: 55 },
  { characterId: 231, type: "expense_count", value: 70 },
  { characterId: 232, type: "attendance",    value: 45 },
  { characterId: 233, type: "points",        value: 400 },
  { characterId: 234, type: "attendance",    value: 55 },
  { characterId: 235, type: "streak",        value: 15 },
  { characterId: 236, type: "post_count",    value: 18 },
  { characterId: 237, type: "expense_count", value: 80 },
  { characterId: 238, type: "points",        value: 900 },
  { characterId: 239, type: "streak",        value: 42 },
  { characterId: 240, type: "streak",        value: 55 },
  { characterId: 251, type: "points",        value: 1750 },
  { characterId: 252, type: "expense_count", value: 130 },
  { characterId: 253, type: "attendance",    value: 80 },
  { characterId: 254, type: "post_count",    value: 28 },
  { characterId: 255, type: "post_count",    value: 45 },
  { characterId: 256, type: "streak",        value: 40 },
  { characterId: 257, type: "points",        value: 3000 },
  { characterId: 258, type: "expense_count", value: 300 },
  { characterId: 259, type: "attendance",    value: 135 },
  { characterId: 260, type: "expense_count", value: 225 },
  { characterId: 271, type: "points",        value: 12500 },
  { characterId: 272, type: "expense_count", value: 1250 },
  { characterId: 273, type: "attendance",    value: 300 },
  { characterId: 274, type: "streak",        value: 80 },
  { characterId: 275, type: "post_count",    value: 75 },
  { characterId: 276, type: "post_count",    value: 150 },
  { characterId: 277, type: "points",        value: 20000 },
  { characterId: 278, type: "expense_count", value: 2500 },
  { characterId: 279, type: "attendance",    value: 450 },
  { characterId: 280, type: "streak",        value: 150 },
  { characterId: 291, type: "points",        value: 100000 },
  { characterId: 292, type: "expense_count", value: 4000 },
  { characterId: 293, type: "expense_count", value: 10000 },
  { characterId: 294, type: "streak",        value: 450 },
  // ── Block 4 (301-400) ─────────────────────────────────────
  { characterId: 304, type: "expense_count", value: 6 },
  { characterId: 305, type: "attendance",    value: 9 },
  { characterId: 306, type: "post_count",    value: 9 },
  { characterId: 307, type: "expense_count", value: 11 },
  { characterId: 308, type: "attendance",    value: 16 },
  { characterId: 309, type: "streak",        value: 8 },
  { characterId: 316, type: "expense_count", value: 22 },
  { characterId: 317, type: "streak",        value: 16 },
  { characterId: 318, type: "points",        value: 350 },
  { characterId: 319, type: "post_count",    value: 12 },
  { characterId: 320, type: "expense_count", value: 45 },
  { characterId: 321, type: "attendance",    value: 38 },
  { characterId: 322, type: "expense_count", value: 65 },
  { characterId: 331, type: "expense_count", value: 85 },
  { characterId: 332, type: "attendance",    value: 50 },
  { characterId: 333, type: "points",        value: 450 },
  { characterId: 334, type: "attendance",    value: 65 },
  { characterId: 335, type: "streak",        value: 18 },
  { characterId: 336, type: "post_count",    value: 22 },
  { characterId: 337, type: "expense_count", value: 95 },
  { characterId: 338, type: "points",        value: 800 },
  { characterId: 339, type: "streak",        value: 48 },
  { characterId: 340, type: "streak",        value: 58 },
  { characterId: 351, type: "points",        value: 2250 },
  { characterId: 352, type: "expense_count", value: 160 },
  { characterId: 353, type: "attendance",    value: 90 },
  { characterId: 354, type: "post_count",    value: 32 },
  { characterId: 355, type: "post_count",    value: 48 },
  { characterId: 356, type: "streak",        value: 42 },
  { characterId: 357, type: "points",        value: 3500 },
  { characterId: 358, type: "expense_count", value: 350 },
  { characterId: 359, type: "attendance",    value: 160 },
  { characterId: 360, type: "expense_count", value: 275 },
  { characterId: 371, type: "points",        value: 17500 },
  { characterId: 372, type: "expense_count", value: 1750 },
  { characterId: 373, type: "attendance",    value: 330 },
  { characterId: 374, type: "streak",        value: 110 },
  { characterId: 375, type: "post_count",    value: 80 },
  { characterId: 376, type: "post_count",    value: 175 },
  { characterId: 377, type: "points",        value: 30000 },
  { characterId: 378, type: "expense_count", value: 3500 },
  { characterId: 379, type: "attendance",    value: 500 },
  { characterId: 380, type: "streak",        value: 180 },
  { characterId: 391, type: "points",        value: 125000 },
  { characterId: 392, type: "expense_count", value: 5500 },
  { characterId: 393, type: "expense_count", value: 12500 },
  { characterId: 394, type: "streak",        value: 500 },
];

function pickGachaRarity(forceRareOrAbove = false, forceLegendaryOrAbove = false): string {
  if (forceLegendaryOrAbove) {
    return weightedRandom({ legendary: 70, mythic: 30 });
  }
  if (forceRareOrAbove) {
    return weightedRandom({ rare: 65, epic: 20, legendary: 10, mythic: 5 });
  }
  return weightedRandom(GACHA_RATES);
}

function weightedRandom(weights: Record<string, number>): string {
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  let rand = Math.random() * total;
  for (const [key, weight] of Object.entries(weights)) {
    rand -= weight;
    if (rand <= 0) return key;
  }
  return Object.keys(weights)[Object.keys(weights).length - 1];
}

function pickFromPool(rarity: string): { id: number; rarity: string } {
  const pool = GACHA_POOL.filter((c) => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateReward(userId: string) {
    let reward = await this.prisma.userReward.findUnique({ where: { userId } });
    if (!reward) {
      const [expenses, posts] = await Promise.all([
        this.prisma.expense.findMany({
          where: { userId },
          select: { expenseDate: true, sharedToCommunity: true },
        }),
        this.prisma.communityPost.count({ where: { userId } }),
      ]);

      const attendanceDays = new Set(
        expenses.map((e) => e.expenseDate.toISOString().slice(0, 10)),
      ).size;
      const shared = expenses.filter((e) => e.sharedToCommunity).length;
      const missionPoints =
        attendanceDays * 50 + Math.min(expenses.length, 30) * 30 + shared * 80 + posts * 50;
      const streakDays = Math.min(attendanceDays, 7);

      reward = await this.prisma.userReward.create({
        data: { userId, missionPoints, attendanceDays, streakDays },
      });
    }
    return reward;
  }

  async getSummary(userId: string) {
    const reward = await this.getOrCreateReward(userId);

    const ownedChars = await this.prisma.userCharacter.findMany({
      where: { userId },
      select: { characterId: true },
    });

    const ownedTitles = await this.prisma.userTitle.findMany({
      where: { userId },
      select: { titleId: true },
    });

    return {
      attendanceDays: reward.attendanceDays,
      missionPoints: reward.missionPoints,
      streakDays: reward.streakDays,
      equippedCharacterId: reward.equippedCharacterId,
      equippedTitleId: reward.equippedTitleId,
      ownedCharacterIds: ownedChars.map((c) => c.characterId),
      ownedTitleIds: ownedTitles.map((t) => t.titleId),
      gachaPityCount: reward.gachaPityCount,
      legendaryPityCount: reward.legendaryPityCount,
      totalPointsUsed: reward.totalPointsUsed,
    };
  }

  async selectStarter(userId: string, characterId: number) {
    if (!STARTER_IDS.includes(characterId)) {
      throw new BadRequestException("유효한 스타팅 캐릭터가 아닙니다.");
    }

    const alreadyOwnsStarter = await this.prisma.userCharacter.findFirst({
      where: { userId, characterId: { in: STARTER_IDS } },
    });
    if (alreadyOwnsStarter) {
      throw new BadRequestException("이미 스타팅 캐릭터를 선택했습니다.");
    }

    await this.prisma.$transaction([
      this.prisma.userCharacter.create({ data: { userId, characterId } }),
      this.prisma.userReward.upsert({
        where: { userId },
        create: { userId, equippedCharacterId: characterId },
        update: { equippedCharacterId: characterId },
      }),
    ]);

    return { characterId };
  }

  async equipCharacter(userId: string, characterId: number) {
    const owned = await this.prisma.userCharacter.findUnique({
      where: { userId_characterId: { userId, characterId } },
    });
    if (!owned) {
      throw new BadRequestException(
        `캐릭터 #${characterId}를 보유하고 있지 않습니다.`,
      );
    }

    const updated = await this.prisma.userReward.update({
      where: { userId },
      data: { equippedCharacterId: characterId },
    });

    return { equippedCharacterId: updated.equippedCharacterId };
  }

  async performGacha(userId: string, count: 1 | 10) {
    const cost = count === 10 ? GACHA_COST_TEN : GACHA_COST_SINGLE;
    const reward = await this.getOrCreateReward(userId);

    if (reward.missionPoints < cost) {
      throw new BadRequestException(
        `포인트가 부족합니다. 필요: ${cost}P, 보유: ${reward.missionPoints}P`,
      );
    }

    // Load already-owned characters to detect duplicates
    const owned = await this.prisma.userCharacter.findMany({
      where: { userId },
      select: { characterId: true },
    });
    const ownedSet = new Set(owned.map((c) => c.characterId));

    const results: { characterId: number; rarity: string; isDuplicate: boolean; bonusPoints: number }[] = [];
    let totalBonusPoints = 0;
    let pity = reward.gachaPityCount;         // rare+ 보장 카운터 (consecutive non-rare)
    let legendaryPity = reward.legendaryPityCount; // 천장 카운터 (80연 레전더리+ 보장)

    for (let i = 0; i < count; i++) {
      const isLastInTen = count === 10 && i === 9;
      const hasRarePlus = results.some((r) =>
        ["rare", "epic", "legendary", "mythic"].includes(r.rarity),
      );
      // 10연: 마지막 자리에서 레어+ 없으면 강제 / 단일: 누적 pity 9 이상이면 다음 뽑기에서 강제
      const forceRare = (isLastInTen && !hasRarePlus) || (count === 1 && pity >= 9);
      // 천장: 79회 누적 시 다음(80번째) 레전더리+ 확정
      const forceLegendary = legendaryPity >= 79;

      const rarity = pickGachaRarity(forceRare, forceLegendary);
      const char = pickFromPool(rarity);
      const isDuplicate = ownedSet.has(char.id);
      const bonusPoints = isDuplicate ? (RARITY_DUPLICATE_POINTS[rarity] ?? 0) : 0;

      results.push({ characterId: char.id, rarity, isDuplicate, bonusPoints });
      totalBonusPoints += bonusPoints;

      if (!isDuplicate) ownedSet.add(char.id);

      if (["legendary", "mythic"].includes(rarity)) {
        pity = 0;
        legendaryPity = 0; // 천장 리셋
      } else if (["rare", "epic"].includes(rarity)) {
        pity = 0;
        legendaryPity += 1;
      } else {
        pity += 1;
        legendaryPity += 1;
      }
    }

    // Persist new characters and point changes in a transaction
    const newChars = results.filter((r) => !r.isDuplicate);
    await this.prisma.$transaction([
      this.prisma.userReward.update({
        where: { userId },
        data: {
          missionPoints: reward.missionPoints - cost + totalBonusPoints,
          gachaPityCount: pity,
          legendaryPityCount: legendaryPity,
          totalPointsUsed: { increment: cost },
        },
      }),
      ...newChars.map((r) =>
        this.prisma.userCharacter.create({
          data: { userId, characterId: r.characterId },
        }),
      ),
    ]);

    return {
      results,
      pointsSpent: cost,
      bonusPoints: totalBonusPoints,
      remainingPoints: reward.missionPoints - cost + totalBonusPoints,
      gachaPityCount: pity,
      legendaryPityCount: legendaryPity,
    };
  }

  async equipTitle(userId: string, titleId: number) {
    const owned = await this.prisma.userTitle.findUnique({
      where: { userId_titleId: { userId, titleId } },
    });
    if (!owned) {
      throw new BadRequestException(`칭호 #${titleId}를 보유하고 있지 않습니다.`);
    }
    const updated = await this.prisma.userReward.update({
      where: { userId },
      data: { equippedTitleId: titleId },
    });
    return { equippedTitleId: updated.equippedTitleId };
  }

  async unequipTitle(userId: string) {
    const updated = await this.prisma.userReward.update({
      where: { userId },
      data: { equippedTitleId: null },
    });
    return { equippedTitleId: updated.equippedTitleId };
  }

  async checkAndGrantTitles(userId: string) {
    const reward = await this.getOrCreateReward(userId);
    const [expenseCount, postCount] = await Promise.all([
      this.prisma.expense.count({ where: { userId } }),
      this.prisma.communityPost.count({ where: { userId } }),
    ]);

    const stats: Record<string, number> = {
      expense_count: expenseCount,
      post_count: postCount,
      attendance: reward.attendanceDays,
      streak: reward.streakDays,
      points: reward.totalPointsUsed,
    };

    const ownedTitles = await this.prisma.userTitle.findMany({
      where: { userId },
      select: { titleId: true },
    });
    const ownedSet = new Set(ownedTitles.map((t) => t.titleId));

    const newlyUnlocked: number[] = [];
    for (const ach of TITLE_ACHIEVEMENTS) {
      if (!ownedSet.has(ach.titleId) && (stats[ach.type] ?? 0) >= ach.value) {
        newlyUnlocked.push(ach.titleId);
      }
    }

    if (newlyUnlocked.length > 0) {
      await this.prisma.$transaction(
        newlyUnlocked.map((titleId) =>
          this.prisma.userTitle.upsert({
            where: { userId_titleId: { userId, titleId } },
            create: { userId, titleId },
            update: {},
          }),
        ),
      );
    }

    return { newlyUnlocked };
  }

  // ── 활동 보상 트리거 ───────────────────────────────────────

  private dateDiff(newer: string, older: string): number {
    return Math.round(
      (new Date(newer).getTime() - new Date(older).getTime()) / 86_400_000,
    );
  }

  private calcStreak(sortedUniqueDates: string[], today: string): number {
    if (sortedUniqueDates.length === 0) return 0;
    const last = sortedUniqueDates[sortedUniqueDates.length - 1];
    if (this.dateDiff(today, last) > 1) return 0;
    let streak = 1;
    for (let i = sortedUniqueDates.length - 1; i > 0; i--) {
      if (this.dateDiff(sortedUniqueDates[i], sortedUniqueDates[i - 1]) === 1) streak++;
      else break;
    }
    return streak;
  }

  async onExpenseCreated(userId: string, expenseDate: string, isGroupExpense: boolean) {
    const reward = await this.getOrCreateReward(userId);

    const today = new Date().toISOString().slice(0, 10);

    const expenses = await this.prisma.expense.findMany({
      where: { userId },
      select: { expenseDate: true, groupId: true },
      orderBy: { expenseDate: "asc" },
    });

    const uniqueDates = [
      ...new Set(expenses.map((e) => e.expenseDate.toISOString().slice(0, 10))),
    ].sort();
    const attendanceDays = uniqueDates.length;
    const streakDays = this.calcStreak(uniqueDates, today);

    let pointsDelta = 0;
    if (attendanceDays > reward.attendanceDays) pointsDelta += 50; // 새 출석일 +50P
    if (streakDays > reward.streakDays && streakDays > 1) pointsDelta += 20; // 연속 출석 +20P

    // 그룹 지출 기록: 건당 50P, 하루 최대 3회
    if (isGroupExpense) {
      const todayGroupCount = expenses.filter(
        (e) => e.groupId && e.expenseDate.toISOString().slice(0, 10) === today,
      ).length;
      if (todayGroupCount <= 3) pointsDelta += 50;
    }

    await this.prisma.userReward.update({
      where: { userId },
      data: {
        attendanceDays,
        streakDays,
        ...(pointsDelta > 0 ? { missionPoints: { increment: pointsDelta } } : {}),
      },
    });
  }

  async onPostCreated(userId: string) {
    await this.getOrCreateReward(userId);
    await this.prisma.userReward.update({
      where: { userId },
      data: { missionPoints: { increment: 50 } },
    });
  }

  async checkAndGrantAchievements(userId: string) {
    const reward = await this.getOrCreateReward(userId);

    const [expenseCount, postCount] = await Promise.all([
      this.prisma.expense.count({ where: { userId } }),
      this.prisma.communityPost.count({ where: { userId } }),
    ]);

    const stats: Record<string, number> = {
      expense_count: expenseCount,
      post_count: postCount,
      attendance: reward.attendanceDays,
      streak: reward.streakDays,
      points: reward.totalPointsUsed,
    };

    const owned = await this.prisma.userCharacter.findMany({
      where: { userId },
      select: { characterId: true },
    });
    const ownedSet = new Set(owned.map((c) => c.characterId));

    const newlyUnlocked: number[] = [];
    for (const ach of ACHIEVEMENTS) {
      if (!ownedSet.has(ach.characterId) && (stats[ach.type] ?? 0) >= ach.value) {
        newlyUnlocked.push(ach.characterId);
      }
    }

    if (newlyUnlocked.length > 0) {
      await this.prisma.$transaction(
        newlyUnlocked.map((characterId) =>
          this.prisma.userCharacter.upsert({
            where: { userId_characterId: { userId, characterId } },
            create: { userId, characterId },
            update: {},
          }),
        ),
      );
    }

    return { newlyUnlocked };
  }
}
