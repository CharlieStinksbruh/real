import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/seo';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('analysethat_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('analysethat_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo users
    const demoUsers: User[] = [
      {
        id: '1',
        email: 'admin@analysethat.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        subscription: 'enterprise',
        analysisCount: 0,
        maxAnalyses: -1 // unlimited
      },
      {
        id: '2',
        email: 'user@example.com',
        name: 'Demo User',
        role: 'user',
        createdAt: new Date().toISOString(),
        subscription: 'pro',
        analysisCount: 5,
        maxAnalyses: 100
      }
    ];
    
    const foundUser = demoUsers.find(u => u.email === email);
    
    if (foundUser && (password === 'admin123' || password === 'demo123')) {
      setUser(foundUser);
      localStorage.setItem('analysethat_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      subscription: 'free',
      analysisCount: 0,
      maxAnalyses: 5
    };
    
    setUser(newUser);
    localStorage.setItem('analysethat_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('analysethat_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};