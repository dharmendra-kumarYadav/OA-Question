import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');
      setIsAuthenticated(!!token);
      setRole(userRole);
    };

    // Check auth on mount
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom logout event
    window.addEventListener('logout', checkAuth);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', checkAuth);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('expiresInHours');
    setIsAuthenticated(false);
    setRole(null);
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new Event('logout'));
  };

  return { isAuthenticated, role, logout };
};

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Hook to handle automatic logout when session expires
export const useAutoLogout = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiresInHours = localStorage.getItem('expiresInHours');
    const expiresInMinutes = localStorage.getItem('expiresInMinutes');
    
    if (token && (expiresInHours || expiresInMinutes)) {
      // Check token expiration immediately
      if (isTokenExpired(token)) {
        handleSessionExpiration();
        return;
      }

      // Calculate expiration time in milliseconds
      let expirationTime;
      if (expiresInHours) {
        expirationTime = parseInt(expiresInHours) * 60 * 60 * 1000; // Convert hours to milliseconds
      } else {
        expirationTime = parseInt(expiresInMinutes) * 60 * 1000; // Convert minutes to milliseconds
      }
      
      const logoutTimer = setTimeout(() => {
        handleSessionExpiration();
      }, expirationTime);

      // Also check token validity periodically (every 30 seconds for short durations, 5 minutes for longer)
      const checkInterval = setInterval(() => {
        const currentToken = localStorage.getItem('token');
        if (currentToken && isTokenExpired(currentToken)) {
          handleSessionExpiration();
        }
      }, expiresInMinutes ? 30 * 1000 : 5 * 60 * 1000); // Check every 30 seconds for minutes, 5 minutes for hours

      return () => {
        clearTimeout(logoutTimer);
        clearInterval(checkInterval);
      };
    }
  }, []);

  const handleSessionExpiration = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('expiresInHours');
    localStorage.removeItem('expiresInMinutes');
    
    // Show notification
    if (window.toast) {
      window.toast.info('Session expired. Please login again.');
    }
    
    // Redirect to login immediately
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };
};
