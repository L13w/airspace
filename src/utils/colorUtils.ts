// Aviation-inspired RGBA colors for airspace classes
// Designed for clear visual distinction while maintaining recognizable class associations

export const AIRSPACE_COLORS: Record<string, {
  fill: [number, number, number, number];
  stroke: [number, number, number, number];
  css: string;
  cssGlow: string;
  label: string;
}> = {
  B: {
    fill: [59, 130, 246, 90],       // Bright blue - Class B (major airports like SEA-TAC)
    stroke: [59, 130, 246, 255],
    css: '#3b82f6',
    cssGlow: 'rgba(59, 130, 246, 0.4)',
    label: 'Class B'
  },
  C: {
    fill: [168, 85, 247, 80],       // Purple - Class C (busy airports)
    stroke: [168, 85, 247, 255],
    css: '#a855f7',
    cssGlow: 'rgba(168, 85, 247, 0.4)',
    label: 'Class C'
  },
  D: {
    fill: [34, 211, 238, 70],       // Cyan - Class D (towered airports)
    stroke: [34, 211, 238, 255],
    css: '#22d3ee',
    cssGlow: 'rgba(34, 211, 238, 0.4)',
    label: 'Class D'
  },
  E: {
    fill: [244, 114, 182, 50],      // Pink - Class E (transition areas)
    stroke: [244, 114, 182, 200],
    css: '#f472b6',
    cssGlow: 'rgba(244, 114, 182, 0.3)',
    label: 'Class E'
  },
};

// Get fill color for 3D rendering (semi-transparent)
export function getAirspaceColor(
  airspaceClass: string
): [number, number, number, number] {
  return AIRSPACE_COLORS[airspaceClass]?.fill || [128, 128, 128, 60];
}

// Get stroke/outline color (fully opaque)
export function getOutlineColor(
  airspaceClass: string
): [number, number, number, number] {
  return AIRSPACE_COLORS[airspaceClass]?.stroke || [128, 128, 128, 255];
}

// Get CSS color string for UI components
export function getAirspaceColorCSS(airspaceClass: string): string {
  return AIRSPACE_COLORS[airspaceClass]?.css || '#808080';
}

// Get CSS glow color for effects
export function getAirspaceGlowCSS(airspaceClass: string): string {
  return AIRSPACE_COLORS[airspaceClass]?.cssGlow || 'rgba(128, 128, 128, 0.3)';
}

export const CLASS_DESCRIPTIONS: Record<string, {
  short: string;
  full: string;
  requirements: string;
}> = {
  B: {
    short: 'Major Airports',
    full: 'Class B - Major airports (SEA-TAC)',
    requirements: 'ATC clearance required'
  },
  C: {
    short: 'Busy Airports',
    full: 'Class C - Busy airports with radar',
    requirements: 'Two-way radio, transponder'
  },
  D: {
    short: 'Towered Fields',
    full: 'Class D - Towered airports',
    requirements: 'Two-way radio contact'
  },
  E: {
    short: 'Controlled Transition',
    full: 'Class E - Controlled airspace',
    requirements: 'Varies by visibility/clouds'
  },
};

// Highlight colors for interaction states
export const HIGHLIGHT_COLORS = {
  hover: [255, 200, 50, 180] as [number, number, number, number],
  selected: [255, 255, 100, 200] as [number, number, number, number],
};

// Get altitude-based opacity for better depth perception
export function getAltitudeBasedOpacity(floorFeet: number, ceilingFeet: number): number {
  // Higher altitudes get slightly more transparent to create depth
  const avgAltitude = (floorFeet + ceilingFeet) / 2;
  const baseOpacity = 0.35;
  const altitudeFactor = Math.min(avgAltitude / 15000, 1) * 0.15;
  return baseOpacity - altitudeFactor;
}
