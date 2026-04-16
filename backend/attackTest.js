const NetworkAsset = require("./models/NetworkAsset");
const RansomwareAttack = require("./attacks/Ransomware");
const DDoSAttack = require("./attacks/DDoS");
const DataBreachAttack = require("./attacks/DataBreach");

const asset = new NetworkAsset(
  1,
  "Core Banking Server",
  90,
  70,
  60,
  80,
  1000000,
  ["ATM", "Mobile App"]
);

const defenses = {
  level: 60,
  detection: 70,
  hasBackups: true,
  hasImmutableBackups: false,
  hasDDoSMitigation: true
};

console.log("\n--- RANSOMWARE ---");
console.log(new RansomwareAttack().execute(asset, 75, defenses));

console.log("\n--- DDOS ---");
console.log(new DDoSAttack(120).execute(asset, 60, defenses));

console.log("\n--- DATA BREACH ---");
console.log(new DataBreachAttack().execute(asset, 80, defenses));
