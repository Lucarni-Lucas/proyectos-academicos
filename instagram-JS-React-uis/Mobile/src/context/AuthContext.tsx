import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as secureStore from '@/utils/secureStore';
import { useRouter } from 'expo-router';
import apiClient, { registerUnauthorizedHandler } from '@/api/client';
import { loginRequest, registerRequest } from '@/api/auth';

export interface User {
  id?: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, image?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Hydrate authentication state on mount
  useEffect(() => {
    const loadCredentials = async (): Promise<void> => {
      try {
        const storedToken = await secureStore.getItem('user_token');
        const storedUserStr = await secureStore.getItem('user_data');
        if (storedToken && storedUserStr) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);
          setUser(JSON.parse(storedUserStr) as User);
        }
      } catch (e) {
        console.error('Failed to load stored auth credentials:', e);
      } finally {
        setLoading(false);
      }
    };
    loadCredentials();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await loginRequest(email, password);
    if (response.data && typeof response.data === 'object' && response.headers['authorization']) {
      const authHeader = response.headers['authorization'] as string;
      const newToken = authHeader.replace('Bearer ', '');
      const loggedUser = response.data as User;

      // 2. Set Axios default header and local state immediately
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      setUser(loggedUser);

      // 3. Persist to secure storage
      await secureStore.setItem('user_token', newToken);
      await secureStore.setItem('user_data', JSON.stringify(loggedUser));
    } else {
      throw new Error('Invalid login response payload');
    }
  };

  const register = async (name: string, email: string, password: string, image?: string): Promise<void> => {
    const response = await registerRequest(name, email, password, image);
    if (response.data && typeof response.data === 'object' && response.headers['authorization']) {
      const authHeader = response.headers['authorization'] as string;
      const newToken = authHeader.replace('Bearer ', '');
      const registeredUser = response.data as User;

      // 2. Set Axios default header and local state immediately
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      setUser(registeredUser);

      // 3. Persist to secure storage
      await secureStore.setItem('user_token', newToken);
      await secureStore.setItem('user_data', JSON.stringify(registeredUser));
    } else {
      throw new Error('Invalid register response payload');
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    delete apiClient.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    await secureStore.deleteItem('user_token');
    await secureStore.deleteItem('user_data');
  }, []);

  // 4. Register unauthorized interceptor response callback
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout().then(() => {
        router.replace('/login');
      });
    });
  }, [logout, router]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
