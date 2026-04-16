class DefenseControls {
  constructor() {
    this.controls = {
      // Prevention (40% of effectiveness)
      firewall: { cost: 500000, effectiveness: 0.4, category: 'prevention' },
      ids_ips: { cost: 750000, effectiveness: 0.5, category: 'prevention' },
      waf: { cost: 300000, effectiveness: 0.3, category: 'prevention' },
      edr: { cost: 1000000, effectiveness: 0.6, category: 'prevention' },
      encryption: { cost: 400000, effectiveness: 0.5, category: 'prevention' },
      mfa: { cost: 200000, effectiveness: 0.7, category: 'prevention' },
      
      // Detection (30% of effectiveness)
      siem: { cost: 1500000, effectiveness: 0.7, category: 'detection' },
      threatIntel: { cost: 500000, effectiveness: 0.5, category: 'detection' },
      anomalyDetection: { cost: 800000, effectiveness: 0.6, category: 'detection' },
      
      // Response (30% of effectiveness)
      incidentResponseTeam: { cost: 2000000, effectiveness: 0.8, category: 'response' },
      soar: { cost: 1000000, effectiveness: 0.6, category: 'response' },
      forensicTools: { cost: 300000, effectiveness: 0.4, category: 'response' },
      
      // Recovery
      backups: { cost: 500000, effectiveness: 0.9, category: 'recovery' },
      immutableBackups: { cost: 1000000, effectiveness: 0.95, category: 'recovery' },
      disasterRecovery: { cost: 1500000, effectiveness: 0.8, category: 'recovery' },
      
      // Other
      securityTraining: { cost: 300000, effectiveness: 0.5, category: 'training' },
      penetrationTesting: { cost: 400000, effectiveness: 0.4, category: 'training' },
      ddosMitigation: { cost: 600000, effectiveness: 0.9, category: 'prevention' }
    };
  }

  calculateDefenseStrength(allocatedBudget, selectedControls) {
    let preventionScore = 0;
    let detectionScore = 0;
    let responseScore = 0;
    let recoveryScore = 0;
    
    selectedControls.forEach(controlName => {
      const control = this.controls[controlName];
      if (!control) return;
      
      switch(control.category) {
        case 'prevention':
          preventionScore += control.effectiveness;
          break;
        case 'detection':
          detectionScore += control.effectiveness;
          break;
        case 'response':
          responseScore += control.effectiveness;
          break;
        case 'recovery':
          recoveryScore += control.effectiveness;
          break;
      }
    });
    
    // Normalize scores (diminishing returns)
    preventionScore = Math.min(100, preventionScore * 40);
    detectionScore = Math.min(100, detectionScore * 30);
    responseScore = Math.min(100, responseScore * 30);
    recoveryScore = Math.min(100, recoveryScore * 20);
    
    return {
      overall: (preventionScore + detectionScore + responseScore) / 3,
      prevention: preventionScore,
      detection: detectionScore,
      response: responseScore,
      recovery: recoveryScore
    };
  }

  getTotalCost(selectedControls) {
    return selectedControls.reduce((total, controlName) => {
      return total + (this.controls[controlName]?.cost || 0);
    }, 0);
  }
}

module.exports = DefenseControls;