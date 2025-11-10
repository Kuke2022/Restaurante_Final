export class UI {
  constructor(services) {
    this.services = services;
    this.currentView = 'dashboard';
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = this.getLayout();
    this.bindEvents();
  }

  getLayout() {
    return `
      <div class="min-h-screen bg-gray-100 relative" style="background-image: url('https://stronglify-1.s3.sa-east-1.amazonaws.com/vajillascorona/Que-es-un-restaurante-de-autor.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        <!-- Overlay para oscurecer ligeramente y mejorar legibilidad -->
        <div class="absolute inset-0 bg-black opacity-30 pointer-events-none"></div>

        <!-- Header -->
        <header class="bg-white shadow relative z-10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                  <h1 class="text-xl font-bold text-gray-900">Sistema de Reservas</h1>
                </div>
                <nav class="ml-6 flex space-x-8">
                  ${this.getNavigation()}
                </nav>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
          <div id="content" class="px-4 py-6 sm:px-0">
            ${this.getCurrentView()}
          </div>
        </main>

        <!-- Modal Container -->
        <div id="modal-container"></div>

        <!-- Notification Container -->
        <div id="notification-container" class="fixed top-4 right-4 z-50"></div>
      </div>
    `;
  }

  getNavigation() {
    const views = [
      { id: 'dashboard', name: 'Dashboard', icon: '📊' },
      { id: 'reservas', name: 'Nueva Reserva', icon: '📅' },
      { id: 'mesas', name: 'Gestión de Mesas', icon: '🪑' },
      { id: 'clientes', name: 'Clientes', icon: '👥' }
    ];

    return views.map(view => `
      <button 
        class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium nav-btn ${this.currentView === view.id ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
        data-view="${view.id}"
      >
        <span class="mr-2">${view.icon}</span>
        ${view.name}
      </button>
    `).join('');
  }

  getCurrentView() {
    switch (this.currentView) {
      case 'dashboard':
        return this.getDashboardView();
      case 'reservas':
        return this.getReservasView();
      case 'mesas':
        return this.getMesasView();
      case 'clientes':
        return this.getClientesView();
      default:
        return this.getDashboardView();
    }
  }

getDashboardView() {
  // Obtener fecha actual en el formato correcto (YYYY-MM-DD) usando la fecha local
  const pad = (n) => String(n).padStart(2, '0');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

  // Para debug - ver qué fecha estamos usando
  console.log('Fecha hoy (local):', todayStr);
  
  return `
    <div class="grid grid-cols-1 gap-6">
      <!-- Selector de Fecha -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ver Reservas por Fecha</h3>
          <div class="flex items-center space-x-4 mb-2">
            <input type="date" id="fecha-selector" 
              class="border border-gray-300 rounded-md px-3 py-2"
              value="${todayStr}">
            <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 fecha-rapida" data-fecha="${todayStr}">
              Hoy
            </button>
            <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 fecha-rapida" data-fecha="${tomorrowStr}">
              Mañana
            </button>
          </div>
          <div id="fecha-actual" class="text-sm text-gray-600 font-medium"></div>
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Estadísticas Rápidas</h2>
          <div id="estadisticas" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600" id="total-mesas">-</div>
              <div class="text-sm text-blue-800">Mesas Totales</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600" id="reservas-hoy-count">-</div>
              <div class="text-sm text-green-800">Reservas Hoy</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600" id="total-clientes">-</div>
              <div class="text-sm text-purple-800">Clientes Registrados</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservas -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900" id="titulo-reservas">Reservas</h2>
            <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full" id="contador-reservas">
              Cargando...
            </span>
          </div>
          <div id="reservas-hoy" class="space-y-4">
            <div class="animate-pulse">Cargando reservas...</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

  getReservasView() {
    return `
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Nueva Reserva</h2>
          <form id="reserva-form" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha</label>
                <input type="date" id="fecha" name="fecha" required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="${(() => { const d = new Date(); const p = (n)=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}` })()}">
              </div>
              <div>
                <label for="hora" class="block text-sm font-medium text-gray-700">Hora</label>
                <input type="time" id="hora" name="hora" required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="19:00">
              </div>
            </div>
            
            <div>
              <label for="personas" class="block text-sm font-medium text-gray-700">Número de Personas</label>
              <input type="number" id="personas" name="personas" min="1" max="20" required 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value="2">
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="cliente" class="block text-sm font-medium text-gray-700">Cliente</label>
                <select id="cliente" name="cliente_id" required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">Seleccionar cliente...</option>
                </select>
              </div>
              <div class="flex items-end">
                <button type="button" id="nuevo-cliente-btn" 
                  class="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
                  Nuevo Cliente
                </button>
              </div>
            </div>

            <div id="mesas-disponibles" class="hidden">
              <label class="block text-sm font-medium text-gray-700">Mesas Disponibles</label>
              <div id="mesas-list" class="mt-2 space-y-2"></div>
            </div>

            <div>
              <label for="notas" class="block text-sm font-medium text-gray-700">Notas</label>
              <textarea id="notas" name="notas" rows="3" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Notas especiales, alergias, etc."></textarea>
            </div>

            <button type="submit" 
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              id="submit-reserva">
              Crear Reserva
            </button>
          </form>
        </div>
      </div>
    `;
  }

  getMesasView() {
    return `
      <div class="space-y-6">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Gestión de Mesas</h2>
              <button id="add-mesa-btn" 
                class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                Agregar Mesa
              </button>
            </div>
            <div id="mesas-list" class="space-y-4">
              <div class="animate-pulse">Cargando mesas...</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getClientesView() {
    return `
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Clientes Frecuentes</h2>
            <button id="add-cliente-btn" 
              class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
              Nuevo Cliente
            </button>
          </div>
          <div id="clientes-list" class="space-y-4">
            <div class="animate-pulse">Cargando clientes...</div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
      // usar currentTarget para asegurarnos de leer dataset del botón que escuchó el evento
      btn.addEventListener('click', (e) => {
        this.currentView = e.currentTarget.dataset.view;
        this.render();
        this.loadViewData();
      });
    });

    // Formulario de reserva
    const reservaForm = document.getElementById('reserva-form');
    if (reservaForm) {
      reservaForm.addEventListener('submit', (e) => this.handleReservaSubmit(e));
      
      // Verificar disponibilidad cuando cambien fecha, hora o personas
      ['fecha', 'hora', 'personas'].forEach(field => {
        document.getElementById(field)?.addEventListener('change', () => this.checkDisponibilidad());
      });
    }

    // Botones
    document.getElementById('add-mesa-btn')?.addEventListener('click', () => this.showMesaForm());
    document.getElementById('add-cliente-btn')?.addEventListener('click', () => this.showClienteForm());
    document.getElementById('nuevo-cliente-btn')?.addEventListener('click', () => this.showClienteForm());

    // Selector de fecha
    const fechaSelector = document.getElementById('fecha-selector');
    if (fechaSelector) {
      fechaSelector.addEventListener('change', () => {
        this.cargarReservasPorFecha();
      });
    }

    // Botones de fechas rápidas
    document.querySelectorAll('.fecha-rapida').forEach(btn => {
      // usar currentTarget para leer el data-fecha correctamente
      btn.addEventListener('click', (e) => {
        const fecha = e.currentTarget.dataset.fecha;
        const input = document.getElementById('fecha-selector');
        if (input) input.value = fecha;
        this.cargarReservasPorFecha();
      });
    });
  }

    // Nuevos métodos para el calendario
async cargarReservasPorFecha() {
  const fechaSelector = document.getElementById('fecha-selector');
  if (!fechaSelector) return;
  
  const fecha = fechaSelector.value;
  
  // Debug
  console.log('Fecha seleccionada (valor):', fecha);
  console.log('Fecha seleccionada (tipo):', typeof fecha);
  
  const debugElement = document.getElementById('fecha-debug');
  if (debugElement) {
    debugElement.textContent = fecha;
  }
  
  // Esperar a que termine la carga
  await this.loadReservasPorFecha(fecha);
}

async loadReservasPorFecha(fecha) {
  try {
    const reservas = await this.services.reservas.getReservasPorFecha(fecha);
    this.renderReservasPorFecha(reservas, fecha);
  } catch (error) {
    console.error('Error cargando reservas:', error);
    this.showError('Error cargando reservas: ' + error.message);
  }
}

renderReservasPorFecha(reservas, fecha) {
  const container = document.getElementById('reservas-hoy');
  const fechaActual = document.getElementById('fecha-actual');

  if (!container) return;

  // Parsear YYYY-MM-DD como fecha local para evitar el desfase UTC
  let fechaObj;
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [y, m, d] = fecha.split('-').map(Number);
    fechaObj = new Date(y, m - 1, d);
  } else {
    fechaObj = new Date(fecha);
  }

  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (fechaActual) {
    fechaActual.textContent = fechaFormateada;
  }

  // Contador de reservas activas (no canceladas)
  const reservasActivas = reservas.filter(r => r.estado !== 'cancelada');
  const contador = document.getElementById('contador-reservas');
  if (contador) {
    contador.textContent = reservasActivas.length;
  }

  if (!reservas || reservas.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay reservas para esta fecha</p>';
    return;
  }

  // Mostrar todas las reservas de la fecha (indicar estado) y añadir botón cancelar cuando aplique
  container.innerHTML = reservas.map(reserva => `
    <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-medium text-gray-900">${reserva.cliente_nombre}</h3>
          <p class="text-sm text-gray-600">Mesa ${reserva.mesa_numero} - ${reserva.numero_personas} personas</p>
          <p class="text-sm text-gray-500">${new Date(reserva.fecha_hora).toLocaleString('es-ES')}</p>
          ${reserva.notas ? `<p class="mt-1 text-sm text-gray-600"><strong>Notas:</strong> ${reserva.notas}</p>` : ''}
        </div>
        <div class="flex flex-col items-end space-y-2">
          <span class="px-2 py-1 text-xs rounded-full ${
            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
            reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
            reserva.estado === 'cancelada' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }">${reserva.estado}</span>
          ${reserva.estado !== 'cancelada' ? `<button class="text-red-600 hover:text-red-900 text-sm cancelar-reserva" data-id="${reserva.id}">Cancelar</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Bind cancelar reserva events (usar currentTarget)
  container.querySelectorAll('.cancelar-reserva').forEach(btn => {
    btn.addEventListener('click', (e) => this.cancelarReserva(e.currentTarget.dataset.id));
  });
}

// Reemplazamos ambas definiciones duplicadas de loadReservasDelDia por una única implementación segura
  async loadReservasDelDia() {
    try {
      // Obtener fecha desde el selector si existe, si no usar la fecha local (YYYY-MM-DD)
      const pad = (n) => String(n).padStart(2, '0');
      const fechaSelector = document.getElementById('fecha-selector')?.value;
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      const fecha = fechaSelector || todayStr;

      // Si el servicio soporta obtener por fecha, usarlo (evita problemas de zona horaria)
      let reservas = [];
      if (typeof this.services.reservas.getReservasPorFecha === 'function') {
        reservas = await this.services.reservas.getReservasPorFecha(fecha);
      } else {
        // Fallback: obtener todas las reservas del backend y filtrar por la fecha local
        const todas = await this.services.reservas.getReservasDelDia();
        reservas = todas.filter(r => {
          const d = new Date(r.fecha_hora);
          const rDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          return rDate === fecha;
        });
      }

      this.reservas = reservas;

      if (this.currentView === 'dashboard') {
        this.renderReservasHoy(reservas);
        // Actualizar también el texto de la fecha debajo del selector para que coincida
        this.renderReservasPorFecha(reservas, fecha);
      }
    } catch (error) {
      this.showError('Error cargando reservas: ' + error.message);
    }
  }

  async loadViewData() {
    try {
      switch (this.currentView) {
        case 'dashboard':
          await this.loadReservasDelDia();
          await this.loadEstadisticas();
          break;
        case 'reservas':
          await this.loadClientes();
          // Verificar disponibilidad con valores por defecto
          setTimeout(() => this.checkDisponibilidad(), 100);
          break;
        case 'mesas':
          await this.loadMesas();
          break;
        case 'clientes':
          await this.loadClientes();
          break;
      }
    } catch (error) {
      this.showError('Error cargando datos: ' + error.message);
    }
  }

  async loadMesas() {
    try {
      const mesas = await this.services.mesas.get();
      this.mesas = mesas;
      
      if (this.currentView === 'mesas') {
        this.renderMesasList(mesas);
      }
    } catch (error) {
      this.showError('Error cargando mesas: ' + error.message);
    }
  }

  async loadClientes() {
    try {
      const clientes = await this.services.clientes.get();
      this.clientes = clientes;
      
      if (this.currentView === 'reservas') {
        this.renderClientesSelect(clientes);
      } else if (this.currentView === 'clientes') {
        this.renderClientesList(clientes);
      }
    } catch (error) {
      this.showError('Error cargando clientes: ' + error.message);
    }
  }

  async loadEstadisticas() {
    try {
      const mesas = await this.services.mesas.get();
      const clientes = await this.services.clientes.get();

      // Determinar la fecha a usar para las estadísticas: selector (si existe) o hoy local
      const pad = (n) => String(n).padStart(2, '0');
      const fechaSelector = document.getElementById('fecha-selector')?.value;
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      const fecha = fechaSelector || todayStr;

      // Obtener reservas para la fecha determinada
      let reservas = [];
      if (typeof this.services.reservas.getReservasPorFecha === 'function') {
        reservas = await this.services.reservas.getReservasPorFecha(fecha);
      } else {
        // Fallback: obtener todas las reservas del día del backend y filtrar por la fecha local
        const todas = await this.services.reservas.getReservasDelDia();
        reservas = todas.filter(r => {
          const d = new Date(r.fecha_hora);
          const rDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
          return rDate === fecha;
        });
      }

      document.getElementById('total-mesas').textContent = mesas.length;
      document.getElementById('reservas-hoy-count').textContent = reservas.length;
      document.getElementById('total-clientes').textContent = clientes.length;
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }

  async checkDisponibilidad() {
    const fecha = document.getElementById('fecha')?.value;
    const hora = document.getElementById('hora')?.value;
    const personas = document.getElementById('personas')?.value;
    const submitBtn = document.getElementById('submit-reserva');

    if (!fecha || !hora || !personas) {
      if (submitBtn) submitBtn.disabled = true;
      return;
    }

    try {
      const mesasDisponibles = await this.services.reservas.getDisponibilidad(fecha, hora, personas);
      this.renderMesasDisponibles(mesasDisponibles);
      if (submitBtn) submitBtn.disabled = mesasDisponibles.length === 0;
    } catch (error) {
      this.showError('Error verificando disponibilidad: ' + error.message);
      if (submitBtn) submitBtn.disabled = true;
    }
  }

  renderMesasDisponibles(mesas) {
    const container = document.getElementById('mesas-disponibles');
    const list = document.getElementById('mesas-list');
    
    if (mesas.length === 0) {
      list.innerHTML = '<p class="text-red-500 text-sm">No hay mesas disponibles para estos criterios. Intente con otra fecha/hora o menos personas.</p>';
    } else {
      list.innerHTML = mesas.map(mesa => `
        <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input type="radio" name="mesa_id" value="${mesa.id}" required 
            class="text-indigo-600 focus:ring-indigo-500">
          <span class="flex-1">
            <strong>Mesa ${mesa.numero}</strong> - Capacidad: ${mesa.capacidad} personas
            ${mesa.ubicacion ? `- ${mesa.ubicacion}` : ''}
          </span>
        </label>
      `).join('');
    }
    
    container.classList.remove('hidden');
  }

  renderClientesSelect(clientes) {
    const select = document.getElementById('cliente');
    select.innerHTML = '<option value="">Seleccionar cliente...</option>' +
      clientes.map(cliente => `
        <option value="${cliente.id}">${cliente.nombre} - ${cliente.telefono}</option>
      `).join('');
  }

  renderReservasHoy(reservas) {
  const container = document.getElementById('reservas-hoy');
  
  // Filtrar solo reservas activas (por si acaso)
  const reservasActivas = reservas.filter(reserva => reserva.estado !== 'cancelada');
  
  // Actualizar contador de reservas (el "icono de cargando")
  const contador = document.getElementById('contador-reservas');
  if (contador) {
    contador.textContent = reservasActivas.length;
  }
  
  if (reservasActivas.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay reservas activas para hoy</p>';
    return;
  }

  container.innerHTML = reservasActivas.map(reserva => `
    <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-medium text-gray-900">${reserva.cliente_nombre}</h3>
          <p class="text-sm text-gray-600">Mesa ${reserva.mesa_numero} - ${reserva.numero_personas} personas</p>
          <p class="text-sm text-gray-500">${new Date(reserva.fecha_hora).toLocaleString('es-ES')}</p>
          ${reserva.notas ? `<p class="mt-1 text-sm text-gray-600"><strong>Notas:</strong> ${reserva.notas}</p>` : ''}
        </div>
        <div class="flex flex-col items-end space-y-2">
          <span class="px-2 py-1 text-xs rounded-full ${
            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 
            reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
          }">${reserva.estado}</span>
          <button class="text-red-600 hover:text-red-900 text-sm cancelar-reserva" data-id="${reserva.id}">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Bind cancelar reserva events (usar currentTarget)
  container.querySelectorAll('.cancelar-reserva').forEach(btn => {
    btn.addEventListener('click', (e) => this.cancelarReserva(e.currentTarget.dataset.id));
  });
}

  renderMesasList(mesas) {
    const container = document.getElementById('mesas-list');
    
    if (mesas.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay mesas registradas</p>';
      return;
    }

    container.innerHTML = mesas.map(mesa => `
      <div class="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
        <div>
          <h3 class="font-medium text-gray-900">Mesa ${mesa.numero}</h3>
          <p class="text-sm text-gray-600">Capacidad: ${mesa.capacidad} personas</p>
          ${mesa.ubicacion ? `<p class="text-sm text-gray-500">Ubicación: ${mesa.ubicacion}</p>` : ''}
        </div>
        <div class="flex space-x-2">
          <button class="text-indigo-600 hover:text-indigo-900 text-sm edit-mesa" data-id="${mesa.id}">
            Editar
          </button>
          <button class="text-red-600 hover:text-red-900 text-sm delete-mesa" data-id="${mesa.id}">
            Eliminar
          </button>
        </div>
      </div>
    `).join('');

    // Bind events for edit/delete buttons
    container.querySelectorAll('.edit-mesa').forEach(btn => {
      btn.addEventListener('click', (e) => this.editMesa(e.target.dataset.id));
    });

    container.querySelectorAll('.delete-mesa').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteMesa(e.target.dataset.id));
    });
  }

  renderClientesList(clientes) {
  const container = document.getElementById('clientes-list');
  
  if (clientes.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">No hay clientes registrados</p>';
    return;
  }

  container.innerHTML = clientes.map(cliente => `
    <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="font-medium text-gray-900">${cliente.nombre}</h3>
          <p class="text-sm text-gray-600">Teléfono: ${cliente.telefono}</p>
          ${cliente.email ? `<p class="text-sm text-gray-500">Email: ${cliente.email}</p>` : ''}
        </div>
        <div class="flex flex-col items-end space-y-2">
          <button class="text-indigo-600 hover:text-indigo-900 text-sm view-historial" data-id="${cliente.id}">
            Ver Historial
          </button>
          <button class="text-red-600 hover:text-red-900 text-sm delete-cliente" data-id="${cliente.id}">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Bind events for historial buttons
  container.querySelectorAll('.view-historial').forEach(btn => {
    btn.addEventListener('click', (e) => this.viewHistorial(e.target.dataset.id));
  });

  // Bind events for delete buttons
  container.querySelectorAll('.delete-cliente').forEach(btn => {
    btn.addEventListener('click', (e) => this.deleteCliente(e.target.dataset.id));
  });
}

async deleteCliente(id) {
  const cliente = this.clientes.find(c => c.id == id);
  
  if (confirm(`¿Está seguro de que desea eliminar al cliente "${cliente.nombre}"?\n\nNota: No se pueden eliminar clientes con reservas activas.`)) {
    try {
      const result = await this.services.clientes.delete(id);
      this.showSuccess(result.message || 'Cliente eliminado exitosamente');
      await this.loadClientes();
      await this.loadEstadisticas();
    } catch (error) {
      // Mostrar mensaje de error más amigable
      if (error.message.includes('reservas activas') || error.message.includes('historial')) {
        this.showError(error.message);
      } else if (error.message.includes('llave foránea') || error.message.includes('foreign key')) {
        this.showError('No se puede eliminar el cliente porque tiene reservas asociadas en el historial.');
      } else {
        this.showError('Error eliminando cliente: ' + error.message);
      }
    }
  }
}
  async handleReservaSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const submitBtn = document.getElementById('submit-reserva');
    
    const reservaData = {
      cliente_id: formData.get('cliente_id'),
      mesa_id: formData.get('mesa_id'),
      fecha_hora: `${formData.get('fecha')} ${formData.get('hora')}`,
      numero_personas: parseInt(formData.get('personas')),
      notas: formData.get('notas')
    };

    // Validaciones adicionales
    if (!reservaData.cliente_id || !reservaData.mesa_id) {
      this.showError('Por favor complete todos los campos requeridos');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creando...';

    try {
      await this.services.reservas.post(reservaData);
      this.showSuccess('Reserva creada exitosamente');
      e.target.reset();
      document.getElementById('mesas-disponibles').classList.add('hidden');
      submitBtn.textContent = 'Crear Reserva';
      submitBtn.disabled = false;
      
      // Recargar dashboard
      if (this.currentView === 'dashboard') {
        await this.loadReservasDelDia();
        await this.loadEstadisticas();
      }
    } catch (error) {
      this.showError('Error creando reserva: ' + error.message);
      submitBtn.textContent = 'Crear Reserva';
      submitBtn.disabled = false;
    }
  }

  showMesaForm(mesa = null) {
    const isEdit = !!mesa;
    const title = isEdit ? 'Editar Mesa' : 'Agregar Mesa';
    
    const modalContent = `
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">${title}</h3>
            <form id="mesa-form" class="space-y-4">
              <div>
                <label for="mesa-numero" class="block text-sm font-medium text-gray-700">Número de Mesa</label>
                <input type="number" id="mesa-numero" name="numero" required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="${mesa ? mesa.numero : ''}">
              </div>
              <div>
                <label for="mesa-capacidad" class="block text-sm font-medium text-gray-700">Capacidad</label>
                <input type="number" id="mesa-capacidad" name="capacidad" min="1" max="20" required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="${mesa ? mesa.capacidad : ''}">
              </div>
              <div>
                <label for="mesa-ubicacion" class="block text-sm font-medium text-gray-700">Ubicación</label>
                <input type="text" id="mesa-ubicacion" name="ubicacion" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="${mesa ? mesa.ubicacion || '' : ''}"
                  placeholder="Ej: Terraza, Interior, Ventana...">
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" id="cancel-mesa" 
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                  Cancelar
                </button>
                <button type="submit" 
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  ${isEdit ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalContent;

    // Bind form events
    document.getElementById('mesa-form').addEventListener('submit', (e) => this.handleMesaSubmit(e, mesa?.id));
    document.getElementById('cancel-mesa').addEventListener('click', () => this.closeModal());
  }

  showClienteForm(cliente = null) {
    const isEdit = !!cliente;
    const title = isEdit ? 'Editar Cliente' : 'Nuevo Cliente';
    
    const modalContent = `
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">${title}</h3>
            <form id="cliente-form" class="space-y-4">
              <div>
                <label for="cliente-nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" id="cliente-nombre" name="nombre" required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="${cliente ? cliente.nombre : ''}">
              </div>
              <div>
                <label for="cliente-email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="cliente-email" name="email" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="${cliente ? cliente.email || '' : ''}">
              </div>
              <div>
                <label for="cliente-telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input type="tel" id="cliente-telefono" name="telefono" required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value="${cliente ? cliente.telefono : ''}">
              </div>
              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" id="cancel-cliente" 
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                  Cancelar
                </button>
                <button type="submit" 
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  ${isEdit ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalContent;

    // Bind form events
    document.getElementById('cliente-form').addEventListener('submit', (e) => this.handleClienteSubmit(e, cliente?.id));
    document.getElementById('cancel-cliente').addEventListener('click', () => this.closeModal());
  }

  async handleMesaSubmit(e, mesaId = null) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const mesaData = {
      numero: parseInt(formData.get('numero')),
      capacidad: parseInt(formData.get('capacidad')),
      ubicacion: formData.get('ubicacion')
    };

    try {
      if (mesaId) {
        await this.services.mesas.put(mesaId, mesaData);
        this.showSuccess('Mesa actualizada exitosamente');
      } else {
        await this.services.mesas.post(mesaData);
        this.showSuccess('Mesa creada exitosamente');
      }
      
      this.closeModal();
      await this.loadMesas();
      await this.loadEstadisticas();
    } catch (error) {
      this.showError('Error guardando mesa: ' + error.message);
    }
  }

  async handleClienteSubmit(e, clienteId = null) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const clienteData = {
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      telefono: formData.get('telefono')
    };

    try {
      if (clienteId) {
        // Nota: Necesitarías implementar el endpoint PUT en el backend
        this.showError('Edición de clientes no implementada en el backend');
        return;
      } else {
        await this.services.clientes.post(clienteData);
        this.showSuccess('Cliente creado exitosamente');
      }
      
      this.closeModal();
      await this.loadClientes();
      await this.loadEstadisticas();
    } catch (error) {
      this.showError('Error guardando cliente: ' + error.message);
    }
  }

  editMesa(id) {
    const mesa = this.mesas.find(m => m.id == id);
    this.showMesaForm(mesa);
  }

async deleteMesa(id) {
  if (confirm('¿Está seguro de que desea eliminar esta mesa?\n\nNota: No se pueden eliminar mesas con reservas activas.')) {
    try {
      const result = await this.services.mesas.delete(id);
      this.showSuccess(result.message || 'Mesa eliminada exitosamente');
      await this.loadMesas();
      await this.loadEstadisticas();
    } catch (error) {
      // Mostrar mensaje de error más amigable
      if (error.message.includes('reservas activas') || error.message.includes('historial')) {
        this.showError(error.message);
      } else if (error.message.includes('llave foránea') || error.message.includes('foreign key')) {
        this.showError('No se puede eliminar la mesa porque tiene reservas asociadas en el historial.');
      } else {
        this.showError('Error eliminando mesa: ' + error.message);
      }
    }
  }
}

  async cancelarReserva(id) {
    if (!id) return;
    if (!confirm('¿Está seguro de que desea cancelar esta reserva?')) return;

    try {
      // Intentar usar el servicio frontend si existe
      if (this.services?.reservas) {
        const svc = this.services.reservas;
        if (typeof svc.delete === 'function') {
          await svc.delete(id);
        } else if (typeof svc.remove === 'function') {
          await svc.remove(id);
        } else if (typeof svc.cancel === 'function') {
          await svc.cancel(id);
        } else {
          // Fallback: petición HTTP directa al backend
          const res = await fetch(`/reservas/${id}`, { method: 'DELETE' });
          if (!res.ok) {
            const err = await res.json().catch(()=>({ error: res.statusText }));
            throw new Error(err.error || res.statusText || 'Error cancelando reserva');
          }
        }
      } else {
        // Si no hay servicios, fallback fetch
        const res = await fetch(`/reservas/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const err = await res.json().catch(()=>({ error: res.statusText }));
          throw new Error(err.error || res.statusText || 'Error cancelando reserva');
        }
      }

      this.showSuccess('Reserva cancelada exitosamente');
      await this.loadReservasDelDia();
      await this.loadEstadisticas();
    } catch (error) {
      this.showError('Error cancelando reserva: ' + (error.message || error));
    }
  }

  async viewHistorial(clienteId) {
    try {
      const cliente = await this.services.clientes.get(`/${clienteId}`);
      this.showHistorialModal(cliente);
    } catch (error) {
      this.showError('Error cargando historial: ' + error.message);
    }
  }

  showHistorialModal(cliente) {
    const modalContent = `
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Historial de Reservas - ${cliente.nombre}</h3>
              <button type="button" id="close-historial" 
                class="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div class="max-h-96 overflow-y-auto">
              ${cliente.historial && cliente.historial.length > 0 ? 
                cliente.historial.map(reserva => `
                  <div class="border-b py-3 last:border-b-0">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-medium">${new Date(reserva.fecha_hora).toLocaleString('es-ES')}</p>
                        <p class="text-sm text-gray-600">Mesa ${reserva.mesa_numero} - ${reserva.numero_personas} personas</p>
                        ${reserva.notas ? `<p class="text-sm text-gray-500 mt-1">${reserva.notas}</p>` : ''}
                      </div>
                      <span class="px-2 py-1 text-xs rounded-full ${
                        reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 
                        reserva.estado === 'cancelada' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }">${reserva.estado}</span>
                    </div>
                  </div>
                `).join('') :
                '<p class="text-gray-500 text-center py-8">No hay historial de reservas para este cliente</p>'
              }
            </div>
            <div class="flex justify-end pt-4">
              <button type="button" id="close-historial-btn" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalContent;

    // Bind close events
    document.getElementById('close-historial').addEventListener('click', () => this.closeModal());
    document.getElementById('close-historial-btn').addEventListener('click', () => this.closeModal());
  }

  closeModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = '';
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `${bgColor} text-white p-4 rounded-md shadow-lg mb-2 transform transition-transform duration-300 ease-in-out`;
    notification.textContent = message;

    const container = document.getElementById('notification-container');
    container.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
}