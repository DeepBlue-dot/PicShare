// src/context/AuthContext.js
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";

const URL = "http://localhost:8080";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("jwt");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const { data } = await axios.get(`${URL}/api/users/me`, {
        withCredentials: true,
      });

      if (data?.data?.user) {
        setUser(data.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      handleAuthError(error, "Session verification failed:");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth, isAuthenticated]);

  const handleAuthError = (error, context = "") => {
    const message = error.response?.data?.message || error.message;
    setError(`${context} ${message}`);
    if (error.response?.status === 401) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${URL}/api/auth/login`, credentials, {
        withCredentials: true,
      });
      setUser(data.data.user);
      setIsAuthenticated(true);
      setError(null);
      return data;
    } catch (error) {
      handleAuthError(error, "Login failed:");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${URL}/api/auth/logout`, { withCredentials: true });
    } finally {
      Cookies.remove("jwt");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  const signup = async (credentials) => {
    try {
      const { data } = await axios.post(`${URL}/api/users`, credentials);
      setError(null);
      return data;
    } catch (error) {
      handleAuthError(error, "Signup failed:");
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${URL}/api/auth/resetPassword`, {
        email,
      });
      setError(null);
      return response.data;
    } catch (error) {
      Cookies.remove("jwt");
      handleAuthError(error, "Forgot password failed:");
      throw error;
    }
  };

  const resetPassword = async (data, token) => {
    try {
      const response = await axios.post(`${URL}/api/auth/resetPassword/${token}`, data);
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

  const verifyAccount = useCallback(async (token) => {
    try {
      const response = await axios.get(`${URL}/api/auth/verify/${token}`, {
        withCredentials: true,
      });
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      setError(null);
      return response.data;
    } catch (error) {
      handleAuthError(error, "Account verification failed:");
      throw error;
    }
  }, []);

  const resendVerificationToken = async () => {
    try {
      const response = await axios.get(`${URL}/api/auth/verify`, {
        withCredentials: true,
      });
      setError(null);
      return response.data;
    } catch (error) {
      handleAuthError(error, "Resend verification failed:");
      throw error;
    }
  };

  const updateUser = async (updatedData) => {
    try {
      
      const response = await axios.patch(`${URL}/api/users/me`, updatedData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setUser(response.data.data.user);
      setError(null);
      return response.data;
    } catch (error) {
      handleAuthError(error, "Update user failed:");
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`${URL}/api/users/me`, {
        withCredentials: true,
      });
      // Remove auth state on successful deletion
      Cookies.remove("jwt");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      handleAuthError(error, "Delete account failed:");
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
    verifyAuth,
    resetPassword,
    verifyAccount,
    forgotPassword,
    resendVerificationToken,
    updateUser,
    deleteAccount,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="animate-spin inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        children
      )}
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
