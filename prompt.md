# Initial Prompt

The project began with this specification:

---

## Project: 3D Airspace Visualizer for the Seattle Area

### Overview
Build a web-based 3D visualization app that renders FAA airspace boundaries with their vertical (altitude) extent, creating a volumetric "upside down wedding cake" visualization of controlled airspace. Focus initially on the Seattle Class B airspace and surrounding Class C, D, and E airspaces.

### Data Sources
The FAA provides official airspace boundary data in GeoJSON/Shapefile format:

1. **Primary Data Source**: FAA ADDS (Aeronautical Data Delivery Service)
   - Class Airspace: https://adds-faa.opendata.arcgis.com/datasets/c6a62360338e408cb1512366ad61559e_0
   - Airspace Boundaries: https://adds-faa.opendata.arcgis.com/datasets/67885972e4e940b2aa6d74024901c561_0
   - Download as GeoJSON for easier web integration

2. **Supplementary Data**: FAA 28-Day NASR Subscription
   - https://www.faa.gov/air_traffic/flight_info/aeronav/Aero_Data/NASR_Subscription
   - Contains shapefiles with detailed airspace data

3. **For reference**: OpenAIP (https://www.openaip.net/) provides community-maintained airspace data as backup

### Altitude Data Conventions (Critical)
The GeoJSON features should contain floor/ceiling altitude attributes. Key conventions:
- **Class B, C, D**: Altitudes are in MSL (Mean Sea Level) in hundreds of feet
- **Class E transition areas**: Floor may be in AGL (700' or 1200' AGL typical)
- **"SFC" means surface** (floor = 0 or terrain elevation)
- Look for attributes like: `LOWER_VAL`, `UPPER_VAL`, `FLOOR`, `CEILING`, `LOW_ALT`, `HIGH_ALT`
- Numbers like "100/30" on sectional mean ceiling 10,000 ft MSL / floor 3,000 ft MSL

### Seattle-Specific Airspace Structure
- **SEA-TAC Class B**: Classic inverted wedding cake, surface to 10,000' MSL at center
- **Boeing Field (BFI) Class D**: ~25 (2,500' MSL ceiling)
- **Renton (RNT) Class D**: Surface to 2,500' MSL
- **Paine Field (PAE) Class D**: Near Everett, 3,000' MSL ceiling
- Several Class E transition areas around smaller fields

### Technology Stack (Recommended)
Use one of these 3D visualization approaches:

**Option A: deck.gl + Mapbox (Recommended for web)**
```javascript
// Use SolidPolygonLayer with extrusion for 3D volumes
import {SolidPolygonLayer} from '@deck.gl/layers';
import {GeoJsonLayer} from '@deck.gl/layers';
```
- Excellent GeoJSON support
- Easy altitude extrusion via `getElevation` and `extruded: true`
- Good React integration
- Free tier available for Mapbox basemap

**Option B: CesiumJS**
- Better for true 3D globe visualization
- Native support for altitude-aware polygons
- Reference: "OneSky Using Cesium / 3D Tiles For Volumetric Airspace Visualization"
- Cesium Ion free tier available

**Option C: Three.js + Mapbox**
- More control but more work
- Good if custom visualization effects needed

### Core Features (MVP)
1. **Data Loading**: Fetch and parse FAA GeoJSON airspace data
2. **3D Extrusion**: Render each airspace segment as a 3D volume
   - Floor altitude = bottom of extrusion
   - Ceiling altitude = top of extrusion
   - Color-code by airspace class (Blue=B, Magenta=C, etc.)
3. **Transparency**: Semi-transparent volumes so overlapping airspace is visible
4. **Camera Controls**: Orbit, pan, zoom around the Seattle area
5. **Tooltip/Click**: Show airspace details (class, floor, ceiling, name)
6. **Terrain Option**: Optionally include terrain elevation for AGL calculations

### Data Processing Requirements
Create a data preprocessing step that:
1. Filters airspace to Seattle area (roughly lat 47.0-48.0, lon -123.0 to -121.5)
2. Converts altitude strings to numeric feet MSL
3. Handles "SFC" as 0 or terrain elevation
4. Groups multi-polygon features (same airspace, different altitude shelves)

### Visual Design
- Use FAA sectional chart colors:
  - Class B: Blue (solid), semi-transparent fill
  - Class C: Magenta (solid)
  - Class D: Blue (dashed pattern or different shade)
  - Class E: Magenta (faded/lighter)
- Altitude scale: 1 foot = reasonable visual height (may need exaggeration for clarity)
- Include altitude labels at shelf boundaries
- Optional: Overlay a 2D sectional chart raster as ground texture

### Sample Code Structure
```
/airspace-visualizer
  /src
    /components
      Map3D.jsx          # Main 3D map component
      AirspaceLayer.jsx  # Airspace volume rendering
      InfoPanel.jsx      # Click/hover info display
    /utils
      parseAirspace.js   # GeoJSON processing
      altitudeUtils.js   # Altitude conversion helpers
    /data
      seattle_airspace.geojson  # Downloaded/cached data
  /public
    index.html
  package.json
```

### Testing
Include sample coordinates to verify rendering:
- SEA-TAC: 47.4502° N, 122.3088° W
- Boeing Field: 47.5380° N, 122.3018° W
- Renton: 47.4931° N, 122.2157° W

### Reference Materials
- FAA Aeronautical Chart Users' Guide: https://www.faa.gov/air_traffic/flight_info/aeronav/digital_products/aero_guide/
- Airspace types (US): https://en.wikipedia.org/wiki/Airspace_types_(United_States)
