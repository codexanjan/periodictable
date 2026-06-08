import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export interface AuthUser {
  email: string;
  displayName: string;
  isGuest: boolean;
  photoURL?: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to dark (Neon)
    return 'dark';
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('portal_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    localStorage.setItem('portal_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portal_user');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, user, login, logout }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
