function simulateAttack(asset, attack_type, attacker_skill) {
     const defense_strength = asset.security_level / 100;
     const exposure_factor = asset.exposure / 100;
     const attacker_advantage = attacker_skill / 100;
     
     const compromiseProb = (exposure_factor + attacker_advantage - defense_strength) / 2;
     
     if (Math.random() < compromiseProb) {
       return {
         success: true,
         impact: asset.value_if_compromised * (1 + attacker_advantage * 0.5),
         recovery_time: calculateRecoveryTime(asset, attack_type),
         cascading_damage: calculateCascadingDamage(asset)
       };
     }
     
     return { success: false, impact: 0 };
   }