// FAA Terminal Area Chart configurations
// Product IDs from FAA Digital Products

export interface TerminalArea {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  productId: string;
  centerLat: number;
  centerLng: number;
  // Bounding box for data query
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  // Sectional chart name for the base map tiles
  sectionalChart: string;
}

// Terminal areas with approximate center coordinates and bounds
// Each terminal area has its own page with appropriate sectional chart
export const TERMINAL_AREAS: TerminalArea[] = [
  {
    id: 'SEA',
    name: 'Seattle',
    slug: 'seattle',
    productId: 'TSEA',
    centerLat: 47.45,
    centerLng: -122.30,
    bounds: { minLat: 46.50, maxLat: 48.40, minLng: -123.30, maxLng: -121.30 },
    sectionalChart: 'Seattle',
  },
  {
    id: 'PDX',
    name: 'Portland',
    slug: 'portland',
    productId: 'TSEA',
    centerLat: 45.59,
    centerLng: -122.60,
    bounds: { minLat: 44.60, maxLat: 46.60, minLng: -123.60, maxLng: -121.60 },
    sectionalChart: 'Seattle',
  },
  {
    id: 'ANC',
    name: 'Anchorage',
    slug: 'anchorage',
    productId: 'TANC',
    centerLat: 61.17,
    centerLng: -149.99,
    bounds: { minLat: 59.97, maxLat: 62.37, minLng: -151.19, maxLng: -148.79 },
    sectionalChart: 'Anchorage',
  },
  {
    id: 'ATL',
    name: 'Atlanta',
    slug: 'atlanta',
    productId: 'TATL',
    centerLat: 33.64,
    centerLng: -84.43,
    bounds: { minLat: 32.44, maxLat: 34.84, minLng: -85.63, maxLng: -83.23 },
    sectionalChart: 'Atlanta',
  },
  {
    id: 'DCA',
    name: 'Baltimore/Washington',
    slug: 'washington',
    productId: 'TWAS',
    centerLat: 38.95,
    centerLng: -77.46,
    bounds: { minLat: 37.75, maxLat: 40.15, minLng: -78.66, maxLng: -76.26 },
    sectionalChart: 'Washington',
  },
  {
    id: 'BOS',
    name: 'Boston',
    slug: 'boston',
    productId: 'TBOS',
    centerLat: 42.36,
    centerLng: -71.01,
    bounds: { minLat: 41.16, maxLat: 43.56, minLng: -72.21, maxLng: -69.81 },
    sectionalChart: 'New_York',
  },
  {
    id: 'CLT',
    name: 'Charlotte',
    slug: 'charlotte',
    productId: 'TCHA',
    centerLat: 35.21,
    centerLng: -80.94,
    bounds: { minLat: 34.01, maxLat: 36.41, minLng: -82.14, maxLng: -79.74 },
    sectionalChart: 'Charlotte',
  },
  {
    id: 'ORD',
    name: 'Chicago',
    slug: 'chicago',
    productId: 'TCHI',
    centerLat: 41.98,
    centerLng: -87.90,
    bounds: { minLat: 40.78, maxLat: 43.18, minLng: -89.10, maxLng: -86.70 },
    sectionalChart: 'Chicago',
  },
  {
    id: 'CVG',
    name: 'Cincinnati',
    slug: 'cincinnati',
    productId: 'TCIN',
    centerLat: 39.05,
    centerLng: -84.67,
    bounds: { minLat: 37.85, maxLat: 40.25, minLng: -85.87, maxLng: -83.47 },
    sectionalChart: 'Cincinnati',
  },
  {
    id: 'CLE',
    name: 'Cleveland',
    slug: 'cleveland',
    productId: 'TCLE',
    centerLat: 41.41,
    centerLng: -81.85,
    bounds: { minLat: 40.21, maxLat: 42.61, minLng: -83.05, maxLng: -80.65 },
    sectionalChart: 'Detroit',
  },
  {
    id: 'DFW',
    name: 'Dallas/Ft. Worth',
    slug: 'dallas',
    productId: 'TDFW',
    centerLat: 32.90,
    centerLng: -97.04,
    bounds: { minLat: 31.70, maxLat: 34.10, minLng: -98.24, maxLng: -95.84 },
    sectionalChart: 'Dallas-Ft_Worth',
  },
  {
    id: 'DEN',
    name: 'Denver',
    slug: 'denver',
    productId: 'TDEN',
    centerLat: 39.86,
    centerLng: -104.67,
    bounds: { minLat: 38.66, maxLat: 41.06, minLng: -105.87, maxLng: -103.47 },
    sectionalChart: 'Denver',
  },
  {
    id: 'DTW',
    name: 'Detroit',
    slug: 'detroit',
    productId: 'TDET',
    centerLat: 42.21,
    centerLng: -83.35,
    bounds: { minLat: 41.01, maxLat: 43.41, minLng: -84.55, maxLng: -82.15 },
    sectionalChart: 'Detroit',
  },
  {
    id: 'IAH',
    name: 'Houston',
    slug: 'houston',
    productId: 'THOU',
    centerLat: 29.98,
    centerLng: -95.34,
    bounds: { minLat: 28.78, maxLat: 31.18, minLng: -96.54, maxLng: -94.14 },
    sectionalChart: 'Houston',
  },
  {
    id: 'MCI',
    name: 'Kansas City',
    slug: 'kansas-city',
    productId: 'TKC',
    centerLat: 39.30,
    centerLng: -94.71,
    bounds: { minLat: 38.10, maxLat: 40.50, minLng: -95.91, maxLng: -93.51 },
    sectionalChart: 'Kansas_City',
  },
  {
    id: 'LAS',
    name: 'Las Vegas',
    slug: 'las-vegas',
    productId: 'TLV',
    centerLat: 36.08,
    centerLng: -115.15,
    bounds: { minLat: 34.88, maxLat: 37.28, minLng: -116.35, maxLng: -113.95 },
    sectionalChart: 'Las_Vegas',
  },
  {
    id: 'LAX',
    name: 'Los Angeles',
    slug: 'los-angeles',
    productId: 'TLA',
    centerLat: 33.94,
    centerLng: -118.41,
    bounds: { minLat: 32.74, maxLat: 35.14, minLng: -119.61, maxLng: -117.21 },
    sectionalChart: 'Los_Angeles',
  },
  {
    id: 'MEM',
    name: 'Memphis',
    slug: 'memphis',
    productId: 'TMEM',
    centerLat: 35.04,
    centerLng: -89.98,
    bounds: { minLat: 33.84, maxLat: 36.24, minLng: -91.18, maxLng: -88.78 },
    sectionalChart: 'Memphis',
  },
  {
    id: 'MIA',
    name: 'Miami',
    slug: 'miami',
    productId: 'TMIA',
    centerLat: 25.79,
    centerLng: -80.29,
    bounds: { minLat: 24.59, maxLat: 26.99, minLng: -81.49, maxLng: -79.09 },
    sectionalChart: 'Miami',
  },
  {
    id: 'MSP',
    name: 'Minneapolis/St. Paul',
    slug: 'minneapolis',
    productId: 'TMSP',
    centerLat: 44.88,
    centerLng: -93.22,
    bounds: { minLat: 43.68, maxLat: 46.08, minLng: -94.42, maxLng: -92.02 },
    sectionalChart: 'Twin_Cities',
  },
  {
    id: 'MSY',
    name: 'New Orleans',
    slug: 'new-orleans',
    productId: 'TNO',
    centerLat: 29.99,
    centerLng: -90.26,
    bounds: { minLat: 28.79, maxLat: 31.19, minLng: -91.46, maxLng: -89.06 },
    sectionalChart: 'New_Orleans',
  },
  {
    id: 'JFK',
    name: 'New York',
    slug: 'new-york',
    productId: 'TNY',
    centerLat: 40.64,
    centerLng: -73.78,
    bounds: { minLat: 39.44, maxLat: 41.84, minLng: -74.98, maxLng: -72.58 },
    sectionalChart: 'New_York',
  },
  {
    id: 'PHL',
    name: 'Philadelphia',
    slug: 'philadelphia',
    productId: 'TPHI',
    centerLat: 39.87,
    centerLng: -75.24,
    bounds: { minLat: 38.67, maxLat: 41.07, minLng: -76.44, maxLng: -74.04 },
    sectionalChart: 'New_York',
  },
  {
    id: 'PHX',
    name: 'Phoenix',
    slug: 'phoenix',
    productId: 'TPHX',
    centerLat: 33.43,
    centerLng: -112.01,
    bounds: { minLat: 32.23, maxLat: 34.63, minLng: -113.21, maxLng: -110.81 },
    sectionalChart: 'Phoenix',
  },
  {
    id: 'PIT',
    name: 'Pittsburgh',
    slug: 'pittsburgh',
    productId: 'TPIT',
    centerLat: 40.49,
    centerLng: -80.23,
    bounds: { minLat: 39.29, maxLat: 41.69, minLng: -81.43, maxLng: -79.03 },
    sectionalChart: 'Detroit',
  },
  {
    id: 'SJU',
    name: 'Puerto Rico/Virgin Islands',
    slug: 'puerto-rico',
    productId: 'LPR',
    centerLat: 18.44,
    centerLng: -66.00,
    bounds: { minLat: 17.24, maxLat: 19.64, minLng: -67.20, maxLng: -64.80 },
    sectionalChart: 'Caribbean',
  },
  {
    id: 'SLC',
    name: 'Salt Lake City',
    slug: 'salt-lake-city',
    productId: 'TSLC',
    centerLat: 40.79,
    centerLng: -111.98,
    bounds: { minLat: 39.59, maxLat: 41.99, minLng: -113.18, maxLng: -110.78 },
    sectionalChart: 'Salt_Lake_City',
  },
  {
    id: 'SAN',
    name: 'San Diego',
    slug: 'san-diego',
    productId: 'TSD',
    centerLat: 32.73,
    centerLng: -117.19,
    bounds: { minLat: 31.53, maxLat: 33.93, minLng: -118.39, maxLng: -115.99 },
    sectionalChart: 'Los_Angeles',
  },
  {
    id: 'SFO',
    name: 'San Francisco',
    slug: 'san-francisco',
    productId: 'TSF',
    centerLat: 37.62,
    centerLng: -122.38,
    bounds: { minLat: 36.42, maxLat: 38.82, minLng: -123.58, maxLng: -121.18 },
    sectionalChart: 'San_Francisco',
  },
  {
    id: 'STL',
    name: 'St. Louis',
    slug: 'st-louis',
    productId: 'TSTL',
    centerLat: 38.75,
    centerLng: -90.37,
    bounds: { minLat: 37.55, maxLat: 39.95, minLng: -91.57, maxLng: -89.17 },
    sectionalChart: 'St_Louis',
  },
  {
    id: 'TPA',
    name: 'Tampa',
    slug: 'tampa',
    productId: 'TTAM',
    centerLat: 27.98,
    centerLng: -82.53,
    bounds: { minLat: 26.98, maxLat: 28.98, minLng: -83.53, maxLng: -81.53 },
    sectionalChart: 'Jacksonville',
  },
  {
    id: 'MCO',
    name: 'Orlando',
    slug: 'orlando',
    productId: 'TTAM',
    centerLat: 28.43,
    centerLng: -81.31,
    bounds: { minLat: 27.43, maxLat: 29.43, minLng: -82.31, maxLng: -80.31 },
    sectionalChart: 'Jacksonville',
  },
];

// Default terminal area
export const DEFAULT_TERMINAL_AREA = 'seattle';

// Get terminal area by slug
export function getTerminalAreaBySlug(slug: string): TerminalArea | undefined {
  return TERMINAL_AREAS.find(area => area.slug === slug);
}

// Get terminal area by ID
export function getTerminalArea(id: string): TerminalArea | undefined {
  return TERMINAL_AREAS.find(area => area.id === id);
}

// Get terminal area display name with airport code
export function getTerminalAreaDisplayName(area: TerminalArea): string {
  return `${area.name} (${area.id})`;
}
