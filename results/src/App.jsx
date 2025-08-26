import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Globe, Settings, BarChart3 } from 'lucide-react';
import MapView from './components/MapView';
import AdvancedControls from './components/AdvancedControls';
import DetailedAnalysis from './components/DetailedAnalysis';
import StateComparison from './components/StateComparison';
import 'leaflet/dist/leaflet.css';

const App = () => {
  // Data state
  const [counties, setCounties] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [colorScales, setColorScales] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [projections, setProjections] = useState([]);
  const [insights, setInsights] = useState([]);
  const [clusterDefinitions, setClusterDefinitions] = useState([]);
  
  // UI state
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [visualMode, setVisualMode] = useState('healthcare_access');
  const [analysisMode, setAnalysisMode] = useState('overview');
  const [showStateComparison, setShowStateComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter and clustering state
  const [filterSettings, setFilterSettings] = useState({
    region: null,
    populationRange: [0, 10000000],
    healthcareRange: [0, 100],
    clusters: []
  });
  
  const [clusterMode, setClusterMode] = useState({
    active: false,
    colors: {
      0: '#ff6b6b', 1: '#4ecdc4', 2: '#45b7d1', 3: '#96ceb4', 
      4: '#feca57', 5: '#ff9ff3', 6: '#54a0ff'
    }
  });

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all data files in parallel
        const [
          countiesResponse,
          statesResponse, 
          colorScalesResponse,
          recommendationsResponse,
          projectionsResponse,
          insightsResponse,
          clustersResponse
        ] = await Promise.all([
          fetch('/data/comprehensive_county_data.json'),
          fetch('/data/detailed_state_analysis.json'), 
          fetch('/data/color_scales.json'),
          fetch('/data/policy_recommendations.json'),
          fetch('/data/projection_scenarios.json'),
          fetch('/data/county_insights.json'),
          fetch('/data/cluster_definitions.json')
        ]);

        const [
          countiesData,
          statesData,
          colorScalesData,
          recommendationsData,
          projectionsData,
          insightsData,
          clustersData
        ] = await Promise.all([
          countiesResponse.json(),
          statesResponse.json(),
          colorScalesResponse.json(),
          recommendationsResponse.json(),
          projectionsResponse.json(),
          insightsResponse.json(),
          clustersResponse.json()
        ]);

        // Process and clean the data
        const processedCounties = countiesData.map(county => ({
          ...county,
          Healthcare_Access: county.Healthcare_Access || 50,
          Opportunity_Score: county.Opportunity_Score || 50,
          Vulnerability_Index: county.Vulnerability_Index || 50,
          Population: county.Population || 50000,
          Cluster_7: county.Cluster_7 !== undefined ? county.Cluster_7 : 0,
          lat: county.lat || county.latitude || 39,
          lng: county.lng || county.longitude || -98
        }));

        setCounties(processedCounties);
        setStateData(statesData);
        setColorScales(colorScalesData);
        setRecommendations(recommendationsData);
        setProjections(projectionsData);
        setInsights(insightsData);
        setClusterDefinitions(clustersData);
        
        console.log('Loaded comprehensive dataset:', {
          counties: processedCounties.length,
          states: statesData.length,
          recommendations: recommendationsData.length,
          projections: projectionsData.length,
          insights: insightsData.length
        });
        
        // Debug: Check first county structure
        if (processedCounties.length > 0) {
          console.log('Sample county data:', processedCounties[0]);
          console.log('Color scales loaded:', Object.keys(colorScalesData));
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to basic data if comprehensive data fails
        try {
          const basicResponse = await fetch('/county_data.json');
          const basicData = await basicResponse.json();
          setCounties(basicData);
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get current color scale based on visual mode
  const currentColorScale = useMemo(() => {
    if (visualMode === 'cluster') return null;
    return colorScales[visualMode] || colorScales.healthcare_access || {
      colors: ['#ff0000', '#ffff00', '#00ff00'],
      domain: [0, 50, 100]
    };
  }, [colorScales, visualMode]);

  // Handle county selection
  const handleCountySelect = (county) => {
    setSelectedCounty(county);
    // Auto-select the county's state
    if (county && county.State !== selectedState) {
      setSelectedState(county.State);
    }
  };

  // Handle analysis mode change
  const handleAnalysisChange = (mode) => {
    setAnalysisMode(mode);
    // Could trigger additional data loading or processing here
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-cyber-dark flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-neon-blue border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-cyber text-white mb-2">Loading Healthcare Analytics</h2>
          <p className="text-gray-400 text-sm">Preparing comprehensive datasets...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative bg-cyber-dark overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-dark">
        <div className="absolute inset-0 opacity-5">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-neon-blue rounded-full"
              animate={{
                x: [0, window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                delay: Math.random() * 10
              }}
              style={{
                left: Math.random() * window.innerWidth,
                top: Math.random() * window.innerHeight,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="glass-dark px-8 py-4 rounded-2xl border border-neon-green/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-green via-neon-blue to-neon-pink flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-cyber font-bold text-white">
                <span className="text-neon-green">Healthcare</span>{' '}
                <span className="text-neon-blue">Access</span>{' '}
                <span className="text-neon-pink">Intelligence</span>
              </h1>
              <p className="text-xs text-gray-400">
                Advanced Analytics • {counties.length.toLocaleString()} Counties • Real-time Insights
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Map */}
      <MapView
        counties={counties}
        selectedCounty={selectedCounty}
        onCountySelect={handleCountySelect}
        visualMode={visualMode}
        filterSettings={filterSettings}
        clusterMode={clusterMode}
        colorScale={currentColorScale}
      />

      {/* Advanced Controls Panel */}
      <AdvancedControls
        visualMode={visualMode}
        setVisualMode={setVisualMode}
        filterSettings={filterSettings}
        setFilterSettings={setFilterSettings}
        clusterMode={clusterMode}
        setClusterMode={setClusterMode}
        onAnalysisChange={handleAnalysisChange}
        counties={counties}
        colorScales={colorScales}
        onCountySelect={handleCountySelect}
      />

      {/* Detailed Analysis Panel */}
      <AnimatePresence>
        {selectedCounty && (
          <DetailedAnalysis
            selectedCounty={selectedCounty}
            counties={counties}
            analysisMode={analysisMode}
            recommendations={recommendations}
            projections={projections}
            insights={insights}
            onClose={() => setSelectedCounty(null)}
          />
        )}
      </AnimatePresence>

      {/* State Comparison Panel */}
      <StateComparison
        stateData={stateData}
        selectedState={selectedState}
        onStateSelect={setSelectedState}
        isVisible={showStateComparison}
        onToggle={() => setShowStateComparison(!showStateComparison)}
      />

      {/* Color Legend */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-20 right-4 z-40"
      >
        <div className="glass-dark p-4 rounded-xl border border-neon-pink/30 w-64">
          <h3 className="text-sm font-cyber font-bold text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-neon-pink" />
            {currentColorScale?.name || 'Color Legend'}
          </h3>
          
          {currentColorScale && (
            <div className="space-y-2">
              {/* Gradient bar */}
              <div className="h-4 rounded-lg overflow-hidden bg-gradient-to-r"
                   style={{
                     background: `linear-gradient(to right, ${currentColorScale.colors.join(', ')})`
                   }}
              />
              
              {/* Labels */}
              <div className="flex justify-between text-xs text-gray-400">
                <span>{currentColorScale.domain[0]}</span>
                <span>{currentColorScale.domain[Math.floor(currentColorScale.domain.length / 2)]}</span>
                <span>{currentColorScale.domain[currentColorScale.domain.length - 1]}</span>
              </div>
              
              {/* Category labels */}
              {currentColorScale.labels && (
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {currentColorScale.labels.slice(0, 6).map((label, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded border border-white/20"
                        style={{ backgroundColor: currentColorScale.colors[idx] }}
                      />
                      <span className="text-gray-300">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {visualMode === 'cluster' && (
            <div className="space-y-2">
              <div className="text-xs text-gray-400 mb-2">County Clusters:</div>
              {clusterDefinitions.map((cluster) => (
                <div key={cluster.id} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded border border-white/20"
                    style={{ backgroundColor: clusterMode.colors[cluster.id] }}
                  />
                  <span className="text-gray-300">{cluster.name}</span>
                  <span className="text-gray-500">({cluster.county_count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats Overlay */}
      {counties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-4 right-4 z-40"
        >
          <div className="glass-dark p-4 rounded-xl border border-neon-blue/30 w-56">
            <h3 className="text-sm font-cyber font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-neon-blue" />
              Quick Stats
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Counties:</span>
                <span className="text-white font-mono">{counties.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Healthcare Score:</span>
                <span className="text-neon-blue font-mono">
                  {(counties.reduce((sum, c) => sum + c.Healthcare_Access, 0) / counties.length).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Population:</span>
                <span className="text-neon-green font-mono">
                  {(counties.reduce((sum, c) => sum + c.Population, 0) / 1000000).toFixed(0)}M
                </span>
              </div>
              {selectedCounty && (
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Selected:</span>
                    <span className="text-neon-pink font-mono">
                      {selectedCounty.Healthcare_Access.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default App;