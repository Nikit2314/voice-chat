import { io, Socket } from 'socket.io-client';
import { useConnectionStore } from '../store/useConnectionStore';

// Используем публичный URL сервера
const SOCKET_URL = 'https://voice-chat-server-7g6n.onrender.com';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 5000;
  private currentUsername: string | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;

  async connect(username: string | null): Promise<string> {
    try {
      this.currentUsername = username;
      return new Promise((resolve, reject) => {
        console.log('Attempting to connect to:', SOCKET_URL);
        
        this.connectionTimeout = setTimeout(() => {
          if (!this.socket?.connected) {
            console.log('Initial connection timeout, retrying...');
            this.handleReconnect();
          }
        }, 60000);
        
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          withCredentials: true
        });
        
        this.setupSocketListeners(resolve, reject);
      });
    } catch (error) {
      console.error('Socket service error:', error);
      this.handleReconnect();
      throw error;
    }
  }

  private setupSocketListeners(resolve: (value: string) => void, reject: (reason: any) => void) {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      const socketId = this.socket.id;
      if (!socketId) {
        reject(new Error('Socket ID not available'));
        return;
      }

      this.userId = socketId;
      this.reconnectAttempts = 0;
      
      useConnectionStore.getState().setSocketConnected(true);
      useConnectionStore.getState().setCurrentUser({
        id: socketId,
        username: this.currentUsername || 'Anonymous'
      });
      
      resolve(socketId);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error);
      this.handleReconnect();
      reject(new Error('Failed to connect to server. Please try again.'));
    });

    this.socket.on('connect_timeout', () => {
      console.error('Socket connection timeout');
      this.handleReconnect();
      reject(new Error('Connection timeout. Please check your internet connection.'));
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
      this.handleReconnect();
      reject(error);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
      useConnectionStore.getState().setSocketConnected(false);
      if (reason === 'io server disconnect') {
        this.handleReconnect();
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.connect(this.currentUsername);
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      useConnectionStore.getState().setConnectionStatus({
        status: 'disconnected'
      });
    }
  }

  findPartner(): void {
    if (!this.socket || !this.userId) {
      console.error('Socket or userId not available');
      return;
    }
    
    console.log('Searching for partner...');
    useConnectionStore.getState().setConnectionStatus({ 
      status: 'searching' 
    });
    
    this.socket.emit('find_partner');
  }

  disconnectFromPartner(): void {
    if (!this.socket) {
      console.error('Socket not available');
      return;
    }
    
    console.log('Disconnecting from partner...');
    this.socket.emit('disconnect_partner');
    useConnectionStore.getState().setConnectionStatus({
      status: 'disconnected'
    });
  }

  disconnect(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.socket) {
      console.log('Disconnecting socket...');
      this.socket.disconnect();
    }
    
    this.userId = null;
    this.socket = null;
    this.currentUsername = null;
    useConnectionStore.getState().setSocketConnected(false);
    useConnectionStore.getState().setCurrentUser(null);
    useConnectionStore.getState().setConnectionStatus({
      status: 'disconnected'
    });
  }
}

export const socketService = new SocketService();