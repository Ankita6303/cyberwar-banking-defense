const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Deploy security measure
router.post('/measures', async (req, res) => {
  try {
    const {
      game_id,
      player_id,
      round_id,
      asset_id,
      measure_type,
      effectiveness,
      cost,
      implementation_time_days
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO security_measures 
      (game_id, player_id, round_id, asset_id, measure_type, effectiveness, cost, implementation_time_days)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [game_id, player_id, round_id, asset_id, measure_type, effectiveness, cost, implementation_time_days]
    );
    
    res.json({ success: true, measure: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get security measures for game
router.get('/measures/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM security_measures WHERE game_id = $1 ORDER BY applied_date DESC',
      [gameId]
    );
    
    res.json({ measures: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;