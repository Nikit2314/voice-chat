import React from 'react';
import { useConnectionStore } from '../store/useConnectionStore';
import { StatusBadge } from './ui/StatusBadge';
import { useAudioStore } from '../store/useAudioStore';
import { AudioWaveform } from './ui/AudioWaveform';

export const ChatInfo: React.FC = () => {
  const { connectionStatus } = useConnectionStore();
  const { remoteAudioLevel } = useAudioStore();
  
  const isConnected = connectionStatus.status === 'connected';
  const isConnecting = connectionStatus.status === 'connecting';
  const isSearching = connectionStatus.status === 'searching';
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 mb-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={connectionStatus.status} />
        
        {isConnected && remoteAudioLevel.isSpeaking && (
          <span className="text-xs font-medium text-accent-500 animate-pulse">
            Speaking
          </span>
        )}
      </div>
      
      <div className="text-center mb-4">
        {isConnected && (
          <h2 className="text-xl font-semibold mb-1">
            {connectionStatus.peerUsername || 'Anonymous User'}
          </h2>
        )}
        
        {isConnecting && (
          <h2 className="text-lg font-medium animate-pulse">
            Connecting...
          </h2>
        )}
        
        {isSearching && (
          <h2 className="text-lg font-medium animate-pulse">
            Finding someone to talk to...
          </h2>
        )}
        
        {!isConnected && !isConnecting && !isSearching && (
          <h2 className="text-lg font-medium">
            Not connected
          </h2>
        )}
      </div>
      
      {isConnected && (
        <div className="flex justify-center">
          <AudioWaveform 
            audioLevel={remoteAudioLevel}
            barCount={7}
            className="h-12"
          />
        </div>
      )}
      
      {isSearching && (
        <div className="flex justify-center mt-2">
          <div className="flex space-x-2">
            <span className="h-2 w-2 bg-accent-500 rounded-full animate-bounce-slow" style={{ animationDelay: '0s' }}></span>
            <span className="h-2 w-2 bg-accent-500 rounded-full animate-bounce-slow" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-2 w-2 bg-accent-500 rounded-full animate-bounce-slow" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      )}
    </div>
  );
};