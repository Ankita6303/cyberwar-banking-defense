import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';

function ScoreBoard({ gameState, currentPlayer }) {
  const playerScore = gameState.scores?.[currentPlayer.id] || 0;

  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a' }}>
      <Typography variant="h6" gutterBottom>
        Your Score
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h3" color="primary">
          {playerScore}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          / 100 points
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={playerScore}
        sx={{ height: 10, borderRadius: 5 }}
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Breakdown:
        </Typography>
        <Typography variant="body2">
          Prevention: 0 | Detection: 0 | Response: 0
        </Typography>
      </Box>
    </Paper>
  );
}

export default ScoreBoard;