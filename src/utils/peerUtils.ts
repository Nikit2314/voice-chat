import SimplePeer from 'simple-peer';

/**
 * Create a simple-peer instance for WebRTC communication
 */
export function createPeer(
  initiator: boolean, 
  stream: MediaStream,
  onSignal: (signal: any) => void,
  onConnect: () => void,
  onStream: (stream: MediaStream) => void,
  onClose: () => void,
  onError: (err: Error) => void
): SimplePeer.Instance {
  const peer = new SimplePeer({
    initiator,
    stream,
    trickle: true,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });

  peer.on('signal', onSignal);
  peer.on('connect', onConnect);
  peer.on('stream', onStream);
  peer.on('close', onClose);
  peer.on('error', onError);

  return peer;
}

/**
 * Add received signal data to the peer connection
 */
export function addSignalToPeer(peer: SimplePeer.Instance, signal: any): void {
  if (peer && !peer.destroyed) {
    peer.signal(signal);
  }
}

/**
 * Safely destroy a peer connection
 */
export function destroyPeer(peer: SimplePeer.Instance | null): void {
  if (peer && !peer.destroyed) {
    peer.destroy();
  }
}