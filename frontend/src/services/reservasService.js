import { ApiService } from './api.js';

export class ReservasService extends ApiService {
  constructor() {
    super('reservas');
  }

  async getDisponibilidad(fecha, hora, personas) {
    return this.get(`/disponibilidad?fecha=${fecha}&hora=${hora}&personas=${personas}`);
  }

  async getReservasDelDia(fecha = null) {
    const today = fecha || new Date().toISOString().split('T')[0];
    return this.get(`?fecha=${today}`);
  }

  // Nuevo método para obtener reservas por fecha específica
  async getReservasPorFecha(fecha) {
    return this.get(`/por-fecha?fecha=${fecha}`);
  }
}