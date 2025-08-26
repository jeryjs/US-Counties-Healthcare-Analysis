import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, 
  Users, DollarSign, GraduationCap, Shield, 
  BarChart3, PieChart, LineChart, Info, 
  ArrowUp, ArrowDown, Minus, Zap, Award,
  ChevronRight, ChevronDown, Eye, EyeOff
} from 'lucide-react';

const DetailedAnalysis = ({ 
  selectedCounty, 
  counties, 
  analysisMode, 
  recommendations, 
  projections,
  insights,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showComparison, setShowComparison] = useState(true);

  if (!selectedCounty) return null;

  // Find similar counties for comparison
  const similarCounties = useMemo(() => {
    if (!counties) return [];
    
    return counties
      .filter(c => 
        c.FIPS !== selectedCounty.FIPS &&
        c.Cluster_7 === selectedCounty.Cluster_7 &&
        Math.abs(c.Population - selectedCounty.Population) < selectedCounty.Population * 0.5
      )
      .sort((a, b) => Math.abs(a.Healthcare_Access - selectedCounty.Healthcare_Access) - 
                     Math.abs(b.Healthcare_Access - selectedCounty.Healthcare_Access))
      .slice(0, 5);
  }, [selectedCounty, counties]);

  // Get county-specific recommendations
  const countyRecommendations = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.filter(r => r.FIPS === selectedCounty.FIPS);
  }, [recommendations, selectedCounty.FIPS]);

  // Get county insights
  const countyInsights = useMemo(() => {
    if (!insights) return [];
    const found = insights.find(i => i.FIPS === selectedCounty.FIPS);
    return found ? found.insights : [];
  }, [insights, selectedCounty.FIPS]);

  // Performance indicators
  const getPerformanceIndicator = (value, type = 'score') => {
    let threshold, icon, color;
    
    switch (type) {
      case 'score':
        if (value >= 80) { threshold = 'Excellent'; icon = ArrowUp; color = 'text-green-400'; }
        else if (value >= 60) { threshold = 'Good'; icon = ArrowUp; color = 'text-neon-blue'; }
        else if (value >= 40) { threshold = 'Fair'; icon = Minus; color = 'text-yellow-400'; }
        else { threshold = 'Poor'; icon = ArrowDown; color = 'text-red-400'; }
        break;
      case 'percentile':
        if (value >= 80) { threshold = 'Top 20%'; icon = Award; color = 'text-green-400'; }
        else if (value >= 60) { threshold = 'Above Average'; icon = ArrowUp; color = 'text-neon-blue'; }
        else if (value >= 40) { threshold = 'Average'; icon = Minus; color = 'text-yellow-400'; }
        else { threshold = 'Below Average'; icon = ArrowDown; color = 'text-red-400'; }
        break;
    }
    
    return { threshold, icon, color };
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'comparison', name: 'Peer Analysis', icon: BarChart3 },
    { id: 'recommendations', name: 'Policy Insights', icon: Target },
    { id: 'projections', name: 'Future Scenarios', icon: TrendingUp },
    { id: 'deep_dive', name: 'Deep Insights', icon: Info }
  ];

  const metrics = [
    { key: 'Healthcare_Access', name: 'Healthcare Access', icon: Shield, suffix: '/100', color: 'neon-blue' },
    { key: 'Opportunity_Score', name: 'Opportunity', icon: Target, suffix: '/100', color: 'neon-pink' },
    { key: 'Vulnerability_Index', name: 'Vulnerability', icon: AlertTriangle, suffix: '/100', color: 'red-400' },
    { key: 'Resilience_Score', name: 'Resilience', icon: Award, suffix: '/100', color: 'green-400' },
    { key: 'Insurance_Rate', name: 'Insurance Rate', icon: Shield, suffix: '%', color: 'blue-400' },
    { key: 'Poverty_Rate', name: 'Poverty Rate', icon: TrendingDown, suffix: '%', color: 'orange-400' },
    { key: 'Education_Rate', name: 'Education Rate', icon: GraduationCap, suffix: '%', color: 'purple-400' },
    { key: 'Population', name: 'Population', icon: Users, suffix: '', color: 'gray-400', format: 'number' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="absolute top-4 right-4 z-50 w-[480px] max-h-[calc(100vh-2rem)] overflow-hidden"
    >
      <div className="glass-dark rounded-2xl border border-neon-pink/30 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-cyber font-bold text-white mb-1">
                {selectedCounty.County}, {selectedCounty.State}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{selectedCounty.Cluster_Name_Detailed}</span>
                <span>•</span>
                <span>{selectedCounty.Population.toLocaleString()} people</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Score highlight */}
          <div className="mt-4 flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {selectedCounty.Healthcare_Access.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">Healthcare Score</div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue"
                  style={{ width: `${selectedCounty.Healthcare_Access}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedCounty.Healthcare_Access}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>National Rank: #{Math.round(selectedCounty.Healthcare_Access_Percentile || 50)}</span>
                <span>{getPerformanceIndicator(selectedCounty.Healthcare_Access).threshold}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-1 bg-black/30 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-neon-pink text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                <span className="hidden lg:block">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Key metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  {metrics.slice(0, 8).map((metric) => {
                    const value = selectedCounty[metric.key];
                    const displayValue = metric.format === 'number' ? 
                      value.toLocaleString() : 
                      value.toFixed(1);
                    const indicator = getPerformanceIndicator(value, 
                      metric.key.includes('Percentile') ? 'percentile' : 'score');

                    return (
                      <div key={metric.key} className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <metric.icon className={`w-4 h-4 text-${metric.color}`} />
                          <span className="text-xs font-medium text-gray-300">{metric.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-white">
                            {displayValue}{metric.suffix}
                          </span>
                          <div className={`flex items-center gap-1 ${indicator.color}`}>
                            <indicator.icon className="w-3 h-3" />
                            <span className="text-xs">{indicator.threshold}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Key insights */}
                {countyInsights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-white text-sm">Key Insights</h4>
                    {countyInsights.map((insight, idx) => (
                      <div key={idx} className="bg-gray-800/30 rounded-lg p-3 border-l-2 border-neon-blue">
                        <p className="text-sm text-gray-300">{insight.text}</p>
                        {insight.importance === 'high' && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-orange-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span>High Priority</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'comparison' && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h4 className="font-medium text-white text-sm mb-3">
                  Peer Comparison ({selectedCounty.Cluster_Name_Detailed})
                </h4>
                
                {/* Cluster performance */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Cluster Ranking</span>
                    <span className="text-lg font-bold text-neon-blue">
                      #{selectedCounty.rank_in_cluster} / {selectedCounty.total_in_cluster}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>vs. cluster avg:</span>
                    <span className={selectedCounty.performance_vs_cluster > 0 ? 'text-green-400' : 'text-red-400'}>
                      {selectedCounty.performance_vs_cluster > 0 ? '+' : ''}{selectedCounty.performance_vs_cluster.toFixed(1)} points
                    </span>
                  </div>
                </div>

                {/* Similar counties */}
                {similarCounties.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-300">Similar Counties</h5>
                    {similarCounties.map((county) => (
                      <div key={county.FIPS} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white text-sm">
                            {county.County}, {county.State}
                          </span>
                          <span className="font-mono text-sm text-neon-blue">
                            {county.Healthcare_Access.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{county.Population.toLocaleString()} people</span>
                          <span className={
                            county.Healthcare_Access > selectedCounty.Healthcare_Access 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }>
                            {county.Healthcare_Access > selectedCounty.Healthcare_Access ? '+' : ''}
                            {(county.Healthcare_Access - selectedCounty.Healthcare_Access).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h4 className="font-medium text-white text-sm mb-3">Policy Recommendations</h4>
                
                {countyRecommendations.length > 0 ? (
                  countyRecommendations.map((rec, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-neon-blue" />
                          <span className="font-medium text-white text-sm">{rec.policy}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'High' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{rec.rationale}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400">Impact Score:</span>
                          <span className="ml-2 font-bold text-neon-green">
                            +{rec.impact_score.toFixed(1)} pts
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Annual Cost:</span>
                          <span className="ml-2 font-mono text-gray-300">
                            ${(rec.annual_cost / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No specific recommendations available</p>
                    <p className="text-xs mt-1">County performing within expected ranges</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'projections' && (
              <motion.div
                key="projections"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h4 className="font-medium text-white text-sm mb-3">5-Year Projections</h4>
                
                {/* Scenario cards */}
                {['status_quo', 'moderate_investment', 'aggressive_investment'].map((scenario) => {
                  const scenarioNames = {
                    status_quo: 'Status Quo',
                    moderate_investment: 'Moderate Investment',
                    aggressive_investment: 'Aggressive Investment'
                  };
                  
                  const colors = {
                    status_quo: 'text-gray-400',
                    moderate_investment: 'text-neon-blue',
                    aggressive_investment: 'text-neon-green'
                  };
                  
                  const projectionKey = `${scenario}_projection`;
                  const projectionData = projections?.find(p => p.FIPS === selectedCounty.FIPS);
                  const values = projectionData?.[projectionKey] || [];
                  
                  if (!values.length) return null;
                  
                  const finalScore = values[values.length - 1];
                  const improvement = finalScore - values[0];

                  return (
                    <div key={scenario} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white text-sm">
                          {scenarioNames[scenario]}
                        </span>
                        <div className="text-right">
                          <div className={`font-bold ${colors[scenario]}`}>
                            {finalScore.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {improvement > 0 ? '+' : ''}{improvement.toFixed(1)} change
                          </div>
                        </div>
                      </div>
                      
                      {/* Mini chart */}
                      <div className="h-8 flex items-end gap-1 mt-3">
                        {values.map((value, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 bg-gradient-to-t from-${colors[scenario].split('-')[1]} to-transparent rounded-sm opacity-70`}
                            style={{ height: `${(value / 100) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'deep_dive' && (
              <motion.div
                key="deep_dive"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h4 className="font-medium text-white text-sm mb-3">Advanced Analytics</h4>
                
                {/* Percentile rankings */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white text-sm mb-3">National Rankings</h5>
                  <div className="space-y-3">
                    {[
                      { key: 'Healthcare_Access_Percentile', name: 'Healthcare Access', color: 'neon-blue' },
                      { key: 'Insurance_Rate_Percentile', name: 'Insurance Coverage', color: 'blue-400' },
                      { key: 'Education_Rate_Percentile', name: 'Education Level', color: 'purple-400' }
                    ].map((metric) => {
                      const percentile = selectedCounty[metric.key] || 50;
                      return (
                        <div key={metric.key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-${metric.color}`}
                                style={{ width: `${percentile}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono text-white min-w-[3rem] text-right">
                              {percentile.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk factors */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <h5 className="font-medium text-white text-sm mb-3">Risk Assessment</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">
                        {selectedCounty.Vulnerability_Index.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Vulnerability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {selectedCounty.Resilience_Score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Resilience</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailedAnalysis;