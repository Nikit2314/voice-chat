import React from 'react';
import { Mic, MicOff, UserX, Forward } from 'lucide-react';
import { Button } from './ui/Button';
import { useAudioStore } from '../store/useAudioStore';
import { useConnectionStore } from '../store/useConnectionStore';
import { socketService } from '../services/socketService';
import { AudioWaveform } from './ui/AudioWaveform';

interface ChatControlsProps {
  onDisconnect: () => void;
  onFindNext: () => void;
}

export const ChatControls: React.FC<ChatControlsProps> = ({ 
  onDisconnect,
  onFindNext
}) => {
  const { isMuted, toggleMute, localAudioLevel } = useAudioStore();
  const { connectionStatus } = useConnectionStore();
  
  const isConnected = connectionStatus.status === 'connected';
  const isConnecting = connectionStatus.status === 'connecting';
  const isSearching = connectionStatus.status === 'searching';
  
  const handleDisconnect = () => {
    socketService.disconnectFromPartner();
    onDisconnect();
  };
  
  const handleFindNext = () => {
    socketService.disconnectFromPartner();
    onFindNext();
  };
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-4 flex justify-center">
        <AudioWaveform 
          audioLevel={localAudioLevel}
          barCount={7}
          className="h-8"
        />
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className={isMuted ? 'bg-error-500/10 border-error-500/50 text-error-500' : ''}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleDisconnect}
          disabled={!isConnected && !isConnecting && !isSearching}
          className="text-error-500"
          aria-label="Disconnect"
        >
          <UserX />
        </Button>
        
        <Button
          variant="primary"
          onClick={handleFindNext}
          disabled={isConnecting || isSearching}
          aria-label="Find next partner"
        >
          <Forward className="mr-2 h-4 w-4" />
          {isConnected ? 'Next' : 'Start'}
        </Button>
      </div>
    </div>
  );
};