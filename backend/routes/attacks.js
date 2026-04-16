const express = require('express');
const router = express.Router();

// Get available attack types
router.get('/types', (req, res) => {
  const attackTypes = [
    { type: 'RANSOMWARE', name: 'Ransomware', severity: 90, description: 'Encrypt data and demand ransom' },
    { type: 'DDOS', name: 'DDoS Attack', severity: 60, description: 'Flood systems with traffic' },
    { type: 'DATA_BREACH', name: 'Data Breach', severity: 85, description: 'Steal customer data' },
    { type: 'SUPPLY_CHAIN', name: 'Supply Chain Attack', severity: 95, description: 'Compromise through vendor' },
    { type: 'INSIDER_THREAT', name: 'Insider Threat', severity: 80, description: 'Employee sabotage or theft' },
    { type: 'INFRASTRUCTURE_SABOTAGE', name: 'Infrastructure Sabotage', severity: 100, description: 'Physical + cyber attack' }
  ];
  
  res.json({ attackTypes });
});

// Simulate attack
router.post('/simulate', (req, res) => {
  const { attackType, targetAssetId, attackerSkill } = req.body;
  
  // This would use the game engine in a real scenario
  // For now, return mock data
  res.json({
    success: Math.random() > 0.5,
    impact: Math.random() * 10000000,
    detectionTime: Math.random() * 72
  });
});

module.exports = router;