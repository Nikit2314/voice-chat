import React from 'react';
import { Volume2, Moon, Sun } from 'lucide-react';
import { useConnectionStore } from '../store/useConnectionStore';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const { currentUser } = useConnectionStore();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-10 border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Volume2 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span className="ml-2 font-semibold text-lg">VoiceRandom</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {currentUser && (
            <span className="text-sm font-medium">
              {currentUser.username || 'Anonymous'}
            </span>
          )}
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};