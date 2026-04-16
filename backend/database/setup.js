const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');
    
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    
    await pool.query(schemaSQL);
    
    console.log('✅ Database schema created successfully');
    console.log('✅ Sample data inserted');
    
    pool.end();
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();