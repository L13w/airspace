import type { ProcessedAirspace } from '../types/airspace';
import { formatAltitude, metersToFeet } from '../utils/altitudeUtils';
import { getAirspaceColorCSS, getAirspaceGlowCSS, CLASS_DESCRIPTIONS } from '../utils/colorUtils';

interface InfoPanelProps {
  airspace: ProcessedAirspace | null;
  onClose: () => void;
}

export function InfoPanel({ airspace, onClose }: InfoPanelProps) {
  if (!airspace) return null;

  const { properties, floorMeters, ceilingMeters } = airspace;
  const verticalExtentFeet = Math.round(metersToFeet(ceilingMeters - floorMeters));
  const color = getAirspaceColorCSS(properties.CLASS);
  const glow = getAirspaceGlowCSS(properties.CLASS);
  const description = CLASS_DESCRIPTIONS[properties.CLASS];

  return (
    <div
      className="glass-panel animate-slide-in"
      style={{
        position: 'absolute',
        bottom: 24,
        right: 16,
        width: 340,
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {/* Header with color accent */}
      <div
        style={{
          padding: '16px 20px',
          background: `linear-gradient(135deg, ${color}15 0%, transparent 60%)`,
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-tertiary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          ×
        </button>

        {/* Class badge and name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            className={`class-badge ${properties.CLASS}`}
            style={{
              flexShrink: 0,
              marginTop: '2px',
            }}
          >
            {properties.CLASS}
          </div>
          <div style={{ flex: 1, paddingRight: '30px' }}>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
                marginBottom: '4px',
              }}
            >
              {properties.NAME}
            </h2>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}
            >
              {description?.short || `Class ${properties.CLASS} Airspace`}
            </div>
          </div>
        </div>
      </div>

      {/* Altitude section - visual representation */}
      <div style={{ padding: '16px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          {/* Visual altitude bar */}
          <div
            style={{
              width: '8px',
              height: '80px',
              background: 'var(--bg-tertiary)',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: `${(floorMeters / metersToFeet(10000) * 0.3048) * 100}%`,
                left: 0,
                right: 0,
                height: `${((ceilingMeters - floorMeters) / metersToFeet(10000) * 0.3048) * 100}%`,
                background: `linear-gradient(to top, ${color}, ${color}88)`,
                borderRadius: '3px',
                boxShadow: `0 0 8px ${glow}`,
              }}
            />
          </div>

          {/* Altitude values */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Ceiling
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {formatAltitude(properties.UPPER_VAL, properties.UPPER_CODE)}
              </div>
            </div>

            <div
              style={{
                width: '100%',
                height: '1px',
                background: `linear-gradient(to right, ${color}40, transparent)`,
                marginBottom: '12px',
              }}
            />

            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Floor
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {formatAltitude(properties.LOWER_VAL, properties.LOWER_CODE)}
              </div>
            </div>
          </div>

          {/* Vertical extent */}
          <div
            style={{
              textAlign: 'right',
              padding: '12px',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '9px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
              }}
            >
              Vertical
            </div>
            <div
              className="mono"
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: color,
              }}
            >
              {verticalExtentFeet.toLocaleString()}'
            </div>
          </div>
        </div>

        {/* Requirements section */}
        {description?.requirements && (
          <div
            style={{
              padding: '10px 12px',
              background: `${color}10`,
              borderRadius: '6px',
              border: `1px solid ${color}20`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: color,
                boxShadow: `0 0 6px ${glow}`,
              }}
            />
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              {description.requirements}
            </span>
          </div>
        )}

        {/* Additional info */}
        {properties.LOCAL_TYPE && (
          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Type
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {properties.LOCAL_TYPE}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
