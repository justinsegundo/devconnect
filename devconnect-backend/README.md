# DevConnect Backend

Laravel REST API for the DevConnect community platform.

See the [main README](../README.md) for full project overview and features.

## Quick Setup
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=DemoDataSeeder
php artisan serve
```

API runs at: `http://localhost:8000`

## Database

Update `.env` with your MySQL credentials:
```env
DB_DATABASE=devconnect
DB_USERNAME=root
DB_PASSWORD=your_password
```

## Demo Accounts

- **Admin:** admin@devconnect.com / password
- **Moderator:** mod@devconnect.com / password
- **User:** john@example.com / password

## Tech Stack

- Laravel 11
- MySQL
- Laravel Sanctum (authentication)
- RESTful API

## API Endpoints

See `routes/api.php` for full list of endpoints.

Main routes:
- `POST /api/register` - Create account
- `POST /api/login` - User login
- `GET /api/discussions` - List discussions
- `POST /api/discussions` - Create discussion
- `POST /api/vote` - Vote on content
- `GET /api/leaderboard` - Top users

## Project Structure
```
app/
├── Http/Controllers/Api/  # API controllers
├── Models/                # Eloquent models
database/
├── migrations/            # Database schema
└── seeders/              # Demo data
routes/
└── api.php               # API routes
```