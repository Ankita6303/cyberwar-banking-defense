import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Chip,
} from '@mui/material';
import { useGame } from '../contexts/GameContext';
import { assetAPI, incidentAPI } from '../services/api';

import NetworkVisualization from '../components/Network/NetworkVisualization';
import IncidentDashboard from '../components/Incidents/IncidentDashboard';
import DefenseControlPanel from '../components/Defense/DefenseControlPanel';
import AttackInterface from '../components/Attacks/AttackInterface';
import ScoreBoard from '../components/Dashboard/ScoreBoard';
import RoundInfo from '../components/Dashboard/RoundInfo';

function GameBoard() {
  const { gameId } = useParams();
  const { gameState, currentPlayer, nextRound, connected } = useGame();
  
  const [assets, setAssets] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    loadAssets();
    loadIncidents();
  }, [gameId]);

  useEffect(() => {
    // Refresh incidents when game state updates
    if (gameState.activeIncidents) {
      setIncidents(gameState.activeIncidents);
    }
  }, [gameState]);

  const loadAssets = async () => {
    try {
      const response = await assetAPI.getGameAssets(gameId);
      setAssets(response.data.assets);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const loadIncidents = async () => {
    try {
      const response = await incidentAPI.getGameIncidents(gameId);
      setIncidents(response.data.incidents);
    } catch (error) {
      console.error('Error loading incidents:', error);
    }
  };

  const handleNextRound = () => {
    nextRound();
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#0a0e27' }}>
      {/* Top AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#1a1f3a' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cyberwar Banking Defense
          </Typography>
          
          <Chip 
            label={`Role: ${currentPlayer.role}`} 
            color="primary" 
            sx={{ mr: 2 }}
          />
          
          <Chip 
            label={`Round ${gameState.round}/${gameState.maxRounds}`} 
            color="secondary" 
            sx={{ mr: 2 }}
          />
          
          <Chip 
            label={connected ? '🟢 Connected' : '🔴 Disconnected'} 
            color={connected ? 'success' : 'error'}
            sx={{ mr: 2 }}
          />
          
          <Button 
            variant="contained" 
            color="warning"
            onClick={handleNextRound}
            disabled={gameState.state !== 'ACTIVE'}
          >
            Next Round
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Round Info and Scores */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RoundInfo gameState={gameState} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ScoreBoard gameState={gameState} currentPlayer={currentPlayer} />
              </Grid>
            </Grid>
          </Grid>

          {/* Network Visualization */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a', height: 500 }}>
              <Typography variant="h6" gutterBottom>
                Banking Infrastructure Network
              </Typography>
              <NetworkVisualization 
                assets={assets}
                incidents={incidents}
                onAssetSelect={handleAssetSelect}
                selectedAsset={selectedAsset}
              />
            </Paper>
          </Grid>

          {/* Role-Specific Panel */}
          <Grid item xs={12} lg={4}>
            {currentPlayer.role === 'CISO' && (
              <DefenseControlPanel 
                gameId={gameId}
                budget={currentPlayer.budget}
                selectedAsset={selectedAsset}
              />
            )}
            
            {currentPlayer.role === 'ATTACKER' && (
              <AttackInterface 
                gameId={gameId}
                assets={assets}
                selectedAsset={selectedAsset}
              />
            )}
            
            {currentPlayer.role === 'REGULATOR' && (
              <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a' }}>
                <Typography variant="h6">Regulator Controls</Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor compliance and impose penalties
                </Typography>
              </Paper>
            )}
            
            {currentPlayer.role === 'INSURER' && (
              <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a' }}>
                <Typography variant="h6">Insurance Controls</Typography>
                <Typography variant="body2" color="text.secondary">
                  Assess risks and manage claims
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Incident Dashboard */}
          <Grid item xs={12}>
            <IncidentDashboard 
              incidents={incidents}
              gameId={gameId}
              currentPlayer={currentPlayer}
              onIncidentUpdate={loadIncidents}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default GameBoard;