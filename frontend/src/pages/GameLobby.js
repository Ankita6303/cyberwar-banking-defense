import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useGame } from '../contexts/GameContext';
import { playerAPI } from '../services/api';

const ROLES = [
  { value: 'CISO', label: 'Bank CISO', color: 'primary' },
  { value: 'ATTACKER', label: 'Red Team Attacker', color: 'error' },
  { value: 'REGULATOR', label: 'Financial Regulator', color: 'warning' },
  { value: 'INSURER', label: 'Cyber Insurance Provider', color: 'info' },
  { value: 'INFRASTRUCTURE_OFFICER', label: 'Infrastructure Officer', color: 'success' },
];

function GameLobby() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');
  
  const { gameState, joinGame, startGame, connected } = useGame();
  
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [playerId, setPlayerId] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinGame = async () => {
    if (!username || !selectedRole) {
      alert('Please enter username and select a role');
      return;
    }

    try {
      const response = await playerAPI.createPlayer(username, '', selectedRole);
      const newPlayerId = response.data.player.id;
      setPlayerId(newPlayerId);
      
      joinGame(gameId, newPlayerId, selectedRole);
      setHasJoined(true);
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Failed to join game');
    }
  };

  const handleStartGame = () => {
    startGame(gameId);
    navigate(`/game/${gameId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#1a1f3a' }}>
        <Typography variant="h3" gutterBottom>
          Game Lobby
        </Typography>
        
        <Box mb={3}>
          <Chip 
            label={connected ? 'Connected' : 'Disconnected'} 
            color={connected ? 'success' : 'error'}
            sx={{ mr: 2 }}
          />
          <Chip label={`Game ID: ${gameId}`} color="info" />
        </Box>

        <Grid container spacing={3}>
          {/* Join Game Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#0a0e27' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Join Game
                </Typography>
                
                {!hasJoined ? (
                  <Box>
                    <TextField
                      fullWidth
                      label="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      margin="normal"
                    />
                    
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Select Role</InputLabel>
                      <Select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        {ROLES.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleJoinGame}
                      disabled={!connected}
                      sx={{ mt: 2 }}
                    >
                      Join Game
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1" color="success.main" gutterBottom>
                      ✓ Successfully joined as {selectedRole}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleStartGame}
                      disabled={gameState.players.length < 2}
                      sx={{ mt: 2 }}
                    >
                      Start Game
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Players List */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#0a0e27' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Players ({gameState.players.length})
                </Typography>
                
                <List>
                  {gameState.players.map((player) => (
                    <ListItem key={player.id}>
                      <ListItemText
                        primary={player.id}
                        secondary={player.role}
                      />
                      <Chip
                        label={player.role}
                        color={ROLES.find(r => r.value === player.role)?.color || 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
                
                {gameState.players.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Waiting for players to join...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Role Descriptions */}
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Role Descriptions
          </Typography>
          <Grid container spacing={2}>
            {ROLES.map((role) => (
              <Grid item xs={12} md={6} key={role.value}>
                <Card sx={{ backgroundColor: '#0a0e27', height: '100%' }}>
                  <CardContent>
                    <Chip label={role.label} color={role.color} sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {getRoleDescription(role.value)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

function getRoleDescription(role) {
  const descriptions = {
    CISO: 'Protect banking infrastructure, allocate security budget, and respond to incidents.',
    ATTACKER: 'Exploit vulnerabilities, launch cyber attacks, and maximize damage.',
    REGULATOR: 'Ensure compliance, conduct examinations, and impose penalties.',
    INSURER: 'Price cyber insurance policies, assess risks, and manage claims.',
    INFRASTRUCTURE_OFFICER: 'Coordinate defense across institutions and protect critical systems.',
  };
  return descriptions[role] || '';
}

export default GameLobby;