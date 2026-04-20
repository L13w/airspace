import type { AirspaceFeature, ProcessedAirspace } from '../types/airspace';
import { parseFloorAltitude, parseCeilingAltitude } from './altitudeUtils';
import { getAirspaceColor } from './colorUtils';

// Vertical exaggeration to make altitudes visible at map scale
// This must match the value in Map3D.tsx
// Note: deck.gl uses meters, so we need a multiplier to make altitudes visible
export const ALTITUDE_EXAGGERATION = 16.7;

// Add Z coordinate (floor altitude in meters) to all polygon coordinates
// This makes the airspace "float" at the correct altitude
function addZToRing(ring: number[][], zValue: number): number[][] {
  return ring.map(coord => [coord[0], coord[1], zValue]);
}

function addZToPolygon(coordinates: number[][][], zValue: number): number[][][] {
  return coordinates.map(ring => addZToRing(ring, zValue));
}

function addZToMultiPolygon(coordinates: number[][][][], zValue: number): number[][][][] {
  return coordinates.map(polygon => addZToPolygon(polygon, zValue));
}

export function processAirspaceFeature(
  feature: AirspaceFeature
): ProcessedAirspace {
  const { properties, geometry } = feature;

  const floorMeters = parseFloorAltitude(
    properties.LOWER_VAL,
    properties.LOWER_CODE
  );
  const ceilingMeters = parseCeilingAltitude(
    properties.UPPER_VAL,
    properties.UPPER_CODE
  );
  const extrusionHeight = Math.max(0, ceilingMeters - floorMeters);
  const color = getAirspaceColor(properties.CLASS);

  // Transform geometry to include Z coordinates at floor altitude (with exaggeration)
  const scaledFloor = floorMeters * ALTITUDE_EXAGGERATION;
  let transformedCoordinates;
  if (geometry.type === 'Polygon') {
    transformedCoordinates = addZToPolygon(
      geometry.coordinates as number[][][],
      scaledFloor
    );
  } else {
    transformedCoordinates = addZToMultiPolygon(
      geometry.coordinates as number[][][][],
      scaledFloor
    );
  }

  return {
    ...feature,
    geometry: {
      ...geometry,
      coordinates: transformedCoordinates,
    },
    floorMeters,
    ceilingMeters,
    extrusionHeight,
    color,
  } as ProcessedAirspace;
}

export function processAirspaceFeatures(
  features: AirspaceFeature[]
): ProcessedAirspace[] {
  return features.map(processAirspaceFeature);
}
