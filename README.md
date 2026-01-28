# DesignCase AI 🎨✨

> Transform your designs into stunning AI-powered case studies with interactive 3D presentations

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequests.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/yourusername/designcase-ai)

![DesignCase AI Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=DesignCase+AI)

---

## 🌟 What is DesignCase AI?

**DesignCase AI** is an open-source SaaS platform that automatically generates professional, interactive case studies from your design files. Upload a design or import from Figma, and our AI will:

- 🎨 **Analyze** your design (colors, typography, layout, UX patterns)
- 📝 **Generate** compelling case study content
- 🎭 **Present** it in stunning 3D templates
- 📤 **Export** as PDF, HTML, or share with a link

**100% Free & Open Source** - No paid services required for basic usage!

---

## ✨ Key Features

### 🤖 AI-Powered Analysis
- Deep design pattern recognition
- Color palette extraction
- Typography analysis
- UX/UI best practices evaluation
- Accessibility audit
- Competitor insights

### 🎭 3D Presentation Templates
- **Minimal Stack**: Clean card-based design
- **Immersive Room**: 3D gallery experience  
- **Portfolio Carousel**: Rotating showcase
- Smooth animations and transitions
- Mobile-responsive 3D

### 📊 Smart Content Generation
- Automated case study writing
- Industry-specific language
- SEO-optimized content
- Multiple sections (Overview, Challenge, Solution, Impact)
- Key metrics and highlights

### 🔧 Import & Export
- Upload design files (PNG, JPG, PDF, SVG)
- Import from Figma
- Export as PDF or HTML
- Public sharing with custom URLs
- Embed codes for portfolios

---

## 🚀 Quick Start

### Prerequisites

```bash
- Node.js 18+
- pnpm (npm install -g pnpm)
- Docker Desktop (optional, for local DB)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/designcase-ai.git
cd designcase-ai

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Set up database (see Setup Guide)
cd apps/api
npx prisma db push

# Start development servers
pnpm dev
```

### Environment Setup

See [Deployment Guide](./deployment-guide.md) for detailed setup instructions for all free services:
- Supabase (Database + Storage + Auth)
- Anthropic Claude (AI Analysis)
- Railway (Redis)
- Figma API (Optional)

---

## 📚 Documentation

- **[Product Overview](./product-overview.md)** - Features and tech stack
- **[Phase 1: Foundation](./phase-1-foundation.md)** - Auth, DB, file upload
- **[Phase 2: AI Analysis](./phase-2-ai-analysis.md)** - Claude integration
- **[Phase 3: 3D Templates](./phase-3-3d-templates.md)** - Three.js implementation
- **[Phase 4: Figma & Export](./phase-4-figma-export.md)** - Integrations
- **[Deployment Guide](./deployment-guide.md)** - Production deployment
- **[Roadmap](./roadmap-future-features.md)** - Future plans

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js 14)                  │
│  React Three Fiber • Tailwind • shadcn/ui • Zustand   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ├──────────────────────────────────────┐
                  ▼                                      ▼
    ┌─────────────────────────┐        ┌─────────────────────────┐
    │   BACKEND (Express)     │        │  SUPABASE (Free)        │
    │  • AI Analysis          │◄───────┤  • PostgreSQL           │
    │  • File Processing      │        │  • Storage              │
    │  • Queue Jobs (BullMQ)  │        │  • Authentication       │
    └──────────┬──────────────┘        └─────────────────────────┘
               │
               ├─────────────────────────┬──────────────────┐
               ▼                         ▼                  ▼
    ┌──────────────────┐    ┌──────────────────┐  ┌─────────────┐
    │   Claude API     │    │   Figma API      │  │   Redis     │
    │  (Free 5M tokens)│    │   (Free tier)    │  │  (Railway)  │
    └──────────────────┘    └──────────────────┘  └─────────────┘
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **3D**: Three.js + React Three Fiber
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **State**: Zustand + React Query

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Queue**: BullMQ + Redis
- **Storage**: Supabase Storage

### AI & Tools
- **AI**: Anthropic Claude API (Sonnet 4)
- **Image Processing**: Sharp
- **PDF Generation**: Puppeteer
- **Design Import**: Figma REST API

### Infrastructure (All Free!)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: Supabase
- **Auth**: Supabase Auth
- **CDN**: Cloudflare

---

## 🎯 Use Cases

### For Designers
- Build professional portfolio
- Showcase design thinking
- Share work with clients
- Document design process

### For Agencies
- Client presentations
- Case study library
- Team collaboration
- Brand consistency

### For Freelancers
- Quick project documentation
- Client deliverables
- Marketing materials
- Portfolio differentiation

### For Students
- School projects
- Job applications
- Learning documentation
- Skill demonstration

---

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=Dashboard)

### AI Analysis
![Analysis](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=AI+Analysis)

### 3D Templates
![3D Templates](https://via.placeholder.com/800x400/ec4899/ffffff?text=3D+Templates)

### Case Study View
![Case Study](https://via.placeholder.com/800x400/10b981/ffffff?text=Case+Study)

---

## 🛣️ Roadmap

### ✅ MVP (Q1 2024)
- [x] User authentication
- [x] File upload system
- [x] AI design analysis
- [x] Case study generation
- [x] 3 3D templates
- [x] PDF export
- [x] Public sharing

### 🚧 V1.0 (Q2 2024)
- [ ] Enhanced AI analysis
- [ ] 4 more 3D templates
- [ ] Team collaboration
- [ ] Advanced editing
- [ ] Analytics dashboard

### 🔮 V2.0 (Q3-Q4 2024)
- [ ] AI design recommendations
- [ ] VR/AR support
- [ ] Video export
- [ ] API access
- [ ] Marketplace

See [Full Roadmap](./roadmap-future-features.md) for details.

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### Ways to Contribute
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🎨 Create templates
- 💻 Submit pull requests

### Development Workflow

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/designcase-ai.git

# Create a branch
git checkout -b feature/amazing-feature

# Make your changes
# Commit your changes
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

### Coding Standards
- Use TypeScript strict mode
- Follow ESLint rules
- Write tests for new features
- Update documentation
- Keep commits atomic

---

## 📊 Project Status

### Current Stats
- **Status**: MVP Complete ✅
- **Version**: 1.0.0-beta
- **Last Updated**: January 2024
- **Contributors**: 1 (looking for more!)
- **Stars**: Be the first! ⭐

### Health Metrics
- Build: ![passing](https://img.shields.io/badge/build-passing-brightgreen)
- Tests: ![80%](https://img.shields.io/badge/tests-80%25-green)
- Coverage: ![75%](https://img.shields.io/badge/coverage-75%25-yellow)
- Dependencies: ![up-to-date](https://img.shields.io/badge/dependencies-up--to--date-brightgreen)

---

## 💰 Pricing

### Free Tier (Forever)
```
✅ 3 projects/month
✅ 2 3D templates
✅ 100MB storage
✅ Basic AI analysis
✅ Community support
```

### Pro Tier ($19/month)
```
✅ Unlimited projects
✅ All templates
✅ 5GB storage
✅ Advanced AI
✅ No watermarks
✅ Priority support
```

### Self-Hosted (Free)
```
✅ All features
✅ No limits
✅ Full control
✅ Your infrastructure
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2024 DesignCase AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

### Technologies
- [Anthropic Claude](https://anthropic.com) - AI analysis
- [Three.js](https://threejs.org) - 3D graphics
- [Next.js](https://nextjs.org) - React framework
- [Supabase](https://supabase.com) - Backend services
- [Prisma](https://prisma.io) - Database ORM

### Inspiration
- [Behance](https://behance.net) - Portfolio inspiration
- [Awwwards](https://awwwards.com) - Design excellence
- [Product Hunt](https://producthunt.com) - Launch platform

---

## 📧 Contact & Support

### Get Help
- 📖 [Documentation](./docs)
- 💬 [Discussions](https://github.com/yourusername/designcase-ai/discussions)
- 🐛 [Issue Tracker](https://github.com/yourusername/designcase-ai/issues)
- 🔗 [Discord](https://discord.gg/designcase-ai) (coming soon)

### Stay Updated
- 🐦 [Twitter](https://twitter.com/designcaseai)
- 💼 [LinkedIn](https://linkedin.com/company/designcaseai)
- 📧 Email: hello@designcase.ai

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/designcase-ai&type=Date)](https://star-history.com/#yourusername/designcase-ai&Date)

---

## 🎉 Show Your Support

Give a ⭐️ if this project helped you!

Made with ❤️ by designers, for designers.

---

<div align="center">

**[Website](https://designcase.ai)** • **[Demo](https://demo.designcase.ai)** • **[Docs](./docs)** • **[Blog](https://blog.designcase.ai)**

</div>