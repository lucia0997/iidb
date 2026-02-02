# Scripts de Prueba para Creación de Tecnologías

Este directorio contiene scripts para probar los endpoints de creación de tecnologías.

## Endpoints Probados

- **GET** `/technologies/check-name/?name=<nombre>` - Verifica si existe una tecnología por nombre
- **POST** `/technologies/create/` - Crea una nueva tecnología o devuelve el ID si ya existe

## Opción 1: Script Python (Recomendado)

### Requisitos

```bash
pip install requests
```

### Uso Básico

```bash
cd backend
python test_technology_create.py
```

### Uso con Credenciales Personalizadas

```bash
python test_technology_create.py --username tu_usuario --password tu_password
```

### Uso con Token Existente

```bash
python test_technology_create.py --token tu_token_jwt
```

### Uso con URL Personalizada

```bash
python test_technology_create.py --base-url http://localhost:8000
```

### Ejemplo de Salida

El script ejecutará:
1. Login y obtención de token
2. Verificación de nombre (no debe existir)
3. Creación de tecnología con todos los campos incluyendo TRLs
4. Verificación de nombre (debe existir ahora)
5. Intento de crear de nuevo (debe devolver existente)

## Opción 2: Script Bash (curl)

### Uso Básico

```bash
cd backend
chmod +x test_technology_create.sh
./test_technology_create.sh
```

### Uso con Credenciales Personalizadas

```bash
./test_technology_create.sh usuario password
```

### Uso con URL Personalizada

```bash
BASE_URL=http://localhost:8000 ./test_technology_create.sh
```

## Estructura de Datos Esperada

El endpoint `POST /technologies/create/` espera un JSON con esta estructura:

```json
{
  "technology_name": "Nombre de la Tecnología",  // OBLIGATORIO
  "current_trl": 5,                                // OBLIGATORIO (1-9)
  
  // Campos opcionales:
  "physical_technology_cluster": "...",
  "digital_technology_cluster": "...",
  "product_domains": "...",
  "technology_domains": "...",
  "technology_description": "...",
  "tech_cluster_dependencies": ["...", "..."],
  "fom_type": "...",
  "fom_value_percent": 12.5,
  "targeted_programmes": ["...", "..."],
  "ac_application": "...",
  
  // TRLs como lista de objetos:
  "trls": [
    {
      "trl_number": 1,        // OBLIGATORIO
      "trl_year": 2024,       // Opcional
      "trl_cost": 1000.50     // Opcional
    },
    {
      "trl_number": 2,
      "trl_year": 2025,
      "trl_cost": 2000.75
    }
  ]
}
```

## Respuestas del Endpoint

### Si la tecnología se crea nueva:

```json
{
  "created": true,
  "id": 123,
  "technology": {
    // ... datos completos de la tecnología creada
  }
}
```

### Si la tecnología ya existe:

```json
{
  "created": false,
  "id": 123,
  "technology": {
    // ... datos completos de la tecnología existente
  }
}
```

## Notas

- El script Python requiere tener el servidor Django corriendo en `http://localhost:8000` (o la URL que especifiques)
- Los TRLs se crean o actualizan automáticamente si no existen
- El campo `technology_name` debe ser único
- El campo `current_trl` debe ser un número entre 1 y 9






