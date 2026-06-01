import { useState, useEffect } from 'react';
import { saveAuth, loadAuth, clearAuth as clearAuthStorage } from '../services/storage';
import { loginUser, registerUser, logoutUser } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = loadAuth();
    if (!stored) return null;
    return {
      username: stored.username || stored.name,
      name: stored.name || stored.username,
      email: stored.email,
      role: stored.role || 'customer',
      isAuthenticated: true,
    };
  });

  useEffect(() => {
    if (user) {
      const stored = loadAuth();
      if (stored) saveAuth({ ...stored, ...user });
    } else {
      clearAuthStorage();
    }
  }, [user]);

  const login = async (userDataOrEmail, password) => {
    // Support both object (legacy) and email+password
    if (typeof userDataOrEmail === 'object' && !password) {
      const actualUser = userDataOrEmail.user || userDataOrEmail;
      const userData = {
        username: actualUser.username || actualUser.name || actualUser.email?.split('@')[0],
        name: actualUser.name || actualUser.username || actualUser.email?.split('@')[0],
        email: actualUser.email,
        role: actualUser.role || 'customer',
        isAuthenticated: true,
      };
      setUser(userData);
      saveAuth({ ...userData, accessToken: userDataOrEmail.accessToken, refreshToken: userDataOrEmail.refreshToken });
      return true;
    }

    // Real API login
    try {
      const result = await loginUser(userDataOrEmail, password);
      const userData = {
        username: result.user?.name || result.user?.email?.split('@')[0],
        name: result.user?.name || result.user?.email?.split('@')[0],
        email: result.user?.email,
        role: result.user?.role || 'customer',
        isAuthenticated: true,
      };
      setUser(userData);
      saveAuth({
        ...userData,
        name: result.user?.name || userData.username,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      return true;
    } catch (err) {
      console.error('Login failed:', err.message);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      await registerUser(name, email, password);
      return await login(email, password);
    } catch (err) {
      console.error('Register failed:', err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const stored = loadAuth();
      if (stored?.refreshToken) {
        await logoutUser(stored.refreshToken);
      }
    } catch {
      // ignore logout errors
    }
    setUser(null);
    clearAuthStorage();
  };

  const updateUser = (updatedUserData) => {
    const stored = loadAuth();
    const newUserData = {
      username: updatedUserData.name || updatedUserData.username,
      name: updatedUserData.name || updatedUserData.username,
      email: updatedUserData.email,
      role: updatedUserData.role || user?.role || 'customer',
      isAuthenticated: true,
    };
    setUser(newUserData);
    if (stored) {
      saveAuth({
        ...stored,
        ...newUserData,
      });
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };
}
