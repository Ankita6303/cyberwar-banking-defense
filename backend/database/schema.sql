-- Drop existing tables if they exist
DROP TABLE IF EXISTS incidents_resolved CASCADE;
DROP TABLE IF EXISTS security_measures CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS bank_infrastructure CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_rounds CASCADE;

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50), -- CISO, ATTACKER, REGULATOR, INSURER, INFRASTRUCTURE_OFFICER
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game sessions table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'WAITING', -- WAITING, ACTIVE, FINISHED
  current_round INT DEFAULT 1,
  max_rounds INT DEFAULT 8,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Game rounds table
CREATE TABLE game_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  round_number INT NOT NULL,
  events JSONB, -- Store round events as JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank infrastructure (assets)
CREATE TABLE bank_infrastructure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  asset_name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(100), -- CORE_BANKING, PAYMENT, CUSTOMER_FACING, etc.
  criticality INT CHECK (criticality >= 0 AND criticality <= 100),
  exposure INT CHECK (exposure >= 0 AND exposure <= 100),
  security_level INT CHECK (security_level >= 0 AND security_level <= 100),
  data_sensitivity INT CHECK (data_sensitivity >= 0 AND data_sensitivity <= 100),
  value_if_breached DECIMAL(15,2),
  dependent_systems JSONB, -- Array of dependent system IDs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  round_id INT,
  attack_type VARCHAR(100) NOT NULL, -- RANSOMWARE, DDOS, DATA_BREACH, etc.
  targeted_asset_id UUID REFERENCES bank_infrastructure(id),
  attacker_id UUID REFERENCES players(id),
  defender_id UUID REFERENCES players(id),
  success BOOLEAN DEFAULT FALSE,
  detected BOOLEAN DEFAULT FALSE,
  detection_time_hours DECIMAL(10,2),
  response_time_hours DECIMAL(10,2),
  impact_cost DECIMAL(15,2),
  severity INT CHECK (severity >= 0 AND severity <= 100),
  status VARCHAR(50) DEFAULT 'DETECTED', -- DETECTED, CONTAINED, ERADICATING, RESOLVED
  attack_details JSONB, -- Store attack-specific data
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Security measures table
CREATE TABLE security_measures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  round_id INT,
  asset_id UUID REFERENCES bank_infrastructure(id),
  measure_type VARCHAR(100) NOT NULL, -- firewall, encryption, training, etc.
  effectiveness INT CHECK (effectiveness >= 0 AND effectiveness <= 100),
  cost DECIMAL(15,2),
  implementation_time_days INT,
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents resolved table
CREATE TABLE incidents_resolved (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  resolution_type VARCHAR(100), -- payment, recovery, backup_restore
  cost DECIMAL(15,2),
  time_to_resolve_hours DECIMAL(10,2),
  data_recovered_percent INT CHECK (data_recovered_percent >= 0 AND data_recovered_percent <= 100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player scores table
CREATE TABLE player_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id),
  round_number INT,
  score INT DEFAULT 0,
  score_breakdown JSONB, -- Detailed scoring info
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_incidents_game_id ON incidents(game_id);
CREATE INDEX idx_incidents_asset_id ON incidents(targeted_asset_id);
CREATE INDEX idx_security_measures_game_id ON security_measures(game_id);
CREATE INDEX idx_bank_infrastructure_game_id ON bank_infrastructure(game_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);

-- Sample data for testing
INSERT INTO bank_infrastructure (asset_name, asset_type, criticality, exposure, security_level, data_sensitivity, value_if_breached, dependent_systems)
VALUES 
  ('Core Banking System', 'CORE_BANKING', 100, 10, 80, 90, 100000000, '[]'),
  ('Online Banking Portal', 'CUSTOMER_FACING', 85, 95, 60, 80, 50000000, '["core-banking"]'),
  ('ATM Network', 'CUSTOMER_FACING', 70, 80, 65, 60, 30000000, '["core-banking", "payment-gateway"]'),
  ('Payment Gateway', 'PAYMENT', 90, 70, 75, 85, 75000000, '["core-banking"]'),
  ('Mobile Banking App', 'CUSTOMER_FACING', 80, 90, 70, 75, 40000000, '["core-banking", "payment-gateway"]'),
  ('SWIFT Network Interface', 'PAYMENT', 95, 60, 85, 95, 150000000, '["core-banking"]'),
  ('Trading Platform', 'TRADING', 88, 75, 72, 82, 80000000, '["core-banking", "risk-management"]'),
  ('Risk Management System', 'BACK_OFFICE', 75, 30, 78, 70, 25000000, '[]'),
  ('Email System', 'BACK_OFFICE', 60, 85, 55, 65, 15000000, '[]'),
  ('HR Database', 'BACK_OFFICE', 65, 40, 60, 80, 20000000, '[]');