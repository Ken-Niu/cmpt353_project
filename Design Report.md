# Design Report

## Architecture Overview

Monolithic full-stack architecture using Next.js App Router.

1. Client (Browser)
2. Next.js App (Port 3000)
    -  /app        -> UI Pages
    -  /app/api    -> REST API Route Handlers
    -  /lib        -> Shared utilities (auth, prisma)

3. PostgreSQL 16 (Port 5432)

## Database Choice: PostgreSQL

- Relational model fits well (Users -> Channels -> Posts -> Replies -> Votes)
- Foreign key constraints prevent orphaned data
- Composite unique indexes enforce one vote per user per target
- ILIKE operator provides case-insensitive search
- Excellent Prisma ORM integration with automatic migrations

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | No | Logout |
| GET | /api/auth/me | No | Current user |
| GET | /api/channels | No | List channels |
| POST | /api/channels | Yes | Create channel |
| DELETE | /api/channels/[id] | Yes | Delete channel |
| GET | /api/posts | No | List posts |
| POST | /api/posts | Yes | Create post |
| GET | /api/posts/[id] | No | Get post with replies |
| DELETE | /api/posts/[id] | Yes | Delete post |
| POST | /api/replies | Yes | Create reply |
| DELETE | /api/replies/[id] | Admin | Delete reply |
| POST | /api/votes | Yes | Vote |
| POST | /api/upload | Yes | Upload screenshot |
| GET | /api/search | No | Search |
| GET | /api/admin/users | Admin | List users |
| DELETE | /api/admin/users/[id] | Admin | Delete user |

## Screenshot Storage
- Uploaded images are stored on the server filesystem
- File names are sanitized and prefixed with a timestamp/unique ID
- Only PNG, JPEG/JPG, and WebP are accepted
- Maximum file size is 5 MB
- MIME type and file extension are validated before saving
- File metadata/path is stored in the database
- Images are served through an application-controlled route to prevent unsafe direct handling

## Security

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens are stored in httpOnly cookies
- Authentication is checked for all write operations
- Admin role is required for moderation actions
- File uploads are validated by MIME type and file size
- Inputs are validated for required fields and length limits
- Output is rendered safely to reduce XSS risk
- Cookie settings are configured to reduce CSRF risk

## Key Packages

| Package | Purpose |
|---------|---------|
| next | Full-stack React framework |
| prisma / @prisma/client | Type-safe ORM |
| @prisma/adapter-pg | PostgreSQL adapter |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT tokens |
| tailwindcss | CSS styling |