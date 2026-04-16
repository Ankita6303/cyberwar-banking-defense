const BaseAttack = require('./BaseAttack');

class SupplyChainAttack extends BaseAttack {
  constructor() {
    super('Supply Chain Attack', 'SUPPLY_CHAIN', 95);
    this.detectionDifficulty = 85; // Very hard to detect
    this.affectedVendors = [];
    this.compromisedSoftware = null;
  }

  calculateImpact(asset, defenseLevel) {
    // Supply chain attacks affect multiple systems
    const numberOfAffectedSystems = Math.floor(Math.random() * 10) + 5;
    
    const perSystemImpact = asset.value_if_compromised * 0.3;
    const totalImpact = perSystemImpact * numberOfAffectedSystems;
    
    const remediationCost = 2000000; // $2M to replace compromised software
    const reputationDamage = 5000000; // $5M reputation hit
    const forensicCosts = 1000000; // $1M investigation
    
    return {
      totalImpact: totalImpact + remediationCost + reputationDamage + forensicCosts,
      affectedSystems: numberOfAffectedSystems,
      breakdown: {
        systemDamage: totalImpact,
        remediation: remediationCost,
        reputation: reputationDamage,
        forensics: forensicCosts
      }
    };
  }

  setCompromisedSoftware(softwareName, vendorName) {
    this.compromisedSoftware = softwareName;
    this.affectedVendors.push(vendorName);
  }

  getAffectedSystems(allAssets) {
    // Return all systems using the compromised software
    return allAssets.filter(asset => 
      asset.dependencies && asset.dependencies.includes(this.compromisedSoftware)
    );
  }
}

module.exports = SupplyChainAttack;