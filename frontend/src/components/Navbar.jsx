import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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

// Function to handle session expiration
const handleSessionExpiration = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('expiresInHours');
  localStorage.removeItem('expiresInMinutes');
  
  toast.info('Session expired. Please login again.');
  
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [searchQuery, setSearchQuery] = useState('');
  const expiresInHours = localStorage.getItem('expiresInHours');
  const expiresInMinutes = localStorage.getItem('expiresInMinutes');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Check if token is expired
    if (token && isTokenExpired(token)) {
      handleSessionExpiration();
      return;
    }
    
    setLoggedIn(!!token);
    setRole(localStorage.getItem('role'));
  }, [location]);

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'role') {
        const currentToken = localStorage.getItem('token');
        if (!currentToken || isTokenExpired(currentToken)) {
          setLoggedIn(false);
          setRole(null);
          // Redirect to login if token is removed or expired
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else {
          setLoggedIn(!!currentToken);
          setRole(localStorage.getItem('role'));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('expiresInHours');
    toast.success('Logout successful!');
    setLoggedIn(false);
    setRole(null);
    window.location.reload()
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center z-50 shadow-lg">
      <div className="text-xl font-bold mb-2 sm:mb-0">
        <button 
          onClick={() => {
            if (location.pathname === '/') {
              window.location.reload();
            } else {
              navigate('/');
            }
          }}
          className="text-white hover:underline"
        >
          OA Questions
        </button>
      </div>

      {/* Search Bar */}
      {loggedIn && (
        <form onSubmit={handleSearch} className="flex mb-2 sm:mb-0">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-1 rounded text-white"
          />
          <button type="submit" className="ml-2 bg-gray-900 text-white px-5 py-1 rounded">
            Search
          </button>
        </form>
      )}

      <div className="space-x-4">
        {(role === 'ADMIN' || role === 'HEAD_ADMIN') && (
          <Link to="/add-question" className="hover:underline">Add Question</Link>
        )}
        {role === 'HEAD_ADMIN' && (
          <Link to="/add-admin" className="hover:underline">Add Admin</Link>
        )}
        {loggedIn ? (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
