
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  React.useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center rounded-full p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 text-orange-500 dark:text-gray-400 transition-all scale-100 dark:scale-0 absolute" />
      <Moon className="h-5 w-5 text-gray-400 dark:text-yellow-300 transition-all scale-0 dark:scale-100 absolute" />
    </motion.button>
  );
};

export default ThemeToggle;
