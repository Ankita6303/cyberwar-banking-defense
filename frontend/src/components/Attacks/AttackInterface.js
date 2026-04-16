import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useGame } from '../../contexts/GameContext';
import { attackAPI } from '../../services/api';

const ATTACK_TYPES = [
  { value: 'Ransomware', label: 'Ransomware', severity: 90, color: 'error' },
  { value: 'DDoS', label: 'DDoS Attack', severity: 60, color: 'warning' },
  { value: 'DataBreach', label: 'Data Breach', severity: 85, color: 'error' },
  { value: 'SupplyChain', label: 'Supply Chain', severity: 95, color: 'error' },
  { value: 'InsiderThreat', label: 'Insider Threat', severity: 80, color: 'warning' },
  { value: 'InfrastructureSabotage', label: 'Infrastructure Sabotage', severity: 100, color: 'error' },
];

function AttackInterface({ gameId, assets, selectedAsset }) {
  const { sendAction } = useGame();
  const [selectedAttack, setSelectedAttack] = useState('');
  const [targetAsset, setTargetAsset] = useState('');
  const [attackHistory, setAttackHistory] = useState([]);

  const handleLaunchAttack = () => {
    if (!selectedAttack || !targetAsset) {
      alert('Please select attack type and target');
      return;
    }

    const attack = {
      type: 'LAUNCH_ATTACK',
      data: {
        attackType: selectedAttack,
        targetAssetId: targetAsset,
        attackerSkill: 75,
      },
    };

    sendAction(attack);

    setAttackHistory([
      {
        id: Date.now(),
        type: selectedAttack,
        target: assets.find(a => a.id === targetAsset)?.asset_name,
        timestamp: new Date().toISOString(),
      },
      ...attackHistory,
    ]);

    setSelectedAttack('');
    setTargetAsset('');
  };

  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a', height: '100%' }}>
      <Typography variant="h6" gutterBottom color="error">
        Attack Interface
      </Typography>

      {/* Attack Selection */}
      <Card sx={{ mb: 2, backgroundColor: '#0a0e27' }}>
        <CardContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Attack Type</InputLabel>
            <Select
              value={selectedAttack}
              onChange={(e) => setSelectedAttack(e.target.value)}
            >
              {ATTACK_TYPES.map((attack) => (
                <MenuItem key={attack.value} value={attack.value}>
                  {attack.label} (Severity: {attack.severity})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Target Asset</InputLabel>
            <Select
              value={targetAsset}
              onChange={(e) => setTargetAsset(e.target.value)}
            >
              {assets.map((asset) => (
                <MenuItem key={asset.id} value={asset.id}>
                  {asset.asset_name} (Security: {asset.security_level})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedAttack && (
            <Box sx={{ mt: 2, p: 1, backgroundColor: '#1a1f3a', borderRadius: 1 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Attack Details:
              </Typography>
              <Typography variant="body2">
                {getAttackDescription(selectedAttack)}
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleLaunchAttack}
            disabled={!selectedAttack || !targetAsset}
            sx={{ mt: 2 }}
          >
            Launch Attack
          </Button>
        </CardContent>
      </Card>

      {/* Attack History */}
      <Typography variant="subtitle2" gutterBottom>
        Attack History ({attackHistory.length})
      </Typography>
      
      <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
        {attackHistory.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No attacks launched yet"
              secondary="Select an attack type and target to begin"
            />
          </ListItem>
        ) : (
          attackHistory.map((attack) => (
            <ListItem key={attack.id} sx={{ backgroundColor: '#0a0e27', mb: 1, borderRadius: 1 }}>
              <ListItemText
                primary={
                  <Box>
                    <Chip
                      label={attack.type}
                      size="small"
                      color="error"
                      sx={{ mr: 1 }}
                    />
                    {attack.target}
                  </Box>
                }
                secondary={new Date(attack.timestamp).toLocaleTimeString()}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}

function getAttackDescription(attackType) {
  const descriptions = {
    Ransomware: 'Encrypt critical data and demand ransom payment. High impact on operations.',
    DDoS: 'Flood systems with traffic to deny service. Affects customer-facing systems.',
    DataBreach: 'Steal customer data for sale on dark web. Massive regulatory fines.',
    SupplyChain: 'Compromise through vendor software. Affects multiple systems.',
    InsiderThreat: 'Exploit legitimate access to steal or sabotage. Hard to detect.',
    InfrastructureSabotage: 'Physical + cyber attack on critical infrastructure. Catastrophic impact.',
  };
  return descriptions[attackType] || 'No description available';
}

export default AttackInterface;