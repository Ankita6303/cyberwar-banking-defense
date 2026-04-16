const BaseAttack = require('./BaseAttack');

class InsiderThreatAttack extends BaseAttack {
  constructor(insiderType) {
    super('Insider Threat', 'INSIDER_THREAT', 80);
    this.insiderType = insiderType; // 'MALICIOUS' or 'NEGLIGENT'
    this.detectionDifficulty = this.insiderType === 'MALICIOUS' ? 80 : 40;
    this.accessLevel = 'NORMAL';
  }

  calculateImpact(asset, defenseLevel) {
    let impactMultiplier = 1.0;
    
    if (this.accessLevel === 'PRIVILEGED') {
      impactMultiplier = 2.0; // Privileged access = 2x damage
    }
    
    if (this.insiderType === 'MALICIOUS') {
      const dataTheft = asset.value_if_compromised * 0.5;
      const sabotage = asset.value_if_compromised * 0.3;
      const investigation = 750000;
      
      return {
        totalImpact: (dataTheft + sabotage + investigation) * impactMultiplier,
        breakdown: {
          dataTheft,
          sabotage,
          investigationCosts: investigation
        }
      };
    } else {
      // Negligent - accidental exposure
      const dataExposure = asset.value_if_compromised * 0.2;
      const remediation = 250000;
      
      return {
        totalImpact: (dataExposure + remediation) * impactMultiplier,
        breakdown: {
          dataExposure,
          remediationCosts: remediation
        }
      };
    }
  }

  setAccessLevel(level) {
    // 'NORMAL', 'PRIVILEGED', 'ADMIN'
    this.accessLevel = level;
  }

  bypassesPerimeterDefense() {
    return true; // Insiders are already inside
  }
}

module.exports = InsiderThreatAttack;