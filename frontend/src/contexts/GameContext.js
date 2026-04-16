import React, { createContext, useContext, useState, useEffect } from 'react';
import socketService from '../services/socket';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    gameId: null,
    round: 0,
    maxRounds: 8,
    state: 'WAITING',
    players: [],
    activeIncidents: [],
    scores: {},
  });

  const [currentPlayer, setCurrentPlayer] = useState({
    id: null,
    role: null,
    budget: 0,
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socketService.onGameUpdate((state) => {
      console.log('Game update received:', state);
      setGameState(state);
    });

    socketService.onGameStarted((state) => {
      console.log('Game started:', state);
      setGameState(state);
    });

    socketService.onRoundUpdate((state) => {
      console.log('Round update:', state);
      setGameState(state);
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const joinGame = (gameId, playerId, role) => {
    socketService.joinGame(gameId, playerId, role);
    setCurrentPlayer({ id: playerId, role, budget: getInitialBudget(role) });
  };

  const startGame = (gameId) => {
    socketService.startGame(gameId);
  };

  const sendAction = (action) => {
    socketService.sendPlayerAction(gameState.gameId, currentPlayer.id, action);
  };

  const nextRound = () => {
    socketService.nextRound(gameState.gameId);
  };

  const getInitialBudget = (role) => {
    const budgets = {
      CISO: 50000000,
      ATTACKER: 5000000,
      REGULATOR: 10000000,
      INSURER: 100000000,
      INFRASTRUCTURE_OFFICER: 20000000,
    };
    return budgets[role] || 0;
  };

  const value = {
    gameState,
    currentPlayer,
    connected,
    joinGame,
    startGame,
    sendAction,
    nextRound,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};