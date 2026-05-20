import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft, Users, Crown, Calendar, TrendingUp,
  Copy, Check, UserPlus, Plus, X, Swords, Pencil, Camera, ChevronRight,
} from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import type { CurrencyCode } from "../types/domain";
import { PixelSprite } from "./PixelCharacter";
import { CHARACTERS } from "../data/characters";
import type { CharacterDef } from "../data/characters";
import { getPixelEmoji } from "./PixelEmojis";
import { loadStories, formatRelativeTime } from "../lib/story-storage";
import type { StoryEntry } from "../lib/story-storage";

interface GroupMember {
  id: number;
  name: string;
  isHost: boolean;
}

interface Group {
  id: number;
  name: string;
  code: string;
  members: GroupMember[];
  isHost: boolean;
}

interface LocalExpense {
  id: string;
  date: string;
  category: string;
  spentAmount: number;
  spentCurrency: CurrencyCode;
  memo: string;
  participants?: number;
}

/* ── 멤버 대표 캐릭터: memberId 기반 결정론적 배정 ── */
function getMemberCharacter(memberId: number): CharacterDef {
  return CHARACTERS[(memberId * 17 + 3) % CHARACTERS.length];
}

/* ── 파티 배경 4종 ── */
const BG_FOREST = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 32" preserveAspectRatio="xMidYMid slice" style={{ imageRendering: "pixelated" }}>
    {/* 하늘 그라데이션 */}
    <rect x="0" y="0"  width="64" height="32" fill="#87CEEB"/>
    <rect x="0" y="0"  width="64" height="4"  fill="#64B5F6"/>
    <rect x="0" y="18" width="64" height="4"  fill="#A5D6A7"/>
    {/* 지평선 안개 */}
    <rect x="0" y="17" width="64" height="2"  fill="#C8E6C9"/>
    {/* 태양 */}
    <rect x="54" y="1"  width="5" height="5"  fill="#FFD54F"/>
    <rect x="53" y="2"  width="7" height="3"  fill="#FFD54F"/>
    <rect x="55" y="0"  width="3" height="1"  fill="#FFEE58"/>
    <rect x="55" y="6"  width="3" height="1"  fill="#FFD54F"/>
    <rect x="52" y="3"  width="1" height="1"  fill="#FFD54F"/>
    <rect x="60" y="3"  width="1" height="1"  fill="#FFD54F"/>
    {/* 구름 1 */}
    <rect x="4"  y="2"  width="10" height="3" fill="#FFFFFF"/>
    <rect x="5"  y="1"  width="8"  height="1" fill="#FFFFFF"/>
    <rect x="6"  y="5"  width="6"  height="1" fill="#E3F2FD"/>
    <rect x="3"  y="3"  width="2"  height="1" fill="#FFFFFF"/>
    <rect x="13" y="3"  width="2"  height="1" fill="#FFFFFF"/>
    {/* 구름 2 */}
    <rect x="28" y="3"  width="12" height="3" fill="#FFFFFF"/>
    <rect x="30" y="2"  width="8"  height="1" fill="#FFFFFF"/>
    <rect x="29" y="6"  width="9"  height="1" fill="#E3F2FD"/>
    <rect x="27" y="4"  width="2"  height="1" fill="#FFFFFF"/>
    <rect x="39" y="4"  width="2"  height="1" fill="#FFFFFF"/>
    {/* 구름 3 (작은) */}
    <rect x="17" y="6"  width="7"  height="2" fill="#FFFFFF"/>
    <rect x="18" y="5"  width="5"  height="1" fill="#FFFFFF"/>
    {/* 새 */}
    <rect x="22" y="3"  width="1"  height="1" fill="#37474F"/>
    <rect x="24" y="2"  width="1"  height="1" fill="#37474F"/>
    <rect x="46" y="5"  width="1"  height="1" fill="#37474F"/>
    <rect x="48" y="4"  width="1"  height="1" fill="#37474F"/>
    {/* 원경 산 */}
    <rect x="0"  y="13" width="6"  height="6"  fill="#90A4AE"/>
    <rect x="2"  y="11" width="4"  height="3"  fill="#90A4AE"/>
    <rect x="3"  y="9"  width="2"  height="3"  fill="#90A4AE"/>
    <rect x="10" y="14" width="8"  height="5"  fill="#78909C"/>
    <rect x="12" y="12" width="4"  height="3"  fill="#78909C"/>
    <rect x="13" y="10" width="2"  height="3"  fill="#78909C"/>
    <rect x="40" y="13" width="10" height="6"  fill="#90A4AE"/>
    <rect x="43" y="11" width="4"  height="3"  fill="#90A4AE"/>
    <rect x="44" y="9"  width="2"  height="3"  fill="#B0BEC5"/>
    <rect x="53" y="14" width="11" height="5"  fill="#78909C"/>
    <rect x="56" y="12" width="5"  height="3"  fill="#78909C"/>
    <rect x="57" y="10" width="3"  height="3"  fill="#90A4AE"/>
    {/* 나무1 (크) */}
    <rect x="1"  y="12" width="10" height="10" fill="#2E7D32"/>
    <rect x="3"  y="10" width="6"  height="3"  fill="#388E3C"/>
    <rect x="4"  y="8"  width="4"  height="3"  fill="#388E3C"/>
    <rect x="5"  y="6"  width="2"  height="3"  fill="#43A047"/>
    <rect x="3"  y="13" width="2"  height="2"  fill="#1B5E20"/>
    <rect x="8"  y="14" width="2"  height="2"  fill="#1B5E20"/>
    <rect x="5"  y="22" width="2"  height="4"  fill="#4E342E"/>
    <rect x="4"  y="24" width="4"  height="2"  fill="#3E2723"/>
    {/* 나무2 */}
    <rect x="16" y="11" width="8"  height="11" fill="#388E3C"/>
    <rect x="17" y="9"  width="6"  height="3"  fill="#43A047"/>
    <rect x="18" y="7"  width="4"  height="3"  fill="#43A047"/>
    <rect x="19" y="5"  width="2"  height="3"  fill="#66BB6A"/>
    <rect x="17" y="14" width="2"  height="2"  fill="#2E7D32"/>
    <rect x="22" y="13" width="2"  height="2"  fill="#2E7D32"/>
    <rect x="19" y="22" width="2"  height="4"  fill="#4E342E"/>
    {/* 나무3 */}
    <rect x="30" y="12" width="8"  height="10" fill="#2E7D32"/>
    <rect x="31" y="10" width="6"  height="3"  fill="#388E3C"/>
    <rect x="32" y="8"  width="4"  height="3"  fill="#43A047"/>
    <rect x="33" y="6"  width="2"  height="3"  fill="#66BB6A"/>
    <rect x="33" y="22" width="2"  height="4"  fill="#4E342E"/>
    <rect x="31" y="15" width="2"  height="2"  fill="#1B5E20"/>
    {/* 나무4 */}
    <rect x="44" y="11" width="9"  height="11" fill="#388E3C"/>
    <rect x="45" y="9"  width="7"  height="3"  fill="#43A047"/>
    <rect x="46" y="7"  width="5"  height="3"  fill="#43A047"/>
    <rect x="47" y="5"  width="3"  height="3"  fill="#66BB6A"/>
    <rect x="48" y="22" width="2"  height="4"  fill="#4E342E"/>
    <rect x="45" y="14" width="2"  height="2"  fill="#2E7D32"/>
    <rect x="50" y="13" width="2"  height="2"  fill="#1B5E20"/>
    {/* 나무5 (오른쪽) */}
    <rect x="57" y="13" width="7"  height="9"  fill="#2E7D32"/>
    <rect x="58" y="11" width="5"  height="3"  fill="#388E3C"/>
    <rect x="59" y="9"  width="3"  height="3"  fill="#43A047"/>
    <rect x="59" y="22" width="2"  height="4"  fill="#4E342E"/>
    {/* 덤불 */}
    <rect x="13" y="20" width="5"  height="3"  fill="#388E3C"/>
    <rect x="14" y="19" width="3"  height="1"  fill="#43A047"/>
    <rect x="27" y="21" width="4"  height="2"  fill="#2E7D32"/>
    <rect x="42" y="20" width="4"  height="3"  fill="#388E3C"/>
    <rect x="43" y="19" width="2"  height="1"  fill="#43A047"/>
    {/* 땅 */}
    <rect x="0"  y="22" width="64" height="10" fill="#558B2F"/>
    <rect x="0"  y="22" width="64" height="1"  fill="#33691E"/>
    <rect x="0"  y="23" width="64" height="1"  fill="#689F38"/>
    {/* 돌 */}
    <rect x="8"  y="23" width="3"  height="2"  fill="#9E9E9E"/>
    <rect x="9"  y="22" width="2"  height="1"  fill="#BDBDBD"/>
    <rect x="35" y="23" width="4"  height="2"  fill="#757575"/>
    <rect x="36" y="22" width="3"  height="1"  fill="#9E9E9E"/>
    <rect x="55" y="24" width="3"  height="2"  fill="#9E9E9E"/>
    {/* 풀 */}
    {[[2,21],[6,21],[12,21],[15,22],[20,21],[25,21],[28,22],[33,21],[37,22],[40,21],[44,21],[49,22],[53,21],[58,22],[62,21]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="1" height="2" fill={i%3===0?"#8BC34A":"#7CB342"}/>
    ))}
    {/* 꽃 */}
    <rect x="11" y="23" width="1" height="1" fill="#FF80AB"/>
    <rect x="23" y="22" width="1" height="1" fill="#FFD54F"/>
    <rect x="31" y="23" width="1" height="1" fill="#FF80AB"/>
    <rect x="47" y="23" width="1" height="1" fill="#64B5F6"/>
    <rect x="52" y="22" width="1" height="1" fill="#FF80AB"/>
    <rect x="60" y="23" width="1" height="1" fill="#FFD54F"/>
    {/* 버섯 */}
    <rect x="26" y="23" width="2" height="2" fill="#EF5350"/>
    <rect x="25" y="22" width="4" height="1" fill="#EF5350"/>
    <rect x="26" y="22" width="2" height="1" fill="#FFFFFF"/>
    <rect x="27" y="25" width="1" height="1" fill="#BCAAA4"/>
  </svg>
);

const BG_OCEAN = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 32" preserveAspectRatio="xMidYMid slice" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="0"  width="64" height="32" fill="#87CEEB"/>
    <rect x="0" y="0"  width="64" height="3"  fill="#4FC3F7"/>
    <rect x="0" y="13" width="64" height="2"  fill="#B3E5FC"/>
    <rect x="50" y="1"  width="7" height="7"  fill="#FFD54F"/>
    <rect x="49" y="2"  width="9" height="5"  fill="#FFD54F"/>
    <rect x="51" y="0"  width="5" height="1"  fill="#FFEE58"/>
    <rect x="50" y="8"  width="7" height="1"  fill="#FFB300"/>
    <rect x="48" y="4"  width="1" height="1"  fill="#FFD54F"/>
    <rect x="59" y="4"  width="1" height="1"  fill="#FFD54F"/>
    <rect x="40" y="14" width="24" height="1" fill="#FFF9C4"/>
    <rect x="44" y="13" width="16" height="1" fill="#FFEE58"/>
    <rect x="2"  y="2"  width="12" height="4" fill="#FFFFFF"/>
    <rect x="3"  y="1"  width="10" height="1" fill="#FFFFFF"/>
    <rect x="4"  y="6"  width="8"  height="1" fill="#E1F5FE"/>
    <rect x="1"  y="3"  width="2"  height="2" fill="#FFFFFF"/>
    <rect x="13" y="3"  width="2"  height="2" fill="#FFFFFF"/>
    <rect x="22" y="4"  width="10" height="3" fill="#FFFFFF"/>
    <rect x="23" y="3"  width="8"  height="1" fill="#FFFFFF"/>
    <rect x="23" y="7"  width="7"  height="1" fill="#E1F5FE"/>
    <rect x="21" y="5"  width="2"  height="1" fill="#FFFFFF"/>
    <rect x="36" y="2"  width="8"  height="3" fill="#FFFFFF"/>
    <rect x="37" y="1"  width="6"  height="1" fill="#FFFFFF"/>
    <rect x="37" y="5"  width="5"  height="1" fill="#E1F5FE"/>
    <rect x="18" y="3"  width="1" height="1" fill="#455A64"/>
    <rect x="20" y="2"  width="1" height="1" fill="#455A64"/>
    <rect x="32" y="5"  width="1" height="1" fill="#455A64"/>
    <rect x="34" y="4"  width="1" height="1" fill="#455A64"/>
    <rect x="10" y="8"  width="1" height="1" fill="#455A64"/>
    <rect x="12" y="7"  width="1" height="1" fill="#455A64"/>
    <rect x="1"  y="8"  width="4" height="7"  fill="#ECEFF1"/>
    <rect x="2"  y="6"  width="2" height="3"  fill="#ECEFF1"/>
    <rect x="2"  y="5"  width="2" height="1"  fill="#F44336"/>
    <rect x="1"  y="11" width="4" height="1"  fill="#EF9A9A"/>
    <rect x="1"  y="14" width="4" height="1"  fill="#B0BEC5"/>
    <rect x="0"  y="14" width="6" height="1"  fill="#90A4AE"/>
    <rect x="2"  y="9"  width="2" height="2"  fill="#FFF176"/>
    <rect x="30" y="13" width="10" height="2" fill="#795548"/>
    <rect x="31" y="11" width="8"  height="2" fill="#8D6E63"/>
    <rect x="34" y="8"  width="2"  height="3" fill="#F5F5F5"/>
    <rect x="32" y="9"  width="6"  height="1" fill="#E0E0E0"/>
    <rect x="29" y="14" width="12" height="1" fill="#5D4037"/>
    <rect x="0"  y="15" width="64" height="17" fill="#1565C0"/>
    <rect x="0"  y="15" width="64" height="2"  fill="#42A5F5"/>
    <rect x="0"  y="14" width="64" height="1"  fill="#64B5F6"/>
    <rect x="0"  y="17" width="64" height="1"  fill="#1976D2"/>
    <rect x="2"  y="17" width="5"  height="1"  fill="#42A5F5"/>
    <rect x="12" y="18" width="7"  height="1"  fill="#42A5F5"/>
    <rect x="24" y="17" width="6"  height="1"  fill="#42A5F5"/>
    <rect x="36" y="18" width="8"  height="1"  fill="#42A5F5"/>
    <rect x="50" y="17" width="7"  height="1"  fill="#42A5F5"/>
    <rect x="0"  y="22" width="64" height="10" fill="#0D47A1"/>
    <rect x="0"  y="25" width="64" height="7"  fill="#0A3880"/>
    <rect x="10" y="24" width="4" height="2"  fill="#FF8F00"/>
    <rect x="9"  y="25" width="2" height="1"  fill="#FF8F00"/>
    <rect x="13" y="25" width="1" height="1"  fill="#000000"/>
    <rect x="25" y="26" width="4" height="2"  fill="#26C6DA"/>
    <rect x="24" y="27" width="2" height="1"  fill="#26C6DA"/>
    <rect x="28" y="27" width="1" height="1"  fill="#000000"/>
    <rect x="45" y="23" width="4" height="2"  fill="#AB47BC"/>
    <rect x="44" y="24" width="2" height="1"  fill="#AB47BC"/>
    <rect x="5"  y="28" width="1" height="3"  fill="#EF5350"/>
    <rect x="4"  y="27" width="3" height="1"  fill="#EF5350"/>
    <rect x="38" y="27" width="1" height="4"  fill="#EC407A"/>
    <rect x="37" y="26" width="3" height="1"  fill="#EC407A"/>
    <rect x="55" y="28" width="1" height="3"  fill="#FF7043"/>
    <rect x="54" y="27" width="3" height="1"  fill="#FF7043"/>
    <rect x="1"  y="16" width="2" height="1"  fill="#FFFFFF"/>
    <rect x="9"  y="16" width="3" height="1"  fill="#FFFFFF"/>
    <rect x="20" y="15" width="2" height="1"  fill="#FFFFFF"/>
    <rect x="33" y="16" width="3" height="1"  fill="#FFFFFF"/>
    <rect x="44" y="15" width="2" height="1"  fill="#FFFFFF"/>
    <rect x="57" y="16" width="3" height="1"  fill="#FFFFFF"/>
  </svg>
);

const BG_SPACE = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 32" preserveAspectRatio="xMidYMid slice" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="0" width="64" height="32" fill="#04041A"/>
    <rect x="0"  y="8"  width="14" height="8"  fill="#0D0828"/>
    <rect x="30" y="18" width="16" height="7"  fill="#0A1528"/>
    <rect x="50" y="5"  width="14" height="6"  fill="#150828"/>
    {[
      [2,1],[6,3],[11,1],[16,4],[21,2],[27,1],[31,3],[36,1],[41,4],[46,2],[51,1],[56,3],[61,1],[63,5],
      [1,7],[5,9],[9,6],[14,8],[19,7],[23,10],[28,6],[33,9],[38,7],[43,5],[47,9],[53,7],[58,6],[62,9],
      [3,13],[8,15],[13,12],[17,14],[22,13],[26,15],[31,12],[35,14],[39,16],[44,13],[48,15],[54,12],[59,14],[63,16],
      [0,19],[4,21],[10,18],[15,20],[20,22],[25,19],[29,21],[34,18],[40,20],[45,22],[50,19],[55,21],[60,18],[62,22],
      [2,26],[7,28],[12,25],[18,27],[23,25],[28,29],[33,26],[37,28],[42,25],[47,27],[52,26],[57,29],[61,27],
    ].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="1" height="1"
        fill={i%7===0?"#FFD54F":i%5===0?"#B3E5FC":i%3===0?"#FFF9C4":"#FFFFFF"}/>
    ))}
    <rect x="10" y="4"  width="1" height="3" fill="#FFFFFF"/>
    <rect x="9"  y="5"  width="3" height="1" fill="#FFFFFF"/>
    <rect x="48" y="20" width="1" height="3" fill="#FFD54F"/>
    <rect x="47" y="21" width="3" height="1" fill="#FFD54F"/>
    <rect x="25" y="10" width="1" height="3" fill="#B3E5FC"/>
    <rect x="24" y="11" width="3" height="1" fill="#B3E5FC"/>
    <rect x="40" y="2"  width="12" height="10" fill="#6A1B9A"/>
    <rect x="39" y="3"  width="14" height="8"  fill="#7B1FA2"/>
    <rect x="42" y="3"  width="6"  height="5"  fill="#9C27B0"/>
    <rect x="43" y="3"  width="4"  height="3"  fill="#AB47BC"/>
    <rect x="44" y="3"  width="2"  height="2"  fill="#CE93D8"/>
    <rect x="47" y="7"  width="5"  height="4"  fill="#4A148C"/>
    <rect x="49" y="5"  width="3"  height="3"  fill="#4A148C"/>
    <rect x="36" y="7"  width="20" height="1"  fill="#CE93D8"/>
    <rect x="37" y="6"  width="18" height="1"  fill="#AB47BC"/>
    <rect x="5"  y="20" width="7"  height="7"  fill="#1565C0"/>
    <rect x="4"  y="21" width="9"  height="5"  fill="#1976D2"/>
    <rect x="6"  y="21" width="3"  height="3"  fill="#42A5F5"/>
    <rect x="16" y="17" width="6"  height="6"  fill="#ECEFF1"/>
    <rect x="15" y="18" width="8"  height="4"  fill="#ECEFF1"/>
    <rect x="58" y="14" width="1"  height="1"  fill="#FFFFFF"/>
    <rect x="57" y="15" width="2"  height="1"  fill="#FFF9C4"/>
    <rect x="55" y="16" width="3"  height="1"  fill="#FFD54F"/>
    <rect x="53" y="17" width="3"  height="1"  fill="#FF8F00"/>
  </svg>
);

const BG_CITY = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 32" preserveAspectRatio="xMidYMid slice" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="0" width="64" height="32" fill="#0D0D2B"/>
    <rect x="0" y="0" width="64" height="5"  fill="#0A0A25"/>
    {[[3,1],[8,3],[14,1],[19,4],[24,2],[29,1],[35,3],[40,1],[45,4],[51,2],[57,1],[62,3],[1,6],[11,5],[22,6],[33,5],[44,6],[55,5],[63,7]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="1" height="1" fill={i%4===0?"#FFF9C4":"#FFFFFF"}/>
    ))}
    <rect x="4"  y="1"  width="5" height="5"  fill="#FFF9C4"/>
    <rect x="3"  y="2"  width="7" height="3"  fill="#FFF9C4"/>
    <rect x="0"  y="9"  width="9" height="23" fill="#0D1117"/>
    <rect x="3"  y="7"  width="3" height="3"  fill="#0D1117"/>
    {[[1,10],[5,10],[1,13],[5,13],[1,16],[5,16],[1,19],[5,19],[1,22],[5,22],[1,25],[5,25]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%3===0?"#FFD54F":i%3===1?"#37474F":"#FFF176"}/>
    ))}
    <rect x="10" y="13" width="8"  height="19" fill="#161B22"/>
    <rect x="12" y="11" width="4"  height="3"  fill="#161B22"/>
    {[[11,14],[15,14],[11,17],[15,17],[11,20],[15,20],[11,23],[15,23],[11,26],[15,26]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%2===0?"#FFF176":"#37474F"}/>
    ))}
    <rect x="20" y="5"  width="10" height="27" fill="#111827"/>
    <rect x="22" y="3"  width="6"  height="3"  fill="#111827"/>
    <rect x="24" y="2"  width="2"  height="2"  fill="#E040FB"/>
    <rect x="24" y="1"  width="2"  height="1"  fill="#EA80FC"/>
    {[[21,6],[27,6],[21,9],[27,9],[21,12],[27,12],[21,15],[27,15],[21,18],[27,18],[21,21],[27,21],[21,24],[27,24],[21,27],[27,27]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%4===0?"#40C4FF":i%4===1?"#FFD54F":i%4===2?"#37474F":"#E040FB"}/>
    ))}
    <rect x="32" y="11" width="9"  height="21" fill="#0F1923"/>
    <rect x="34" y="9"  width="5"  height="3"  fill="#0F1923"/>
    {[[33,12],[38,12],[33,15],[38,15],[33,18],[38,18],[33,21],[38,21],[33,24],[38,24],[33,27],[38,27]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%3===0?"#FFF176":i%3===1?"#37474F":"#FFD54F"}/>
    ))}
    <rect x="43" y="7"  width="8"  height="25" fill="#0D1117"/>
    <rect x="45" y="5"  width="4"  height="3"  fill="#0D1117"/>
    <rect x="46" y="4"  width="2"  height="2"  fill="#E040FB"/>
    {[[44,8],[49,8],[44,11],[49,11],[44,14],[49,14],[44,17],[49,17],[44,20],[49,20],[44,23],[49,23],[44,26],[49,26]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%4===0?"#E040FB":i%4===1?"#FFD54F":i%4===2?"#37474F":"#40C4FF"}/>
    ))}
    <rect x="53" y="14" width="11" height="18" fill="#161B22"/>
    <rect x="56" y="12" width="5"  height="3"  fill="#161B22"/>
    {[[54,15],[59,15],[54,18],[59,18],[54,21],[59,21],[54,24],[59,24],[54,27],[59,27]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%2===0?"#FFF176":"#40C4FF"}/>
    ))}
    <rect x="0"  y="29" width="64" height="3"  fill="#212121"/>
    {[[6,30],[18,30],[30,30],[42,30],[54,30]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="5" height="1" fill="#FFD54F"/>
    ))}
    <rect x="15" y="29" width="5" height="2"  fill="#1565C0"/>
    <rect x="16" y="28" width="3" height="1"  fill="#1565C0"/>
    <rect x="19" y="29" width="1" height="1"  fill="#FFD54F"/>
    <rect x="46" y="29" width="5" height="2"  fill="#C62828"/>
    <rect x="47" y="28" width="3" height="1"  fill="#C62828"/>
    <rect x="45" y="29" width="1" height="1"  fill="#FFD54F"/>
  </svg>
);

const PARTY_BACKGROUNDS = [
  { name: "숲속", color: "#4CAF50", Component: BG_FOREST },
  { name: "바다", color: "#1565C0", Component: BG_OCEAN },
  { name: "우주", color: "#080820", Component: BG_SPACE },
  { name: "도시", color: "#1A1A2E", Component: BG_CITY },
];


const STORY_GRADIENTS = [
  "linear-gradient(145deg,#667eea,#764ba2)",
  "linear-gradient(145deg,#f093fb,#f5576c)",
  "linear-gradient(145deg,#4facfe,#00f2fe)",
  "linear-gradient(145deg,#43e97b,#38f9d7)",
  "linear-gradient(145deg,#fa709a,#fee140)",
  "linear-gradient(145deg,#a18cd1,#fbc2eb)",
];
const getMemberGradient = (id: number) => STORY_GRADIENTS[id % STORY_GRADIENTS.length];
const CATEGORY_EMOJI: Record<string, string> = {
  식비: "🍜", 교통: "🚌", 카페: "☕", 쇼핑: "🛍", 숙박: "🏨", 엔터테인먼트: "🎭", 기타: "💳",
};

export default function GroupDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expenses, profile, profilePhoto, isLoading } = useAppData();

  const group: Group | undefined = location.state?.group;

  const [showInvite, setShowInvite] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [localExpenses] = useState<LocalExpense[]>([]);
  const [partyBg, setPartyBg] = useState(0);
  const [stories] = useState<Record<number, StoryEntry>>(loadStories);

  /* ── Story overlay ── */
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyViewMembers, setStoryViewMembers] = useState<GroupMember[]>([]);
  const [storyIdx, setStoryIdx] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyPausedRef = useRef(false);
  const storyViewMembersRef = useRef<GroupMember[]>([]);
  storyViewMembersRef.current = storyViewMembers;
  const pointerDownTimeRef = useRef(0);

  const openStory = (members: GroupMember[], startIdx: number) => {
    setStoryViewMembers(members);
    setStoryIdx(startIdx);
    setStoryProgress(0);
    storyPausedRef.current = false;
    setStoryOpen(true);
  };

  const closeStory = () => setStoryOpen(false);

  const storyGoNext = useCallback(() => {
    setStoryIdx((prev) => {
      const next = prev + 1;
      if (next >= storyViewMembersRef.current.length) {
        setStoryOpen(false);
        return prev;
      }
      setStoryProgress(0);
      return next;
    });
  }, []);

  const storyGoPrev = () => {
    setStoryIdx((prev) => {
      if (prev <= 0) return 0;
      setStoryProgress(0);
      return prev - 1;
    });
  };

  /* 자동 진행 타이머 */
  useEffect(() => {
    if (!storyOpen) return;
    setStoryProgress(0);
    const DURATION = 5000;
    const TICK = 50;
    const increment = (TICK / DURATION) * 100;
    const id = setInterval(() => {
      if (storyPausedRef.current) return;
      setStoryProgress((p) => Math.min(p + increment, 100));
    }, TICK);
    return () => clearInterval(id);
  }, [storyOpen, storyIdx]);

  /* 100% 도달 시 다음으로 */
  useEffect(() => {
    if (storyProgress >= 100) storyGoNext();
  }, [storyProgress, storyGoNext]);

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="mb-4">그룹 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/groups")}
          className="bg-primary/80 text-primary-foreground rounded px-4 py-2 text-sm font-medium"
        >
          그룹 목록으로
        </button>
      </div>
    );
  }

  const isCurrentUser = (m: { name: string }) => m.name === profile.name || m.name === "나";

  const copyCode = () => {
    navigator.clipboard.writeText(group.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const serverExpenses = expenses.filter((e) => e.group === group.name);

  const allExpenses = [
    ...localExpenses.map((e) => ({ ...e, baseAmount: Math.round(e.spentAmount * (e.spentCurrency === "JPY" ? 9.1 : 1)) })),
    ...serverExpenses,
  ];

  const goToExpenses = (openForm = false) =>
    navigate(`/groups/${group.id}/expenses`, { state: { group, localExpenses, openForm } });

  return (
    <>
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/groups")}
          className="p-2 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2>{group.name}</h2>
            {group.isHost && <Crown className="w-5 h-5 text-amber-500" />}
          </div>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-all ${
            showInvite
              ? "bg-primary/10 text-primary border border-primary/30"
              : "bg-muted hover:bg-muted/70 text-foreground"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          초대
        </button>
      </div>

      {/* 초대 코드 패널 */}
      {showInvite && (
        <div className="bg-card rounded-md border border-primary/20 p-5">
          <p className="text-sm text-muted-foreground mb-3">아래 코드를 공유해 멤버를 초대하세요</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded px-4 py-3 font-mono text-xl font-bold text-center tracking-widest">
              {group.code}
            </div>
            <button
              onClick={copyCode}
              className="bg-primary/80 text-primary-foreground rounded px-4 py-3 flex items-center gap-2 transition-all hover:shadow-md"
            >
              {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {codeCopied ? "복사됨" : "복사"}
            </button>
          </div>
        </div>
      )}

      {/* ── Members Section ── */}
      <div className="bg-card rounded-md border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            참여 인원
          </h3>
          <span className="text-sm text-muted-foreground">{group.members.length}명</span>
        </div>

        {/* Member story avatars — Instagram 스타일 */}
        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none">
          {group.members.map((member) => {
            const isMe = isCurrentUser(member);
            const hasStory = Boolean(stories[member.id]);
            const membersWithStories = group.members.filter((m) => stories[m.id]);

            const handleAvatarClick = () => {
              if (isMe && !hasStory) {
                navigate("/story/create", { state: { member, group } });
                return;
              }
              if (!hasStory) return;
              const startIdx = membersWithStories.findIndex((m) => m.id === member.id);
              openStory(membersWithStories, startIdx >= 0 ? startIdx : 0);
            };

            return (
              <button
                key={member.id}
                onClick={handleAvatarClick}
                className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
              >
                {/* Ring */}
                <div
                  className={`p-[2.5px] rounded-full transition-all group-active:scale-95 ${
                    hasStory
                      ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                      : isMe
                      ? "border-2 border-dashed border-muted-foreground/40"
                      : member.isHost
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : "border-2 border-transparent"
                  }`}
                >
                  <div className={`rounded-full ${hasStory ? "p-[2px] bg-card" : ""}`}>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/70 to-accent/80 flex items-center justify-center overflow-hidden">
                      {profilePhoto && isMe ? (
                        <img src={profilePhoto} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-xl leading-none">{member.name[0]}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 이름 */}
                <p className="text-[11px] font-medium text-center w-full truncate leading-tight">
                  {isMe ? "내 스토리" : member.name}
                </p>

                {/* 상태 힌트 */}
                {isMe && !hasStory ? (
                  <span className="text-[10px] text-muted-foreground/60 group-hover:text-primary transition-colors flex items-center gap-0.5">
                    <Camera className="w-2.5 h-2.5" />
                    추가
                  </span>
                ) : member.isHost ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500">
                    <Crown className="w-2.5 h-2.5" />
                    호스트
                  </span>
                ) : hasStory ? (
                  <span className="text-[10px] text-primary/70">스토리</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground/40">멤버</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 그룹 지출 ── */}
      <div className="bg-card rounded-md border border-border overflow-hidden">
        {/* Section header — 클릭 시 전체 목록 페이지 이동 */}
        <button
          onClick={() => goToExpenses(false)}
          className="w-full flex items-center justify-between px-5 pt-4 pb-3 hover:bg-muted/50 transition-colors"
        >
          <h3 className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            그룹 지출
            {allExpenses.length > 0 && (
              <span className="text-xs text-muted-foreground font-normal">· {allExpenses.length}건</span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">전체 보기</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>

        <div className="px-5 pb-4 space-y-3">
          {/* 지출 추가 → 전체 목록 페이지에서 폼 열기 */}
          <button
            onClick={() => goToExpenses(true)}
            className="w-full flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-all border border-dashed border-primary/40 text-primary hover:bg-primary/5"
          >
            <Plus className="w-4 h-4" />
            지출 추가
          </button>

          {/* Recent 3 expenses — skeleton or cards */}
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted animate-pulse">
                  <div className="w-10 h-10 rounded-md bg-muted-foreground/20 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
                    <div className="h-2.5 bg-muted-foreground/20 rounded w-1/2" />
                  </div>
                  <div className="space-y-2 shrink-0">
                    <div className="h-3 bg-muted-foreground/20 rounded w-20" />
                    <div className="h-2.5 bg-muted-foreground/20 rounded w-14 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : allExpenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-7 h-7 mx-auto mb-2 opacity-30" />
              <p className="text-sm">아직 지출 내역이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allExpenses.slice(0, 3).map((expense) => (
                <div key={expense.id} className="flex items-center gap-3 p-3 rounded-md bg-muted">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-lg shrink-0">
                    {CATEGORY_EMOJI[expense.category] ?? "💳"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{expense.memo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {expense.date} · {expense.category}
                      {"participants" in expense && expense.participants ? ` · ${expense.participants}명` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-primary leading-tight">
                      {expense.spentCurrency === "JPY"
                        ? `¥${expense.spentAmount.toLocaleString()} → ₩${expense.baseAmount.toLocaleString()}`
                        : `₩${expense.spentAmount.toLocaleString()}`}
                    </p>
                    {"participants" in expense && expense.participants && expense.participants > 1 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        1인 ₩{Math.round(expense.baseAmount / expense.participants).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {allExpenses.length > 3 && (
                <button
                  onClick={() => navigate(`/groups/${group.id}/expenses`, { state: { group, localExpenses } })}
                  className="w-full text-center text-xs text-muted-foreground hover:text-primary py-2 transition-colors"
                >
                  +{allExpenses.length - 3}건 더 보기
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 파티 캐릭터 섹션 ── */}
      <div className="bg-card rounded-md border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3 className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            파티 캐릭터
          </h3>
          <div className="flex items-center gap-1.5">
            {PARTY_BACKGROUNDS.map((bg, i) => (
              <button
                key={i}
                onClick={() => setPartyBg(i)}
                title={bg.name}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  partyBg === i
                    ? "border-primary scale-110 shadow-md"
                    : "border-transparent hover:border-muted-foreground/40"
                }`}
                style={{ backgroundColor: bg.color }}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-4 mb-4 rounded-md overflow-hidden" style={{ height: 160 }}>
          <div className="absolute inset-0">
            {(() => {
              const Bg = PARTY_BACKGROUNDS[partyBg].Component;
              return <Bg />;
            })()}
          </div>

          <div className="absolute inset-0 flex items-end justify-around pb-3 px-2">
            {group.members.map((member) => {
              const char = getMemberCharacter(member.id);
              return (
                <div key={member.id} className="flex flex-col items-center gap-1">
                  {member.isHost && (
                    <Crown className="w-3 h-3 text-amber-400 drop-shadow" />
                  )}
                  <div className="drop-shadow-lg">
                    <PixelSprite type={char.type} colors={char.colors} size={48} />
                  </div>
                  <div style={{
                    background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
                    border: "1px solid #4a9eff",
                    borderTop: "2px solid #73c8ff",
                    borderBottom: "2px solid #1a5fa8",
                    padding: "1px 5px",
                    maxWidth: "56px",
                    fontFamily: "monospace",
                    fontSize: "8px",
                    color: "#e8f4ff",
                    textAlign: "center",
                    letterSpacing: "0.04em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
                    imageRendering: "pixelated",
                  }}>
                    {member.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

      {/* ════════════════════════════════════════
          Instagram 스타일 스토리 뷰어 오버레이
          ════════════════════════════════════════ */}
      {storyOpen && (() => {
        const member = storyViewMembers[storyIdx];
        if (!member) return null;
        const story = stories[member.id] ?? null;
        const isOwn = isCurrentUser(member);

        return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col select-none touch-none">

            {/* ── 상단 진행 바 ── */}
            <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-3 pt-10 pb-2">
              {storyViewMembers.map((m, i) => (
                <div key={m.id} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{
                      width:
                        i < storyIdx ? "100%"
                        : i === storyIdx ? `${storyProgress}%`
                        : "0%",
                      transition: i === storyIdx ? "none" : undefined,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* ── 헤더 (아바타 + 이름 + 시간 + X) ── */}
            <div className="absolute top-14 left-0 right-0 z-30 flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0 flex items-center justify-center bg-gradient-to-br from-violet-500 to-pink-500">
                  {profilePhoto && isOwn
                    ? <img src={profilePhoto} className="w-full h-full object-cover" alt="" />
                    : <span className="text-white font-bold text-sm">{member.name[0]}</span>
                  }
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{member.name}</p>
                  {story && (
                    <p className="text-white/55 text-xs">{formatRelativeTime(story.createdAt)}</p>
                  )}
                </div>
              </div>
              <button
                onClick={closeStory}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── 배경 (사진 or 그라데이션) ── */}
            <div className="absolute inset-0 z-0">
              {story?.photo ? (
                <img
                  src={story.photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: getMemberGradient(member.id) }}
                />
              )}
              {/* 상단 그라데이션 */}
              <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
              {/* 하단 그라데이션 */}
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>

            {/* ── 스토리 없는 멤버 안내 ── */}
            {!story && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-white font-bold text-3xl">
                  {member.name[0]}
                </div>
                <p className="text-white/50 text-sm">아직 올린 스토리가 없어요</p>
                {isOwn && (
                  <button
                    onClick={() => { closeStory(); navigate("/story/create", { state: { member, group } }); }}
                    className="mt-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    스토리 작성하기
                  </button>
                )}
              </div>
            )}

            {/* ── 콘텐츠 (이모지 + 텍스트) ── */}
            {story && (
              <div className="absolute bottom-24 left-5 right-16 z-10">
                {story.emojis && story.emojis.length > 0 && (
                  <div className="flex gap-5 mb-5">
                    {story.emojis.map((key, i) => {
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
                {story.text && (
                  <p className="text-white text-xl font-semibold leading-relaxed break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {story.text}
                  </p>
                )}
              </div>
            )}

            {/* ── 내 스토리 편집 버튼 ── */}
            {isOwn && story && (
              <button
                onClick={() => { closeStory(); navigate("/story/create", { state: { member, group } }); }}
                className="absolute bottom-24 right-5 z-10 w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}

            {/* ── 탭 존 (좌: 이전 / 우: 다음 / 홀드: 일시정지) ── */}
            {/* 왼쪽 */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; pointerDownTimeRef.current = Date.now(); }}
              onPointerUp={() => { storyPausedRef.current = false; if (Date.now() - pointerDownTimeRef.current < 200) storyGoPrev(); }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
            {/* 중앙 (홀드 전용) */}
            <div
              className="absolute left-1/3 right-1/3 top-0 bottom-0 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; }}
              onPointerUp={() => { storyPausedRef.current = false; }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
            {/* 오른쪽 */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
              onPointerDown={() => { storyPausedRef.current = true; pointerDownTimeRef.current = Date.now(); }}
              onPointerUp={() => { storyPausedRef.current = false; if (Date.now() - pointerDownTimeRef.current < 200) storyGoNext(); }}
              onPointerLeave={() => { storyPausedRef.current = false; }}
            />
          </div>
        );
      })()}
    </>
  );
}
