import { Injectable, NotFoundException } from "@nestjs/common";
import { CurrencyCode } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { convertCurrency, getExchangeRate } from "../shared/exchange-rate.util";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { UpdateUserSettingsDto } from "./dto/update-user-settings.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      baseCountryCode: user.baseCountryCode,
      baseCurrency: user.baseCurrency,
      profilePhoto: user.profilePhoto ?? null,
      settings: user.settings ?? {
        notifications: true,
        darkMode: true,
        autoBackup: false,
      },
    };
  }

  async updateProfilePhoto(userId: string, photo: string | null) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("사용자를 찾을 수 없습니다.");
    await this.prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: photo },
    });
    return { success: true };
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    const current = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!current) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    const nextBaseCurrency = dto.baseCurrency ?? current.baseCurrency;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.baseCountryCode ? { baseCountryCode: dto.baseCountryCode } : {}),
        ...(dto.baseCurrency ? { baseCurrency: dto.baseCurrency as CurrencyCode } : {}),
      },
    });

    if (dto.baseCurrency && dto.baseCurrency !== current.baseCurrency) {
      const expenses = await this.prisma.expense.findMany({
        where: { userId },
      });

      await Promise.all(
        expenses.map((expense) =>
          this.prisma.expense.update({
            where: { id: expense.id },
            data: {
              baseCurrency: nextBaseCurrency as CurrencyCode,
              exchangeRate: getExchangeRate(String(expense.spentCurrency), String(nextBaseCurrency)),
              baseAmount: convertCurrency(
                Number(expense.spentAmount),
                String(expense.spentCurrency),
                nextBaseCurrency,
              ),
            },
          }),
        ),
      );
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      baseCountryCode: user.baseCountryCode,
      baseCurrency: user.baseCurrency,
    };
  }

  async updateSettings(userId: string, dto: UpdateUserSettingsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    return this.prisma.appSetting.upsert({
      where: { userId },
      create: {
        userId,
        notifications: dto.notifications ?? true,
        darkMode: dto.darkMode ?? true,
        autoBackup: dto.autoBackup ?? false,
      },
      update: {
        ...(dto.notifications !== undefined ? { notifications: dto.notifications } : {}),
        ...(dto.darkMode !== undefined ? { darkMode: dto.darkMode } : {}),
        ...(dto.autoBackup !== undefined ? { autoBackup: dto.autoBackup } : {}),
      },
    });
  }
}
