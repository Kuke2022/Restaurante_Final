const express = require('express');
const router = express.Router();
const db = require('../database');

// GET todos los clientes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clientes ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET cliente por ID con historial
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
    if (cliente.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const historial = await db.query(`
      SELECT r.*, m.numero as mesa_numero
      FROM reservas r
      JOIN mesas m ON r.mesa_id = m.id
      WHERE r.cliente_id = $1
      ORDER BY r.fecha_hora DESC
    `, [id]);
    
    res.json({
      ...cliente.rows[0],
      historial: historial.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear nuevo cliente
router.post('/', async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    
    const result = await db.query(
      'INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, telefono]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el cliente tiene reservas activas
    const reservasActivas = await db.query(`
      SELECT COUNT(*) as count 
      FROM reservas 
      WHERE cliente_id = $1 
      AND estado != 'cancelada'
      AND fecha_hora >= NOW()
    `, [id]);
    
    if (parseInt(reservasActivas.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el cliente porque tiene reservas activas futuras.' 
      });
    }
    
    // Verificar si el cliente tiene reservas en el historial
    const reservasHistorial = await db.query(`
      SELECT COUNT(*) as count 
      FROM reservas 
      WHERE cliente_id = $1
    `, [id]);
    
    const result = await db.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    
    const mensaje = parseInt(reservasHistorial.rows[0].count) > 0 
      ? 'Cliente eliminado. Nota: Este cliente tenía reservas en el historial.' 
      : 'Cliente eliminado correctamente';
    
    res.json({ message: mensaje });
  } catch (error) {
    // Manejar error de llave foránea de PostgreSQL
    if (error.code === '23503') {
      return res.status(400).json({ 
        error: 'No se puede eliminar el cliente porque tiene reservas asociadas en el historial.' 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;