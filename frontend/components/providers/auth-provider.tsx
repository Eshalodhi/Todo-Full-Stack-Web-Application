'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User, AuthContextValue } from '@/types';
import { useToast } from './toast-provider';

// =============================================================================
// Auth Context
// =============================================================================

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

// =============================================================================
// useAuth Hook
// =============================================================================

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// =============================================================================
// Auth Provider Props
// =============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

// =============================================================================
// Auth Provider
// =============================================================================

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { success, error: showError } = useToast();

  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Check for existing session on mount
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Session check failed:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function - calls real API to get JWT
  const login = React.useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const { user: userData, token } = data;

      // Store in localStorage
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Also set cookie for middleware (server-side) access
      document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      setUser(userData);
      success('Welcome back! Logged in successfully.');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      showError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, success, showError]);

  // Register function - calls real API to create user and get JWT
  const register = React.useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const { user: userData, token } = data;

      // Store in localStorage
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Also set cookie for middleware (server-side) access
      document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      setUser(userData);
      success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      showError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, success, showError]);

  // Logout function
  const logout = React.useCallback(async () => {
    // Call logout API to clear server-side cookie
    await fetch('/api/auth/logout', { method: 'POST' });

    // Clear storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    // Clear cookie (client-side backup)
    document.cookie = 'access_token=; path=/; max-age=0';

    setUser(null);
    success('Logged out successfully.');
    router.push('/');
  }, [router, success]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// Protected Route Wrapper
// =============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
