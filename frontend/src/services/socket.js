import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinGame(gameId, playerId, role) {
    if (!this.socket) {
      this.connect();
    }
    this.socket.emit('joinGame', { gameId, playerId, role });
  }

  startGame(gameId) {
    this.socket.emit('startGame', { gameId });
  }

  sendPlayerAction(gameId, playerId, action) {
    this.socket.emit('playerAction', { gameId, playerId, action });
  }

  nextRound(gameId) {
    this.socket.emit('nextRound', { gameId });
  }

  onGameUpdate(callback) {
    this.socket.on('gameUpdate', callback);
    this.listeners.set('gameUpdate', callback);
  }

  onGameStarted(callback) {
    this.socket.on('gameStarted', callback);
    this.listeners.set('gameStarted', callback);
  }

  onRoundUpdate(callback) {
    this.socket.on('roundUpdate', callback);
    this.listeners.set('roundUpdate', callback);
  }

  onActionResult(callback) {
    this.socket.on('actionResult', callback);
    this.listeners.set('actionResult', callback);
  }

  removeListener(event) {
    if (this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  removeAllListeners() {
    this.listeners.forEach((callback, event) => {
      this.socket.off(event, callback);
    });
    this.listeners.clear();
  }
}

const socketService = new SocketService();
export default socketService;