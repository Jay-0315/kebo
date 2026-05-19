import { useState, type ReactElement } from "react";
import { CHARACTERS, getCurrentCharacter } from "../data/characters";
import type { CharacterType } from "../data/characters";

interface Colors { p: string; s: string; a: string }
type Frame = "idle" | "react";
type Renderer = (c: Colors, sz: number, f: Frame) => ReactElement;

const B = "#1a1a1a";
const W = "#FFFFFF";

/* ─── SLIME  idle=blob  react=Divide(두 개로 분열) ─── */
const slime: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* left mini-slime */}
    <rect x="2" y="3" width="2" height="1" fill={s} />
    <rect x="1" y="4" width="4" height="1" fill={p} />
    <rect x="0" y="5" width="6" height="4" fill={p} />
    <rect x="1" y="9" width="4" height="1" fill={p} />
    <rect x="1" y="10" width="1" height="1" fill={p} />
    <rect x="4" y="10" width="1" height="1" fill={p} />
    <rect x="1" y="6" width="1" height="2" fill={B} />
    <rect x="4" y="6" width="1" height="2" fill={B} />
    <rect x="2" y="8" width="2" height="1" fill={a} />
    {/* right mini-slime */}
    <rect x="12" y="3" width="2" height="1" fill={s} />
    <rect x="11" y="4" width="4" height="1" fill={p} />
    <rect x="10" y="5" width="6" height="4" fill={p} />
    <rect x="11" y="9" width="4" height="1" fill={p} />
    <rect x="11" y="10" width="1" height="1" fill={p} />
    <rect x="14" y="10" width="1" height="1" fill={p} />
    <rect x="11" y="6" width="1" height="2" fill={B} />
    <rect x="14" y="6" width="1" height="2" fill={B} />
    <rect x="12" y="8" width="2" height="1" fill={a} />
    {/* split gap dots */}
    <rect x="7" y="5" width="1" height="1" fill={s} />
    <rect x="8" y="7" width="1" height="1" fill={s} />
    <rect x="7" y="9" width="1" height="1" fill={s} />
  </svg>
) : (
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

/* ─── CAT  idle=sitting  react=Scratch(발톱 긁기) ─── */
const cat: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="3" y="2" width="2" height="3" fill={p} />
    <rect x="11" y="2" width="2" height="3" fill={p} />
    <rect x="4" y="3" width="1" height="1" fill={a} />
    <rect x="11" y="3" width="1" height="1" fill={a} />
    <rect x="3" y="5" width="10" height="5" fill={p} />
    {/* focused slit eyes */}
    <rect x="5" y="6" width="2" height="3" fill={B} />
    <rect x="9" y="6" width="2" height="3" fill={B} />
    <rect x="6" y="7" width="1" height="1" fill={W} />
    <rect x="10" y="7" width="1" height="1" fill={W} />
    <rect x="7" y="8" width="2" height="1" fill={a} />
    <rect x="2" y="8" width="3" height="1" fill={s} />
    <rect x="11" y="8" width="3" height="1" fill={s} />
    {/* body */}
    <rect x="4" y="10" width="7" height="4" fill={p} />
    {/* extended right arm swiping */}
    <rect x="11" y="9" width="4" height="2" fill={p} />
    <rect x="13" y="7" width="2" height="2" fill={p} />
    {/* claw marks */}
    <rect x="14" y="6" width="1" height="1" fill={a} />
    <rect x="15" y="7" width="1" height="1" fill={a} />
    <rect x="14" y="8" width="1" height="1" fill={a} />
    <rect x="5" y="14" width="2" height="1" fill={s} />
    <rect x="9" y="14" width="2" height="1" fill={s} />
    <rect x="12" y="10" width="2" height="1" fill={s} />
    <rect x="13" y="11" width="2" height="2" fill={s} />
  </svg>
) : (
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

/* ─── RABBIT  idle=sitting  react=QuickDash(고속 돌진) ─── */
const rabbit: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* ears swept back */}
    <rect x="8" y="0" width="2" height="4" fill={p} />
    <rect x="11" y="0" width="2" height="4" fill={p} />
    <rect x="8" y="1" width="1" height="2" fill={a} />
    <rect x="11" y="1" width="1" height="2" fill={a} />
    {/* head leaning forward */}
    <rect x="9" y="4" width="6" height="5" fill={p} />
    <rect x="10" y="5" width="2" height="2" fill={B} />
    <rect x="10" y="5" width="1" height="1" fill={W} />
    <rect x="13" y="5" width="2" height="2" fill={s} />
    <rect x="13" y="8" width="2" height="1" fill={a} />
    {/* body horizontal */}
    <rect x="3" y="6" width="8" height="4" fill={p} />
    <rect x="2" y="7" width="2" height="2" fill={s} />
    {/* back legs pushing off */}
    <rect x="0" y="7" width="3" height="4" fill={s} />
    <rect x="1" y="6" width="2" height="2" fill={s} />
    {/* speed lines */}
    <rect x="0" y="4" width="4" height="1" fill={s} />
    <rect x="0" y="5" width="2" height="1" fill={s} />
    <rect x="0" y="12" width="5" height="1" fill={s} />
    <rect x="0" y="13" width="3" height="1" fill={s} />
  </svg>
) : (
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

/* ─── GHOST  idle=float  react=Haunt(팔 벌려 공포) ─── */
const ghost: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* body slightly raised */}
    <rect x="5" y="1" width="6" height="1" fill={p} />
    <rect x="4" y="2" width="8" height="1" fill={p} />
    <rect x="3" y="3" width="10" height="7" fill={p} />
    <rect x="3" y="10" width="2" height="2" fill={p} />
    <rect x="6" y="10" width="2" height="2" fill={p} />
    <rect x="9" y="10" width="2" height="2" fill={p} />
    <rect x="12" y="10" width="2" height="2" fill={p} />
    {/* arms stretched wide */}
    <rect x="0" y="5" width="3" height="2" fill={p} />
    <rect x="13" y="5" width="3" height="2" fill={p} />
    {/* wide glowing eyes */}
    <rect x="4" y="4" width="3" height="3" fill={B} />
    <rect x="9" y="4" width="3" height="3" fill={B} />
    <rect x="4" y="4" width="1" height="1" fill={a} />
    <rect x="9" y="4" width="1" height="1" fill={a} />
    {/* wailing mouth */}
    <rect x="5" y="8" width="6" height="1" fill={B} />
    <rect x="5" y="9" width="1" height="1" fill={B} />
    <rect x="10" y="9" width="1" height="1" fill={B} />
    <rect x="6" y="9" width="4" height="1" fill={s} />
  </svg>
) : (
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

/* ─── PLANT  idle=flower  react=VineWhip(덩굴 공격) ─── */
const plant: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* pot same */}
    <rect x="5" y="11" width="6" height="3" fill={s} />
    <rect x="4" y="13" width="8" height="2" fill={s} />
    <rect x="5" y="11" width="6" height="1" fill="#5D4037" />
    {/* main stem */}
    <rect x="7" y="7" width="2" height="4" fill="#2E7D32" />
    {/* left vine whipping outward */}
    <rect x="1" y="6" width="6" height="2" fill="#2E7D32" />
    <rect x="0" y="5" width="2" height="2" fill="#2E7D32" />
    <rect x="0" y="4" width="2" height="1" fill={p} />
    <rect x="1" y="3" width="2" height="2" fill={p} />
    {/* right vine */}
    <rect x="9" y="5" width="6" height="2" fill="#2E7D32" />
    <rect x="14" y="4" width="2" height="2" fill="#2E7D32" />
    <rect x="14" y="3" width="2" height="1" fill={p} />
    <rect x="13" y="2" width="2" height="2" fill={p} />
    {/* flower same */}
    <rect x="6" y="2" width="4" height="1" fill={a} />
    <rect x="5" y="3" width="6" height="2" fill={a} />
    <rect x="6" y="5" width="4" height="1" fill={a} />
    <rect x="7" y="3" width="2" height="2" fill="#FFF176" />
    {/* thorns on vines */}
    <rect x="2" y="5" width="1" height="1" fill={a} />
    <rect x="4" y="5" width="1" height="1" fill={a} />
    <rect x="11" y="4" width="1" height="1" fill={a} />
    <rect x="13" y="4" width="1" height="1" fill={a} />
  </svg>
) : (
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

/* ─── FISH  idle=swimming  react=BubbleCannon(버블 연사) ─── */
const fish: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* tail same */}
    <rect x="0" y="5" width="3" height="2" fill={s} />
    <rect x="0" y="9" width="3" height="2" fill={s} />
    <rect x="1" y="7" width="2" height="2" fill={s} />
    {/* body */}
    <rect x="3" y="5" width="9" height="6" fill={p} />
    <rect x="2" y="6" width="11" height="4" fill={p} />
    <rect x="5" y="3" width="4" height="2" fill={s} />
    <rect x="6" y="2" width="2" height="1" fill={s} />
    <rect x="4" y="7" width="2" height="2" fill={a} />
    <rect x="7" y="7" width="2" height="2" fill={a} />
    {/* eye open wide */}
    <rect x="11" y="6" width="2" height="2" fill={W} />
    <rect x="12" y="7" width="1" height="1" fill={B} />
    {/* mouth open shooting */}
    <rect x="12" y="9" width="1" height="1" fill={B} />
    {/* bubbles fired forward */}
    <rect x="13" y="5" width="2" height="2" fill={W} />
    <rect x="13" y="6" width="1" height="1" fill="#ADD8E6" />
    <rect x="14" y="8" width="2" height="2" fill={W} />
    <rect x="14" y="9" width="1" height="1" fill="#ADD8E6" />
    <rect x="13" y="11" width="2" height="2" fill={W} />
    <rect x="13" y="12" width="1" height="1" fill="#ADD8E6" />
  </svg>
) : (
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

/* ─── OWL  idle=perched  react=HeadSpin(머리 180° 회전) ─── */
const owl: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* tufts */}
    <rect x="4" y="1" width="2" height="2" fill={p} />
    <rect x="10" y="1" width="2" height="2" fill={p} />
    {/* head facing backward (eyes on other side) */}
    <rect x="4" y="3" width="8" height="5" fill={p} />
    <rect x="3" y="4" width="10" height="3" fill={p} />
    {/* eye discs rotated */}
    <rect x="4" y="3" width="4" height="4" fill={s} />
    <rect x="8" y="3" width="4" height="4" fill={s} />
    <rect x="5" y="4" width="2" height="2" fill={B} />
    <rect x="9" y="4" width="2" height="2" fill={B} />
    {/* pupil on opposite side (rotated look) */}
    <rect x="6" y="4" width="1" height="1" fill={W} />
    <rect x="10" y="4" width="1" height="1" fill={W} />
    {/* beak pointing upward (head twisted) */}
    <rect x="7" y="3" width="2" height="2" fill={a} />
    {/* motion blur lines */}
    <rect x="3" y="2" width="1" height="1" fill={s} />
    <rect x="12" y="2" width="1" height="1" fill={s} />
    <rect x="2" y="3" width="1" height="2" fill={s} />
    <rect x="13" y="3" width="1" height="2" fill={s} />
    {/* wings same */}
    <rect x="1" y="8" width="3" height="5" fill={s} />
    <rect x="12" y="8" width="3" height="5" fill={s} />
    <rect x="4" y="8" width="8" height="5" fill={p} />
    <rect x="5" y="9" width="6" height="3" fill={s} />
    <rect x="5" y="13" width="2" height="2" fill={a} />
    <rect x="9" y="13" width="2" height="2" fill={a} />
  </svg>
) : (
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

/* ─── BEAR  idle=standing  react=BearCrush(양팔 내리치기) ─── */
const bear: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
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
    {/* arms slammed down wide */}
    <rect x="0" y="9" width="3" height="4" fill={p} />
    <rect x="13" y="9" width="3" height="4" fill={p} />
    <rect x="0" y="13" width="4" height="1" fill={s} />
    <rect x="12" y="13" width="4" height="1" fill={s} />
    {/* impact shockwave */}
    <rect x="0" y="14" width="2" height="1" fill={a} />
    <rect x="14" y="14" width="2" height="1" fill={a} />
    <rect x="4" y="13" width="3" height="2" fill={s} />
    <rect x="9" y="13" width="3" height="2" fill={s} />
  </svg>
) : (
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

/* ─── TURTLE  idle=walking  react=ShellSpin(등껍질 회전) ─── */
const turtle: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* shell only - head & legs retracted, spinning pattern */}
    <rect x="3" y="3" width="10" height="10" fill={s} />
    <rect x="2" y="4" width="12" height="8" fill={s} />
    {/* spinning pattern (rotated cross) */}
    <rect x="7" y="3" width="2" height="10" fill={p} />
    <rect x="3" y="7" width="10" height="2" fill={p} />
    <rect x="4" y="4" width="3" height="3" fill={p} />
    <rect x="9" y="10" width="3" height="3" fill={p} />
    <rect x="9" y="4" width="3" height="3" fill={a} />
    <rect x="4" y="10" width="3" height="3" fill={a} />
    {/* motion lines */}
    <rect x="1" y="3" width="1" height="1" fill={a} />
    <rect x="14" y="3" width="1" height="1" fill={a} />
    <rect x="0" y="7" width="2" height="2" fill={a} />
    <rect x="14" y="7" width="2" height="2" fill={a} />
    <rect x="1" y="12" width="1" height="1" fill={a} />
    <rect x="14" y="12" width="1" height="1" fill={a} />
  </svg>
) : (
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

/* ─── FOX  idle=sitting  react=FoxFire(여우불) ─── */
const fox: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
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
    {/* tail same */}
    <rect x="11" y="7" width="4" height="5" fill={a} />
    <rect x="12" y="6" width="3" height="1" fill={a} />
    <rect x="12" y="12" width="3" height="1" fill={W} />
    <rect x="5" y="13" width="2" height="2" fill={s} />
    <rect x="8" y="13" width="2" height="2" fill={s} />
    {/* fox fire orb floating in front */}
    <rect x="0" y="4" width="3" height="3" fill={a} />
    <rect x="1" y="3" width="1" height="5" fill={a} />
    <rect x="0" y="4" width="3" height="1" fill="#90EE90" />
    <rect x="1" y="3" width="1" height="1" fill="#90EE90" />
    <rect x="1" y="5" width="1" height="1" fill={W} />
    {/* glow around orb */}
    <rect x="0" y="3" width="1" height="1" fill={a} />
    <rect x="3" y="3" width="1" height="1" fill={a} />
    <rect x="0" y="7" width="1" height="1" fill={a} />
    <rect x="3" y="7" width="1" height="1" fill={a} />
  </svg>
) : (
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

/* ─── WOLF  idle=standing  react=Howl(울부짖기+음파) ─── */
const wolf: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="3" y="0" width="3" height="4" fill={p} />
    <rect x="10" y="0" width="3" height="4" fill={p} />
    <rect x="4" y="1" width="1" height="2" fill={s} />
    <rect x="11" y="1" width="1" height="2" fill={s} />
    {/* head raised back for howl */}
    <rect x="4" y="2" width="8" height="4" fill={p} />
    <rect x="3" y="3" width="10" height="2" fill={p} />
    <rect x="4" y="4" width="2" height="1" fill={a} />
    <rect x="10" y="4" width="2" height="1" fill={a} />
    {/* muzzle raised */}
    <rect x="5" y="6" width="6" height="3" fill={s} />
    <rect x="6" y="9" width="4" height="1" fill={s} />
    {/* open mouth */}
    <rect x="7" y="7" width="2" height="2" fill={B} />
    <rect x="7" y="8" width="2" height="1" fill="#DC143C" />
    {/* body */}
    <rect x="3" y="10" width="10" height="4" fill={p} />
    <rect x="3" y="10" width="10" height="1" fill={s} />
    <rect x="4" y="14" width="3" height="1" fill={s} />
    <rect x="9" y="14" width="3" height="1" fill={s} />
    <rect x="13" y="10" width="2" height="3" fill={p} />
    {/* howl sound waves */}
    <rect x="1" y="1" width="1" height="3" fill={s} />
    <rect x="0" y="0" width="1" height="5" fill={s} />
    <rect x="14" y="1" width="1" height="3" fill={s} />
    <rect x="15" y="0" width="1" height="5" fill={s} />
  </svg>
) : (
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

/* ─── ROBOT  idle=standing  react=LaserBeam(레이저 발사) ─── */
const robot: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="7" y="0" width="2" height="2" fill={s} />
    <rect x="6" y="1" width="4" height="1" fill={a} />
    <rect x="3" y="2" width="10" height="6" fill={p} />
    <rect x="2" y="3" width="12" height="4" fill={p} />
    {/* eyes lit red, charging */}
    <rect x="4" y="3" width="3" height="3" fill="#FF2200" />
    <rect x="9" y="3" width="3" height="3" fill="#FF2200" />
    <rect x="5" y="4" width="1" height="1" fill="#FF8800" />
    <rect x="10" y="4" width="1" height="1" fill="#FF8800" />
    {/* laser beams shooting right */}
    <rect x="12" y="4" width="4" height="1" fill="#FF2200" />
    <rect x="12" y="5" width="4" height="1" fill="#FF8800" />
    <rect x="12" y="3" width="3" height="1" fill="#FF2200" />
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
) : (
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

/* ─── DRAGON  idle=standing  react=FireBreath(화염 방사) ─── */
const dragon: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    <rect x="5" y="1" width="1" height="2" fill={a} />
    <rect x="9" y="1" width="1" height="2" fill={a} />
    <rect x="5" y="2" width="5" height="3" fill={p} />
    <rect x="4" y="3" width="7" height="3" fill={p} />
    <rect x="5" y="3" width="1" height="1" fill={a} />
    {/* glowing eye */}
    <rect x="9" y="3" width="1" height="1" fill="#FF4444" />
    <rect x="4" y="6" width="8" height="5" fill={p} />
    <rect x="3" y="7" width="10" height="3" fill={p} />
    <rect x="6" y="7" width="4" height="3" fill={s} />
    <rect x="1" y="6" width="3" height="4" fill={s} />
    <rect x="12" y="6" width="3" height="4" fill={s} />
    <rect x="0" y="7" width="2" height="3" fill={a} />
    <rect x="14" y="7" width="2" height="3" fill={a} />
    <rect x="5" y="11" width="2" height="3" fill={p} />
    <rect x="9" y="11" width="2" height="3" fill={p} />
    {/* fire breath to the right */}
    <rect x="11" y="7" width="2" height="2" fill="#FF6600" />
    <rect x="12" y="6" width="3" height="4" fill="#FF6600" />
    <rect x="13" y="5" width="3" height="6" fill="#FF4400" />
    <rect x="14" y="6" width="2" height="4" fill="#FFD700" />
    <rect x="15" y="7" width="1" height="2" fill={W} />
  </svg>
) : (
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

/* ─── PHOENIX  idle=wings semi  react=Rebirth(불꽃 부활) ─── */
const phoenix: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
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
    {/* flame corona around body */}
    <rect x="1" y="3" width="4" height="7" fill="#FF6600" />
    <rect x="11" y="3" width="4" height="7" fill="#FF6600" />
    <rect x="0" y="4" width="2" height="5" fill="#FF4400" />
    <rect x="14" y="4" width="2" height="5" fill="#FF4400" />
    <rect x="2" y="2" width="2" height="2" fill="#FFD700" />
    <rect x="12" y="2" width="2" height="2" fill="#FFD700" />
    <rect x="3" y="1" width="1" height="1" fill="#FF6600" />
    <rect x="12" y="1" width="1" height="1" fill="#FF6600" />
    <rect x="5" y="1" width="1" height="1" fill="#FFD700" />
    <rect x="10" y="1" width="1" height="1" fill="#FFD700" />
    {/* tail */}
    <rect x="6" y="11" width="4" height="2" fill={s} />
    <rect x="5" y="12" width="6" height="2" fill={a} />
    <rect x="6" y="14" width="4" height="1" fill={a} />
    <rect x="6" y="11" width="1" height="3" fill={p} />
    <rect x="9" y="11" width="1" height="3" fill={p} />
    {/* flame under tail */}
    <rect x="4" y="13" width="2" height="2" fill="#FF6600" />
    <rect x="10" y="13" width="2" height="2" fill="#FF6600" />
    <rect x="7" y="15" width="2" height="1" fill="#FFD700" />
  </svg>
) : (
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

/* ─── UNICORN  idle=standing  react=HornBeam(뿔 마법 빔) ─── */
const unicorn: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
    {/* horn glowing */}
    <rect x="4" y="0" width="1" height="3" fill="#FFD700" />
    <rect x="5" y="1" width="1" height="2" fill="#FFD700" />
    <rect x="6" y="1" width="1" height="3" fill={a} />
    <rect x="7" y="2" width="1" height="4" fill={a} />
    <rect x="8" y="1" width="1" height="3" fill="#FFD93D" />
    {/* magic beam shooting from horn tip */}
    <rect x="0" y="0" width="4" height="1" fill="#FFD700" />
    <rect x="0" y="1" width="3" height="1" fill="#FFD93D" />
    <rect x="0" y="2" width="4" height="1" fill="#FFFFFF" />
    {/* sparkle trail */}
    <rect x="0" y="0" width="1" height="1" fill={W} />
    <rect x="2" y="2" width="1" height="1" fill={W} />
    {/* body same */}
    <rect x="3" y="3" width="8" height="4" fill={s} />
    <rect x="2" y="4" width="10" height="2" fill={s} />
    <rect x="4" y="4" width="2" height="2" fill={B} />
    <rect x="4" y="4" width="1" height="1" fill={W} />
    <rect x="4" y="7" width="8" height="5" fill={s} />
    <rect x="3" y="8" width="10" height="3" fill={s} />
    <rect x="12" y="7" width="2" height="1" fill={a} />
    <rect x="13" y="8" width="2" height="3" fill={a} />
    <rect x="13" y="10" width="2" height="2" fill="#FFD93D" />
    <rect x="5" y="12" width="2" height="3" fill={p} />
    <rect x="8" y="12" width="2" height="3" fill={p} />
    <rect x="11" y="12" width="2" height="3" fill={p} />
    {/* sparkles around horn */}
    <rect x="9" y="0" width="1" height="1" fill="#FFD700" />
    <rect x="11" y="1" width="1" height="1" fill="#FFD700" />
    <rect x="10" y="3" width="1" height="1" fill={a} />
  </svg>
) : (
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
const SPRITES: Record<CharacterType, Renderer> = {
  slime, cat, rabbit, ghost, plant, fish, owl, bear,
  turtle, fox, wolf, robot, dragon, phoenix, unicorn,
};

/* ─── Public component ─── */
interface PixelCharacterProps {
  level?: number;
  characterId?: number;
  size?: number;
  float?: boolean;
}

export default function PixelCharacter({ level, characterId, size = 128, float: doFloat = false }: PixelCharacterProps) {
  const [hovered, setHovered] = useState(false);
  const frame: Frame = hovered ? "react" : "idle";

  let def = characterId !== undefined
    ? CHARACTERS.find((c) => c.id === characterId)
    : undefined;
  if (!def && level !== undefined) def = getCurrentCharacter(level);
  if (!def) def = CHARACTERS[0];

  const animStyle = doFloat && !hovered
    ? { animation: "pixel-float 2s ease-in-out infinite" }
    : undefined;

  return (
    <div
      className="inline-block cursor-pointer select-none"
      style={animStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {SPRITES[def.type](def.colors, size, frame)}
    </div>
  );
}

/** Render a sprite by type + colors directly (used in Pokédex grid / party scene) */
export function PixelSprite({
  type, colors, size = 48, float: doFloat = false,
}: { type: CharacterType; colors: { p: string; s: string; a: string }; size?: number; float?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const animStyle = doFloat && !hovered
    ? { animation: "pixel-float 2s ease-in-out infinite" }
    : undefined;
  return (
    <div
      className="inline-block cursor-pointer select-none"
      style={animStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {SPRITES[type](colors, size, hovered ? "react" : "idle")}
    </div>
  );
}
