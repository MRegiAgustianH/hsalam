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
RUN composer dump-autoload --optimize

# Build frontend assets
RUN npm run build

# Create required directories
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Remove .env file so Laravel uses system env vars from Railway
RUN rm -f .env

EXPOSE 8080

# Startup script - more resilient
CMD sh -c "\
    echo '--- HSalam Starting ---' && \
    echo 'PHP version:' && php -v | head -1 && \
    php artisan key:generate --force || true && \
    php artisan migrate --force 2>&1 || echo 'Migration skipped or failed' && \
    php artisan db:seed --force 2>&1 || echo 'Seed skipped or already seeded' && \
    php artisan config:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    echo '--- Starting server on port ${PORT:-8080} ---' && \
    php artisan serve --host=0.0.0.0 --port=\${PORT:-8080}"
