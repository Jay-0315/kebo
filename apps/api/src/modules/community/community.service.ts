import { Injectable } from "@nestjs/common";
import { CurrencyCode } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommunityPostDto } from "./dto/create-community-post.dto";
import { UpdateCommunityPostDto } from "./dto/update-community-post.dto";

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId?: string) {
    return this.prisma.communityPost.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: true,
        sharedExpenses: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  create(dto: CreateCommunityPostDto) {
    return this.prisma.communityPost.create({
      data: {
        userId: dto.userId,
        content: dto.content,
        sharedExpenses: dto.sharedExpenses
          ? {
              create: dto.sharedExpenses.map((expense) => ({
                expense: { connect: { id: expense.expenseId } },
                category: expense.category,
                memo: expense.memo,
                expenseDate: new Date(expense.expenseDate),
                spentAmount: expense.spentAmount,
                spentCurrency: expense.spentCurrency as CurrencyCode,
                baseAmount: expense.baseAmount,
                baseCurrency: expense.baseCurrency as CurrencyCode,
                exchangeRate: expense.exchangeRate,
                countryCode: expense.countryCode,
              })),
            }
          : undefined,
      },
      include: {
        user: true,
        sharedExpenses: true,
      },
    });
  }

  async update(id: string, dto: UpdateCommunityPostDto) {
    if (dto.sharedExpenses) {
      await this.prisma.communityPostExpense.deleteMany({
        where: { postId: id },
      });
    }

    return this.prisma.communityPost.update({
      where: { id },
      data: {
        ...(dto.content ? { content: dto.content } : {}),
        ...(dto.sharedExpenses
          ? {
              sharedExpenses: {
                create: dto.sharedExpenses.map((expense) => ({
                  expense: { connect: { id: expense.expenseId } },
                  category: expense.category,
                  memo: expense.memo,
                  expenseDate: new Date(expense.expenseDate),
                  spentAmount: expense.spentAmount,
                  spentCurrency: expense.spentCurrency as CurrencyCode,
                  baseAmount: expense.baseAmount,
                  baseCurrency: expense.baseCurrency as CurrencyCode,
                  exchangeRate: expense.exchangeRate,
                  countryCode: expense.countryCode,
                })),
              },
            }
          : {}),
      },
      include: {
        user: true,
        sharedExpenses: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.communityPost.delete({
      where: { id },
    });
  }

  async toggleLike(id: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    return this.prisma.communityPost.update({
      where: { id },
      data: {
        likesCount: post.likesCount + 1,
      },
      include: {
        user: true,
        sharedExpenses: true,
      },
    });
  }
}
