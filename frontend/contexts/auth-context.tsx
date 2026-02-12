"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  avatar: string | null;
  token: string | null;
  user: { username: string; avatar: string | null; id?: string } | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null); // NEW
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/me'); // Proxied to backend
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        setAvatar(data.avatar);
        // Assuming /auth/me returns token or we have it in cookies? 
        // If we use cookies, we don't need token in JS.
        // BUT Watchlist API call uses Authorization: Bearer ${token}.
        // We need the token.
        // Let's assume /auth/me returns it or we can get it from localStorage if we saved it on login.
        // Since we don't have login logic here (it's GitHub OAuth), the token is usually set in cookies by backend.
        // If backend sets HttpOnly cookie, JS can't read it.
        // In that case, we should proxy watchlist requests via Next.js API routes that forward the cookie.
        
        // MVP HACK: For now, let's assume we can get a "public" token or we just mock it for "checkIsWatched" calls 
        // if we are calling 8083 directly.
        // OR, we update /auth/me to return the JWT token in body so we can use it.
        // Let's try to read it from data.token.
        if (data.token) setToken(data.token);
        
        setIsAuthenticated(true);
      } else {
        setUsername(null);
        setAvatar(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUsername(null);
      setAvatar(null);
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        username,
        avatar,
        token, // NEW
        user: username ? { username, avatar, id: username } : null, // Assuming username is ID or we add ID
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
