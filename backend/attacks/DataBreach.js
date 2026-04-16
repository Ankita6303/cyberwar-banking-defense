const BaseAttack = require('./BaseAttack');

class DataBreachAttack extends BaseAttack {
  constructor() {
    super('Data Breach', 'DATA_BREACH', 85);
    this.detectionDifficulty = 70; // Hard to detect
    this.recordsStolen = 0;
    this.dataTypes = [];
  }

  calculateImpact(asset, defenseLevel) {
    this.recordsStolen = this.calculateRecordsExposed(asset);
    
    const creditMonitoring = this.recordsStolen * 100; // $100 per customer
    const regulatoryFines = this.calculateRegulatoryFines(asset, this.recordsStolen);
    const lawsuits = this.calculateLawsuitCosts(this.recordsStolen);
    const reputationDamage = asset.criticality * 1000000; // $1M per point
    const forensics = 500000; // $500K investigation
    
    return {
      totalImpact: creditMonitoring + regulatoryFines + lawsuits + reputationDamage + forensics,
      recordsStolen: this.recordsStolen,
      breakdown: {
        creditMonitoring,
        regulatoryFines,
        lawsuits,
        reputationDamage,
        forensicCosts: forensics
      }
    };
  }

  calculateRecordsExposed(asset) {
    // Estimate based on asset value and sensitivity
    const baseRecords = 1000000; // 1M records
    const sensitivityFactor = asset.data_sensitivity / 100;
    
    return Math.floor(baseRecords * sensitivityFactor);
  }

  calculateRegulatoryFines(asset, records) {
    // GDPR-style fines: up to 4% of annual revenue
    const maxFine = asset.value_if_compromised * 0.04;
    const severityFactor = Math.min(1, records / 10000000); // Scale with records
    
    return maxFine * severityFactor;
  }

  calculateLawsuitCosts(records) {
    // Class action settlements
    const baseSettlement = 10000000; // $10M minimum
    const perRecordCost = 50; // $50 per record average
    
    return baseSettlement + (records * perRecordCost);
  }

  setDataTypes(types) {
    // ['PII', 'FINANCIAL', 'HEALTH', 'CREDENTIALS']
    this.dataTypes = types;
  }

  getDarkWebValue() {
    // Value of stolen data on dark web
    const valuePerRecord = {
      'PII': 10,
      'FINANCIAL': 100,
      'HEALTH': 250,
      'CREDENTIALS': 50
    };
    
    let totalValue = 0;
    this.dataTypes.forEach(type => {
      totalValue += this.recordsStolen * (valuePerRecord[type] || 5);
    });
    
    return totalValue;
  }
}

module.exports = DataBreachAttack;