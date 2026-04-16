const IncidentResponseManager = require('../incident/IncidentResponseManager');
const BudgetAllocator = require('../defense/BudgetAllocator');

// Import all attack types
const RansomwareAttack = require('../attacks/Ransomware');
const DDoSAttack = require('../attacks/DDoS');
const DataBreachAttack = require('../attacks/DataBreach');
const SupplyChainAttack = require('../attacks/SupplyChain');
const InsiderThreatAttack = require('../attacks/InsiderThreat');
const InfrastructureSabotageAttack = require('../attacks/InfrastructureSabotage');

class GameEngine {
  constructor(gameId) {
    this.gameId = gameId;
    this.round = 0;
    this.maxRounds = 8;
    this.players = new Map();
    this.assets = [];
    this.incidentManager = new IncidentResponseManager();
    this.scores = new Map();
    this.gameState = 'WAITING'; // WAITING, ACTIVE, FINISHED
  }

  addPlayer(playerId, role) {
    // Roles: CISO, ATTACKER, REGULATOR, INSURER, INFRASTRUCTURE_OFFICER
    this.players.set(playerId, {
      id: playerId,
      role: role,
      budget: this.getInitialBudget(role),
      score: 0,
      actions: []
    });
  }

  getInitialBudget(role) {
    const budgets = {
      CISO: 50000000, // $50M
      ATTACKER: 5000000, // $5M (for developing exploits)
      REGULATOR: 10000000,
      INSURER: 100000000,
      INFRASTRUCTURE_OFFICER: 20000000
    };
    return budgets[role] || 0;
  }

  initializeAssets(assetData) {
    this.assets = assetData;
  }

  startGame() {
    if (this.players.size < 2) {
      throw new Error('Need at least 2 players');
    }
    this.gameState = 'ACTIVE';
    this.round = 1;
  }

  nextRound() {
    if (this.round >= this.maxRounds) {
      this.endGame();
      return;
    }
    this.round++;
    this.generateRandomEvents();
  }

  generateRandomEvents() {
    // Randomly generate attacks based on round
    const attackProbability = 0.3 + (this.round * 0.1); // Increases each round
    
    if (Math.random() < attackProbability) {
      this.launchRandomAttack();
    }
  }

  launchRandomAttack() {
    const attackTypes = [
      RansomwareAttack,
      DDoSAttack,
      DataBreachAttack,
      SupplyChainAttack,
      InsiderThreatAttack,
      InfrastructureSabotageAttack
    ];
    
    const AttackClass = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const attack = new AttackClass();
    
    const targetAsset = this.assets[Math.floor(Math.random() * this.assets.length)];
    
    return this.executeAttack(attack, targetAsset);
  }

  executeAttack(attack, asset) {
    const attackerPlayer = Array.from(this.players.values()).find(p => p.role === 'ATTACKER');
    const cisoPlayer = Array.from(this.players.values()).find(p => p.role === 'CISO');
    
    const attackerSkill = 75; // Default attacker skill
    const defenses = cisoPlayer ? cisoPlayer.defenses : { level: 30, detection: 30 };
    
    const result = attack.execute(asset, attackerSkill, defenses);
    
    if (result.success) {
      const incident = this.incidentManager.detectIncident(attack, asset, defenses);
      return { attack, result, incident };
    }
    
    return { attack, result: { success: false } };
  }

  updateScores() {
    // Calculate scores for all players
    this.players.forEach((player, playerId) => {
      let score = 0;
      
      switch(player.role) {
        case 'CISO':
          score = this.calculateCISOScore(player);
          break;
        case 'ATTACKER':
          score = this.calculateAttackerScore(player);
          break;
        // Add other role scoring...
      }
      
      this.scores.set(playerId, score);
    });
  }

  calculateCISOScore(player) {
    // Based on project document scoring (100 points total)
    const metrics = this.incidentManager.getMetrics();
    
    let preventionScore = Math.max(0, 30 - (metrics.totalIncidents * 5));
    let responseScore = Math.max(0, 25 - (metrics.MTTR / 10));
    let costScore = 20; // Placeholder
    let complianceScore = 15; // Placeholder
    let resilienceScore = 10; // Placeholder
    
    return preventionScore + responseScore + costScore + complianceScore + resilienceScore;
  }

  calculateAttackerScore(player) {
    // Score based on successful attacks
    return player.actions.filter(a => a.success).length * 10;
  }

  endGame() {
    this.gameState = 'FINISHED';
    this.updateScores();
    return {
      winner: this.getWinner(),
      finalScores: Object.fromEntries(this.scores),
      summary: this.getGameSummary()
    };
  }

  getWinner() {
    let maxScore = 0;
    let winner = null;
    
    this.scores.forEach((score, playerId) => {
      if (score > maxScore) {
        maxScore = score;
        winner = playerId;
      }
    });
    
    return { playerId: winner, score: maxScore };
  }

  getGameSummary() {
    return {
      totalRounds: this.round,
      incidents: this.incidentManager.getIncidentHistory(),
      metrics: this.incidentManager.getMetrics()
    };
  }

  getGameState() {
    return {
      gameId: this.gameId,
      round: this.round,
      maxRounds: this.maxRounds,
      state: this.gameState,
      players: Array.from(this.players.values()),
      activeIncidents: this.incidentManager.getActiveIncidents(),
      scores: Object.fromEntries(this.scores)
    };
  }
}

module.exports = GameEngine;