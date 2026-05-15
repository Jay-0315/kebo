import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const [expenses, posts] = await Promise.all([
      this.prisma.expense.findMany({
        where: { userId },
        select: {
          expenseDate: true,
          sharedToCommunity: true,
        },
      }),
      this.prisma.communityPost.count({
        where: { userId },
      }),
    ]);

    const attendanceDays = new Set(
      expenses.map((expense) => expense.expenseDate.toISOString().slice(0, 10)),
    ).size;
    const sharedExpenses = expenses.filter((expense) => expense.sharedToCommunity).length;
    const missionPoints =
      attendanceDays * 5 + Math.min(expenses.length, 30) * 3 + sharedExpenses * 8 + posts * 5;
    const level = Math.max(1, Math.floor(missionPoints / 120) + 1);

    return {
      attendanceDays,
      missionPoints,
      level,
      nextLevelTarget: level * 120,
      streakDays: Math.min(attendanceDays, 7),
    };
  }
}
