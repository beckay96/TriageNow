import { FC, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Custom hook to expose dark mode state
// Defined separately for consistency with React's Fast Refresh
function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && isDark));
    }
  }, []);
  
  return isDarkMode;
}

export { useIsDarkMode };

const ThemeToggle: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for system preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && isDark));
      
      if (isDark || localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`p-2 rounded-full ${isDarkMode ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'} transition-all duration-300 animate-fade-in`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;