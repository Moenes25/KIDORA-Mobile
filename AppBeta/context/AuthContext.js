import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = "Bearer " + token;
        setUser({ token });
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    await AsyncStorage.setItem("token", res.data.token);
    api.defaults.headers.common["Authorization"] = "Bearer " + res.data.token;

    setUser({ token: res.data.token });
    setUser(res.user);
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
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return ( 
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
