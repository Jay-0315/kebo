import { useLocation, useNavigate } from "react-router";
import { ArrowLeft, Clock, ImageOff } from "lucide-react";
import { getPixelEmoji } from "./PixelEmojis";

const STORY_KEY = "kebo-member-stories";

interface StoryEntry {
  text: string;
  photo: string | null;
  emojis?: string[];
  createdAt: string;
}

function loadStories(): Record<number, StoryEntry> {
  try { return JSON.parse(localStorage.getItem(STORY_KEY) ?? "{}") as Record<number, StoryEntry>; }
  catch { return {}; }
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function StoryViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const member: { id: number; name: string } | undefined = location.state?.member;

  const stories = loadStories();
  const story = member ? stories[member.id] : undefined;

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
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/70 to-accent/80 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base leading-none">
              {member?.name[0] ?? "?"}
            </span>
          </div>
          <div>
            <h2 className="text-base">{member?.name ?? "멤버"}의 스토리</h2>
            {story && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(story.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {story ? (
        <div className="space-y-4">
          {/* Photo */}
          {story.photo ? (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <img src={story.photo} alt="story" className="w-full object-cover" />
            </div>
          ) : null}

          {/* Pixel emojis */}
          {story.emojis && story.emojis.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {story.emojis.map((key, i) => {
                  const def = getPixelEmoji(key);
                  if (!def) return null;
                  const { Component } = def;
                  return (
                    <div key={`${key}-${i}`} className="scale-150">
                      <Component />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Text */}
          {story.text ? (
            <div className="bg-card rounded-xl border border-border p-5">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{story.text}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ImageOff className="w-7 h-7 opacity-40" />
          </div>
          <div className="text-center">
            <p className="font-medium">{member?.name ?? "이 멤버"}의 스토리</p>
            <p className="text-sm text-muted-foreground mt-1">아직 올린 스토리가 없어요</p>
          </div>
        </div>
      )}
    </div>
  );
}
