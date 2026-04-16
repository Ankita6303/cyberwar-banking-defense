const BaseAttack = require('./BaseAttack');

class DDoSAttack extends BaseAttack {
  constructor(intensity) {
    super('DDoS Attack', 'DDOS', 60);
    this.intensity = intensity; // Gbps of traffic
    this.detectionDifficulty = 10; // Very easy to detect
    this.duration = 0;
  }

  calculateImpact(asset, defenseLevel) {
    // Impact is primarily downtime and mitigation costs
    this.duration = this.calculateAttackDuration(defenseLevel);
    
    const revenuePerHour = asset.value_if_compromised / 8760;
    const downtime = this.calculateDowntime(defenseLevel);
    
    const reputationDamage = asset.criticality * 100000; // $100K per criticality point
    const mitigationCosts = this.calculateMitigationCosts(this.intensity);
    const businessInterruption = revenuePerHour * downtime;
    
    return {
      totalImpact: businessInterruption + mitigationCosts + reputationDamage,
      downtime: downtime,
      breakdown: {
        businessInterruption,
        mitigationCosts,
        reputationDamage
      }
    };
  }

  calculateAttackDuration(defenseLevel) {
    // Hours
    let baseDuration = 96; // 4 days
    
    if (defenseLevel.hasDDoSMitigation) {
      baseDuration = 2; // 2 hours with mitigation
    }
    
    return baseDuration;
  }

  calculateDowntime(defenseLevel) {
    if (defenseLevel.hasDDoSMitigation) {
      return 0.5; // Minimal downtime with mitigation
    }
    
    // Without mitigation, proportional to attack intensity
    const baseDowntime = 24; // 1 day
    const intensityFactor = Math.min(2, this.intensity / 100); // Cap at 2x
    
    return baseDowntime * intensityFactor;
  }

  calculateMitigationCosts(intensity) {
    // Emergency DDoS mitigation services
    const baseCost = 50000; // $50K base
    const intensityCost = intensity * 5000; // $5K per Gbps
    
    return baseCost + intensityCost;
  }

  setIntensity(gbps) {
    this.intensity = gbps;
  }
}

module.exports = DDoSAttack;