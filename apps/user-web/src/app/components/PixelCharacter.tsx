import { useState, type ReactElement } from "react";
import { CHARACTERS } from "../data/characters";
import type { CharacterType } from "../data/characters";

interface Colors { p: string; s: string; a: string }
type Frame = "idle" | "react";
type Renderer = (c: Colors, sz: number, f: Frame) => ReactElement;

const B = "#1a1a1a";
const W = "#FFFFFF";

/* ─── SLIME ─── */
const slime: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* left mini-slime */}
    <rect x="6" y="14" width="12" height="4" fill={s} />
    <rect x="2" y="18" width="20" height="4" fill={p} />
    <rect x="0" y="22" width="24" height="14" fill={p} />
    <rect x="2" y="36" width="20" height="4" fill={p} />
    <rect x="2" y="40" width="6" height="4" fill={p} />
    <rect x="16" y="40" width="6" height="4" fill={p} />
    {/* left highlight */}
    <rect x="4" y="22" width="8" height="6" fill={W} fillOpacity={0.3} />
    {/* left eyes */}
    <rect x="4" y="26" width="6" height="6" fill={B} />
    <rect x="14" y="26" width="6" height="6" fill={B} />
    <rect x="4" y="26" width="3" height="3" fill={W} />
    <rect x="14" y="26" width="3" height="3" fill={W} />
    <rect x="6" y="28" width="2" height="2" fill={B} />
    <rect x="16" y="28" width="2" height="2" fill={B} />
    {/* left mouth */}
    <rect x="6" y="34" width="10" height="3" fill={a} />
    {/* right mini-slime */}
    <rect x="46" y="14" width="12" height="4" fill={s} />
    <rect x="42" y="18" width="20" height="4" fill={p} />
    <rect x="40" y="22" width="24" height="14" fill={p} />
    <rect x="42" y="36" width="20" height="4" fill={p} />
    <rect x="42" y="40" width="6" height="4" fill={p} />
    <rect x="56" y="40" width="6" height="4" fill={p} />
    <rect x="44" y="22" width="8" height="6" fill={W} fillOpacity={0.3} />
    <rect x="44" y="26" width="6" height="6" fill={B} />
    <rect x="54" y="26" width="6" height="6" fill={B} />
    <rect x="44" y="26" width="3" height="3" fill={W} />
    <rect x="54" y="26" width="3" height="3" fill={W} />
    <rect x="46" y="28" width="2" height="2" fill={B} />
    <rect x="56" y="28" width="2" height="2" fill={B} />
    <rect x="46" y="34" width="10" height="3" fill={a} />
    {/* split gap dots */}
    <rect x="28" y="22" width="4" height="4" fill={s} fillOpacity={0.8} />
    <rect x="30" y="30" width="4" height="4" fill={s} fillOpacity={0.6} />
    <rect x="28" y="38" width="4" height="4" fill={s} fillOpacity={0.4} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* antennae */}
    <rect x="22" y="8" width="4" height="6" fill={s} />
    <rect x="38" y="8" width="4" height="6" fill={s} />
    <rect x="20" y="6" width="8" height="4" fill={s} />
    <rect x="36" y="6" width="8" height="4" fill={s} />
    {/* body */}
    <rect x="18" y="14" width="28" height="4" fill={p} />
    <rect x="14" y="18" width="36" height="4" fill={p} />
    <rect x="10" y="22" width="44" height="18" fill={p} />
    <rect x="14" y="40" width="36" height="4" fill={p} />
    <rect x="18" y="44" width="28" height="4" fill={p} />
    {/* feet nubs */}
    <rect x="14" y="48" width="10" height="4" fill={p} />
    <rect x="28" y="48" width="8" height="4" fill={p} />
    <rect x="40" y="48" width="10" height="4" fill={p} />
    {/* highlight dome */}
    <rect x="18" y="22" width="16" height="8" fill={W} fillOpacity={0.3} />
    <rect x="18" y="22" width="8" height="4" fill={W} fillOpacity={0.2} />
    {/* shadow bottom */}
    <rect x="14" y="36" width="36" height="6" fill={B} fillOpacity={0.1} />
    {/* eyes */}
    <rect x="20" y="26" width="8" height="8" fill={B} />
    <rect x="36" y="26" width="8" height="8" fill={B} />
    <rect x="20" y="26" width="4" height="4" fill={W} />
    <rect x="36" y="26" width="4" height="4" fill={W} />
    <rect x="22" y="28" width="3" height="3" fill={B} />
    <rect x="38" y="28" width="3" height="3" fill={B} />
    <rect x="22" y="28" width="1" height="1" fill={W} />
    <rect x="38" y="28" width="1" height="1" fill={W} />
    {/* mouth */}
    <rect x="26" y="36" width="12" height="3" fill={a} />
    <rect x="28" y="39" width="8" height="2" fill={a} />
  </svg>
);

/* ─── CAT ─── */
const cat: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="6" width="10" height="14" fill={p} />
    <rect x="44" y="6" width="10" height="14" fill={p} />
    <rect x="13" y="9" width="5" height="8" fill={a} />
    <rect x="46" y="9" width="5" height="8" fill={a} />
    {/* head */}
    <rect x="12" y="18" width="40" height="22" fill={p} />
    <rect x="8" y="22" width="48" height="14" fill={p} />
    {/* face highlight */}
    <rect x="18" y="20" width="12" height="8" fill={W} fillOpacity={0.2} />
    {/* focused slit eyes */}
    <rect x="18" y="22" width="10" height="12" fill={B} />
    <rect x="36" y="22" width="10" height="12" fill={B} />
    <rect x="18" y="22" width="5" height="5" fill={W} />
    <rect x="36" y="22" width="5" height="5" fill={W} />
    <rect x="21" y="25" width="3" height="6" fill={B} />
    <rect x="39" y="25" width="3" height="6" fill={B} />
    <rect x="21" y="25" width="2" height="2" fill={W} />
    <rect x="39" y="25" width="2" height="2" fill={W} />
    {/* whiskers */}
    <rect x="6" y="30" width="12" height="2" fill={s} />
    <rect x="46" y="30" width="12" height="2" fill={s} />
    <rect x="4" y="34" width="14" height="2" fill={s} />
    <rect x="46" y="34" width="14" height="2" fill={s} />
    {/* nose + mouth */}
    <rect x="28" y="30" width="8" height="4" fill={a} />
    <rect x="26" y="34" width="4" height="4" fill={s} />
    <rect x="34" y="34" width="4" height="4" fill={s} />
    {/* body */}
    <rect x="16" y="40" width="28" height="16" fill={p} />
    {/* extended swipe arm */}
    <rect x="44" y="34" width="16" height="10" fill={p} />
    <rect x="52" y="26" width="10" height="10" fill={p} />
    {/* claws */}
    <rect x="56" y="22" width="4" height="4" fill={a} />
    <rect x="60" y="26" width="4" height="4" fill={a} />
    <rect x="56" y="30" width="4" height="4" fill={a} />
    {/* paws */}
    <rect x="18" y="56" width="10" height="4" fill={s} />
    <rect x="36" y="56" width="10" height="4" fill={s} />
    {/* tail */}
    <rect x="44" y="40" width="10" height="4" fill={s} />
    <rect x="50" y="44" width="10" height="8" fill={s} />
    <rect x="54" y="52" width="8" height="4" fill={s} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="6" width="10" height="14" fill={p} />
    <rect x="44" y="6" width="10" height="14" fill={p} />
    <rect x="13" y="9" width="5" height="8" fill={a} />
    <rect x="46" y="9" width="5" height="8" fill={a} />
    {/* head */}
    <rect x="12" y="18" width="40" height="22" fill={p} />
    <rect x="8" y="22" width="48" height="14" fill={p} />
    <rect x="18" y="20" width="12" height="8" fill={W} fillOpacity={0.2} />
    {/* eyes */}
    <rect x="18" y="22" width="10" height="10" fill={B} />
    <rect x="36" y="22" width="10" height="10" fill={B} />
    <rect x="18" y="22" width="5" height="5" fill={W} />
    <rect x="36" y="22" width="5" height="5" fill={W} />
    <rect x="21" y="25" width="4" height="4" fill={B} />
    <rect x="39" y="25" width="4" height="4" fill={B} />
    <rect x="21" y="25" width="2" height="2" fill={W} />
    <rect x="39" y="25" width="2" height="2" fill={W} />
    {/* whiskers */}
    <rect x="6" y="30" width="12" height="2" fill={s} />
    <rect x="46" y="30" width="12" height="2" fill={s} />
    <rect x="4" y="34" width="14" height="2" fill={s} />
    <rect x="46" y="34" width="14" height="2" fill={s} />
    {/* nose + mouth */}
    <rect x="28" y="30" width="8" height="4" fill={a} />
    <rect x="26" y="34" width="4" height="3" fill={s} />
    <rect x="34" y="34" width="4" height="3" fill={s} />
    {/* body */}
    <rect x="14" y="40" width="36" height="16" fill={p} />
    <rect x="14" y="40" width="36" height="6" fill={W} fillOpacity={0.1} />
    <rect x="14" y="50" width="36" height="6" fill={B} fillOpacity={0.1} />
    {/* tail */}
    <rect x="44" y="40" width="10" height="4" fill={s} />
    <rect x="50" y="44" width="10" height="8" fill={s} />
    <rect x="54" y="52" width="8" height="4" fill={s} />
    {/* paws */}
    <rect x="18" y="56" width="10" height="4" fill={s} />
    <rect x="36" y="56" width="10" height="4" fill={s} />
  </svg>
);

/* ─── RABBIT ─── */
const rabbit: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears swept back */}
    <rect x="30" y="0" width="8" height="18" fill={p} />
    <rect x="42" y="0" width="8" height="18" fill={p} />
    <rect x="31" y="3" width="4" height="11" fill={a} />
    <rect x="43" y="3" width="4" height="11" fill={a} />
    {/* head leaning forward */}
    <rect x="34" y="16" width="26" height="22" fill={p} />
    <rect x="30" y="20" width="30" height="14" fill={p} />
    <rect x="36" y="18" width="12" height="8" fill={W} fillOpacity={0.2} />
    {/* eye */}
    <rect x="38" y="20" width="8" height="8" fill={B} />
    <rect x="38" y="20" width="4" height="4" fill={W} />
    <rect x="40" y="22" width="3" height="3" fill={B} />
    <rect x="40" y="22" width="1" height="1" fill={W} />
    {/* muzzle */}
    <rect x="50" y="24" width="10" height="8" fill={s} />
    <rect x="52" y="30" width="6" height="4" fill={a} />
    {/* body horizontal - dashing */}
    <rect x="10" y="24" width="30" height="18" fill={p} />
    <rect x="6" y="28" width="34" height="10" fill={p} />
    <rect x="12" y="26" width="14" height="8" fill={W} fillOpacity={0.15} />
    {/* belly */}
    <rect x="14" y="30" width="16" height="8" fill={s} />
    {/* back legs pushing off */}
    <rect x="0" y="28" width="14" height="18" fill={s} />
    <rect x="4" y="24" width="10" height="8" fill={s} />
    {/* speed lines */}
    <rect x="0" y="14" width="20" height="3" fill={s} fillOpacity={0.6} />
    <rect x="0" y="18" width="12" height="2" fill={s} fillOpacity={0.4} />
    <rect x="0" y="48" width="24" height="3" fill={s} fillOpacity={0.6} />
    <rect x="0" y="52" width="16" height="2" fill={s} fillOpacity={0.4} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="18" y="0" width="10" height="22" fill={p} />
    <rect x="36" y="0" width="10" height="22" fill={p} />
    <rect x="20" y="3" width="5" height="15" fill={a} />
    <rect x="38" y="3" width="5" height="15" fill={a} />
    {/* head */}
    <rect x="14" y="20" width="36" height="22" fill={p} />
    <rect x="10" y="24" width="44" height="14" fill={p} />
    <rect x="18" y="22" width="14" height="10" fill={W} fillOpacity={0.2} />
    {/* eyes */}
    <rect x="18" y="24" width="10" height="10" fill={B} />
    <rect x="36" y="24" width="10" height="10" fill={B} />
    <rect x="18" y="24" width="5" height="5" fill={W} />
    <rect x="36" y="24" width="5" height="5" fill={W} />
    <rect x="21" y="27" width="4" height="4" fill={B} />
    <rect x="39" y="27" width="4" height="4" fill={B} />
    <rect x="21" y="27" width="2" height="2" fill={W} />
    <rect x="39" y="27" width="2" height="2" fill={W} />
    {/* nose */}
    <rect x="28" y="34" width="8" height="4" fill={a} />
    {/* body */}
    <rect x="10" y="42" width="44" height="16" fill={p} />
    <rect x="10" y="42" width="44" height="6" fill={W} fillOpacity={0.15} />
    {/* belly */}
    <rect x="18" y="44" width="28" height="10" fill={s} />
    {/* side puffs */}
    <rect x="2" y="42" width="10" height="14" fill={s} />
    <rect x="52" y="42" width="10" height="14" fill={s} />
    {/* feet */}
    <rect x="14" y="58" width="14" height="4" fill={s} />
    <rect x="36" y="58" width="14" height="4" fill={s} />
  </svg>
);

/* ─── GHOST ─── */
const ghost: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* body raised, arms stretched wide */}
    <rect x="18" y="2" width="28" height="4" fill={p} fillOpacity={0.9} />
    <rect x="14" y="6" width="36" height="4" fill={p} fillOpacity={0.92} />
    <rect x="10" y="10" width="44" height="30" fill={p} fillOpacity={0.95} />
    {/* arms out */}
    <rect x="0" y="18" width="10" height="10" fill={p} fillOpacity={0.9} />
    <rect x="54" y="18" width="10" height="10" fill={p} fillOpacity={0.9} />
    {/* wavy bottom */}
    <rect x="10" y="40" width="10" height="10" fill={p} fillOpacity={0.95} />
    <rect x="22" y="40" width="10" height="10" fill={p} fillOpacity={0.95} />
    <rect x="34" y="40" width="10" height="10" fill={p} fillOpacity={0.95} />
    <rect x="46" y="40" width="8" height="10" fill={p} fillOpacity={0.95} />
    {/* inner glow */}
    <rect x="18" y="10" width="28" height="18" fill={W} fillOpacity={0.12} />
    {/* wide eyes */}
    <rect x="14" y="14" width="14" height="14" fill={B} />
    <rect x="36" y="14" width="14" height="14" fill={B} />
    <rect x="14" y="14" width="7" height="7" fill={a} />
    <rect x="36" y="14" width="7" height="7" fill={a} />
    <rect x="17" y="17" width="5" height="5" fill={W} />
    <rect x="39" y="17" width="5" height="5" fill={W} />
    <rect x="18" y="18" width="3" height="3" fill={B} />
    <rect x="40" y="18" width="3" height="3" fill={B} />
    <rect x="18" y="18" width="1" height="1" fill={W} />
    <rect x="40" y="18" width="1" height="1" fill={W} />
    {/* wailing mouth */}
    <rect x="18" y="32" width="28" height="4" fill={B} />
    <rect x="18" y="36" width="6" height="4" fill={B} />
    <rect x="40" y="36" width="6" height="4" fill={B} />
    <rect x="24" y="36" width="16" height="4" fill={s} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* body */}
    <rect x="18" y="6" width="28" height="4" fill={p} fillOpacity={0.88} />
    <rect x="14" y="10" width="36" height="4" fill={p} fillOpacity={0.9} />
    <rect x="10" y="14" width="44" height="30" fill={p} fillOpacity={0.95} />
    {/* wavy bottom */}
    <rect x="10" y="44" width="10" height="10" fill={p} fillOpacity={0.95} />
    <rect x="22" y="44" width="10" height="10" fill={p} fillOpacity={0.95} />
    <rect x="34" y="44" width="10" height="10" fill={p} fillOpacity={0.95} />
    <rect x="46" y="44" width="8" height="10" fill={p} fillOpacity={0.95} />
    {/* inner glow */}
    <rect x="18" y="14" width="28" height="18" fill={W} fillOpacity={0.12} />
    {/* eyes */}
    <rect x="16" y="18" width="12" height="14" fill={B} />
    <rect x="36" y="18" width="12" height="14" fill={B} />
    <rect x="16" y="18" width="6" height="6" fill={a} />
    <rect x="36" y="18" width="6" height="6" fill={a} />
    <rect x="18" y="20" width="4" height="4" fill={W} />
    <rect x="38" y="20" width="4" height="4" fill={W} />
    <rect x="19" y="21" width="2" height="2" fill={B} />
    <rect x="39" y="21" width="2" height="2" fill={B} />
    <rect x="19" y="21" width="1" height="1" fill={W} />
    <rect x="39" y="21" width="1" height="1" fill={W} />
    {/* calm mouth */}
    <rect x="22" y="36" width="20" height="4" fill={s} />
  </svg>
);

/* ─── PLANT ─── */
const plant: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* pot */}
    <rect x="18" y="46" width="28" height="10" fill={s} />
    <rect x="14" y="52" width="36" height="8" fill={s} />
    <rect x="18" y="46" width="28" height="4" fill="#5D4037" />
    <rect x="22" y="50" width="20" height="4" fill="#4E342E" />
    {/* main stem */}
    <rect x="28" y="28" width="8" height="18" fill="#2E7D32" />
    <rect x="30" y="28" width="4" height="18" fill="#388E3C" />
    {/* left vine whipping out */}
    <rect x="2" y="20" width="28" height="8" fill="#2E7D32" />
    <rect x="2" y="20" width="28" height="3" fill="#388E3C" />
    <rect x="0" y="14" width="8" height="10" fill="#2E7D32" />
    <rect x="0" y="10" width="8" height="6" fill={p} />
    <rect x="2" y="6" width="10" height="8" fill={p} />
    {/* right vine */}
    <rect x="34" y="16" width="28" height="8" fill="#2E7D32" />
    <rect x="34" y="16" width="28" height="3" fill="#388E3C" />
    <rect x="56" y="12" width="8" height="10" fill="#2E7D32" />
    <rect x="54" y="6" width="10" height="8" fill={p} />
    {/* flower head */}
    <rect x="22" y="6" width="20" height="4" fill={a} />
    <rect x="18" y="10" width="28" height="10" fill={a} />
    <rect x="22" y="20" width="20" height="4" fill={a} />
    <rect x="26" y="4" width="12" height="4" fill={a} />
    {/* flower center */}
    <rect x="26" y="10" width="12" height="10" fill="#FFF176" />
    <rect x="28" y="12" width="8" height="6" fill="#FFD600" />
    <rect x="30" y="13" width="4" height="4" fill="#FF8F00" />
    {/* face */}
    <rect x="26" y="12" width="4" height="4" fill={B} />
    <rect x="34" y="12" width="4" height="4" fill={B} />
    <rect x="26" y="12" width="2" height="2" fill={W} />
    <rect x="34" y="12" width="2" height="2" fill={W} />
    {/* thorns */}
    <rect x="8" y="18" width="4" height="4" fill={a} />
    <rect x="16" y="16" width="4" height="4" fill={a} />
    <rect x="44" y="12" width="4" height="4" fill={a} />
    <rect x="52" y="14" width="4" height="4" fill={a} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* pot */}
    <rect x="18" y="46" width="28" height="10" fill={s} />
    <rect x="14" y="52" width="36" height="8" fill={s} />
    <rect x="18" y="46" width="28" height="4" fill="#5D4037" />
    <rect x="22" y="50" width="20" height="4" fill="#4E342E" />
    {/* stem */}
    <rect x="28" y="26" width="8" height="20" fill="#2E7D32" />
    <rect x="30" y="26" width="4" height="20" fill="#388E3C" />
    {/* leaves */}
    <rect x="10" y="26" width="18" height="10" fill={p} />
    <rect x="10" y="22" width="14" height="10" fill={p} />
    <rect x="36" y="22" width="18" height="10" fill={p} />
    <rect x="36" y="18" width="14" height="8" fill={p} />
    {/* leaf highlight */}
    <rect x="12" y="24" width="8" height="4" fill={W} fillOpacity={0.2} />
    <rect x="38" y="20" width="8" height="4" fill={W} fillOpacity={0.2} />
    {/* flower */}
    <rect x="22" y="6" width="20" height="4" fill={a} />
    <rect x="18" y="10" width="28" height="10" fill={a} />
    <rect x="22" y="20" width="20" height="4" fill={a} />
    <rect x="26" y="4" width="12" height="4" fill={a} />
    <rect x="26" y="10" width="12" height="10" fill="#FFF176" />
    <rect x="28" y="12" width="8" height="6" fill="#FFD600" />
    <rect x="30" y="13" width="4" height="4" fill="#FF8F00" />
    {/* face */}
    <rect x="26" y="12" width="4" height="4" fill={B} />
    <rect x="34" y="12" width="4" height="4" fill={B} />
    <rect x="26" y="12" width="2" height="2" fill={W} />
    <rect x="34" y="12" width="2" height="2" fill={W} />
  </svg>
);

/* ─── FISH ─── */
const fish: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* tail */}
    <rect x="0" y="18" width="14" height="10" fill={s} />
    <rect x="0" y="36" width="14" height="10" fill={s} />
    <rect x="2" y="28" width="10" height="8" fill={s} />
    <rect x="4" y="26" width="6" height="12" fill={a} fillOpacity={0.5} />
    {/* body */}
    <rect x="10" y="18" width="38" height="28" fill={p} />
    <rect x="6" y="22" width="46" height="20" fill={p} />
    {/* scale pattern */}
    <rect x="14" y="22" width="10" height="8" fill={a} fillOpacity={0.4} />
    <rect x="28" y="22" width="10" height="8" fill={a} fillOpacity={0.4} />
    <rect x="20" y="30" width="10" height="8" fill={a} fillOpacity={0.3} />
    {/* top fin */}
    <rect x="18" y="10" width="18" height="8" fill={s} />
    <rect x="22" y="6" width="10" height="6" fill={s} />
    {/* body highlight */}
    <rect x="14" y="22" width="24" height="6" fill={W} fillOpacity={0.2} />
    {/* eye wide open */}
    <rect x="42" y="22" width="10" height="10" fill={W} />
    <rect x="44" y="24" width="6" height="6" fill={B} />
    <rect x="44" y="24" width="3" height="3" fill={W} />
    <rect x="46" y="26" width="3" height="3" fill={B} />
    <rect x="46" y="26" width="1" height="1" fill={W} />
    {/* mouth open */}
    <rect x="46" y="34" width="6" height="6" fill={B} />
    <rect x="46" y="36" width="6" height="4" fill="#DC143C" />
    {/* bubbles */}
    <rect x="50" y="16" width="8" height="8" fill={W} fillOpacity={0.8} />
    <rect x="52" y="18" width="4" height="4" fill="#ADD8E6" />
    <rect x="52" y="18" width="2" height="2" fill={W} />
    <rect x="54" y="28" width="8" height="8" fill={W} fillOpacity={0.7} />
    <rect x="56" y="30" width="4" height="4" fill="#ADD8E6" />
    <rect x="54" y="40" width="8" height="8" fill={W} fillOpacity={0.6} />
    <rect x="56" y="42" width="4" height="4" fill="#ADD8E6" />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* tail */}
    <rect x="0" y="18" width="14" height="10" fill={s} />
    <rect x="0" y="36" width="14" height="10" fill={s} />
    <rect x="2" y="28" width="10" height="8" fill={s} />
    <rect x="4" y="26" width="6" height="12" fill={a} fillOpacity={0.5} />
    {/* body */}
    <rect x="10" y="18" width="38" height="28" fill={p} />
    <rect x="6" y="22" width="46" height="20" fill={p} />
    {/* scales */}
    <rect x="14" y="22" width="10" height="8" fill={a} fillOpacity={0.35} />
    <rect x="28" y="22" width="10" height="8" fill={a} fillOpacity={0.35} />
    <rect x="20" y="30" width="10" height="8" fill={a} fillOpacity={0.25} />
    {/* top fin */}
    <rect x="18" y="10" width="18" height="8" fill={s} />
    <rect x="22" y="6" width="10" height="6" fill={s} />
    {/* highlight */}
    <rect x="14" y="22" width="24" height="6" fill={W} fillOpacity={0.2} />
    {/* eye */}
    <rect x="42" y="22" width="10" height="10" fill={W} />
    <rect x="44" y="24" width="6" height="6" fill={B} />
    <rect x="44" y="24" width="3" height="3" fill={W} />
    <rect x="46" y="26" width="3" height="3" fill={B} />
    <rect x="46" y="26" width="1" height="1" fill={W} />
    {/* mouth */}
    <rect x="50" y="34" width="4" height="4" fill={B} />
  </svg>
);

/* ─── OWL ─── */
const owl: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* head tufts */}
    <rect x="14" y="2" width="10" height="10" fill={p} />
    <rect x="40" y="2" width="10" height="10" fill={p} />
    {/* head facing backward - rotated */}
    <rect x="14" y="10" width="36" height="22" fill={p} />
    <rect x="10" y="14" width="44" height="14" fill={p} />
    {/* motion blur lines at sides */}
    <rect x="6" y="8" width="4" height="10" fill={s} fillOpacity={0.6} />
    <rect x="54" y="8" width="4" height="10" fill={s} fillOpacity={0.6} />
    <rect x="4" y="12" width="4" height="8" fill={s} fillOpacity={0.4} />
    <rect x="56" y="12" width="4" height="8" fill={s} fillOpacity={0.4} />
    {/* eye discs */}
    <rect x="14" y="10" width="16" height="18" fill={s} />
    <rect x="34" y="10" width="16" height="18" fill={s} />
    {/* eye rings */}
    <rect x="18" y="14" width="10" height="10" fill={B} />
    <rect x="36" y="14" width="10" height="10" fill={B} />
    {/* iris - pupils shifted for "looking back" effect */}
    <rect x="22" y="14" width="6" height="6" fill={W} />
    <rect x="40" y="14" width="6" height="6" fill={W} />
    <rect x="24" y="16" width="4" height="4" fill={B} />
    <rect x="42" y="16" width="4" height="4" fill={B} />
    <rect x="24" y="16" width="2" height="2" fill={W} />
    <rect x="42" y="16" width="2" height="2" fill={W} />
    {/* beak angled up */}
    <rect x="26" y="10" width="12" height="6" fill={a} />
    <rect x="28" y="6" width="8" height="6" fill={a} />
    {/* wings */}
    <rect x="2" y="32" width="14" height="22" fill={s} />
    <rect x="48" y="32" width="14" height="22" fill={s} />
    <rect x="16" y="32" width="32" height="20" fill={p} />
    {/* wing feather detail */}
    <rect x="4" y="36" width="10" height="4" fill={p} fillOpacity={0.3} />
    <rect x="4" y="42" width="10" height="4" fill={p} fillOpacity={0.3} />
    <rect x="50" y="36" width="10" height="4" fill={p} fillOpacity={0.3} />
    <rect x="50" y="42" width="10" height="4" fill={p} fillOpacity={0.3} />
    {/* belly */}
    <rect x="20" y="36" width="24" height="12" fill={s} />
    {/* talons */}
    <rect x="18" y="52" width="10" height="8" fill={a} />
    <rect x="36" y="52" width="10" height="8" fill={a} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* head tufts */}
    <rect x="14" y="2" width="10" height="10" fill={p} />
    <rect x="40" y="2" width="10" height="10" fill={p} />
    {/* head */}
    <rect x="14" y="10" width="36" height="22" fill={p} />
    <rect x="10" y="14" width="44" height="14" fill={p} />
    {/* face highlight */}
    <rect x="20" y="12" width="24" height="10" fill={W} fillOpacity={0.1} />
    {/* eye discs */}
    <rect x="14" y="10" width="16" height="18" fill={s} />
    <rect x="34" y="10" width="16" height="18" fill={s} />
    {/* eyes */}
    <rect x="18" y="14" width="10" height="10" fill={B} />
    <rect x="36" y="14" width="10" height="10" fill={B} />
    <rect x="18" y="14" width="5" height="5" fill={W} />
    <rect x="36" y="14" width="5" height="5" fill={W} />
    <rect x="20" y="16" width="4" height="4" fill={B} />
    <rect x="38" y="16" width="4" height="4" fill={B} />
    <rect x="20" y="16" width="2" height="2" fill={W} />
    <rect x="38" y="16" width="2" height="2" fill={W} />
    {/* beak */}
    <rect x="26" y="24" width="12" height="6" fill={a} />
    <rect x="28" y="20" width="8" height="6" fill={a} />
    {/* wings */}
    <rect x="2" y="32" width="14" height="22" fill={s} />
    <rect x="48" y="32" width="14" height="22" fill={s} />
    <rect x="16" y="32" width="32" height="20" fill={p} />
    <rect x="4" y="36" width="10" height="4" fill={p} fillOpacity={0.3} />
    <rect x="4" y="42" width="10" height="4" fill={p} fillOpacity={0.3} />
    <rect x="50" y="36" width="10" height="4" fill={p} fillOpacity={0.3} />
    <rect x="50" y="42" width="10" height="4" fill={p} fillOpacity={0.3} />
    <rect x="20" y="36" width="24" height="12" fill={s} />
    {/* talons */}
    <rect x="18" y="52" width="10" height="8" fill={a} />
    <rect x="36" y="52" width="10" height="8" fill={a} />
  </svg>
);

/* ─── BEAR ─── */
const bear: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="6" width="14" height="10" fill={p} />
    <rect x="40" y="6" width="14" height="10" fill={p} />
    <rect x="14" y="9" width="6" height="5" fill={a} />
    <rect x="44" y="9" width="6" height="5" fill={a} />
    {/* head */}
    <rect x="10" y="14" width="44" height="22" fill={p} />
    <rect x="6" y="18" width="52" height="14" fill={p} />
    <rect x="16" y="16" width="20" height="10" fill={W} fillOpacity={0.15} />
    {/* eyes */}
    <rect x="16" y="18" width="10" height="10" fill={B} />
    <rect x="38" y="18" width="10" height="10" fill={B} />
    <rect x="16" y="18" width="5" height="5" fill={W} />
    <rect x="38" y="18" width="5" height="5" fill={W} />
    <rect x="19" y="21" width="4" height="4" fill={B} />
    <rect x="41" y="21" width="4" height="4" fill={B} />
    <rect x="19" y="21" width="2" height="2" fill={W} />
    <rect x="41" y="21" width="2" height="2" fill={W} />
    {/* snout */}
    <rect x="20" y="28" width="24" height="8" fill={s} />
    <rect x="26" y="30" width="12" height="4" fill={B} />
    {/* body */}
    <rect x="10" y="36" width="44" height="18" fill={p} />
    <rect x="6" y="40" width="52" height="10" fill={p} />
    <rect x="12" y="36" width="40" height="8" fill={W} fillOpacity={0.12} />
    {/* belly */}
    <rect x="18" y="38" width="28" height="12" fill={s} fillOpacity={0.5} />
    {/* arms slammed down */}
    <rect x="0" y="34" width="10" height="18" fill={p} />
    <rect x="54" y="34" width="10" height="18" fill={p} />
    {/* paw pads */}
    <rect x="0" y="52" width="14" height="4" fill={s} />
    <rect x="50" y="52" width="14" height="4" fill={s} />
    {/* shockwave */}
    <rect x="0" y="56" width="8" height="4" fill={a} fillOpacity={0.8} />
    <rect x="56" y="56" width="8" height="4" fill={a} fillOpacity={0.8} />
    {/* feet */}
    <rect x="14" y="54" width="14" height="6" fill={s} />
    <rect x="36" y="54" width="14" height="6" fill={s} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="6" width="14" height="10" fill={p} />
    <rect x="40" y="6" width="14" height="10" fill={p} />
    <rect x="14" y="9" width="6" height="5" fill={a} />
    <rect x="44" y="9" width="6" height="5" fill={a} />
    {/* head */}
    <rect x="10" y="14" width="44" height="22" fill={p} />
    <rect x="6" y="18" width="52" height="14" fill={p} />
    <rect x="16" y="16" width="20" height="10" fill={W} fillOpacity={0.15} />
    {/* eyes */}
    <rect x="16" y="18" width="10" height="10" fill={B} />
    <rect x="38" y="18" width="10" height="10" fill={B} />
    <rect x="16" y="18" width="5" height="5" fill={W} />
    <rect x="38" y="18" width="5" height="5" fill={W} />
    <rect x="19" y="21" width="4" height="4" fill={B} />
    <rect x="41" y="21" width="4" height="4" fill={B} />
    <rect x="19" y="21" width="2" height="2" fill={W} />
    <rect x="41" y="21" width="2" height="2" fill={W} />
    {/* snout */}
    <rect x="20" y="28" width="24" height="8" fill={s} />
    <rect x="26" y="30" width="12" height="4" fill={B} />
    {/* body */}
    <rect x="10" y="36" width="44" height="18" fill={p} />
    <rect x="6" y="40" width="52" height="10" fill={p} />
    <rect x="12" y="36" width="40" height="8" fill={W} fillOpacity={0.12} />
    <rect x="18" y="38" width="28" height="12" fill={s} fillOpacity={0.4} />
    {/* arms */}
    <rect x="0" y="34" width="10" height="18" fill={p} />
    <rect x="54" y="34" width="10" height="18" fill={p} />
    {/* feet */}
    <rect x="14" y="54" width="14" height="6" fill={s} />
    <rect x="36" y="54" width="14" height="6" fill={s} />
  </svg>
);

/* ─── TURTLE ─── */
const turtle: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* shell spinning - head and legs retracted */}
    <rect x="10" y="10" width="44" height="44" fill={s} />
    <rect x="6" y="14" width="52" height="36" fill={s} />
    {/* shell highlight */}
    <rect x="14" y="12" width="22" height="12" fill={W} fillOpacity={0.2} />
    {/* spinning pattern - cross */}
    <rect x="28" y="10" width="8" height="44" fill={p} />
    <rect x="10" y="28" width="44" height="8" fill={p} />
    {/* diagonal blocks */}
    <rect x="14" y="14" width="12" height="12" fill={p} fillOpacity={0.7} />
    <rect x="38" y="40" width="12" height="12" fill={p} fillOpacity={0.7} />
    <rect x="38" y="14" width="12" height="12" fill={a} fillOpacity={0.8} />
    <rect x="14" y="40" width="12" height="12" fill={a} fillOpacity={0.8} />
    {/* outer shell edge detail */}
    <rect x="10" y="10" width="44" height="4" fill={p} fillOpacity={0.4} />
    <rect x="10" y="50" width="44" height="4" fill={B} fillOpacity={0.2} />
    {/* motion lines */}
    <rect x="2" y="10" width="4" height="4" fill={a} fillOpacity={0.7} />
    <rect x="58" y="10" width="4" height="4" fill={a} fillOpacity={0.7} />
    <rect x="0" y="26" width="6" height="8" fill={a} fillOpacity={0.6} />
    <rect x="58" y="26" width="6" height="8" fill={a} fillOpacity={0.6} />
    <rect x="2" y="48" width="4" height="4" fill={a} fillOpacity={0.5} />
    <rect x="58" y="48" width="4" height="4" fill={a} fillOpacity={0.5} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* shell */}
    <rect x="14" y="14" width="36" height="32" fill={s} />
    <rect x="10" y="18" width="44" height="24" fill={s} />
    {/* shell highlight */}
    <rect x="16" y="16" width="20" height="10" fill={W} fillOpacity={0.2} />
    {/* shell grid pattern */}
    <rect x="18" y="18" width="28" height="4" fill={p} fillOpacity={0.5} />
    <rect x="14" y="26" width="36" height="4" fill={p} fillOpacity={0.5} />
    <rect x="18" y="34" width="28" height="4" fill={p} fillOpacity={0.5} />
    <rect x="28" y="18" width="4" height="24" fill={p} fillOpacity={0.5} />
    <rect x="18" y="42" width="6" height="4" fill={a} />
    <rect x="40" y="42" width="6" height="4" fill={a} />
    {/* head */}
    <rect x="16" y="4" width="18" height="10" fill={p} />
    <rect x="20" y="8" width="14" height="10" fill={p} />
    <rect x="16" y="4" width="6" height="6" fill={B} />
    <rect x="16" y="4" width="3" height="3" fill={W} />
    {/* legs */}
    <rect x="2" y="22" width="12" height="10" fill={p} />
    <rect x="50" y="22" width="12" height="10" fill={p} />
    <rect x="10" y="42" width="14" height="10" fill={p} />
    <rect x="40" y="42" width="14" height="10" fill={p} />
  </svg>
);

/* ─── FOX ─── */
const fox: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="2" width="14" height="18" fill={p} />
    <rect x="40" y="2" width="14" height="18" fill={p} />
    <rect x="14" y="5" width="6" height="10" fill={W} />
    <rect x="44" y="5" width="6" height="10" fill={W} />
    {/* head */}
    <rect x="10" y="18" width="40" height="18" fill={p} />
    <rect x="6" y="22" width="48" height="10" fill={p} />
    <rect x="14" y="20" width="16" height="8" fill={W} fillOpacity={0.15} />
    {/* muzzle */}
    <rect x="18" y="28" width="24" height="14" fill={s} />
    {/* eyes */}
    <rect x="18" y="22" width="10" height="10" fill={B} />
    <rect x="36" y="22" width="10" height="10" fill={B} />
    <rect x="18" y="22" width="5" height="5" fill={W} />
    <rect x="36" y="22" width="5" height="5" fill={W} />
    <rect x="21" y="25" width="4" height="4" fill={B} />
    <rect x="39" y="25" width="4" height="4" fill={B} />
    <rect x="21" y="25" width="2" height="2" fill={W} />
    <rect x="39" y="25" width="2" height="2" fill={W} />
    {/* nose */}
    <rect x="27" y="32" width="10" height="6" fill={B} />
    <rect x="29" y="34" width="2" height="2" fill={W} />
    {/* body */}
    <rect x="14" y="36" width="30" height="18" fill={p} />
    {/* tail */}
    <rect x="44" y="26" width="18" height="22" fill={a} />
    <rect x="48" y="22" width="14" height="6" fill={a} />
    <rect x="50" y="48" width="14" height="6" fill={W} />
    <rect x="44" y="48" width="8" height="6" fill={W} />
    {/* foxfire orb */}
    <rect x="0" y="14" width="14" height="14" fill={a} fillOpacity={0.3} />
    <rect x="2" y="16" width="10" height="10" fill={a} />
    <rect x="4" y="18" width="6" height="6" fill="#90EE90" />
    <rect x="5" y="19" width="4" height="4" fill={W} fillOpacity={0.8} />
    {/* orb glow corners */}
    <rect x="0" y="12" width="4" height="4" fill={a} fillOpacity={0.5} />
    <rect x="14" y="12" width="4" height="4" fill={a} fillOpacity={0.5} />
    <rect x="0" y="28" width="4" height="4" fill={a} fillOpacity={0.5} />
    <rect x="14" y="28" width="4" height="4" fill={a} fillOpacity={0.5} />
    {/* feet */}
    <rect x="18" y="54" width="10" height="6" fill={s} />
    <rect x="32" y="54" width="10" height="6" fill={s} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="2" width="14" height="18" fill={p} />
    <rect x="40" y="2" width="14" height="18" fill={p} />
    <rect x="14" y="5" width="6" height="10" fill={W} />
    <rect x="44" y="5" width="6" height="10" fill={W} />
    {/* head */}
    <rect x="10" y="18" width="40" height="18" fill={p} />
    <rect x="6" y="22" width="48" height="10" fill={p} />
    <rect x="14" y="20" width="16" height="8" fill={W} fillOpacity={0.15} />
    {/* muzzle */}
    <rect x="18" y="28" width="24" height="14" fill={s} />
    {/* eyes */}
    <rect x="18" y="22" width="10" height="10" fill={B} />
    <rect x="36" y="22" width="10" height="10" fill={B} />
    <rect x="18" y="22" width="5" height="5" fill={W} />
    <rect x="36" y="22" width="5" height="5" fill={W} />
    <rect x="21" y="25" width="4" height="4" fill={B} />
    <rect x="39" y="25" width="4" height="4" fill={B} />
    <rect x="21" y="25" width="2" height="2" fill={W} />
    <rect x="39" y="25" width="2" height="2" fill={W} />
    {/* nose */}
    <rect x="27" y="32" width="10" height="6" fill={B} />
    <rect x="29" y="34" width="2" height="2" fill={W} />
    {/* body */}
    <rect x="14" y="36" width="30" height="18" fill={p} />
    {/* tail */}
    <rect x="44" y="26" width="18" height="22" fill={a} />
    <rect x="48" y="22" width="14" height="6" fill={a} />
    <rect x="50" y="48" width="14" height="6" fill={W} />
    <rect x="44" y="48" width="8" height="6" fill={W} />
    {/* feet */}
    <rect x="18" y="54" width="10" height="6" fill={s} />
    <rect x="32" y="54" width="10" height="6" fill={s} />
  </svg>
);

/* ─── WOLF ─── */
const wolf: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears pointed */}
    <rect x="10" y="0" width="14" height="18" fill={p} />
    <rect x="40" y="0" width="14" height="18" fill={p} />
    <rect x="14" y="3" width="6" height="10" fill={s} />
    <rect x="44" y="3" width="6" height="10" fill={s} />
    {/* head raised for howl */}
    <rect x="14" y="10" width="36" height="18" fill={p} />
    <rect x="10" y="14" width="44" height="10" fill={p} />
    {/* eye markings */}
    <rect x="14" y="14" width="10" height="6" fill={a} />
    <rect x="40" y="14" width="10" height="6" fill={a} />
    {/* howl pose eyes - closed/squinting */}
    <rect x="16" y="16" width="8" height="3" fill={B} />
    <rect x="40" y="16" width="8" height="3" fill={B} />
    {/* muzzle raised */}
    <rect x="18" y="26" width="28" height="12" fill={s} />
    <rect x="22" y="36" width="20" height="6" fill={s} />
    {/* open mouth howling */}
    <rect x="26" y="28" width="12" height="10" fill={B} />
    <rect x="26" y="32" width="12" height="6" fill="#DC143C" />
    <rect x="26" y="38" width="12" height="2" fill={B} />
    {/* fangs */}
    <rect x="28" y="28" width="4" height="4" fill={W} />
    <rect x="32" y="28" width="4" height="4" fill={W} />
    {/* body */}
    <rect x="10" y="40" width="44" height="18" fill={p} />
    <rect x="10" y="40" width="44" height="6" fill={s} fillOpacity={0.5} />
    {/* tail */}
    <rect x="50" y="38" width="10" height="14" fill={p} />
    <rect x="54" y="34" width="6" height="6" fill={p} />
    {/* feet */}
    <rect x="14" y="58" width="14" height="4" fill={s} />
    <rect x="36" y="58" width="14" height="4" fill={s} />
    {/* howl sound waves */}
    <rect x="2" y="2" width="4" height="16" fill={s} fillOpacity={0.7} />
    <rect x="0" y="0" width="2" height="22" fill={s} fillOpacity={0.5} />
    <rect x="58" y="2" width="4" height="16" fill={s} fillOpacity={0.7} />
    <rect x="62" y="0" width="2" height="22" fill={s} fillOpacity={0.5} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="0" width="14" height="18" fill={p} />
    <rect x="40" y="0" width="14" height="18" fill={p} />
    <rect x="14" y="3" width="6" height="10" fill={s} />
    <rect x="44" y="3" width="6" height="10" fill={s} />
    {/* head */}
    <rect x="10" y="16" width="44" height="18" fill={p} />
    <rect x="6" y="20" width="52" height="10" fill={p} />
    <rect x="14" y="14" width="10" height="6" fill={a} />
    <rect x="40" y="14" width="10" height="6" fill={a} />
    <rect x="16" y="18" width="10" height="10" fill={B} />
    <rect x="38" y="18" width="10" height="10" fill={B} />
    <rect x="16" y="18" width="5" height="5" fill={W} />
    <rect x="38" y="18" width="5" height="5" fill={W} />
    <rect x="19" y="21" width="4" height="4" fill={B} />
    <rect x="41" y="21" width="4" height="4" fill={B} />
    <rect x="19" y="21" width="2" height="2" fill={W} />
    <rect x="41" y="21" width="2" height="2" fill={W} />
    {/* muzzle */}
    <rect x="16" y="30" width="32" height="10" fill={s} />
    <rect x="26" y="36" width="12" height="4" fill={B} />
    {/* body */}
    <rect x="10" y="40" width="44" height="18" fill={p} />
    <rect x="10" y="40" width="44" height="6" fill={s} fillOpacity={0.5} />
    <rect x="50" y="38" width="10" height="14" fill={p} />
    <rect x="54" y="34" width="6" height="6" fill={p} />
    {/* feet */}
    <rect x="14" y="58" width="14" height="4" fill={s} />
    <rect x="36" y="58" width="14" height="4" fill={s} />
  </svg>
);

/* ─── ROBOT ─── */
const robot: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* antenna */}
    <rect x="28" y="0" width="8" height="8" fill={s} />
    <rect x="22" y="4" width="20" height="4" fill={a} />
    <rect x="30" y="0" width="4" height="4" fill="#FF2200" />
    {/* head box */}
    <rect x="10" y="8" width="44" height="26" fill={p} />
    <rect x="6" y="12" width="52" height="18" fill={p} />
    {/* panel lines */}
    <rect x="10" y="8" width="44" height="3" fill={s} fillOpacity={0.4} />
    <rect x="10" y="31" width="44" height="3" fill={B} fillOpacity={0.3} />
    {/* eyes charging red */}
    <rect x="14" y="12" width="14" height="14" fill="#FF2200" />
    <rect x="36" y="12" width="14" height="14" fill="#FF2200" />
    <rect x="18" y="16" width="6" height="6" fill="#FF8800" />
    <rect x="40" y="16" width="6" height="6" fill="#FF8800" />
    <rect x="20" y="18" width="3" height="3" fill="#FFFF00" />
    <rect x="42" y="18" width="3" height="3" fill="#FFFF00" />
    {/* laser beams */}
    <rect x="50" y="14" width="14" height="4" fill="#FF2200" />
    <rect x="50" y="18" width="14" height="4" fill="#FF8800" fillOpacity={0.8} />
    <rect x="50" y="10" width="12" height="4" fill="#FF4400" fillOpacity={0.6} />
    {/* mouth panel */}
    <rect x="18" y="26" width="28" height="5" fill={B} />
    <rect x="22" y="27" width="4" height="3" fill={p} />
    <rect x="30" y="27" width="4" height="3" fill={p} />
    <rect x="38" y="27" width="4" height="3" fill={p} />
    {/* torso */}
    <rect x="10" y="34" width="44" height="26" fill={p} />
    <rect x="6" y="38" width="52" height="18" fill={p} />
    {/* chest panel */}
    <rect x="18" y="38" width="28" height="18" fill={s} />
    <rect x="26" y="42" width="12" height="10" fill={a} />
    <rect x="28" y="44" width="8" height="6" fill="#00FFFF" fillOpacity={0.6} />
    {/* arms */}
    <rect x="0" y="34" width="10" height="22" fill={p} />
    <rect x="54" y="34" width="10" height="22" fill={p} />
    <rect x="0" y="34" width="10" height="4" fill={s} fillOpacity={0.4} />
    <rect x="54" y="34" width="10" height="4" fill={s} fillOpacity={0.4} />
    {/* feet */}
    <rect x="14" y="60" width="14" height="4" fill={s} />
    <rect x="36" y="60" width="14" height="4" fill={s} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* antenna */}
    <rect x="28" y="0" width="8" height="8" fill={s} />
    <rect x="22" y="4" width="20" height="4" fill={a} />
    {/* head box */}
    <rect x="10" y="8" width="44" height="26" fill={p} />
    <rect x="6" y="12" width="52" height="18" fill={p} />
    <rect x="10" y="8" width="44" height="3" fill={W} fillOpacity={0.15} />
    <rect x="10" y="31" width="44" height="3" fill={B} fillOpacity={0.2} />
    {/* eyes */}
    <rect x="14" y="12" width="14" height="14" fill={a} />
    <rect x="36" y="12" width="14" height="14" fill={a} />
    <rect x="18" y="16" width="6" height="6" fill={W} />
    <rect x="40" y="16" width="6" height="6" fill={W} />
    <rect x="20" y="18" width="3" height="3" fill={a} fillOpacity={0.6} />
    <rect x="42" y="18" width="3" height="3" fill={a} fillOpacity={0.6} />
    {/* mouth panel */}
    <rect x="18" y="26" width="28" height="5" fill={B} />
    <rect x="22" y="27" width="4" height="3" fill={p} />
    <rect x="30" y="27" width="4" height="3" fill={p} />
    <rect x="38" y="27" width="4" height="3" fill={p} />
    {/* torso */}
    <rect x="10" y="34" width="44" height="26" fill={p} />
    <rect x="6" y="38" width="52" height="18" fill={p} />
    <rect x="10" y="34" width="44" height="5" fill={W} fillOpacity={0.12} />
    <rect x="18" y="38" width="28" height="18" fill={s} />
    <rect x="26" y="42" width="12" height="10" fill={a} />
    <rect x="28" y="44" width="8" height="6" fill={W} fillOpacity={0.4} />
    {/* arms */}
    <rect x="0" y="34" width="10" height="22" fill={p} />
    <rect x="54" y="34" width="10" height="22" fill={p} />
    {/* feet */}
    <rect x="14" y="60" width="14" height="4" fill={s} />
    <rect x="36" y="60" width="14" height="4" fill={s} />
  </svg>
);

/* ─── DRAGON ─── */
const dragon: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* horns */}
    <rect x="18" y="2" width="6" height="10" fill={a} />
    <rect x="40" y="2" width="6" height="10" fill={a} />
    <rect x="20" y="0" width="4" height="4" fill={W} fillOpacity={0.5} />
    <rect x="42" y="0" width="4" height="4" fill={W} fillOpacity={0.5} />
    {/* head */}
    <rect x="18" y="10" width="28" height="14" fill={p} />
    <rect x="14" y="14" width="36" height="10" fill={p} />
    <rect x="22" y="12" width="14" height="6" fill={W} fillOpacity={0.15} />
    {/* snout scales */}
    <rect x="18" y="10" width="6" height="6" fill={a} fillOpacity={0.6} />
    {/* glowing eye react */}
    <rect x="34" y="12" width="8" height="8" fill="#FF4444" />
    <rect x="36" y="14" width="4" height="4" fill="#FF8888" />
    <rect x="37" y="15" width="2" height="2" fill={W} />
    {/* normal eye */}
    <rect x="20" y="12" width="8" height="8" fill={B} />
    <rect x="20" y="12" width="4" height="4" fill={W} />
    <rect x="22" y="14" width="3" height="3" fill={B} />
    <rect x="22" y="14" width="1" height="1" fill={W} />
    {/* body */}
    <rect x="14" y="24" width="36" height="22" fill={p} />
    <rect x="10" y="28" width="44" height="14" fill={p} />
    <rect x="18" y="24" width="22" height="10" fill={W} fillOpacity={0.12} />
    {/* belly scales */}
    <rect x="22" y="28" width="20" height="14" fill={s} />
    <rect x="24" y="30" width="16" height="4" fill={s} fillOpacity={0.5} />
    {/* wings */}
    <rect x="2" y="22" width="14" height="18" fill={s} fillOpacity={0.8} />
    <rect x="2" y="22" width="14" height="6" fill={a} fillOpacity={0.5} />
    <rect x="48" y="22" width="14" height="18" fill={s} fillOpacity={0.8} />
    <rect x="0" y="26" width="8" height="14" fill={a} fillOpacity={0.6} />
    <rect x="56" y="26" width="8" height="14" fill={a} fillOpacity={0.6} />
    {/* fire breath */}
    <rect x="42" y="26" width="10" height="10" fill="#FF6600" />
    <rect x="48" y="20" width="14" height="20" fill="#FF6600" fillOpacity={0.9} />
    <rect x="52" y="16" width="12" height="28" fill="#FF4400" fillOpacity={0.8} />
    <rect x="56" y="20" width="8" height="20" fill="#FFD700" fillOpacity={0.7} />
    <rect x="58" y="24" width="6" height="12" fill={W} fillOpacity={0.5} />
    {/* legs */}
    <rect x="18" y="46" width="10" height="14" fill={p} />
    <rect x="36" y="46" width="10" height="14" fill={p} />
    <rect x="16" y="56" width="14" height="4" fill={a} fillOpacity={0.6} />
    <rect x="34" y="56" width="14" height="4" fill={a} fillOpacity={0.6} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* horns */}
    <rect x="18" y="2" width="6" height="10" fill={a} />
    <rect x="40" y="2" width="6" height="10" fill={a} />
    <rect x="20" y="0" width="4" height="4" fill={W} fillOpacity={0.5} />
    <rect x="42" y="0" width="4" height="4" fill={W} fillOpacity={0.5} />
    {/* head */}
    <rect x="18" y="10" width="28" height="14" fill={p} />
    <rect x="14" y="14" width="36" height="10" fill={p} />
    <rect x="22" y="12" width="14" height="6" fill={W} fillOpacity={0.15} />
    <rect x="18" y="10" width="6" height="6" fill={a} fillOpacity={0.6} />
    {/* eyes */}
    <rect x="20" y="12" width="8" height="8" fill={B} />
    <rect x="36" y="12" width="8" height="8" fill={B} />
    <rect x="20" y="12" width="4" height="4" fill={W} />
    <rect x="36" y="12" width="4" height="4" fill={W} />
    <rect x="22" y="14" width="3" height="3" fill={B} />
    <rect x="38" y="14" width="3" height="3" fill={B} />
    <rect x="22" y="14" width="1" height="1" fill={W} />
    <rect x="38" y="14" width="1" height="1" fill={W} />
    {/* body */}
    <rect x="14" y="24" width="36" height="22" fill={p} />
    <rect x="10" y="28" width="44" height="14" fill={p} />
    <rect x="18" y="24" width="22" height="10" fill={W} fillOpacity={0.12} />
    <rect x="22" y="28" width="20" height="14" fill={s} />
    {/* wings */}
    <rect x="2" y="22" width="14" height="18" fill={s} fillOpacity={0.8} />
    <rect x="48" y="22" width="14" height="18" fill={s} fillOpacity={0.8} />
    <rect x="0" y="26" width="8" height="14" fill={a} fillOpacity={0.6} />
    <rect x="56" y="26" width="8" height="14" fill={a} fillOpacity={0.6} />
    {/* tail */}
    <rect x="42" y="32" width="10" height="4" fill={p} />
    <rect x="48" y="36" width="10" height="4" fill={p} />
    <rect x="54" y="40" width="10" height="8" fill={a} />
    {/* legs */}
    <rect x="18" y="46" width="10" height="14" fill={p} />
    <rect x="36" y="46" width="10" height="14" fill={p} />
    <rect x="16" y="56" width="14" height="4" fill={a} fillOpacity={0.6} />
    <rect x="34" y="56" width="14" height="4" fill={a} fillOpacity={0.6} />
  </svg>
);

/* ─── PHOENIX ─── */
const phoenix: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* crest feathers */}
    <rect x="22" y="0" width="20" height="8" fill={a} />
    <rect x="18" y="2" width="8" height="6" fill={a} />
    <rect x="38" y="2" width="8" height="6" fill={a} />
    <rect x="26" y="0" width="12" height="4" fill="#FFD700" />
    {/* head */}
    <rect x="18" y="8" width="28" height="16" fill={p} />
    <rect x="14" y="12" width="36" height="8" fill={p} />
    <rect x="22" y="10" width="14" height="8" fill={W} fillOpacity={0.18} />
    {/* eyes */}
    <rect x="22" y="12" width="6" height="6" fill={B} />
    <rect x="36" y="12" width="6" height="6" fill={B} />
    <rect x="22" y="12" width="3" height="3" fill={W} />
    <rect x="36" y="12" width="3" height="3" fill={W} />
    <rect x="24" y="14" width="2" height="2" fill={B} />
    <rect x="38" y="14" width="2" height="2" fill={B} />
    <rect x="24" y="14" width="1" height="1" fill={W} />
    <rect x="38" y="14" width="1" height="1" fill={W} />
    {/* beak */}
    <rect x="27" y="20" width="10" height="4" fill={a} />
    <rect x="29" y="24" width="6" height="3" fill="#FF8800" />
    {/* body */}
    <rect x="18" y="24" width="28" height="20" fill={p} />
    <rect x="14" y="28" width="36" height="12" fill={p} />
    <rect x="20" y="24" width="18" height="10" fill={W} fillOpacity={0.15} />
    {/* flame corona - rebirth */}
    <rect x="2" y="10" width="16" height="30" fill="#FF6600" fillOpacity={0.9} />
    <rect x="46" y="10" width="16" height="30" fill="#FF6600" fillOpacity={0.9} />
    <rect x="0" y="14" width="8" height="22" fill="#FF4400" fillOpacity={0.8} />
    <rect x="56" y="14" width="8" height="22" fill="#FF4400" fillOpacity={0.8} />
    <rect x="6" y="6" width="8" height="8" fill="#FFD700" fillOpacity={0.9} />
    <rect x="50" y="6" width="8" height="8" fill="#FFD700" fillOpacity={0.9} />
    <rect x="2" y="2" width="6" height="6" fill="#FFD700" fillOpacity={0.6} />
    <rect x="56" y="2" width="6" height="6" fill="#FFD700" fillOpacity={0.6} />
    {/* tail */}
    <rect x="22" y="44" width="20" height="8" fill={s} />
    <rect x="18" y="50" width="28" height="8" fill={a} />
    <rect x="22" y="58" width="20" height="4" fill={a} />
    <rect x="22" y="44" width="6" height="14" fill={p} fillOpacity={0.6} />
    <rect x="36" y="44" width="6" height="14" fill={p} fillOpacity={0.6} />
    {/* flame under tail */}
    <rect x="14" y="52" width="10" height="10" fill="#FF6600" fillOpacity={0.8} />
    <rect x="40" y="52" width="10" height="10" fill="#FF6600" fillOpacity={0.8} />
    <rect x="26" y="60" width="12" height="4" fill="#FFD700" fillOpacity={0.9} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* crest */}
    <rect x="22" y="0" width="20" height="8" fill={a} />
    <rect x="18" y="2" width="8" height="6" fill={a} />
    <rect x="38" y="2" width="8" height="6" fill={a} />
    <rect x="26" y="0" width="12" height="4" fill="#FFD700" />
    {/* head */}
    <rect x="18" y="8" width="28" height="16" fill={p} />
    <rect x="14" y="12" width="36" height="8" fill={p} />
    <rect x="22" y="10" width="14" height="8" fill={W} fillOpacity={0.18} />
    {/* eyes */}
    <rect x="22" y="12" width="6" height="6" fill={B} />
    <rect x="36" y="12" width="6" height="6" fill={B} />
    <rect x="22" y="12" width="3" height="3" fill={W} />
    <rect x="36" y="12" width="3" height="3" fill={W} />
    <rect x="24" y="14" width="2" height="2" fill={B} />
    <rect x="38" y="14" width="2" height="2" fill={B} />
    <rect x="24" y="14" width="1" height="1" fill={W} />
    <rect x="38" y="14" width="1" height="1" fill={W} />
    {/* beak */}
    <rect x="27" y="20" width="10" height="4" fill={a} />
    {/* body */}
    <rect x="18" y="24" width="28" height="20" fill={p} />
    <rect x="14" y="28" width="36" height="12" fill={p} />
    <rect x="20" y="24" width="18" height="10" fill={W} fillOpacity={0.15} />
    {/* wings half-spread */}
    <rect x="2" y="20" width="18" height="22" fill={s} />
    <rect x="44" y="20" width="18" height="22" fill={s} />
    <rect x="0" y="24" width="8" height="18" fill={a} fillOpacity={0.7} />
    <rect x="56" y="24" width="8" height="18" fill={a} fillOpacity={0.7} />
    {/* wing highlight */}
    <rect x="4" y="22" width="12" height="6" fill={W} fillOpacity={0.15} />
    <rect x="48" y="22" width="12" height="6" fill={W} fillOpacity={0.15} />
    {/* tail */}
    <rect x="22" y="44" width="20" height="8" fill={s} />
    <rect x="18" y="50" width="28" height="8" fill={a} />
    <rect x="22" y="58" width="20" height="4" fill={a} />
    <rect x="22" y="44" width="6" height="14" fill={p} fillOpacity={0.6} />
    <rect x="36" y="44" width="6" height="14" fill={p} fillOpacity={0.6} />
  </svg>
);

/* ─── UNICORN ─── */
const unicorn: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* horn glowing */}
    <rect x="14" y="0" width="6" height="14" fill="#FFD700" />
    <rect x="18" y="2" width="6" height="10" fill="#FFD700" />
    <rect x="22" y="2" width="6" height="14" fill={a} />
    <rect x="26" y="6" width="6" height="16" fill={a} />
    <rect x="30" y="2" width="6" height="14" fill="#FFD93D" />
    <rect x="16" y="2" width="4" height="4" fill={W} fillOpacity={0.7} />
    {/* magic beam from horn tip */}
    <rect x="0" y="0" width="14" height="4" fill="#FFD700" />
    <rect x="0" y="4" width="10" height="4" fill="#FFD93D" fillOpacity={0.8} />
    <rect x="0" y="8" width="14" height="4" fill={W} fillOpacity={0.9} />
    {/* sparkle trail */}
    <rect x="0" y="0" width="4" height="4" fill={W} />
    <rect x="6" y="6" width="4" height="4" fill={W} fillOpacity={0.7} />
    <rect x="2" y="12" width="4" height="4" fill="#FFD700" fillOpacity={0.6} />
    {/* head - horse-like */}
    <rect x="10" y="12" width="36" height="18" fill={s} />
    <rect x="6" y="16" width="44" height="10" fill={s} />
    <rect x="14" y="14" width="20" height="8" fill={W} fillOpacity={0.2} />
    {/* eye */}
    <rect x="14" y="16" width="10" height="10" fill={B} />
    <rect x="14" y="16" width="5" height="5" fill={W} />
    <rect x="17" y="19" width="4" height="4" fill={B} />
    <rect x="17" y="19" width="2" height="2" fill={W} />
    {/* muzzle */}
    <rect x="36" y="22" width="14" height="10" fill={s} fillOpacity={0.7} />
    <rect x="38" y="26" width="8" height="4" fill={a} />
    {/* body */}
    <rect x="10" y="30" width="36" height="22" fill={s} />
    <rect x="6" y="34" width="44" height="14" fill={s} />
    <rect x="14" y="30" width="22" height="10" fill={W} fillOpacity={0.18} />
    {/* mane */}
    <rect x="46" y="30" width="10" height="6" fill={a} />
    <rect x="50" y="36" width="10" height="14" fill={a} />
    <rect x="52" y="46" width="10" height="8" fill="#FFD93D" />
    {/* legs */}
    <rect x="18" y="52" width="10" height="12" fill={p} />
    <rect x="30" y="52" width="10" height="12" fill={p} />
    <rect x="42" y="52" width="10" height="12" fill={p} />
    {/* sparkles around horn */}
    <rect x="34" y="0" width="4" height="4" fill="#FFD700" />
    <rect x="42" y="4" width="4" height="4" fill="#FFD700" fillOpacity={0.8} />
    <rect x="38" y="10" width="4" height="4" fill={a} fillOpacity={0.7} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* horn */}
    <rect x="14" y="0" width="6" height="14" fill="#FFD700" />
    <rect x="18" y="2" width="6" height="10" fill="#FFD700" />
    <rect x="22" y="2" width="6" height="14" fill={a} />
    <rect x="26" y="6" width="6" height="16" fill={a} />
    <rect x="30" y="2" width="6" height="14" fill="#FFD93D" />
    <rect x="16" y="2" width="4" height="4" fill={W} fillOpacity={0.6} />
    {/* head */}
    <rect x="10" y="12" width="36" height="18" fill={s} />
    <rect x="6" y="16" width="44" height="10" fill={s} />
    <rect x="14" y="14" width="20" height="8" fill={W} fillOpacity={0.2} />
    {/* eye */}
    <rect x="14" y="16" width="10" height="10" fill={B} />
    <rect x="14" y="16" width="5" height="5" fill={W} />
    <rect x="17" y="19" width="4" height="4" fill={B} />
    <rect x="17" y="19" width="2" height="2" fill={W} />
    {/* muzzle */}
    <rect x="36" y="22" width="14" height="10" fill={s} fillOpacity={0.7} />
    {/* body */}
    <rect x="10" y="30" width="36" height="22" fill={s} />
    <rect x="6" y="34" width="44" height="14" fill={s} />
    <rect x="14" y="30" width="22" height="10" fill={W} fillOpacity={0.18} />
    {/* mane */}
    <rect x="46" y="30" width="10" height="6" fill={a} />
    <rect x="50" y="36" width="10" height="14" fill={a} />
    <rect x="52" y="46" width="10" height="8" fill="#FFD93D" />
    {/* legs */}
    <rect x="18" y="52" width="10" height="12" fill={p} />
    <rect x="30" y="52" width="10" height="12" fill={p} />
    <rect x="42" y="52" width="10" height="12" fill={p} />
    {/* sparkles */}
    <rect x="34" y="0" width="4" height="4" fill="#FFD700" fillOpacity={0.7} />
    <rect x="42" y="4" width="4" height="4" fill="#FFD700" fillOpacity={0.5} />
  </svg>
);

/* ─── HORSE ─── */
const horse: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="4" width="6" height="10" fill={p} />
    <rect x="20" y="4" width="6" height="10" fill={p} />
    <rect x="12" y="6" width="2" height="4" fill={a} />
    <rect x="22" y="6" width="2" height="4" fill={a} />
    {/* mane back */}
    <rect x="4" y="10" width="8" height="22" fill={a} />
    <rect x="2" y="14" width="6" height="18" fill={a} />
    <rect x="6" y="32" width="8" height="14" fill={a} />
    {/* head */}
    <rect x="8" y="12" width="22" height="22" fill={p} />
    <rect x="10" y="10" width="18" height="2" fill={p} />
    <rect x="6" y="16" width="26" height="14" fill={p} />
    <rect x="12" y="14" width="14" height="6" fill={W} fillOpacity={0.2} />
    {/* eye - reacting (wide) */}
    <rect x="12" y="18" width="8" height="8" fill={B} />
    <rect x="13" y="19" width="4" height="4" fill={W} />
    <rect x="14" y="20" width="2" height="2" fill={B} />
    {/* muzzle */}
    <rect x="22" y="22" width="12" height="10" fill={s} />
    <rect x="24" y="26" width="6" height="3" fill={a} />
    <rect x="32" y="20" width="4" height="4" fill={W} fillOpacity={0.5} />
    {/* body */}
    <rect x="14" y="34" width="40" height="16" fill={p} />
    <rect x="10" y="38" width="48" height="10" fill={p} />
    <rect x="18" y="34" width="24" height="8" fill={W} fillOpacity={0.18} />
    {/* mane top of body */}
    <rect x="20" y="32" width="8" height="6" fill={a} />
    <rect x="14" y="32" width="6" height="4" fill={a} />
    {/* legs galloping */}
    <rect x="18" y="50" width="6" height="10" fill={p} />
    <rect x="26" y="50" width="6" height="14" fill={p} />
    <rect x="38" y="50" width="6" height="14" fill={p} />
    <rect x="46" y="50" width="6" height="10" fill={p} />
    <rect x="18" y="60" width="6" height="3" fill={B} />
    <rect x="46" y="60" width="6" height="3" fill={B} />
    {/* tail */}
    <rect x="54" y="36" width="8" height="6" fill={a} />
    <rect x="56" y="42" width="6" height="14" fill={a} />
    {/* dust */}
    <rect x="14" y="60" width="4" height="4" fill={W} fillOpacity={0.6} />
    <rect x="50" y="60" width="4" height="4" fill={W} fillOpacity={0.6} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="10" y="6" width="6" height="10" fill={p} />
    <rect x="20" y="6" width="6" height="10" fill={p} />
    <rect x="12" y="8" width="2" height="4" fill={a} />
    <rect x="22" y="8" width="2" height="4" fill={a} />
    {/* mane */}
    <rect x="4" y="12" width="8" height="22" fill={a} />
    <rect x="2" y="16" width="6" height="18" fill={a} />
    <rect x="6" y="34" width="8" height="14" fill={a} />
    {/* head */}
    <rect x="8" y="14" width="22" height="22" fill={p} />
    <rect x="6" y="18" width="26" height="14" fill={p} />
    <rect x="12" y="16" width="14" height="6" fill={W} fillOpacity={0.2} />
    {/* eye */}
    <rect x="14" y="20" width="6" height="6" fill={B} />
    <rect x="14" y="20" width="3" height="3" fill={W} />
    <rect x="15" y="21" width="2" height="2" fill={B} />
    {/* muzzle */}
    <rect x="22" y="24" width="12" height="10" fill={s} />
    <rect x="24" y="28" width="6" height="3" fill={a} />
    {/* body */}
    <rect x="14" y="36" width="40" height="16" fill={p} />
    <rect x="10" y="40" width="48" height="10" fill={p} />
    <rect x="18" y="36" width="24" height="8" fill={W} fillOpacity={0.18} />
    {/* mane on body */}
    <rect x="20" y="34" width="8" height="4" fill={a} />
    {/* legs */}
    <rect x="18" y="52" width="6" height="12" fill={p} />
    <rect x="28" y="52" width="6" height="12" fill={p} />
    <rect x="38" y="52" width="6" height="12" fill={p} />
    <rect x="46" y="52" width="6" height="12" fill={p} />
    <rect x="18" y="62" width="6" height="2" fill={B} />
    <rect x="28" y="62" width="6" height="2" fill={B} />
    <rect x="38" y="62" width="6" height="2" fill={B} />
    <rect x="46" y="62" width="6" height="2" fill={B} />
    {/* tail */}
    <rect x="54" y="38" width="8" height="6" fill={a} />
    <rect x="56" y="44" width="6" height="14" fill={a} />
  </svg>
);

/* ─── TIGER ─── */
const tiger: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="6" y="6" width="10" height="10" fill={p} />
    <rect x="48" y="6" width="10" height="10" fill={p} />
    <rect x="9" y="9" width="4" height="4" fill={a} />
    <rect x="51" y="9" width="4" height="4" fill={a} />
    {/* head */}
    <rect x="10" y="12" width="44" height="28" fill={p} />
    <rect x="6" y="16" width="52" height="20" fill={p} />
    {/* stripes */}
    <rect x="10" y="14" width="4" height="14" fill={B} />
    <rect x="20" y="14" width="4" height="10" fill={B} />
    <rect x="40" y="14" width="4" height="10" fill={B} />
    <rect x="50" y="14" width="4" height="14" fill={B} />
    <rect x="6" y="28" width="6" height="3" fill={B} />
    <rect x="52" y="28" width="6" height="3" fill={B} />
    {/* face cream */}
    <rect x="22" y="22" width="20" height="12" fill={W} fillOpacity={0.85} />
    {/* fierce eyes */}
    <rect x="18" y="22" width="10" height="10" fill={a} />
    <rect x="36" y="22" width="10" height="10" fill={a} />
    <rect x="20" y="24" width="6" height="6" fill={B} />
    <rect x="38" y="24" width="6" height="6" fill={B} />
    <rect x="20" y="24" width="3" height="3" fill={W} />
    <rect x="38" y="24" width="3" height="3" fill={W} />
    {/* nose */}
    <rect x="28" y="32" width="8" height="4" fill={B} />
    {/* roar mouth */}
    <rect x="22" y="36" width="20" height="6" fill={B} />
    <rect x="24" y="38" width="4" height="4" fill={W} />
    <rect x="36" y="38" width="4" height="4" fill={W} />
    {/* body w/ stripes */}
    <rect x="14" y="42" width="36" height="16" fill={p} />
    <rect x="14" y="44" width="3" height="14" fill={B} />
    <rect x="22" y="44" width="3" height="14" fill={B} />
    <rect x="30" y="44" width="3" height="14" fill={B} />
    <rect x="38" y="44" width="3" height="14" fill={B} />
    <rect x="46" y="44" width="3" height="14" fill={B} />
    {/* paws raised */}
    <rect x="10" y="44" width="6" height="10" fill={p} />
    <rect x="48" y="44" width="6" height="10" fill={p} />
    {/* claws */}
    <rect x="10" y="42" width="2" height="4" fill={W} />
    <rect x="13" y="42" width="2" height="4" fill={W} />
    <rect x="49" y="42" width="2" height="4" fill={W} />
    <rect x="52" y="42" width="2" height="4" fill={W} />
    {/* tail */}
    <rect x="50" y="56" width="12" height="4" fill={p} />
    <rect x="58" y="50" width="4" height="10" fill={p} />
    <rect x="56" y="58" width="4" height="2" fill={B} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* ears */}
    <rect x="6" y="8" width="10" height="10" fill={p} />
    <rect x="48" y="8" width="10" height="10" fill={p} />
    <rect x="9" y="11" width="4" height="4" fill={a} />
    <rect x="51" y="11" width="4" height="4" fill={a} />
    {/* head */}
    <rect x="10" y="14" width="44" height="26" fill={p} />
    <rect x="6" y="18" width="52" height="18" fill={p} />
    {/* stripes */}
    <rect x="10" y="16" width="4" height="12" fill={B} />
    <rect x="20" y="16" width="4" height="8" fill={B} />
    <rect x="40" y="16" width="4" height="8" fill={B} />
    <rect x="50" y="16" width="4" height="12" fill={B} />
    {/* face cream */}
    <rect x="22" y="24" width="20" height="12" fill={W} fillOpacity={0.85} />
    {/* eyes */}
    <rect x="18" y="24" width="8" height="8" fill={B} />
    <rect x="38" y="24" width="8" height="8" fill={B} />
    <rect x="18" y="24" width="4" height="4" fill={W} />
    <rect x="38" y="24" width="4" height="4" fill={W} />
    <rect x="20" y="26" width="3" height="3" fill={a} />
    <rect x="40" y="26" width="3" height="3" fill={a} />
    {/* nose */}
    <rect x="28" y="32" width="8" height="4" fill={B} />
    {/* mouth */}
    <rect x="26" y="36" width="12" height="2" fill={B} />
    {/* body */}
    <rect x="14" y="42" width="36" height="18" fill={p} />
    <rect x="10" y="46" width="44" height="12" fill={p} />
    <rect x="14" y="44" width="3" height="14" fill={B} />
    <rect x="22" y="44" width="3" height="14" fill={B} />
    <rect x="30" y="44" width="3" height="14" fill={B} />
    <rect x="38" y="44" width="3" height="14" fill={B} />
    <rect x="46" y="44" width="3" height="14" fill={B} />
    {/* paws */}
    <rect x="14" y="58" width="10" height="6" fill={p} />
    <rect x="40" y="58" width="10" height="6" fill={p} />
    {/* tail */}
    <rect x="50" y="50" width="12" height="4" fill={p} />
    <rect x="56" y="46" width="4" height="6" fill={p} />
  </svg>
);

/* ─── LION ─── */
const lion: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* mane - full halo, spiky */}
    <rect x="6" y="6" width="52" height="40" fill={s} />
    <rect x="2" y="10" width="60" height="32" fill={s} />
    <rect x="4" y="14" width="56" height="28" fill={a} />
    {/* mane spikes */}
    <rect x="0" y="14" width="4" height="6" fill={a} />
    <rect x="60" y="14" width="4" height="6" fill={a} />
    <rect x="0" y="24" width="4" height="6" fill={a} />
    <rect x="60" y="24" width="4" height="6" fill={a} />
    <rect x="0" y="34" width="4" height="6" fill={a} />
    <rect x="60" y="34" width="4" height="6" fill={a} />
    <rect x="14" y="2" width="6" height="8" fill={a} />
    <rect x="26" y="0" width="6" height="8" fill={a} />
    <rect x="36" y="0" width="6" height="8" fill={a} />
    <rect x="44" y="2" width="6" height="8" fill={a} />
    {/* head */}
    <rect x="16" y="16" width="32" height="26" fill={p} />
    <rect x="12" y="20" width="40" height="18" fill={p} />
    <rect x="16" y="18" width="20" height="6" fill={W} fillOpacity={0.2} />
    {/* fierce eyes */}
    <rect x="20" y="22" width="9" height="9" fill={B} />
    <rect x="35" y="22" width="9" height="9" fill={B} />
    <rect x="20" y="22" width="4" height="4" fill={a} />
    <rect x="35" y="22" width="4" height="4" fill={a} />
    <rect x="22" y="24" width="2" height="3" fill={W} />
    <rect x="37" y="24" width="2" height="3" fill={W} />
    {/* muzzle pale */}
    <rect x="24" y="32" width="16" height="8" fill={W} fillOpacity={0.7} />
    {/* nose */}
    <rect x="28" y="32" width="8" height="4" fill={B} />
    {/* roar mouth open */}
    <rect x="24" y="38" width="16" height="6" fill={B} />
    <rect x="26" y="40" width="3" height="4" fill={W} />
    <rect x="35" y="40" width="3" height="4" fill={W} />
    {/* body */}
    <rect x="18" y="44" width="28" height="14" fill={p} />
    <rect x="14" y="48" width="36" height="10" fill={p} />
    {/* legs */}
    <rect x="16" y="56" width="8" height="8" fill={p} />
    <rect x="40" y="56" width="8" height="8" fill={p} />
    <rect x="26" y="58" width="6" height="6" fill={p} />
    <rect x="32" y="58" width="6" height="6" fill={p} />
    {/* tail w/ tuft */}
    <rect x="48" y="50" width="10" height="4" fill={p} />
    <rect x="54" y="44" width="4" height="10" fill={p} />
    <rect x="52" y="40" width="8" height="6" fill={a} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* mane */}
    <rect x="6" y="8" width="52" height="38" fill={s} />
    <rect x="2" y="12" width="60" height="30" fill={s} />
    <rect x="4" y="16" width="56" height="26" fill={a} />
    <rect x="0" y="18" width="4" height="20" fill={a} />
    <rect x="60" y="18" width="4" height="20" fill={a} />
    <rect x="14" y="4" width="6" height="6" fill={a} />
    <rect x="28" y="2" width="8" height="6" fill={a} />
    <rect x="44" y="4" width="6" height="6" fill={a} />
    {/* head */}
    <rect x="16" y="18" width="32" height="24" fill={p} />
    <rect x="12" y="22" width="40" height="16" fill={p} />
    <rect x="16" y="20" width="20" height="6" fill={W} fillOpacity={0.2} />
    {/* eyes */}
    <rect x="20" y="24" width="8" height="8" fill={B} />
    <rect x="36" y="24" width="8" height="8" fill={B} />
    <rect x="20" y="24" width="4" height="4" fill={W} />
    <rect x="36" y="24" width="4" height="4" fill={W} />
    <rect x="22" y="26" width="2" height="2" fill={a} />
    <rect x="38" y="26" width="2" height="2" fill={a} />
    {/* muzzle */}
    <rect x="24" y="32" width="16" height="8" fill={W} fillOpacity={0.7} />
    <rect x="28" y="32" width="8" height="4" fill={B} />
    <rect x="26" y="36" width="12" height="2" fill={B} />
    {/* body */}
    <rect x="18" y="44" width="28" height="14" fill={p} />
    <rect x="14" y="48" width="36" height="10" fill={p} />
    {/* legs */}
    <rect x="16" y="58" width="10" height="6" fill={p} />
    <rect x="38" y="58" width="10" height="6" fill={p} />
    {/* tail */}
    <rect x="48" y="50" width="10" height="4" fill={p} />
    <rect x="54" y="46" width="4" height="6" fill={p} />
    <rect x="52" y="42" width="8" height="4" fill={a} />
  </svg>
);

/* ─── SNAKE ─── */
const snake: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* tail coil bottom */}
    <rect x="8" y="52" width="48" height="8" fill={p} />
    <rect x="4" y="48" width="6" height="14" fill={p} />
    <rect x="54" y="48" width="6" height="14" fill={p} />
    <rect x="12" y="46" width="40" height="8" fill={s} fillOpacity={0.6} />
    {/* coil middle */}
    <rect x="10" y="38" width="44" height="10" fill={p} />
    <rect x="14" y="36" width="36" height="6" fill={s} fillOpacity={0.5} />
    {/* coil upper */}
    <rect x="14" y="28" width="36" height="10" fill={p} />
    <rect x="18" y="26" width="28" height="6" fill={s} fillOpacity={0.5} />
    {/* head rearing up */}
    <rect x="22" y="6" width="20" height="22" fill={p} />
    <rect x="18" y="10" width="28" height="14" fill={p} />
    <rect x="24" y="8" width="14" height="6" fill={W} fillOpacity={0.25} />
    {/* hood/frill (cobra) */}
    <rect x="14" y="12" width="6" height="12" fill={s} />
    <rect x="44" y="12" width="6" height="12" fill={s} />
    <rect x="12" y="16" width="4" height="6" fill={s} fillOpacity={0.8} />
    <rect x="48" y="16" width="4" height="6" fill={s} fillOpacity={0.8} />
    {/* angry eyes (react) */}
    <rect x="24" y="14" width="6" height="6" fill={a} />
    <rect x="34" y="14" width="6" height="6" fill={a} />
    <rect x="25" y="15" width="2" height="4" fill={B} />
    <rect x="37" y="15" width="2" height="4" fill={B} />
    {/* fangs */}
    <rect x="26" y="24" width="3" height="6" fill={W} />
    <rect x="35" y="24" width="3" height="6" fill={W} />
    {/* forked tongue */}
    <rect x="30" y="22" width="4" height="4" fill={a} />
    <rect x="28" y="26" width="3" height="3" fill={a} />
    <rect x="33" y="26" width="3" height="3" fill={a} />
    {/* scales pattern */}
    <rect x="20" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
    <rect x="28" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
    <rect x="36" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
    <rect x="44" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* bottom coil */}
    <rect x="6" y="52" width="52" height="8" fill={p} />
    <rect x="2" y="48" width="6" height="14" fill={p} />
    <rect x="56" y="48" width="6" height="14" fill={p} />
    <rect x="10" y="46" width="44" height="8" fill={s} fillOpacity={0.6} />
    {/* middle coil */}
    <rect x="8" y="38" width="48" height="10" fill={p} />
    <rect x="12" y="36" width="40" height="6" fill={s} fillOpacity={0.5} />
    {/* upper coil */}
    <rect x="14" y="28" width="36" height="10" fill={p} />
    <rect x="18" y="26" width="28" height="6" fill={s} fillOpacity={0.5} />
    {/* head */}
    <rect x="22" y="10" width="20" height="20" fill={p} />
    <rect x="18" y="14" width="28" height="12" fill={p} />
    <rect x="24" y="12" width="14" height="6" fill={W} fillOpacity={0.25} />
    {/* hood */}
    <rect x="14" y="16" width="6" height="10" fill={s} />
    <rect x="44" y="16" width="6" height="10" fill={s} />
    {/* eyes */}
    <rect x="24" y="18" width="6" height="6" fill={B} />
    <rect x="34" y="18" width="6" height="6" fill={B} />
    <rect x="24" y="18" width="3" height="3" fill={a} />
    <rect x="34" y="18" width="3" height="3" fill={a} />
    {/* tongue */}
    <rect x="30" y="26" width="4" height="4" fill={a} />
    {/* scales */}
    <rect x="20" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
    <rect x="28" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
    <rect x="36" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
    <rect x="44" y="40" width="4" height="4" fill={a} fillOpacity={0.6} />
  </svg>
);

/* ─── DEER ─── */
const deer: Renderer = ({ p, s, a }, sz, f) => f === "react" ? (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* antlers - large branching */}
    <rect x="8" y="0" width="4" height="14" fill={a} />
    <rect x="4" y="4" width="4" height="6" fill={a} />
    <rect x="0" y="0" width="4" height="6" fill={a} />
    <rect x="12" y="2" width="4" height="4" fill={a} />
    <rect x="52" y="0" width="4" height="14" fill={a} />
    <rect x="56" y="4" width="4" height="6" fill={a} />
    <rect x="60" y="0" width="4" height="6" fill={a} />
    <rect x="48" y="2" width="4" height="4" fill={a} />
    {/* sparkle on antler */}
    <rect x="0" y="0" width="2" height="2" fill={W} />
    <rect x="62" y="0" width="2" height="2" fill={W} />
    {/* ears */}
    <rect x="16" y="8" width="6" height="10" fill={p} />
    <rect x="42" y="8" width="6" height="10" fill={p} />
    <rect x="18" y="10" width="2" height="6" fill={a} fillOpacity={0.5} />
    <rect x="44" y="10" width="2" height="6" fill={a} fillOpacity={0.5} />
    {/* head */}
    <rect x="18" y="14" width="28" height="22" fill={p} />
    <rect x="14" y="18" width="36" height="14" fill={p} />
    <rect x="20" y="16" width="14" height="6" fill={W} fillOpacity={0.2} />
    {/* eyes wide */}
    <rect x="20" y="20" width="8" height="8" fill={B} />
    <rect x="36" y="20" width="8" height="8" fill={B} />
    <rect x="22" y="22" width="4" height="4" fill={W} />
    <rect x="38" y="22" width="4" height="4" fill={W} />
    <rect x="22" y="22" width="2" height="2" fill={B} />
    <rect x="38" y="22" width="2" height="2" fill={B} />
    {/* muzzle */}
    <rect x="26" y="28" width="12" height="8" fill={s} />
    <rect x="28" y="32" width="8" height="3" fill={B} />
    {/* spots on head */}
    <rect x="14" y="22" width="3" height="3" fill={W} />
    <rect x="48" y="22" width="3" height="3" fill={W} />
    {/* body */}
    <rect x="14" y="36" width="36" height="16" fill={p} />
    <rect x="10" y="40" width="44" height="10" fill={p} />
    {/* spots on body */}
    <rect x="18" y="40" width="3" height="3" fill={W} />
    <rect x="26" y="42" width="3" height="3" fill={W} />
    <rect x="34" y="40" width="3" height="3" fill={W} />
    <rect x="42" y="42" width="3" height="3" fill={W} />
    {/* legs leaping */}
    <rect x="14" y="52" width="6" height="12" fill={p} />
    <rect x="22" y="52" width="6" height="10" fill={p} />
    <rect x="34" y="52" width="6" height="10" fill={p} />
    <rect x="44" y="52" width="6" height="12" fill={p} />
    <rect x="14" y="60" width="6" height="3" fill={B} />
    <rect x="44" y="60" width="6" height="3" fill={B} />
    {/* tail */}
    <rect x="50" y="40" width="6" height="4" fill={W} />
  </svg>
) : (
  <svg width={sz} height={sz} viewBox="0 0 64 64" style={{ imageRendering: "pixelated" }}>
    {/* antlers */}
    <rect x="8" y="2" width="4" height="12" fill={a} />
    <rect x="4" y="6" width="4" height="6" fill={a} />
    <rect x="0" y="2" width="4" height="6" fill={a} />
    <rect x="52" y="2" width="4" height="12" fill={a} />
    <rect x="56" y="6" width="4" height="6" fill={a} />
    <rect x="60" y="2" width="4" height="6" fill={a} />
    {/* ears */}
    <rect x="16" y="10" width="6" height="10" fill={p} />
    <rect x="42" y="10" width="6" height="10" fill={p} />
    {/* head */}
    <rect x="18" y="14" width="28" height="22" fill={p} />
    <rect x="14" y="18" width="36" height="14" fill={p} />
    <rect x="20" y="16" width="14" height="6" fill={W} fillOpacity={0.2} />
    {/* eyes */}
    <rect x="20" y="22" width="7" height="7" fill={B} />
    <rect x="37" y="22" width="7" height="7" fill={B} />
    <rect x="21" y="23" width="3" height="3" fill={W} />
    <rect x="38" y="23" width="3" height="3" fill={W} />
    {/* muzzle */}
    <rect x="26" y="28" width="12" height="8" fill={s} />
    <rect x="28" y="32" width="8" height="3" fill={B} />
    {/* body */}
    <rect x="14" y="36" width="36" height="18" fill={p} />
    <rect x="10" y="40" width="44" height="12" fill={p} />
    {/* spots */}
    <rect x="18" y="42" width="3" height="3" fill={W} />
    <rect x="26" y="44" width="3" height="3" fill={W} />
    <rect x="34" y="42" width="3" height="3" fill={W} />
    <rect x="42" y="44" width="3" height="3" fill={W} />
    {/* legs */}
    <rect x="16" y="54" width="6" height="10" fill={p} />
    <rect x="24" y="54" width="6" height="10" fill={p} />
    <rect x="34" y="54" width="6" height="10" fill={p} />
    <rect x="42" y="54" width="6" height="10" fill={p} />
    <rect x="16" y="62" width="6" height="2" fill={B} />
    <rect x="24" y="62" width="6" height="2" fill={B} />
    <rect x="34" y="62" width="6" height="2" fill={B} />
    <rect x="42" y="62" width="6" height="2" fill={B} />
    {/* tail */}
    <rect x="50" y="40" width="6" height="4" fill={W} />
  </svg>
);

/* ─── Sprite map ─── */
const SPRITES: Record<CharacterType, Renderer> = {
  slime, cat, rabbit, ghost, plant, fish, owl, bear,
  turtle, fox, wolf, robot, dragon, phoenix, unicorn,
  horse, tiger, lion, snake, deer,
};

/* ─── Public component ─── */
interface PixelCharacterProps {
  characterId?: number;
  size?: number;
  float?: boolean;
}

export default function PixelCharacter({ characterId, size = 128, float: doFloat = false }: PixelCharacterProps) {
  const [hovered, setHovered] = useState(false);
  const frame: Frame = hovered ? "react" : "idle";

  const def = (characterId !== undefined ? CHARACTERS.find((c) => c.id === characterId) : undefined) ?? CHARACTERS[0];

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
