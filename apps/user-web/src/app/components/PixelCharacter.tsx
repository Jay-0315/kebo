interface PixelCharacterProps {
  level: number;
  size?: number;
}

export default function PixelCharacter({ level, size = 128 }: PixelCharacterProps) {
  const getCharacter = (level: number) => {
    if (level < 3) {
      // Baby Dragon - 새싹 단계
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
          {/* Baby Dragon - Light Green */}
          <rect x="6" y="2" width="4" height="2" fill="#8BC34A" />
          <rect x="5" y="4" width="6" height="2" fill="#8BC34A" />
          <rect x="4" y="6" width="8" height="4" fill="#8BC34A" />
          <rect x="5" y="10" width="6" height="2" fill="#8BC34A" />
          {/* Eyes */}
          <rect x="6" y="5" width="1" height="1" fill="#000" />
          <rect x="9" y="5" width="1" height="1" fill="#000" />
          {/* Wings */}
          <rect x="3" y="7" width="2" height="2" fill="#7CB342" />
          <rect x="11" y="7" width="2" height="2" fill="#7CB342" />
          {/* Legs */}
          <rect x="5" y="12" width="2" height="2" fill="#689F38" />
          <rect x="9" y="12" width="2" height="2" fill="#689F38" />
          {/* Tail */}
          <rect x="11" y="8" width="2" height="1" fill="#7CB342" />
          <rect x="12" y="9" width="2" height="1" fill="#7CB342" />
        </svg>
      );
    } else if (level < 6) {
      // Young Phoenix - 성장 단계
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
          {/* Phoenix Body - Orange/Red */}
          <rect x="6" y="3" width="4" height="2" fill="#FF6B6B" />
          <rect x="5" y="5" width="6" height="3" fill="#FF8787" />
          <rect x="4" y="8" width="8" height="3" fill="#FF6B6B" />
          <rect x="6" y="11" width="4" height="2" fill="#FF8787" />
          {/* Eyes */}
          <rect x="6" y="6" width="1" height="1" fill="#000" />
          <rect x="9" y="6" width="1" height="1" fill="#000" />
          {/* Beak */}
          <rect x="7" y="7" width="2" height="1" fill="#FFA500" />
          {/* Wings */}
          <rect x="2" y="7" width="3" height="3" fill="#FFD93D" />
          <rect x="11" y="7" width="3" height="3" fill="#FFD93D" />
          <rect x="1" y="8" width="2" height="2" fill="#FFA500" />
          <rect x="13" y="8" width="2" height="2" fill="#FFA500" />
          {/* Legs */}
          <rect x="6" y="13" width="1" height="2" fill="#FF6B6B" />
          <rect x="9" y="13" width="1" height="2" fill="#FF6B6B" />
          {/* Tail Feathers */}
          <rect x="7" y="12" width="2" height="1" fill="#FFD93D" />
          <rect x="7" y="13" width="2" height="2" fill="#FFA500" />
        </svg>
      );
    } else if (level < 10) {
      // Unicorn - 강력 단계
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
          {/* Unicorn Body - White/Pink */}
          <rect x="5" y="7" width="6" height="4" fill="#F8F8F8" />
          <rect x="4" y="8" width="8" height="3" fill="#FFFFFF" />
          {/* Head */}
          <rect x="3" y="5" width="3" height="3" fill="#F8F8F8" />
          <rect x="2" y="6" width="2" height="2" fill="#FFFFFF" />
          {/* Horn */}
          <rect x="3" y="3" width="1" height="2" fill="#FFD700" />
          <rect x="4" y="4" width="1" height="1" fill="#FFD700" />
          {/* Eye */}
          <rect x="4" y="6" width="1" height="1" fill="#000" />
          {/* Mane */}
          <rect x="5" y="4" width="1" height="2" fill="#FF69B4" />
          <rect x="6" y="3" width="1" height="3" fill="#FF1493" />
          <rect x="7" y="4" width="1" height="2" fill="#FF69B4" />
          {/* Legs */}
          <rect x="5" y="11" width="1" height="3" fill="#E0E0E0" />
          <rect x="7" y="11" width="1" height="3" fill="#E0E0E0" />
          <rect x="9" y="11" width="1" height="3" fill="#E0E0E0" />
          {/* Tail */}
          <rect x="11" y="8" width="2" height="1" fill="#FF69B4" />
          <rect x="12" y="9" width="2" height="2" fill="#FF1493" />
          <rect x="13" y="10" width="2" height="2" fill="#FF69B4" />
        </svg>
      );
    } else {
      // Legendary Dragon - 최고 레벨
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
          {/* Dragon Body - Purple/Gold */}
          <rect x="6" y="4" width="4" height="3" fill="#9C27B0" />
          <rect x="5" y="7" width="6" height="4" fill="#AB47BC" />
          <rect x="4" y="8" width="8" height="3" fill="#9C27B0" />
          {/* Head */}
          <rect x="4" y="3" width="3" height="2" fill="#9C27B0" />
          <rect x="3" y="4" width="2" height="2" fill="#AB47BC" />
          {/* Horns */}
          <rect x="3" y="2" width="1" height="2" fill="#FFD700" />
          <rect x="7" y="2" width="1" height="2" fill="#FFD700" />
          <rect x="2" y="3" width="1" height="1" fill="#FFD700" />
          <rect x="8" y="3" width="1" height="1" fill="#FFD700" />
          {/* Eyes */}
          <rect x="4" y="4" width="1" height="1" fill="#FF1744" />
          <rect x="6" y="4" width="1" height="1" fill="#FF1744" />
          {/* Wings */}
          <rect x="1" y="7" width="3" height="4" fill="#7B1FA2" />
          <rect x="12" y="7" width="3" height="4" fill="#7B1FA2" />
          <rect x="0" y="8" width="2" height="3" fill="#8E24AA" />
          <rect x="14" y="8" width="2" height="3" fill="#8E24AA" />
          {/* Gold Accent */}
          <rect x="6" y="7" width="4" height="1" fill="#FFD700" />
          <rect x="7" y="9" width="2" height="1" fill="#FFD700" />
          {/* Legs */}
          <rect x="5" y="11" width="2" height="3" fill="#7B1FA2" />
          <rect x="9" y="11" width="2" height="3" fill="#7B1FA2" />
          {/* Tail with Fire */}
          <rect x="11" y="9" width="2" height="1" fill="#9C27B0" />
          <rect x="12" y="10" width="2" height="1" fill="#FF6B6B" />
          <rect x="13" y="11" width="2" height="2" fill="#FFD93D" />
          <rect x="14" y="12" width="1" height="1" fill="#FFA500" />
        </svg>
      );
    }
  };

  return <div className="inline-block">{getCharacter(level)}</div>;
}
