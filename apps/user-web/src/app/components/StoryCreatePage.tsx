import { useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { X, Camera, Check, Trash2, Smile, Plus } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { PIXEL_EMOJI_LIST, getPixelEmoji } from "./PixelEmojis";
import { loadStories, saveStories } from "../lib/story-storage";
import type { StoryFrame, EmojiItem } from "../lib/story-storage";

const STORY_GRADIENTS = [
  "linear-gradient(145deg,#1a1a2e,#16213e,#0f3460)",
  "linear-gradient(145deg,#2d1b69,#11998e,#38ef7d)",
  "linear-gradient(145deg,#4a0072,#c62a88,#f9a825)",
  "linear-gradient(145deg,#0d47a1,#1565c0,#29b6f6)",
  "linear-gradient(145deg,#1b5e20,#388e3c,#a5d6a7)",
];
const getGradient = (idx: number) => STORY_GRADIENTS[idx % STORY_GRADIENTS.length];

const MAX_FRAMES = 10;

// Default spread positions for newly added emojis
const EMOJI_DEFAULTS: { x: number; y: number }[] = [
  { x: 50, y: 50 },
  { x: 25, y: 50 },
  { x: 75, y: 50 },
  { x: 50, y: 25 },
  { x: 50, y: 75 },
];

const DEFAULT_FRAME = (): StoryFrame => ({
  photo: null,
  text: "",
  textX: 50,
  textY: 55,
  emojis: [],
});

export default function StoryCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, profilePhoto } = useAppData();
  const member: { id: string; name: string } | undefined = location.state?.member;

  const existing = member ? loadStories()[member.id] : undefined;

  const [frames, setFrames] = useState<StoryFrame[]>(
    existing?.frames?.length ? existing.frames.map((f) => ({ ...f })) : [DEFAULT_FRAME()],
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [draggingEmojiIdx, setDraggingEmojiIdx] = useState<number | null>(null);
  const draggingEmojiRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const active = frames[activeIdx];

  const updateActive = useCallback((patch: Partial<StoryFrame>) => {
    setFrames((prev) => prev.map((f, i) => (i === activeIdx ? { ...f, ...patch } : f)));
  }, [activeIdx]);

  /* ── Photo ── */
  const compressImage = (dataUrl: string, maxDim = 900, quality = 0.65): Promise<string> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (typeof ev.target?.result === "string") {
        const compressed = await compressImage(ev.target.result);
        updateActive({ photo: compressed });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── Frames ── */
  const addFrame = () => {
    if (frames.length >= MAX_FRAMES) return;
    const next = [...frames, DEFAULT_FRAME()];
    setFrames(next);
    setActiveIdx(next.length - 1);
  };

  const removeFrame = (idx: number) => {
    if (frames.length <= 1) return;
    const next = frames.filter((_, i) => i !== idx);
    setFrames(next);
    setActiveIdx(Math.min(activeIdx, next.length - 1));
  };

  /* ── Draggable text ── */
  const handleTextPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingText(true);
  };

  const handleTextPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingText || !canvasRef.current) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    updateActive({ textX: x, textY: y });
  };

  const handleTextPointerUp = () => setIsDraggingText(false);

  /* ── Draggable emojis ── */
  const handleEmojiPointerDown = (e: React.PointerEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingEmojiRef.current = idx;
    setDraggingEmojiIdx(idx);
  };

  const handleEmojiPointerMove = useCallback((e: React.PointerEvent, idx: number) => {
    if (draggingEmojiRef.current !== idx || !canvasRef.current) return;
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    setFrames((prev) =>
      prev.map((f, fi) =>
        fi !== activeIdx
          ? f
          : { ...f, emojis: f.emojis.map((em, ei) => (ei === idx ? { ...em, x, y } : em)) },
      ),
    );
  }, [activeIdx]);

  const handleEmojiPointerUp = () => {
    draggingEmojiRef.current = null;
    setDraggingEmojiIdx(null);
  };

  /* ── Emoji toggle ── */
  const toggleEmoji = (key: string) => {
    const cur = active.emojis;
    const existingIdx = cur.findIndex((em) => em.key === key);
    if (existingIdx >= 0) {
      updateActive({ emojis: cur.filter((_, i) => i !== existingIdx) });
    } else if (cur.length < 5) {
      const pos = EMOJI_DEFAULTS[cur.length] ?? { x: 50, y: 50 };
      updateActive({ emojis: [...cur, { key, x: pos.x, y: pos.y }] });
    }
  };

  /* ── Save / Delete ── */
  const handleSave = () => {
    if (!member) return;
    const nonEmpty = frames.filter((f) => f.text.trim() || f.photo || f.emojis.length > 0);
    const next = loadStories();
    if (nonEmpty.length === 0) {
      delete next[member.id];
    } else {
      next[member.id] = { frames: nonEmpty, createdAt: existing?.createdAt ?? new Date().toISOString() };
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

  const isEmpty = frames.every((f) => !f.text.trim() && !f.photo && !f.emojis.length);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black select-none">
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
          <span className="text-white/40 text-xs">
            {activeIdx + 1}/{frames.length}
          </span>
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
      <div ref={canvasRef} className="flex-1 relative overflow-hidden touch-none">
        {/* Background */}
        {active.photo ? (
          <img src={active.photo} alt="story" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer"
            style={{ background: getGradient(activeIdx) }}
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
        {active.photo && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => updateActive({ photo: null })}
              className="bg-black/50 text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1"
            >
              <X className="w-3 h-3" /> 제거
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-black/50 text-white rounded-full px-3 py-1.5 text-xs flex items-center gap-1"
            >
              <Camera className="w-3 h-3" /> 변경
            </button>
          </div>
        )}

        {/* Draggable emojis */}
        {active.emojis.map((emoji: EmojiItem, i: number) => {
          const def = getPixelEmoji(emoji.key);
          if (!def) return null;
          const { Component } = def;
          const isDragging = draggingEmojiIdx === i;
          return (
            <div
              key={`${emoji.key}-${i}`}
              className="absolute z-10 cursor-move"
              style={{
                left: `${emoji.x}%`,
                top: `${emoji.y}%`,
                transform: "translate(-50%, -50%)",
                touchAction: "none",
              }}
              onPointerDown={(e) => handleEmojiPointerDown(e, i)}
              onPointerMove={(e) => handleEmojiPointerMove(e, i)}
              onPointerUp={handleEmojiPointerUp}
              onPointerCancel={handleEmojiPointerUp}
            >
              <div style={{ transform: "scale(2.8)", transformOrigin: "center" }}>
                <Component />
              </div>
              {!isDragging && (
                <p className="text-white/40 text-[9px] text-center mt-1 leading-none">꾹눌러이동</p>
              )}
            </div>
          );
        })}

        {/* Draggable text */}
        {active.text && (
          <div
            className="absolute z-10 cursor-move"
            style={{
              left: `${active.textX}%`,
              top: `${active.textY}%`,
              transform: "translate(-50%, -50%)",
              touchAction: "none",
            }}
            onPointerDown={handleTextPointerDown}
            onPointerMove={handleTextPointerMove}
            onPointerUp={handleTextPointerUp}
            onPointerCancel={handleTextPointerUp}
          >
            <p
              className="text-white text-xl font-semibold leading-relaxed break-words text-center max-w-[80vw]"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)", whiteSpace: "pre-wrap" }}
            >
              {active.text}
            </p>
            {!isDraggingText && (
              <p className="text-white/40 text-[10px] text-center mt-0.5">꾹 눌러서 이동</p>
            )}
          </div>
        )}
      </div>

      {/* ── Frame strip ── */}
      <div className="shrink-0 bg-black/95 px-4 pt-3 pb-1 z-30">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {frames.map((frame, idx) => (
            <div key={idx} className="relative shrink-0">
              <button
                onClick={() => setActiveIdx(idx)}
                className={`w-14 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === activeIdx ? "border-white scale-105" : "border-white/20"
                }`}
              >
                {frame.photo ? (
                  <img src={frame.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: getGradient(idx) }}
                  >
                    {frame.text ? (
                      <span className="text-white text-[8px] font-medium px-1 text-center line-clamp-3">
                        {frame.text}
                      </span>
                    ) : (
                      <Camera className="w-4 h-4 text-white/30" />
                    )}
                  </div>
                )}
              </button>
              {frames.length > 1 && (
                <button
                  onClick={() => removeFrame(idx)}
                  className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-white rounded-full flex items-center justify-center shadow"
                >
                  <X className="w-2.5 h-2.5 text-black" />
                </button>
              )}
            </div>
          ))}

          {frames.length < MAX_FRAMES && (
            <button
              onClick={addFrame}
              className="shrink-0 w-14 h-20 rounded-lg border-2 border-dashed border-white/25 flex items-center justify-center text-white/40 hover:border-white/50 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Bottom panel ── */}
      <div className="shrink-0 bg-black/95 px-4 pt-2 pb-8 space-y-3 z-30">
        {/* Emoji picker */}
        <div>
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="flex items-center gap-2 text-white/50 text-xs mb-2 hover:text-white/70 transition-colors"
          >
            <Smile className="w-4 h-4" />
            이모지 선택
            {active.emojis.length > 0 && (
              <span className="text-white/70 bg-white/10 rounded-full px-2 py-0.5">
                {active.emojis.length}/5
              </span>
            )}
          </button>

          {showPicker && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PIXEL_EMOJI_LIST.map(({ key, Component }) => {
                const selected = active.emojis.some((em) => em.key === key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleEmoji(key)}
                    className={`shrink-0 p-2 rounded-xl transition-all active:scale-90 ${
                      selected ? "bg-white/25 ring-2 ring-white/50 scale-110" : "bg-white/5 hover:bg-white/15"
                    }`}
                  >
                    <Component />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Text input */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              value={active.text}
              onChange={(e) => updateActive({ text: e.target.value.slice(0, 100) })}
              placeholder="오늘의 한 마디..."
              className="w-full bg-white/10 border border-white/15 text-white placeholder:text-white/25 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            {active.text.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/25 pointer-events-none">
                {active.text.length}/100
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
