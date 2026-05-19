import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { X, Camera, Check, Trash2, Smile } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { PIXEL_EMOJI_LIST, getPixelEmoji } from "./PixelEmojis";
import { loadStories, saveStories } from "../lib/story-storage";

const STORY_GRADIENTS = [
  "linear-gradient(145deg,#1a1a2e,#16213e,#0f3460)",
  "linear-gradient(145deg,#2d1b69,#11998e,#38ef7d)",
  "linear-gradient(145deg,#4a0072,#c62a88,#f9a825)",
  "linear-gradient(145deg,#0d47a1,#1565c0,#29b6f6)",
  "linear-gradient(145deg,#1b5e20,#388e3c,#a5d6a7)",
];
const getGradient = (id: number) => STORY_GRADIENTS[id % STORY_GRADIENTS.length];

export default function StoryCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, profilePhoto } = useAppData();
  const member: { id: number; name: string } | undefined = location.state?.member;

  const existing = member ? loadStories()[member.id] : undefined;

  const [text, setText] = useState(existing?.text ?? "");
  const [photo, setPhoto] = useState<string | null>(existing?.photo ?? null);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>(existing?.emojis ?? []);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleEmoji = (key: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length < 5
        ? [...prev, key]
        : prev,
    );
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
      next[member.id] = {
        text: text.trim(),
        photo,
        emojis: selectedEmojis,
        createdAt: new Date().toISOString(),
      };
    }
    saveStories(next);
    navigate(-1);
  };

  const handleDelete = () => {
    if (!member) return;
    const next = loadStories();
    delete next[member.id];
    saveStories(next);
    navigate(-1);
  };

  const isEmpty = !text.trim() && !photo && selectedEmojis.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* ── Header ── */}
      <div className="relative flex items-center justify-between px-4 pt-11 pb-3 shrink-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center text-white rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 overflow-hidden shrink-0 flex items-center justify-center">
            {profilePhoto ? (
              <img src={profilePhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-xs">{profile.name[0]}</span>
            )}
          </div>
          <span className="text-white font-semibold text-sm">{profile.name}</span>
        </div>

        <button
          onClick={handleSave}
          disabled={isEmpty}
          className="w-10 h-10 flex items-center justify-center text-white rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-30"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background */}
        {photo ? (
          <img src={photo} alt="story" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer"
            style={{ background: getGradient(member?.id ?? 0) }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/40 text-sm tracking-wide">탭하여 사진 추가</p>
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Photo controls */}
        {photo && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setPhoto(null)}
              className="bg-black/50 text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-black/70 transition-colors"
            >
              <X className="w-3 h-3" />
              제거
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black/50 text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-black/70 transition-colors"
            >
              <Camera className="w-3 h-3" />
              변경
            </button>
          </div>
        )}

        {/* Emoji preview overlay */}
        {selectedEmojis.length > 0 && (
          <div className="absolute bottom-32 left-5 flex gap-5 z-10">
            {selectedEmojis.map((key, i) => {
              const def = getPixelEmoji(key);
              if (!def) return null;
              const { Component } = def;
              return (
                <div key={`${key}-${i}`} style={{ transform: "scale(2.8)", transformOrigin: "bottom left" }}>
                  <Component />
                </div>
              );
            })}
          </div>
        )}

        {/* Text preview overlay */}
        {text && (
          <div className="absolute bottom-8 left-5 right-5 z-10">
            <p className="text-white text-xl font-semibold leading-relaxed break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {text}
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom panel ── */}
      <div className="shrink-0 bg-black/95 px-4 pt-3 pb-8 space-y-3 z-30">
        {/* Emoji picker toggle */}
        <div>
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="flex items-center gap-2 text-white/50 text-xs mb-2 hover:text-white/70 transition-colors"
          >
            <Smile className="w-4 h-4" />
            이모지 선택
            {selectedEmojis.length > 0 && (
              <span className="text-white/70 bg-white/10 rounded-full px-2 py-0.5">
                {selectedEmojis.length}/5
              </span>
            )}
          </button>

          {showPicker && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PIXEL_EMOJI_LIST.map(({ key, Component }) => {
                const selected = selectedEmojis.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleEmoji(key)}
                    className={`shrink-0 p-2 rounded-xl transition-all active:scale-90 ${
                      selected
                        ? "bg-white/25 ring-2 ring-white/50 scale-110"
                        : "bg-white/5 hover:bg-white/15"
                    }`}
                  >
                    <Component />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Text input row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 100))}
              placeholder="오늘의 한 마디..."
              className="w-full bg-white/10 border border-white/15 text-white placeholder:text-white/25 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            {text.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/25 pointer-events-none">
                {text.length}/100
              </span>
            )}
          </div>
          {existing && (
            <button
              onClick={handleDelete}
              className="w-11 h-11 flex items-center justify-center bg-red-500/15 text-red-400 rounded-xl hover:bg-red-500/25 transition-colors shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />
    </div>
  );
}
