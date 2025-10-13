const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  connectionString: 'postgres://cofradia_user:admin1234@ibidem_bot_cofradia-db:5432/cofradia_db?sslmode=disable',
});

// SQL para ejecutar
const sql = `
-- Añadir campos de posición a la tabla Table
ALTER TABLE "Table" ADD COLUMN "positionX" REAL;
ALTER TABLE "Table" ADD COLUMN "positionY" REAL;
ALTER TABLE "Table" ADD COLUMN "zoneId" TEXT;

-- Crear tabla Zone
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#e5e7eb',
    "boundaryX" REAL,
    "boundaryY" REAL,
    "width" REAL,
    "height" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- Crear índice único en Zone.name
CREATE UNIQUE INDEX "Zone_name_key" ON "Zone"("name");

-- Insertar zonas por defecto
INSERT INTO "Zone" ("id", "name", "displayName", "color", "boundaryX", "boundaryY", "width", "height", "isActive", "createdAt", "updatedAt") VALUES
    ('zone-interior', 'interior', 'Interior', '#e5e7eb', 0, 0, 50, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('zone-terraza', 'terraza', 'Terraza', '#dbeafe', 50, 0, 50, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Añadir clave foránea para zoneId (ejecutar después de crear la tabla Zone)
ALTER TABLE "Table" ADD CONSTRAINT "Table_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
`;

// Función para ejecutar la migración
async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Iniciando migración...');
    await client.query(sql);
    console.log('Migración completada exitosamente!');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar la migración
runMigration();