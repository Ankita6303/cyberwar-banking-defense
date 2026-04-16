const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Create player
router.post('/', async (req, res) => {
  try {
    const { username, email, role } = req.body;
    
    const result = await pool.query(
      'INSERT INTO players (username, email, role) VALUES ($1, $2, $3) RETURNING *',
      [username, email, role]
    );
    
    res.json({ success: true, player: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all players
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY created_at DESC');
    res.json({ players: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player scores for a game
router.get('/:playerId/scores/:gameId', async (req, res) => {
  try {
    const { playerId, gameId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM player_scores WHERE player_id = $1 AND game_id = $2 ORDER BY round_number',
      [playerId, gameId]
    );
    
    res.json({ scores: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;