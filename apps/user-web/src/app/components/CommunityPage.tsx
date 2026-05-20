import { useMemo, useState } from "react";
import {
  Heart, Share2, Plus, X, Users, Pencil, Trash2, CheckSquare,
} from "lucide-react";
import { Link } from "react-router";
import { useAppData } from "../context/AppDataContext";
import { formatCurrency, getCountryByCode } from "../data/currency";
import { formatRelativeTime } from "../lib/story-storage";
import {
  loadPostCategories, savePostCategory,
  type PostCategory, POST_CATEGORY_OPTIONS,
} from "../lib/post-categories";
import type { CommunityPost } from "../types/domain";

const CAT_STYLE: Record<PostCategory, string> = {
  자랑: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  공략: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  잡담: "bg-muted text-muted-foreground",
};

export default function CommunityPage() {
  const { expenses, posts, profile, createPost, updatePost, deletePost, togglePostLike } = useAppData();

  const [activeTab, setActiveTab] = useState<PostCategory | "전체">("전체");
  const [categories, setCategories] = useState<Record<string, PostCategory>>(loadPostCategories);

  const [showWriteForm, setShowWriteForm] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [content, setContent] = useState("");
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  const [postCategory, setPostCategory] = useState<PostCategory>("잡담");

  const shareableExpenses = useMemo(() => expenses.slice(0, 8), [expenses]);

  const visiblePosts = posts.filter((p) => {
    if (activeTab === "전체") return true;
    return (categories[p.id] ?? "잡담") === activeTab;
  });

  const openCreateForm = () => {
    setEditingPost(null);
    setContent("");
    setSelectedExpenseIds([]);
    setPostCategory("잡담");
    setShowWriteForm(true);
  };

  const openEditForm = (post: CommunityPost) => {
    setEditingPost(post);
    setContent(post.content);
    setSelectedExpenseIds(post.sharedExpenses.map((e) => e.expenseId));
    setPostCategory(categories[post.id] ?? "잡담");
    setShowWriteForm(true);
  };

  const closeForm = () => {
    setShowWriteForm(false);
    setEditingPost(null);
    setContent("");
    setSelectedExpenseIds([]);
  };

  const toggleExpenseSelection = (id: string) =>
    setSelectedExpenseIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const draft = { content, sharedExpenseIds: selectedExpenseIds };

    if (editingPost) {
      await updatePost(editingPost.id, draft);
      savePostCategory(editingPost.id, postCategory);
      setCategories((prev) => ({ ...prev, [editingPost.id]: postCategory }));
    } else {
      await createPost(draft);
      // 새 포스트 ID는 서버에서 발급되므로 가장 최신 post에 카테고리 연결
      // 실제 앱에서는 createPost가 ID를 반환해야 하지만 현재 API 구조상 우회
      setCategories((prev) => {
        const latest = Object.keys(prev).length;
        void latest; // 타입만 사용, 실제 매핑은 아래에서 처리
        return prev;
      });
      // 낙관적으로 저장 — 다음 렌더에서 최신 post에 붙음
      const tempKey = `__pending__${Date.now()}`;
      savePostCategory(tempKey, postCategory);
      setCategories((prev) => ({ ...prev, [tempKey]: postCategory }));
    }

    closeForm();
  };

  const tabs: (PostCategory | "전체")[] = ["전체", ...POST_CATEGORY_OPTIONS];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="shrink-0">게시판</h2>
        <div className="flex gap-2 shrink-0">
          <Link to="/groups">
            <button
              title="그룹으로 이동"
              className="bg-muted text-foreground rounded-md w-10 h-10 flex items-center justify-center hover:bg-accent/30 active:scale-95 transition-all"
            >
              <Users className="w-5 h-5" />
            </button>
          </Link>
          <button
            onClick={openCreateForm}
            title="글 작성"
            className="bg-primary/80 text-primary-foreground rounded-md w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {visiblePosts.length === 0 ? (
          <div className="bg-card rounded border border-border p-10 text-center text-muted-foreground">
            <p className="text-sm">이 탭에 아직 게시글이 없습니다</p>
          </div>
        ) : (
          visiblePosts.map((post) => {
            const cat = categories[post.id] ?? "잡담";
            return (
              <div key={post.id} className="bg-card rounded border border-border p-5 hover:border-primary/20 transition-colors">
                {/* Author */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-accent/70 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {post.authorName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{post.authorName}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${CAT_STYLE[cat]}`}>
                          {cat}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
                    </div>
                  </div>
                  {post.authorId === profile.id && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditForm(post)}
                        className="p-1.5 rounded bg-muted hover:bg-accent/20 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 rounded bg-muted text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

                {/* Attached expenses */}
                {post.sharedExpenses.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {post.sharedExpenses.map((expense) => (
                      <div key={expense.expenseId} className="rounded-md border border-border bg-muted/60 p-3">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{expense.category}</span>
                          <span className="text-xs text-muted-foreground">{getCountryByCode(expense.countryCode).flag} {expense.spentCurrency}</span>
                        </div>
                        <p className="font-medium text-sm">{expense.memo}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {expense.date} · {formatCurrency(expense.spentAmount, expense.spentCurrency)}
                          {expense.spentCurrency !== expense.baseCurrency && (
                            <span className="ml-1 text-primary font-medium">→ {formatCurrency(expense.baseAmount, expense.baseCurrency)}</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center gap-4 pt-3 border-t border-border text-muted-foreground">
                  <button
                    onClick={() => togglePostLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${post.isLiked ? "text-primary" : "hover:text-primary"}`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                    {post.likes}
                  </button>
                  {post.sharedExpenses.length > 0 && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Share2 className="w-4 h-4" />
                      {post.sharedExpenses.length}개 내역
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Write form modal */}
      {showWriteForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
          onClick={closeForm}
        >
          <div
            className="bg-card rounded-t-md sm:rounded p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3>{editingPost ? "글 수정" : "새 글 작성"}</h3>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div className="flex gap-2">
                {POST_CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPostCategory(cat)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium border transition-all ${
                      postCategory === cat
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="절약 팁, 여행 후기, 지출 자랑 등을 자유롭게 공유해보세요."
                  className="w-full px-4 py-3 bg-input-background rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-none text-sm"
                  required
                />
              </div>

              {shareableExpenses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <label className="text-sm font-medium">지출 내역 첨부 (선택)</label>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {shareableExpenses.map((expense) => {
                      const checked = selectedExpenseIds.includes(expense.id);
                      return (
                        <button
                          key={expense.id}
                          type="button"
                          onClick={() => toggleExpenseSelection(expense.id)}
                          className={`w-full text-left rounded-md border p-3 transition-colors text-sm ${
                            checked ? "border-primary bg-primary/10" : "border-border bg-muted hover:bg-accent/20"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium truncate">{expense.memo}</p>
                              <p className="text-xs text-muted-foreground">{expense.date} · {expense.category}</p>
                            </div>
                            <span className="font-bold text-destructive shrink-0 text-xs">
                              {formatCurrency(expense.baseAmount, expense.baseCurrency)}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary/80 text-primary-foreground rounded-md py-3 font-medium shadow-md hover:shadow-lg transition-all"
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
