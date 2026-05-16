import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

function calcLevel(missionPoints: number) {
  return Math.max(1, Math.floor(missionPoints / 120) + 1);
}

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    let reward = await this.prisma.userReward.findUnique({ where: { userId } });

    if (!reward) {
      // Auto-calculate from activity and persist
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
        data: {
          userId,
          missionPoints,
          attendanceDays,
          streakDays,
        },
      });
    }

    const level = calcLevel(reward.missionPoints);
    return {
      attendanceDays: reward.attendanceDays,
      missionPoints: reward.missionPoints,
      level,
      nextLevelTarget: level * 120,
      streakDays: reward.streakDays,
      equippedCharacterId: reward.equippedCharacterId,
    };
  }

  async equipCharacter(userId: string, characterId: number) {
    const reward = await this.prisma.userReward.findUnique({ where: { userId } });
    if (!reward) {
      throw new BadRequestException("리워드 데이터가 없습니다. 먼저 요약 조회를 해주세요.");
    }

    const level = calcLevel(reward.missionPoints);
    if (characterId > level) {
      throw new BadRequestException(
        `캐릭터 #${characterId}는 Lv.${characterId} 이상에서 해금됩니다. 현재 레벨: ${level}`,
      );
    }

    const updated = await this.prisma.userReward.update({
      where: { userId },
      data: { equippedCharacterId: characterId },
    });

    return { equippedCharacterId: updated.equippedCharacterId };
  }
}
