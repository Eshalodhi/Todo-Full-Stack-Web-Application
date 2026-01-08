# Todo Full-Stack Web Application

A modern, full-stack task management application built with Next.js and FastAPI.

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql)

## Features

- **User Authentication** - Secure JWT-based authentication with login/register
- **Task Management** - Full CRUD operations for tasks
- **Real-time Updates** - Optimistic UI updates for instant feedback
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop and mobile devices
- **Modern UI** - Beautiful animations with Framer Motion

## Tech Stack

### Frontend
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **ORM:** SQLModel
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT tokens

## Project Structure

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Application entry point
│   │   ├── auth.py         # JWT authentication
│   │   ├── database.py     # Database connection
│   │   ├── models.py       # SQLModel models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── routers/        # API route handlers
│   │       ├── auth.py     # Auth endpoints
│   │       └── tasks.py    # Task CRUD endpoints
│   └── requirements.txt
│
├── frontend/                # Next.js frontend
│   ├── app/                # App Router pages
│   │   ├── (auth)/         # Login/Register pages
│   │   ├── (dashboard)/    # Dashboard page
│   │   └── api/            # API routes
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── features/      # Feature components
│   │   └── providers/     # Context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript types
│
└── specs/                  # Feature specifications
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL database (or Neon account)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_SECRET_KEY=your-secret-key-here
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | Get all tasks for user |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{task_id}` | Get a specific task |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle task completion |

## Screenshots

### Dashboard
- View all your tasks at a glance
- Filter by status (All, Pending, Completed)
- Sort by date, title, or status

### Task Management
- Create tasks with title and optional description
- Edit existing tasks
- Mark tasks as complete/incomplete
- Delete tasks with confirmation

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET_KEY` | Secret key for JWT signing |
| `JWT_ALGORITHM` | Algorithm for JWT (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time |

### Frontend
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Esha Lodhi**

---

Built with ❤️ using Next.js and FastAPI
