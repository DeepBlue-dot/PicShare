// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const URL = "http://127.0.0.1:8080";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = Cookies.get("jwt"); 
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${URL}/api/users/me`, {
          withCredentials: true, // Send cookies
        });

        if (response.data) {
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        handleAuthError(error, "Session verification failed:");
        Cookies.remove("jwt"); 
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const handleAuthError = (error, context = "") => {
    const message = error.response?.data?.message || error.message;
    setError(`${context} ${message}`);
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${URL}/api/auth/login`,
        credentials,
        { withCredentials: true } // Enable cookies
      );

      // Backend sets 'jwt' cookie, user data is in response
      setUser(response.data.data.user); // Adjusted path
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      handleAuthError(error, "Login failed:");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.get(
        `${URL}/api/auth/logout`,
        {},
        { withCredentials: true } // Send cookies to invalidate session
      );
    } finally {
      Cookies.remove("jwt"); // Clear 'jwt' cookie
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await axios.post(`${URL}/api/users`, credentials);

      setError(null);
      return response.data; // Return success data to UI
    } catch (error) {
      handleAuthError(error, "Signup failed:");
      throw error; // Propagate error to UI
    }
  };

  // New: Send reset instructions to the user's email
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${URL}/api/auth/resetPassword`, {
        email,
      });
      setError(null);
      return response.data;
    } catch (error) {
      handleAuthError(error, "Forgot password failed:");
      throw error;
    }
  };

  // New: Reset password using the token and new password provided by the user
  const resetPassword = async (data, token) => {
    try {
      const response = await axios.post(`${URL}/api/auth/resetPassword/${token}`, data);
      // Optionally, if the reset password endpoint logs the user in:
      if (response.data.data && response.data.data.user) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      }
      setError(null);
      return response.data;
    } catch (error) {
      handleAuthError(error, "Reset password failed:");
      throw error;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    signup,
    resetPassword,
    forgotPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
