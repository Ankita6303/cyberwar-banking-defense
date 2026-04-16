import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';

function RoundInfo({ gameState }) {
  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a' }}>
      <Typography variant="h6" gutterBottom>
        Game Status
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          label={`Round ${gameState.round}/${gameState.maxRounds}`}
          color="secondary"
        />
        <Chip
          label={gameState.state}
          color={gameState.state === 'ACTIVE' ? 'success' : 'default'}
        />
        <Chip
          label={`${gameState.players?.length || 0} Players`}
          color="info"
        />
      </Box>

      <Typography variant="body2" color="text.secondary">
        Active Incidents: {gameState.activeIncidents?.length || 0}
      </Typography>
    </Paper>
  );
}

export default RoundInfo;