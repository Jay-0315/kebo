import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Database,
  Trash2,
  ChevronRight,
  Globe,
  Check,
  Palette,
  AlertTriangle,
  X,
  Link2,
  Mail,
} from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { useLang } from "../context/LangContext";
import type { TranslationKey } from "../lib/i18n";
import { clearAuthSession, getStoredUser } from "../lib/auth";
import { THEME_PRESETS } from "../lib/theme-presets";
import { api } from "../lib/api";

const LANGUAGES = [
  { code: "ko" as const, nativeName: "한국어", name: "Korean" },
  { code: "ja" as const, nativeName: "日本語", name: "Japanese" },
];

type SocialProvider = "GOOGLE" | "KAKAO" | "LINE" | "APPLE";

type LinkedProvider = {
  provider: SocialProvider;
  linked: boolean;
  providerEmail: string | null;
  linkedAt: string | null;
};

const SOCIAL_PROVIDER_META: Record<
  SocialProvider,
  { label: string; buttonClassName: string }
> = {
  GOOGLE: {
    label: "Google",
    buttonClassName: "bg-white text-[#1f1f1f] border border-border",
  },
  KAKAO: {
    label: "Kakao",
    buttonClassName: "bg-[#FEE500] text-[#191600]",
  },
  LINE: {
    label: "LINE",
    buttonClassName: "bg-[#06C755] text-white",
  },
  APPLE: {
    label: "Apple",
    buttonClassName: "bg-black text-white",
  },
};

export default function SettingsPage() {
  const {
    settings,
    countries,
    profile,
    updateProfileCurrency,
    updateSettings,
  } = useAppData();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [linkedProviders, setLinkedProviders] = useState<LinkedProvider[]>([]);
  const [socialLoading, setSocialLoading] = useState(true);
  const [socialSubmitting, setSocialSubmitting] = useState(false);
  const [socialMessage, setSocialMessage] = useState("");
  const googleLinkButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const linkedGoogle = linkedProviders.find(
    (provider) => provider.provider === "GOOGLE",
  );

  const loadLinkedProviders = useCallback(async () => {
    setSocialLoading(true);

    try {
      const response = await api.get<{ providers: LinkedProvider[] }>(
        "/auth/providers",
      );
      setLinkedProviders(response.providers);
    } catch {
      setSocialMessage("소셜 연동 상태를 불러오지 못했습니다.");
    } finally {
      setSocialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLinkedProviders();
  }, [loadLinkedProviders]);

  useEffect(() => {
    if (
      !googleClientId ||
      !googleLinkButtonRef.current ||
      !window.google?.accounts?.id ||
      linkedGoogle?.linked
    ) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response.credential) {
          setSocialMessage("Google 연동 토큰을 받지 못했습니다.");
          return;
        }

        setSocialSubmitting(true);
        setSocialMessage("");

        try {
          await api.post("/auth/social/link", {
            provider: "GOOGLE",
            identityToken: response.credential,
          });
          setSocialMessage("Google 계정이 연결되었습니다.");
          await loadLinkedProviders();
        } catch (error) {
          setSocialMessage(
            error instanceof Error && error.message
              ? error.message
              : "Google 계정 연동에 실패했습니다.",
          );
        } finally {
          setSocialSubmitting(false);
        }
      },
    });

    googleLinkButtonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(googleLinkButtonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: 280,
      text: "continue_with",
    });
  }, [googleClientId, linkedGoogle?.linked, loadLinkedProviders]);

  const handleAccountDelete = async () => {
    const currentUser = getStoredUser();
    if (currentUser) {
      try {
        await api.delete(`/users/${currentUser.id}`);
      } catch {
        // 서버 삭제 실패해도 로컬 세션은 정리
      }
    }
    clearAuthSession();
    localStorage.removeItem("kebo-local-settings");
    localStorage.removeItem("kebo-liked-posts");
    localStorage.removeItem("kebo-profile-photo");
    navigate("/login");
    window.location.reload();
  };

  const currentLang = settings.language ?? "ko";

  return (
    <div className="space-y-6">
      <h2>{t("settings.title")}</h2>

      {/* Appearance */}
      <div className="bg-card rounded-md p-5 border border-border">
        <h3 className="mb-4">{t("settings.display")}</h3>
        <div className="space-y-5">
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <div>
                <p className="font-medium">{t("settings.dark_mode")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.dark_mode_desc")}
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className="relative w-12 h-6 rounded-full transition-colors bg-gray-300 dark:bg-zinc-600"
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-primary rounded-full transition-transform ${
                  settings.darkMode ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Theme color picker */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{t("settings.theme_color")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.theme_color_desc")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isActive =
                  (settings.themeColor ?? "emerald") === preset.id;
                return (
                  <button
                    key={preset.id}
                    title={t(`theme.${preset.id}` as TranslationKey)}
                    onClick={() => updateSettings({ themeColor: preset.id })}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        isActive
                          ? "border-foreground scale-110 shadow-md"
                          : "border-transparent hover:border-muted-foreground/40 hover:scale-105"
                      }`}
                      style={{ backgroundColor: preset.swatch }}
                    >
                      {isActive && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Check className="w-4 h-4 drop-shadow text-white" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[10px] leading-tight text-center transition-colors ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                    >
                      {t(`theme.${preset.id}` as TranslationKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-md p-5 border border-border">
        <h3 className="mb-4">{t("settings.notifications_section")}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">
                  {t("settings.push_notifications")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.push_notifications_desc")}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({ notifications: !settings.notifications })
              }
              className="relative w-12 h-6 rounded-full transition-colors bg-gray-300 dark:bg-zinc-600"
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-primary rounded-full transition-transform ${
                  settings.notifications ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-card rounded-md p-5 border border-border">
        <h3 className="mb-4">{t("settings.data_privacy")}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{t("settings.auto_backup")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.auto_backup_desc")}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({ autoBackup: !settings.autoBackup })
              }
              className="relative w-12 h-6 rounded-full transition-colors bg-gray-300 dark:bg-zinc-600"
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-primary rounded-full transition-transform ${
                  settings.autoBackup ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="p-3 rounded bg-muted">
            <p className="font-medium mb-2">{t("settings.base_country")}</p>
            <select
              value={profile.baseCountryCode}
              onChange={(e) => updateProfileCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-input-background rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} · {country.currency}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              {t("settings.currency_note")}
            </p>
          </div>

          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full flex items-center justify-between p-3 rounded hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">{t("settings.privacy")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.privacy_desc")}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between p-3 rounded hover:bg-destructive/10 transition-colors text-destructive"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">{t("settings.account_delete")}</p>
                <p className="text-sm text-destructive/80">
                  {t("settings.account_delete_desc")}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-md p-5 border border-border">
        <h3 className="mb-4">{t("settings.social")}</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded bg-muted p-3">
            <Link2 className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{t("settings.social_link")}</p>
              <p className="text-sm text-muted-foreground">
                {t("settings.social_link_desc")}
              </p>
            </div>
          </div>

          {socialLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("settings.social_loading")}
            </p>
          ) : (
            <div className="space-y-3">
              {(["GOOGLE", "KAKAO", "LINE", "APPLE"] as SocialProvider[]).map(
                (provider) => {
                  const status = linkedProviders.find(
                    (item) => item.provider === provider,
                  ) ?? {
                    provider,
                    linked: false,
                    providerEmail: null,
                    linkedAt: null,
                  };
                  const meta = SOCIAL_PROVIDER_META[provider];

                  return (
                    <div
                      key={provider}
                      className="rounded border border-border bg-background/50 p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <p className="font-medium">{meta.label}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {status.linked
                              ? t("settings.social_linked")
                              : provider === "GOOGLE"
                                ? t("settings.social_available")
                                : t("settings.social_coming_soon")}
                          </p>
                          {status.providerEmail && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{status.providerEmail}</span>
                            </div>
                          )}
                        </div>

                        {status.linked ? (
                          <button
                            type="button"
                            disabled
                            className="rounded bg-primary/10 px-4 py-2 text-sm font-medium text-primary opacity-80"
                          >
                            연동중
                          </button>
                        ) : provider === "GOOGLE" ? (
                          <div className="min-h-10 w-full max-w-[280px]">
                            <div
                              ref={googleLinkButtonRef}
                              className={
                                socialSubmitting
                                  ? "pointer-events-none opacity-70"
                                  : ""
                              }
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className={`rounded px-4 py-2 text-sm font-medium opacity-60 ${meta.buttonClassName}`}
                          >
                            Coming Soon
                          </button>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}

          {!googleClientId && (
            <p className="text-sm text-muted-foreground">
              `VITE_GOOGLE_CLIENT_ID` 설정 후 Google 연동 버튼이 표시됩니다.
            </p>
          )}
          {socialMessage && (
            <p className="text-sm text-muted-foreground">{socialMessage}</p>
          )}
        </div>
      </div>

      {/* Language */}
      <div className="bg-card rounded-md p-5 border border-border">
        <h3 className="mb-4">{t("settings.language")}</h3>
        <div className="space-y-2">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => updateSettings({ language: language.code })}
              className={`w-full flex items-center justify-between p-4 rounded transition-colors ${
                currentLang === language.code
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-muted hover:bg-muted/70 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe
                  className={`w-5 h-5 ${currentLang === language.code ? "text-primary" : "text-muted-foreground"}`}
                />
                <div className="text-left">
                  <p className="font-medium">{language.nativeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {language.name}
                  </p>
                </div>
              </div>
              {currentLang === language.code && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="bg-card rounded-md p-5 border border-border">
        <h3 className="mb-4">{t("settings.app_info")}</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">
              {t("settings.version")}
            </span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">{t("settings.build")}</span>
            <span className="font-medium">2026.05.15</span>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div
            className="bg-card rounded-md max-w-lg w-full shadow-2xl border border-border flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3>{t("settings.privacy")}</h3>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-5 text-sm leading-relaxed">
              {lang === "ja" ? (
                <>
                  <p className="text-muted-foreground text-xs">最終更新日：2026年5月29日</p>
                  <p className="text-muted-foreground">KEBO（以下「本サービス」）は、個人情報の保護に関する法律（APPI）に基づき、以下のとおり個人情報を取り扱います。</p>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">1. 収集する個人情報の項目と利用目的</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>メールアドレス・パスワード（ハッシュ化） — 会員識別・認証</li>
                      <li>ニックネーム・プロフィール画像 — サービス内表示</li>
                      <li>Googleアカウント情報（ID・メール） — ソーシャルログイン連携</li>
                      <li>支出記録・グループ情報・投稿・コメント — 家計簿・コミュニティ機能の提供</li>
                      <li>アクセスログ・接続環境情報 — 不正利用防止・サービス改善</li>
                    </ul>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">2. 保有期間と利用停止</h4>
                    <p className="text-muted-foreground">退会時に速やかに削除します。法令上の保存義務がある場合は当該期間保有します。ご本人から利用停止の請求があった場合は、遅滞なく対応します。</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">3. 個人情報の削除（廃棄）手順</h4>
                    <p className="text-muted-foreground">退会処理時、データベース上の個人情報（支出・投稿・コメント・リワード等）をカスケード削除します。電子ファイルは復元不可能な方法で削除されます。</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">4. 第三者への提供</h4>
                    <p className="text-muted-foreground">原則として第三者に提供しません。Google OAuth連携を利用する場合、Googleの<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary underline">プライバシーポリシー</a>が適用されます。</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">5. 業務委託</h4>
                    <p className="text-muted-foreground">現在、個人情報の取り扱いを外部に委託していません。</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">6. ご本人の権利と行使方法</h4>
                    <p className="text-muted-foreground">個人情報の開示・訂正・利用停止・削除を請求できます。設定画面の「退会」から全データを即時削除できます。その他の請求はお問い合わせ先までご連絡ください。</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">7. 安全管理措置</h4>
                    <p className="text-muted-foreground">パスワードはbcryptでハッシュ化して保存します。通信はHTTPS（TLS）で暗号化します。JWTによるアクセス制御を実施しています。</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">8. 個人情報保護管理者・お問い合わせ</h4>
                    <p className="text-muted-foreground">個人情報の取り扱いに関するお問い合わせ・苦情は下記までご連絡ください。<br />メール: support@kebo.app</p>
                  </section>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-xs">최종 수정일: 2026년 5월 29일</p>
                  <p className="text-muted-foreground">KEBO(이하 "서비스")는 「개인정보 보호법」 제30조에 따라 이용자의 개인정보를 보호하고 관련 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">1. 수집하는 개인정보 항목 및 이용 목적</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>이메일 주소·비밀번호(해시 저장) — 회원 식별 및 인증</li>
                      <li>닉네임·프로필 사진 — 서비스 내 표시</li>
                      <li>Google 계정 정보(ID·이메일) — 소셜 로그인 연동</li>
                      <li>지출 내역·그룹 정보·게시글·댓글 — 가계부·커뮤니티 기능 제공</li>
                      <li>접속 로그·접속 환경 정보 — 부정 이용 방지 및 서비스 개선</li>
                    </ul>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">2. 개인정보의 처리 및 보유 기간</h4>
                    <p className="text-muted-foreground">회원 탈퇴 시 지체 없이 파기합니다. 관련 법령에 따라 보존 의무가 있는 경우 해당 기간 동안 보유합니다.</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">3. 개인정보의 파기 절차 및 방법</h4>
                    <p className="text-muted-foreground">회원 탈퇴 처리 시 데이터베이스에서 개인정보(지출·게시글·댓글·리워드 등)를 즉시 삭제(CASCADE)합니다. 전자파일은 복구 불가능한 방법으로 영구 삭제합니다.</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">4. 개인정보의 제3자 제공</h4>
                    <p className="text-muted-foreground">원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. Google OAuth 연동 시 Google의 <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-primary underline">개인정보처리방침</a>이 적용됩니다.</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">5. 개인정보 처리 위탁</h4>
                    <p className="text-muted-foreground">현재 개인정보 처리를 외부에 위탁하지 않습니다.</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">6. 정보주체의 권리·의무 및 행사 방법</h4>
                    <p className="text-muted-foreground">이용자는 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 설정 화면의 회원 탈퇴를 통해 모든 데이터를 즉시 삭제할 수 있으며, 그 외 요청은 아래 문의처로 연락해주세요.</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">7. 개인정보의 안전성 확보 조치</h4>
                    <p className="text-muted-foreground">비밀번호는 bcrypt로 암호화하여 저장합니다. 통신 구간은 HTTPS(TLS)로 암호화합니다. JWT 기반 접근 제어를 적용합니다.</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">8. 개인정보보호책임자</h4>
                    <p className="text-muted-foreground">이메일: support@kebo.app</p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="font-semibold text-foreground">9. 권익침해 구제 방법</h4>
                    <p className="text-muted-foreground">개인정보 침해로 인한 구제를 받기 위해 아래 기관에 분쟁 해결이나 상담 등을 신청할 수 있습니다.</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>개인정보분쟁조정위원회: <a href="https://www.kopico.go.kr" target="_blank" rel="noreferrer" className="text-primary underline">www.kopico.go.kr</a> / 1833-6972</li>
                      <li>개인정보침해신고센터: <a href="https://privacy.kisa.or.kr" target="_blank" rel="noreferrer" className="text-primary underline">privacy.kisa.or.kr</a> / 118</li>
                      <li>대검찰청 사이버수사과: <a href="https://www.spo.go.kr" target="_blank" rel="noreferrer" className="text-primary underline">www.spo.go.kr</a> / 1301</li>
                      <li>경찰청 사이버안전국: <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noreferrer" className="text-primary underline">ecrm.cyber.go.kr</a> / 182</li>
                    </ul>
                  </section>
                </>
              )}
            </div>

            <div className="p-4 border-t border-border shrink-0">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-2.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {lang === "ja" ? "閉じる" : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-card rounded-md p-6 max-w-sm w-full shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-destructive">
                  {t("settings.delete_modal_title")}
                </h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {t("settings.delete_modal_body")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                {t("settings.cancel")}
              </button>
              <button
                onClick={() => void handleAccountDelete()}
                className="flex-1 py-2.5 rounded bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                {t("settings.delete_confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
