import config from "../config/environment";

export function saveTokens(accessToken, refreshToken) {
    localStorage.setItem(config.auth.tokenKey, accessToken);
    localStorage.setItem(config.auth.refreshTokenKey, refreshToken);
  }
  export function saveUser(userDetails) {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }

  export function getAccessToken() {
    return localStorage.getItem(config.auth.tokenKey);
  }
  
  export function getRefreshToken() {
    return localStorage.getItem(config.auth.refreshTokenKey);
  }
  
  export function clearTokens() {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    localStorage.removeItem("userDetails");
  }

  export function getUser() {
    const userDetails = localStorage.getItem("userDetails");
    return userDetails ? JSON.parse(userDetails) : null;
  }

  export function isLoggedIn() {
    const token = getAccessToken();
    return !!token;
  }
  