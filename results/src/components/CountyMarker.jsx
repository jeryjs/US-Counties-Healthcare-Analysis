import React from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';

const CountyMarker = ({ 
  county, 
  isSelected, 
  onClick, 
  color, 
  radius, 
  visualMode 
}) => {

  // Get tooltip content based on visual mode
  const getTooltipContent = () => {
    const baseInfo = {
      name: `${county.County}, ${county.State}`,
      population: county.Population.toLocaleString(),
      cluster: county.Cluster_Name_Detailed
    };

    let specificInfo = {};
    switch (visualMode) {
      case 'healthcare_access':
        specificInfo = {
          score: county.Healthcare_Access.toFixed(1),
          percentile: `${county.Healthcare_Access_Percentile?.toFixed(0) || 'N/A'}th percentile`,
          label: 'Healthcare Access'
        };
        break;
      case 'opportunity':
        specificInfo = {
          score: county.Opportunity_Score.toFixed(1),
          label: 'Opportunity Score',
          context: 'Higher = More potential for improvement'
        };
        break;
      case 'vulnerability':
        specificInfo = {
          score: county.Vulnerability_Index.toFixed(1),
          resilience: county.Resilience_Score.toFixed(1),
          label: 'Vulnerability Index'
        };
        break;
      case 'population':
        specificInfo = {
          score: county.Population.toLocaleString(),
          density: 'Urban area', // Could calculate actual density if we had area data
          label: 'Population'
        };
        break;
      case 'cluster':
        specificInfo = {
          score: county.Cluster_Name_Detailed,
          description: county.Cluster_Description,
          label: 'Cluster Type'
        };
        break;
      default:
        specificInfo = {
          score: county.Healthcare_Access.toFixed(1),
          label: 'Healthcare Access'
        };
    }

    return { ...baseInfo, ...specificInfo };
  };

  const tooltipData = getTooltipContent();

  return (
    <CircleMarker
      center={[county.lat, county.lng]}
      radius={radius}
      pathOptions={{
        color: color,
        weight: isSelected ? 3 : 2,
        opacity: 0.9,
        fillColor: color,
        fillOpacity: isSelected ? 0.9 : 0.7
      }}
      eventHandlers={{
        click: () => onClick(county),
        mouseover: (e) => {
          if (!isSelected) {
            e.target.setStyle({
              weight: 3,
              fillOpacity: 0.9,
              scale: 1.1
            });
          }
        },
        mouseout: (e) => {
          if (!isSelected) {
            e.target.setStyle({
              weight: 2,
              fillOpacity: 0.7,
              scale: 1.0
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
        permanent={isSelected}
      >
        <div className="p-3 bg-black/95 border border-neon-blue rounded-lg text-white text-sm min-w-[200px]">
          {/* Header */}
          <div className="font-bold text-neon-blue mb-2 border-b border-gray-700 pb-2">
            {tooltipData.name}
          </div>
          
          {/* Main metric */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">{tooltipData.label}:</span>
            <span className="font-mono text-neon-green font-bold">
              {tooltipData.score}
            </span>
          </div>

          {/* Additional context */}
          {tooltipData.percentile && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-xs">National Rank:</span>
              <span className="text-xs text-yellow-400">{tooltipData.percentile}</span>
            </div>
          )}

          {tooltipData.resilience && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-xs">Resilience:</span>
              <span className="text-xs text-green-400">{tooltipData.resilience}</span>
            </div>
          )}

          {tooltipData.context && (
            <div className="text-xs text-gray-400 mt-1 italic">
              {tooltipData.context}
            </div>
          )}

          {/* Base info */}
          <div className="border-t border-gray-700 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Population:</span>
              <span className="font-mono text-gray-300">{tooltipData.population}</span>
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-neon-pink">{tooltipData.cluster}</span>
            </div>
          </div>

          {/* Click hint */}
          {!isSelected && (
            <div className="text-xs text-center text-gray-500 mt-2 pt-1 border-t border-gray-800">
              Click for detailed analysis
            </div>
          )}

          {/* Selected indicator */}
          {isSelected && (
            <div className="text-xs text-center text-neon-pink mt-2 pt-1 border-t border-gray-800 font-medium">
              ● Selected County ●
            </div>
          )}
        </div>
      </Tooltip>
    </CircleMarker>
  );
};

export default CountyMarker;