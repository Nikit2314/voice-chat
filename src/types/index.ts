export interface User {
  id: string;
  username: string | null;
}

export interface ConnectionStatus {
  status: 'disconnected' | 'connecting' | 'connected' | 'searching';
  peerId?: string;
  peerUsername?: string | null;
}

export interface AudioLevel {
  level: number;  // 0-100
  isSpeaking: boolean;
}