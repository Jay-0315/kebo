import { useState } from "react";
import { Check, Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("ko");

  const languages: Language[] = [
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "en", name: "English", nativeName: "English" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
  ];

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    // 실제로는 i18n 라이브러리로 언어 변경
    alert(`언어가 ${languages.find(l => l.code === code)?.nativeName}(으)로 변경되었습니다.`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="mb-2">언어 변경</h2>
        <p className="text-muted-foreground">앱에서 사용할 언어를 선택하세요</p>
      </div>

      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="space-y-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                selectedLanguage === language.code
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-muted hover:bg-accent/20 border-2 border-transparent"
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

      <div className="bg-muted/50 rounded-xl p-4 border border-border">
        <p className="text-sm text-muted-foreground">
          💡 언어 설정은 즉시 적용됩니다. 일부 콘텐츠는 번역되지 않을 수 있습니다.
        </p>
      </div>
    </div>
  );
}
