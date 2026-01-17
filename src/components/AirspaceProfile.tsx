import { useMemo } from 'react';
import type { ProcessedAirspace } from '../types/airspace';
import { getAirspaceColorCSS, getAirspaceGlowCSS } from '../utils/colorUtils';
import { metersToFeet } from '../utils/altitudeUtils';

interface AirspaceProfileProps {
  airspaces: ProcessedAirspace[];
  selectedAirspace: ProcessedAirspace | null;
  hoveredAirspace: ProcessedAirspace | null;
  onAirspaceClick: (airspace: ProcessedAirspace) => void;
  onAirspaceHover: (airspace: ProcessedAirspace | null) => void;
  airportCode: string;
}

// Convert altitude tiers into renderable blocks
interface AirspaceBlock {
  airspace: ProcessedAirspace;
  floorFeet: number;
  ceilingFeet: number;
  tier: number; // 0 = innermost (core), higher = outer rings
  radiusNm: number; // Approximate radius in NM for visualization
}

export function AirspaceProfile({
  airspaces,
  selectedAirspace,
  hoveredAirspace,
  onAirspaceClick,
  onAirspaceHover,
  airportCode,
}: AirspaceProfileProps) {
  // Filter to Class B only and create profile blocks
  const classBBlocks = useMemo(() => {
    const classBairspaces = airspaces.filter(a => a.properties.CLASS === 'B');

    // Sort by floor altitude to determine tiers
    const sorted = [...classBairspaces].sort((a, b) => {
      const aFloor = metersToFeet(a.floorMeters);
      const bFloor = metersToFeet(b.floorMeters);
      return aFloor - bFloor;
    });

    // Create blocks with tier info
    const blocks: AirspaceBlock[] = sorted.map((airspace) => {
      const floorFeet = Math.round(metersToFeet(airspace.floorMeters));
      const ceilingFeet = Math.round(metersToFeet(airspace.ceilingMeters));

      // Determine tier based on floor altitude
      // SFC = core, higher floors = outer rings
      let tier = 0;
      if (floorFeet === 0) tier = 0;
      else if (floorFeet <= 3000) tier = 1;
      else if (floorFeet <= 6000) tier = 2;
      else tier = 3;

      // Estimate radius based on tier (rough approximation)
      const radiusNm = tier === 0 ? 5 : tier === 1 ? 10 : tier === 2 ? 20 : 30;

      return { airspace, floorFeet, ceilingFeet, tier, radiusNm };
    });

    return blocks;
  }, [airspaces]);

  // Profile dimensions
  const profileWidth = 320;
  const profileHeight = 400;
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = profileWidth - padding.left - padding.right;
  const chartHeight = profileHeight - padding.top - padding.bottom;

  // Altitude scale (0 to 10,000 feet for Class B)
  const maxAltitude = 10000;
  const altitudeToY = (feet: number) =>
    padding.top + chartHeight - (feet / maxAltitude) * chartHeight;

  // Distance scale (center to edge, in NM)
  const maxDistance = 35;
  const distanceToX = (nm: number, side: 'left' | 'right') => {
    const center = padding.left + chartWidth / 2;
    const offset = (nm / maxDistance) * (chartWidth / 2);
    return side === 'right' ? center + offset : center - offset;
  };

  // Altitude markers
  const altitudeMarkers = [0, 2000, 4000, 6000, 8000, 10000];

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        width: profileWidth,
        padding: '16px',
      }}
    >
      <h3
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '3px',
            height: '14px',
            background: 'var(--class-b)',
            borderRadius: '2px',
          }}
        />
        Airspace Profile
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>
          Cross-section view
        </span>
      </h3>

      <svg width={profileWidth - 32} height={profileHeight} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {altitudeMarkers.map(alt => (
          <g key={alt}>
            <line
              x1={padding.left}
              y1={altitudeToY(alt)}
              x2={padding.left + chartWidth}
              y2={altitudeToY(alt)}
              stroke="var(--border-subtle)"
              strokeDasharray={alt === 0 ? 'none' : '2,4'}
            />
            <text
              x={padding.left - 8}
              y={altitudeToY(alt)}
              fontSize="10"
              fill="var(--text-muted)"
              textAnchor="end"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
            >
              {alt === 0 ? 'SFC' : `${alt / 1000}k`}
            </text>
          </g>
        ))}

        {/* Center line (airport location) */}
        <line
          x1={padding.left + chartWidth / 2}
          y1={padding.top}
          x2={padding.left + chartWidth / 2}
          y2={padding.top + chartHeight}
          stroke="var(--text-muted)"
          strokeDasharray="4,4"
          opacity={0.5}
        />

        {/* Ground fill */}
        <rect
          x={padding.left}
          y={altitudeToY(0)}
          width={chartWidth}
          height={4}
          fill="var(--bg-tertiary)"
        />

        {/* Class B blocks - rendered as symmetric wedding cake */}
        {classBBlocks.map((block) => {
          const y = altitudeToY(block.ceilingFeet);
          const height = altitudeToY(block.floorFeet) - altitudeToY(block.ceilingFeet);
          const leftX = distanceToX(block.radiusNm, 'left');
          const rightX = distanceToX(block.radiusNm, 'right');
          const width = rightX - leftX;

          const isSelected = selectedAirspace?.properties.OBJECTID === block.airspace.properties.OBJECTID;
          const isHovered = hoveredAirspace?.properties.OBJECTID === block.airspace.properties.OBJECTID;
          const color = getAirspaceColorCSS(block.airspace.properties.CLASS);
          const glow = getAirspaceGlowCSS(block.airspace.properties.CLASS);

          return (
            <g
              key={block.airspace.properties.OBJECTID}
              style={{ cursor: 'pointer' }}
              onClick={() => onAirspaceClick(block.airspace)}
              onMouseEnter={() => onAirspaceHover(block.airspace)}
              onMouseLeave={() => onAirspaceHover(null)}
            >
              {/* Glow effect for selected/hovered */}
              {(isSelected || isHovered) && (
                <rect
                  x={leftX - 2}
                  y={y - 2}
                  width={width + 4}
                  height={height + 4}
                  fill="none"
                  stroke={isSelected ? '#fbbf24' : color}
                  strokeWidth={2}
                  rx={3}
                  filter={`drop-shadow(0 0 6px ${isSelected ? 'rgba(251, 191, 36, 0.6)' : glow})`}
                />
              )}

              {/* Main block */}
              <rect
                x={leftX}
                y={y}
                width={width}
                height={height}
                fill={color}
                fillOpacity={isSelected ? 0.5 : isHovered ? 0.4 : 0.25}
                stroke={color}
                strokeWidth={isSelected || isHovered ? 2 : 1}
                rx={2}
              />

              {/* Altitude label inside block */}
              {height > 20 && (
                <text
                  x={padding.left + chartWidth / 2}
                  y={y + height / 2}
                  fontSize="9"
                  fill="var(--text-secondary)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  opacity={0.8}
                >
                  {block.floorFeet === 0 ? 'SFC' : `${block.floorFeet}'`}–{block.ceilingFeet}'
                </text>
              )}
            </g>
          );
        })}

        {/* Airport icon at center */}
        <g transform={`translate(${padding.left + chartWidth / 2}, ${altitudeToY(0) + 16})`}>
          <circle r="4" fill="var(--class-b)" />
          <text
            y="14"
            fontSize="9"
            fill="var(--text-secondary)"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
          >
            {airportCode}
          </text>
        </g>

        {/* Distance labels */}
        <text
          x={padding.left}
          y={padding.top + chartHeight + 30}
          fontSize="9"
          fill="var(--text-muted)"
          textAnchor="start"
          fontFamily="var(--font-mono)"
        >
          -{maxDistance}nm
        </text>
        <text
          x={padding.left + chartWidth / 2}
          y={padding.top + chartHeight + 30}
          fontSize="9"
          fill="var(--text-muted)"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
        >
          0
        </text>
        <text
          x={padding.left + chartWidth}
          y={padding.top + chartHeight + 30}
          fontSize="9"
          fill="var(--text-muted)"
          textAnchor="end"
          fontFamily="var(--font-mono)"
        >
          +{maxDistance}nm
        </text>

        {/* Y-axis label */}
        <text
          x={8}
          y={padding.top + chartHeight / 2}
          fontSize="9"
          fill="var(--text-muted)"
          textAnchor="middle"
          transform={`rotate(-90, 8, ${padding.top + chartHeight / 2})`}
          fontFamily="var(--font-sans)"
        >
          Altitude (feet MSL)
        </text>
      </svg>
    </div>
  );
}
