import { useState } from "react";
import { Bell, Moon, Sun, Shield, Database, Trash2, ChevronRight, Globe, Check } from "lucide-react";
import { useAppData } from "../context/AppDataContext";

const languages = [
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
];

export default function SettingsPage() {
  const { settings, countries, profile, updateProfileCurrency, updateSettings } = useAppData();
  const [selectedLanguage, setSelectedLanguage] = useState("ko");

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    alert(`언어가 ${languages.find(l => l.code === code)?.nativeName}(으)로 변경되었습니다.`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2>설정</h2>

      {/* Appearance */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="mb-4">표시</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              <div>
                <p className="font-medium">다크 모드</p>
                <p className="text-sm text-muted-foreground">어두운 테마 사용</p>
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
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="mb-4">알림</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">푸시 알림</p>
                <p className="text-sm text-muted-foreground">새로운 활동 알림 받기</p>
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
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="mb-4">데이터 및 개인정보</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">자동 백업</p>
                <p className="text-sm text-muted-foreground">클라우드에 데이터 백업</p>
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

          <div className="p-3 rounded-lg bg-muted">
            <p className="font-medium mb-2">메인 국가 / 기준 통화</p>
            <select
              value={profile.baseCountryCode}
              onChange={(e) => updateProfileCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name} · {country.currency}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              변경 시 기존 내역도 선택한 기준 통화로 다시 환산해 표시합니다.
            </p>
          </div>

          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-medium">개인정보 보호</p>
                <p className="text-sm text-muted-foreground">개인정보 처리방침 확인</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">데이터 삭제</p>
                <p className="text-sm text-destructive/80">모든 데이터 영구 삭제</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="mb-4">언어</h3>
        <div className="space-y-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                selectedLanguage === language.code
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-muted hover:bg-muted/70 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className={`w-5 h-5 ${selectedLanguage === language.code ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className="font-medium">{language.nativeName}</p>
                  <p className="text-sm text-muted-foreground">{language.name}</p>
                </div>
              </div>
              {selectedLanguage === language.code && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="mb-4">앱 정보</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">버전</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">빌드</span>
            <span className="font-medium">2026.05.15</span>
          </div>
        </div>
      </div>
    </div>
  );
}
