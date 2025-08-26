// Fallback data structure for basic functionality
export const fallbackCountyData = [
  {
    FIPS: "06037",
    County: "Los Angeles",
    State: "California",
    Region: "West",
    Population: 10039107,
    Median_Income: 70000,
    Healthcare_Access: 68.4,
    Insurance_Rate: 89.1,
    Education_Rate: 32.1,
    Poverty_Rate: 14.3,
    No_Vehicle_Rate: 8.2,
    Disability_Rate: 9.8,
    Broadband_Rate: 85.4,
    LEP_Rate: 23.1,
    Healthcare_Access_Percentile: 65,
    Insurance_Rate_Percentile: 85,
    Education_Rate_Percentile: 45,
    Opportunity_Score: 75.2,
    Vulnerability_Index: 35.6,
    Resilience_Score: 72.3,
    Cluster_5: 2,
    Cluster_7: 3,
    Cluster_10: 4,
    Cluster_Name_Detailed: "Urban Challenges",
    Cluster_Description: "Dense cities with mixed outcomes, high inequality",
    rank_in_cluster: 15,
    total_in_cluster: 45,
    performance_vs_cluster: 2.1,
    cluster_avg_score: 66.3,
    lat: 34.0522,
    lng: -118.2437
  },
  {
    FIPS: "48201",
    County: "Harris",
    State: "Texas",
    Region: "Southeast",
    Population: 4713325,
    Median_Income: 64000,
    Healthcare_Access: 72.1,
    Insurance_Rate: 68.4,
    Education_Rate: 29.8,
    Poverty_Rate: 16.2,
    No_Vehicle_Rate: 6.8,
    Disability_Rate: 11.2,
    Broadband_Rate: 78.9,
    LEP_Rate: 19.4,
    Healthcare_Access_Percentile: 72,
    Insurance_Rate_Percentile: 58,
    Education_Rate_Percentile: 42,
    Opportunity_Score: 68.9,
    Vulnerability_Index: 42.1,
    Resilience_Score: 65.7,
    Cluster_5: 2,
    Cluster_7: 3,
    Cluster_10: 4,
    Cluster_Name_Detailed: "Urban Challenges",
    Cluster_Description: "Dense cities with mixed outcomes, high inequality",
    rank_in_cluster: 22,
    total_in_cluster: 45,
    performance_vs_cluster: 5.8,
    cluster_avg_score: 66.3,
    lat: 29.7604,
    lng: -95.3698
  }
];

export const fallbackColorScales = {
  healthcare_access: {
    name: 'Healthcare Access Score',
    colors: ['#1a0000', '#ff0000', '#ff7700', '#ffff00', '#00ff00'],
    domain: [0, 25, 50, 75, 100],
    labels: ['Critical', 'Poor', 'Fair', 'Good', 'Excellent']
  },
  opportunity: {
    name: 'Improvement Opportunity',
    colors: ['#000033', '#0066cc', '#00ccff', '#66ffcc'],
    domain: [0, 30, 70, 100],
    labels: ['Limited', 'Moderate', 'High', 'Exceptional']
  },
  vulnerability: {
    name: 'Vulnerability Index',
    colors: ['#000', '#660000', '#cc0000', '#ff6666'],
    domain: [0, 25, 50, 100],
    labels: ['Low', 'Moderate', 'High', 'Critical']
  },
  population: {
    name: 'Population Size',
    colors: ['#f0f0f0', '#969696', '#525252', '#252525'],
    domain: [0, 100000, 1000000, 5000000],
    labels: ['Small', 'Medium', 'Large', 'Major']
  }
};

export default { fallbackCountyData, fallbackColorScales };