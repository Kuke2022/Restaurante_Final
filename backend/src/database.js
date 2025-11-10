const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',  // ← Nombre del servicio
  database: process.env.DB_NAME || 'restaurant_db',
  password: process.env.DB_PASSWORD || 'restaurante123',
  port: process.env.DB_PORT || 5432,
});

console.log('🔧 Conectando a PostgreSQL...');
console.log('   Host:', process.env.DB_HOST || 'postgres');
console.log('   Database:', process.env.DB_NAME || 'restaurant_db');

pool.query('SELECT NOW()')
  .then(result => {
    console.log('✅ CONEXIÓN EXITOSA a PostgreSQL!');
    console.log('⏰ Hora del servidor:', result.rows[0].now);
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
};