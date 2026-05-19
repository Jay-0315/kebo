import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Camera, Trash2, X } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { PIXEL_EMOJI_LIST, getPixelEmoji } from "./PixelEmojis";

const STORY_KEY = "kebo-member-stories";

interface StoryEntry {
  text: string;
  photo: string | null;
  emojis: string[];
  createdAt: string;
}

function loadStories(): Record<number, StoryEntry> {
  try { return JSON.parse(localStorage.getItem(STORY_KEY) ?? "{}") as Record<number, StoryEntry>; }
  catch { return {}; }
}

export default function StoryCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, profilePhoto } = useAppData();
  const member: { id: number; name: string } | undefined = location.state?.member;

  const stories = loadStories();
  const existing = member ? stories[member.id] : undefined;

  const [text, setText] = useState(existing?.text ?? "");
  const [photo, setPhoto] = useState<string | null>(existing?.photo ?? null);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(existing?.emojis ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleEmoji = (key: string) => {
    setSelectedEmojis((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 5) return prev;
      return [...prev, key];
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setPhoto(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    if (!member) return;
    const next = loadStories();
    if (!text.trim() && !photo && selectedEmojis.length === 0) {
      delete next[member.id];
    } else {
      next[member.id] = { text: text.trim(), photo, emojis: selectedEmojis, createdAt: new Date().toISOString() };
    }
    localStorage.setItem(STORY_KEY, JSON.stringify(next));
    navigate(-1);
  };

  const handleDelete = () => {
    if (!member) return;
    const next = loadStories();
    delete next[member.id];
    localStorage.setItem(STORY_KEY, JSON.stringify(next));
    navigate(-1);
  };

  return (
    <div className="max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/70 to-accent/80 overflow-hidden shrink-0 flex items-center justify-center">
            {profilePhoto ? (
              <img src={profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-base leading-none">{profile.name[0]}</span>
            )}
          </div>
          <div>
            <h2 className="text-base">내 스토리 작성</h2>
            <p className="text-xs text-muted-foreground">{profile.name}</p>
          </div>
        </div>
      </div>

      {/* Photo section */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {photo ? (
          <div className="relative">
            <img src={photo} alt="story" className="w-full object-cover max-h-72" />
            <button
              onClick={() => setPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white rounded-full px-3 py-1.5 text-xs hover:bg-black/80 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              변경
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-44 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <Camera className="w-9 h-9 opacity-30" />
            <span className="text-sm">사진 추가 (선택)</span>
            <span className="text-xs text-muted-foreground/60">탭하여 파일 선택</span>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Text section */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">오늘의 한 마디</p>

        {/* Pixel emoji picker — toggle select, max 5 */}
        <div>
          <div className="flex flex-wrap gap-1 mb-2">
            {PIXEL_EMOJI_LIST.map(({ key, Component }) => {
              const selected = selectedEmojis.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleEmoji(key)}
                  title={key}
                  className={`p-1 rounded transition-all active:scale-95 ${
                    selected
                      ? "bg-primary/20 ring-2 ring-primary scale-110"
                      : "hover:bg-muted hover:scale-110"
                  }`}
                >
                  <Component />
                </button>
              );
            })}
          </div>

          {/* Selected emojis display row */}
          {selectedEmojis.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[10px] text-muted-foreground">선택됨:</span>
              {selectedEmojis.map((key) => {
                const def = getPixelEmoji(key);
                if (!def) return null;
                const { Component } = def;
                return (
                  <button
                    key={key}
                    onClick={() => toggleEmoji(key)}
                    className="relative group"
                    title={`${key} 제거`}
                  >
                    <Component />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive text-destructive-foreground rounded-full text-[8px] hidden group-hover:flex items-center justify-center leading-none">×</span>
                  </button>
                );
              })}
              <span className="text-[10px] text-muted-foreground ml-1">{selectedEmojis.length}/5</span>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 100))}
            placeholder="오늘 어떤 하루를 보내셨나요?"
            rows={3}
            className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
          />
          <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground pointer-events-none">
            {text.length}/100
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={!text.trim() && !photo && selectedEmojis.length === 0}
          className="flex-1 bg-primary/80 text-primary-foreground rounded-lg py-3 text-sm font-medium hover:shadow-md transition-all disabled:opacity-40"
        >
          스토리 저장
        </button>
        {existing && (
          <button
            onClick={handleDelete}
            className="bg-destructive/10 text-destructive rounded-lg px-4 text-sm font-medium hover:bg-destructive/20 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
