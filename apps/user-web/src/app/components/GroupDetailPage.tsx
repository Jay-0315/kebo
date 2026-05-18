import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowLeft, Users, Crown, Calendar, TrendingUp,
  Copy, Check, UserPlus, Plus, X, Swords,
} from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import type { CurrencyCode } from "../types/domain";
import { PixelSprite } from "./PixelCharacter";
import { CHARACTERS } from "../data/characters";
import type { CharacterDef } from "../data/characters";

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
    {/* 하늘 */}
    <rect x="0" y="0"  width="64" height="32" fill="#87CEEB"/>
    <rect x="0" y="0"  width="64" height="3"  fill="#4FC3F7"/>
    <rect x="0" y="13" width="64" height="2"  fill="#B3E5FC"/>
    {/* 태양 */}
    <rect x="50" y="1"  width="7" height="7"  fill="#FFD54F"/>
    <rect x="49" y="2"  width="9" height="5"  fill="#FFD54F"/>
    <rect x="51" y="0"  width="5" height="1"  fill="#FFEE58"/>
    <rect x="50" y="8"  width="7" height="1"  fill="#FFB300"/>
    <rect x="48" y="4"  width="1" height="1"  fill="#FFD54F"/>
    <rect x="59" y="4"  width="1" height="1"  fill="#FFD54F"/>
    {/* 수평선 빛반사 */}
    <rect x="40" y="14" width="24" height="1" fill="#FFF9C4"/>
    <rect x="44" y="13" width="16" height="1" fill="#FFEE58"/>
    {/* 구름1 */}
    <rect x="2"  y="2"  width="12" height="4" fill="#FFFFFF"/>
    <rect x="3"  y="1"  width="10" height="1" fill="#FFFFFF"/>
    <rect x="4"  y="6"  width="8"  height="1" fill="#E1F5FE"/>
    <rect x="1"  y="3"  width="2"  height="2" fill="#FFFFFF"/>
    <rect x="13" y="3"  width="2"  height="2" fill="#FFFFFF"/>
    {/* 구름2 */}
    <rect x="22" y="4"  width="10" height="3" fill="#FFFFFF"/>
    <rect x="23" y="3"  width="8"  height="1" fill="#FFFFFF"/>
    <rect x="23" y="7"  width="7"  height="1" fill="#E1F5FE"/>
    <rect x="21" y="5"  width="2"  height="1" fill="#FFFFFF"/>
    {/* 구름3 */}
    <rect x="36" y="2"  width="8"  height="3" fill="#FFFFFF"/>
    <rect x="37" y="1"  width="6"  height="1" fill="#FFFFFF"/>
    <rect x="37" y="5"  width="5"  height="1" fill="#E1F5FE"/>
    {/* 갈매기 */}
    <rect x="18" y="3"  width="1" height="1" fill="#455A64"/>
    <rect x="20" y="2"  width="1" height="1" fill="#455A64"/>
    <rect x="32" y="5"  width="1" height="1" fill="#455A64"/>
    <rect x="34" y="4"  width="1" height="1" fill="#455A64"/>
    <rect x="10" y="8"  width="1" height="1" fill="#455A64"/>
    <rect x="12" y="7"  width="1" height="1" fill="#455A64"/>
    {/* 등대 */}
    <rect x="1"  y="8"  width="4" height="7"  fill="#ECEFF1"/>
    <rect x="2"  y="6"  width="2" height="3"  fill="#ECEFF1"/>
    <rect x="2"  y="5"  width="2" height="1"  fill="#F44336"/>
    <rect x="1"  y="11" width="4" height="1"  fill="#EF9A9A"/>
    <rect x="1"  y="14" width="4" height="1"  fill="#B0BEC5"/>
    <rect x="0"  y="14" width="6" height="1"  fill="#90A4AE"/>
    <rect x="2"  y="9"  width="2" height="2"  fill="#FFF176"/>
    {/* 배 */}
    <rect x="30" y="13" width="10" height="2" fill="#795548"/>
    <rect x="31" y="11" width="8"  height="2" fill="#8D6E63"/>
    <rect x="34" y="8"  width="2"  height="3" fill="#F5F5F5"/>
    <rect x="32" y="9"  width="6"  height="1" fill="#E0E0E0"/>
    <rect x="29" y="14" width="12" height="1" fill="#5D4037"/>
    {/* 바다 표면 */}
    <rect x="0"  y="15" width="64" height="17" fill="#1565C0"/>
    <rect x="0"  y="15" width="64" height="2"  fill="#42A5F5"/>
    <rect x="0"  y="14" width="64" height="1"  fill="#64B5F6"/>
    {/* 파도 */}
    <rect x="0"  y="17" width="64" height="1"  fill="#1976D2"/>
    <rect x="2"  y="17" width="5"  height="1"  fill="#42A5F5"/>
    <rect x="12" y="18" width="7"  height="1"  fill="#42A5F5"/>
    <rect x="24" y="17" width="6"  height="1"  fill="#42A5F5"/>
    <rect x="36" y="18" width="8"  height="1"  fill="#42A5F5"/>
    <rect x="50" y="17" width="7"  height="1"  fill="#42A5F5"/>
    <rect x="5"  y="19" width="4"  height="1"  fill="#1E88E5"/>
    <rect x="18" y="20" width="6"  height="1"  fill="#1E88E5"/>
    <rect x="32" y="19" width="5"  height="1"  fill="#1E88E5"/>
    <rect x="46" y="20" width="7"  height="1"  fill="#1E88E5"/>
    {/* 거품 */}
    <rect x="1"  y="16" width="2" height="1"  fill="#FFFFFF"/>
    <rect x="9"  y="16" width="3" height="1"  fill="#FFFFFF"/>
    <rect x="20" y="15" width="2" height="1"  fill="#FFFFFF"/>
    <rect x="33" y="16" width="3" height="1"  fill="#FFFFFF"/>
    <rect x="44" y="15" width="2" height="1"  fill="#FFFFFF"/>
    <rect x="57" y="16" width="3" height="1"  fill="#FFFFFF"/>
    {/* 심해 */}
    <rect x="0"  y="22" width="64" height="10" fill="#0D47A1"/>
    <rect x="0"  y="25" width="64" height="7"  fill="#0A3880"/>
    {/* 물고기 */}
    <rect x="10" y="24" width="4" height="2"  fill="#FF8F00"/>
    <rect x="9"  y="25" width="2" height="1"  fill="#FF8F00"/>
    <rect x="13" y="25" width="1" height="1"  fill="#000000"/>
    <rect x="25" y="26" width="4" height="2"  fill="#26C6DA"/>
    <rect x="24" y="27" width="2" height="1"  fill="#26C6DA"/>
    <rect x="28" y="27" width="1" height="1"  fill="#000000"/>
    <rect x="45" y="23" width="4" height="2"  fill="#AB47BC"/>
    <rect x="44" y="24" width="2" height="1"  fill="#AB47BC"/>
    {/* 산호 */}
    <rect x="5"  y="28" width="1" height="3"  fill="#EF5350"/>
    <rect x="4"  y="27" width="3" height="1"  fill="#EF5350"/>
    <rect x="38" y="27" width="1" height="4"  fill="#EC407A"/>
    <rect x="37" y="26" width="3" height="1"  fill="#EC407A"/>
    <rect x="55" y="28" width="1" height="3"  fill="#FF7043"/>
    <rect x="54" y="27" width="3" height="1"  fill="#FF7043"/>
    {/* 거품 */}
    <rect x="8"  y="27" width="1" height="1"  fill="#42A5F5"/>
    <rect x="20" y="25" width="1" height="1"  fill="#42A5F5"/>
    <rect x="35" y="28" width="1" height="1"  fill="#42A5F5"/>
    <rect x="50" y="26" width="1" height="1"  fill="#42A5F5"/>
    <rect x="60" y="24" width="1" height="1"  fill="#42A5F5"/>
  </svg>
);

const BG_SPACE = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 32" preserveAspectRatio="xMidYMid slice" style={{ imageRendering: "pixelated" }}>
    <rect x="0" y="0" width="64" height="32" fill="#04041A"/>
    {/* 성운 패치 */}
    <rect x="0"  y="8"  width="14" height="8"  fill="#0D0828"/>
    <rect x="0"  y="10" width="10" height="4"  fill="#120A35"/>
    <rect x="30" y="18" width="16" height="7"  fill="#0A1528"/>
    <rect x="32" y="20" width="12" height="4"  fill="#0A1A30"/>
    <rect x="50" y="5"  width="14" height="6"  fill="#150828"/>
    <rect x="52" y="6"  width="10" height="4"  fill="#1A0835"/>
    {/* 별 (흰색/노란색/파란색) */}
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
    {/* 밝은 별 (십자) */}
    <rect x="10" y="4"  width="1" height="3" fill="#FFFFFF"/>
    <rect x="9"  y="5"  width="3" height="1" fill="#FFFFFF"/>
    <rect x="48" y="20" width="1" height="3" fill="#FFD54F"/>
    <rect x="47" y="21" width="3" height="1" fill="#FFD54F"/>
    <rect x="25" y="10" width="1" height="3" fill="#B3E5FC"/>
    <rect x="24" y="11" width="3" height="1" fill="#B3E5FC"/>
    {/* 행성1 (보라) */}
    <rect x="40" y="2"  width="12" height="10" fill="#6A1B9A"/>
    <rect x="39" y="3"  width="14" height="8"  fill="#7B1FA2"/>
    <rect x="42" y="3"  width="6"  height="5"  fill="#9C27B0"/>
    <rect x="43" y="3"  width="4"  height="3"  fill="#AB47BC"/>
    <rect x="44" y="3"  width="2"  height="2"  fill="#CE93D8"/>
    {/* 그림자 */}
    <rect x="47" y="7"  width="5"  height="4"  fill="#4A148C"/>
    <rect x="49" y="5"  width="3"  height="3"  fill="#4A148C"/>
    {/* 링 */}
    <rect x="36" y="7"  width="20" height="1"  fill="#CE93D8"/>
    <rect x="37" y="6"  width="18" height="1"  fill="#AB47BC"/>
    <rect x="38" y="8"  width="4"  height="1"  fill="#9C27B0"/>
    <rect x="50" y="8"  width="4"  height="1"  fill="#9C27B0"/>
    {/* 행성2 (파란색 작은) */}
    <rect x="5"  y="20" width="7"  height="7"  fill="#1565C0"/>
    <rect x="4"  y="21" width="9"  height="5"  fill="#1976D2"/>
    <rect x="6"  y="21" width="3"  height="3"  fill="#42A5F5"/>
    <rect x="7"  y="21" width="2"  height="2"  fill="#90CAF9"/>
    <rect x="9"  y="24" width="3"  height="2"  fill="#0D47A1"/>
    {/* 달 (회색) */}
    <rect x="16" y="17" width="6"  height="6"  fill="#ECEFF1"/>
    <rect x="15" y="18" width="8"  height="4"  fill="#ECEFF1"/>
    <rect x="17" y="17" width="2"  height="1"  fill="#CFD8DC"/>
    <rect x="19" y="19" width="2"  height="2"  fill="#B0BEC5"/>
    <rect x="16" y="20" width="2"  height="1"  fill="#B0BEC5"/>
    {/* 크레이터 */}
    <rect x="17" y="18" width="1"  height="1"  fill="#CFD8DC"/>
    <rect x="20" y="20" width="1"  height="1"  fill="#CFD8DC"/>
    {/* 유성 */}
    <rect x="58" y="14" width="1"  height="1"  fill="#FFFFFF"/>
    <rect x="57" y="15" width="2"  height="1"  fill="#FFF9C4"/>
    <rect x="55" y="16" width="3"  height="1"  fill="#FFD54F"/>
    <rect x="53" y="17" width="3"  height="1"  fill="#FF8F00"/>
    <rect x="51" y="18" width="3"  height="1"  fill="#FF6F00"/>
    {/* 소행성 */}
    <rect x="30" y="5"  width="3"  height="2"  fill="#5D4037"/>
    <rect x="31" y="4"  width="2"  height="1"  fill="#795548"/>
    <rect x="31" y="7"  width="1"  height="1"  fill="#4E342E"/>
    <rect x="55" y="25" width="3"  height="2"  fill="#616161"/>
    <rect x="56" y="24" width="2"  height="1"  fill="#757575"/>
  </svg>
);

const BG_CITY = () => (
  <svg width="100%" height="100%" viewBox="0 0 64 32" preserveAspectRatio="xMidYMid slice" style={{ imageRendering: "pixelated" }}>
    {/* 밤하늘 */}
    <rect x="0" y="0" width="64" height="32" fill="#0D0D2B"/>
    <rect x="0" y="0" width="64" height="5"  fill="#0A0A25"/>
    {/* 별 */}
    {[[3,1],[8,3],[14,1],[19,4],[24,2],[29,1],[35,3],[40,1],[45,4],[51,2],[57,1],[62,3],[1,6],[11,5],[22,6],[33,5],[44,6],[55,5],[63,7]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="1" height="1" fill={i%4===0?"#FFF9C4":"#FFFFFF"}/>
    ))}
    {/* 달 */}
    <rect x="4"  y="1"  width="5" height="5"  fill="#FFF9C4"/>
    <rect x="3"  y="2"  width="7" height="3"  fill="#FFF9C4"/>
    <rect x="5"  y="0"  width="3" height="1"  fill="#FFF9C4"/>
    <rect x="6"  y="2"  width="2" height="2"  fill="#FFF176"/>
    <rect x="5"  y="4"  width="2" height="1"  fill="#F0F4C3"/>
    {/* 빌딩1 (왼쪽 넓은) */}
    <rect x="0"  y="9"  width="9" height="23" fill="#0D1117"/>
    <rect x="3"  y="7"  width="3" height="3"  fill="#0D1117"/>
    <rect x="4"  y="6"  width="1" height="2"  fill="#37474F"/>
    {[[1,10],[5,10],[1,13],[5,13],[1,16],[5,16],[1,19],[5,19],[1,22],[5,22],[1,25],[5,25]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%3===0?"#FFD54F":i%3===1?"#37474F":"#FFF176"}/>
    ))}
    {/* 빌딩2 */}
    <rect x="10" y="13" width="8"  height="19" fill="#161B22"/>
    <rect x="12" y="11" width="4"  height="3"  fill="#161B22"/>
    <rect x="13" y="10" width="2"  height="2"  fill="#263238"/>
    {[[11,14],[15,14],[11,17],[15,17],[11,20],[15,20],[11,23],[15,23],[11,26],[15,26]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%2===0?"#FFF176":"#37474F"}/>
    ))}
    {/* 빌딩3 (센터 타워, 높음) */}
    <rect x="20" y="5"  width="10" height="27" fill="#111827"/>
    <rect x="22" y="3"  width="6"  height="3"  fill="#111827"/>
    <rect x="24" y="2"  width="2"  height="2"  fill="#E040FB"/>
    <rect x="24" y="1"  width="2"  height="1"  fill="#EA80FC"/>
    {[[21,6],[27,6],[21,9],[27,9],[21,12],[27,12],[21,15],[27,15],[21,18],[27,18],[21,21],[27,21],[21,24],[27,24],[21,27],[27,27]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%4===0?"#40C4FF":i%4===1?"#FFD54F":i%4===2?"#37474F":"#E040FB"}/>
    ))}
    <rect x="23" y="6"  width="4"  height="26" fill="#0D1117"/>
    {[[24,7],[24,10],[24,13],[24,16],[24,19],[24,22],[24,25],[24,28]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%3===0?"#40C4FF":"#FFD54F"}/>
    ))}
    {/* 빌딩4 */}
    <rect x="32" y="11" width="9"  height="21" fill="#0F1923"/>
    <rect x="34" y="9"  width="5"  height="3"  fill="#0F1923"/>
    <rect x="35" y="8"  width="3"  height="2"  fill="#1C2B3A"/>
    {[[33,12],[38,12],[33,15],[38,15],[33,18],[38,18],[33,21],[38,21],[33,24],[38,24],[33,27],[38,27]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%3===0?"#FFF176":i%3===1?"#37474F":"#FFD54F"}/>
    ))}
    {/* 빌딩5 (우측 타워) */}
    <rect x="43" y="7"  width="8"  height="25" fill="#0D1117"/>
    <rect x="45" y="5"  width="4"  height="3"  fill="#0D1117"/>
    <rect x="46" y="4"  width="2"  height="2"  fill="#E040FB"/>
    {[[44,8],[49,8],[44,11],[49,11],[44,14],[49,14],[44,17],[49,17],[44,20],[49,20],[44,23],[49,23],[44,26],[49,26]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%4===0?"#E040FB":i%4===1?"#FFD54F":i%4===2?"#37474F":"#40C4FF"}/>
    ))}
    {/* 빌딩6 (오른쪽) */}
    <rect x="53" y="14" width="11" height="18" fill="#161B22"/>
    <rect x="56" y="12" width="5"  height="3"  fill="#161B22"/>
    <rect x="57" y="11" width="3"  height="2"  fill="#263238"/>
    {[[54,15],[59,15],[54,18],[59,18],[54,21],[59,21],[54,24],[59,24],[54,27],[59,27]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="2" height="2" fill={i%2===0?"#FFF176":"#40C4FF"}/>
    ))}
    {/* 도로 */}
    <rect x="0"  y="29" width="64" height="3"  fill="#212121"/>
    <rect x="0"  y="29" width="64" height="1"  fill="#2C2C2C"/>
    {[[6,30],[18,30],[30,30],[42,30],[54,30]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="5" height="1" fill="#FFD54F"/>
    ))}
    {/* 가로등 */}
    <rect x="9"  y="24" width="1" height="5"  fill="#546E7A"/>
    <rect x="8"  y="24" width="3" height="1"  fill="#546E7A"/>
    <rect x="8"  y="24" width="3" height="1"  fill="#FFD54F"/>
    <rect x="42" y="22" width="1" height="7"  fill="#546E7A"/>
    <rect x="41" y="22" width="3" height="1"  fill="#FFD54F"/>
    {/* 자동차 */}
    <rect x="15" y="29" width="5" height="2"  fill="#1565C0"/>
    <rect x="16" y="28" width="3" height="1"  fill="#1565C0"/>
    <rect x="14" y="30" width="2" height="1"  fill="#212121"/>
    <rect x="19" y="30" width="2" height="1"  fill="#212121"/>
    <rect x="19" y="29" width="1" height="1"  fill="#FFD54F"/>
    <rect x="46" y="29" width="5" height="2"  fill="#C62828"/>
    <rect x="47" y="28" width="3" height="1"  fill="#C62828"/>
    <rect x="45" y="30" width="2" height="1"  fill="#212121"/>
    <rect x="50" y="30" width="2" height="1"  fill="#212121"/>
    <rect x="45" y="29" width="1" height="1"  fill="#FFD54F"/>
    {/* 네온 간판 */}
    <rect x="20" y="16" width="4" height="1"  fill="#E040FB"/>
    <rect x="20" y="17" width="4" height="1"  fill="#EA80FC"/>
    <rect x="44" y="14" width="3" height="1"  fill="#40C4FF"/>
    <rect x="44" y="15" width="3" height="1"  fill="#80D8FF"/>
  </svg>
);

const PARTY_BACKGROUNDS = [
  { name: "숲속", color: "#4CAF50", Component: BG_FOREST },
  { name: "바다", color: "#1565C0", Component: BG_OCEAN },
  { name: "우주", color: "#080820", Component: BG_SPACE },
  { name: "도시", color: "#1A1A2E", Component: BG_CITY },
];

const CATEGORIES = ["식비", "교통", "카페", "쇼핑", "숙박", "엔터테인먼트", "기타"];
const CATEGORY_EMOJI: Record<string, string> = {
  식비: "🍜", 교통: "🚌", 카페: "☕", 쇼핑: "🛍", 숙박: "🏨", 엔터테인먼트: "🎭", 기타: "💳",
};

export default function GroupDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expenses, createExpense, profile, profilePhoto } = useAppData();

  const group: Group | undefined = location.state?.group;

  const [showInvite, setShowInvite] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [localExpenses, setLocalExpenses] = useState<LocalExpense[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [partyBg, setPartyBg] = useState(0);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: "식비",
    spentAmount: "",
    spentCurrency: "JPY" as CurrencyCode,
    memo: "",
    participants: "",
  });

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Users className="w-12 h-12 mb-4 opacity-30" />
        <p className="mb-4">그룹 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/groups")}
          className="bg-primary/80 text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
        >
          그룹 목록으로
        </button>
      </div>
    );
  }

  const copyCode = () => {
    navigator.clipboard.writeText(group.code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const serverExpenses = expenses.filter((e) => e.group === group.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.spentAmount || !form.memo.trim()) return;

    const amount = Number(form.spentAmount);
    const countryCode = form.spentCurrency === "JPY" ? "JP" : "KR";
    const exchangeRate = form.spentCurrency === "JPY" ? 9.1 : 1;
    const baseAmount = Math.round(amount * exchangeRate);

    const newLocal: LocalExpense = {
      id: `local-${Date.now()}`,
      date: form.date,
      category: form.category,
      spentAmount: amount,
      spentCurrency: form.spentCurrency,
      memo: form.memo,
      participants: form.participants ? Number(form.participants) : undefined,
    };

    setLocalExpenses((prev) => [newLocal, ...prev]);
    setShowExpenseForm(false);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      category: "식비",
      spentAmount: "",
      spentCurrency: "JPY",
      memo: "",
      participants: "",
    });

    setSubmitting(true);
    try {
      await createExpense({
        date: form.date,
        category: form.category,
        spentAmount: amount,
        spentCurrency: form.spentCurrency,
        countryCode,
        memo: form.memo,
        group: group.name,
        participants: form.participants ? Number(form.participants) : undefined,
      });
    } catch {
      // API 미연결 시 로컬에만 저장
    } finally {
      setSubmitting(false);
    }
  };

  const allExpenses = [
    ...localExpenses.map((e) => ({ ...e, baseAmount: Math.round(e.spentAmount * (e.spentCurrency === "JPY" ? 9.1 : 1)) })),
    ...serverExpenses,
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/groups")}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2>{group.name}</h2>
            {group.isHost && <Crown className="w-5 h-5 text-amber-500" />}
          </div>
        </div>
        {/* 초대 버튼 */}
        <button
          onClick={() => setShowInvite(!showInvite)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
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
        <div className="bg-card rounded-xl border border-primary/20 p-5">
          <p className="text-sm text-muted-foreground mb-3">아래 코드를 공유해 멤버를 초대하세요</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-xl font-bold text-center tracking-widest">
              {group.code}
            </div>
            <button
              onClick={copyCode}
              className="bg-primary/80 text-primary-foreground rounded-lg px-4 py-3 flex items-center gap-2 transition-all hover:shadow-md"
            >
              {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {codeCopied ? "복사됨" : "복사"}
            </button>
          </div>
        </div>
      )}

      {/* Members Section */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            참여 인원
          </h3>
          <span className="text-sm text-muted-foreground">{group.members.length}명</span>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-1 scrollbar-none">
          {group.members.map((member) => (
            <div key={member.id} className="flex flex-col items-center gap-2 shrink-0">
              {/* Story-style ring avatar */}
              <div
                className={`p-[2.5px] rounded-full ${
                  member.isHost
                    ? "bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500"
                    : "bg-gradient-to-br from-primary/80 to-accent"
                }`}
              >
                <div className="p-[2px] rounded-full bg-card">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/70 to-accent/80 flex items-center justify-center overflow-hidden">
                    {profilePhoto && member.name === profile.name ? (
                      <img src={profilePhoto} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xl leading-none">
                        {member.name[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <p className="text-xs font-medium text-center w-16 truncate">{member.name}</p>

              {/* Host badge */}
              {member.isHost ? (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 -mt-1">
                  <Crown className="w-2.5 h-2.5" />
                  호스트
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground -mt-1">멤버</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            그룹 지출
          </h3>
          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              showExpenseForm
                ? "bg-muted text-muted-foreground"
                : "bg-primary/80 text-primary-foreground hover:shadow-md"
            }`}
          >
            {showExpenseForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showExpenseForm ? "취소" : "지출 추가"}
          </button>
        </div>

        {/* Expense Form */}
        {showExpenseForm && (
          <form onSubmit={handleSubmit} className="mb-4 bg-muted rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">날짜</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">카테고리</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">금액</label>
                <input
                  type="number"
                  value={form.spentAmount}
                  onChange={(e) => setForm({ ...form, spentAmount: e.target.value })}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">통화</label>
                <select
                  value={form.spentCurrency}
                  onChange={(e) => setForm({ ...form, spentCurrency: e.target.value as CurrencyCode })}
                  className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  <option value="JPY">¥ JPY (엔)</option>
                  <option value="KRW">₩ KRW (원)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">메모</label>
              <input
                type="text"
                value={form.memo}
                onChange={(e) => setForm({ ...form, memo: e.target.value })}
                placeholder="어디서 쓴 돈인지 입력하세요"
                required
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">인원 수 (선택)</label>
              <input
                type="number"
                value={form.participants}
                onChange={(e) => setForm({ ...form, participants: e.target.value })}
                placeholder="함께한 인원"
                min="1"
                className="w-full px-3 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary/80 text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:shadow-md transition-all disabled:opacity-50"
            >
              {submitting ? "저장 중..." : "지출 추가"}
            </button>
          </form>
        )}

        {/* Expense List */}
        {allExpenses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">아직 지출 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">
                  {CATEGORY_EMOJI[expense.category] ?? "💳"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{expense.memo}</p>
                  <p className="text-xs text-muted-foreground">
                    {expense.date} · {expense.category}
                    {"participants" in expense && expense.participants ? ` · ${expense.participants}명` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-primary">
                    {expense.spentAmount.toLocaleString()}
                    {expense.spentCurrency === "JPY" ? "¥" : "₩"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₩{expense.baseAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 파티 캐릭터 섹션 ── */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h3 className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            파티 캐릭터
          </h3>
          {/* 배경 선택 */}
          <div className="flex items-center gap-1.5">
            {PARTY_BACKGROUNDS.map((bg, i) => (
              <button
                key={i}
                onClick={() => setPartyBg(i)}
                title={bg.name}
                className={`w-6 h-6 rounded-lg border-2 transition-all ${
                  partyBg === i
                    ? "border-primary scale-110 shadow-md"
                    : "border-transparent hover:border-muted-foreground/40"
                }`}
                style={{ backgroundColor: bg.color }}
              />
            ))}
          </div>
        </div>

        {/* 배경 + 캐릭터 */}
        <div className="relative mx-4 mb-4 rounded-xl overflow-hidden" style={{ height: 160 }}>
          {/* 픽셀아트 배경 */}
          <div className="absolute inset-0">
            {(() => {
              const Bg = PARTY_BACKGROUNDS[partyBg].Component;
              return <Bg />;
            })()}
          </div>

          {/* 멤버 캐릭터 오버레이 */}
          <div className="absolute inset-0 flex items-end justify-around pb-3 px-2">
            {group.members.map((member) => {
              const char = getMemberCharacter(member.id);
              return (
                <div key={member.id} className="flex flex-col items-center gap-1">
                  {/* 호스트 왕관 */}
                  {member.isHost && (
                    <Crown className="w-3 h-3 text-amber-400 drop-shadow" />
                  )}
                  {/* 캐릭터 */}
                  <div className="drop-shadow-lg">
                    <PixelSprite type={char.type} colors={char.colors} size={48} />
                  </div>
                  {/* 이름 뱃지 - 픽셀 RPG 스타일 */}
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
  );
}
