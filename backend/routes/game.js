const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Create new game
router.post('/', async (req, res) => {
  try {
    const { game_name, max_rounds } = req.body;
    
    const result = await pool.query(
      'INSERT INTO game_sessions (game_name, max_rounds) VALUES ($1, $2) RETURNING *',
      [game_name, max_rounds || 8]
    );
    
    res.json({ success: true, game: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM game_sessions ORDER BY created_at DESC'
    );
    res.json({ games: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific game
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM game_sessions WHERE id = $1',
      [gameId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({ game: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start game
router.post('/:gameId/start', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const result = await pool.query(
      'UPDATE game_sessions SET status = $1, started_at = NOW() WHERE id = $2 RETURNING *',
      ['ACTIVE', gameId]
    );
    
    res.json({ success: true, game: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End game
router.post('/:gameId/end', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const result = await pool.query(
      'UPDATE game_sessions SET status = $1, ended_at = NOW() WHERE id = $2 RETURNING *',
      ['FINISHED', gameId]
    );
    
    res.json({ success: true, game: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game statistics
router.get('/:gameId/stats', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const incidents = await pool.query(
      'SELECT COUNT(*) as total, attack_type, AVG(impact_cost) as avg_cost FROM incidents WHERE game_id = $1 GROUP BY attack_type',
      [gameId]
    );
    
    const measures = await pool.query(
      'SELECT COUNT(*) as total, measure_type FROM security_measures WHERE game_id = $1 GROUP BY measure_type',
      [gameId]
    );
    
    res.json({
      incidents: incidents.rows,
      securityMeasures: measures.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;