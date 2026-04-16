import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Slider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { defenseAPI } from '../../services/api';
import { useGame } from '../../contexts/GameContext';

const SECURITY_CONTROLS = [
  { id: 'firewall', name: 'Firewall', cost: 500000, effectiveness: 40, category: 'Prevention' },
  { id: 'ids_ips', name: 'IDS/IPS', cost: 750000, effectiveness: 50, category: 'Prevention' },
  { id: 'edr', name: 'EDR', cost: 1000000, effectiveness: 60, category: 'Prevention' },
  { id: 'mfa', name: 'Multi-Factor Auth', cost: 200000, effectiveness: 70, category: 'Prevention' },
  { id: 'siem', name: 'SIEM', cost: 1500000, effectiveness: 70, category: 'Detection' },
  { id: 'threatIntel', name: 'Threat Intelligence', cost: 500000, effectiveness: 50, category: 'Detection' },
  { id: 'incidentResponseTeam', name: 'IR Team', cost: 2000000, effectiveness: 80, category: 'Response' },
  { id: 'backups', name: 'Backups', cost: 500000, effectiveness: 90, category: 'Recovery' },
  { id: 'immutableBackups', name: 'Immutable Backups', cost: 1000000, effectiveness: 95, category: 'Recovery' },
  { id: 'ddosMitigation', name: 'DDoS Mitigation', cost: 600000, effectiveness: 90, category: 'Prevention' },
];

function DefenseControlPanel({ gameId, budget, selectedAsset }) {
  const { sendAction } = useGame();
  const [selectedControls, setSelectedControls] = useState([]);
  const [budgetAllocation, setBudgetAllocation] = useState({
    prevention: 40,
    detection: 30,
    response: 20,
    recovery: 10,
  });

  const handleControlToggle = (controlId) => {
    setSelectedControls((prev) =>
      prev.includes(controlId)
        ? prev.filter((id) => id !== controlId)
        : [...prev, controlId]
    );
  };

  const calculateTotalCost = () => {
    return selectedControls.reduce((total, controlId) => {
      const control = SECURITY_CONTROLS.find((c) => c.id === controlId);
      return total + (control?.cost || 0);
    }, 0);
  };

  const calculateDefenseScore = () => {
    let score = 0;
    selectedControls.forEach((controlId) => {
      const control = SECURITY_CONTROLS.find((c) => c.id === controlId);
      if (control) {
        score += control.effectiveness;
      }
    });
    return Math.min(100, score);
  };

  const handleDeployControls = async () => {
    const totalCost = calculateTotalCost();
    
    if (totalCost > budget) {
      alert('Insufficient budget!');
      return;
    }

    try {
      // Deploy each control
      for (const controlId of selectedControls) {
        const control = SECURITY_CONTROLS.find((c) => c.id === controlId);
        
        await defenseAPI.deployMeasure({
          game_id: gameId,
          player_id: 'current-player-id', // Replace with actual player ID
          round_id: 1,
          asset_id: selectedAsset?.id,
          measure_type: control.id,
          effectiveness: control.effectiveness,
          cost: control.cost,
          implementation_time_days: 7,
        });
      }

      // Send action via WebSocket
      sendAction({
        type: 'DEPLOY_CONTROL',
        data: {
          controls: selectedControls,
          totalCost: totalCost,
        },
      });

      alert('Controls deployed successfully!');
      setSelectedControls([]);
    } catch (error) {
      console.error('Error deploying controls:', error);
      alert('Failed to deploy controls');
    }
  };

  const handleBudgetAllocation = () => {
    sendAction({
      type: 'ALLOCATE_BUDGET',
      data: {
        allocation: budgetAllocation,
        controls: selectedControls,
      },
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalCost = calculateTotalCost();
  const defenseScore = calculateDefenseScore();
  const remainingBudget = budget - totalCost;

  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a', height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Defense Control Panel
      </Typography>

      {/* Budget Summary */}
      <Card sx={{ mb: 2, backgroundColor: '#0a0e27' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Total Budget
          </Typography>
          <Typography variant="h5" color="primary">
            {formatCurrency(budget)}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Selected Controls Cost
            </Typography>
            <Typography variant="h6" color={totalCost > budget ? 'error' : 'success'}>
              {formatCurrency(totalCost)}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Remaining Budget
            </Typography>
            <Typography variant="h6" color={remainingBudget < 0 ? 'error' : 'inherit'}>
              {formatCurrency(remainingBudget)}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Defense Score
            </Typography>
            <Typography variant="h6" color="success">
              {defenseScore}/100
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Budget Allocation Sliders */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Budget Allocation
        </Typography>
        
        {Object.keys(budgetAllocation).map((category) => (
          <Box key={category} sx={{ mb: 1 }}>
            <Typography variant="caption">
              {category.charAt(0).toUpperCase() + category.slice(1)}: {budgetAllocation[category]}%
            </Typography>
            <Slider
              value={budgetAllocation[category]}
              onChange={(e, value) =>
                setBudgetAllocation({ ...budgetAllocation, [category]: value })
              }
              min={0}
              max={100}
              size="small"
            />
          </Box>
        ))}
        
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={handleBudgetAllocation}
          sx={{ mt: 1 }}
        >
          Allocate Budget
        </Button>
      </Box>

      {/* Security Controls */}
      <Typography variant="subtitle2" gutterBottom>
        Available Security Controls
      </Typography>
      
      <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
        {SECURITY_CONTROLS.map((control) => (
          <ListItem
            key={control.id}
            dense
            sx={{
              backgroundColor: selectedControls.includes(control.id)
                ? 'rgba(33, 150, 243, 0.1)'
                : 'transparent',
              borderRadius: 1,
              mb: 0.5,
            }}
          >
            <Checkbox
              checked={selectedControls.includes(control.id)}
              onChange={() => handleControlToggle(control.id)}
              size="small"
            />
            <ListItemText
              primary={control.name}
              secondary={
                <Box>
                  <Chip
                    label={control.category}
                    size="small"
                    sx={{ mr: 1, fontSize: '10px' }}
                  />
                  <Typography variant="caption" component="span">
                    {formatCurrency(control.cost)} | {control.effectiveness}% effective
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Deploy Button */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleDeployControls}
        disabled={selectedControls.length === 0 || totalCost > budget}
        sx={{ mt: 2 }}
      >
        Deploy Selected Controls ({selectedControls.length})
      </Button>

      {selectedAsset && (
        <Box sx={{ mt: 2, p: 1, backgroundColor: '#0a0e27', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Selected Asset: {selectedAsset.asset_name}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default DefenseControlPanel;