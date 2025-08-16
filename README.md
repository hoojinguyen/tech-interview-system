# Tech Interview Platform

A comprehensive tech interview preparation platform with role-specific learning roadmaps, curated questions, and interactive mock interviews.

## Project Structure

```
tech-interview-platform/
├── apps/
│   ├── client/          # Next.js client application (port 3000)
│   └── admin/           # Next.js admin application (port 3001)
├── backend/             # Bun.js + Hono API server (port 3002)
├── packages/
│   └── shared-types/    # Shared TypeScript types
└── ...
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Bun.js, Hono, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis
- **Deployment**: Vercel (frontend), Docker (backend)

## Getting Started

### Prerequisites

- Node.js 18+
- Bun 1.0+
- PostgreSQL
- Redis

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

### Development

Start all services:

```bash
npm run dev
```

Or start individual services:

```bash
npm run dev:client   # Client app on http://localhost:3000
npm run dev:admin    # Admin app on http://localhost:3001
npm run dev:backend  # API server on http://localhost:3002
```

### Building

Build all applications:

```bash
npm run build
```

### Linting and Formatting

```bash
npm run lint     # Lint all projects
npm run format   # Format code with Prettier
```

## Applications

### Client App (Port 3000)

- Public-facing application for job seekers
- Role-specific learning roadmaps
- Question bank with search and filtering
- Interactive mock interviews

### Admin App (Port 3001)

- Content management interface
- Question and roadmap administration
- User activity monitoring
- Analytics dashboard

### Backend API (Port 3002)

- RESTful API with Hono framework
- PostgreSQL database with Drizzle ORM
- Redis caching layer
- External service integrations (ChatGPT, CodeInterview)

## Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier for code consistency
- Implement responsive design with Tailwind CSS
- Use Shadcn/ui components for consistent UI
- Follow atomic design principles for components

## License

MIT License
