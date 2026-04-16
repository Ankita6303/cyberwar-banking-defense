const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all assets for a game
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM bank_infrastructure WHERE game_id = $1 OR game_id IS NULL',
      [gameId]
    );
    
    res.json({ assets: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific asset
router.get('/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM bank_infrastructure WHERE id = $1',
      [assetId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json({ asset: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update asset security level
router.put('/:assetId/security', async (req, res) => {
  try {
    const { assetId } = req.params;
    const { security_level } = req.body;
    
    const result = await pool.query(
      'UPDATE bank_infrastructure SET security_level = $1 WHERE id = $2 RETURNING *',
      [security_level, assetId]
    );
    
    res.json({ success: true, asset: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;