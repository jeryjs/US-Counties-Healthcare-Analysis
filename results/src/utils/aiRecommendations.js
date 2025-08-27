// AI Recommendations with Groq Llama API
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get API key from runtime injection or environment
const getApiKey = () => {
  // Runtime injection for deployment (window.GROQ_API_KEY)
  // or environment variables for local development
  return window.GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY;
};

// Generate cache key based on county data dependencies
const generateCacheKey = (county, filterSettings) => {
  const dependencies = {
    fips: county.FIPS,
    healthcare: county.Healthcare_Access,
    vulnerability: county.Vulnerability_Index,
    opportunity: county.Opportunity_Score,
    population: county.Population,
    poverty: county.Poverty_Rate,
    disability: county.Disability_Rate,
    filters: {
      region: filterSettings.region,
      healthcareRange: filterSettings.healthcareRange,
      populationRange: filterSettings.populationRange
    }
  };
  return btoa(JSON.stringify(dependencies)).replace(/[^a-zA-Z0-9]/g, '');
};

// Cache management
const CACHE_KEY = 'ai_recommendations_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

const getCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
};

const setCache = (key, data) => {
  try {
    const cache = getCache();
    cache[key] = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Failed to cache AI recommendations:', e);
  }
};

const getCachedRecommendation = (key) => {
  const cache = getCache();
  const cached = cache[key];
  
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
    delete cache[key];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    return null;
  }
  
  return cached.data;
};

// Generate AI recommendations using Groq Llama
export const generateAIRecommendations = async (county, filterSettings, similarCounties = []) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      error: 'AI recommendations unavailable - API key not configured',
      fallback: getFallbackRecommendations(county)
    };
  }

  const cacheKey = generateCacheKey(county, filterSettings);
  const cached = getCachedRecommendation(cacheKey);
  
  if (cached) {
    return { recommendations: cached, cached: true };
  }

  try {
    // Prepare context for AI
    const context = {
      county: {
        name: county.County,
        state: county.State,
        population: county.Population,
        healthcare_score: county.Healthcare_Access,
        vulnerability_index: county.Vulnerability_Index,
        opportunity_score: county.Opportunity_Score,
        poverty_rate: county.Poverty_Rate,
        disability_rate: county.Disability_Rate,
        insurance_rate: county.Insurance_Rate * 100,
        cluster: county.Cluster_Name_Detailed
      },
      peers: similarCounties.slice(0, 3).map(c => ({
        name: c.County,
        score: c.Healthcare_Access,
        population: c.Population
      })),
      region: county.Region
    };

    const prompt = `You are a healthcare policy analyst. Analyze this county's healthcare situation and provide 3 specific, actionable recommendations.

County: ${context.county.name}, ${context.county.state}
Population: ${context.county.population.toLocaleString()}
Healthcare Access Score: ${context.county.healthcare_score.toFixed(1)}/100
Vulnerability Index: ${context.county.vulnerability_index.toFixed(1)}/100
Opportunity Score: ${context.county.opportunity_score.toFixed(1)}/100
Poverty Rate: ${context.county.poverty_rate.toFixed(1)}%
Disability Rate: ${context.county.disability_rate.toFixed(1)}%
Insurance Coverage: ${context.county.insurance_rate.toFixed(1)}%
County Type: ${context.county.cluster}

Top Peer Counties (same cluster):
${context.peers.map(p => `- ${p.name}: ${p.score.toFixed(1)} score, ${p.population.toLocaleString()} pop`).join('\n')}

Provide response as JSON array with 3 recommendations, each having:
{
  "priority": "High|Medium|Low",
  "category": "Infrastructure|Workforce|Access|Policy",
  "title": "Brief title",
  "description": "2-sentence problem description",
  "actions": ["action1", "action2", "action3"],
  "impact": "Expected outcome description",
  "cost": "Estimated cost range",
  "timeline": "Implementation timeframe"
}

Focus on specific, implementable solutions based on the county's actual needs and performance gaps. Use General Knowledge and Common sense to supplement your decisions.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: Math.random() > 0.5 ? 'llama-3.1-8b-instant' : 'meta-llama/llama-4-maverick-17b-128e-instruct',
        messages: [
          { role: 'system', content: 'You are a healthcare policy expert providing data-driven recommendations for US counties.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Empty AI response');
    }

    // Parse AI response
    let recommendations;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      recommendations = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch {
      // Fallback parsing if JSON is malformed
      recommendations = getFallbackRecommendations(county);
    }

    // Validate and cache
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      setCache(cacheKey, recommendations);
      return { recommendations, cached: false };
    } else {
      throw new Error('Invalid AI response format');
    }

  } catch (error) {
    console.warn('AI recommendations failed:', error);
    return {
      error: error.message,
      fallback: getFallbackRecommendations(county)
    };
  }
};

// Fallback recommendations when AI fails
const getFallbackRecommendations = (county) => {
  const recommendations = [];
  
  if (county.Healthcare_Access < 50) {
    recommendations.push({
      priority: 'High',
      category: 'Access',
      title: 'Improve Healthcare Access',
      description: `${county.County} has a healthcare access score of ${county.Healthcare_Access.toFixed(1)}, indicating significant access barriers. Immediate intervention is needed to address healthcare gaps.`,
      actions: [
        'Establish mobile health clinics',
        'Expand telehealth services',
        'Improve transportation to medical facilities'
      ],
      impact: 'Could improve access for thousands of residents',
      cost: '$2-5M annually',
      timeline: '12-18 months'
    });
  }

  if (county.Vulnerability_Index > 60) {
    recommendations.push({
      priority: 'High',
      category: 'Policy',
      title: 'Address Social Determinants',
      description: `High vulnerability index of ${county.Vulnerability_Index.toFixed(1)} indicates social barriers to health. Comprehensive approach needed to address underlying issues.`,
      actions: [
        'Expand community health worker programs',
        'Improve health insurance enrollment',
        'Address transportation barriers'
      ],
      impact: 'Reduce health disparities and improve outcomes',
      cost: '$1-3M annually',
      timeline: '6-12 months'
    });
  }

  if (county.Opportunity_Score > 50) {
    recommendations.push({
      priority: 'Medium',
      category: 'Infrastructure',
      title: 'Leverage Improvement Opportunity',
      description: `Opportunity score of ${county.Opportunity_Score.toFixed(1)} suggests high potential for meaningful improvements. Strategic investments could yield significant returns.`,
      actions: [
        'Target specific improvement areas',
        'Implement evidence-based interventions',
        'Monitor progress with data-driven approaches'
      ],
      impact: 'Maximize return on healthcare investments',
      cost: '$500K-2M',
      timeline: '3-6 months'
    });
  }

  return recommendations.slice(0, 3);
};

// Clear cache function for manual cache management
export const clearAICache = () => {
  localStorage.removeItem(CACHE_KEY);
};