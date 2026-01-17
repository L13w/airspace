import React, { useState, useCallback, useMemo } from 'react';
import Map, { useControl } from 'react-map-gl/maplibre';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';
import type { MapboxOverlayProps } from '@deck.gl/mapbox';
import type { PickingInfo } from '@deck.gl/core';
import { useAirspaceData } from '../hooks/useAirspaceData';
import { useIsMobile, useIsTouchDevice } from '../hooks/useIsMobile';
import type { TerminalArea } from '../config/terminalAreas';
import { InfoPanel } from './InfoPanel';
import { Legend } from './Legend';
import { AirspaceProfile } from './AirspaceProfile';
import { AltitudeScale } from './AltitudeScale';
import { BrowserNotice } from './BrowserNotice';
import { TerminalAreaSelector } from './TerminalAreaSelector';
import { ContactModal } from './ContactModal';
import { MobileMenu } from './MobileMenu';
import { formatAltitude } from '../utils/altitudeUtils';
import { getOutlineColor, HIGHLIGHT_COLORS } from '../utils/colorUtils';
import type { ProcessedAirspace } from '../types/airspace';
import 'maplibre-gl/dist/maplibre-gl.css';

// Get initial view for a terminal area
function getInitialView(area: TerminalArea) {
  return {
    longitude: area.centerLng,
    latitude: area.centerLat,
    zoom: 8.5,
    pitch: 55,
    bearing: -20,
  };
}

// Vertical exaggeration factor - makes altitude differences visible
const ALTITUDE_EXAGGERATION = 16.7;

// deck.gl overlay component using react-map-gl's useControl hook
function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

interface HoverInfo {
  x: number;
  y: number;
  object: ProcessedAirspace;
}

interface Map3DProps {
  terminalArea: TerminalArea;
}

export function Map3D({ terminalArea }: Map3DProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { data, loading, error } = useAirspaceData(terminalArea);
  const [selectedAirspace, setSelectedAirspace] = useState<ProcessedAirspace | null>(null);
  const [hoveredAirspace, setHoveredAirspace] = useState<ProcessedAirspace | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [showClassE, setShowClassE] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(true);
  const [viewState, setViewState] = useState(getInitialView(terminalArea));

  // Responsive hooks
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();

  // Reset view when terminal area changes
  React.useEffect(() => {
    setViewState(getInitialView(terminalArea));
    setSelectedAirspace(null);
    setHoveredAirspace(null);
  }, [terminalArea]);

  const handleClick = useCallback((info: PickingInfo) => {
    if (info.object) {
      setSelectedAirspace(info.object as ProcessedAirspace);
    } else {
      setSelectedAirspace(null);
    }
  }, []);

  const handleHover = useCallback((info: PickingInfo) => {
    if (info.object) {
      const obj = info.object as ProcessedAirspace;
      setHoveredAirspace(obj);
      setHoverInfo({
        x: info.x,
        y: info.y,
        object: obj,
      });
    } else {
      setHoveredAirspace(null);
      setHoverInfo(null);
    }
  }, []);

  const handleProfileClick = useCallback((airspace: ProcessedAirspace) => {
    setSelectedAirspace(airspace);
  }, []);

  const handleProfileHover = useCallback((airspace: ProcessedAirspace | null) => {
    setHoveredAirspace(airspace);
  }, []);

  // Sort airspaces by altitude for proper rendering order (lower floors first = rendered first = behind)
  // Filter out Class E unless showClassE is enabled
  const sortedData = useMemo(() => {
    if (!data) return [];
    const filtered = showClassE ? data : data.filter(d => d.properties.CLASS !== 'E');
    return [...filtered].sort((a, b) => a.floorMeters - b.floorMeters);
  }, [data, showClassE]);

  const layers = useMemo(() => {
    if (!sortedData.length) return [];

    const selectedId = selectedAirspace?.properties.OBJECTID;
    const hoveredId = hoveredAirspace?.properties.OBJECTID;

    // Base layer - solid filled polygons for each airspace volume
    // @ts-expect-error deck.gl 9.x has complex generic types
    const fillLayer = new GeoJsonLayer({
        id: 'airspace-fill-layer',
        data: {
          type: 'FeatureCollection',
          features: sortedData,
        },
        pickable: true,
        stroked: false,
        filled: true,
        extruded: true,
        wireframe: false,

        // 3D configuration
        getElevation: (d: ProcessedAirspace) => d.extrusionHeight * ALTITUDE_EXAGGERATION,
        elevationScale: 1,

        // Solid fill with class-based color
        getFillColor: (d: ProcessedAirspace) => {
          const isSelected = d.properties.OBJECTID === selectedId;
          const isHovered = d.properties.OBJECTID === hoveredId;

          if (isSelected) {
            return HIGHLIGHT_COLORS.selected;
          }
          if (isHovered) {
            return HIGHLIGHT_COLORS.hover;
          }

          // Use the airspace color with adjusted opacity based on class
          const baseColor = d.color;
          // Make Class B more visible, others slightly more transparent
          const classOpacity: Record<string, number> = {
            B: 100,
            C: 80,
            D: 70,
            E: 50,
          };
          const opacity = classOpacity[d.properties.CLASS] || 60;

          return [baseColor[0], baseColor[1], baseColor[2], opacity] as [number, number, number, number];
        },

        // Material for better 3D appearance
        material: {
          ambient: 0.6,
          diffuse: 0.8,
          shininess: 32,
          specularColor: [60, 64, 70],
        },

        // Interactivity
        onClick: handleClick,
        onHover: handleHover,

        // Auto-highlight disabled - we handle highlighting manually via getFillColor
        autoHighlight: false,

        // Update triggers for selection/hover changes
        updateTriggers: {
          getFillColor: [selectedId, hoveredId],
        },
      });

    // Outline layer - crisp edges for each airspace
    // @ts-expect-error deck.gl 9.x has complex generic types
    const outlineLayer = new GeoJsonLayer({
        id: 'airspace-outline-layer',
        data: {
          type: 'FeatureCollection',
          features: sortedData,
        },
        pickable: false,
        stroked: true,
        filled: false,
        extruded: true,
        wireframe: true,

        getElevation: (d: ProcessedAirspace) => d.extrusionHeight * ALTITUDE_EXAGGERATION,
        elevationScale: 1,

        // Outline styling
        getLineColor: (d: ProcessedAirspace) => {
          const isSelected = d.properties.OBJECTID === selectedId;
          const isHovered = d.properties.OBJECTID === hoveredId;

          if (isSelected) {
            return [255, 200, 50, 255] as [number, number, number, number];
          }
          if (isHovered) {
            return [255, 230, 150, 255] as [number, number, number, number];
          }

          return getOutlineColor(d.properties.CLASS);
        },
        lineWidthMinPixels: 1,
        getLineWidth: (d: ProcessedAirspace) => {
          const isSelected = d.properties.OBJECTID === selectedId;
          const isHovered = d.properties.OBJECTID === hoveredId;
          return isSelected ? 80 : isHovered ? 60 : 30;
        },

        updateTriggers: {
          getLineColor: [selectedId, hoveredId],
          getLineWidth: [selectedId, hoveredId],
        },
      });

    return [fillLayer, outlineLayer];
  }, [sortedData, selectedAirspace, hoveredAirspace, handleClick, handleHover]);

  // Create map style with the appropriate sectional chart for this terminal area
  const mapStyle = useMemo(() => ({
    version: 8 as const,
    sources: {
      'sectional': {
        type: 'raster' as const,
        tiles: [
          'https://tiles.arcgis.com/tiles/ssFJjBXIUyZDrSYZ/arcgis/rest/services/VFR_Sectional/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: 'FAA Aeronautical Charts'
      }
    },
    layers: [
      {
        id: 'sectional-layer',
        type: 'raster' as const,
        source: 'sectional',
        minzoom: 0,
        maxzoom: 12
      }
    ]
  }), []);

  // Responsive layout: hide profile and altitude scale on mobile
  const showProfile = !isMobile;
  const showAltitudeScale = !isMobile;
  const show3D = true;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'var(--bg-primary)' }}>
      {/* Map container */}
      {show3D && (
        <Map
          {...viewState}
          onMove={(evt: { viewState: typeof viewState }) => setViewState(evt.viewState)}
          maxPitch={85}
          minPitch={0}
          mapStyle={mapStyle}
        >
          <DeckGLOverlay layers={layers} interleaved />
        </Map>
      )}

      {/* Terminal Area Selector - upper left */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 100,
        }}
      >
        <TerminalAreaSelector selectedArea={terminalArea} />
      </div>

      {/* Title - compact dark box, centered (hidden on mobile to save space) */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 100,
          }}
        >
          <h1
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#f8fafc',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            {terminalArea.name} Airspace
          </h1>
          <p
            className="mono"
            style={{
              fontSize: '10px',
              color: 'rgba(148, 163, 184, 0.9)',
              marginTop: '2px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {terminalArea.id} • 3D Visualization
          </p>
        </div>
      )}

      {/* Hover tooltip */}
      {hoverInfo && show3D && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            left: hoverInfo.x + 12,
            top: hoverInfo.y + 12,
            padding: '10px 14px',
            pointerEvents: 'none',
            zIndex: 1000,
            maxWidth: '280px',
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
            <div className={`class-badge ${hoverInfo.object.properties.CLASS}`}>
              {hoverInfo.object.properties.CLASS}
            </div>
            <strong
              style={{
                fontSize: '14px',
                color: '#ffffff',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
              }}
            >
              {hoverInfo.object.properties.NAME}
            </strong>
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#e2e8f0',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {formatAltitude(hoverInfo.object.properties.LOWER_VAL, hoverInfo.object.properties.LOWER_CODE)}
            {' → '}
            {formatAltitude(hoverInfo.object.properties.UPPER_VAL, hoverInfo.object.properties.UPPER_CODE)}
          </div>
        </div>
      )}

      {/* Right-side panel: Action buttons + Profile view - horizontally aligned */}
      {showProfile && data && (
        <div
          style={{
            position: 'absolute',
            right: 16,
            top: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '12px',
            zIndex: 100,
          }}
        >
          {/* Action buttons - horizontal row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              paddingTop: '2px',
            }}
          >
            <button
              onClick={() => setShowHelpOverlay(true)}
              className="glass-panel"
              style={{
                padding: '8px 14px',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = 'var(--bg-glass)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Help
            </button>
            <a
              href="https://github.com/L13w/airspace"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel"
              style={{
                padding: '8px 14px',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'var(--bg-glass)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Code & Docs
            </a>
          </div>

          {/* Profile view - inline */}
          <AirspaceProfile
            key={`profile-${terminalArea.id}`}
            airspaces={data}
            selectedAirspace={selectedAirspace}
            hoveredAirspace={hoveredAirspace}
            onAirspaceClick={handleProfileClick}
            onAirspaceHover={handleProfileHover}
            airportCode={terminalArea.id}
          />
        </div>
      )}

      {/* Mobile-only hamburger menu - top right */}
      {isMobile && (
        <MobileMenu onShowHelp={() => setShowHelpOverlay(true)} />
      )}

      {/* Altitude scale - hidden on mobile */}
      {showAltitudeScale && data && (
        <AltitudeScale
          key={`scale-${terminalArea.id}`}
          airspaces={data}
          selectedAirspace={selectedAirspace}
          hoveredAirspace={hoveredAirspace}
        />
      )}

      {/* Side panel for selected airspace */}
      <InfoPanel
        airspace={selectedAirspace}
        onClose={() => setSelectedAirspace(null)}
      />

      {/* Legend - hidden on mobile */}
      {show3D && !isMobile && <Legend compact={!!selectedAirspace} showClassE={showClassE} onShowClassEChange={setShowClassE} />}

      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--class-b)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px',
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <span
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}
          >
            Loading airspace data...
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '24px 32px',
            textAlign: 'center',
            zIndex: 2000,
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <span style={{ fontSize: '24px', color: 'var(--accent-red)' }}>!</span>
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Failed to load airspace
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            {error.message}
          </div>
        </div>
      )}

      {/* Help overlay - responsive for touch/mouse */}
      {showHelpOverlay && !loading && (
        <div
          onClick={() => setShowHelpOverlay(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            cursor: 'pointer',
            padding: isMobile ? '1rem' : 0,
          }}
        >
          {/* Touch gestures for mobile */}
          {isTouch ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '0 1rem',
              maxWidth: '320px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  marginBottom: '0.25rem',
                }}>
                  ☝️ One Finger
                </div>
                <div style={{
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  Pan the map
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  marginBottom: '0.25rem',
                }}>
                  ✌️ Two Fingers
                </div>
                <div style={{
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  Pinch to zoom, drag up/down to tilt
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  marginBottom: '0.25rem',
                }}>
                  👆 Tap
                </div>
                <div style={{
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                  Select airspace
                </div>
              </div>
            </div>
          ) : (
            /* Mouse controls for desktop */
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr 1fr',
              alignItems: 'start',
              gap: '2rem',
              padding: '0 8%',
              width: '100%',
              maxWidth: '1400px',
            }}>
              <div style={{ textAlign: 'center', justifySelf: 'end', paddingRight: '2rem' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1.3,
                }}>
                  Left Click
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1.3,
                }}>
                  Drag
                </div>
              </div>
              <div style={{ textAlign: 'center', justifySelf: 'center' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1.3,
                }}>
                  Mouse Wheel
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1.3,
                }}>
                  Zoom In/Out
                </div>
              </div>
              <div style={{ textAlign: 'center', justifySelf: 'start', paddingLeft: '2rem' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1.3,
                }}>
                  Right Click
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6)',
                  lineHeight: 1.3,
                }}>
                  Rotate and Tilt
                </div>
              </div>
            </div>
          )}
          <div style={{
            fontSize: isMobile ? '0.875rem' : '1rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.7)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            marginTop: '2rem',
            textAlign: 'center',
          }}>
            {isTouch ? 'Tap anywhere to dismiss' : 'Click anywhere to dismiss'}
          </div>
        </div>
      )}

      {/* Browser compatibility notice */}
      <BrowserNotice />

      {/* Contact link at bottom */}
      <button
        onClick={() => setContactModalOpen(true)}
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '6px',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          Contact
        </span>
      </button>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}
