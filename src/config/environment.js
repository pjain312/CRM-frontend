/**
 * Environment Configuration
 * Centralized configuration for environment variables
 */

const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9005",
    timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  },

  // Authentication
  auth: {
    tokenKey: import.meta.env.VITE_TOKEN_KEY || "accessToken",
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || "refreshToken",
  },

  // Application Settings
  app: {
    name: import.meta.env.VITE_APP_NAME || "CRM System",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
    environment: import.meta.env.VITE_APP_ENVIRONMENT || "development",
  },

  // Feature Flags
  features: {
    enableLogging: import.meta.env.VITE_ENABLE_LOGGING === "true" || false,
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === "true" || false,
  },

  // UI Configuration
  ui: {
    defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
    maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,
  },

  // Development Settings
  dev: {
    serverPort: import.meta.env.VITE_DEV_SERVER_PORT || "5173",
  },
};

// Validation
const validateConfig = () => {
  const requiredEnvVars = [];
  
  if (!config.api.baseURL) {
    requiredEnvVars.push("VITE_API_BASE_URL");
  }

  if (requiredEnvVars.length > 0) {
    console.warn("Missing required environment variables:", requiredEnvVars);
  }

  if (config.features.enableDebugMode) {
    console.log("Environment configuration:", config);
  }
};

// Validate configuration on import
validateConfig();

export default config;
