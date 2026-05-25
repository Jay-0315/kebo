import { useRef, useState } from "react";
import { Heart, Plus, X, Pencil, Trash2, MessageCircle, Image, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAppData } from "../context/AppDataContext";
import { useLang } from "../context/LangContext";
import { formatRelativeTime } from "../lib/story-storage";
import { compressImage } from "../lib/image-utils";
import TitleBadge from "./TitleBadge";
import type { CommunityPost, PostCategory } from "../types/domain";

const CATEGORY_OPTIONS: PostCategory[] = ["brag", "tip", "chat"];

const CAT_STYLE: Record<PostCategory, string> = {
  brag: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  tip: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  chat: "bg-muted text-muted-foreground",
};

export default function CommunityPage() {
  const navigate = useNavigate();
  const { posts, profile, createPost, updatePost, deletePost, togglePostLike } = useAppData();
  const { t, lang } = useLang();

  const [activeTab, setActiveTab] = useState<PostCategory | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [content, setContent] = useState("");
  const [postCategory, setPostCategory] = useState<PostCategory>("chat");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const catLabel = (cat: PostCategory) => t(`community.${cat}` as Parameters<typeof t>[0]);

  const visiblePosts = posts.filter((p) => activeTab === "all" || p.category === activeTab);

  const openCreate = () => {
    setEditingPost(null);
    setContent("");
    setPostCategory("chat");
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (post: CommunityPost) => {
    setEditingPost(post);
    setContent(post.content);
    setPostCategory(post.category);
    setImagePreview(post.imageUrl);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setContent("");
    setImagePreview(null);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(await compressImage(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const draft = { content, category: postCategory, imageUrl: imagePreview ?? undefined };
      if (editingPost) {
        await updatePost(editingPost.id, draft);
      } else {
        await createPost(draft);
      }
      closeForm();
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: (PostCategory | "all")[] = ["all", ...CATEGORY_OPTIONS];

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2>{t("nav.community")}</h2>
        <button
          onClick={openCreate}
          className="bg-primary/80 text-primary-foreground rounded-md w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-muted p-1 rounded-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
              activeTab === tab ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" ? t("community.all") : catLabel(tab)}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-3">
        {visiblePosts.length === 0 ? (
          <div className="bg-card rounded border border-border p-10 text-center text-muted-foreground text-sm">
            {t("community.no_posts")}
          </div>
        ) : (
          visiblePosts.map((post) => (
            <div
              key={post.id}
              className="bg-card rounded border border-border hover:border-primary/20 transition-colors"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between gap-3 p-4 pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-accent/70 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {post.authorName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{post.authorName}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${CAT_STYLE[post.category]}`}>
                        {catLabel(post.category)}
                      </span>
                    </div>
                    {post.authorEquippedTitleId && (
                      <TitleBadge titleId={post.authorEquippedTitleId} size="xs" />
                    )}
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt, lang)}</p>
                  </div>
                </div>
                {post.authorId === profile.id && (
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => openEdit(post)} className="p-1.5 rounded bg-muted hover:bg-accent/20 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deletePost(post.id)} className="p-1.5 rounded bg-muted text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 내용 + 이미지 */}
              <div
                className="px-4 pt-3 pb-2 cursor-pointer"
                onClick={() => navigate(`/community/${post.id}`)}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 mb-2">{post.content}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-full max-h-56 object-cover rounded-md border border-border"
                  />
                )}
              </div>

              {/* 최근 댓글 미리보기 (최대 3개) */}
              {post.recentComments.length > 0 && (
                <div className="mx-4 mb-2 bg-muted/50 rounded-md p-2 space-y-1">
                  {post.recentComments.map((c) => (
                    <p key={c.id} className="text-xs text-muted-foreground line-clamp-1">
                      <span className="font-medium text-foreground/70">{c.authorName}</span>{" "}
                      {c.content}
                    </p>
                  ))}
                </div>
              )}

              {/* 하단 액션 바 */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-border text-muted-foreground">
                <button
                  onClick={(e) => { e.stopPropagation(); togglePostLike(post.id); }}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${post.isLiked ? "text-primary" : "hover:text-primary"}`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                  {post.likes}
                </button>
                <button
                  onClick={() => navigate(`/community/${post.id}`)}
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {post.commentCount}
                </button>
                <button
                  onClick={() => navigate(`/community/${post.id}`)}
                  className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("community.view_detail")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 작성/수정 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" onClick={closeForm}>
          <div className="bg-card rounded-t-xl sm:rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3>{editingPost ? t("community.edit_post") : t("community.new_post")}</h3>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 카테고리 */}
              <div className="flex gap-2">
                {CATEGORY_OPTIONS.map((cat) => (
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
                    {catLabel(cat)}
                  </button>
                ))}
              </div>

              {/* 내용 */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t("community.placeholder")}
                className="w-full px-4 py-3 bg-input-background rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-none text-sm"
                required
              />

              {/* 이미지 업로드 */}
              <div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleImage} />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="" className="w-full max-h-48 object-cover rounded-md border border-border" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-border rounded-md text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    {t("community.add_image")}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary/80 text-primary-foreground rounded-md py-3 font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              >
                {submitting ? "..." : editingPost ? t("community.update") : t("community.submit")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
