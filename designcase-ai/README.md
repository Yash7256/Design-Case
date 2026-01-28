# DesignCase AI - Complete Setup Guide

## 🎯 Overview

DesignCase AI is a platform that generates AI-powered case studies from design files using a modern monorepo architecture.

**Key Features:**
- 🎨 Upload or import design files (PNG, JPG, SVG, Figma)
- 🤖 AI-powered analysis of design elements
- 📊 Automatic case study generation
- 🎬 3D template showcase
- 🚀 Fast deployment (Vercel + Railway)
- 📦 Free and open-source

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Auth**: Supabase Auth Helpers

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Queue**: Bull + Redis
- **File Storage**: Supabase Storage
- **AI**: Anthropic Claude API

### DevOps & Tools
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## 📦 Project Structure

```
designcase-ai/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express backend
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Shared UI components
│   ├── utils/            # Shared utilities
│   └── config/           # Shared configs
└── tooling/
    ├── .github/
    │   └── workflows/    # GitHub Actions
    └── scripts/          # Setup and utility scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8.15+
- Docker & Docker Compose (optional, for local PostgreSQL/Redis)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/designcase-ai/designcase-ai.git
cd designcase-ai
```

2. **Run setup script:**
```bash
chmod +x tooling/scripts/setup.sh
./tooling/scripts/setup.sh
```

Or manually:

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Start Docker services
docker-compose up -d

# Setup database
pnpm setup
```

### Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://designcase:designcase_dev@localhost:5432/designcase_db"

# Supabase (https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis
REDIS_URL=redis://localhost:6379

# AI (https://console.anthropic.com)
ANTHROPIC_API_KEY=your_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:4000
NODE_ENV=development

# Storage
SUPABASE_STORAGE_BUCKET=design-files
```

### Development

Start development servers:

```bash
pnpm dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Database Management

```bash
# View database in GUI
pnpm db:studio

# Run migrations
pnpm db:push

# Generate Prisma client
pnpm db:generate

# Seed database
pnpm db:seed
```

## 📋 Available Scripts

### Root Level
```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm start        # Start production servers
pnpm lint         # Lint all packages
pnpm test         # Run tests
pnpm clean        # Clean all build files
```

### Database
```bash
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Prisma Studio
pnpm db:generate  # Generate Prisma client
pnpm db:seed      # Seed database
pnpm setup        # Full database setup
```

## 🏗 Architecture

### Database Schema

**Core Models:**
- **User**: Authentication and subscription management
- **Project**: Design files and source tracking
- **DesignFile**: Individual design files
- **Analysis**: AI analysis results
- **CaseStudy**: Generated case studies
- **Template**: 3D case study templates

### API Endpoints

```
/api/
  /health              # Health check
  /projects            # Project CRUD
  /projects/:id        # Project details
  /upload              # File upload
  /analysis            # Analysis results
  /case-studies        # Case study CRUD
```

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Push to GitHub
git push origin main

# Deploy to Vercel (auto-connected)
# Configure environment variables in Vercel dashboard
```

### Backend (Railway)

```bash
# Configure Railway project
# Connect GitHub repository
# Set environment variables
# Deploy on push
```

## 📊 Database Schema Overview

```
User (1) ──→ (Many) Project
Project (1) ──→ (Many) DesignFile
Project (1) ──→ (1) Analysis
Project (1) ──→ (1) CaseStudy
CaseStudy (Many) ──→ (1) Template
User (1) ──→ (Many) FigmaToken
User (1) ──→ (Many) ApiKey
```

## 🔐 Authentication Flow

1. User signs up via Supabase Auth
2. JWT token stored in httpOnly cookie
3. API requests include Bearer token
4. Server validates token with Supabase
5. User context available in requests

## 📁 File Upload Process

1. Client uploads file to Supabase Storage
2. Backend creates Project record
3. File metadata stored in DesignFile
4. Analysis worker queued with Bull/Redis
5. AI processes file asynchronously
6. Results stored in Analysis model
7. Case study generated from analysis

## 🤖 AI Analysis Pipeline

1. **File Ingestion**: Read uploaded design file
2. **Visual Analysis**: Extract colors, typography, layout
3. **Component Detection**: Identify UI components
4. **Design System Analysis**: Detect design system usage
5. **Insights Generation**: Generate strengths and improvements
6. **Case Study Creation**: Auto-generate case study content

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

## 📚 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting
- Path aliases: `@/*` for src imports

### Commits
- Use conventional commits
- `feat:` for features
- `fix:` for bug fixes
- `docs:` for documentation

### Pull Requests
- Create feature branch: `git checkout -b feature/your-feature`
- Keep PRs focused and small
- Add tests for new features
- Update documentation

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart services
docker-compose restart

# Check DATABASE_URL in .env.local
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Turborepo](https://turbo.build/repo/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is open source and available under the MIT License. See [LICENSE](./LICENSE) for details.

## ❓ Questions or Issues?

- Open a [GitHub Issue](https://github.com/designcase-ai/designcase-ai/issues)
- Join our [Discord Community](https://discord.gg/designcase)
- Check [Discussions](https://github.com/designcase-ai/designcase-ai/discussions)

---

**Made with ❤️ by the DesignCase AI community**
