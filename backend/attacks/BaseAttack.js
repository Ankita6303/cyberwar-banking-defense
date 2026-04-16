class BaseAttack {
  constructor(name, type, severity) {
    this.name = name;
    this.type = type;
    this.severity = severity; // 1-100
    this.detectionDifficulty = 50; // Default
  }

  calculateImpact(asset, defenseLevel) {
    // Override in specific attack types
    throw new Error('calculateImpact must be implemented');
  }

  execute(asset, attackerSkill, defenses) {
    const attackResult = this.attemptCompromise(asset, attackerSkill, defenses);
    
    if (attackResult.success) {
      return {
        success: true,
        impact: this.calculateImpact(asset, defenses.level),
        detectionTime: this.calculateDetectionTime(defenses),
        recoveryTime: this.calculateRecoveryTime(asset),
        cascadingEffects: this.calculateCascading(asset)
      };
    }
    
    return { success: false, detected: attackResult.detected };
  }

  attemptCompromise(asset, attackerSkill, defenses) {
    const successProb = this.calculateSuccessProbability(asset, attackerSkill, defenses);
    const detectionProb = this.calculateDetectionProbability(defenses);
    
    return {
      success: Math.random() < successProb,
      detected: Math.random() < detectionProb
    };
  }

  calculateSuccessProbability(asset, attackerSkill, defenses) {
    const exposure = asset.exposure / 100;
    const skill = attackerSkill / 100;
    const defense = defenses.level / 100;
    
    return Math.max(0, Math.min(1, (exposure + skill - defense) / 2));
  }

  calculateDetectionProbability(defenses) {
    return (defenses.detection / 100) * (1 - this.detectionDifficulty / 100);
  }

  calculateDetectionTime(defenses) {
    // Hours to detect
    const baseTime = 72; // 3 days worst case
    const detectionFactor = defenses.detection / 100;
    return Math.max(1, baseTime * (1 - detectionFactor));
  }

  calculateRecoveryTime(asset) {
    // Hours to recover
    const baseFactor = asset.criticality / 10;
    return baseFactor * 24; // Days * 24 hours
  }

  calculateCascading(asset) {
    // Impact on dependent systems
    return asset.dependent_systems.map(depId => ({
      systemId: depId,
      impactLevel: 0.3 * asset.value_if_compromised
    }));
  }
}

module.exports = BaseAttack;