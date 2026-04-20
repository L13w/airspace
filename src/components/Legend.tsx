import { AIRSPACE_COLORS, CLASS_DESCRIPTIONS } from '../utils/colorUtils';

interface LegendProps {
  compact?: boolean;
  showClassE?: boolean;
  onShowClassEChange?: (show: boolean) => void;
}

export function Legend({ compact = false, showClassE = false, onShowClassEChange }: LegendProps) {
  // Filter out Class E from display unless showClassE is true
  const allClasses = Object.keys(AIRSPACE_COLORS);
  const classes = showClassE ? allClasses : allClasses.filter(c => c !== 'E');

  if (compact) {
    return (
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: 24,
          left: 16,
          padding: '8px 12px',
          display: 'flex',
          gap: '10px',
        }}
      >
        {classes.map(cls => {
          const colors = AIRSPACE_COLORS[cls];
          return (
            <div
              key={cls}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: colors.css,
                  boxShadow: `0 0 6px ${colors.cssGlow}`,
                }}
              />
              <span
                className="mono"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                }}
              >
                {cls}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: 24,
        left: 120,
        padding: '14px 16px',
        minWidth: '200px',
      }}
    >
      <h3
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px',
        }}
      >
        Airspace Classes
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {classes.map(cls => {
          const colors = AIRSPACE_COLORS[cls];
          const description = CLASS_DESCRIPTIONS[cls];

          return (
            <div
              key={cls}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {/* Color indicator with class letter */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '5px',
                  background: `linear-gradient(135deg, ${colors.css}, ${colors.css}cc)`,
                  boxShadow: `0 0 8px ${colors.cssGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {cls}
              </div>

              {/* Description */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '1px',
                  }}
                >
                  {description?.short || `Class ${cls}`}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {description?.requirements || ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual key */}
      <div
        style={{
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              background: 'var(--bg-tertiary)',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: 'rgba(255, 255, 100, 0.8)',
                border: '2px solid #fbbf24',
              }}
            />
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Selected airspace
          </span>
        </div>
      </div>

      {/* Class E toggle */}
      {onShowClassEChange && (
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={showClassE}
              onChange={(e) => onShowClassEChange(e.target.checked)}
              style={{
                width: '14px',
                height: '14px',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Show Class E Airspace
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
