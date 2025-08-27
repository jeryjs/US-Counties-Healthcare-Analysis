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

  // Set a timeout to force mapReady if it doesn't load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!mapReady) {
        console.log('Forcing map ready after timeout');
        setMapReady(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [mapReady]);

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
      
      // Income range filter
      const medianIncome = county.Median_Income < 0 ? 0 : county.Median_Income;
      if (medianIncome < filterSettings.incomeRange[0] || 
          medianIncome > filterSettings.incomeRange[1]) return false;
      
      // Poverty range filter
      if (county.Poverty_Rate < filterSettings.povertyRange[0] || 
          county.Poverty_Rate > filterSettings.povertyRange[1]) return false;
      
      // Disability range filter
      if (county.Disability_Rate < filterSettings.disabilityRange[0] || 
          county.Disability_Rate > filterSettings.disabilityRange[1]) return false;
      
      // Education range filter
      if (county.Education_Rate < filterSettings.educationRange[0] || 
          county.Education_Rate > filterSettings.educationRange[1]) return false;
      
      // Insurance range filter
      if (county.Insurance_Rate < filterSettings.insuranceRange[0] || 
          county.Insurance_Rate > filterSettings.insuranceRange[1]) return false;
      
      // Vulnerability range filter
      if (county.Vulnerability_Index < filterSettings.vulnerabilityRange[0] || 
          county.Vulnerability_Index > filterSettings.vulnerabilityRange[1]) return false;
      
      // Opportunity range filter
      if (county.Opportunity_Score < filterSettings.opportunityRange[0] || 
          county.Opportunity_Score > filterSettings.opportunityRange[1]) return false;
      
      // Resilience range filter
      if (county.Resilience_Score < filterSettings.resilienceRange[0] || 
          county.Resilience_Score > filterSettings.resilienceRange[1]) return false;
      
      // Broadband range filter
      if (county.Broadband_Rate < filterSettings.broadbandRange[0] || 
          county.Broadband_Rate > filterSettings.broadbandRange[1]) return false;
      
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
        value = county.Healthcare_Access || 50;
        break;
      case 'opportunity':
        value = county.Opportunity_Score || 50;
        break;
      case 'vulnerability':
        value = county.Vulnerability_Index || 50;
        break;
      case 'population':
        value = Math.log10(county.Population || 10000);
        return value > 6 ? '#ff0000' : value > 5 ? '#ff7700' : value > 4 ? '#ffff00' : '#00ff00';
      case 'cluster':
        return clusterMode.colors[county.Cluster_7] || '#666';
      default:
        value = county.Healthcare_Access || 50;
    }

    // Use gradient color scale or fallback
    const color = interpolateColor(colorScale, value);
    return color || '#00f5ff'; // Always return a valid color
  };

  // Get radius based on population and visual mode
  const getCountyRadius = (county) => {
    // Base radius calculation with smart scaling
    let baseRadius;
    const population = county.Population || 0;
    
    // Smart population-based scaling with logarithmic progression
    if (population > 10000000) baseRadius = 16;      // Mega counties (LA, NYC)
    else if (population > 5000000) baseRadius = 14;  // Major metros
    else if (population > 2000000) baseRadius = 12;  // Large metros  
    else if (population > 1000000) baseRadius = 10;  // Medium metros
    else if (population > 500000) baseRadius = 8;    // Small metros
    else if (population > 200000) baseRadius = 7;    // Large counties
    else if (population > 100000) baseRadius = 6;    // Medium counties
    else if (population > 50000) baseRadius = 5;     // Small counties
    else if (population > 20000) baseRadius = 4;     // Rural counties
    else baseRadius = 3;                             // Very rural

    // Visual mode adjustments for enhanced data storytelling
    let modeMultiplier = 1;
    let bonus = 0;
    
    switch (visualMode) {
      case 'vulnerability':
        // Larger circles for high vulnerability to draw attention
        modeMultiplier = county.Vulnerability_Index > 70 ? 1.3 : county.Vulnerability_Index > 50 ? 1.1 : 0.9;
        break;
        
      case 'opportunity':
        // Larger circles for high opportunity areas
        modeMultiplier = county.Opportunity_Score > 70 ? 1.2 : county.Opportunity_Score < 30 ? 0.8 : 1;
        break;
        
      case 'healthcare_access':
        // Emphasize areas with poor healthcare access
        modeMultiplier = county.Healthcare_Access < 30 ? 1.4 : county.Healthcare_Access < 50 ? 1.1 : 0.9;
        break;
        
      case 'cluster':
        // Differentiate cluster importance
        const clusterSizes = { 1: 1.2, 2: 1.1, 3: 1.0, 4: 0.9, 5: 0.8, 6: 0.9, 7: 1.0 };
        modeMultiplier = clusterSizes[county.Cluster_7] || 1;
        break;
        
      case 'population':
        // Population mode gets extra emphasis on size
        modeMultiplier = 1.5;
        break;
    }

    // Selection bonus - make selected county stand out significantly
    if (selectedCounty?.FIPS === county.FIPS) {
      bonus = 4;
    }

    // Smart minimum/maximum constraints with context awareness
    const finalRadius = Math.max(2, Math.min(20, baseRadius * modeMultiplier + bonus));
    
    return finalRadius;
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
        whenReady={() => setMapReady(true)}
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
          opacity={0.7}
          bounds={US_BOUNDS}
        />
        
        {/* County markers */}
        {filteredCounties.length > 0 && filteredCounties.map((county) => {
          const color = getCountyColor(county);
          const radius = getCountyRadius(county);
          
          return (
            <CountyMarker
              key={county.FIPS}
              county={county}
              isSelected={selectedCounty?.FIPS === county.FIPS}
              onClick={onCountySelect}
              color={color}
              radius={radius}
              visualMode={visualMode}
            />
          );
        })}
        
        {/* Debug info */}
        {mapReady && process.env.NODE_ENV === 'development' && (
          <div style={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '5px',
            fontSize: '12px',
            zIndex: 1000,
            borderRadius: '4px'
          }}>
            Counties: {filteredCounties.length} | Mode: {visualMode}
          </div>
        )}
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
  if (!colorScale || !colorScale.colors || !colorScale.domain) {
    // Fallback color based on value
    if (value > 80) return '#00ff41';
    if (value > 60) return '#00f5ff';
    if (value > 40) return '#ffff00';
    if (value > 20) return '#ff7700';
    return '#ff0000';
  }
  
  const { colors, domain } = colorScale;
  
  // Handle edge cases
  if (value <= domain[0]) return colors[0];
  if (value >= domain[domain.length - 1]) return colors[colors.length - 1];
  
  // Find the position in the domain
  let index = 0;
  for (let i = 0; i < domain.length - 1; i++) {
    if (value >= domain[i] && value <= domain[i + 1]) {
      index = i;
      break;
    }
  }
  
  // Ensure we have valid colors to interpolate between
  if (!colors[index] || !colors[index + 1]) return colors[index] || '#666';
  
  // Simple interpolation between two colors
  const ratio = (value - domain[index]) / (domain[index + 1] - domain[index]);
  return interpolateHexColors(colors[index], colors[index + 1], ratio);
};

// Helper to interpolate between two hex colors
const interpolateHexColors = (color1, color2, ratio) => {
  if (!color1 || !color2) return color1 || color2 || '#666';
  
  // Clamp ratio between 0 and 1
  ratio = Math.max(0, Math.min(1, ratio));
  
  const hex2rgb = (hex) => {
    // Handle various hex formats
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    return [r, g, b];
  };
  
  const rgb2hex = (r, g, b) => {
    const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  try {
    const [r1, g1, b1] = hex2rgb(color1);
    const [r2, g2, b2] = hex2rgb(color2);
    
    const r = r1 + (r2 - r1) * ratio;
    const g = g1 + (g2 - g1) * ratio;
    const b = b1 + (b2 - b1) * ratio;
    
    return rgb2hex(r, g, b);
  } catch (error) {
    console.warn('Color interpolation error:', error, color1, color2);
    return color1;
  }
};

export default MapView;