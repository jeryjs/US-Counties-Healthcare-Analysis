// Sample county data - this would normally come from your Analysis.ipynb output
export const countyData = [
  {
    FIPS: "06037",
    County: "Los Angeles",
    State: "California",
    Healthcare_Access: 68.4,
    Insurance_Rate: 25.9,
    Education_Rate: 32.1,
    Poverty_Rate: 14.3,
    Median_Income: 70000,
    Population: 10039107,
    Cluster_Name: "Urban Diverse",
    lat: 34.0522,
    lng: -118.2437
  },
  {
    FIPS: "48201",
    County: "Harris",
    State: "Texas", 
    Healthcare_Access: 72.1,
    Insurance_Rate: 68.4,
    Education_Rate: 29.8,
    Poverty_Rate: 16.2,
    Median_Income: 64000,
    Population: 4713325,
    Cluster_Name: "Urban Diverse",
    lat: 29.7604,
    lng: -95.3698
  },
  {
    FIPS: "17031",
    County: "Cook",
    State: "Illinois",
    Healthcare_Access: 75.6,
    Insurance_Rate: 71.2,
    Education_Rate: 38.4,
    Poverty_Rate: 13.8,
    Median_Income: 68000,
    Population: 5150233,
    Cluster_Name: "Urban Diverse", 
    lat: 41.8781,
    lng: -87.6298
  },
  {
    FIPS: "36061",
    County: "New York",
    State: "New York",
    Healthcare_Access: 88.4,
    Insurance_Rate: 89.2,
    Education_Rate: 58.7,
    Poverty_Rate: 17.9,
    Median_Income: 104553,
    Population: 1694263,
    Cluster_Name: "Wealthy Metro",
    lat: 40.7128,
    lng: -74.0060
  },
  {
    FIPS: "04013",
    County: "Maricopa", 
    State: "Arizona",
    Healthcare_Access: 76.8,
    Insurance_Rate: 84.2,
    Education_Rate: 32.1,
    Poverty_Rate: 11.4,
    Median_Income: 72000,
    Population: 4485414,
    Cluster_Name: "Suburban Middle-Class",
    lat: 33.4484,
    lng: -112.0740
  },
  {
    FIPS: "53033",
    County: "King",
    State: "Washington", 
    Healthcare_Access: 87.4,
    Insurance_Rate: 91.3,
    Education_Rate: 52.1,
    Poverty_Rate: 8.9,
    Median_Income: 122148,
    Population: 2269675,
    Cluster_Name: "Wealthy Metro",
    lat: 47.6062,
    lng: -122.3321
  },
  {
    FIPS: "06059",
    County: "Orange",
    State: "California",
    Healthcare_Access: 90.2,
    Insurance_Rate: 88.7,
    Education_Rate: 49.3,
    Poverty_Rate: 9.2,
    Median_Income: 95000,
    Population: 3186989,
    Cluster_Name: "Wealthy Metro",
    lat: 33.7879,
    lng: -117.8531
  },
  {
    FIPS: "25025",
    County: "Suffolk",
    State: "Massachusetts",
    Healthcare_Access: 92.1,
    Insurance_Rate: 94.2,
    Education_Rate: 67.8,
    Poverty_Rate: 16.2,
    Median_Income: 89000,
    Population: 797936,
    Cluster_Name: "College Towns",
    lat: 42.3601,
    lng: -71.0589
  },
  {
    FIPS: "12086",
    County: "Miami-Dade",
    State: "Florida",
    Healthcare_Access: 74.2,
    Insurance_Rate: 72.1,
    Education_Rate: 31.4,
    Poverty_Rate: 15.8,
    Median_Income: 56000,
    Population: 2716940,
    Cluster_Name: "Urban Diverse",
    lat: 25.7617,
    lng: -80.1918
  },
  {
    FIPS: "13121", 
    County: "Fulton",
    State: "Georgia",
    Healthcare_Access: 82.3,
    Insurance_Rate: 83.1,
    Education_Rate: 48.9,
    Poverty_Rate: 16.1,
    Median_Income: 78000,
    Population: 1066710,
    Cluster_Name: "Wealthy Metro",
    lat: 33.7490,
    lng: -84.3880
  },
  // Rural counties with lower access
  {
    FIPS: "28011",
    County: "Bolivar",
    State: "Mississippi", 
    Healthcare_Access: 32.1,
    Insurance_Rate: 51.4,
    Education_Rate: 15.2,
    Poverty_Rate: 34.8,
    Median_Income: 33000,
    Population: 33233,
    Cluster_Name: "Rural Disadvantaged",
    lat: 33.8751,
    lng: -90.7223
  },
  {
    FIPS: "01087",
    County: "Macon", 
    State: "Alabama",
    Healthcare_Access: 28.7,
    Insurance_Rate: 47.2,
    Education_Rate: 12.8,
    Poverty_Rate: 37.2,
    Median_Income: 31000,
    Population: 18704,
    Cluster_Name: "Rural Disadvantaged",
    lat: 32.4043,
    lng: -85.7105
  },
  {
    FIPS: "22027",
    County: "Claiborne",
    State: "Louisiana",
    Healthcare_Access: 35.6,
    Insurance_Rate: 54.3,
    Education_Rate: 14.7,
    Poverty_Rate: 29.8,
    Median_Income: 38000,
    Population: 16456,
    Cluster_Name: "Rural Low-Income",
    lat: 32.8043,
    lng: -93.0332
  },
  {
    FIPS: "16001",
    County: "Ada",
    State: "Idaho",
    Healthcare_Access: 79.4,
    Insurance_Rate: 86.7,
    Education_Rate: 41.2,
    Poverty_Rate: 9.8,
    Median_Income: 75000,
    Population: 494967,
    Cluster_Name: "Suburban Middle-Class",
    lat: 43.6150,
    lng: -116.2023
  },
  {
    FIPS: "35001",
    County: "Bernalillo", 
    State: "New Mexico",
    Healthcare_Access: 69.8,
    Insurance_Rate: 82.1,
    Education_Rate: 34.6,
    Poverty_Rate: 16.7,
    Median_Income: 58000,
    Population: 679121,
    Cluster_Name: "Small Towns",
    lat: 35.0844,
    lng: -106.6506
  }
];

export const stateData = [
  {
    State: "California",
    Healthcare_Access: 78.2,
    Population: 39538223,
    County_Count: 58,
    avg_income: 85000
  },
  {
    State: "Texas", 
    Healthcare_Access: 71.4,
    Population: 29145505,
    County_Count: 254,
    avg_income: 64000
  },
  {
    State: "Florida",
    Healthcare_Access: 73.6,
    Population: 21538187,
    County_Count: 67,
    avg_income: 59000
  },
  {
    State: "New York",
    Healthcare_Access: 82.1,
    Population: 20201249,
    County_Count: 62,
    avg_income: 71000
  },
  {
    State: "Pennsylvania", 
    Healthcare_Access: 76.8,
    Population: 13002700,
    County_Count: 67,
    avg_income: 63000
  }
  // Add more states as needed
];

// Simulation functions
export const simulateInsuranceChange = (county, changePercent) => {
  const currentInsurance = county.Insurance_Rate;
  const newInsurance = Math.max(0, Math.min(100, currentInsurance * (1 + changePercent/100)));
  
  const newScore = 
    (newInsurance * 0.25) +
    (county.Education_Rate * 0.15) +
    ((county.Median_Income / 150000) * 100 * 0.15) +
    ((100 - county.Poverty_Rate) * 0.15) +
    (75 * 0.30); // Base factors
    
  return Math.max(0, Math.min(100, newScore));
};

export const simulatePovertyChange = (county, changePercent) => {
  const currentPoverty = county.Poverty_Rate;
  const newPoverty = Math.max(0, Math.min(50, currentPoverty * (1 + changePercent/100)));
  
  const newScore = 
    (county.Insurance_Rate * 0.25) +
    (county.Education_Rate * 0.15) +
    ((county.Median_Income / 150000) * 100 * 0.15) +
    ((100 - newPoverty) * 0.15) +
    (75 * 0.30); // Base factors
    
  return Math.max(0, Math.min(100, newScore));
};

export const simulateEducationChange = (county, changePercent) => {
  const currentEducation = county.Education_Rate;
  const newEducation = Math.max(0, Math.min(80, currentEducation * (1 + changePercent/100)));
  
  const newScore = 
    (county.Insurance_Rate * 0.25) +
    (newEducation * 0.15) +
    ((county.Median_Income / 150000) * 100 * 0.15) +
    ((100 - county.Poverty_Rate) * 0.15) +
    (75 * 0.30); // Base factors
    
  return Math.max(0, Math.min(100, newScore));
};

export const simulateIncomeChange = (county, changePercent) => {
  const currentIncome = county.Median_Income;
  const newIncome = Math.max(20000, currentIncome * (1 + changePercent/100));
  
  const newScore = 
    (county.Insurance_Rate * 0.25) +
    (county.Education_Rate * 0.15) +
    ((newIncome / 150000) * 100 * 0.15) +
    ((100 - county.Poverty_Rate) * 0.15) +
    (75 * 0.30); // Base factors
    
  return Math.max(0, Math.min(100, newScore));
};