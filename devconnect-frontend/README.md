# DevConnect Frontend

React frontend for the DevConnect community platform.

See the [main README](../README.md) for full project overview and features.

## Quick Setup
```bash
npm install
npm run dev
```

App runs at: `http://localhost:5173`

## Environment Setup

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

## Build for Production
```bash
npm run build
```

Output in `dist/` folder.

## Tech Stack

- React 18
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- React Router
- Axios

## Project Structure
```
src/
├── api/              # API client (axios)
├── store/            # Zustand stores
├── components/
│   ├── auth/         # Login, Register
│   ├── common/       # Navbar, ProtectedRoute
│   └── discussion/   # Discussion components
└── pages/            # Route pages
```

## Key Features

- Protected routes for authenticated users
- Optimistic UI updates for voting
- Role-based component rendering
- Responsive mobile-friendly design