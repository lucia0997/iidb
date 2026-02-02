#!/bin/bash
# Script de prueba con curl para el endpoint de creación de tecnologías
#
# Uso:
#   chmod +x test_technology_create.sh
#   ./test_technology_create.sh
#
# O con credenciales personalizadas:
#   ./test_technology_create.sh usuario password

BASE_URL="${BASE_URL:-http://localhost:8000}"
USERNAME="${1:-admin}"
PASSWORD="${2:-admin}"

echo "=========================================="
echo "Prueba de creación de tecnologías"
echo "=========================================="
echo "URL Base: $BASE_URL"
echo "Usuario: $USERNAME"
echo ""

# 1. Login
echo "1. Haciendo login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login/" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Error en login"
  echo "Respuesta: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login exitoso"
echo ""

# 2. Verificar nombre
TECH_NAME="Tecnología de Prueba Curl"
echo "2. Verificando si existe: '$TECH_NAME'"
curl -s -X GET "$BASE_URL/technologies/check-name/?name=$TECH_NAME" \
  -H "Authorization: Bearer $TOKEN" \
  | python -m json.tool
echo ""

# 3. Crear tecnología
echo "3. Creando tecnología..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/technologies/create/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "technology_name": "Tecnología de Prueba Curl",
    "current_trl": 5,
    "physical_technology_cluster": "Cluster Físico Test",
    "digital_technology_cluster": "Cluster Digital Test",
    "product_domains": "Producto Test",
    "technology_domains": "Dominio Test",
    "technology_description": "Tecnología creada desde script curl",
    "tech_cluster_dependencies": ["Dep1", "Dep2"],
    "fom_type": "Tipo FoM",
    "fom_value_percent": 12.5,
    "targeted_programmes": ["Prog1", "Prog2"],
    "ac_application": "Aplicación Test",
    "trls": [
      {
        "trl_number": 1,
        "trl_year": 2024,
        "trl_cost": 1000.50
      },
      {
        "trl_number": 2,
        "trl_year": 2025,
        "trl_cost": 2000.75
      }
    ]
  }')

echo "$CREATE_RESPONSE" | python -m json.tool
echo ""

# 4. Verificar de nuevo
echo "4. Verificando de nuevo (debe existir ahora)..."
curl -s -X GET "$BASE_URL/technologies/check-name/?name=$TECH_NAME" \
  -H "Authorization: Bearer $TOKEN" \
  | python -m json.tool
echo ""

echo "✅ Pruebas completadas!"






