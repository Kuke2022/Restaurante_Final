const API_BASE_URL = 'http://localhost:5001/api';  // Asegúrate que sea 5001

export class ApiService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async get(path = '') {
    const response = await fetch(`${API_BASE_URL}/${this.endpoint}${path}`);
    return this.handleResponse(response);
  }

  async post(data, path = '') {
    const response = await fetch(`${API_BASE_URL}/${this.endpoint}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async put(id, data) {
    const response = await fetch(`${API_BASE_URL}/${this.endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/${this.endpoint}/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse(response);
  }

  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
  }
}