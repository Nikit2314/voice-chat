import { io, Socket } from 'socket.io-client';
import { useConnectionStore } from '../store/useConnectionStore';

// Используем URL продакшн сервера
const SOCKET_URL = 'https://voice-chat-server.onrender.com';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  async connect(username: string | null): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        this.socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          withCredentials: true
        });
        
        this.socket.on('connect', () => {
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
          
          useConnectionStore.getState().setSocketConnected(true);
          useConnectionStore.getState().setCurrentUser({
            id: socketId,
            username: username || 'Anonymous'
          });
          
          resolve(socketId);
        });

        this.socket.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error);
          reject(new Error('Failed to connect to server. Please try again.'));
        });

        this.socket.on('connect_timeout', () => {
          reject(new Error('Connection timeout. Please check your internet connection.'));
        });
      });
    } catch (error) {
      console.error('Socket service error:', error);
      throw error;
    }
  }

  findPartner(): void {
    if (!this.socket || !this.userId) return;
    
    useConnectionStore.getState().setConnectionStatus({ 
      status: 'searching' 
    });
    
    this.socket.emit('find_partner');
  }

  disconnectFromPartner(): void {
    if (!this.socket) return;
    
    this.socket.emit('disconnect_partner');
    useConnectionStore.getState().setConnectionStatus({
      status: 'disconnected'
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.userId = null;
    useConnectionStore.getState().setSocketConnected(false);
    useConnectionStore.getState().setCurrentUser(null);
    useConnectionStore.getState().setConnectionStatus({
      status: 'disconnected'
    });
  }
}

export const socketService = new SocketService();