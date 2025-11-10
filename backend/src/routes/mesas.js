const express = require('express');
const router = express.Router();
const db = require('../database');

// GET todas las mesas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM mesas ORDER BY numero');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET mesa por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM mesas WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear nueva mesa
router.post('/', async (req, res) => {
  try {
    const { numero, capacidad, ubicacion } = req.body;
    
    const result = await db.query(
      'INSERT INTO mesas (numero, capacidad, ubicacion) VALUES ($1, $2, $3) RETURNING *',
      [numero, capacidad, ubicacion]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar mesa
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, capacidad, ubicacion } = req.body;
    
    const result = await db.query(
      'UPDATE mesas SET numero = $1, capacidad = $2, ubicacion = $3 WHERE id = $4 RETURNING *',
      [numero, capacidad, ubicacion, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar mesa
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la mesa tiene reservas activas
    const reservasActivas = await db.query(`
      SELECT COUNT(*) as count 
      FROM reservas 
      WHERE mesa_id = $1 
      AND estado != 'cancelada'
      AND fecha_hora >= NOW()
    `, [id]);
    
    if (parseInt(reservasActivas.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la mesa porque tiene reservas activas futuras. Cancele las reservas primero.' 
      });
    }
    
    // Verificar si la mesa tiene reservas en el historial
    const reservasHistorial = await db.query(`
      SELECT COUNT(*) as count 
      FROM reservas 
      WHERE mesa_id = $1
    `, [id]);
    
    const result = await db.query('DELETE FROM mesas WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    
    const mensaje = parseInt(reservasHistorial.rows[0].count) > 0 
      ? 'Mesa eliminada. Nota: Esta mesa tenía reservas en el historial.' 
      : 'Mesa eliminada correctamente';
    
    res.json({ message: mensaje });
  } catch (error) {
    // Manejar error de llave foránea de PostgreSQL
    if (error.code === '23503') { // Código de error de violación de llave foránea
      return res.status(400).json({ 
        error: 'No se puede eliminar la mesa porque tiene reservas asociadas en el historial.' 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;