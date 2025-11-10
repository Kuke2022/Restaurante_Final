import { ReservasService } from './services/reservasService.js';
import { MesasService } from './services/mesasService.js';
import { ClientesService } from './services/clientesService.js';
import { UI } from './ui.js';

export const App = {
  init() {
    this.services = {
      reservas: new ReservasService(),
      mesas: new MesasService(),
      clientes: new ClientesService()
    };

    this.ui = new UI(this.services);
    this.ui.render();
    
    // Cargar datos iniciales
    this.loadInitialData();
  },

  async loadInitialData() {
    try {
      await this.ui.loadMesas();
      await this.ui.loadReservasDelDia();
      await this.ui.loadClientes();
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  }
};