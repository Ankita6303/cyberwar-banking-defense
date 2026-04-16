const DefenseControls = require('./Controls');

class BudgetAllocator {
  constructor(totalBudget) {
    this.totalBudget = totalBudget;
    this.defenseControls = new DefenseControls();
    this.allocation = {
      prevention: 0,
      detection: 0,
      response: 0,
      recovery: 0,
      training: 0
    };
    this.selectedControls = [];
  }

  allocateBudget(allocations) {
    // Validate total doesn't exceed budget
    const total = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    
    if (total > this.totalBudget) {
      throw new Error(`Budget exceeded: ${total} > ${this.totalBudget}`);
    }
    
    this.allocation = allocations;
    return this.calculateROI();
  }

  selectControls(controls) {
    // Validate controls fit within budget
    const totalCost = this.defenseControls.getTotalCost(controls);
    
    if (totalCost > this.totalBudget) {
      throw new Error(`Control costs exceed budget: ${totalCost} > ${this.totalBudget}`);
    }
    
    this.selectedControls = controls;
    return this.defenseControls.calculateDefenseStrength(this.totalBudget, controls);
  }

  calculateROI() {
    // Return on Security Investment
    const defenseStrength = this.defenseControls.calculateDefenseStrength(
      this.totalBudget, 
      this.selectedControls
    );
    
    // Estimate risk reduction
    const baselineRisk = 10000000; // $10M expected annual loss without controls
    const residualRisk = baselineRisk * (1 - defenseStrength.overall / 100);
    const riskReduction = baselineRisk - residualRisk;
    
    const controlCosts = this.defenseControls.getTotalCost(this.selectedControls);
    const roi = ((riskReduction - controlCosts) / controlCosts) * 100;
    
    return {
      riskReduction: riskReduction,
      investment: controlCosts,
      roi: roi,
      defenseStrength: defenseStrength
    };
  }

  optimizeBudget(riskProfile) {
    // Auto-optimize based on risk profile
    // High ransomware risk -> invest more in backups and prevention
    // High DDoS risk -> invest in DDoS mitigation
    
    const recommendations = [];
    
    if (riskProfile.ransomware > 70) {
      recommendations.push('immutableBackups', 'edr', 'backups');
    }
    
    if (riskProfile.ddos > 70) {
      recommendations.push('ddosMitigation');
    }
    
    if (riskProfile.dataBreach > 70) {
      recommendations.push('encryption', 'dlp', 'siem');
    }
    
    if (riskProfile.insider > 70) {
      recommendations.push('mfa', 'securityTraining', 'anomalyDetection');
    }
    
    return recommendations;
  }

  getBudgetSummary() {
    return {
      total: this.totalBudget,
      allocated: this.allocation,
      remaining: this.totalBudget - Object.values(this.allocation).reduce((a, b) => a + b, 0),
      controls: this.selectedControls,
      controlCosts: this.defenseControls.getTotalCost(this.selectedControls)
    };
  }
}

module.exports = BudgetAllocator;