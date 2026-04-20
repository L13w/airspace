import type { ProcessedAirspace } from '../types/airspace';
import { formatAltitude, metersToFeet } from '../utils/altitudeUtils';
import { getAirspaceColorCSS, getAirspaceGlowCSS, CLASS_DESCRIPTIONS } from '../utils/colorUtils';
import { useIsMobile, useIsMobileLandscape } from '../hooks/useIsMobile';

interface InfoPanelProps {
  airspace: ProcessedAirspace | null;
  onClose: () => void;
}

export function InfoPanel({ airspace, onClose }: InfoPanelProps) {
  const isMobile = useIsMobile();
  const isMobileLandscape = useIsMobileLandscape();
  const isMobileAny = isMobile || isMobileLandscape;

  if (!airspace) return null;

  const { properties, floorMeters, ceilingMeters } = airspace;
  const verticalExtentFeet = Math.round(metersToFeet(ceilingMeters - floorMeters));
  const color = getAirspaceColorCSS(properties.CLASS);
  const glow = getAirspaceGlowCSS(properties.CLASS);
  const description = CLASS_DESCRIPTIONS[properties.CLASS];

  // Mobile (portrait or landscape): compact panel
  if (isMobileAny) {
    // Different positioning for landscape vs portrait
    const panelStyle = isMobileLandscape
      ? {
          // Landscape: lower right corner, rounded card
          position: 'fixed' as const,
          bottom: 16,
          right: 16,
          maxWidth: '400px',
          overflow: 'hidden',
          borderRadius: '12px',
          animation: 'slideInRight 0.25s ease-out',
          zIndex: 5000,
        }
      : {
          // Portrait: full-width bottom bar
          position: 'absolute' as const,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          borderRadius: '16px 16px 0 0',
          borderBottom: 'none',
          animation: 'slideUpMobile 0.25s ease-out',
          // Extra padding for mobile browser UI (address bar, home indicator)
          paddingBottom: 'max(calc(env(safe-area-inset-bottom, 50px) + 12px), 50px)',
          zIndex: 5000,
        };

    return (
      <div
        className="glass-panel"
        style={panelStyle}
      >
        <style>{`
          @keyframes slideUpMobile {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>

        {/* Content row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: isMobileLandscape ? '12px 16px' : '12px 16px 16px',
            gap: '12px',
          }}
        >
          {/* Color accent bar */}
          <div
            style={{
              width: '4px',
              height: '48px',
              background: `linear-gradient(to bottom, ${color}, ${color}66)`,
              borderRadius: '2px',
              boxShadow: `0 0 12px ${glow}`,
              flexShrink: 0,
            }}
          />

          {/* Class badge */}
          <div
            className={`class-badge ${properties.CLASS}`}
            style={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              fontSize: '14px',
            }}
          >
            {properties.CLASS}
          </div>

          {/* Name and type */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {properties.NAME}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}
            >
              {description?.short || `Class ${properties.CLASS}`}
            </div>
          </div>

          {/* Altitude range - compact */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              flexShrink: 0,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {formatAltitude(properties.LOWER_VAL, properties.LOWER_CODE)}
            </div>
            <div
              style={{
                fontSize: '9px',
                color: 'var(--text-muted)',
                margin: '1px 0',
              }}
            >
              ▲
            </div>
            <div
              className="mono"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
              }}
            >
              {formatAltitude(properties.UPPER_VAL, properties.UPPER_CODE)}
            </div>
          </div>

          {/* Vertical extent pill */}
          <div
            style={{
              padding: '6px 10px',
              background: `${color}20`,
              borderRadius: '6px',
              border: `1px solid ${color}30`,
              flexShrink: 0,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: color,
              }}
            >
              {verticalExtentFeet.toLocaleString()}'
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  // Desktop: full panel (unchanged)
  return (
    <div
      className="glass-panel animate-slide-in"
      style={{
        position: 'absolute',
        bottom: 24,
        right: 16,
        width: 340,
        overflow: 'hidden',
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
