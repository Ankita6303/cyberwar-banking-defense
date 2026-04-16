const BaseAttack = require('./BaseAttack');

class RansomwareAttack extends BaseAttack {
  constructor() {
    super('Ransomware', 'RANSOMWARE', 90);
    this.detectionDifficulty = 30; // Easier to detect once deployed
    this.ransom_amount = 0;
    this.double_extortion = false; // Threaten to publish data
  }

  calculateImpact(asset, defenseLevel) {
    // Business interruption + ransom + recovery costs
    const revenuePerHour = asset.value_if_compromised / 8760; // Annual value / hours
    const downtime = this.calculateDowntime(asset, defenseLevel);
    
    const businessInterruption = revenuePerHour * downtime;
    this.ransom_amount = asset.value_if_compromised * 0.05; // 5% of asset value
    const recoveryCosts = asset.value_if_compromised * 0.1; // 10% recovery
    
    // If they have good backups, reduce impact
    const backupFactor = defenseLevel.hasBackups ? 0.5 : 1.0;
    
    return {
      totalImpact: (businessInterruption + recoveryCosts) * backupFactor,
      ransomDemand: this.ransom_amount,
      downtime: downtime,
      breakdown: {
        businessInterruption,
        recoveryCosts,
        potentialRansom: this.ransom_amount
      }
    };
  }

  calculateDowntime(asset, defenseLevel) {
    // Hours of downtime
    let baseDowntime = 168; // 7 days worst case
    
    if (defenseLevel.hasBackups) {
      baseDowntime = 48; // 2 days with backups
    }
    
    if (defenseLevel.hasImmutableBackups) {
      baseDowntime = 24; // 1 day with immutable backups
    }
    
    return baseDowntime * (asset.criticality / 100);
  }

  enableDoubleExtortion(stolenDataValue) {
    this.double_extortion = true;
    this.ransom_amount *= 2; // Double the ransom
    this.stolenDataValue = stolenDataValue;
  }

  negotiateRansom(offer) {
    // Simple negotiation logic
    const acceptanceThreshold = this.ransom_amount * 0.6; // Will accept 60%+
    
    if (offer >= acceptanceThreshold) {
      return {
        accepted: true,
        finalAmount: offer,
        decryptionKey: this.generateDecryptionKey()
      };
    }
    
    return {
      accepted: false,
      counterOffer: this.ransom_amount * 0.8
    };
  }

  generateDecryptionKey() {
    return 'DECRYPT_' + Math.random().toString(36).substring(7);
  }
}

module.exports = RansomwareAttack;