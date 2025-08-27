import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Info, Focus, TrendingUp, Users, Target, Activity, Shield, BarChart3, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * ColorLegend component displays a legend for the current color scale
 * and cluster definitions if in cluster mode, with detailed information
 * about the current visualization.
 *
 * Props:
 * - currentColorScale: Object containing name, colors, domain, and optional labels.
 * - visualMode: String indicating the current visualization mode.
 * - clusterDefinitions: Array of cluster objects with id, name, and county_count.
 * - clusterMode: Object containing colors for each cluster by id.
 */
function ColorLegend({ currentColorScale, visualMode, clusterDefinitions, clusterMode }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Real visualization information based on actual data fields
  const visualizationInfo = {
    healthcare_access: {
      title: "Healthcare Access Score",
      icon: Activity,
      description: "Primary metric representing overall healthcare access in each county",
      dataFields: [
        "Healthcare_Access - Main score (0-100 scale)",
        "Healthcare_Access_Percentile - National ranking position"
      ],
      calculation: "Direct value from Healthcare_Access field",
      dataSource: "US Census Bureau - American Community Survey",
      interpretation: {
        high: "Counties scoring 75+ indicate excellent healthcare accessibility",
        medium: "Scores 40-74 show adequate but improvable healthcare access", 
        low: "Scores below 40 indicate significant healthcare access challenges"
      },
      insights: [
        "Values range from ~20 to ~90 across all US counties",
        "Percentile rankings help identify relative performance",
        "Directly correlates with population health outcomes"
      ]
    },
    
    opportunity: {
      title: "Improvement Opportunity Score",
      icon: Target,
      description: "Measures potential for healthcare improvements based on current gaps",
      dataFields: [
        "Opportunity_Score - Calculated improvement potential (0-100)",
        "Population - Affects total impact of improvements",
        "Healthcare_Access - Current baseline performance"
      ],
      calculation: "Uses Opportunity_Score field - likely calculated as gap between potential and current access",
      dataSource: "Derived from Census healthcare access metrics",
      interpretation: {
        high: "High opportunity (60+) suggests maximum ROI for targeted interventions",
        medium: "Moderate opportunity (40-59) indicates selective improvement areas",
        low: "Low opportunity (<40) means already performing well or challenging to improve"
      },
      insights: [
        "Higher scores don't always mean worse conditions - they show improvement potential",
        "Population size multiplies the impact of any improvements",
        "Best targets combine high opportunity with large populations"
      ]
    },
    
    vulnerability: {
      title: "Healthcare Vulnerability Index", 
      icon: Shield,
      description: "Risk assessment based on social determinants and barriers to care",
      dataFields: [
        "Vulnerability_Index - Composite risk score (0-100)",
        "Poverty_Rate - Economic barriers to healthcare",
        "Disability_Rate - Population requiring additional support",
        "No_Vehicle_Rate - Transportation barriers",
        "LEP_Rate - Language barriers to accessing care"
      ],
      calculation: "Uses Vulnerability_Index field - composite of social determinant factors",
      dataSource: "US Census American Community Survey - socioeconomic indicators",
      interpretation: {
        high: "High vulnerability (60+) indicates populations at significant health risk",
        medium: "Moderate vulnerability (40-59) suggests targeted support needs",
        low: "Low vulnerability (<40) shows generally resilient populations"
      },
      insights: [
        "Combines multiple social determinants affecting health outcomes",
        "Transportation and economic barriers are major factors",
        "Language barriers significantly impact healthcare access"
      ]
    },
    
    population: {
      title: "County Population Analysis",
      icon: Users,
      description: "Total county population affecting healthcare delivery scale and models",
      dataFields: [
        "Population - Total county residents",
        "Population density affects service delivery models",
        "Scale determines provider requirements"
      ],
      calculation: "Direct Population field value, color-coded by magnitude",
      dataSource: "US Census Bureau - Annual Population Estimates",
      interpretation: {
        high: "Large counties (500K+) require complex healthcare systems",
        medium: "Mid-size counties (50K-500K) have mixed urban/rural needs",
        low: "Small counties (<50K) often face provider shortage challenges"
      },
      insights: [
        "Population ranges from ~500 to ~10M across counties",
        "Larger populations enable specialist services",
        "Rural areas struggle with provider recruitment and retention"
      ]
    },
    
    cluster: {
      title: "County Similarity Clusters",
      icon: BarChart3,
      description: "Data-driven groupings of counties with similar healthcare and demographic profiles",
      dataFields: [
        "Cluster_7 - Main cluster assignment (0-6)",
        "Cluster_Name_Detailed - Descriptive cluster names", 
        "Cluster_Description - Profile characteristics",
        "rank_in_cluster - Performance within cluster",
        "cluster_avg_score - Cluster's average healthcare score"
      ],
      calculation: "Machine learning clustering using healthcare, demographic, and geographic variables",
      dataSource: "Multi-variable analysis of Census and healthcare data",
      interpretation: {
        clusters: "7 distinct clusters represent different county archetypes nationwide",
        purpose: "Enables comparison with similar counties rather than all 3,222 counties",
        validation: "Clusters show geographic and demographic coherence"
      },
      insights: [
        "Rural Resilience, Urban Challenges, Growth Corridors are example clusters",
        "Counties can compare performance vs. similar peers",
        "Cluster membership helps identify relevant best practices"
      ]
    }
  };

  const currentInfo = visualizationInfo[visualMode] || visualizationInfo.healthcare_access;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute top-4 right-4 z-40 max-w-sm"
    >
      <div className="glass-dark p-4 rounded-xl border border-neon-pink/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-cyber font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-neon-pink" />
            {currentColorScale?.name || currentInfo.title}
          </h3>
          
          {/* Toggle button for detailed info */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-neon-blue"
            title="Toggle detailed information"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Color Scale Section */}
        {currentColorScale && visualMode !== 'cluster' && (
          <div className="space-y-2 mb-4">
            {/* Gradient bar */}
            <div className="h-4 rounded-lg overflow-hidden bg-gradient-to-r"
              style={{
                background: `linear-gradient(to right, ${currentColorScale.colors.join(', ')})`
              }} />

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
                      style={{ backgroundColor: currentColorScale.colors[idx] }} />
                    <span className="text-gray-300">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cluster Legend */}
        {visualMode === 'cluster' && (
          <div className="space-y-2 mb-4">
            <div className="text-xs text-gray-400 mb-2">County Clusters:</div>
            {clusterDefinitions.map((cluster) => (
              <div key={cluster.id} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded border border-white/20"
                  style={{ backgroundColor: clusterMode.colors[cluster.id] }} />
                <span className="text-gray-300">{cluster.name}</span>
                <span className="text-gray-500">({cluster.county_count})</span>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Information - Toggleable */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Divider */}
              <div className="border-t border-gray-600 my-4"></div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {/* Header with icon */}
                <div className="flex items-center gap-2">
                  <currentInfo.icon className="w-4 h-4 text-neon-blue" />
                  <h4 className="text-sm font-bold text-white">{currentInfo.title}</h4>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-2">
                    {currentInfo.description}
                  </p>
                </div>

                {/* Data Fields Used */}
                <div>
                  <h5 className="text-xs font-semibold text-neon-green flex items-center gap-1 mb-1">
                    <Info className="w-3 h-3" />
                    Data Fields
                  </h5>
                  <div className="space-y-1">
                    {currentInfo.dataFields.map((field, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 flex-shrink-0"></div>
                        <span className="text-xs text-gray-400">{field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculation Method */}
                <div>
                  <h5 className="text-xs font-semibold text-neon-pink flex items-center gap-1 mb-1">
                    <Focus className="w-3 h-3" />
                    How It's Calculated
                  </h5>
                  <div className="bg-gray-800/50 rounded p-2 border border-gray-600">
                    <code className="text-xs text-gray-300 font-mono leading-relaxed break-words">
                      {currentInfo.calculation}
                    </code>
                  </div>
                </div>

                {/* Data Source */}
                <div>
                  <h5 className="text-xs font-semibold text-neon-blue flex items-center gap-1 mb-1">
                    <BarChart3 className="w-3 h-3" />
                    Data Source
                  </h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {currentInfo.dataSource}
                  </p>
                </div>

                {/* Interpretation */}
                <div>
                  <h5 className="text-xs font-semibold text-yellow-400 flex items-center gap-1 mb-2">
                    <TrendingUp className="w-3 h-3" />
                    Interpretation
                  </h5>
                  {currentInfo.interpretation.high ? (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                        <span className="text-gray-300"><span className="text-green-400 font-medium">High:</span> {currentInfo.interpretation.high}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></div>
                        <span className="text-gray-300"><span className="text-yellow-400 font-medium">Medium:</span> {currentInfo.interpretation.medium}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                        <span className="text-gray-300"><span className="text-red-400 font-medium">Low:</span> {currentInfo.interpretation.low}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      {Object.entries(currentInfo.interpretation).map(([key, value]) => (
                        <div key={key} className="text-gray-300">
                          <span className="text-neon-blue font-medium capitalize">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Insights */}
                <div>
                  <h5 className="text-xs font-semibold text-purple-400 flex items-center gap-1 mb-2">
                    <Target className="w-3 h-3" />
                    Key Insights
                  </h5>
                  <div className="space-y-1">
                    {currentInfo.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                        <span className="text-xs text-gray-400">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default ColorLegend;