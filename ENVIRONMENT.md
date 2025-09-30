# Environment Configuration

This document explains how to configure and use environment variables in the CRM Frontend application.

## Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your specific values:
   ```bash
   nano .env
   ```

## Environment Variables

### API Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:9005` | Yes |
| `VITE_API_TIMEOUT` | API request timeout in milliseconds | `10000` | No |

### Authentication

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_TOKEN_KEY` | Local storage key for access token | `accessToken` | No |
| `VITE_REFRESH_TOKEN_KEY` | Local storage key for refresh token | `refreshToken` | No |

### Application Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_APP_NAME` | Application name | `CRM System` | No |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No |
| `VITE_APP_ENVIRONMENT` | Environment (development/production) | `development` | No |

### Feature Flags

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_ENABLE_LOGGING` | Enable console logging | `true` | No |
| `VITE_ENABLE_DEBUG_MODE` | Enable debug mode | `true` | No |

### UI Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_DEFAULT_PAGE_SIZE` | Default items per page | `10` | No |
| `VITE_MAX_PAGE_SIZE` | Maximum items per page | `100` | No |

### Development Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_DEV_SERVER_PORT` | Development server port | `5173` | No |

## Usage in Code

### Centralized Configuration

The application uses a centralized configuration system located at `src/config/environment.js`. This file imports and validates all environment variables.

```javascript
import config from '../config/environment';

// Access API configuration
const apiUrl = config.api.baseURL;
const timeout = config.api.timeout;

// Access authentication settings
const tokenKey = config.auth.tokenKey;
```

### Direct Environment Variable Access

You can also access environment variables directly using Vite's `import.meta.env`:

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDevelopment = import.meta.env.DEV;
```

## Environment-Specific Files

You can create environment-specific files for different deployment environments:

- `.env.local` - Local overrides (ignored by git)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Test environment

## Security Notes

1. **Never commit `.env` files** - They are automatically ignored by git
2. **Use `.env.example`** as a template for team members
3. **Only use `VITE_` prefixed variables** in frontend code
4. **Sensitive data** should be handled on the backend, not in frontend environment variables

## Development vs Production

### Development
```bash
VITE_API_BASE_URL=http://localhost:9005
VITE_APP_ENVIRONMENT=development
VITE_ENABLE_DEBUG_MODE=true
```

### Production
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_DEBUG_MODE=false
```

## Troubleshooting

1. **Environment variables not loading**: Make sure they start with `VITE_`
2. **Build issues**: Restart the development server after changing `.env` files
3. **API calls failing**: Check that `VITE_API_BASE_URL` is correctly set

## Example Configuration Files

### Development (.env.development)
```bash
VITE_API_BASE_URL=http://localhost:9005
VITE_APP_ENVIRONMENT=development
VITE_ENABLE_LOGGING=true
VITE_ENABLE_DEBUG_MODE=true
```

### Production (.env.production)
```bash
VITE_API_BASE_URL=https://api.crm.yourdomain.com
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_LOGGING=false
VITE_ENABLE_DEBUG_MODE=false
VITE_DEFAULT_PAGE_SIZE=25
```
