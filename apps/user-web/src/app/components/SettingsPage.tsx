import { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, Moon, Sun, Shield, Database, Trash2, ChevronRight, Globe, Check, Palette, AlertTriangle, X } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { useLang } from "../context/LangContext";
import { clearAuthSession } from "../lib/auth";
import { THEME_PRESETS } from "../lib/theme-presets";

const LANGUAGES = [
  { code: "ko" as const, nativeName: "한국어", name: "Korean" },
  { code: "ja" as const, nativeName: "日本語", name: "Japanese" },
];

export default function SettingsPage() {
  const { settings, countries, profile, updateProfileCurrency, updateSettings } = useAppData();
  const { t } = useLang();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAccountDelete = () => {
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
              {settings.darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              <div>
                <p className="font-medium">{t("settings.dark_mode")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.dark_mode_desc")}</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.darkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
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
                <p className="text-sm text-muted-foreground">{t("settings.theme_color_desc")}</p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isActive = (settings.themeColor ?? "emerald") === preset.id;
                return (
                  <button
                    key={preset.id}
                    title={preset.name}
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
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] leading-tight text-center transition-colors ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                      {preset.name}
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
                <p className="font-medium">{t("settings.push_notifications")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.push_notifications_desc")}</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ notifications: !settings.notifications })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
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
                <p className="text-sm text-muted-foreground">{t("settings.auto_backup_desc")}</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ autoBackup: !settings.autoBackup })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.autoBackup ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
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

          <button className="w-full flex items-center justify-between p-3 rounded hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">{t("settings.privacy")}</p>
                <p className="text-sm text-muted-foreground">{t("settings.privacy_desc")}</p>
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
                <p className="text-sm text-destructive/80">{t("settings.account_delete_desc")}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
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
                <Globe className={`w-5 h-5 ${currentLang === language.code ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className="font-medium">{language.nativeName}</p>
                  <p className="text-sm text-muted-foreground">{language.name}</p>
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
            <span className="text-muted-foreground">{t("settings.version")}</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">{t("settings.build")}</span>
            <span className="font-medium">2026.05.15</span>
          </div>
        </div>
      </div>

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
                <h3 className="text-destructive">{t("settings.delete_modal_title")}</h3>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
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
                onClick={handleAccountDelete}
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
