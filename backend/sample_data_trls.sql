-- sample_data_full.sql
-- Rellena tecnologías, TRLs, relaciones TechnologyTRL y el resto de tablas
-- Ejecutar con: psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -f sample_data_full.sql

SET search_path TO iidb, public;

-- =========================================================
-- 1) TECHNOLOGIES
-- =========================================================
INSERT INTO technologies (
    physical_technology_cluster,
    digital_technology_cluster,
    product_domains,
    technology_domains,
    technology_name,
    technology_description,
    current_trl,
    tech_cluster_dependencies,
    fom_type,
    fom_value_percent,
    targeted_programmes,
    ac_application
) VALUES
(
    'Industrialization for Non-Metallics',
    'None',
    'Commercial Aircraft, Military Aircraft',
    'Material Science, Composite Technology',
    'Carbon Fiber Reinforced Polymers (CFRP)',
    'Advanced composite materials for lightweight aircraft structures with improved strength-to-weight ratio',
    7,
    '[]',
    'Weight Reduction',
    25.50,
    '["A320neo", "A350", "A380"]',
    'A320, A350, A380'
),
(
    'Propulsion Systems',
    'None',
    'Commercial Aircraft, Helicopters',
    'Propulsion, Electrification',
    'Hybrid Electric Propulsion',
    'Development of hybrid electric propulsion systems for next-generation aircraft to reduce emissions',
    5,
    '[]',
    'Fuel Efficiency',
    30.00,
    '["A320neo", "Future Aircraft"]',
    'A320neo, Future Aircraft'
),
(
    'Avionics & Navigation',
    'None',
    'Commercial Aircraft, Space',
    'Electronics, Navigation Systems',
    'Advanced Flight Management Systems (FMS)',
    'Next-generation flight management systems with enhanced navigation and route optimization capabilities',
    8,
    '[]',
    'Operational Efficiency',
    15.75,
    '["A320neo", "A330neo", "A350"]',
    'A320neo, A330neo, A350'
),
(
    'Structures & Manufacturing',
    'None',
    'Commercial Aircraft, Military Aircraft',
    'Manufacturing, Assembly',
    'Automated Assembly Lines',
    'Robotic assembly systems for aircraft fuselage and wing components',
    6,
    '["Advanced Materials"]',
    'Production Efficiency',
    40.00,
    '["A320", "A330", "A350"]',
    'All Commercial Aircraft'
),
(
    'Connectivity & IoT',
    'None',
    'Commercial Aircraft, Helicopters',
    'Connectivity, Data Analytics',
    'Aircraft Health Monitoring Systems',
    'Real-time health monitoring and predictive maintenance systems using IoT sensors and AI',
    7,
    '[]',
    'Maintenance Cost Reduction',
    20.30,
    '["A320", "A330", "A350", "A380"]',
    'All Commercial Aircraft'
);

-- =========================================================
-- 2) TRLS
-- =========================================================
-- Insertamos TRLs (nivel, año, coste)
INSERT INTO trls (trl_number, trl_year, trl_cost) VALUES
    -- CFRP
    (5, 2023, 600000.00),
    (7, 2025, 1200000.00),

    -- Hybrid Electric Propulsion
    (4, 2022, 350000.00),
    (6, 2025, 900000.00),

    -- FMS
    (6, 2022, 900000.00),
    (8, 2024, 1800000.00),

    -- Automated Assembly Lines
    (5, 2023, 1300000.00),
    (6, 2024, 1900000.00),

    -- Aircraft Health Monitoring Systems
    (6, 2024, 1450000.00),
    (7, 2025, 2000000.00)
ON CONFLICT DO NOTHING;

-- =========================================================
-- 3) TECHNOLOGY_TRLS (M2M Technology ↔ TRL)
-- =========================================================
WITH data AS (
    VALUES
        -- technology_name, trl_number, trl_year, trl_cost
        ('Carbon Fiber Reinforced Polymers (CFRP)',            5, 2023,  600000.00),
        ('Carbon Fiber Reinforced Polymers (CFRP)',            7, 2025, 1200000.00),

        ('Hybrid Electric Propulsion',                         4, 2022,  350000.00),
        ('Hybrid Electric Propulsion',                         6, 2025,  900000.00),

        ('Advanced Flight Management Systems (FMS)',           6, 2022,  900000.00),
        ('Advanced Flight Management Systems (FMS)',           8, 2024, 1800000.00),

        ('Automated Assembly Lines',                           5, 2023, 1300000.00),
        ('Automated Assembly Lines',                           6, 2024, 1900000.00),

        ('Aircraft Health Monitoring Systems',                 6, 2024, 1450000.00),
        ('Aircraft Health Monitoring Systems',                 7, 2025, 2000000.00)
),
paired AS (
    SELECT
        t.id       AS technology_id,
        trl.id     AS trl_id,
        trl.trl_number
    FROM data d
    JOIN technologies t
      ON t.technology_name = d.column1
    JOIN trls trl
      ON trl.trl_number = d.column2
     AND trl.trl_year   = d.column3
     AND trl.trl_cost   = d.column4
)
INSERT INTO technology_trls (technology_id, trl_id, trl_number)
SELECT DISTINCT technology_id, trl_id, trl_number
FROM paired
ON CONFLICT DO NOTHING;

-- =========================================================
-- 4) PROCESSES
-- =========================================================
INSERT INTO processes (
    group_processes,
    subgroup_processes,
    process_name,
    process_resp_name,
    technology_name_id
) VALUES
(
    'Manufacturing',
    'Composite Manufacturing',
    'CFRP Layup and Curing Process',
    'Carlos Fernandez',
    'Carbon Fiber Reinforced Polymers (CFRP)'
),
(
    'Manufacturing',
    'Assembly',
    'Automated Wing Assembly',
    'Anna Kowalski',
    'Automated Assembly Lines'
),
(
    'Testing',
    'Propulsion Testing',
    'Hybrid Propulsion System Validation',
    'Pierre Moreau',
    'Hybrid Electric Propulsion'
),
(
    'Integration',
    'Avionics Integration',
    'FMS Software Integration and Testing',
    'Michael Chen',
    'Advanced Flight Management Systems (FMS)'
),
(
    'Maintenance',
    'Predictive Maintenance',
    'Sensor Data Collection and Analysis',
    'Laura Garcia',
    'Aircraft Health Monitoring Systems'
),
(
    'Manufacturing',
    'Composite Manufacturing',
    'Quality Control for CFRP Components',
    'Thomas Schmidt',
    'Carbon Fiber Reinforced Polymers (CFRP)'
);

-- =========================================================
-- 5) PLANTS_PROGRAMMES
-- =========================================================
INSERT INTO plants_programmes (
    technology_name_id,
    program,
    business,
    site
) VALUES
(
    'Carbon Fiber Reinforced Polymers (CFRP)',
    '["A350", "A380", "A320neo"]',
    'Commercial Aircraft',
    'Toulouse, France'
),
(
    'Hybrid Electric Propulsion',
    '["Future Aircraft", "A320neo"]',
    'Commercial Aircraft',
    'Hamburg, Germany'
),
(
    'Advanced Flight Management Systems (FMS)',
    '["A320neo", "A330neo", "A350"]',
    'Commercial Aircraft',
    'Toulouse, France'
),
(
    'Automated Assembly Lines',
    '["A320", "A330", "A350"]',
    'Commercial Aircraft',
    'Hamburg, Germany'
),
(
    'Aircraft Health Monitoring Systems',
    '["A320", "A330", "A350", "A380"]',
    'Commercial Aircraft',
    'Toulouse, France'
),
(
    'Carbon Fiber Reinforced Polymers (CFRP)',
    '["A350"]',
    'Commercial Aircraft',
    'Broughton, UK'
);

-- =========================================================
-- 6) STRATEGIES
-- =========================================================
INSERT INTO strategies (
    cosmos_dvs,
    cosmos_dvs_resp_name,
    coc_clusters,
    coc_expertise,
    coc_expert_name
) VALUES
(
    'DVS-Aero-2024-001',
    'Dr. Pierre Dubois',
    'Materials & Structures',
    'Composite Materials',
    'Dr. Maria Rodriguez'
),
(
    'DVS-Aero-2024-002',
    'Dr. Elena Volkova',
    'Propulsion & Energy',
    'Electric Propulsion',
    'Prof. Jean-Luc Dubois'
),
(
    'DVS-Aero-2024-003',
    'Mr. James Wilson',
    'Avionics & Systems',
    'Flight Management Systems',
    'Dr. Klaus Weber'
),
(
    'DVS-Aero-2024-004',
    'Dr. Sophie Martin',
    'Manufacturing & Assembly',
    'Automated Manufacturing',
    'Ing. Sophie Martin'
),
(
    'DVS-Aero-2024-005',
    'Prof. David Kim',
    'Digital & Connectivity',
    'IoT and Data Analytics',
    'Dr. Yuki Tanaka'
);

-- =========================================================
-- 7) PROJECTS
-- =========================================================
INSERT INTO projects (
    project_id,
    project_name,
    status,
    project_description,
    project_benefits,
    ads_group,
    programmes,
    synergies,
    project_leader,
    other_team_members,
    project_start_date,
    project_end_date,
    project_total_cost,
    project_funding_call,
    project_maturity,
    project_running_status
) VALUES
(
    'PROJ-2024-001',
    'Next-Gen Lightweight Materials',
    'In Progress',
    'Development of advanced CFRP materials for aircraft structures',
    '25% weight reduction, improved fuel efficiency',
    'Airbus Commercial',
    '["A350", "A380", "A320neo"]',
    'PROJ-2024-005',
    'Dr. Maria Rodriguez',
    'Carlos Fernandez, Anna Kowalski',
    '2024-01-15',
    '2026-12-31',
    4500000.00,
    'H2020-AERO-2024',
    'TRL 7',
    'Active'
),
(
    'PROJ-2024-002',
    'Hybrid Electric Propulsion Development',
    'In Progress',
    'Research and development of hybrid electric propulsion systems',
    '30% fuel savings, reduced emissions',
    'Airbus Commercial',
    '["Future Aircraft", "A320neo"]',
    'PROJ-2024-001',
    'Prof. Jean-Luc Dubois',
    'Pierre Moreau, Elena Volkova',
    '2024-03-01',
    '2027-06-30',
    6500000.00,
    'H2020-AERO-2024',
    'TRL 5',
    'Active'
),
(
    'PROJ-2024-003',
    'Advanced FMS Integration',
    'Completed',
    'Integration of next-generation flight management systems',
    '15% operational efficiency improvement',
    'Airbus Commercial',
    '["A320neo", "A330neo", "A350"]',
    '',
    'Dr. Klaus Weber',
    'Michael Chen, James Wilson',
    '2023-06-01',
    '2024-11-30',
    3800000.00,
    'H2020-AERO-2023',
    'TRL 8',
    'Completed'
),
(
    'PROJ-2024-004',
    'Smart Manufacturing Initiative',
    'In Progress',
    'Implementation of automated assembly lines with AI',
    '40% production efficiency increase',
    'Airbus Commercial',
    '["A320", "A330", "A350"]',
    'PROJ-2024-001',
    'Ing. Sophie Martin',
    'Thomas Schmidt, David Kim',
    '2024-02-01',
    '2026-08-31',
    5200000.00,
    'H2020-AERO-2024',
    'TRL 6',
    'Active'
),
(
    'PROJ-2024-005',
    'Predictive Maintenance Platform',
    'In Progress',
    'Development of IoT-based health monitoring system',
    '20% maintenance cost reduction',
    'Airbus Commercial',
    '["A320", "A330", "A350", "A380"]',
    '',
    'Dr. Yuki Tanaka',
    'Laura Garcia, Prof. David Kim',
    '2024-04-01',
    '2027-03-31',
    4800000.00,
    'H2020-AERO-2024',
    'TRL 7',
    'Active'
);