-- Datos de ejemplo para el sector aeroespacial
-- Ejecutar con: psql -U tu_usuario -d tu_base_de_datos -f sample_data_aerospace.sql

-- Configurar el esquema por defecto
SET search_path TO iidb, public;

-- Primero, insertar tecnologías (deben existir antes que Process y PlantProgramme)
INSERT INTO iidb.technologies (
    technology_cluster, 
    coc_expert_name, 
    product_domains, 
    technology_domains, 
    tdm_names, 
    technology_name, 
    technology_description, 
    current_trl, 
    trl1_year, 
    trl2_year, 
    trl3_year, 
    trl4_year, 
    trl5_year, 
    trl6_year, 
    trl7_year, 
    trl8_year, 
    trl9_year,
    trl1_cost, 
    trl2_cost, 
    trl3_cost, 
    trl4_cost, 
    trl5_cost, 
    trl6_cost, 
    trl7_cost, 
    trl8_cost, 
    trl9_cost,
    tech_cluster_dependencies, 
    fom_type, 
    fom_value_percent, 
    targeted_programmes, 
    ac_application
) VALUES
(
    'Advanced Materials',
    'Dr. Maria Rodriguez',
    'Commercial Aircraft, Military Aircraft',
    'Material Science, Composite Technology',
    '["TDM-MAT-001", "TDM-MAT-002"]',
    'Carbon Fiber Reinforced Polymers (CFRP)',
    'Advanced composite materials for lightweight aircraft structures with improved strength-to-weight ratio',
    7,
    2020, 2021, 2022, 2023, 2024, 2025, 2026, NULL, NULL,
    150000.00, 250000.00, 400000.00, 600000.00, 850000.00, 1200000.00, 1800000.00, NULL, NULL,
    '[]',
    'Weight Reduction',
    25.50,
    '["A320neo", "A350", "A380"]',
    'A320, A350, A380'
),
(
    'Propulsion Systems',
    'Prof. Jean-Luc Dubois',
    'Commercial Aircraft, Helicopters',
    'Propulsion, Electrification',
    '["TDM-PRO-001"]',
    'Hybrid Electric Propulsion',
    'Development of hybrid electric propulsion systems for next-generation aircraft to reduce emissions',
    5,
    2021, 2022, 2023, 2024, 2025, NULL, NULL, NULL, NULL,
    200000.00, 350000.00, 550000.00, 800000.00, 1150000.00, NULL, NULL, NULL, NULL,
    '[]',
    'Fuel Efficiency',
    30.00,
    '["A320neo", "Future Aircraft"]',
    'A320neo, Future Aircraft'
),
(
    'Avionics & Navigation',
    'Dr. Klaus Weber',
    'Commercial Aircraft, Space',
    'Electronics, Navigation Systems',
    '["TDM-AVI-001", "TDM-AVI-002", "TDM-AVI-003"]',
    'Advanced Flight Management Systems (FMS)',
    'Next-generation flight management systems with enhanced navigation and route optimization capabilities',
    8,
    2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, NULL,
    100000.00, 180000.00, 300000.00, 450000.00, 650000.00, 900000.00, 1300000.00, 1800000.00, NULL,
    '[]',
    'Operational Efficiency',
    15.75,
    '["A320neo", "A330neo", "A350"]',
    'A320neo, A330neo, A350'
),
(
    'Structures & Manufacturing',
    'Ing. Sophie Martin',
    'Commercial Aircraft, Military Aircraft',
    'Manufacturing, Assembly',
    '["TDM-STR-001"]',
    'Automated Assembly Lines',
    'Robotic assembly systems for aircraft fuselage and wing components',
    6,
    2020, 2021, 2022, 2023, 2024, 2025, NULL, NULL, NULL,
    500000.00, 850000.00, 1300000.00, 1900000.00, 2600000.00, 3500000.00, NULL, NULL, NULL,
    '["Advanced Materials"]',
    'Production Efficiency',
    40.00,
    '["A320", "A330", "A350"]',
    'All Commercial Aircraft'
),
(
    'Connectivity & IoT',
    'Dr. Yuki Tanaka',
    'Commercial Aircraft, Helicopters',
    'Connectivity, Data Analytics',
    '["TDM-IOT-001"]',
    'Aircraft Health Monitoring Systems',
    'Real-time health monitoring and predictive maintenance systems using IoT sensors and AI',
    7,
    2021, 2022, 2023, 2024, 2025, 2026, 2027, NULL, NULL,
    180000.00, 320000.00, 500000.00, 750000.00, 1050000.00, 1450000.00, 2000000.00, NULL, NULL,
    '[]',
    'Maintenance Cost Reduction',
    20.30,
    '["A320", "A330", "A350", "A380"]',
    'All Commercial Aircraft'
);

-- Insertar procesos
-- Nota: Django crea la columna como "technology_name_id" para ForeignKeys
-- pero almacena el valor del campo referenciado (technology_name string)
INSERT INTO iidb.processes (
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

-- Insertar programas de plantas
-- Nota: Django crea la columna como "technology_name_id" para ForeignKeys
-- pero almacena el valor del campo referenciado (technology_name string)
INSERT INTO iidb.plants_programmes (
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

-- Insertar estrategias
INSERT INTO iidb.strategies (
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

-- Insertar proyectos
INSERT INTO iidb.projects (
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

