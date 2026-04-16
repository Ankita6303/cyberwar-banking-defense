import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { incidentAPI } from '../../services/api';

function IncidentDashboard({ incidents, gameId, currentPlayer, onIncidentUpdate }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState('');
  const [responseStrategy, setResponseStrategy] = useState('');

  const handleRespondClick = (incident) => {
    if (currentPlayer.role !== 'CISO') {
      alert('Only CISO can respond to incidents');
      return;
    }
    setSelectedIncident(incident);
    setResponseDialogOpen(true);
  };

  const handleResponseSubmit = async () => {
    try {
      if (responseAction === 'CONTAIN') {
        await incidentAPI.updateIncidentStatus(
          selectedIncident.id,
          'CONTAINED',
          2.5 // response time in hours
        );
      } else if (responseAction === 'RESOLVE') {
        await incidentAPI.resolveIncident(selectedIncident.id, {
          resolution_type: responseStrategy,
          cost: calculateResolutionCost(responseStrategy),
          time_to_resolve_hours: 24,
          data_recovered_percent: 95,
        });
      }

      setResponseDialogOpen(false);
      setResponseAction('');
      setResponseStrategy('');
      onIncidentUpdate();
    } catch (error) {
      console.error('Error responding to incident:', error);
      alert('Failed to respond to incident');
    }
  };

  const calculateResolutionCost = (strategy) => {
    const costs = {
      RESTORE_FROM_BACKUP: 100000,
      REBUILD_FROM_SCRATCH: 1000000,
      PAY_RANSOM: 5000000,
    };
    return costs[strategy] || 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      DETECTED: 'warning',
      CONTAINED: 'info',
      ERADICATING: 'secondary',
      RESOLVED: 'success',
    };
    return colors[status] || 'default';
  };

  const getSeverityColor = (severity) => {
    if (severity >= 80) return 'error';
    if (severity >= 50) return 'warning';
    return 'info';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#1a1f3a' }}>
      <Typography variant="h5" gutterBottom>
        Active Incidents ({incidents.length})
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Target Asset</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Impact Cost</TableCell>
              <TableCell>Detection Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No incidents detected
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => (
                <TableRow key={incident.id} hover>
                  <TableCell>
                    <Chip 
                      label={incident.attack_type} 
                      size="small"
                      color="error"
                    />
                  </TableCell>
                  <TableCell>{incident.targeted_asset_id?.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <Chip
                      label={incident.severity || 50}
                      size="small"
                      color={getSeverityColor(incident.severity)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={incident.status}
                      size="small"
                      color={getStatusColor(incident.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency(incident.impact_cost || 0)}
                  </TableCell>
                  <TableCell>
                    {incident.detection_time_hours?.toFixed(1) || 'N/A'} hrs
                  </TableCell>
                  <TableCell>
                    {incident.status !== 'RESOLVED' && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleRespondClick(incident)}
                        disabled={currentPlayer.role !== 'CISO'}
                      >
                        Respond
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onClose={() => setResponseDialogOpen(false)}>
        <DialogTitle>Respond to Incident</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Action</InputLabel>
              <Select
                value={responseAction}
                onChange={(e) => setResponseAction(e.target.value)}
              >
                <MenuItem value="CONTAIN">Contain</MenuItem>
                <MenuItem value="RESOLVE">Resolve</MenuItem>
              </Select>
            </FormControl>

            {responseAction === 'RESOLVE' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Recovery Strategy</InputLabel>
                <Select
                  value={responseStrategy}
                  onChange={(e) => setResponseStrategy(e.target.value)}
                >
                  <MenuItem value="RESTORE_FROM_BACKUP">
                    Restore from Backup ($100K)
                  </MenuItem>
                  <MenuItem value="REBUILD_FROM_SCRATCH">
                    Rebuild from Scratch ($1M)
                  </MenuItem>
                  <MenuItem value="PAY_RANSOM">
                    Pay Ransom ($5M)
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {selectedIncident && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#0a0e27', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Attack Type:</strong> {selectedIncident.attack_type}
                </Typography>
                <Typography variant="body2">
                  <strong>Severity:</strong> {selectedIncident.severity}
                </Typography>
                <Typography variant="body2">
                  <strong>Current Status:</strong> {selectedIncident.status}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleResponseSubmit}
            variant="contained"
            disabled={!responseAction}
          >
            Submit Response
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default IncidentDashboard;