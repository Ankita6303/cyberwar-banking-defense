const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Create incident
router.post('/', async (req, res) => {
  try {
    const {
      game_id,
      round_id,
      attack_type,
      targeted_asset_id,
      attacker_id,
      success,
      detected,
      detection_time_hours,
      impact_cost,
      severity,
      attack_details
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO incidents 
      (game_id, round_id, attack_type, targeted_asset_id, attacker_id, success, detected, 
       detection_time_hours, impact_cost, severity, attack_details)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [game_id, round_id, attack_type, targeted_asset_id, attacker_id, success, detected,
       detection_time_hours, impact_cost, severity, JSON.stringify(attack_details)]
    );
    
    res.json({ success: true, incident: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get incidents for game
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM incidents WHERE game_id = $1 ORDER BY timestamp DESC',
      [gameId]
    );
    
    res.json({ incidents: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update incident status
router.put('/:incidentId/status', async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { status, response_time_hours } = req.body;
    
    const result = await pool.query(
      'UPDATE incidents SET status = $1, response_time_hours = $2 WHERE id = $3 RETURNING *',
      [status, response_time_hours, incidentId]
    );
    
    res.json({ success: true, incident: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve incident
router.post('/:incidentId/resolve', async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { resolution_type, cost, time_to_resolve_hours, data_recovered_percent } = req.body;
    
    const result = await pool.query(
      `INSERT INTO incidents_resolved 
      (incident_id, resolution_type, cost, time_to_resolve_hours, data_recovered_percent)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [incidentId, resolution_type, cost, time_to_resolve_hours, data_recovered_percent]
    );
    
    await pool.query(
      'UPDATE incidents SET status = $1 WHERE id = $2',
      ['RESOLVED', incidentId]
    );
    
    res.json({ success: true, resolution: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;