import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Wallet, Mail, Lock } from "lucide-react";
import { api } from "../lib/api";
import { setAuthSession } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }>("/auth/login", {
        email,
        password,
      });

      setAuthSession(response.accessToken, response.user);
      navigate("/");
      window.location.reload();
    } catch (error) {
      setErrorMessage("로그인에 실패했습니다. 계정 정보를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/80 rounded mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-foreground mb-2">가계부</h1>
          <p className="text-muted-foreground">똑똑한 소비 습관을 만들어요</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded p-6 shadow-lg border border-border">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-input-background rounded border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="text-primary/80 font-medium hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
