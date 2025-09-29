export function saveTokens(accessToken, refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
  export function saveUser(userDetails) {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }

  export function getAccessToken() {
    return localStorage.getItem("accessToken");
  }
  
  export function getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }
  
  export function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
  