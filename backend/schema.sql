-- Use the schema provided in the document
   CREATE TABLE bank_infrastructure (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     asset_name VARCHAR(255),
     criticality INT CHECK (criticality >= 0 AND criticality <= 100),
     exposure INT CHECK (exposure >= 0 AND exposure <= 100),
     security_level INT CHECK (security_level >= 0 AND security_level <= 100),
     data_sensitivity INT CHECK (data_sensitivity >= 0 AND data_sensitivity <= 100),
     value_if_breached DECIMAL(15,2)
   );
   
   -- Add other tables from the document...