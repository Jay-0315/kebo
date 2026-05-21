import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Wallet, Mail, Lock, User } from "lucide-react";
import { api } from "../lib/api";
import { setAuthSession } from "../lib/auth";
import { useLang } from "../context/LangContext";
import { CHARACTERS, RARITY_COLOR, RARITY_LABEL } from "../data/characters";
import PixelCharacter from "./PixelCharacter";

const STARTER_IDS = [1, 2, 3];
const STARTERS = CHARACTERS.filter((c) => STARTER_IDS.includes(c.id));

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [step, setStep] = useState<"form" | "starter">("form");
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStarter, setSelectedStarter] = useState<number | null>(null);
  const [starterLoading, setStarterLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t("signup.pw_mismatch"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post<{
        accessToken: string;
        user: {
          id: string;
          name: string;
          email: string;
          baseCountryCode: string;
          baseCurrency: "KRW" | "JPY" | "USD" | "EUR";
        };
      }>("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setAuthSession(response.accessToken, response.user);
      setUserId(response.user.id);
      setStep("starter");
    } catch {
      setErrorMessage(t("signup.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectStarter = async () => {
    if (!selectedStarter) return;
    setStarterLoading(true);
    try {
      await api.post("/rewards/starter", { userId, characterId: selectedStarter });
    } catch {
      // proceed to home even if this fails
    } finally {
      setStarterLoading(false);
      navigate("/");
      window.location.reload();
    }
  };

  const backgroundDiv = (
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1585143790814-b40d4b829e4a?w=1080')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(8px)",
      }}
    />
  );

  if (step === "starter") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {backgroundDiv}
        <div className="w-full max-w-lg relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-foreground mb-2">{t("signup.starter_title")}</h1>
            <p className="text-muted-foreground text-sm">{t("signup.starter_subtitle")}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {STARTERS.map((char) => {
              const isSelected = selectedStarter === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedStarter(char.id)}
                  className={`bg-card rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? "border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <PixelCharacter characterId={char.id} size={64} float={isSelected} />
                  <p className={`text-sm font-bold ${RARITY_COLOR[char.rarity]}`}>{char.korName}</p>
                  <p className="text-[10px] text-muted-foreground">{RARITY_LABEL[char.rarity]}</p>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight">{char.description}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSelectStarter}
            disabled={!selectedStarter || starterLoading}
            className="w-full bg-primary/80 text-primary-foreground rounded py-3 font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
          >
            {starterLoading ? t("signup.starter_loading") : selectedStarter ? t("signup.starter_confirm") : t("signup.starter_prompt")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {backgroundDiv}

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-foreground mb-2">{t("signup.title")}</h1>
          <p className="text-muted-foreground">{t("signup.subtitle")}</p>
        </div>

        {/* Signup Form */}
        <div className="bg-card rounded p-6 shadow-lg border border-border">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">{t("signup.name")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동"
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">{t("signup.email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">{t("signup.password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">{t("signup.confirm_password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary/80 text-primary-foreground rounded py-3 font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? t("signup.loading") : t("signup.submit")}
            </button>
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("signup.has_account")}{" "}
              <Link to="/login" className="text-primary/80 font-medium hover:underline">
                {t("signup.login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
