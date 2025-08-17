ARG USER

FROM php:8.1-fpm-alpine

# Development tools
RUN apk add --no-cache openssl bash mysql-client nodejs npm

# PHP Extensions
RUN docker-php-ext-install pdo pdo_mysql sockets

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN addgroup scrapy \
    && adduser -G scrapy -s /bin/sh -D scrapy

# Copy application code
COPY . /var/www/scrapy

# Set user and permissions
USER $USER
RUN chown -R scrapy:scrapy /var/www/scrapy
WORKDIR /var/www/scrapy

# Copy entrypoint script and make it executable
COPY ./docker/app/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]
