import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <div className="mb-4 md:mb-0">
          <p>© 2025 VoiceRandom. All rights reserved.</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Help
          </a>
          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};