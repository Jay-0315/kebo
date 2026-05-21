import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// Title definitions (mirrors frontend data/titles.ts)
const TITLE_ACHIEVEMENTS: { titleId: number; type: string; value: number }[] = [
  { titleId: 1,  type: "expense_count", value: 1 },
  { titleId: 2,  type: "attendance",    value: 3 },
  { titleId: 3,  type: "points",        value: 100 },
  { titleId: 4,  type: "expense_count", value: 30 },
  { titleId: 5,  type: "attendance",    value: 30 },
  { titleId: 6,  type: "share_count",   value: 10 },
  { titleId: 7,  type: "post_count",    value: 10 },
  { titleId: 8,  type: "expense_count", value: 100 },
  { titleId: 9,  type: "streak",        value: 30 },
  { titleId: 10, type: "points",        value: 2000 },
  { titleId: 11, type: "share_count",   value: 50 },
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
  common: 5,
  uncommon: 10,
  rare: 20,
  epic: 30,
  legendary: 60,
  mythic: 120,
};

// Gacha pool: characterId → rarity (50 gacha characters)
const GACHA_POOL: { id: number; rarity: string }[] = [
  // Common
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
];

// Gacha rates (sum = 100)
const GACHA_RATES: Record<string, number> = {
  common: 45, uncommon: 30, rare: 15, epic: 6, legendary: 3, mythic: 1,
};

const GACHA_COST_SINGLE = 120;
const GACHA_COST_TEN = 1200;
const STARTER_IDS = [1, 2, 3];

// Achievement definitions: which stat value unlocks which character
const ACHIEVEMENTS: { characterId: number; type: string; value: number }[] = [
  { characterId: 4,  type: "expense_count", value: 1 },
  { characterId: 5,  type: "attendance",    value: 3 },
  { characterId: 6,  type: "share_count",   value: 1 },
  { characterId: 7,  type: "expense_count", value: 5 },
  { characterId: 8,  type: "attendance",    value: 7 },
  { characterId: 9,  type: "post_count",    value: 1 },
  { characterId: 16, type: "expense_count", value: 10 },
  { characterId: 17, type: "streak",        value: 3 },
  { characterId: 18, type: "points",        value: 100 },
  { characterId: 19, type: "post_count",    value: 3 },
  { characterId: 20, type: "share_count",   value: 3 },
  { characterId: 21, type: "attendance",    value: 14 },
  { characterId: 22, type: "expense_count", value: 20 },
  { characterId: 31, type: "expense_count", value: 30 },
  { characterId: 32, type: "share_count",   value: 10 },
  { characterId: 33, type: "points",        value: 200 },
  { characterId: 34, type: "attendance",    value: 30 },
  { characterId: 35, type: "streak",        value: 7 },
  { characterId: 36, type: "post_count",    value: 10 },
  { characterId: 37, type: "expense_count", value: 50 },
  { characterId: 38, type: "points",        value: 500 },
  { characterId: 39, type: "streak",        value: 14 },
  { characterId: 40, type: "share_count",   value: 20 },
  { characterId: 51, type: "points",        value: 1000 },
  { characterId: 52, type: "expense_count", value: 100 },
  { characterId: 53, type: "attendance",    value: 50 },
  { characterId: 54, type: "share_count",   value: 30 },
  { characterId: 55, type: "post_count",    value: 30 },
  { characterId: 56, type: "streak",        value: 30 },
  { characterId: 57, type: "points",        value: 2000 },
  { characterId: 58, type: "expense_count", value: 200 },
  { characterId: 59, type: "attendance",    value: 90 },
  { characterId: 60, type: "share_count",   value: 50 },
  { characterId: 71, type: "points",        value: 5000 },
  { characterId: 72, type: "expense_count", value: 500 },
  { characterId: 73, type: "attendance",    value: 180 },
  { characterId: 74, type: "streak",        value: 60 },
  { characterId: 75, type: "share_count",   value: 100 },
  { characterId: 76, type: "post_count",    value: 100 },
  { characterId: 77, type: "points",        value: 10000 },
  { characterId: 78, type: "expense_count", value: 1000 },
  { characterId: 79, type: "attendance",    value: 365 },
  { characterId: 80, type: "streak",        value: 100 },
  { characterId: 91, type: "points",        value: 50000 },
  { characterId: 92, type: "share_count",   value: 500 },
  { characterId: 93, type: "expense_count", value: 5000 },
  { characterId: 94, type: "streak",        value: 365 },
];

function pickGachaRarity(forceRareOrAbove = false): string {
  if (forceRareOrAbove) {
    const rarePool = { rare: 75, epic: 15, legendary: 8, mythic: 2 };
    return weightedRandom(rarePool);
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
        attendanceDays * 5 + Math.min(expenses.length, 30) * 3 + shared * 8 + posts * 5;
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
      this.prisma.userReward.update({
        where: { userId },
        data: { equippedCharacterId: characterId },
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
    let pity = reward.gachaPityCount;

    for (let i = 0; i < count; i++) {
      const isLastInTen = count === 10 && i === 9;
      // Force rare+ on 10th pull if no rare+ appeared yet
      const hasRarePlus = results.some((r) =>
        ["rare", "epic", "legendary", "mythic"].includes(r.rarity),
      );
      const forceRare = isLastInTen && !hasRarePlus;

      const rarity = pickGachaRarity(forceRare);
      const char = pickFromPool(rarity);
      const isDuplicate = ownedSet.has(char.id);
      const bonusPoints = isDuplicate ? (RARITY_DUPLICATE_POINTS[rarity] ?? 0) : 0;

      results.push({ characterId: char.id, rarity, isDuplicate, bonusPoints });
      totalBonusPoints += bonusPoints;

      if (!isDuplicate) ownedSet.add(char.id);
      if (["rare", "epic", "legendary", "mythic"].includes(rarity)) {
        pity = 0;
      } else {
        pity += 1;
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
    const [expenseCount, shareCount, postCount] = await Promise.all([
      this.prisma.expense.count({ where: { userId } }),
      this.prisma.expense.count({ where: { userId, sharedToCommunity: true } }),
      this.prisma.communityPost.count({ where: { userId } }),
    ]);

    const stats: Record<string, number> = {
      expense_count: expenseCount,
      share_count: shareCount,
      post_count: postCount,
      attendance: reward.attendanceDays,
      streak: reward.streakDays,
      points: reward.missionPoints,
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

  async checkAndGrantAchievements(userId: string) {
    const reward = await this.getOrCreateReward(userId);

    const [expenseCount, shareCount, postCount] = await Promise.all([
      this.prisma.expense.count({ where: { userId } }),
      this.prisma.expense.count({ where: { userId, sharedToCommunity: true } }),
      this.prisma.communityPost.count({ where: { userId } }),
    ]);

    const stats: Record<string, number> = {
      expense_count: expenseCount,
      share_count: shareCount,
      post_count: postCount,
      attendance: reward.attendanceDays,
      streak: reward.streakDays,
      points: reward.missionPoints,
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
