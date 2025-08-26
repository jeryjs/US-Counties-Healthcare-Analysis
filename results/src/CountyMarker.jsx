import React from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import { motion } from 'framer-motion';

const CountyMarker = ({ county, isSelected, onClick, currentValues }) => {
  // Calculate dynamic score based on current control values
  const calculateDynamicScore = () => {
    return Math.round(
      (currentValues.insurance * 0.25) +
      ((100 - currentValues.poverty) * 0.15) +
      (currentValues.education * 0.15) +
      ((currentValues.income / 150000) * 100 * 0.15) +
      (80 * 0.30) // Base factors
    );
  };

  const dynamicScore = calculateDynamicScore();
  const originalScore = county.Healthcare_Access;
  
  const getColor = (score) => {
    if (score >= 80) return '#00ff41'; // Neon green
    if (score >= 60) return '#00f5ff'; // Neon blue  
    if (score >= 40) return '#ffff00'; // Yellow
    if (score >= 20) return '#ff8800'; // Orange
    return '#ff0000'; // Red
  };

  const getRadius = (population) => {
    if (population > 5000000) return 12;
    if (population > 1000000) return 10;
    if (population > 500000) return 8;
    if (population > 100000) return 6;
    return 4;
  };

  const color = isSelected ? '#ff0080' : getColor(dynamicScore);
  const radius = getRadius(county.Population);

  return (
    <CircleMarker
      center={[county.lat, county.lng]}
      radius={radius}
      pathOptions={{
        color: color,
        weight: isSelected ? 3 : 2,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: isSelected ? 0.8 : 0.6
      }}
      eventHandlers={{
        click: () => onClick(county),
        mouseover: (e) => {
          e.target.setStyle({
            weight: 3,
            fillOpacity: 0.9
          });
        },
        mouseout: (e) => {
          if (!isSelected) {
            e.target.setStyle({
              weight: 2,
              fillOpacity: 0.6
            });
          }
        }
      }}
    >
      <Tooltip 
        direction="top" 
        offset={[0, -10]} 
        opacity={1}
        className="custom-tooltip"
      >
        <div className="p-3 bg-black/95 border border-neon-blue rounded-lg text-white text-sm">
          <div className="font-bold text-neon-blue mb-1">
            {county.County}, {county.State}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Healthcare Score:</span>
              <span className="font-mono text-neon-green">{dynamicScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Population:</span>
              <span className="font-mono">{county.Population.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cluster:</span>
              <span className="text-xs text-gray-300">{county.Cluster_Name}</span>
            </div>
            {dynamicScore !== originalScore && (
              <div className="border-t border-gray-700 pt-1 mt-2">
                <div className="flex justify-between text-xs">
                  <span>Original:</span>
                  <span className="font-mono">{Math.round(originalScore)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Change:</span>
                  <span className={`font-mono ${dynamicScore > originalScore ? 'text-neon-green' : 'text-red-400'}`}>
                    {dynamicScore > originalScore ? '+' : ''}{Math.round(dynamicScore - originalScore)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Tooltip>
    </CircleMarker>
  );
};

export default CountyMarker;