import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Filter, Eye, Users, TrendingUp,
  BarChart3, Map, Layers, Search, X, ChevronDown,
  Globe, Target, Activity, Zap
} from 'lucide-react';

const AdvancedControls = ({
  visualMode,
  setVisualMode,
  filterSettings,
  setFilterSettings,
  clusterMode,
  setClusterMode,
  onAnalysisChange,
  counties,
  colorScales,
  onCountySelect
}) => {
  const [activePanel, setActivePanel] = useState('visual');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique values for filters
  const regions = useMemo(() => {
    if (!counties) return [];
    return [...new Set(counties.map(c => c.Region))].sort();
  }, [counties]);

  const clusters = useMemo(() => {
    if (!counties) return [];
    const clusterData = {};
    counties.forEach(c => {
      if (!clusterData[c.Cluster_7]) {
        clusterData[c.Cluster_7] = {
          id: c.Cluster_7,
          name: c.Cluster_Name_Detailed,
          description: c.Cluster_Description,
          count: 0
        };
      }
      clusterData[c.Cluster_7].count++;
    });
    return Object.values(clusterData).sort((a, b) => a.id - b.id);
  }, [counties]);

  // Visual mode options
  const visualModes = [
    {
      id: 'healthcare_access',
      name: 'Healthcare Access',
      icon: Activity,
      description: 'Overall healthcare access score',
      colorScale: 'healthcare_access'
    },
    {
      id: 'opportunity',
      name: 'Opportunity Score',
      icon: Target,
      description: 'Potential for improvement',
      colorScale: 'opportunity'
    },
    {
      id: 'vulnerability',
      name: 'Vulnerability Index',
      icon: TrendingUp,
      description: 'Risk factors and barriers',
      colorScale: 'vulnerability'
    },
    {
      id: 'population',
      name: 'Population Size',
      icon: Users,
      description: 'County population density',
      colorScale: 'population'
    },
    {
      id: 'cluster',
      name: 'County Clusters',
      icon: Layers,
      description: 'Similar county groupings',
      colorScale: null
    }
  ];

  // Analysis modes
  const analysisModes = [
    {
      id: 'comparative',
      name: 'Peer Comparison',
      icon: BarChart3,
      description: 'Compare to similar counties'
    },
    {
      id: 'policy_impact',
      name: 'Policy Simulation',
      icon: Zap,
      description: 'What-if policy scenarios'
    },
    {
      id: 'projections',
      name: 'Future Projections',
      icon: TrendingUp,
      description: '5-year trend analysis'
    },
    {
      id: 'recommendations',
      name: 'AI Recommendations',
      icon: Target,
      description: 'Data-driven policy suggestions'
    }
  ];

  const panels = [
    { id: 'visual', name: 'Visualization', icon: Eye },
    { id: 'filters', name: 'Filters', icon: Filter },
    { id: 'clusters', name: 'Clusters', icon: Layers },
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    // { id: 'search', name: 'Search', icon: Search }
  ];

  // Search filtered counties
  const searchResults = useMemo(() => {
    if (!searchTerm || !counties) return [];
    return counties
      .filter(c =>
        c.County.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.State.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);
  }, [searchTerm, counties]);

  // Helper for quick filters
  const setQuickFilter = (filterObj) => {
    document.getElementsByClassName('reset-btn')[0].click();
    setFilterSettings(prev => ({
      ...prev,
      ...filterObj
    }));
  };

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-4 left-4 z-50 w-96 max-h-[calc(100vh-2rem)] overflow-hidden"
    >
      <div className="glass-dark rounded-2xl border border-neon-blue/30 overflow-hidden">
        {/* Header with tabs */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-pink flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-cyber font-bold text-white">
                Advanced Analytics
              </h2>
              <p className="text-xs text-gray-400">Deep insights & visualizations</p>
            </div>
            <button
              onClick={() => setActivePanel('search')}
              className={`ml-auto p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors ${activePanel === 'search' ? 'bg-neon-blue text-white shadow-lg' : ''}`}
              title="Search counties"
            >
              <Search className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </button>
          </div>

          {/* Panel tabs */}
          <div className="flex gap-1 bg-black/30 rounded-lg p-1">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-md text-xs font-medium transition-all ${activePanel === panel.id
                  ? 'bg-neon-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <panel.icon className="w-3 h-3" />
                <span className="hidden sm:block">{panel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel content */}
        <div className="p-4 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activePanel === 'visual' && (
              <motion.div
                key="visual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-white mb-3">Visualization Mode</h3>
                {visualModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setVisualMode(mode.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${visualMode === mode.id
                      ? 'border-neon-blue bg-neon-blue/10 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <mode.icon className="w-5 h-5 mt-0.5 text-neon-blue" />
                      <div>
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{mode.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {activePanel === 'filters' && (
              <motion.div
                key="filters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Data Filters</h3>
                  <button
                    onClick={() => setFilterSettings({
                      region: null,
                      populationRange: [0, 1e7],
                      healthcareRange: [0, 100],
                      incomeRange: [0, 2e5],
                      povertyRange: [0, 100],
                      disabilityRange: [0, 100],
                      educationRange: [0, 100],
                      insuranceRange: [0, 100],
                      vulnerabilityRange: [0, 100],
                      opportunityRange: [0, 100],
                      resilienceRange: [0, 100],
                      clusters: [],
                      urbanRural: null,
                      broadbandRange: [0, 35e5]
                    })}
                    className="reset-btn text-xs px-2 py-1 mt-[-50px] right-[20px] absolute bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Reset All
                  </button>
                </div>

                {/* Geographic Filters */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-xs font-semibold text-neon-blue mb-2 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Geographic
                  </h4>

                  {/* Region filter */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Region
                    </label>
                    <select
                      value={filterSettings.region || 'all'}
                      onChange={(e) => setFilterSettings(prev => ({
                        ...prev,
                        region: e.target.value === 'all' ? null : e.target.value
                      }))}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-neon-blue focus:outline-none"
                    >
                      <option value="all">All Regions</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Population range */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Population: {filterSettings.populationRange[0].toLocaleString()} - {filterSettings.populationRange[1].toLocaleString()}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={filterSettings.populationRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          populationRange: [parseInt(e.target.value), prev.populationRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="50000"
                        max="10000000"
                        step="100000"
                        value={filterSettings.populationRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          populationRange: [prev.populationRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Healthcare Metrics */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-xs font-semibold text-neon-green mb-2 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Healthcare Metrics
                  </h4>

                  {/* Healthcare Access */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Healthcare Access: {filterSettings.healthcareRange[0]} - {filterSettings.healthcareRange[1]}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.healthcareRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          healthcareRange: [parseInt(e.target.value), prev.healthcareRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.healthcareRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          healthcareRange: [prev.healthcareRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>

                  {/* Insurance Coverage */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Insurance Rate: {filterSettings.insuranceRange[0]} - {filterSettings.insuranceRange[1]}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={filterSettings.insuranceRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          insuranceRange: [parseFloat(e.target.value), prev.insuranceRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={filterSettings.insuranceRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          insuranceRange: [prev.insuranceRange[0], parseFloat(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>

                  {/* Opportunity Score */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Opportunity Score: {filterSettings.opportunityRange[0]} - {filterSettings.opportunityRange[1]}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.opportunityRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          opportunityRange: [parseInt(e.target.value), prev.opportunityRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.opportunityRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          opportunityRange: [prev.opportunityRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>

                  {/* Vulnerability Index */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Vulnerability Index: {filterSettings.vulnerabilityRange[0]} - {filterSettings.vulnerabilityRange[1]}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.vulnerabilityRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          vulnerabilityRange: [parseInt(e.target.value), prev.vulnerabilityRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.vulnerabilityRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          vulnerabilityRange: [prev.vulnerabilityRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Socioeconomic Factors */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-xs font-semibold text-neon-pink mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Socioeconomic
                  </h4>

                  {/* Median Income */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Median Income: ${filterSettings.incomeRange[0].toLocaleString()} - ${filterSettings.incomeRange[1].toLocaleString()}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="1000"
                        value={filterSettings.incomeRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          incomeRange: [parseInt(e.target.value), prev.incomeRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="100000"
                        max="200000"
                        step="5000"
                        value={filterSettings.incomeRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          incomeRange: [prev.incomeRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>

                  {/* Poverty Rate */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Poverty Rate: {filterSettings.povertyRange[0]}% - {filterSettings.povertyRange[1]}%
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.povertyRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          povertyRange: [parseInt(e.target.value), prev.povertyRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.povertyRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          povertyRange: [prev.povertyRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>

                  {/* Education Rate */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Education Rate: {filterSettings.educationRange[0]}% - {filterSettings.educationRange[1]}%
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.educationRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          educationRange: [parseInt(e.target.value), prev.educationRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.educationRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          educationRange: [prev.educationRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Barrier & Access Factors */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-xs font-semibold text-yellow-400 mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Barriers & Access
                  </h4>

                  {/* Disability Rate */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Disability Rate: {filterSettings.disabilityRange[0]}% - {filterSettings.disabilityRange[1]}%
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.disabilityRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          disabilityRange: [parseInt(e.target.value), prev.disabilityRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.disabilityRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          disabilityRange: [prev.disabilityRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>

                  {/* Broadband Access */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Broadband Access: {filterSettings.broadbandRange[0].toLocaleString()} - {filterSettings.broadbandRange[1].toLocaleString()}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="5e5"
                        step="1000"
                        value={filterSettings.broadbandRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          broadbandRange: [parseInt(e.target.value), prev.broadbandRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="10e5"
                        max="35e5"
                        step="10000"
                        value={filterSettings.broadbandRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          broadbandRange: [prev.broadbandRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>

                  {/* Resilience Score */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Resilience Score: {filterSettings.resilienceRange[0]} - {filterSettings.resilienceRange[1]}
                    </label>
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.resilienceRange[0]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          resilienceRange: [parseInt(e.target.value), prev.resilienceRange[1]]
                        }))}
                        className="w-full cyber-slider"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filterSettings.resilienceRange[1]}
                        onChange={(e) => setFilterSettings(prev => ({
                          ...prev,
                          resilienceRange: [prev.resilienceRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full cyber-slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Quick Filters
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setQuickFilter({ healthcareRange: [0, 40] })}
                      className="px-2 py-1 bg-red-900/30 border border-red-600/50 rounded text-xs text-red-200 hover:bg-red-900/50 transition-colors"
                    >
                      Low Access
                    </button>
                    <button
                      onClick={() => setQuickFilter({ healthcareRange: [75, 100] })}
                      className="px-2 py-1 bg-green-900/30 border border-green-600/50 rounded text-xs text-green-200 hover:bg-green-900/50 transition-colors"
                    >
                      High Access
                    </button>
                    <button
                      onClick={() => setQuickFilter({ populationRange: [0, 50000] })}
                      className="px-2 py-1 bg-blue-900/30 border border-blue-600/50 rounded text-xs text-blue-200 hover:bg-blue-900/50 transition-colors"
                    >
                      Rural Areas
                    </button>
                    <button
                      onClick={() => setQuickFilter({ populationRange: [1000000, 10000000] })}
                      className="px-2 py-1 bg-purple-900/30 border border-purple-600/50 rounded text-xs text-purple-200 hover:bg-purple-900/50 transition-colors"
                    >
                      Metro Areas
                    </button>
                    <button
                      onClick={() => setQuickFilter({ povertyRange: [30, 100] })}
                      className="px-2 py-1 bg-orange-900/30 border border-orange-600/50 rounded text-xs text-orange-200 hover:bg-orange-900/50 transition-colors"
                    >
                      High Poverty
                    </button>
                    <button
                      onClick={() => setQuickFilter({ opportunityRange: [60, 100] })}
                      className="px-2 py-1 bg-cyan-900/30 border border-cyan-600/50 rounded text-xs text-cyan-200 hover:bg-cyan-900/50 transition-colors"
                    >
                      High Opportunity
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activePanel === 'clusters' && (
              <motion.div
                key="clusters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-white mb-3">County Clusters</h3>
                {clusters.map((cluster) => (
                  <div key={cluster.id} className="border border-gray-600 rounded-lg p-3">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={filterSettings.clusters.length === 0 || filterSettings.clusters.includes(cluster.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // If checking a box, either add it to the array or clear array if all are selected
                            setFilterSettings(prev => {
                              const newClusters = prev.clusters.length === 0
                                ? [cluster.id] // If showing all, now show only this one
                                : [...prev.clusters, cluster.id]; // Add to existing selection

                              // If all clusters are now selected, clear the array (show all)
                              return { ...prev, clusters: newClusters.length === clusters.length ? [] : newClusters };
                            });
                          } else {
                            // If unchecking a box, remove it from selection
                            setFilterSettings(prev => {
                              if (prev.clusters.length === 0) {
                                // If showing all, now show all except this one
                                return { ...prev, clusters: clusters.map(c => c.id).filter(id => id !== cluster.id) };
                              } else {
                                // Remove from existing selection
                                return { ...prev, clusters: prev.clusters.filter(c => c !== cluster.id) };
                              }
                            });
                          }
                        }}
                        className="mt-1 w-4 h-4 text-neon-blue bg-gray-800 border-gray-600 rounded focus:ring-neon-blue focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{cluster.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{cluster.description}</div>
                        <div className="text-xs text-neon-blue mt-1">{cluster.count} counties</div>
                      </div>
                    </label>
                  </div>
                ))}
              </motion.div>
            )}

            {activePanel === 'analysis' && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-white mb-3">Analysis Tools</h3>
                {analysisModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onAnalysisChange(mode.id)}
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/50 hover:border-neon-blue hover:bg-neon-blue/10 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <mode.icon className="w-5 h-5 mt-0.5 text-neon-blue group-hover:text-white" />
                      <div>
                        <div className="font-medium text-white">{mode.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{mode.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {activePanel === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-white mb-3">County Search</h3>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search counties or states..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-blue focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">{searchResults.length} results found</div>
                    {searchResults.map((county) => (
                      <button
                        key={county.FIPS}
                        onClick={() => onCountySelect(county)}
                        className="w-full text-left p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 border border-transparent hover:border-neon-blue/50 transition-all group"
                      >
                        <div className="font-medium text-white text-sm">
                          {county.County}, {county.State}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Score: {county.Healthcare_Access.toFixed(1)} | Pop: {county.Population.toLocaleString()}
                        </div>
                        <div className="text-xs text-neon-blue mt-1">
                          {county.Cluster_Name_Detailed}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedControls;