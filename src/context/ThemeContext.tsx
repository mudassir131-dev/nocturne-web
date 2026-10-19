import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setAdaptiveColor: (color?: string | null) => void;
}

const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adaptiveColor, setAdaptiveColor] = useState<string | null>(null);
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const isManual = localStorage.getItem('nocturne_theme_manual') === 'true';
      if (isManual) {
        const saved = localStorage.getItem('nocturne_theme');
        if (saved === 'light' || saved === 'dark') return saved;
      }
    } catch {
      // ignore
    }
    return getSystemTheme();
  });

  // Listen for realtime system/OS theme changes (phone & desktop)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // If user hasn't explicitly locked a manual override, follow system
      const isManual = localStorage.getItem('nocturne_theme_manual') === 'true';
      if (!isManual) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('nocturne_theme', theme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }

    // Adapt phone status bar & navigation bar to match app screen color dynamically
    const baseColor = theme === 'light' ? '#f5f6fa' : '#0a0b0f';
    const targetColor = adaptiveColor || baseColor;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', targetColor);
  }, [theme, adaptiveColor]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('nocturne_theme_manual', 'true');
      } catch {
        // ignore
      }
      return next;
    });
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem('nocturne_theme_manual', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, setAdaptiveColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
