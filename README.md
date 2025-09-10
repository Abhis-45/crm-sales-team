# CRM Sales Teams (Full Project)

This repo contains a full-stack CRM project:
- Backend: Express + MongoDB + JWT auth (in /backend)
- Frontend: Next.js (in /frontend)

## Quick start

### Backend
cd backend
cp .env.example .env
# edit .env (MONGO_URI, JWT_SECRET)
npm install
npm run seed    # optional - creates demo users
npm run dev

### Frontend
cd frontend
cp .env.local.example .env.local
# edit .env.local if needed (NEXT_PUBLIC_API_URL)
npm install
npm run dev

Demo credentials (seeded):
- rep@example.com / password123 (role: rep)
- manager@example.com / password123 (role: manager)