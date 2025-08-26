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
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      visualMode === mode.id
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
                className="space-y-4"
              >
                <h3 className="text-sm font-semibold text-white mb-3">Data Filters</h3>
                
                {/* Region filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={filterSettings.region || 'all'}
                    onChange={(e) => setFilterSettings(prev => ({
                      ...prev,
                      region: e.target.value === 'all' ? null : e.target.value
                    }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-neon-blue focus:outline-none"
                  >
                    <option value="all">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Population range */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Population Range: {filterSettings.populationRange[0].toLocaleString()} - {filterSettings.populationRange[1].toLocaleString()}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      value={filterSettings.populationRange[0]}
                      onChange={(e) => setFilterSettings(prev => ({
                        ...prev,
                        populationRange: [parseInt(e.target.value), prev.populationRange[1]]
                      }))}
                      className="w-full cyber-slider"
                    />
                    <input
                      type="range"
                      min="1000000"
                      max="10000000"
                      value={filterSettings.populationRange[1]}
                      onChange={(e) => setFilterSettings(prev => ({
                        ...prev,
                        populationRange: [prev.populationRange[0], parseInt(e.target.value)]
                      }))}
                      className="w-full cyber-slider"
                    />
                  </div>
                </div>

                {/* Healthcare access range */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Healthcare Access: {filterSettings.healthcareRange[0]} - {filterSettings.healthcareRange[1]}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filterSettings.healthcareRange[0]}
                      onChange={(e) => setFilterSettings(prev => ({
                        ...prev,
                        healthcareRange: [parseInt(e.target.value), prev.healthcareRange[1]]
                      }))}
                      className="flex-1 cyber-slider"
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
                      className="flex-1 cyber-slider"
                    />
                  </div>
                </div>

                {/* Reset filters */}
                <button
                  onClick={() => setFilterSettings({
                    region: null,
                    populationRange: [0, 10000000],
                    healthcareRange: [0, 100],
                    clusters: []
                  })}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Reset All Filters
                </button>
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
                        checked={!filterSettings.clusters.length || filterSettings.clusters.includes(cluster.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterSettings(prev => ({
                              ...prev,
                              clusters: prev.clusters.length === clusters.length - 1 ? [] : [...prev.clusters, cluster.id]
                            }));
                          } else {
                            setFilterSettings(prev => ({
                              ...prev,
                              clusters: prev.clusters.filter(c => c !== cluster.id)
                            }));
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