// Convert altitude values (in feet) to meters
export function feetValueToMeters(value: number | null): number {
  if (value === null || value === undefined) return 0;
  // value is already in feet, convert to meters
  return value * 0.3048;
}

export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

export function metersToFeet(meters: number): number {
  return meters / 0.3048;
}

export function parseFloorAltitude(
  lowerVal: number | null,
  lowerCode: string
): number {
  // SFC = surface = 0
  if (lowerCode === 'SFC' || lowerVal === null) return 0;

  // Values are already in feet
  return feetValueToMeters(lowerVal);
}

export function parseCeilingAltitude(
  upperVal: number | null,
  _upperCode: string
): number {
  if (upperVal === null) return feetValueToMeters(18000); // Default to 18,000' MSL
  return feetValueToMeters(upperVal);
}

// Format altitude for display
// The API returns values in feet directly (e.g., 5000 = 5,000 feet)
export function formatAltitude(value: number | null, code: string): string {
  if (code === 'SFC') return 'Surface';
  if (value === null) return 'Unknown';
  // Value is already in feet
  return `${value.toLocaleString()}'`;
}

// Format meters as feet for display
export function formatMetersAsFeet(meters: number): string {
  const feet = Math.round(metersToFeet(meters));
  return `${feet.toLocaleString()}'`;
}
