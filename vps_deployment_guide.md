# AIAIntelligence OS - Guía Suprema de Despliegue en Servidor VPS (Ubuntu)
## Infraestructura en clauding.io: Seguridad, LEMP, Docker y Certificados SSL

Esta guía técnica describe el proceso detallado para aprovisionar, asegurar, configurar y desplegar **AIAIntelligence** en un servidor VPS con Ubuntu 22.04 LTS (o superior) en el proveedor clauding.io.

---

## 1. Fase 1: Bastionado y Seguridad Inicial del Servidor (Hardening)

Antes de instalar cualquier paquete, es mandatorio asegurar el servidor contra ataques de fuerza bruta y accesos no autorizados.

### Paso 1: Acceso Inicial y Actualización del Sistema
Accede como root a tu servidor VPS mediante SSH (las credenciales iniciales son provistas por clauding.io):
```bash
ssh root@103.23.61.157
```
Actualiza los repositorios y paquetes instalados a su última versión de seguridad:
```bash
apt update && apt upgrade -y
```

### Paso 2: Crear un Usuario del Sistema Protegido (No-Root)
Nunca operes el servidor como `root` en producción. Crea un usuario dedicado para el despliegue (ej. `deployer`):
```bash
# Crear el usuario
adduser deployer

# Otorgar privilegios de administrador (sudo)
usermod -aG sudo deployer
```

### Paso 3: Configurar Autenticación por Claves SSH (Sin Contraseña)
En tu máquina local (tu PC), copia tu clave pública al servidor VPS para permitir el acceso sin contraseñas:
```bash
# Ejecutar en tu máquina local (usando la clave RSA que creamos):
ssh-copy-id -i ~/.ssh/id_rsa.pub deployer@103.23.61.157
```

Una vez copiada, accede al servidor con el nuevo usuario y deshabilita el acceso root y contraseñas por completo. Abre el archivo de configuración SSH:
```bash
sudo nano /etc/ssh/sshd_config
```
Asegura y modifica las siguientes líneas:
```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```
Guarda el archivo (`Ctrl + O`, `Enter`, `Ctrl + X`) y reinicia el servicio SSH:
```bash
sudo systemctl restart ssh
```
> [!WARNING]
> No cierres tu sesión actual de terminal hasta verificar en una **nueva ventana** de terminal que puedes acceder exitosamente con: `ssh deployer@103.23.61.157`.

### Paso 4: Cortafuegos Activo (UFW)
Habilita el cortafuegos permitiendo únicamente el tráfico de SSH, HTTP y HTTPS:
```bash
# Configurar reglas por defecto
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir puertos específicos
sudo ufw allow 22/tcp comment 'SSH Port'
sudo ufw allow 80/tcp comment 'HTTP Web'
sudo ufw allow 443/tcp comment 'HTTPS Web SSL'

# Habilitar el cortafuegos
sudo ufw enable
```

---

## 2. Fase 2: Configuración del Entorno de Ejecución (Estrategia Recomendada: Docker)

Utilizar Docker en producción simplifica drásticamente el mantenimiento de la aplicación, aislando las dependencias del sistema y garantizando que las versiones de PHP, Node, MySQL y Redis funcionen exactamente igual en producción que en tu entorno de desarrollo.

### Paso 1: Instalar Docker y Docker Compose
En el servidor VPS, ejecuta el script oficial de instalación rápida de Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Añadir a tu usuario deployer al grupo docker para ejecutar sin sudo
sudo usermod -aG docker deployer
```
*Cierra tu sesión SSH y vuelve a entrar para aplicar el cambio del grupo.*

### Paso 2: Clonar el Proyecto AIAintelligence
Clona el repositorio de tu proyecto en la ruta estándar de aplicaciones web (`/var/www/`):
```bash
sudo mkdir -p /var/www/aiaintelligence
sudo chown -R deployer:deployer /var/www/aiaintelligence
cd /var/www/aiaintelligence

# Clona tu código de GitHub
git clone https://github.com/RafaG86/AIAintelligence.git .
```

### Paso 3: Configurar Variables de Entorno de Producción (`.env`)
Copia la plantilla de variables de entorno y configúrala con contraseñas seguras y aleatorias:
```bash
cp .env.example .env
nano .env
```
Asegura los siguientes valores clave:
```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=nexusflow_prod
DB_USERNAME=nexusflow_user
DB_PASSWORD=EscribeUnaContraseñaMuySeguraYDeMasDe16Caracteres
DB_ROOT_PASSWORD=EscribeOtraContraseñaDiferenteYMuySegura

REDIS_HOST=redis
REDIS_PASSWORD=ContraseñaSeguraParaRedis
REDIS_PORT=6379

N8N_WEBHOOK_SECRET=FirmaHMACCompartidaConN8n
```
Genera la clave de cifrado única de Laravel:
```bash
# Temporalmente levantamos un contenedor ligero para generar la key
docker run --rm -v $(pwd):/app -w /app php:8.3-cli php artisan key:generate
```

---

## 3. Fase 3: Despliegue y Orquestación

Con todo configurado, compila y levanta la infraestructura de forma automatizada:

```bash
# Compilar las imágenes y arrancar los servicios en segundo plano (detached)
docker compose up -d --build
```

### Paso 1: Ejecutar Migraciones de Base de Datos y Seeders
Crea las tablas especificadas en tu esquema de base de datos relacional dentro del contenedor MySQL:
```bash
docker compose exec app php artisan migrate --force
```

---

## 4. Fase 4: Configuración de Certificados SSL (HTTPS) con Let's Encrypt

Para habilitar la encriptación SSL de grado militar de forma gratuita y automática, utilizaremos **Certbot**.

### Paso 1: Instalar Certbot en Ubuntu
```bash
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### Paso 2: Detener temporalmente el contenedor de Nginx para liberar el puerto 80
Certbot levantará un servidor web temporal para validar la propiedad de tu dominio:
```bash
docker compose stop webserver
```

### Paso 3: Generar los Certificados SSL
```bash
sudo certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com --agree-tos --email tu-correo@dominio.com
```
Los certificados se guardarán de forma segura en el servidor en la ruta: `/etc/letsencrypt/live/tu-dominio.com/`.

### Paso 4: Configurar Nginx para producción con SSL
Modifica el archivo de configuración de Nginx (`docker/nginx/default.conf`) para redirigir todo el tráfico HTTP a HTTPS de manera forzada y apuntar a los certificados:

```nginx
# docker/nginx/default.conf
server {
    listen 80;
    listen [::]:80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;
    root /var/www/public;

    # Certificados SSL de Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    # Parámetros recomendados de Seguridad SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf-8;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }
}
```

### Paso 5: Reiniciar Nginx
Vuelve a iniciar el orquestador:
```bash
docker compose start webserver
```

---

## 5. Script de Despliegue Continuo Automatizado (`deploy.sh`)

Para agilizar las actualizaciones del sistema sin intervención manual compleja, crea un script de bash en la raíz del proyecto. Este script realiza el pull de git, reconstruye la interfaz en React de ser necesario, ejecuta migraciones y limpia la caché.

Crea el archivo `deploy.sh`:
```bash
nano deploy.sh
```
Pega el siguiente código optimizado:
```bash
#!/bin/bash
set -e

echo "=== INICIANDO DESPLIEGUE DE AIAINTELLIGENCE OS ==="

# 1. Poner la aplicación Laravel en Modo Mantenimiento
docker compose exec app php artisan down || true

# 2. Obtener última versión del código
git pull origin main

# 3. Recompilar imágenes de Docker y reiniciar servicios
docker compose up -d --build

# 4. Instalar dependencias internas y limpiar caché de Laravel
docker compose exec app composer install --no-dev --optimize-autoloader
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache

# 5. Ejecutar migraciones pendientes de forma forzada (producción)
docker compose exec app php artisan migrate --force

# 6. Levantar la aplicación de nuevo
docker compose exec app php artisan up

echo "=== DESPLIEGUE COMPLETADO EXITOSAMENTE ==="
```
Otorga permisos de ejecución al script:
```bash
chmod +x deploy.sh
```
A partir de ahora, para actualizar tu aplicación solo debes ejecutar en tu terminal: `./deploy.sh`.
