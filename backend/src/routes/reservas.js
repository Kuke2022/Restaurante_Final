const express = require('express');
const router = express.Router();
const db = require('../database');

// GET todas las reservas
router.get('/', async (req, res) => {
  try {
    const { fecha } = req.query;
    
    let query = `
      SELECT r.*, c.nombre as cliente_nombre, c.telefono, m.numero as mesa_numero, m.capacidad
      FROM reservas r
      JOIN clientes c ON r.cliente_id = c.id
      JOIN mesas m ON r.mesa_id = m.id
      WHERE r.estado != 'cancelada'  -- ← FILTRAR SOLO RESERVAS ACTIVAS
    `;
    
    let params = [];
    
    if (fecha) {
      query += ' AND DATE(r.fecha_hora) = $1';
      params.push(fecha);
    }
    
    query += ' ORDER BY r.fecha_hora';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET disponibilidad de mesas (también filtrar por reservas activas)
router.get('/disponibilidad', async (req, res) => {
  try {
    const { fecha, hora, personas } = req.query;
    
    if (!fecha || !hora || !personas) {
      return res.status(400).json({ error: 'Fecha, hora y personas son requeridos' });
    }
    
    const fechaHora = `${fecha} ${hora}`;
    
    // Buscar mesas disponibles que cumplan con la capacidad
    const result = await db.query(`
      SELECT m.* 
      FROM mesas m
      WHERE m.capacidad >= $1
      AND m.id NOT IN (
        SELECT mesa_id 
        FROM reservas 
        WHERE fecha_hora = $2 
        AND estado != 'cancelada'  -- ← SOLO CONSIDERAR RESERVAS ACTIVAS
      )
      ORDER BY m.capacidad
    `, [personas, fechaHora]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET reservas por rango de fechas
router.get('/por-fecha', async (req, res) => {
  try {
    const { fecha } = req.query;
    
    if (!fecha) {
      return res.status(400).json({ error: 'Fecha es requerida' });
    }
    
    const result = await db.query(`
      SELECT r.*, c.nombre as cliente_nombre, c.telefono, m.numero as mesa_numero, m.capacidad
      FROM reservas r
      JOIN clientes c ON r.cliente_id = c.id
      JOIN mesas m ON r.mesa_id = m.id
      WHERE DATE(r.fecha_hora) = $1
      AND r.estado != 'cancelada'
      ORDER BY r.fecha_hora
    `, [fecha]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear nueva reserva
router.post('/', async (req, res) => {
  try {
    const { cliente_id, mesa_id, fecha_hora, numero_personas, notas } = req.body;
    
    // Validar que la mesa esté disponible
    const disponibilidad = await db.query(`
      SELECT * FROM reservas 
      WHERE mesa_id = $1 
      AND fecha_hora = $2 
      AND estado != 'cancelada'
    `, [mesa_id, fecha_hora]);
    
    if (disponibilidad.rows.length > 0) {
      return res.status(400).json({ error: 'La mesa no está disponible en ese horario' });
    }
    
    // Validar capacidad de la mesa
    const mesa = await db.query('SELECT capacidad FROM mesas WHERE id = $1', [mesa_id]);
    if (mesa.rows[0].capacidad < numero_personas) {
      return res.status(400).json({ error: 'La mesa no tiene capacidad para esa cantidad de personas' });
    }
    
    const result = await db.query(`
      INSERT INTO reservas (cliente_id, mesa_id, fecha_hora, numero_personas, notas, estado)
      VALUES ($1, $2, $3, $4, $5, 'confirmada')
      RETURNING *
    `, [cliente_id, mesa_id, fecha_hora, numero_personas, notas]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar reserva
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mesa_id, fecha_hora, numero_personas, notas, estado } = req.body;
    
    const result = await db.query(`
      UPDATE reservas 
      SET mesa_id = $1, fecha_hora = $2, numero_personas = $3, notas = $4, estado = $5
      WHERE id = $6
      RETURNING *
    `, [mesa_id, fecha_hora, numero_personas, notas, estado, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE cancelar reserva
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      UPDATE reservas SET estado = 'cancelada' WHERE id = $1 RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    res.json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;