import React, { useEffect } from 'react';
import { useAudioStore } from '../store/useAudioStore';
import { useConnectionStore } from '../store/useConnectionStore';
import { socketService } from '../services/socketService';
import { setupAudioAnalyzer } from '../utils/audioUtils';
import { ChatInfo } from './ChatInfo';
import { ChatControls } from './ChatControls';

export const ChatInterface: React.FC = () => {
  const { 
    localStream, 
    setLocalAudioLevel, 
    setRemoteAudioLevel 
  } = useAudioStore();
  
  // Set up audio analysis for local stream
  useEffect(() => {
    if (!localStream) return;
    
    // Start analyzing local audio stream
    const cleanupLocalAnalyzer = setupAudioAnalyzer(
      localStream,
      setLocalAudioLevel
    );
    
    // In a real implementation, this would also analyze the remote stream
    // For demo, we'll simulate remote audio levels
    const simulateRemoteAudio = setInterval(() => {
      // Random speaking patterns
      const speakingProbability = Math.random();
      const isSpeaking = speakingProbability > 0.7;
      
      if (isSpeaking) {
        // Simulate speaking with fluctuating levels
        const level = Math.floor(Math.random() * 60) + 30; // 30-90
        setRemoteAudioLevel({ level, isSpeaking: true });
      } else {
        // Simulate silence
        const level = Math.floor(Math.random() * 10); // 0-10
        setRemoteAudioLevel({ level, isSpeaking: false });
      }
    }, 200);
    
    return () => {
      cleanupLocalAnalyzer();
      clearInterval(simulateRemoteAudio);
    };
  }, [localStream, setLocalAudioLevel, setRemoteAudioLevel]);
  
  const handleDisconnect = () => {
    // Additional disconnect logic could go here
  };
  
  const handleFindNext = () => {
    socketService.findPartner();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <ChatInfo />
        
        <ChatControls 
          onDisconnect={handleDisconnect}
          onFindNext={handleFindNext}
        />
      </div>
    </div>
  );
};