import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, ChevronDown, ChevronUp, Eye, EyeOff,
  BarChart3, TrendingUp, Users, Target,
  Activity, Shield, GraduationCap, DollarSign
} from 'lucide-react';

const EnhancedLegend = ({ 
  visualMode, 
  colorScale, 
  clusterDefinitions, 
  clusterColors,
  stats,
  onToggle 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const visualModeConfig = {
    healthcare_access: {
      icon: Activity,
      title: 'Healthcare Access',
      description: 'Comprehensive healthcare access score based on multiple factors',
      insight: 'Higher scores indicate better access to quality healthcare services'
    },
    opportunity: {
      icon: Target,
      title: 'Improvement Opportunity',
      description: 'Potential for healthcare improvements based on population and current gaps',
      insight: 'Higher scores suggest greater potential impact from targeted investments'
    },
    vulnerability: {
      icon: TrendingUp,
      title: 'Vulnerability Index',
      description: 'Risk factors including poverty, disability, and transportation barriers',
      insight: 'Higher scores indicate more vulnerable populations requiring support'
    },
    population: {
      icon: Users,
      title: 'Population Density',
      description: 'Total county population affecting resource allocation',
      insight: 'Larger populations may have different healthcare delivery challenges'
    },
    cluster: {
      icon: BarChart3,
      title: 'County Clusters',
      description: 'Similar counties grouped by healthcare and socioeconomic characteristics',
      insight: 'Counties in same cluster share similar challenges and opportunities'
    }
  };

  const config = visualModeConfig[visualMode] || visualModeConfig.healthcare_access;

  if (!isExpanded) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsExpanded(true)}
        className="fixed top-20 right-4 z-40 p-3 glass-dark rounded-xl border border-neon-pink/30 hover:border-neon-pink/60 transition-all group"
      >
        <div className="flex items-center gap-2">
          <config.icon className="w-5 h-5 text-neon-pink group-hover:text-white" />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-20 right-4 z-40 w-80 max-h-[70vh] overflow-hidden"
    >
      <div className="glass-dark rounded-2xl border border-neon-pink/30 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue flex items-center justify-center">
                <config.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-white text-sm">{config.title}</h3>
                <p className="text-xs text-gray-400">Visual Legend & Insights</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-300 leading-relaxed">
              {config.description}
            </p>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 pt-2 border-t border-gray-700"
              >
                <p className="text-xs text-neon-blue italic">
                  💡 {config.insight}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Legend Content */}
        <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
          {visualMode === 'cluster' ? (
            // Cluster legend
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300 mb-3">County Clusters ({clusterDefinitions?.length || 7})</h4>
              {clusterDefinitions?.map((cluster) => (
                <motion.div
                  key={cluster.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: cluster.id * 0.1 }}
                  className="bg-gray-800/30 rounded-lg p-3 border border-gray-600 hover:border-neon-pink/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-6 h-6 rounded-lg border-2 border-white/20 group-hover:border-white/40 transition-all flex items-center justify-center"
                      style={{ backgroundColor: clusterColors?.[cluster.id] || '#666' }}
                    >
                      <span className="text-xs font-bold text-white">{cluster.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{cluster.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{cluster.description}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-neon-green">
                          {cluster.county_count} counties
                        </span>
                        <span className="text-gray-400">
                          Avg: {cluster.avg_healthcare_access?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) || (
                <div className="text-center py-4 text-gray-400">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Cluster data loading...</p>
                </div>
              )}
            </div>
          ) : (
            // Color scale legend
            colorScale && (
              <div className="space-y-4">
                {/* Gradient bar */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Color Scale</h4>
                  <div 
                    className="h-6 rounded-lg border border-white/20 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(to right, ${colorScale.colors?.join(', ') || '#666, #999'})`
                    }}
                  >
                    {/* Scale markers */}
                    {colorScale.domain?.map((value, idx) => (
                      <div
                        key={idx}
                        className="absolute top-0 bottom-0 w-px bg-white/30"
                        style={{ left: `${(idx / (colorScale.domain.length - 1)) * 100}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Scale labels */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{colorScale.domain?.[0] || 0}</span>
                    <span>{colorScale.domain?.[Math.floor((colorScale.domain?.length || 3) / 2)] || 50}</span>
                    <span>{colorScale.domain?.[colorScale.domain?.length - 1] || 100}</span>
                  </div>
                </div>

                {/* Category labels */}
                {colorScale.labels && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Categories</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {colorScale.labels.slice(0, 8).map((label, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/20 hover:bg-gray-700/30 transition-all"
                        >
                          <div 
                            className="w-4 h-4 rounded border border-white/20"
                            style={{ backgroundColor: colorScale.colors?.[idx] || '#666' }}
                          />
                          <span className="text-sm text-gray-300 flex-1">{label}</span>
                          {colorScale.domain && (
                            <span className="text-xs font-mono text-gray-400">
                              {colorScale.domain[idx] || 0}
                              {idx < colorScale.domain.length - 1 && '+'}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick stats */}
                {stats && (
                  <div className="space-y-2 pt-3 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300">Dataset Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {stats.total && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total:</span>
                          <span className="text-white font-mono">{stats.total.toLocaleString()}</span>
                        </div>
                      )}
                      {stats.average && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average:</span>
                          <span className="text-neon-blue font-mono">{stats.average.toFixed(1)}</span>
                        </div>
                      )}
                      {stats.min && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Min:</span>
                          <span className="text-red-400 font-mono">{stats.min.toFixed(1)}</span>
                        </div>
                      )}
                      {stats.max && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max:</span>
                          <span className="text-green-400 font-mono">{stats.max.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedLegend;