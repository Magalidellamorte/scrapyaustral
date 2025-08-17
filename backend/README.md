# Scrapy - API

## Project Setup

### Pre-requisites
* PHP v8.1
* MySQL

### Setup Local environment

1. Get Sources:
   ```shell
   git clone https://github.com/Scrapyapp/api.git
   cd api
   ```
2. Install dependencies:
   ```shell
   composer install
   ```
3. Create a new MySQL DB Schema:
   ```sql
   CREATE
       SCHEMA `scrapy`
       CHARACTER SET utf8mb4
       COLLATE utf8mb4_unicode_ci;
   ```
4. Define a DB Admin User:
   ```
   USER = "scrapy_admin"
   PASS = "$cr4pyR00t!"

   (In case of using Docker, escape as "$$cr4pyR00t!", 
   because dollar sign will be interpreted as a variable)
   ```
5. Create DB Admin User:
   ```sql
   CREATE
       USER 'scrapy_admin'@'localhost'
       IDENTIFIED BY '$cr4pyR00t!';
   GRANT
       ALL PRIVILEGES
       ON scrapy.*
       TO 'scrapy_admin'@'localhost';
   FLUSH PRIVILEGES;
   ```
6. Copy `.env.example` to `.env`:
   ```shell
   cp .env.example .env
   ```
7. Configure `.env`. Minimal configuration:
   ```dotenv
   DB_HOST=localhost
   DB_USERNAME=scrapy_admin
   DB_PASSWORD=$cr4pyR00t!
   ```
8. Generate App Key:
   ```shell
   php artisan key:generate
   ```
9. Migrate DB:
   ```shell
   php artisan migrate
   ```

   Or for Docker:
   ```shell
   docker-compose exec app php artisan migrate
   ```
10. Run seeds:
   ```shell
   php artisan db:seed
   ```

   Or for Docker:
   ```shell
   docker-compose exec app php artisan db:seed
   ```
11. Generate Oauth keys:
    ```shell
    php artisan passport:install
    ```

   Or for Docker:
   ```shell
   docker-compose exec app php artisan passport:install
   ```

### Check local environment

1. Run development server:
   ```shell
   php artisan serve
   ```
2. Access API public URL (http://127.0.0.1:8000/) on a browser. It should show the Laravel Web UI.
3. Call an API GET endpoint: http://127.0.0.1:8000/api/offer_types
   ```bash
   curl -X GET http://127.0.0.1:8000/api/offer_types
   ```
   It should return `[{"id":1,"name":"Vender","enabled":"1"},{"id":2,"name":"Donar","enabled":"1"}]`.
