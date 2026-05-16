import { CHARACTERS, getCurrentCharacter } from "../data/characters";
import type { CharacterType } from "../data/characters";

interface Colors { p: string; s: string; a: string }

const B = "#1a1a1a";
const W = "#FFFFFF";

/* ─── Sprite renderers (16×16 viewBox) ─── */

const slime = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="6" y="3" width="2" height="1" fill={s} />
    <rect x="5" y="4" width="6" height="1" fill={p} />
    <rect x="4" y="5" width="8" height="1" fill={p} />
    <rect x="3" y="6" width="10" height="4" fill={p} />
    <rect x="4" y="10" width="8" height="1" fill={p} />
    <rect x="5" y="11" width="6" height="1" fill={p} />
    <rect x="4" y="12" width="2" height="1" fill={p} />
    <rect x="7" y="12" width="2" height="1" fill={p} />
    <rect x="10" y="12" width="2" height="1" fill={p} />
    <rect x="6" y="7" width="1" height="2" fill={B} />
    <rect x="9" y="7" width="1" height="2" fill={B} />
    <rect x="7" y="9" width="2" height="1" fill={a} />
  </svg>
);

const cat = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="3" y="2" width="2" height="3" fill={p} />
    <rect x="11" y="2" width="2" height="3" fill={p} />
    <rect x="4" y="3" width="1" height="1" fill={a} />
    <rect x="11" y="3" width="1" height="1" fill={a} />
    <rect x="3" y="5" width="10" height="5" fill={p} />
    <rect x="5" y="6" width="2" height="2" fill={B} />
    <rect x="9" y="6" width="2" height="2" fill={B} />
    <rect x="5" y="6" width="1" height="1" fill={W} />
    <rect x="9" y="6" width="1" height="1" fill={W} />
    <rect x="7" y="8" width="2" height="1" fill={a} />
    <rect x="2" y="8" width="3" height="1" fill={s} />
    <rect x="11" y="8" width="3" height="1" fill={s} />
    <rect x="4" y="10" width="8" height="4" fill={p} />
    <rect x="12" y="10" width="2" height="1" fill={s} />
    <rect x="13" y="11" width="2" height="2" fill={s} />
    <rect x="5" y="14" width="2" height="1" fill={s} />
    <rect x="9" y="14" width="2" height="1" fill={s} />
  </svg>
);

const rabbit = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="5" y="0" width="2" height="5" fill={p} />
    <rect x="9" y="0" width="2" height="5" fill={p} />
    <rect x="5" y="1" width="1" height="3" fill={a} />
    <rect x="9" y="1" width="1" height="3" fill={a} />
    <rect x="4" y="5" width="8" height="5" fill={p} />
    <rect x="5" y="6" width="2" height="2" fill={B} />
    <rect x="9" y="6" width="2" height="2" fill={B} />
    <rect x="5" y="6" width="1" height="1" fill={W} />
    <rect x="9" y="6" width="1" height="1" fill={W} />
    <rect x="7" y="8" width="2" height="1" fill={a} />
    <rect x="3" y="10" width="10" height="4" fill={p} />
    <rect x="1" y="10" width="2" height="3" fill={s} />
    <rect x="13" y="10" width="2" height="3" fill={s} />
    <rect x="4" y="14" width="3" height="1" fill={s} />
    <rect x="9" y="14" width="3" height="1" fill={s} />
  </svg>
);

const ghost = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="5" y="2" width="6" height="1" fill={p} />
    <rect x="4" y="3" width="8" height="1" fill={p} />
    <rect x="3" y="4" width="10" height="7" fill={p} />
    <rect x="3" y="11" width="2" height="2" fill={p} />
    <rect x="6" y="11" width="2" height="2" fill={p} />
    <rect x="9" y="11" width="2" height="2" fill={p} />
    <rect x="12" y="11" width="2" height="2" fill={p} />
    <rect x="5" y="5" width="2" height="3" fill={B} />
    <rect x="9" y="5" width="2" height="3" fill={B} />
    <rect x="5" y="5" width="1" height="1" fill={a} />
    <rect x="9" y="5" width="1" height="1" fill={a} />
    <rect x="6" y="9" width="4" height="1" fill={s} />
  </svg>
);

const plant = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="5" y="11" width="6" height="3" fill={s} />
    <rect x="4" y="13" width="8" height="2" fill={s} />
    <rect x="5" y="11" width="6" height="1" fill="#5D4037" />
    <rect x="7" y="7" width="2" height="4" fill="#2E7D32" />
    <rect x="3" y="7" width="4" height="2" fill={p} />
    <rect x="9" y="6" width="4" height="2" fill={p} />
    <rect x="3" y="5" width="3" height="2" fill={p} />
    <rect x="6" y="2" width="4" height="1" fill={a} />
    <rect x="5" y="3" width="6" height="2" fill={a} />
    <rect x="6" y="5" width="4" height="1" fill={a} />
    <rect x="7" y="3" width="2" height="2" fill="#FFF176" />
  </svg>
);

const fish = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="5" width="3" height="2" fill={s} />
    <rect x="0" y="9" width="3" height="2" fill={s} />
    <rect x="1" y="7" width="2" height="2" fill={s} />
    <rect x="3" y="5" width="9" height="6" fill={p} />
    <rect x="2" y="6" width="11" height="4" fill={p} />
    <rect x="5" y="3" width="4" height="2" fill={s} />
    <rect x="6" y="2" width="2" height="1" fill={s} />
    <rect x="4" y="7" width="2" height="2" fill={a} />
    <rect x="7" y="7" width="2" height="2" fill={a} />
    <rect x="11" y="6" width="2" height="2" fill={W} />
    <rect x="12" y="7" width="1" height="1" fill={B} />
    <rect x="13" y="8" width="1" height="1" fill={B} />
  </svg>
);

const owl = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="4" y="1" width="2" height="2" fill={p} />
    <rect x="10" y="1" width="2" height="2" fill={p} />
    <rect x="4" y="3" width="8" height="5" fill={p} />
    <rect x="3" y="4" width="10" height="3" fill={p} />
    <rect x="4" y="3" width="4" height="4" fill={s} />
    <rect x="8" y="3" width="4" height="4" fill={s} />
    <rect x="5" y="4" width="2" height="2" fill={B} />
    <rect x="9" y="4" width="2" height="2" fill={B} />
    <rect x="5" y="4" width="1" height="1" fill={W} />
    <rect x="9" y="4" width="1" height="1" fill={W} />
    <rect x="7" y="6" width="2" height="1" fill={a} />
    <rect x="1" y="8" width="3" height="5" fill={s} />
    <rect x="12" y="8" width="3" height="5" fill={s} />
    <rect x="4" y="8" width="8" height="5" fill={p} />
    <rect x="5" y="9" width="6" height="3" fill={s} />
    <rect x="5" y="13" width="2" height="2" fill={a} />
    <rect x="9" y="13" width="2" height="2" fill={a} />
  </svg>
);

const bear = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="3" y="2" width="3" height="2" fill={p} />
    <rect x="10" y="2" width="3" height="2" fill={p} />
    <rect x="4" y="3" width="1" height="1" fill={a} />
    <rect x="11" y="3" width="1" height="1" fill={a} />
    <rect x="3" y="4" width="10" height="5" fill={p} />
    <rect x="2" y="5" width="12" height="3" fill={p} />
    <rect x="5" y="7" width="6" height="2" fill={s} />
    <rect x="5" y="5" width="2" height="2" fill={B} />
    <rect x="9" y="5" width="2" height="2" fill={B} />
    <rect x="5" y="5" width="1" height="1" fill={W} />
    <rect x="9" y="5" width="1" height="1" fill={W} />
    <rect x="7" y="7" width="2" height="1" fill={B} />
    <rect x="3" y="9" width="10" height="4" fill={p} />
    <rect x="2" y="10" width="12" height="2" fill={p} />
    <rect x="1" y="9" width="2" height="3" fill={p} />
    <rect x="13" y="9" width="2" height="3" fill={p} />
    <rect x="4" y="13" width="3" height="2" fill={s} />
    <rect x="9" y="13" width="3" height="2" fill={s} />
  </svg>
);

const turtle = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="4" y="3" width="8" height="8" fill={s} />
    <rect x="3" y="4" width="10" height="6" fill={s} />
    <rect x="5" y="4" width="6" height="1" fill={p} />
    <rect x="4" y="6" width="8" height="1" fill={p} />
    <rect x="5" y="8" width="6" height="1" fill={p} />
    <rect x="7" y="4" width="1" height="6" fill={p} />
    <rect x="4" y="1" width="4" height="2" fill={p} />
    <rect x="5" y="2" width="3" height="2" fill={p} />
    <rect x="4" y="1" width="1" height="1" fill={B} />
    <rect x="1" y="6" width="3" height="2" fill={p} />
    <rect x="12" y="6" width="3" height="2" fill={p} />
    <rect x="3" y="10" width="3" height="2" fill={p} />
    <rect x="10" y="10" width="3" height="2" fill={p} />
    <rect x="11" y="9" width="2" height="1" fill={a} />
  </svg>
);

const fox = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="3" y="1" width="3" height="4" fill={p} />
    <rect x="10" y="1" width="3" height="4" fill={p} />
    <rect x="4" y="2" width="1" height="2" fill={W} />
    <rect x="11" y="2" width="1" height="2" fill={W} />
    <rect x="3" y="5" width="9" height="4" fill={p} />
    <rect x="5" y="7" width="5" height="3" fill={s} />
    <rect x="5" y="6" width="2" height="2" fill={B} />
    <rect x="9" y="6" width="2" height="2" fill={B} />
    <rect x="5" y="6" width="1" height="1" fill={W} />
    <rect x="9" y="6" width="1" height="1" fill={W} />
    <rect x="7" y="8" width="2" height="1" fill={B} />
    <rect x="4" y="9" width="7" height="4" fill={p} />
    <rect x="11" y="7" width="4" height="5" fill={a} />
    <rect x="12" y="6" width="3" height="1" fill={a} />
    <rect x="12" y="12" width="3" height="1" fill={W} />
    <rect x="5" y="13" width="2" height="2" fill={s} />
    <rect x="8" y="13" width="2" height="2" fill={s} />
  </svg>
);

const wolf = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="3" y="0" width="3" height="4" fill={p} />
    <rect x="10" y="0" width="3" height="4" fill={p} />
    <rect x="4" y="1" width="1" height="2" fill={s} />
    <rect x="11" y="1" width="1" height="2" fill={s} />
    <rect x="3" y="4" width="10" height="4" fill={p} />
    <rect x="2" y="5" width="12" height="2" fill={p} />
    <rect x="4" y="7" width="8" height="3" fill={s} />
    <rect x="4" y="4" width="2" height="1" fill={a} />
    <rect x="10" y="4" width="2" height="1" fill={a} />
    <rect x="7" y="9" width="2" height="1" fill={B} />
    <rect x="3" y="10" width="10" height="4" fill={p} />
    <rect x="3" y="10" width="10" height="1" fill={s} />
    <rect x="4" y="14" width="3" height="1" fill={s} />
    <rect x="9" y="14" width="3" height="1" fill={s} />
    <rect x="13" y="10" width="2" height="3" fill={p} />
    <rect x="14" y="9" width="1" height="1" fill={p} />
  </svg>
);

const robot = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="7" y="0" width="2" height="2" fill={s} />
    <rect x="6" y="1" width="4" height="1" fill={a} />
    <rect x="3" y="2" width="10" height="6" fill={p} />
    <rect x="2" y="3" width="12" height="4" fill={p} />
    <rect x="4" y="3" width="3" height="3" fill={a} />
    <rect x="9" y="3" width="3" height="3" fill={a} />
    <rect x="5" y="4" width="1" height="1" fill={W} />
    <rect x="10" y="4" width="1" height="1" fill={W} />
    <rect x="5" y="6" width="6" height="1" fill={B} />
    <rect x="6" y="6" width="1" height="1" fill={p} />
    <rect x="8" y="6" width="1" height="1" fill={p} />
    <rect x="10" y="6" width="1" height="1" fill={p} />
    <rect x="3" y="8" width="10" height="6" fill={p} />
    <rect x="2" y="9" width="12" height="4" fill={p} />
    <rect x="5" y="9" width="6" height="4" fill={s} />
    <rect x="7" y="10" width="2" height="2" fill={a} />
    <rect x="0" y="8" width="3" height="5" fill={p} />
    <rect x="13" y="8" width="3" height="5" fill={p} />
    <rect x="4" y="14" width="3" height="1" fill={s} />
    <rect x="9" y="14" width="3" height="1" fill={s} />
  </svg>
);

const dragon = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="5" y="1" width="1" height="2" fill={a} />
    <rect x="9" y="1" width="1" height="2" fill={a} />
    <rect x="5" y="2" width="5" height="3" fill={p} />
    <rect x="4" y="3" width="7" height="3" fill={p} />
    <rect x="5" y="3" width="1" height="1" fill={a} />
    <rect x="9" y="3" width="1" height="1" fill={a} />
    <rect x="4" y="6" width="8" height="5" fill={p} />
    <rect x="3" y="7" width="10" height="3" fill={p} />
    <rect x="6" y="7" width="4" height="3" fill={s} />
    <rect x="1" y="6" width="3" height="4" fill={s} />
    <rect x="12" y="6" width="3" height="4" fill={s} />
    <rect x="0" y="7" width="2" height="3" fill={a} />
    <rect x="14" y="7" width="2" height="3" fill={a} />
    <rect x="5" y="11" width="2" height="3" fill={p} />
    <rect x="9" y="11" width="2" height="3" fill={p} />
    <rect x="11" y="8" width="2" height="1" fill={p} />
    <rect x="12" y="9" width="2" height="1" fill={p} />
    <rect x="13" y="10" width="2" height="2" fill={a} />
  </svg>
);

const phoenix = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="6" y="0" width="4" height="2" fill={a} />
    <rect x="5" y="1" width="2" height="1" fill={a} />
    <rect x="9" y="1" width="2" height="1" fill={a} />
    <rect x="5" y="2" width="6" height="4" fill={p} />
    <rect x="4" y="3" width="8" height="2" fill={p} />
    <rect x="6" y="3" width="1" height="1" fill={B} />
    <rect x="9" y="3" width="1" height="1" fill={B} />
    <rect x="7" y="5" width="2" height="1" fill={a} />
    <rect x="5" y="6" width="6" height="5" fill={p} />
    <rect x="4" y="7" width="8" height="3" fill={p} />
    <rect x="1" y="5" width="4" height="5" fill={s} />
    <rect x="11" y="5" width="4" height="5" fill={s} />
    <rect x="0" y="6" width="2" height="4" fill={a} />
    <rect x="14" y="6" width="2" height="4" fill={a} />
    <rect x="6" y="11" width="4" height="2" fill={s} />
    <rect x="5" y="12" width="6" height="2" fill={a} />
    <rect x="6" y="14" width="4" height="1" fill={a} />
    <rect x="6" y="11" width="1" height="3" fill={p} />
    <rect x="9" y="11" width="1" height="3" fill={p} />
  </svg>
);

const unicorn = ({ p, s, a }: Colors, sz: number) => (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="4" y="0" width="1" height="3" fill="#FFD700" />
    <rect x="5" y="1" width="1" height="2" fill="#FFD700" />
    <rect x="6" y="1" width="1" height="3" fill={a} />
    <rect x="7" y="2" width="1" height="4" fill={a} />
    <rect x="8" y="1" width="1" height="3" fill="#FFD93D" />
    <rect x="3" y="3" width="8" height="4" fill={s} />
    <rect x="2" y="4" width="10" height="2" fill={s} />
    <rect x="4" y="4" width="2" height="2" fill={B} />
    <rect x="4" y="4" width="1" height="1" fill={W} />
    <rect x="4" y="7" width="8" height="5" fill={s} />
    <rect x="3" y="8" width="10" height="3" fill={s} />
    <rect x="12" y="7" width="2" height="1" fill={a} />
    <rect x="13" y="8" width="2" height="3" fill={a} />
    <rect x="13" y="10" width="2" height="2" fill="#FFD93D" />
    <rect x="5" y="12" width="2" height="3" fill={s} />
    <rect x="8" y="12" width="2" height="3" fill={s} />
    <rect x="11" y="12" width="2" height="3" fill={s} />
  </svg>
);

/* ─── Sprite map ─── */
const SPRITES: Record<CharacterType, (c: Colors, sz: number) => JSX.Element> = {
  slime: slime, cat: cat, rabbit: rabbit, ghost: ghost,
  plant: plant, fish: fish, owl: owl, bear: bear,
  turtle: turtle, fox: fox, wolf: wolf, robot: robot,
  dragon: dragon, phoenix: phoenix, unicorn: unicorn,
};

/* ─── Public component ─── */
interface PixelCharacterProps {
  /** Backward-compat: renders 4-stage character by level range */
  level?: number;
  /** New: renders a specific character from the 100-char registry */
  characterId?: number;
  size?: number;
}

export default function PixelCharacter({ level, characterId, size = 128 }: PixelCharacterProps) {
  if (characterId !== undefined) {
    const def = CHARACTERS.find((c) => c.id === characterId);
    if (def) return <div className="inline-block">{SPRITES[def.type](def.colors, size)}</div>;
  }

  if (level !== undefined) {
    const def = getCurrentCharacter(level);
    return <div className="inline-block">{SPRITES[def.type](def.colors, size)}</div>;
  }

  return <div className="inline-block">{slime({ p: "#7CB342", s: "#AED581", a: "#FFF176" }, size)}</div>;
}

/** Render a sprite by type + colors directly (used in Pokédex grid) */
export function PixelSprite({
  type, colors, size = 48,
}: { type: CharacterType; colors: { p: string; s: string; a: string }; size?: number }) {
  return <div className="inline-block">{SPRITES[type](colors, size)}</div>;
}
