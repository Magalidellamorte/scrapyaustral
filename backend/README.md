# Scrapy - API

## Project Setup

### Pre-requisites
* PHP v8.1
* MySQL

### Setup Local environment (Jump to "Docker" below instead if using it)

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
10. Run seeds:
```shell
php artisan db:seed
```

11. Generate Oauth keys:
```shell
php artisan passport:install
```
12. Setup Githooks
```shell
./install-git-hooks.sh
 ```

## Using Docker

Docker automates:
  - Installing PHP dependencies via Composer
  - Creating the Database schema
  - Generating the application key
  - Fixing file permissions for `storage` and `bootstrap/cache`

Manual steps:
1. Clone the repository:
   ```shell
   git clone https://github.com/Scrapyapp/api.git
   cd api/backend
   ```
2. Copy `.env.example` to `.env` and update database settings:
   ```shell
   cp .env.example .env
   ```
3. Configure `.env`. Minimal configuration:
   ```dotenv
   DB_HOST=db
   DB_USERNAME="scrapy_admin"
   DB_PASSWORD="passexample"
   ```
   IMPORTANT: keep the quotes; otherwise the seeding will fail because of permissions
4. Build and start containers:
   ```shell
   docker-compose up --build -d
   ```
5. Migrate, seed the database and install Passport:
   ```shell
   docker-compose exec app php artisan migrate
   docker-compose exec app php artisan db:seed
   docker-compose exec app php artisan passport:install
   ```

6. Setup Githooks
```shell
./install-git-hooks.sh
 ```

### Check local environment

1. Run development server (skip for Docker):
   ```shell
   php artisan serve
   ```
2. Access API public URL (http://127.0.0.1:8000/) on a browser. It should show the Laravel Web UI.
3. Call an API GET endpoint: http://127.0.0.1:8000/api/offer_types
   ```bash
   curl -X GET http://127.0.0.1:8000/api/offer_types
   ```
   It should return `[{"id":1,"name":"Vender","enabled":"1"},{"id":2,"name":"Donar","enabled":"1"}]`.

## API Documentation

The OpenAPI specification is located at `public/openapi.yml`.
See `docs/compatibility.md` for endpoint compatibility status.

### View with Swagger UI

1. Set `SWAGGER_ENABLED=true` in your `.env` or `.env.example`.
2. Start the backend:
   - With Docker: `docker-compose up --build -d`
   - Or locally: `php artisan serve`
3. Visit `http://localhost:8000/api/documentation` in your browser to access the interactive API docs.
4. To disable the UI, set `SWAGGER_ENABLED=false` and reload.

Notes:
- Swagger UI is only available when `SWAGGER_ENABLED=true` and is not included in production deployments.


# Usefull Commands

#### Check what would be formatted (no changes)
```shell
cd backend
npm run format:check
```
#### Fix all formatting issues
```shell
cd backend  
npm run format
```
#### Format and commit in one command
```shell
cd backend
npm run format:commit
```