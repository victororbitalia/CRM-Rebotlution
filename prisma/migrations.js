const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
  connectionString: 'postgres://cofradia_user:admin1234@ibidem_bot_cofradia-db:5432/cofradia_db?sslmode=disable',
});

// SQL para ejecutar
const sql = `
-- Añadir campos de posición a la tabla Table (solo si no existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Table' AND column_name='positionX') THEN
        ALTER TABLE "Table" ADD COLUMN "positionX" REAL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Table' AND column_name='positionY') THEN
        ALTER TABLE "Table" ADD COLUMN "positionY" REAL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Table' AND column_name='zoneId') THEN
        ALTER TABLE "Table" ADD COLUMN "zoneId" TEXT;
    END IF;
END $$;

-- Crear tabla Zone (solo si no existe)
CREATE TABLE IF NOT EXISTS "Zone" (
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

-- Crear índice único en Zone.name (solo si no existe)
CREATE UNIQUE INDEX IF NOT EXISTS "Zone_name_key" ON "Zone"("name");

-- Insertar zonas por defecto (solo si no existen)
INSERT INTO "Zone" ("id", "name", "displayName", "color", "boundaryX", "boundaryY", "width", "height", "isActive", "createdAt", "updatedAt")
VALUES
    ('zone-interior', 'interior', 'Interior', '#e5e7eb', 0, 0, 50, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('zone-terraza', 'terraza', 'Terraza', '#dbeafe', 50, 0, 50, 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Añadir clave foránea para zoneId (solo si no existe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'Table_zoneId_fkey'
        AND table_name = 'Table'
    ) THEN
        ALTER TABLE "Table" ADD CONSTRAINT "Table_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
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