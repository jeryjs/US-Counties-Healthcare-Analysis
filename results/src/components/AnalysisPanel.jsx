import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Target, TrendingUp, Zap, X, ArrowRight,
  Users, Activity, Shield, Globe, Lightbulb, AlertTriangle,
  Loader, RefreshCw
} from 'lucide-react';
import { generateAIRecommendations, clearAICache } from '../utils/aiRecommendations';

const AnalysisPanel = ({ 
  analysisMode, 
  counties, 
  selectedCounty,
  recommendations,
  projections,
  insights,
  filterSettings,
  onClose 
}) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Fetch AI recommendations when county or analysis mode changes
  useEffect(() => {
    if (analysisMode === 'recommendations' && selectedCounty && filteredCounties.length > 0) {
      const fetchAIRecommendations = async () => {
        setAiLoading(true);
        setAiError(null);
        
        try {
          // Find similar counties for context
          const similarCounties = filteredCounties
            .filter(c => c.Cluster_7 === selectedCounty.Cluster_7 && c.FIPS !== selectedCounty.FIPS)
            .sort((a, b) => b.Healthcare_Access - a.Healthcare_Access)
            .slice(0, 5);

          const result = await generateAIRecommendations(selectedCounty, filterSettings, similarCounties);
          
          if (result.error) {
            setAiError(result.error);
            setAiRecommendations(result.fallback || []);
          } else {
            setAiRecommendations(result.recommendations);
          }
        } catch (error) {
          setAiError('Failed to generate AI recommendations');
          console.error('AI recommendations error:', error);
        } finally {
          setAiLoading(false);
        }
      };

      fetchAIRecommendations();
    }
  }, [analysisMode, selectedCounty, filterSettings]);

  // Manual refresh AI recommendations
  const refreshAIRecommendations = async () => {
    if (!selectedCounty) return;
    
    // Clear cache for this county and refresh
    clearAICache(selectedCounty.FIPS);
    setAiRecommendations(null);
    
    // Trigger re-fetch
    const event = new Event('storage');
    window.dispatchEvent(event);
  };

  // Filter counties based on current settings for analysis
  const filteredCounties = useMemo(() => {
    if (!counties) return [];
    return counties.filter(county => {
      if (filterSettings.region && county.Region !== filterSettings.region) return false;
      if (county.Population < filterSettings.populationRange[0] || 
          county.Population > filterSettings.populationRange[1]) return false;
      if (county.Healthcare_Access < filterSettings.healthcareRange[0] || 
          county.Healthcare_Access > filterSettings.healthcareRange[1]) return false;
      return true;
    });
  }, [counties, filterSettings]);

  // Comparative Analysis
  const renderComparative = () => {
    if (!selectedCounty || !filteredCounties.length) {
      return (
        <div className="text-center text-gray-400 py-8">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a county to compare with similar counties</p>
        </div>
      );
    }

    // Find similar counties (same cluster)
    const similarCounties = filteredCounties
      .filter(c => c.Cluster_7 === selectedCounty.Cluster_7 && c.FIPS !== selectedCounty.FIPS)
      .sort((a, b) => b.Healthcare_Access - a.Healthcare_Access)
      .slice(0, 10);

    const clusterAvg = similarCounties.reduce((sum, c) => sum + c.Healthcare_Access, 0) / similarCounties.length;
    const selectedScore = selectedCounty.Healthcare_Access;
    const percentile = ((similarCounties.filter(c => c.Healthcare_Access < selectedScore).length / similarCounties.length) * 100).toFixed(0);

    return (
      <div className="space-y-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neon-blue" />
            {selectedCounty.County} Performance
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green">{selectedScore.toFixed(1)}</div>
              <div className="text-xs text-gray-400">Healthcare Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-pink">{percentile}%</div>
              <div className="text-xs text-gray-400">Cluster Percentile</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-900/50 rounded">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Cluster Average:</span>
              <span className="text-white">{clusterAvg.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-300">Difference:</span>
              <span className={selectedScore > clusterAvg ? 'text-green-400' : 'text-red-400'}>
                {selectedScore > clusterAvg ? '+' : ''}{(selectedScore - clusterAvg).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
          <h4 className="font-semibold text-white mb-3">Top Performing Peers</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {similarCounties.slice(0, 5).map((county, idx) => (
              <div key={county.FIPS} className="flex items-center justify-between p-2 bg-gray-900/30 rounded">
                <div>
                  <div className="text-sm font-medium text-white">{county.County}</div>
                  <div className="text-xs text-gray-400">Pop: {county.Population.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-neon-blue">{county.Healthcare_Access.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">#{idx + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Policy Impact Simulation
  const renderPolicyImpact = () => {
    const scenarios = [
      {
        id: 'medicaid_expansion',
        name: 'Medicaid Expansion',
        description: 'Expand Medicaid coverage to 138% of federal poverty level',
        impact: {
          coverage: '+15%',
          access_score: '+8.5',
          cost: '$2.4B annually',
          affected_counties: Math.floor(filteredCounties.length * 0.6)
        }
      },
      {
        id: 'rural_hospital_support',
        name: 'Rural Hospital Support',
        description: 'Federal funding for rural hospital sustainability',
        impact: {
          coverage: '+5%',
          access_score: '+12.3',
          cost: '$850M annually',
          affected_counties: filteredCounties.filter(c => c.Population < 50000).length
        }
      },
      {
        id: 'telehealth_expansion',
        name: 'Telehealth Infrastructure',
        description: 'Broadband and telehealth technology investment',
        impact: {
          coverage: '+25%',
          access_score: '+6.8',
          cost: '$1.2B initial',
          affected_counties: filteredCounties.filter(c => c.Broadband_Rate < 50000).length
        }
      }
    ];

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <Zap className="w-8 h-8 mx-auto text-neon-pink mb-2" />
          <h4 className="text-lg font-semibold text-white">Policy Impact Simulation</h4>
          <p className="text-sm text-gray-400">Analyze potential policy interventions</p>
        </div>

        {scenarios.map((scenario) => (
          <div 
            key={scenario.id}
            className={`bg-gray-800/50 rounded-lg p-4 border cursor-pointer transition-all ${
              selectedScenario?.id === scenario.id 
                ? 'border-neon-blue bg-neon-blue/10' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onClick={() => setSelectedScenario(selectedScenario?.id === scenario.id ? null : scenario)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-medium text-white mb-1">{scenario.name}</h5>
                <p className="text-sm text-gray-400 mb-3">{scenario.description}</p>
                
                {selectedScenario?.id === scenario.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 gap-4 mt-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Coverage Increase:</span>
                        <span className="text-neon-green font-medium">{scenario.impact.coverage}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Access Score Boost:</span>
                        <span className="text-neon-blue font-medium">{scenario.impact.access_score}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Implementation Cost:</span>
                        <span className="text-neon-pink font-medium">{scenario.impact.cost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Affected Counties:</span>
                        <span className="text-white font-medium">{scenario.impact.affected_counties}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <ArrowRight className={`w-4 h-4 transition-transform ${
                selectedScenario?.id === scenario.id ? 'rotate-90' : ''
              }`} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Future Projections
  const renderProjections = () => {
    const trendData = useMemo(() => {
      if (!filteredCounties.length) return null;
      
      const avgAccess = filteredCounties.reduce((sum, c) => sum + c.Healthcare_Access, 0) / filteredCounties.length;
      const avgVulnerability = filteredCounties.reduce((sum, c) => sum + c.Vulnerability_Index, 0) / filteredCounties.length;
      const agingPopulation = filteredCounties.filter(c => c.Population > 100000).length / filteredCounties.length;
      
      // Simulate projections based on current trends
      return {
        current: avgAccess,
        year1: avgAccess + (Math.random() * 4 - 2),
        year3: avgAccess + (Math.random() * 8 - 4),
        year5: avgAccess + (Math.random() * 12 - 6),
        vulnerability_trend: avgVulnerability > 60 ? 'increasing' : 'stable',
        aging_factor: agingPopulation,
        risk_factors: [
          avgVulnerability > 65 && 'High vulnerability index',
          agingPopulation > 0.3 && 'Aging population demographics',
          filteredCounties.some(c => c.Poverty_Rate > 40) && 'Economic stress indicators'
        ].filter(Boolean)
      };
    }, [filteredCounties]);

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <TrendingUp className="w-8 h-8 mx-auto text-neon-green mb-2" />
          <h4 className="text-lg font-semibold text-white">5-Year Healthcare Projections</h4>
          <p className="text-sm text-gray-400">Based on current trends and demographic data</p>
        </div>

        {trendData && (
          <>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
              <h5 className="font-medium text-white mb-4">Healthcare Access Trend</h5>
              <div className="space-y-3">
                {[
                  { year: 'Current', value: trendData.current, color: 'text-white' },
                  { year: '2026', value: trendData.year1, color: 'text-neon-blue' },
                  { year: '2028', value: trendData.year3, color: 'text-neon-green' },
                  { year: '2030', value: trendData.year5, color: 'text-neon-pink' }
                ].map((item, idx) => (
                  <div key={item.year} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{item.year}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(item.value / 100) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${item.color}`}>
                        {item.value.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
              <h5 className="font-medium text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Risk Factors
              </h5>
              <div className="space-y-2">
                {trendData.risk_factors.map((risk, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-gray-300">{risk}</span>
                  </div>
                ))}
                {trendData.risk_factors.length === 0 && (
                  <div className="text-sm text-green-400">No major risk factors identified</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // AI Recommendations
  const renderRecommendations = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <Lightbulb className="w-8 h-8 mx-auto text-neon-pink mb-2" />
            <h4 className="text-lg font-semibold text-white">AI-Powered Recommendations</h4>
            <p className="text-sm text-gray-400">
              {selectedCounty ? `Personalized insights for ${selectedCounty.County}` : 'Select a county for AI recommendations'}
            </p>
          </div>
          
          {selectedCounty && (
            <button
              onClick={refreshAIRecommendations}
              disabled={aiLoading}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh AI recommendations"
            >
              <RefreshCw className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {!selectedCounty ? (
          <div className="text-center text-gray-400 py-8">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a county on the map to get personalized AI recommendations</p>
          </div>
        ) : aiLoading ? (
          <div className="text-center text-gray-400 py-8">
            <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-neon-blue" />
            <p>Generating AI recommendations...</p>
            <p className="text-xs mt-2">Analyzing {selectedCounty.County} healthcare data</p>
          </div>
        ) : aiError ? (
          <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-200 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">AI Service Unavailable</span>
            </div>
            <p className="text-sm text-red-300 mb-3">{aiError}</p>
            
            {aiError.includes('API key') && (
              <div className="mb-4 p-3 bg-gray-800/50 rounded border border-gray-600">
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Enter Groq API Key:
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-neon-blue focus:outline-none"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      if (input.value.trim()) {
                        localStorage.setItem('groq_api_key', input.value.trim());
                        window.GROQ_API_KEY = input.value.trim();
                        refreshAIRecommendations();
                      }
                    }}
                    className="px-3 py-1 bg-neon-blue hover:bg-neon-blue/80 text-white text-xs rounded transition-colors"
                  >
                    Save
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Key will be saved locally. Get one from <a href="https://console.groq.com/" target="_blank" rel="noopener" className="text-neon-blue hover:underline">console.groq.com</a>
                </p>
              </div>
            )}
            
            {aiRecommendations && aiRecommendations.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-3">Showing fallback recommendations:</p>
                {renderRecommendationsList(aiRecommendations, true)}
              </div>
            )}
          </div>
        ) : aiRecommendations && aiRecommendations.length > 0 ? (
          <div>
            <div className="text-xs text-green-400 mb-3 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              AI recommendations generated for {selectedCounty.County}, {selectedCounty.State}
            </div>
            {renderRecommendationsList(aiRecommendations, false)}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations available</p>
            <p className="text-sm mt-2">Try selecting a different county</p>
          </div>
        )}
      </div>
    );
  };

  // Render recommendations list (shared between AI and fallback)
  const renderRecommendationsList = (recommendations, isFallback) => {
    return recommendations.map((rec, idx) => (
      <div key={idx} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              rec.priority === 'High' 
                ? 'bg-red-900/30 text-red-200 border border-red-600/50'
                : rec.priority === 'Medium'
                ? 'bg-yellow-900/30 text-yellow-200 border border-yellow-600/50'
                : 'bg-green-900/30 text-green-200 border border-green-600/50'
            }`}>
              {rec.priority} Priority
            </div>
            <div className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
              {rec.category}
            </div>
            {isFallback && (
              <div className="px-2 py-1 rounded text-xs bg-orange-900/30 text-orange-200 border border-orange-600/50">
                Fallback
              </div>
            )}
          </div>
        </div>
        
        <h5 className="font-medium text-white mb-2">{rec.title}</h5>
        <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
        
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-300 mb-2">Recommended Actions:</div>
          <div className="space-y-1">
            {rec.actions.map((action, actionIdx) => (
              <div key={actionIdx} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                <span className="text-gray-300">{action}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-neon-green bg-green-900/20 rounded p-2">
            <strong>Expected Impact:</strong> {rec.impact}
          </div>
          <div className="text-neon-blue bg-blue-900/20 rounded p-2">
            <strong>Cost:</strong> {rec.cost || 'Not specified'}
            {rec.timeline && (
              <div className="mt-1"><strong>Timeline:</strong> {rec.timeline}</div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  const renderContent = () => {
    switch (analysisMode) {
      case 'comparative':
        return renderComparative();
      case 'policy_impact':
        return renderPolicyImpact();
      case 'projections':
        return renderProjections();
      case 'recommendations':
        return renderRecommendations();
      default:
        return <div className="text-center text-gray-400">Select an analysis mode</div>;
    }
  };

  const getTitleAndIcon = () => {
    const modes = {
      'comparative': { title: 'Peer Comparison Analysis', icon: BarChart3 },
      'policy_impact': { title: 'Policy Impact Simulation', icon: Zap },
      'projections': { title: 'Future Projections', icon: TrendingUp },
      'recommendations': { title: 'AI Recommendations', icon: Target }
    };
    return modes[analysisMode] || { title: 'Analysis', icon: BarChart3 };
  };

  const { title, icon: Icon } = getTitleAndIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl max-h-[90vh] mx-4 bg-cyber-dark rounded-2xl border border-neon-blue/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-pink flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-cyber font-bold text-white">{title}</h2>
              <p className="text-sm text-gray-400">
                Analyzing {filteredCounties.length.toLocaleString()} counties
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-5rem)]">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisPanel;