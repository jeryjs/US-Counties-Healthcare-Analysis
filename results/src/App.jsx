import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, TrendingUp, Users, DollarSign, GraduationCap, Shield, Car, Wifi, Heart } from 'lucide-react';
import CountyMarker from './CountyMarker';
import { countyData } from './data';
import 'leaflet/dist/leaflet.css';

const ControlPanel = ({ values, onChange, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 left-4 z-50 w-80"
    >
      <div className="glass-dark p-6 rounded-2xl border border-neon-blue/30">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-pink flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-cyber font-bold text-white">
            Simulator
          </h2>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Insurance Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-blue" />
                <span className="text-sm font-medium text-gray-300">Insurance Rate</span>
              </div>
              <span className="text-sm font-mono text-neon-blue">{values.insurance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={values.insurance}
              onChange={(e) => onChange('insurance', parseInt(e.target.value))}
              className="cyber-slider w-full"
            />
          </div>

          {/* Poverty Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neon-pink" />
                <span className="text-sm font-medium text-gray-300">Poverty Rate</span>
              </div>
              <span className="text-sm font-mono text-neon-pink">{values.poverty}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={values.poverty}
              onChange={(e) => onChange('poverty', parseInt(e.target.value))}
              className="cyber-slider w-full"
            />
          </div>

          {/* Education Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-neon-green" />
                <span className="text-sm font-medium text-gray-300">Education Rate</span>
              </div>
              <span className="text-sm font-mono text-neon-green">{values.education}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={values.education}
              onChange={(e) => onChange('education', parseInt(e.target.value))}
              className="cyber-slider w-full"
            />
          </div>

          {/* Income Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Median Income</span>
              </div>
              <span className="text-sm font-mono text-yellow-400">${values.income.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="30000"
              max="150000"
              step="1000"
              value={values.income}
              onChange={(e) => onChange('income', parseInt(e.target.value))}
              className="cyber-slider w-full"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="cyber-btn w-full py-3 px-4 rounded-xl text-white font-medium"
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Reset to Baseline
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const StatsPanel = ({ selectedCounty, currentValues }) => {
  if (!selectedCounty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 z-50"
      >
        <div className="glass-dark p-6 rounded-2xl border border-neon-pink/30 w-80">
          <div className="text-center text-gray-400">
            <Heart className="w-12 h-12 mx-auto mb-3 text-neon-pink animate-pulse" />
            <p className="text-sm">Click on any county to explore healthcare metrics</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Calculate healthcare score based on current values
  const calculateScore = () => {
    return Math.round(
      (currentValues.insurance * 0.25) +
      ((100 - currentValues.poverty) * 0.15) +
      (currentValues.education * 0.15) +
      ((currentValues.income / 150000) * 100 * 0.15) +
      (80 * 0.30) // Base factors
    );
  };

  const score = calculateScore();
  const originalScore = selectedCounty.Healthcare_Access;
  const improvement = score - originalScore;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="absolute bottom-4 right-4 z-50"
      >
        <div className="glass-dark p-6 rounded-2xl border border-neon-pink/30 w-80">
          {/* County Header */}
          <div className="mb-4">
            <h3 className="text-lg font-cyber font-bold text-white">
              {selectedCounty.County}, {selectedCounty.State}
            </h3>
            <p className="text-sm text-gray-400">{selectedCounty.Cluster_Name}</p>
            <p className="text-xs text-gray-500">Population: {selectedCounty.Population.toLocaleString()}</p>
          </div>

          {/* Score Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Healthcare Access Score</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{score}</span>
                <span className="text-xs text-gray-500">/ 100</span>
              </div>
            </div>
            
            {/* Score Bar */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue"
                style={{ width: `${score}%` }}
                initial={{ width: `${originalScore}%` }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Improvement Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Original: {Math.round(originalScore)}</span>
              {improvement !== 0 && (
                <span className={`text-xs font-mono ${improvement > 0 ? 'text-neon-green' : 'text-red-400'}`}>
                  {improvement > 0 ? '+' : ''}{Math.round(improvement)} pts
                </span>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-black/30 border border-neon-blue/20">
              <Shield className="w-5 h-5 mx-auto mb-1 text-neon-blue" />
              <p className="text-xs text-gray-400">Insurance</p>
              <p className="text-sm font-mono text-neon-blue">{currentValues.insurance}%</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-black/30 border border-neon-pink/20">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-neon-pink" />
              <p className="text-xs text-gray-400">Poverty</p>
              <p className="text-sm font-mono text-neon-pink">{currentValues.poverty}%</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-black/30 border border-neon-green/20">
              <GraduationCap className="w-5 h-5 mx-auto mb-1 text-neon-green" />
              <p className="text-xs text-gray-400">Education</p>
              <p className="text-sm font-mono text-neon-green">{currentValues.education}%</p>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-black/30 border border-yellow-400/20">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <p className="text-xs text-gray-400">Income</p>
              <p className="text-sm font-mono text-yellow-400">${(currentValues.income/1000).toFixed(0)}k</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [mapKey, setMapKey] = useState(0); // Force remount if needed
  const [controlValues, setControlValues] = useState({
    insurance: 70,
    poverty: 15,
    education: 35,
    income: 65000
  });
  const [baselineValues, setBaselineValues] = useState({
    insurance: 70,
    poverty: 15,
    education: 35,
    income: 65000
  });

  // Reset map if needed (in case of errors)
  const resetMap = () => {
    setMapKey(prev => prev + 1);
  };

  // Update baseline when county changes
  useEffect(() => {
    if (selectedCounty) {
      const newBaseline = {
        insurance: Math.round(selectedCounty.Insurance_Rate),
        poverty: Math.round(selectedCounty.Poverty_Rate),
        education: Math.round(selectedCounty.Education_Rate),
        income: Math.round(selectedCounty.Median_Income)
      };
      setBaselineValues(newBaseline);
      setControlValues(newBaseline);
    }
  }, [selectedCounty]);

  const handleControlChange = (parameter, value) => {
    setControlValues(prev => ({
      ...prev,
      [parameter]: value
    }));
  };

  const handleReset = () => {
    setControlValues(baselineValues);
  };

  const getCountyColor = (healthcare_score, isSelected = false) => {
    if (isSelected) return '#ff0080';
    
    if (healthcare_score >= 80) return '#00ff41';
    if (healthcare_score >= 60) return '#00f5ff';
    if (healthcare_score >= 40) return '#ffff00';
    if (healthcare_score >= 20) return '#ff8800';
    return '#ff0000';
  };

  return (
    <div className="w-screen h-screen relative bg-cyber-dark overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-gray-900 to-cyber-dark">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-neon-blue rounded-full"
              animate={{
                x: [0, window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: Math.random() * window.innerWidth,
                top: Math.random() * window.innerHeight,
              }}
            />
          ))}
        </div>
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full h-full"
        key={`map-container-${mapKey}`}
      >
        <MapContainer
          key={`leaflet-map-${mapKey}`}
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          attributionControl={false}
        >
          <ZoomControl position="topright" />
          
          {/* Dark themed tile layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {/* County markers */}
          {countyData.map((county) => (
            <CountyMarker
              key={`${county.FIPS}-${mapKey}`}
              county={county}
              isSelected={selectedCounty?.FIPS === county.FIPS}
              onClick={setSelectedCounty}
              currentValues={controlValues}
            />
          ))}
        </MapContainer>
      </motion.div>

      {/* Control Panel */}
      <ControlPanel
        values={controlValues}
        onChange={handleControlChange}
        onReset={handleReset}
      />

      {/* Stats Panel */}
      <StatsPanel
        selectedCounty={selectedCounty}
        currentValues={controlValues}
      />

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-20 right-4 z-50"
      >
        <div className="glass-dark p-4 rounded-xl border border-neon-green/30 w-48">
          <h3 className="text-sm font-cyber font-bold text-white mb-3">Healthcare Score</h3>
          <div className="space-y-2">
            {[
              { range: '80-100', color: '#00ff41', label: 'Excellent' },
              { range: '60-79', color: '#00f5ff', label: 'Good' },
              { range: '40-59', color: '#ffff00', label: 'Fair' },
              { range: '20-39', color: '#ff8800', label: 'Poor' },
              { range: '0-19', color: '#ff0000', label: 'Critical' },
            ].map(({ range, color, label }) => (
              <div key={range} className="flex items-center gap-2">
                <div
                  className="w-4 h-3 rounded border border-white/20"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-300 font-mono">{range}</span>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
