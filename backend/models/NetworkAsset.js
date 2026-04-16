class NetworkAsset {
     constructor(id, name, criticality, exposure, security_level, data_sensitivity, value_if_compromised, dependent_systems) {
       this.id = id;
       this.name = name;
       this.criticality = criticality;
       this.exposure = exposure;
       this.security_level = security_level;
       this.data_sensitivity = data_sensitivity;
       this.value_if_compromised = value_if_compromised;
       this.dependent_systems = dependent_systems;
     }
   }

   module.exports = NetworkAsset;
