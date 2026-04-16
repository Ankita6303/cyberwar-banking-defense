const BaseAttack = require('./BaseAttack');

class InfrastructureSabotageAttack extends BaseAttack {
  constructor() {
    super('Infrastructure Sabotage', 'INFRASTRUCTURE_SABOTAGE', 100);
    this.detectionDifficulty = 50;
    this.hasPhysicalComponent = true;
    this.hasCyberComponent = true;
  }

  calculateImpact(asset, defenseLevel) {
    // Catastrophic impact - targets critical infrastructure
    const systemDowntime = 720; // 30 days
    const revenuePerHour = asset.value_if_compromised / 8760;
    
    const businessInterruption = revenuePerHour * systemDowntime;
    const infrastructureReplacement = asset.value_if_compromised * 0.8;
    const nationalSecurityCost = 10000000; // $10M
    const emergencyResponse = 5000000; // $5M
    
    return {
      totalImpact: businessInterruption + infrastructureReplacement + 
                   nationalSecurityCost + emergencyResponse,
      downtime: systemDowntime,
      breakdown: {
        businessInterruption,
        infrastructureReplacement,
        nationalSecurity: nationalSecurityCost,
        emergencyResponse
      }
    };
  }

  requiresPhysicalAccess() {
    return this.hasPhysicalComponent;
  }

  triggersNationalSecurityResponse() {
    return true;
  }
}

module.exports = InfrastructureSabotageAttack;