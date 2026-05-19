export const STORY_KEY = "kebo-member-stories";

export interface StoryEntry {
  text: string;
  photo: string | null;
  emojis?: string[];
  createdAt: string;
}

export function loadStories(): Record<number, StoryEntry> {
  try {
    return JSON.parse(localStorage.getItem(STORY_KEY) ?? "{}") as Record<number, StoryEntry>;
  } catch {
    return {};
  }
}

export function saveStories(stories: Record<number, StoryEntry>): void {
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
