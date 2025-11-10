import { ApiService } from './api.js';

export class ClientesService extends ApiService {
  constructor() {
    super('clientes');
  }
}