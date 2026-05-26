# =============================================================================
# AIAINTELLIGENCE OS - DOCKERFILE MULTI-STAGE DE PRODUCCIÓN
# Optimizado para PHP 8.3 FPM, Nginx, React y TypeScript (Inertia.js)
# =============================================================================

# -----------------------------------------------------------------------------
# ETAPA 1: COMPILACIÓN DE FRONTEND (REACT / VITE)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Copiar archivos de dependencias del package manager para caching de capas
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el código fuente completo
COPY . .

# Compilar los assets estáticos con Vite (generará archivos en public/build)
RUN npm run build

# -----------------------------------------------------------------------------
# ETAPA 2: CONFIGURACIÓN DE RUNTIME DEL BACKEND (PHP 8.3 FPM)
# -----------------------------------------------------------------------------
FROM php:8.3-fpm-alpine AS backend-runtime

# Argumentos de compilación para control de permisos
ARG USER_NAME=aiaintelligence
ARG USER_ID=1000

# Directorio de trabajo en el contenedor
WORKDIR /var/www

# Instalar dependencias del sistema y herramientas de compilación PHP
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    unzip \
    zip \
    bash \
    icu-dev \
    shadow

# Configurar e instalar extensiones de PHP requeridas para Laravel y MySQL
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        gd \
        zip \
        bcmath \
        opcache \
        intl

# Instalar Composer de forma segura desde la imagen oficial
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Copiar archivos de dependencias de Composer para caching eficiente
COPY composer.json composer.lock ./

# Instalar dependencias de PHP sin dependencias de desarrollo y optimizando el autoloader
RUN composer install --no-dev --no-interaction --no-plugins --no-scripts --prefer-dist --no-autoloader

# Copiar el código fuente del proyecto completo al contenedor
COPY . .

# Copiar los assets compilados de React de la etapa anterior (Frontend)
COPY --from=frontend-builder /app/public/build ./public/build

# Optimizar el Autoloader de Composer definitivo
RUN composer dump-autoload --no-dev --classmap-authoritative

# Configurar OPcache para producción (Máximo rendimiento PHP)
RUN { \
    echo 'opcache.memory_consumption=192'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'opcache.max_accelerated_files=20000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Crear usuario del sistema dedicado no-root para seguridad del contenedor
RUN useradd -u ${USER_ID} -m -s /bin/bash ${USER_NAME} \
    && chown -R ${USER_NAME}:${USER_NAME} /var/www

# Configurar permisos para almacenamiento y caché de Laravel
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Cambiar el usuario actual de ejecución del contenedor al usuario seguro
USER ${USER_NAME}

# Exponer el puerto por defecto de PHP-FPM (9000)
EXPOSE 9000

# Lanzar el servidor de procesos de PHP
CMD ["php-fpm"]
