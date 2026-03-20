import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'classic' | 'tech';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'classic' || saved === 'tech') ? saved : 'classic';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('tech-theme', theme === 'tech');
    document.documentElement.classList.toggle('classic-theme', theme === 'classic');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'tech' ? 'classic' : 'tech');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
