-- Crear tablas
CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    capacidad INTEGER NOT NULL,
    ubicacion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    mesa_id INTEGER NOT NULL REFERENCES mesas(id),
    fecha_hora TIMESTAMP NOT NULL,
    numero_personas INTEGER NOT NULL,
    notas TEXT,
    estado VARCHAR(20) DEFAULT 'confirmada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO mesas (numero, capacidad, ubicacion) VALUES
(1, 2, 'Terraza'),
(2, 2, 'Interior'),
(3, 4, 'Ventana'),
(4, 4, 'Centro'),
(5, 6, 'Privada'),
(6, 6, 'Terraza'),
(7, 8, 'Salón Principal'),
(8, 2, 'Barra')
ON CONFLICT (numero) DO NOTHING;

INSERT INTO clientes (nombre, email, telefono) VALUES
('Juan Pérez', 'juan@email.com', '+1234567890'),
('María García', 'maria@email.com', '+1234567891'),
('Carlos López', 'carlos@email.com', '+1234567892'),
('Ana Martínez', 'ana@email.com', '+1234567893'),
('Pedro Rodríguez', 'pedro@email.com', '+1234567894')
ON CONFLICT DO NOTHING;

-- Insertar algunas reservas de ejemplo para hoy
INSERT INTO reservas (cliente_id, mesa_id, fecha_hora, numero_personas, notas) VALUES
(1, 1, CURRENT_DATE + INTERVAL '19 hours', 2, 'Aniversario'),
(2, 3, CURRENT_DATE + INTERVAL '20 hours', 4, 'Cumpleaños'),
(3, 5, CURRENT_DATE + INTERVAL '21 hours', 6, 'Reunión familiar')
ON CONFLICT DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_hora ON reservas(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_reservas_cliente_id ON reservas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reservas_mesa_id ON reservas(mesa_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);