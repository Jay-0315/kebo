import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Users, Crown, Calendar, TrendingUp, Copy, Check } from "lucide-react";
import { useAppData } from "../context/AppDataContext";

interface GroupMember {
  id: number;
  name: string;
  isHost: boolean;
}

interface Group {
  id: number;
  name: string;
  code: string;
  members: GroupMember[];
  isHost: boolean;
}

export default function GroupDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expenses } = useAppData();
  const [copiedCode, setCopiedCode] = useState(false);

  const group: Group | undefined = location.state?.group;

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="mb-4">그룹 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/groups")}
          className="bg-primary/80 text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
        >
          그룹 목록으로
        </button>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const groupExpenses = expenses.filter((e) => e.group === group.name);

  const categoryEmoji: Record<string, string> = {
    식비: "🍜", 교통: "🚌", 카페: "☕", 쇼핑: "🛍", 숙박: "🏨",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/groups")}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2>{group.name}</h2>
            {group.isHost && <Crown className="w-5 h-5 text-yellow-500" />}
          </div>
          <p className="text-sm text-muted-foreground">멤버 {group.members.length}명</p>
        </div>
        <button
          onClick={copyToClipboard}
          className="bg-muted hover:bg-muted/70 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors"
        >
          <span className="font-mono text-sm font-medium">{group.code}</span>
          {copiedCode ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Members Section */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          참여 인원
        </h3>
        <div className="space-y-2">
          {group.members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-white font-medium">
                {member.name[0]}
              </div>
              <p className="flex-1 font-medium">{member.name}</p>
              {member.isHost && (
                <span className="bg-yellow-500/10 text-yellow-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  호스트
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          최근 활동
        </h3>
        {groupExpenses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">아직 지출 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {groupExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                  {categoryEmoji[expense.category] ?? "💳"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{expense.memo}</p>
                  <p className="text-xs text-muted-foreground">
                    {expense.date} · {expense.category}
                    {expense.participants ? ` · ${expense.participants}명` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">
                    {expense.spentAmount.toLocaleString()}
                    {expense.spentCurrency === "JPY" ? "¥" : "₩"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₩{expense.baseAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
