const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Import routes
const gameRoutes = require('./routes/game');
const assetRoutes = require('./routes/assets');
const attackRoutes = require('./routes/attacks');
const defenseRoutes = require('./routes/defense');
const incidentRoutes = require('./routes/incidents');
const playerRoutes = require('./routes/players');

// API Routes
app.use('/api/games', gameRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/attacks', attackRoutes);
app.use('/api/defense', defenseRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/players', playerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// WebSocket setup
const GameEngine = require('./engine/GameEngine');
const activeGames = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join game
  socket.on('joinGame', ({ gameId, playerId, role }) => {
    socket.join(gameId);
    
    let game = activeGames.get(gameId);
    if (!game) {
      game = new GameEngine(gameId);
      activeGames.set(gameId, game);
    }
    
    game.addPlayer(playerId, role);
    
    io.to(gameId).emit('gameUpdate', game.getGameState());
    console.log(`✅ Player ${playerId} joined game ${gameId} as ${role}`);
  });

  // Start game
  socket.on('startGame', ({ gameId }) => {
    const game = activeGames.get(gameId);
    if (game) {
      game.startGame();
      io.to(gameId).emit('gameStarted', game.getGameState());
    }
  });

  // Player action
  socket.on('playerAction', ({ gameId, playerId, action }) => {
    const game = activeGames.get(gameId);
    if (game) {
      // Process action based on type
      let result;
      
      switch(action.type) {
        case 'ALLOCATE_BUDGET':
          result = handleBudgetAllocation(game, playerId, action.data);
          break;
        case 'LAUNCH_ATTACK':
          result = handleAttackLaunch(game, playerId, action.data);
          break;
        case 'RESPOND_TO_INCIDENT':
          result = handleIncidentResponse(game, playerId, action.data);
          break;
        case 'DEPLOY_CONTROL':
          result = handleControlDeployment(game, playerId, action.data);
          break;
        default:
          result = { error: 'Unknown action type' };
      }
      
      io.to(gameId).emit('gameUpdate', game.getGameState());
      socket.emit('actionResult', result);
    }
  });

  // Next round
  socket.on('nextRound', ({ gameId }) => {
    const game = activeGames.get(gameId);
    if (game) {
      game.nextRound();
      io.to(gameId).emit('roundUpdate', game.getGameState());
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Action handlers
function handleBudgetAllocation(game, playerId, data) {
  const player = game.players.get(playerId);
  if (player.role !== 'CISO') {
    return { error: 'Only CISO can allocate budget' };
  }
  
  player.budgetAllocator = player.budgetAllocator || new (require('./defense/BudgetAllocator'))(player.budget);
  player.budgetAllocator.selectControls(data.controls);
  
  return { success: true, allocation: player.budgetAllocator.getBudgetSummary() };
}

function handleAttackLaunch(game, playerId, data) {
  const player = game.players.get(playerId);
  if (player.role !== 'ATTACKER') {
    return { error: 'Only ATTACKER can launch attacks' };
  }
  
  const { attackType, targetAssetId } = data;
  const asset = game.assets.find(a => a.id === targetAssetId);
  
  const AttackClass = require(`./attacks/${attackType}`);
  const attack = new AttackClass();
  
  const result = game.executeAttack(attack, asset);
  player.actions.push(result);
  
  return result;
}

function handleIncidentResponse(game, playerId, data) {
  const player = game.players.get(playerId);
  if (player.role !== 'CISO') {
    return { error: 'Only CISO can respond to incidents' };
  }
  
  const { incidentId, action } = data;
  
  let result;
  switch(action) {
    case 'CONTAIN':
      result = game.incidentManager.containIncident(incidentId, data.strategy);
      break;
    case 'ERADICATE':
      result = game.incidentManager.eradicateAttack(incidentId, data.method);
      break;
    case 'RECOVER':
      result = game.incidentManager.recoverFromIncident(incidentId, data.strategy);
      break;
  }
  
  return result;
}

function handleControlDeployment(game, playerId, data) {
  const player = game.players.get(playerId);
  player.deployedControls = player.deployedControls || [];
  player.deployedControls.push(data.control);
  
  return { success: true, control: data.control };
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
});

module.exports = { app, io };