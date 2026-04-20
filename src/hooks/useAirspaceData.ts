import { useState, useEffect } from 'react';
import type { AirspaceGeoJSON, ProcessedAirspace } from '../types/airspace';
import { processAirspaceFeatures } from '../utils/geometryUtils';
import type { TerminalArea } from '../config/terminalAreas';

const API_URL = 'https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Class_Airspace/FeatureServer/0/query';

interface UseAirspaceDataReturn {
  data: ProcessedAirspace[] | null;
  loading: boolean;
  error: Error | null;
}

export function useAirspaceData(terminalArea: TerminalArea): UseAirspaceDataReturn {
  const [data, setData] = useState<ProcessedAirspace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { bounds } = terminalArea;
      const params = new URLSearchParams({
        outFields: '*',
        where: '1=1',
        f: 'geojson',
        geometry: `${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`,
        geometryType: 'esriGeometryEnvelope',
        inSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
      });

      try {
        const response = await fetch(`${API_URL}?${params}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch airspace data: ${response.status}`);
        }

        const geojson: AirspaceGeoJSON = await response.json();

        // Filter to only include Class B, C, D, E airspace
        const filteredFeatures = geojson.features.filter(f =>
          ['B', 'C', 'D', 'E'].includes(f.properties.CLASS)
        );

        const processed = processAirspaceFeatures(filteredFeatures);
        setData(processed);
      } catch (err) {
        console.error('Error fetching airspace data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [terminalArea.id, terminalArea.bounds.minLat, terminalArea.bounds.maxLat, terminalArea.bounds.minLng, terminalArea.bounds.maxLng]);

  return { data, loading, error };
}
