# To-Do Application - Next.js UI + Laravel API

A full-stack to-do application with Next.js frontend and Laravel API backend.

## Project Structure

```
├── api/          # Laravel 12 REST API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
└── ui/           # Next.js 15 Frontend
    ├── app/
    ├── public/
    └── ...
```

## Technology Stack

### Backend (Laravel API)

- Laravel 12.x
- PostgreSQL
- Laravel Sanctum (Token-based authentication)
- RESTful API architecture

### Frontend (Next.js)

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Axios for HTTP requests
- React 19

## Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Token-based API authentication
- ✅ CRUD operations for tasks
- ✅ Task status management (Ongoing, Due, Complete)
- ✅ Responsive design
- ✅ Real-time error handling
- ✅ Loading states

## Setup Instructions

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- pnpm
- PostgreSQL

### Backend Setup (Laravel API)

1. Navigate to the API directory:

```bash
cd api
```

2. Install dependencies:

```bash
composer install
```

3. Set up environment:

```bash
cp .env.example .env
php artisan key:generate
```

4. Configure database in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=todo
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

5. Run migrations and seeders:

```bash
php artisan migrate:fresh --seed
```

6. Start the Laravel server:

```bash
php artisan serve
```

API will be available at: `http://localhost:8000`

### Frontend Setup (Next.js)

1. Navigate to the UI directory:

```bash
cd ui
```

2. Install dependencies:

```bash
pnpm install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
pnpm dev
```

Frontend will be available at: `http://localhost:3000`

## Demo Account

After seeding the database, you can use:

- **Email:** demo@example.com
- **Password:** password

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/user` - Get current user (requires auth)

### Tasks

- `GET /api/tasks` - Get all user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

Full API documentation available in: `api/API_DOCUMENTATION.md`

## Testing the Application

1. Make sure both servers are running:
   - Laravel API: `http://localhost:8000`
   - Next.js UI: `http://localhost:3000`

2. Open your browser and navigate to `http://localhost:3000`

3. Register a new account or use the demo account

4. Test the features:
   - ✅ Register a new user
   - ✅ Login with credentials
   - ✅ Create new tasks
   - ✅ Update task status (Ongoing → Due → Complete)
   - ✅ Delete tasks
   - ✅ Logout

## Development

### Backend Development

```bash
cd api
php artisan serve
```

### Frontend Development

```bash
cd ui
pnpm dev
```

### Database Reset

```bash
cd api
php artisan migrate:fresh --seed
```

## Project Architecture

### Authentication Flow

1. User registers/logs in through Next.js frontend
2. Frontend sends credentials to Laravel API
3. Laravel validates and returns JWT token
4. Token stored in localStorage
5. All subsequent API requests include token in Authorization header

### Data Flow

1. User interacts with Next.js UI
2. UI makes HTTP requests to Laravel API via Axios
3. API validates token, processes request
4. API returns JSON response
5. UI updates state and displays results

## Troubleshooting

### CORS Issues

Make sure Laravel API has CORS configured for `http://localhost:3000`

### Database Connection

Verify PostgreSQL is running and credentials are correct in `.env`

### Port Conflicts

- Laravel default: 8000
- Next.js default: 3000

Change ports if needed:

- Laravel: `php artisan serve --port=8001`
- Next.js: `pnpm dev -- -p 3001`

## License

MIT
