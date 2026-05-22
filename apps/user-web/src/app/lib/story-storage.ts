export const STORY_KEY = "kebo-member-stories";
const STORY_TTL_MS = 3 * 60 * 60 * 1000; // 3시간

export interface EmojiItem {
  key: string;
  x: number;  // 0–100 (%)
  y: number;  // 0–100 (%)
}

export interface StoryFrame {
  photo: string | null;
  text: string;
  textX: number;  // 0–100 (%)
  textY: number;  // 0–100 (%)
  emojis: EmojiItem[];
}

export interface StoryEntry {
  frames: StoryFrame[];
  createdAt: string;
}

type AnyEntry = Partial<StoryEntry> & {
  text?: string;
  photo?: string | null;
  emojis?: (string | EmojiItem)[];
};

function migrateEmojis(raw: (string | EmojiItem)[] | undefined): EmojiItem[] {
  if (!raw?.length) return [];
  return raw.map((item, i) =>
    typeof item === "string"
      ? { key: item, x: 20 + i * 15, y: 75 }
      : item,
  );
}

function migrateFrame(raw: Partial<StoryFrame> & { emojis?: (string | EmojiItem)[] }): StoryFrame {
  return {
    photo: raw.photo ?? null,
    text: raw.text ?? "",
    textX: raw.textX ?? 50,
    textY: raw.textY ?? 72,
    emojis: migrateEmojis(raw.emojis),
  };
}

export function loadStories(): Record<string, StoryEntry> {
  try {
    const raw = JSON.parse(localStorage.getItem(STORY_KEY) ?? "{}") as Record<string, AnyEntry>;
    const result: Record<string, StoryEntry> = {};
    const now = Date.now();
    let removedAny = false;

    for (const [key, entry] of Object.entries(raw)) {
      const createdAt = entry.createdAt ?? new Date().toISOString();
      if (now - new Date(createdAt).getTime() > STORY_TTL_MS) {
        removedAny = true;
        continue;
      }

      if (entry.frames && entry.frames.length > 0) {
        result[key] = {
          frames: entry.frames.map(migrateFrame),
          createdAt,
        };
      } else {
        result[key] = {
          frames: [{
            photo: entry.photo ?? null,
            text: entry.text ?? "",
            textX: 50,
            textY: 72,
            emojis: migrateEmojis(entry.emojis),
          }],
          createdAt,
        };
      }
    }

    if (removedAny) {
      localStorage.setItem(STORY_KEY, JSON.stringify(result));
    }

    return result;
  } catch {
    return {};
  }
}

export function saveStories(stories: Record<string, StoryEntry>): void {
  localStorage.setItem(STORY_KEY, JSON.stringify(stories));
}

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}
