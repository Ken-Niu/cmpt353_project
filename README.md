# Channel-Based Programming Q&A Tool

A full-stack web application for programming questions and threaded discussions.

## Tech Stack
- Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- PostgreSQL 16 with Prisma ORM
- JWT Authentication with httpOnly cookies, bcrypt password hashing
- Docker + Docker Compose

## Quick Start (Docker)

### Prerequisites
- Docker and Docker Compose installed

### Run Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd cmpt353_project

# 2. Start the application
docker compose up --build

# 3. Open the application
# Visit http://localhost:3000
```

### Ports
- App: http://localhost:3000
- PostgreSQL: localhost:5432

### Admin Credentials
- Email: admin@example.com
- Password: admin123

### Test User Credentials
- Email: user@example.com
- Password: user123

## Environment Variables

See `.env.example` for all required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret key for JWT token signing
- `NEXTAUTH_URL` - Application URL

## Features
- Browse and create channels
- Post questions and messages in channels
- Reply to posts and replies (threaded)
- Attach screenshots to posts/replies
- Vote (thumbs up/down) on posts and replies
- Search across content and users
- Admin panel for moderation