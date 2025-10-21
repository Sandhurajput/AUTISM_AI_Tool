import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    console.log('Initial theme from localStorage:', savedTheme);
    // Default to light mode if no preference saved
    if (savedTheme === null) {
      return false; // light mode by default
    }
    return savedTheme === 'dark';
  });

  useEffect(() => {
    // Update localStorage and document class when theme changes
    console.log('Theme changed to:', isDarkMode ? 'dark' : 'light');
    const html = document.documentElement;
    
    if (isDarkMode) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
      console.log('✅ Dark mode activated');
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
      console.log('✅ Light mode activated');
    }
    console.log('Current classes on html:', html.className);
  }, [isDarkMode]);

  const toggleTheme = () => {
    console.log('Toggle theme clicked!');
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
