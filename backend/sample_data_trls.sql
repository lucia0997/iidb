-- Script SQL para rellenar TRLs y relacionarlos con Technologies
-- Ejecutar DESPUÉS de sample_data_aerospace.sql
-- Ejecutar con: psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f sample_data_trls.sql

-- Configurar el esquema por defecto
SET search_path TO iidb, public;

-- ============================================================================
-- PASO 1: Insertar TRLs en la tabla trls
-- ============================================================================
-- Insertamos TRLs únicos (cada combinación de trl_number, trl_year, trl_cost)

INSERT INTO iidb.trls (trl_number, trl_year, trl_cost) VALUES
    -- Carbon Fiber Reinforced Polymers (CFRP) - TRL 5 y 7
    (5, 2023, 600000.00),
    (7, 2025, 1200000.00),
    
    -- Hybrid Electric Propulsion - TRL 4 y 6
    (4, 2022, 350000.00),
    (6, 2025, 900000.00),
    
    -- Advanced Flight Management Systems (FMS) - TRL 6 y 8
    (6, 2022, 900000.00),
    (8, 2024, 1800000.00),
    
    -- Automated Assembly Lines - TRL 5 y 6
    (5, 2023, 1300000.00),
    (6, 2024, 1900000.00),
    
    -- Aircraft Health Monitoring Systems - TRL 6 y 7
    (6, 2024, 1450000.00),
    (7, 2025, 2000000.00)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PASO 2: Relacionar Technologies con TRLs en la tabla technology_trls
-- ============================================================================
-- La tabla technology_trls conecta technologies.id con trls.id
-- Regla: solo puede haber un TRL por cada trl_number (1-9) por tecnología

-- Carbon Fiber Reinforced Polymers (CFRP) - TRL 5 y 7
INSERT INTO iidb.technology_trls (technology_id, trl_id, trl_number)
SELECT 
    t.id AS technology_id,
    trl.id AS trl_id,
    trl.trl_number
FROM iidb.technologies t
CROSS JOIN iidb.trls trl
WHERE t.technology_name = 'Carbon Fiber Reinforced Polymers (CFRP)'
  AND trl.trl_number IN (5, 7)
  AND trl.trl_year IN (2023, 2025)
ON CONFLICT (technology_id, trl_number) DO NOTHING;

-- Hybrid Electric Propulsion - TRL 4 y 6
INSERT INTO iidb.technology_trls (technology_id, trl_id, trl_number)
SELECT 
    t.id AS technology_id,
    trl.id AS trl_id,
    trl.trl_number
FROM iidb.technologies t
CROSS JOIN iidb.trls trl
WHERE t.technology_name = 'Hybrid Electric Propulsion'
  AND trl.trl_number IN (4, 6)
  AND trl.trl_year IN (2022, 2025)
ON CONFLICT (technology_id, trl_number) DO NOTHING;

-- Advanced Flight Management Systems (FMS) - TRL 6 y 8
INSERT INTO iidb.technology_trls (technology_id, trl_id, trl_number)
SELECT 
    t.id AS technology_id,
    trl.id AS trl_id,
    trl.trl_number
FROM iidb.technologies t
CROSS JOIN iidb.trls trl
WHERE t.technology_name = 'Advanced Flight Management Systems (FMS)'
  AND trl.trl_number IN (6, 8)
  AND trl.trl_year IN (2022, 2024)
ON CONFLICT (technology_id, trl_number) DO NOTHING;

-- Automated Assembly Lines - TRL 5 y 6
INSERT INTO iidb.technology_trls (technology_id, trl_id, trl_number)
SELECT 
    t.id AS technology_id,
    trl.id AS trl_id,
    trl.trl_number
FROM iidb.technologies t
CROSS JOIN iidb.trls trl
WHERE t.technology_name = 'Automated Assembly Lines'
  AND trl.trl_number IN (5, 6)
  AND trl.trl_year IN (2023, 2024)
ON CONFLICT (technology_id, trl_number) DO NOTHING;

-- Aircraft Health Monitoring Systems - TRL 6 y 7
INSERT INTO iidb.technology_trls (technology_id, trl_id, trl_number)
SELECT 
    t.id AS technology_id,
    trl.id AS trl_id,
    trl.trl_number
FROM iidb.technologies t
CROSS JOIN iidb.trls trl
WHERE t.technology_name = 'Aircraft Health Monitoring Systems'
  AND trl.trl_number IN (6, 7)
  AND trl.trl_year IN (2024, 2025)
ON CONFLICT (technology_id, trl_number) DO NOTHING;

-- ============================================================================
-- VERIFICACIÓN: Consulta para ver los datos insertados
-- ============================================================================
SELECT 
    t.id AS technology_id,
    t.technology_name,
    tt.trl_number,
    trl.trl_year,
    trl.trl_cost,
    trl.id AS trl_id
FROM iidb.technologies t
LEFT JOIN iidb.technology_trls tt ON tt.technology_id = t.id
LEFT JOIN iidb.trls trl ON tt.trl_id = trl.id
WHERE t.technology_name IN (
    'Carbon Fiber Reinforced Polymers (CFRP)',
    'Hybrid Electric Propulsion',
    'Advanced Flight Management Systems (FMS)',
    'Automated Assembly Lines',
    'Aircraft Health Monitoring Systems'
)
ORDER BY t.technology_name, tt.trl_number;

-- ============================================================================
-- RESUMEN: Contar TRLs por tecnología
-- ============================================================================
SELECT 
    t.technology_name,
    COUNT(tt.trl_id) AS total_trls,
    STRING_AGG(tt.trl_number::text, ', ' ORDER BY tt.trl_number) AS trl_numbers
FROM iidb.technologies t
LEFT JOIN iidb.technology_trls tt ON tt.technology_id = t.id
WHERE t.technology_name IN (
    'Carbon Fiber Reinforced Polymers (CFRP)',
    'Hybrid Electric Propulsion',
    'Advanced Flight Management Systems (FMS)',
    'Automated Assembly Lines',
    'Aircraft Health Monitoring Systems'
)
GROUP BY t.technology_name
ORDER BY t.technology_name;
