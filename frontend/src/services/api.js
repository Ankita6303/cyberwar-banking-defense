import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Games
export const gameAPI = {
  createGame: (gameName, maxRounds = 8) => 
    api.post('/games', { game_name: gameName, max_rounds: maxRounds }),
  
  getAllGames: () => 
    api.get('/games'),
  
  getGame: (gameId) => 
    api.get(`/games/${gameId}`),
  
  startGame: (gameId) => 
    api.post(`/games/${gameId}/start`),
  
  endGame: (gameId) => 
    api.post(`/games/${gameId}/end`),
  
  getGameStats: (gameId) => 
    api.get(`/games/${gameId}/stats`),
};

// Assets
export const assetAPI = {
  getGameAssets: (gameId) => 
    api.get(`/assets/game/${gameId}`),
  
  getAsset: (assetId) => 
    api.get(`/assets/${assetId}`),
  
  updateAssetSecurity: (assetId, securityLevel) => 
    api.put(`/assets/${assetId}/security`, { security_level: securityLevel }),
};

// Incidents
export const incidentAPI = {
  createIncident: (incidentData) => 
    api.post('/incidents', incidentData),
  
  getGameIncidents: (gameId) => 
    api.get(`/incidents/game/${gameId}`),
  
  updateIncidentStatus: (incidentId, status, responseTime) => 
    api.put(`/incidents/${incidentId}/status`, { 
      status, 
      response_time_hours: responseTime 
    }),
  
  resolveIncident: (incidentId, resolutionData) => 
    api.post(`/incidents/${incidentId}/resolve`, resolutionData),
};

// Defense
export const defenseAPI = {
  deployMeasure: (measureData) => 
    api.post('/defense/measures', measureData),
  
  getGameMeasures: (gameId) => 
    api.get(`/defense/measures/game/${gameId}`),
};

// Attacks
export const attackAPI = {
  getAttackTypes: () => 
    api.get('/attacks/types'),
  
  simulateAttack: (attackData) => 
    api.post('/attacks/simulate', attackData),
};

// Players
export const playerAPI = {
  createPlayer: (username, email, role) => 
    api.post('/players', { username, email, role }),
  
  getAllPlayers: () => 
    api.get('/players'),
  
  getPlayerScores: (playerId, gameId) => 
    api.get(`/players/${playerId}/scores/${gameId}`),
};

export default api;