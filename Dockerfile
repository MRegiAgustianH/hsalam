FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath xml \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files first (layer cache)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy package files and install Node deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest
COPY . .

# Post-install
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi 2>/dev/null || true

# Build frontend assets
RUN npm run build

# Create all required Laravel directories
RUN mkdir -p storage/framework/sessions \
    && mkdir -p storage/framework/views \
    && mkdir -p storage/framework/cache/data \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chmod -R 777 storage \
    && chmod -R 777 bootstrap/cache

# Use .env.example as base .env (Railway env vars will override)
RUN cp .env.example .env

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "=== HSalam Starting ==="' >> /app/start.sh && \
    echo 'php -v | head -1' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Ensure storage dirs exist and are writable' >> /app/start.sh && \
    echo 'mkdir -p storage/framework/{sessions,views,cache/data} storage/logs bootstrap/cache' >> /app/start.sh && \
    echo 'chmod -R 777 storage bootstrap/cache' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Clear all caches first' >> /app/start.sh && \
    echo 'php artisan config:clear 2>/dev/null || true' >> /app/start.sh && \
    echo 'php artisan cache:clear 2>/dev/null || true' >> /app/start.sh && \
    echo 'php artisan route:clear 2>/dev/null || true' >> /app/start.sh && \
    echo 'php artisan view:clear 2>/dev/null || true' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Run migrations' >> /app/start.sh && \
    echo 'echo "Running migrations..."' >> /app/start.sh && \
    echo 'php artisan migrate --force 2>&1 || echo "Migration warning (may already be migrated)"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Seed database' >> /app/start.sh && \
    echo 'echo "Seeding database..."' >> /app/start.sh && \
    echo 'php artisan db:seed --force 2>&1 || echo "Seed warning (may already be seeded)"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Storage link' >> /app/start.sh && \
    echo 'php artisan storage:link 2>/dev/null || true' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "=== Starting server on port ${PORT:-8080} ==="' >> /app/start.sh && \
    echo 'exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 8080

CMD ["/app/start.sh"]
