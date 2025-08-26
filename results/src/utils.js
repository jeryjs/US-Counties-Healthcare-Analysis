// Utility functions for data processing and visualization

/**
 * Format large numbers with appropriate suffixes
 */
export const formatNumber = (num, precision = 1) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(precision)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(precision)}K`;
  }
  return num.toLocaleString();
};

/**
 * Calculate percentile rank of a value in an array
 */
export const calculatePercentile = (value, array) => {
  const sorted = [...array].sort((a, b) => a - b);
  const index = sorted.findIndex(val => val >= value);
  return ((index / sorted.length) * 100).toFixed(0);
};

/**
 * Interpolate between two colors
 */
export const interpolateColor = (color1, color2, factor) => {
  if (!color1 || !color2) return color1 || color2 || '#666666';
  
  const hex2rgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb2hex = (rgb) => {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
  };

  const c1 = hex2rgb(color1);
  const c2 = hex2rgb(color2);
  
  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));

  return rgb2hex({r, g, b});
};

/**
 * Get appropriate text color based on background brightness
 */
export const getContrastColor = (hexColor) => {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return brightness > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for scroll/resize events
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

/**
 * Generate gradient CSS string from color array
 */
export const createGradient = (colors, direction = 'to right') => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

/**
 * Calculate distance between two coordinates (rough approximation)
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Validate and sanitize data
 */
export const validateCountyData = (county) => {
  const required = ['FIPS', 'County', 'State', 'lat', 'lng', 'Healthcare_Access'];
  const missing = required.filter(field => !county.hasOwnProperty(field));
  
  if (missing.length > 0) {
    console.warn(`County data missing fields: ${missing.join(', ')}`, county);
    return false;
  }
  
  return true;
};

/**
 * Safe number formatting
 */
export const safeNumber = (value, defaultValue = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Generate analytics insights from county data
 */
export const generateInsights = (county, similarCounties = []) => {
  const insights = [];
  
  // Performance insight
  if (county.Healthcare_Access > 80) {
    insights.push({
      type: 'success',
      message: `${county.County} demonstrates excellent healthcare access with a score of ${county.Healthcare_Access.toFixed(1)}.`,
      priority: 'medium'
    });
  } else if (county.Healthcare_Access < 40) {
    insights.push({
      type: 'warning',
      message: `${county.County} shows critical healthcare access gaps requiring immediate attention.`,
      priority: 'high'
    });
  }
  
  // Opportunity insight
  if (county.Opportunity_Score > 75) {
    insights.push({
      type: 'opportunity',
      message: `High improvement potential identified. Strategic investments could significantly impact ${county.Population.toLocaleString()} residents.`,
      priority: 'high'
    });
  }
  
  // Comparison insight
  if (similarCounties.length > 0) {
    const avgScore = similarCounties.reduce((sum, c) => sum + c.Healthcare_Access, 0) / similarCounties.length;
    const difference = county.Healthcare_Access - avgScore;
    
    if (Math.abs(difference) > 5) {
      insights.push({
        type: difference > 0 ? 'success' : 'warning',
        message: `Performs ${Math.abs(difference).toFixed(1)} points ${difference > 0 ? 'above' : 'below'} similar counties.`,
        priority: 'medium'
      });
    }
  }
  
  return insights;
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, filename = 'county_data.csv') => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(field => `"${row[field] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Local storage utilities
 */
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('LocalStorage not available:', error);
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('LocalStorage read error:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('LocalStorage remove error:', error);
    }
  }
};

export default {
  formatNumber,
  calculatePercentile,
  interpolateColor,
  getContrastColor,
  debounce,
  throttle,
  createGradient,
  calculateDistance,
  generateId,
  validateCountyData,
  safeNumber,
  generateInsights,
  exportToCSV,
  storage
};