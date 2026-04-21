/**
 * File: useContext.js
 *
 * Purpose:
 * Demonstrates how useContext is used to manage
 * global state and share data across components
 * without prop drilling.
 *
 * Real Use Case:
 * - User authentication
 * - Logged-in user information
 * - Role-based access (Admin / User)
 * - Global app settings
 *
 * Example Scenario:
 * - User logs into application
 * - User data stored globally
 * - Any component can access user details
 *
 * Why useContext:
 * - Avoid prop drilling
 * - Centralized state management
 * - Clean and scalable architecture
 */

import React, { createContext, useContext, useState } from "react";

/**
 * Create Context
 * Used to share global data
 */
const AuthContext = createContext();

/**
 * Provider Component
 * Wraps entire app and provides global state
 */
export const AuthProvider = ({ children }) => {
  /**
   * Global user state
   */
  const [user, setUser] = useState(null);

  /**
   * Login function
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Logout function
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Shared values
   */
  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook
 * Cleaner way to access context
 *
 * Instead of:
 * useContext(AuthContext)
 *
 * Use:
 * useAuth()
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
