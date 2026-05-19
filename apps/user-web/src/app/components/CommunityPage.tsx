import { useMemo, useState } from "react";
import {
  Heart,
  Share2,
  Plus,
  X,
  Users,
  TrendingUp,
  Pencil,
  Trash2,
  CheckSquare,
} from "lucide-react";
import { Link } from "react-router";
import { useAppData } from "../context/AppDataContext";
import { formatCurrency, getCountryByCode } from "../data/currency";
import type { CommunityPost } from "../types/domain";

export default function CommunityPage() {
  const { expenses, posts, profile, createPost, updatePost, deletePost, togglePostLike } = useAppData();
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [content, setContent] = useState("");
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);

  const shareableExpenses = useMemo(() => expenses.slice(0, 8), [expenses]);

  const openCreateForm = () => {
    setEditingPost(null);
    setContent("");
    setSelectedExpenseIds([]);
    setShowWriteForm(true);
  };

  const openEditForm = (post: CommunityPost) => {
    setEditingPost(post);
    setContent(post.content);
    setSelectedExpenseIds(post.sharedExpenses.map((expense) => expense.expenseId));
    setShowWriteForm(true);
  };

  const closeForm = () => {
    setShowWriteForm(false);
    setEditingPost(null);
    setContent("");
    setSelectedExpenseIds([]);
  };

  const toggleExpenseSelection = (expenseId: string) => {
    setSelectedExpenseIds((current) =>
      current.includes(expenseId)
        ? current.filter((id) => id !== expenseId)
        : [...current, expenseId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    const draft = {
      content,
      sharedExpenseIds: selectedExpenseIds,
    };

    if (editingPost) {
      updatePost(editingPost.id, draft);
    } else {
      createPost(draft);
    }

    closeForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="shrink-0">커뮤니티</h2>
        <div className="flex gap-2 shrink-0">
          <Link to="/groups">
            <button
              title="그룹으로 이동"
              className="bg-accent text-accent-foreground rounded-xl w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
              <Users className="w-5 h-5" />
            </button>
          </Link>
          <button
            onClick={openCreateForm}
            title="글 작성"
            className="bg-primary/80 text-primary-foreground rounded-xl w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground -mt-2">글은 텍스트와 지출 내역 공유만 지원합니다.</p>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-card rounded-xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-white font-medium">
                  {post.authorName[0]}
                </div>
                <div>
                  <p className="font-medium">{post.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.createdAt.slice(0, 10)}
                    {post.updatedAt !== post.createdAt && " · 수정됨"}
                  </p>
                </div>
              </div>
              {post.authorId === profile.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditForm(post)}
                    className="p-2 rounded-md bg-muted hover:bg-accent/20 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 rounded-md bg-muted text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

            {post.sharedExpenses.length > 0 && (
              <div className="grid gap-3 mb-4">
                {post.sharedExpenses.map((expense) => (
                  <div
                    key={expense.expenseId}
                    className="rounded-xl border border-border bg-muted/70 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                        {expense.category}
                      </span>
                      <span className="bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded">
                        {getCountryByCode(expense.countryCode).flag} {expense.spentCurrency}
                      </span>
                    </div>
                    <p className="font-medium">{expense.memo}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {expense.date} · 원금액 {formatCurrency(expense.spentAmount, expense.spentCurrency)}
                    </p>
                    <p className="text-sm font-bold text-destructive mt-2">
                      메인국가 기준 {formatCurrency(expense.baseAmount, expense.baseCurrency)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <button
                onClick={() => togglePostLike(post.id)}
                className={`flex items-center gap-1 transition-colors ${
                  post.isLiked ? "text-primary/80" : "text-muted-foreground hover:text-primary/80"
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{post.likes}</span>
              </button>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">{post.sharedExpenses.length}개 내역</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-muted rounded-xl p-5 shadow-sm border border-border">
        <h3 className="mb-2 text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary/80" />
          공유 가이드
        </h3>
        <p className="text-sm text-muted-foreground">
          실제 결제 통화와 메인국가 환산 금액을 함께 보여주면 다른 사용자가 지출 감각을 이해하기 쉽습니다.
        </p>
      </div>

      {showWriteForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeForm}
        >
          <div
            className="bg-card rounded-lg p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3>{editingPost ? "글 수정" : "새 글 작성"}</h3>
              <button
                onClick={closeForm}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm">내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="절약 방법이나 환율 체감, 지출 후기 등을 적어보세요."
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring min-h-[140px] resize-none"
                  required
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  <label className="text-sm">공유할 내역 선택</label>
                </div>
                <div className="grid gap-3">
                  {shareableExpenses.map((expense) => {
                    const checked = selectedExpenseIds.includes(expense.id);
                    return (
                      <button
                        key={expense.id}
                        type="button"
                        onClick={() => toggleExpenseSelection(expense.id)}
                        className={`w-full text-left rounded-lg border p-4 transition-colors ${
                          checked
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted hover:bg-accent/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{expense.memo}</p>
                            <p className="text-sm text-muted-foreground">
                              {expense.date} · {expense.category} ·{" "}
                              {formatCurrency(expense.spentAmount, expense.spentCurrency)}
                            </p>
                          </div>
                          <span className="font-bold text-destructive">
                            {formatCurrency(expense.baseAmount, expense.baseCurrency)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary/80 text-primary-foreground rounded-lg py-3 font-medium shadow-md hover:shadow-lg transition-all"
              >
                {editingPost ? "수정하기" : "작성하기"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
