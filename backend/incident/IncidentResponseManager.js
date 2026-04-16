class IncidentResponseManager {
  constructor() {
    this.activeIncidents = new Map();
    this.incidentHistory = [];
    this.responseTeam = {
      available: true,
      currentIncident: null
    };
  }

  detectIncident(attack, asset, defenses) {
    const detectionTime = attack.calculateDetectionTime(defenses);
    const detectionProb = attack.calculateDetectionProbability(defenses);
    
    const detected = Math.random() < detectionProb;
    
    if (detected) {
      const incident = {
        id: this.generateIncidentId(),
        type: attack.type,
        severity: this.calculateSeverity(attack, asset),
        targetAsset: asset.id,
        detectedAt: new Date(),
        detectionTime: detectionTime,
        status: 'DETECTED',
        impact: null,
        containedAt: null,
        resolvedAt: null
      };
      
      this.activeIncidents.set(incident.id, incident);
      return incident;
    }
    
    return null;
  }

  containIncident(incidentId, containmentStrategy) {
    const incident = this.activeIncidents.get(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }
    
    // Containment strategies and their effectiveness
    const strategies = {
      ISOLATE_NETWORK: {
        effectiveness: 0.9,
        businessImpact: 0.8, // High disruption
        time: 0.5 // hours
      },
      BLOCK_C2: {
        effectiveness: 0.7,
        businessImpact: 0.1, // Low disruption
        time: 0.25
      },
      DISABLE_ACCOUNTS: {
        effectiveness: 0.6,
        businessImpact: 0.3,
        time: 0.1
      },
      ACTIVATE_BACKUPS: {
        effectiveness: 0.5,
        businessImpact: 0.4,
        time: 2
      }
    };
    
    const strategy = strategies[containmentStrategy];
    if (!strategy) {
      throw new Error('Invalid containment strategy');
    }
    
    // Calculate containment success
    const success = Math.random() < strategy.effectiveness;
    
    incident.containmentStrategy = containmentStrategy;
    incident.containmentSuccess = success;
    incident.containedAt = new Date(Date.now() + strategy.time * 3600000);
    incident.status = success ? 'CONTAINED' : 'ACTIVE';
    incident.businessImpact = strategy.businessImpact;
    
    return {
      success: success,
      incident: incident,
      nextSteps: this.getRecommendedNextSteps(incident)
    };
  }

  eradicateAttack(incidentId, eradicationMethod) {
    const incident = this.activeIncidents.get(incidentId);
    if (!incident || incident.status !== 'CONTAINED') {
      throw new Error('Incident must be contained before eradication');
    }
    
    const methods = {
      REBUILD: {
        thoroughness: 0.99,
        time: 72, // hours
        cost: 500000
      },
      MALWARE_REMOVAL: {
        thoroughness: 0.7,
        time: 4,
        cost: 50000
      },
      PATCH_VULNERABILITIES: {
        thoroughness: 0.8,
        time: 24,
        cost: 100000
      }
    };
    
    const method = methods[eradicationMethod];
    incident.eradicationMethod = eradicationMethod;
    incident.eradicationCost = method.cost;
    incident.eradicationTime = method.time;
    incident.status = 'ERADICATING';
    
    return incident;
  }

  recoverFromIncident(incidentId, recoveryStrategy) {
    const incident = this.activeIncidents.get(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }
    
    const strategies = {
      RESTORE_FROM_BACKUP: {
        success: 0.9,
        dataLoss: 0.05, // 5% data loss (RPO)
        time: 24,
        cost: 100000
      },
      REBUILD_FROM_SCRATCH: {
        success: 0.99,
        dataLoss: 0.1,
        time: 168, // 1 week
        cost: 1000000
      },
      PAY_RANSOM: {
        success: 0.7, // No guarantee
        dataLoss: 0,
        time: 48,
        cost: incident.ransomAmount || 5000000
      }
    };
    
    const strategy = strategies[recoveryStrategy];
    const success = Math.random() < strategy.success;
    
    if (success) {
      incident.status = 'RESOLVED';
      incident.resolvedAt = new Date(Date.now() + strategy.time * 3600000);
      incident.recoveryCost = strategy.cost;
      incident.dataLoss = strategy.dataLoss;
      
      this.incidentHistory.push(incident);
      this.activeIncidents.delete(incidentId);
    }
    
    return {
      success: success,
      incident: incident,
      totalCost: this.calculateTotalIncidentCost(incident)
    };
  }

  calculateTotalIncidentCost(incident) {
    const costs = {
      businessInterruption: incident.impact?.breakdown?.businessInterruption || 0,
      recovery: incident.recoveryCost || 0,
      eradication: incident.eradicationCost || 0,
      forensics: 500000, // Standard forensic investigation
      regulatory: incident.impact?.breakdown?.regulatoryFines || 0,
      reputation: incident.impact?.breakdown?.reputationDamage || 0,
      legal: incident.impact?.breakdown?.lawsuits || 0
    };
    
    const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    return {
      breakdown: costs,
      total: total
    };
  }

  calculateSeverity(attack, asset) {
    // Severity: 1 (Low) to 100 (Critical)
    const attackSeverity = attack.severity;
    const assetCriticality = asset.criticality;
    const dataValue = asset.data_sensitivity;
    
    return Math.min(100, (attackSeverity + assetCriticality + dataValue) / 3);
  }

  getRecommendedNextSteps(incident) {
    const steps = [];
    
    switch(incident.status) {
      case 'DETECTED':
        steps.push('Contain the incident immediately');
        steps.push('Preserve evidence for forensics');
        steps.push('Notify stakeholders');
        break;
      case 'CONTAINED':
        steps.push('Eradicate attacker access');
        steps.push('Patch vulnerabilities');
        steps.push('Begin recovery planning');
        break;
      case 'ERADICATING':
        steps.push('Monitor for persistence mechanisms');
        steps.push('Prepare recovery resources');
        break;
      case 'RESOLVED':
        steps.push('Conduct post-incident review');
        steps.push('Update security controls');
        steps.push('Share lessons learned');
        break;
    }
    
    return steps;
  }

  generateIncidentId() {
    return 'INC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  getActiveIncidents() {
    return Array.from(this.activeIncidents.values());
  }

  getIncidentHistory() {
    return this.incidentHistory;
  }

  getMetrics() {
    const resolved = this.incidentHistory.filter(i => i.status === 'RESOLVED');
    
    if (resolved.length === 0) {
      return {
        MTTD: 0, // Mean Time To Detect
        MTTR: 0, // Mean Time To Respond
        totalIncidents: 0,
        resolvedIncidents: 0
      };
    }
    
    const avgDetectionTime = resolved.reduce((sum, i) => sum + i.detectionTime, 0) / resolved.length;
    
    const avgResponseTime = resolved.reduce((sum, i) => {
      const responseTime = (i.resolvedAt - i.detectedAt) / 3600000; // hours
      return sum + responseTime;
    }, 0) / resolved.length;
    
    return {
      MTTD: avgDetectionTime,
      MTTR: avgResponseTime,
      totalIncidents: this.incidentHistory.length + this.activeIncidents.size,
      resolvedIncidents: resolved.length,
      activeIncidents: this.activeIncidents.size
    };
  }
}

module.exports = IncidentResponseManager;