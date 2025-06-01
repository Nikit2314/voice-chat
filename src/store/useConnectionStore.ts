import { create } from 'zustand';
import { ConnectionStatus, User } from '../types';

interface ConnectionState {
  connectionStatus: ConnectionStatus;
  currentUser: User | null;
  socketConnected: boolean;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setCurrentUser: (user: User | null) => void;
  setSocketConnected: (connected: boolean) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  connectionStatus: { status: 'disconnected' },
  currentUser: null,
  socketConnected: false,
  
  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },
  
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
  
  setSocketConnected: (connected) => {
    set({ socketConnected: connected });
  }
}));