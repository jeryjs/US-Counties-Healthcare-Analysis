import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import CountyMarker from './CountyMarker';
import 'leaflet/dist/leaflet.css';

// US bounds to restrict map view
const US_BOUNDS = [
  [20, -170], // Southwest
  [50, -50]   // Northeast  
];

const MapView = ({ 
  counties, 
  selectedCounty, 
  onCountySelect, 
  visualMode, 
  filterSettings,
  clusterMode,
  colorScale
}) => {
  const [mapReady, setMapReady] = useState(false);

  // Filter counties based on current filter settings
  const filteredCounties = useMemo(() => {
    if (!counties) return [];
    
    return counties.filter(county => {
      // Region filter
      if (filterSettings.region && filterSettings.region !== 'all' && 
          county.Region !== filterSettings.region) return false;
      
      // Population range filter
      if (county.Population < filterSettings.populationRange[0] || 
          county.Population > filterSettings.populationRange[1]) return false;
      
      // Healthcare access range filter
      if (county.Healthcare_Access < filterSettings.healthcareRange[0] || 
          county.Healthcare_Access > filterSettings.healthcareRange[1]) return false;
      
      // Cluster filter
      if (filterSettings.clusters && filterSettings.clusters.length > 0 &&
          !filterSettings.clusters.includes(county.Cluster_7)) return false;
      
      return true;
    });
  }, [counties, filterSettings]);

  // Get color based on visual mode and county data
  const getCountyColor = (county) => {
    if (selectedCounty && county.FIPS === selectedCounty.FIPS) {
      return '#ff0080'; // Selected county
    }
    
    let value;
    switch (visualMode) {
      case 'healthcare_access':
        value = county.Healthcare_Access;
        break;
      case 'opportunity':
        value = county.Opportunity_Score;
        break;
      case 'vulnerability':
        value = county.Vulnerability_Index;
        break;
      case 'population':
        value = county.Population;
        break;
      case 'cluster':
        return clusterMode.colors[county.Cluster_7] || '#666';
      default:
        value = county.Healthcare_Access;
    }

    // Use gradient color scale
    return interpolateColor(colorScale, value);
  };

  // Get radius based on population and visual mode
  const getCountyRadius = (county) => {
    let baseRadius;
    if (county.Population > 5000000) baseRadius = 12;
    else if (county.Population > 1000000) baseRadius = 10;
    else if (county.Population > 500000) baseRadius = 8;
    else if (county.Population > 100000) baseRadius = 6;
    else baseRadius = 4;
    
    // Adjust based on zoom level if needed
    return baseRadius;
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        maxBounds={US_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        attributionControl={false}
        whenCreated={() => setMapReady(true)}
      >
        {/* Dark tile layer focused on US */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          bounds={US_BOUNDS}
        />
        
        {/* State boundaries overlay */}
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.png"
          opacity={0.3}
          bounds={US_BOUNDS}
        />
        
        {/* County markers */}
        {mapReady && filteredCounties.map((county) => (
          <CountyMarker
            key={county.FIPS}
            county={county}
            isSelected={selectedCounty?.FIPS === county.FIPS}
            onClick={onCountySelect}
            color={getCountyColor(county)}
            radius={getCountyRadius(county)}
            visualMode={visualMode}
          />
        ))}
      </MapContainer>
      
      {/* Map loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
};

// Helper function to interpolate colors based on value and scale
const interpolateColor = (colorScale, value) => {
  if (!colorScale || !colorScale.colors || !colorScale.domain) return '#666';
  
  const { colors, domain } = colorScale;
  
  // Find the position in the domain
  let index = 0;
  for (let i = 0; i < domain.length - 1; i++) {
    if (value >= domain[i] && value <= domain[i + 1]) {
      index = i;
      break;
    }
  }
  
  // Simple interpolation between two colors
  const ratio = (value - domain[index]) / (domain[index + 1] - domain[index]);
  return interpolateHexColors(colors[index], colors[index + 1], ratio);
};

// Helper to interpolate between two hex colors
const interpolateHexColors = (color1, color2, ratio) => {
  if (!color1 || !color2) return color1 || color2 || '#666';
  
  const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  
  const rgb2hex = (r, g, b) => {
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };
  
  const [r1, g1, b1] = hex2rgb(color1);
  const [r2, g2, b2] = hex2rgb(color2);
  
  const r = r1 + (r2 - r1) * ratio;
  const g = g1 + (g2 - g1) * ratio;
  const b = b1 + (b2 - b1) * ratio;
  
  return rgb2hex(r, g, b);
};

export default MapView;