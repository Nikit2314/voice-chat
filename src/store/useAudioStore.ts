import { create } from 'zustand';
import { AudioLevel } from '../types';

interface AudioState {
  localStream: MediaStream | null;
  isMuted: boolean;
  localAudioLevel: AudioLevel;
  remoteAudioLevel: AudioLevel;
  audioContext: AudioContext | null;
  setLocalStream: (stream: MediaStream | null) => void;
  toggleMute: () => void;
  setLocalAudioLevel: (level: AudioLevel) => void;
  setRemoteAudioLevel: (level: AudioLevel) => void;
  cleanup: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  localStream: null,
  isMuted: false,
  localAudioLevel: { level: 0, isSpeaking: false },
  remoteAudioLevel: { level: 0, isSpeaking: false },
  audioContext: null,
  
  setLocalStream: (stream) => {
    const { localStream } = get();
    
    // Clean up previous stream if it exists
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Create audio context if it doesn't exist
    let audioContext = get().audioContext;
    if (!audioContext && stream) {
      audioContext = new AudioContext();
      set({ audioContext });
    }
    
    set({ localStream: stream });
  },
  
  toggleMute: () => {
    const { localStream, isMuted } = get();
    
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      
      set({ isMuted: !isMuted });
    }
  },
  
  setLocalAudioLevel: (level) => {
    set({ localAudioLevel: level });
  },
  
  setRemoteAudioLevel: (level) => {
    set({ remoteAudioLevel: level });
  },
  
  cleanup: () => {
    const { localStream, audioContext } = get();
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContext) {
      audioContext.close();
    }
    
    set({
      localStream: null,
      audioContext: null,
      localAudioLevel: { level: 0, isSpeaking: false },
      remoteAudioLevel: { level: 0, isSpeaking: false },
    });
  }
}));