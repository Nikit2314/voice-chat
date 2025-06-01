import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useConnectionStore } from './store/useConnectionStore';
import { useAudioStore } from './store/useAudioStore';

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  const { cleanup } = useAudioStore();
  const { socketConnected } = useConnectionStore();
  
  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {isSetupComplete && <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      
      <main className="flex-grow pt-16">
        {!isSetupComplete ? (
          <WelcomeScreen onComplete={() => setIsSetupComplete(true)} />
        ) : (
          <ChatInterface />
        )}
      </main>
      
      {isSetupComplete && <Footer />}
    </div>
  );
}

export default App;