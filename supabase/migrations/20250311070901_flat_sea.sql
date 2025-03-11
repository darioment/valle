/*
  # Esquema inicial del Sistema Valle Verde

  1. Nuevas Tablas
    - `zones` - Zonas del balneario (restaurante, bar, taquilla)
      - `id` (uuid, primary key)
      - `name` (text) - Nombre de la zona
      - `type` (text) - Tipo de zona (restaurant, bar, ticket_office)
      - `status` (text) - Estado de la zona (open, closed)
      - `created_at` (timestamp)

    - `users` - Usuarios del sistema
      - `id` (uuid, primary key)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - Rol del usuario (admin, waiter, cook, cashier)
      - `zone_id` (uuid) - Zona asignada
      - `created_at` (timestamp)

    - `products` - Productos y servicios
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category` (text) - Categoría (food, drink, ticket, promotion)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `inventory` - Inventario por zona
      - `id` (uuid, primary key)
      - `zone_id` (uuid)
      - `product_id` (uuid)
      - `quantity` (integer)
      - `min_stock` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders` - Órdenes y comandas
      - `id` (uuid, primary key)
      - `zone_id` (uuid)
      - `table_number` (integer)
      - `status` (text) - Estado (pending, preparing, completed, cancelled)
      - `total_amount` (numeric)
      - `created_by` (uuid) - Usuario que creó la orden
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `order_items` - Items de cada orden
      - `id` (uuid, primary key)
      - `order_id` (uuid)
      - `product_id` (uuid)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `notes` (text)
      - `status` (text) - Estado (pending, preparing, completed)
      - `created_at` (timestamp)

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas específicas por rol de usuario
*/

-- Crear tabla de zonas
CREATE TABLE zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('restaurant', 'bar', 'ticket_office')),
  status text NOT NULL DEFAULT 'closed' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver todas las zonas"
  ON zones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo administradores pueden modificar zonas"
  ON zones
  USING (auth.jwt() ->> 'role' = 'admin');

-- Crear tabla de usuarios
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'waiter', 'cook', 'cashier')),
  zone_id uuid REFERENCES zones(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver su propia información"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Administradores pueden ver todos los usuarios"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Crear tabla de productos
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL CHECK (category IN ('food', 'drink', 'ticket', 'promotion')),
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos los usuarios autenticados pueden ver productos"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo administradores pueden modificar productos"
  ON products
  USING (auth.jwt() ->> 'role' = 'admin');

-- Crear tabla de inventario
CREATE TABLE inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES zones(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(zone_id, product_id)
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver inventario de su zona"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (
    zone_id IN (
      SELECT zone_id FROM users WHERE id = auth.uid()
    ) OR auth.jwt() ->> 'role' = 'admin'
  );

-- Crear tabla de órdenes
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES zones(id),
  table_number integer,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'completed', 'cancelled')),
  total_amount numeric NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver órdenes de su zona"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    zone_id IN (
      SELECT zone_id FROM users WHERE id = auth.uid()
    ) OR auth.jwt() ->> 'role' = 'admin'
  );

-- Crear tabla de items de orden
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver items de órdenes de su zona"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN users u ON u.zone_id = o.zone_id
      WHERE o.id = order_items.order_id
      AND (u.id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Crear función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar el timestamp
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();