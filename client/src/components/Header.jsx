import React from "react";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔘 Header button clicked! Current mode:', isDarkMode ? 'dark' : 'light');
    toggleTheme();
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-700 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between transition-colors duration-300">
      <h1 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-800 dark:text-white max-w-[60%] md:max-w-none">
        <span className="text-indigo-600 dark:text-indigo-400">AI-Assisted</span> Autism Screening
      </h1>
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={handleToggle}
          type="button"
          className="p-2.5 md:p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-sm"
          aria-label="Toggle theme"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <svg className="w-6 h-6 md:w-5 md:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 md:w-5 md:h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
