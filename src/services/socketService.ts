import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { useConnectionStore } from '../store/useConnectionStore';

const SOCKET_URL = 'https://voice-chat-server-7g6n.onrender.com';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private readonly reconnectDelay = 5000;
  private currentUsername: string | null = null;
  private connectionTimeout: ReturnType<typeof setTimeout> | null = null;

  connect(username: string | null): Promise<string> {
    this.currentUsername = username;

    return new Promise((resolve, reject) => {
      console.log('🔌 Connecting to:', SOCKET_URL);

      // Safety timeout for initial connection
      this.connectionTimeout = setTimeout(() => {
        if (!this.socket?.connected) {
          console.warn('⚠️ Connection timeout, retrying...');
          this.handleReconnect();
        }
      }, 60000);

      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 10000
      });

      this.setupSocketListeners(resolve, reject);
    });
  }

  private setupSocketListeners(
    resolve: (value: string) => void,
    reject: (reason?: any) => void
  ) {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to socket');

      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }

      const socketId = this.socket?.id;
      if (!socketId) {
        return reject('No socket ID received');
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

    this.socket.on('connect_error', (err: Error) => {
      console.error('❌ Connect error:', err.message);
      this.handleReconnect();
      reject('Connection failed. Please try again.');
    });

    this.socket.on('connect_timeout', () => {
      console.warn('⏱️ Connection timeout');
      this.handleReconnect();
      reject('Connection timed out.');
    });

    this.socket.on('error', (err: Error) => {
      console.error('🚨 Socket error:', err);
      this.handleReconnect();
      reject(err);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log(`🔌 Disconnected: ${reason}`);
      useConnectionStore.getState().setSocketConnected(false);

      if (reason === 'io server disconnect') {
        this.handleReconnect();
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔁 Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => this.connect(this.currentUsername), this.reconnectDelay);
    } else {
      console.error('❌ Max reconnect attempts reached');
      useConnectionStore.getState().setConnectionStatus({ status: 'disconnected' });
    }
  }

  findPartner(): void {
    if (!this.socket || !this.userId) {
      console.warn('❗ Cannot search: socket or userId missing');
      return;
    }

    console.log('🔍 Finding a partner...');
    useConnectionStore.getState().setConnectionStatus({ status: 'searching' });
    this.socket.emit('find_partner');
  }

  disconnectFromPartner(): void {
    if (!this.socket) {
      console.warn('❗ Socket not connected');
      return;
    }

    console.log('🔕 Disconnecting from partner');
    this.socket.emit('disconnect_partner');
    useConnectionStore.getState().setConnectionStatus({ status: 'disconnected' });
  }

  disconnect(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
    }

    this.socket = null;
    this.userId = null;
    this.currentUsername = null;

    useConnectionStore.getState().setSocketConnected(false);
    useConnectionStore.getState().setCurrentUser(null);
    useConnectionStore.getState().setConnectionStatus({ status: 'disconnected' });
  }
}

export const socketService = new SocketService();
