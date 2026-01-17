import { useMemo } from 'react';
import type { ProcessedAirspace } from '../types/airspace';
import { metersToFeet } from '../utils/altitudeUtils';
import { getAirspaceColorCSS } from '../utils/colorUtils';

interface AltitudeScaleProps {
  airspaces: ProcessedAirspace[];
  selectedAirspace: ProcessedAirspace | null;
  hoveredAirspace: ProcessedAirspace | null;
}

export function AltitudeScale({
  airspaces,
  selectedAirspace,
  hoveredAirspace,
}: AltitudeScaleProps) {
  // Get altitude ranges for all visible airspaces
  const altitudeRanges = useMemo(() => {
    return airspaces
      .filter(a => ['B', 'C', 'D'].includes(a.properties.CLASS))
      .map(a => ({
        id: a.properties.OBJECTID,
        name: a.properties.NAME,
        cls: a.properties.CLASS,
        floorFeet: Math.round(metersToFeet(a.floorMeters)),
        ceilingFeet: Math.round(metersToFeet(a.ceilingMeters)),
      }))
      .sort((a, b) => a.floorFeet - b.floorFeet);
  }, [airspaces]);

  const maxAltitude = 12000;
  const scaleHeight = 320;
  const scaleWidth = 60;

  const altToY = (feet: number) => scaleHeight - (feet / maxAltitude) * scaleHeight;

  // Major tick marks
  const majorTicks = [0, 2000, 4000, 6000, 8000, 10000, 12000];

  // Highlighted airspace
  const highlighted = selectedAirspace || hoveredAirspace;
  const highlightedFloor = highlighted ? Math.round(metersToFeet(highlighted.floorMeters)) : null;
  const highlightedCeiling = highlighted ? Math.round(metersToFeet(highlighted.ceilingMeters)) : null;

  // Extra width for the highlight bracket
  const bracketExtra = 6;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        left: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: scaleWidth + bracketExtra + 16, // Fixed width to prevent layout shift
      }}
    >
      <div
        style={{
          fontSize: '9px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
      >
        Altitude MSL
      </div>

      <svg width={scaleWidth + bracketExtra} height={scaleHeight} style={{ overflow: 'visible' }}>
        {/* Background gradient showing altitude zones */}
        <defs>
          <linearGradient id="altitudeGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--bg-tertiary)" />
            <stop offset="50%" stopColor="var(--bg-secondary)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
          </linearGradient>
        </defs>

        {/* Scale background */}
        <rect
          x={scaleWidth - 16}
          y={0}
          width={12}
          height={scaleHeight}
          fill="url(#altitudeGradient)"
          rx={2}
        />

        {/* Airspace range indicators */}
        {altitudeRanges.slice(0, 8).map((range) => {
          const y1 = altToY(range.ceilingFeet);
          const y2 = altToY(range.floorFeet);
          const height = y2 - y1;
          const color = getAirspaceColorCSS(range.cls);
          const isHighlighted = highlighted?.properties.OBJECTID === range.id;

          return (
            <g key={range.id}>
              <rect
                x={scaleWidth - 16}
                y={y1}
                width={12}
                height={Math.max(height, 2)}
                fill={color}
                fillOpacity={isHighlighted ? 0.8 : 0.3}
                stroke={color}
                strokeWidth={isHighlighted ? 2 : 0}
              />
            </g>
          );
        })}

        {/* Tick marks and labels */}
        {majorTicks.map(alt => (
          <g key={alt}>
            <line
              x1={scaleWidth - 20}
              y1={altToY(alt)}
              x2={scaleWidth - 16}
              y2={altToY(alt)}
              stroke="var(--text-muted)"
              strokeWidth={1}
            />
            <text
              x={scaleWidth - 24}
              y={altToY(alt)}
              fontSize="9"
              fill="var(--text-muted)"
              textAnchor="end"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
            >
              {alt === 0 ? 'SFC' : alt >= 10000 ? `${alt / 1000}k` : `${alt / 1000}k`}
            </text>
          </g>
        ))}

        {/* Highlighted airspace indicator */}
        {highlighted && highlightedFloor !== null && highlightedCeiling !== null && (
          <g className="animate-fade-in">
            {/* Floor indicator */}
            <line
              x1={0}
              y1={altToY(highlightedFloor)}
              x2={scaleWidth - 4}
              y2={altToY(highlightedFloor)}
              stroke="#fbbf24"
              strokeWidth={1.5}
              strokeDasharray="3,2"
            />
            {/* Ceiling indicator */}
            <line
              x1={0}
              y1={altToY(highlightedCeiling)}
              x2={scaleWidth - 4}
              y2={altToY(highlightedCeiling)}
              stroke="#fbbf24"
              strokeWidth={1.5}
              strokeDasharray="3,2"
            />
            {/* Connection bracket */}
            <path
              d={`M ${scaleWidth - 2} ${altToY(highlightedCeiling)}
                  L ${scaleWidth + 4} ${altToY(highlightedCeiling)}
                  L ${scaleWidth + 4} ${altToY(highlightedFloor)}
                  L ${scaleWidth - 2} ${altToY(highlightedFloor)}`}
              stroke="#fbbf24"
              strokeWidth={2}
              fill="none"
            />
          </g>
        )}
      </svg>

      {/* Current selection indicator - always rendered to prevent layout shift */}
      <div
        style={{
          marginTop: '8px',
          padding: '6px 8px',
          background: highlighted ? 'var(--bg-tertiary)' : 'transparent',
          borderRadius: '4px',
          border: highlighted ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid transparent',
          textAlign: 'center',
          minWidth: '44px',
          visibility: highlighted ? 'visible' : 'hidden',
        }}
      >
        <div
          style={{
            fontSize: '9px',
            color: 'var(--text-muted)',
            marginBottom: '2px',
          }}
        >
          {highlightedFloor === 0 ? 'SFC' : `${highlightedFloor?.toLocaleString()}'`}
        </div>
        <div
          style={{
            width: '2px',
            height: '8px',
            background: '#fbbf24',
            margin: '0 auto',
          }}
        />
        <div
          style={{
            fontSize: '9px',
            color: 'var(--text-muted)',
            marginTop: '2px',
          }}
        >
          {highlightedCeiling?.toLocaleString()}'
        </div>
      </div>
    </div>
  );
}
