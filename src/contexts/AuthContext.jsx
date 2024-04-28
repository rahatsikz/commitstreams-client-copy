import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, createContext } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  userProfile: null,
  setAuthState: () => { },
});
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/user`, {
          credentials: 'include'  // Crucial setting 
        });

        if (!response.ok) {
          throw new Error('Profile fetch failed');
        }

        const data = await response.json();
        setAuthState(data);
        navigate('/');
      } catch (error) {
        console.error('Error fetching profile:', error);
        clearAuthState();
        navigate('/', { replace: true });
      }
    };
    console.log('fetchUserProfile:');
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const setAuthState = (authData) => {
    setIsAuthenticated(true);
    setUserProfile(authData);
  };

  const clearAuthState = () => {
    console.log('clearAuthState');
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ isAuthenticated, userProfile, setAuthState, clearAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };