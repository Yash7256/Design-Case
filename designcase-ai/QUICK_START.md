# Quick Reference Guide

## Daily Development Commands

```bash
# Start everything
pnpm dev

# Stop development
Ctrl+C

# View logs
pnpm dev --verbose
```

## Common Database Operations

```bash
# View database GUI
pnpm db:studio

# Make schema changes
# 1. Edit apps/api/prisma/schema.prisma
# 2. Run: pnpm db:push
# 3. Check migration: pnpm db:generate

# Reset database
docker-compose down -v
docker-compose up -d
pnpm db:push
pnpm db:seed
```

## Frontend Development

```bash
# Navigate to frontend
cd apps/web

# Install new package
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Watch styles
pnpm dev
```

## Backend Development

```bash
# Navigate to backend
cd apps/api

# Install new package
pnpm add package-name

# Test API endpoints
curl http://localhost:4000/health

# View Prisma Studio
pnpm db:studio
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit with convention
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/feature-name

# Common prefixes
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Code style
refactor: Code refactoring
test:     Tests
chore:    Build/config
```

## File Structure Quick Reference

```
src/
├── app/              # Next.js pages and routes
├── components/       # React components
│   ├── ui/          # Base UI components
│   ├── layout/      # Layout components
│   └── features/    # Feature components
├── lib/             # Utilities and helpers
│   ├── supabase.ts  # Supabase client
│   └── utils.ts     # Helper functions
└── styles/          # Global styles

backend/
├── src/
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   ├── middleware/  # Express middleware
│   ├── types/       # TypeScript types
│   └── utils/       # Helper functions
├── prisma/
│   ├── schema.prisma
│   └── migrations/
```

## Environment Setup

```bash
# Copy example env
cp .env.example .env.local

# Required keys
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
DATABASE_URL=
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart a service
docker-compose restart postgres

# Remove data (fresh start)
docker-compose down -v
```

## Debugging Tips

### Frontend Issues
- Check browser console (F12)
- Clear next cache: `rm -rf .next`
- Check environment variables in `.env.local`

### Backend Issues
- Check API logs in terminal
- Test endpoint with curl or Postman
- Check database connection in `.env.local`

### Database Issues
- Open Prisma Studio: `pnpm db:studio`
- Check logs: `docker-compose logs postgres`
- Restart DB: `docker-compose restart postgres`

## Performance Tips

- Use React DevTools for component profiling
- Use Next.js Analytics
- Monitor database queries in Prisma Studio
- Check bundle size with `next/bundle-analyzer`

## Useful URLs

- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Health: http://localhost:4000/health
- Database GUI: http://localhost:5555 (Prisma Studio)
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Getting Help

- Read the main [README.md](./README.md)
- Check [ROADMAP.md](./ROADMAP.md)
- See [CONTRIBUTING.md](./CONTRIBUTING.md)
- Open an issue on GitHub
- Join Discord community
