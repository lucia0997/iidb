#!/usr/bin/env python
"""
Script de prueba para el endpoint de creación de tecnologías.

Uso:
    python test_technology_create.py

O con credenciales personalizadas:
    python test_technology_create.py --username tu_usuario --password tu_password

O con token existente:
    python test_technology_create.py --token tu_token_jwt
"""

import requests
import json
import sys
import argparse
from typing import Optional, Dict, Any


# Configuración
BASE_URL = "http://localhost:8000"  # Ajusta según tu configuración
LOGIN_URL = f"{BASE_URL}/auth/login/"
CHECK_NAME_URL = f"{BASE_URL}/technologies/check-name/"
CREATE_URL = f"{BASE_URL}/technologies/create/"


def login(username: str, password: str) -> Optional[str]:
    """Hace login y devuelve el token de acceso."""
    print(f"\n🔐 Intentando login con usuario: {username}")
    
    response = requests.post(
        LOGIN_URL,
        json={"username": username, "password": password},
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access")
        print(f"✅ Login exitoso!")
        return token
    else:
        print(f"❌ Error en login: {response.status_code}")
        print(f"   Respuesta: {response.text}")
        return None


def check_name(token: str, technology_name: str) -> Dict[str, Any]:
    """Verifica si existe una tecnología por nombre."""
    print(f"\n🔍 Verificando si existe tecnología: '{technology_name}'")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(
        CHECK_NAME_URL,
        params={"name": technology_name},
        headers=headers
    )
    
    print(f"   Status: {response.status_code}")
    data = response.json()
    print(f"   Respuesta: {json.dumps(data, indent=2, ensure_ascii=False)}")
    
    return data


def create_technology(token: str, technology_data: Dict[str, Any]) -> Dict[str, Any]:
    """Crea una nueva tecnología."""
    print(f"\n📝 Creando tecnología: '{technology_data.get('technology_name')}'")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"   Datos enviados:")
    print(f"   {json.dumps(technology_data, indent=2, ensure_ascii=False)}")
    
    response = requests.post(
        CREATE_URL,
        json=technology_data,
        headers=headers
    )
    
    print(f"\n   Status: {response.status_code}")
    data = response.json()
    print(f"   Respuesta:")
    print(f"   {json.dumps(data, indent=2, ensure_ascii=False)}")
    
    return data


def main():
    parser = argparse.ArgumentParser(description="Prueba el endpoint de creación de tecnologías")
    parser.add_argument("--username", default="admin", help="Usuario para login (default: admin)")
    parser.add_argument("--password", default="admin", help="Password para login (default: admin)")
    parser.add_argument("--token", help="Token JWT existente (opcional, omite login)")
    parser.add_argument("--base-url", default="http://localhost:8000", help="URL base del API")
    
    args = parser.parse_args()
    
    global BASE_URL, LOGIN_URL, CHECK_NAME_URL, CREATE_URL
    BASE_URL = args.base_url
    LOGIN_URL = f"{BASE_URL}/auth/login/"
    CHECK_NAME_URL = f"{BASE_URL}/technologies/check-name/"
    CREATE_URL = f"{BASE_URL}/technologies/create/"
    
    # Obtener token
    if args.token:
        token = args.token
        print(f"✅ Usando token proporcionado")
    else:
        token = login(args.username, args.password)
        if not token:
            print("\n❌ No se pudo obtener el token. Saliendo...")
            sys.exit(1)
    
    # Datos de prueba para la tecnología
    technology_data = {
        "technology_name": "Tecnología de Prueba Script",
        "current_trl": 5,
        
        # Campos opcionales
        "physical_technology_cluster": "Cluster Físico Test",
        "digital_technology_cluster": "Cluster Digital Test",
        "product_domains": "Producto Test",
        "technology_domains": "Dominio Test",
        "technology_description": "Esta es una tecnología de prueba creada desde el script",
        "tech_cluster_dependencies": ["Dependencia 1", "Dependencia 2"],
        "fom_type": "Tipo FoM Test",
        "fom_value_percent": 15.75,
        "targeted_programmes": ["Programa A", "Programa B"],
        "ac_application": "Aplicación Test",
        
        # TRLs como lista de objetos
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
            },
            {
                "trl_number": 3,
                "trl_year": None,  # Probando con None
                "trl_cost": 3000.00
            }
        ]
    }
    
    print("\n" + "="*60)
    print("PRUEBA 1: Verificar nombre (debe no existir)")
    print("="*60)
    check_result = check_name(token, technology_data["technology_name"])
    
    print("\n" + "="*60)
    print("PRUEBA 2: Crear tecnología")
    print("="*60)
    create_result = create_technology(token, technology_data)
    
    if create_result.get("created"):
        print("\n✅ Tecnología creada exitosamente!")
        tech_id = create_result.get("id")
        
        print("\n" + "="*60)
        print("PRUEBA 3: Verificar nombre (debe existir ahora)")
        print("="*60)
        check_result_2 = check_name(token, technology_data["technology_name"])
        
        if check_result_2.get("exists"):
            print(f"\n✅ Verificación correcta: La tecnología existe con ID {check_result_2.get('id')}")
        
        print("\n" + "="*60)
        print("PRUEBA 4: Intentar crear de nuevo (debe devolver existente)")
        print("="*60)
        create_result_2 = create_technology(token, technology_data)
        
        if not create_result_2.get("created"):
            print("\n✅ Correcto: Devuelve la tecnología existente sin crear duplicado")
    else:
        print("\n⚠️  La tecnología ya existía, se devolvió la existente")
    
    print("\n" + "="*60)
    print("✅ Pruebas completadas!")
    print("="*60)


if __name__ == "__main__":
    main()






