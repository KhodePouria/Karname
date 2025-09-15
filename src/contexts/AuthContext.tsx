'use client';

import React, {createContext, useContext, useState, useEffect} from 'react';

export type UserRole = 'student' | 'professor';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor';
  studentNumber?: string;
  professorNumber?: string;
  major?: string;
  year?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser?: (update: Partial<User> | User) => void;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  password: string;
  department?: string;
  year?: string;
  role?: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Remove mock users - we'll use the database instead

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        throw new Error(data.error || 'خطا در ورود');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        throw new Error(data.error || 'خطا در ثبت‌نام');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Force a page refresh to ensure clean state
    window.location.href = '/';
  };

  const updateUser = (update: Partial<User> | User) => {
    setUser((prev) => {
      const next = prev
        ? {...prev, ...(update as Partial<User>)}
        : (update as User);
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{user, login, signup, logout, loading, updateUser}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
