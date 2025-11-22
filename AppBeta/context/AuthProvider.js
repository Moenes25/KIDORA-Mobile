import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children , navigation}) {
  const [user, setUser] = useState(null);
  const [loading] = useState(false);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res?.token) {
      await AsyncStorage.setItem('token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    if (res?.token) {
      await AsyncStorage.setItem('token', res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
     navigation.navigate("Login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
