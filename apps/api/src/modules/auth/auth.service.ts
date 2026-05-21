import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthProvider } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { SocialLoginDto, SocialProvider } from "./dto/social-login.dto";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException("이미 가입된 이메일입니다.");
    }

    const passwordHash = await hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        baseCountryCode: "KR",
        baseCurrency: "KRW",
        settings: {
          create: {},
        },
      },
    });

    return this.buildAuthResponse(user, true);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const matched = await compare(dto.password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    return this.buildAuthResponse(user);
  }

  async socialLogin(dto: SocialLoginDto) {
    if (dto.provider !== SocialProvider.GOOGLE) {
      throw new NotImplementedException(
        `${dto.provider} 소셜 로그인 서버 검증은 아직 설정되지 않았습니다.`,
      );
    }

    if (!dto.identityToken) {
      throw new UnauthorizedException("Google identity token이 필요합니다.");
    }

    const profile = await this.verifyGoogleIdentityToken(dto.identityToken);

    if (!profile.email) {
      throw new UnauthorizedException("Google 계정 이메일을 확인할 수 없습니다.");
    }

    const existingIdentity = await this.prisma.userIdentity.findUnique({
      where: {
        provider_providerUserId: {
          provider: AuthProvider.GOOGLE,
          providerUserId: profile.providerUserId,
        },
      },
      include: { user: true },
    });

    if (existingIdentity) {
      return this.buildAuthResponse(existingIdentity.user);
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      await this.prisma.userIdentity.create({
        data: {
          userId: existingUser.id,
          provider: AuthProvider.GOOGLE,
          providerUserId: profile.providerUserId,
          providerEmail: profile.email,
        },
      });

      return this.buildAuthResponse(existingUser);
    }

    const user = await this.prisma.user.create({
      data: {
        name: profile.name,
        email: profile.email,
        passwordHash: null,
        baseCountryCode: "KR",
        baseCurrency: "KRW",
        settings: {
          create: {},
        },
        identities: {
          create: {
            provider: AuthProvider.GOOGLE,
            providerUserId: profile.providerUserId,
            providerEmail: profile.email,
          },
        },
      },
    });

    return this.buildAuthResponse(user, true);
  }

  async getLinkedProviders(userId: string) {
    const identities = await this.prisma.userIdentity.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return {
      providers: [
        this.mapProviderStatus(SocialProvider.GOOGLE, identities),
        this.mapProviderStatus(SocialProvider.KAKAO, identities),
        this.mapProviderStatus(SocialProvider.LINE, identities),
        this.mapProviderStatus(SocialProvider.APPLE, identities),
      ],
    };
  }

  async linkSocialIdentity(userId: string, dto: SocialLoginDto) {
    if (dto.provider !== SocialProvider.GOOGLE) {
      throw new NotImplementedException(
        `${dto.provider} 소셜 연동은 아직 설정되지 않았습니다.`,
      );
    }

    if (!dto.identityToken) {
      throw new BadRequestException("Google identity token이 필요합니다.");
    }

    const profile = await this.verifyGoogleIdentityToken(dto.identityToken);

    const existingIdentity = await this.prisma.userIdentity.findUnique({
      where: {
        provider_providerUserId: {
          provider: AuthProvider.GOOGLE,
          providerUserId: profile.providerUserId,
        },
      },
    });

    if (existingIdentity && existingIdentity.userId !== userId) {
      throw new ConflictException("이미 다른 계정에 연결된 Google 계정입니다.");
    }

    const currentIdentity = await this.prisma.userIdentity.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: AuthProvider.GOOGLE,
        },
      },
    });

    if (
      currentIdentity &&
      currentIdentity.providerUserId !== profile.providerUserId
    ) {
      throw new ConflictException("이 계정에는 이미 다른 Google 계정이 연결되어 있습니다.");
    }

    if (!currentIdentity) {
      await this.prisma.userIdentity.create({
        data: {
          userId,
          provider: AuthProvider.GOOGLE,
          providerUserId: profile.providerUserId,
          providerEmail: profile.email,
        },
      });
    }

    return {
      linked: true,
      provider: SocialProvider.GOOGLE,
      providerEmail: profile.email,
    };
  }

  private async verifyGoogleIdentityToken(identityToken: string) {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(identityToken)}`,
    );

    if (!response.ok) {
      throw new UnauthorizedException("Google identity token 검증에 실패했습니다.");
    }

    const payload = (await response.json()) as {
      aud?: string;
      sub?: string;
      email?: string;
      email_verified?: string;
      name?: string;
    };

    const clientIds = (
      process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || ""
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (clientIds.length === 0) {
      throw new NotImplementedException("GOOGLE_CLIENT_ID 또는 GOOGLE_CLIENT_IDS가 설정되지 않았습니다.");
    }

    if (!payload.aud || !clientIds.includes(payload.aud)) {
      throw new UnauthorizedException("Google identity token의 aud가 일치하지 않습니다.");
    }

    if (!payload.sub) {
      throw new UnauthorizedException("Google 계정 식별자를 확인할 수 없습니다.");
    }

    if (payload.email_verified !== "true") {
      throw new UnauthorizedException("Google 이메일 인증이 필요합니다.");
    }

    return {
      providerUserId: payload.sub,
      email: payload.email ?? null,
      name: payload.name?.trim() || "Google User",
    };
  }

  private async resolveNeedsStarter(userId: string) {
    const ownedCharacterCount = await this.prisma.userCharacter.count({
      where: { userId },
    });

    return ownedCharacterCount === 0;
  }

  private mapProviderStatus(
    provider: SocialProvider,
    identities: {
      provider: AuthProvider;
      providerEmail: string | null;
      createdAt: Date;
    }[],
  ) {
    const matched = identities.find((identity) => identity.provider === provider);

    return {
      provider,
      linked: Boolean(matched),
      providerEmail: matched?.providerEmail ?? null,
      linkedAt: matched?.createdAt.toISOString() ?? null,
    };
  }

  private async buildAuthResponse(
    user: {
    id: string;
    name: string;
    email: string;
    role: string;
    baseCountryCode: string;
    baseCurrency: string;
    },
    needsStarterOverride?: boolean,
  ) {
    const needsStarter =
      needsStarterOverride ?? (await this.resolveNeedsStarter(user.id));

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "kebo-dev-secret",
      {
        expiresIn: "7d",
      },
    );

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        baseCountryCode: user.baseCountryCode,
        baseCurrency: user.baseCurrency,
      },
      needsStarter,
    };
  }
}
