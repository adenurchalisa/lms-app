// Authentication utility functions

/**
 * Get current user session from localStorage
 * @returns {Object|null} User session object or null if not found
 */
export const getSession = () => {
  try {
    const session = localStorage.getItem("credentials");
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Error parsing session:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid session
 */
export const isAuthenticated = () => {
  const session = getSession();
  return session && session.token;
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check ('teacher' or 'student')
 * @returns {boolean} True if user has the specified role
 */
export const hasRole = (role) => {
  const session = getSession();
  return session && session.role === role;
};

/**
 * Logout user by clearing credentials and redirecting to login
 */
export const logout = () => {
  localStorage.removeItem("credentials");
  window.location.href = "/login";
};

/**
 * Check if token is expired (basic check based on JWT expiry)
 * Note: This is a simple check, for production you might want to decode JWT
 * @returns {boolean} True if token appears to be expired
 */
export const isTokenExpired = () => {
  const session = getSession();
  if (!session || !session.token) return true;

  try {
    // Basic JWT decode to check expiry (without verification)
    const tokenParts = session.token.split(".");
    if (tokenParts.length !== 3) return true;

    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp && payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true;
  }
};
