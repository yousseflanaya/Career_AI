# Career AI

Career AI is a full-stack career guidance platform with a Laravel API backend and a React/Vite frontend. It includes authentication, profile management, CV tools, interview preparation, roadmaps, analytics, portfolios, notifications, gamification, and Gemini-powered AI features.

## Tech Stack

- Backend: Laravel 12, PHP 8.2+, Laravel Sanctum
- Frontend: React 18, Vite, Tailwind CSS
- Database: SQLite by default
- AI: Google Gemini API

## Requirements

Install these before starting:

- Git
- PHP 8.2 or newer
- Composer
- Node.js 18 or newer
- npm

For Windows, XAMPP is fine as long as PHP is available from the terminal.

## Download the Project

```bash
git clone https://github.com/yousseflanaya/Career_AI.git
cd Career_AI
```

## Backend Setup

Open a terminal in the project folder and run:

```powershell
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

If you are using macOS or Linux, use this instead of `copy`:

```bash
cp .env.example .env
```

Create the SQLite database file:

```powershell
type nul > database/database.sqlite
```

On macOS or Linux:

```bash
touch database/database.sqlite
```

Run the database migrations:

```bash
php artisan migrate
```

Optional: add a Gemini API key in `backend/.env` to enable AI features:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the backend server:

```bash
php artisan serve
```

The backend will run at:

```text
http://127.0.0.1:8000
```

## Frontend Setup

Open a second terminal in the project folder and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## How to Use

1. Start the backend with `php artisan serve`.
2. Start the frontend with `npm run dev`.
3. Open `http://localhost:5173` in your browser.
4. Register a new account.
5. Log in and use the dashboard features.

## Common Problems

If the frontend cannot connect to the backend, make sure Laravel is running at:

```text
http://127.0.0.1:8000
```

If AI features return an error, add `GEMINI_API_KEY` to `backend/.env`.

If migrations fail, make sure `backend/database/database.sqlite` exists, then run:

```bash
php artisan migrate:fresh
```

## Build for Production

Frontend:

```bash
cd frontend
npm run build
```

Backend optimization:

```bash
cd backend
php artisan config:cache
php artisan route:cache
```

## Repository

```text
https://github.com/yousseflanaya/Career_AI
```
