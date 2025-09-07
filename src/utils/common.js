/**
 * Converts a string to camelCase
 * @param {string} str - The string to convert
 * @returns {string} - The camelCase string
 */
const toCamelCase = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/[-_\s]+(.)?/g, (match, chr) => {
      return chr ? chr.toUpperCase() : '';
    })
    .replace(/^(.)/, (match) => match.toLowerCase());
};

/**
 * Recursively converts all keys in an object to camelCase
 * @param {any} obj - The object to convert
 * @returns {any} - The object with camelCase keys
 */
export const convertKeysToCamelCase = (obj) => {
  // Handle null, undefined, or non-objects
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }

  // Handle objects
  const convertedObj = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    
    // Recursively convert nested objects and arrays
    if (typeof value === 'object' && value !== null) {
      convertedObj[camelKey] = convertKeysToCamelCase(value);
    } else {
      convertedObj[camelKey] = value;
    }
  }
  
  return convertedObj;
};

/**
 * Converts an array of objects with keys to camelCase
 * @param {Array} array - Array of objects to convert
 * @returns {Array} - Array with camelCase keys
 */
export const convertArrayKeysToCamelCase = (array) => {
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }
  
  return array.map(obj => convertKeysToCamelCase(obj));
};

