import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { gameAPI } from '../services/api';

function LandingPage() {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      alert('Please enter a game name');
      return;
    }

    setLoading(true);
    try {
      const response = await gameAPI.createGame(gameName, 8);
      const gameId = response.data.game.id;
      navigate(`/lobby?gameId=${gameId}`);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <SecurityIcon sx={{ fontSize: 80, color: '#2196f3', mb: 2 }} />
          <Typography variant="h1" color="primary" gutterBottom>
            Cyberwar Banking Defense
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Real-time Cybersecurity Strategy Simulation
          </Typography>
        </Box>

        {/* Game Creation */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: '#1a1f3a' }}>
          <Typography variant="h4" gutterBottom>
            Create New Game
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Game Name"
                variant="outlined"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="e.g., Banking Cyber Defense 2024"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCreateGame}
                disabled={loading}
                sx={{ height: 56 }}
              >
                {loading ? 'Creating...' : 'Create Game'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Features */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: '#1a1f3a' }}>
              <CardContent>
                <Typography variant="h5" color="primary" gutterBottom>
                  🎯 5 Player Roles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bank CISO, Red Team Attacker, Regulator, Insurance Provider,
                  and Critical Infrastructure Officer
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: '#1a1f3a' }}>
              <CardContent>
                <Typography variant="h5" color="error" gutterBottom>
                  ⚠️ 6 Attack Types
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ransomware, DDoS, Data Breach, Supply Chain, Insider Threat,
                  Infrastructure Sabotage
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: '#1a1f3a' }}>
              <CardContent>
                <Typography variant="h5" color="success" gutterBottom>
                  🛡️ Defense Layers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prevention, Detection, Response, Recovery, and Hardening
                  controls
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Learning Objectives */}
        <Paper elevation={3} sx={{ p: 4, mt: 6, backgroundColor: '#1a1f3a' }}>
          <Typography variant="h4" gutterBottom>
            Learning Objectives
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                • Understand banking system cyber threat landscape
              </Typography>
              <Typography variant="body1" paragraph>
                • Analyze attack vectors and exploitation techniques
              </Typography>
              <Typography variant="body1" paragraph>
                • Design defense-in-depth security architectures
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                • Develop incident response procedures
              </Typography>
              <Typography variant="body1" paragraph>
                • Evaluate security investment trade-offs
              </Typography>
              <Typography variant="body1" paragraph>
                • Experience cascading impacts of security failures
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default LandingPage;