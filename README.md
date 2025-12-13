# RoomMap

A modern rental room search platform with interactive maps, helping renters easily find suitable rooms in Vietnam.

## ✨ Features

- 🗺️ **Interactive Map** - Visual room search with Mapbox
- 🔍 **Smart Filters** - Filter by price, area, amenities
- 📱 **Responsive** - Works great on all devices
- 🔐 **Google OAuth** - Quick and secure login
- 📊 **Admin Dashboard** - Manage posts and users
- 📈 **Analytics** - Track with Google Analytics 4
- ⚡ **Rate Limiting** - API protection with Upstash Redis

## 🛠️ Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| **Framework**  | Next.js 15 (App Router, Turbopack) |
| **Language**   | TypeScript 5                       |
| **Styling**    | Tailwind CSS v4, Shadcn UI         |
| **Database**   | Supabase (PostgreSQL + Auth)       |
| **Map**        | Mapbox GL JS                       |
| **Storage**    | Cloudflare R2                      |
| **State**      | Zustand, TanStack Query            |
| **Analytics**  | Google Analytics 4                 |
| **Rate Limit** | Upstash Redis                      |

## 🚀 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd fe-rental-map

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Full Setup Guide

For complete setup (Supabase, Database, OAuth, etc.), see:

👉 **[docs/project-setup-guide.md](./docs/project-setup-guide.md)**

## 📁 Project Structure

```
fe-rental-map/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (user)/          # User-facing pages
│   │   ├── admin/           # Admin dashboard
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── ui/              # Shadcn UI components
│   │   └── user/            # User-specific components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (supabase, s3, analytics)
│   ├── services/            # API service functions
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   ├── constants/           # App constants
│   └── lang/                # i18n translations
├── docs/                    # Documentation
│   ├── project-setup-guide.md
│   ├── database/            # SQL files
│   └── *.md                 # Feature docs
└── public/                  # Static assets
```

## 🧪 Scripts

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start development server |
| `npm run build`         | Build for production     |
| `npm run lint`          | Run ESLint               |
| `npm run format`        | Format with Prettier     |
| `npm test`              | Run Jest tests           |
| `npm run test:coverage` | Tests with coverage      |

## 📚 Documentation

| Document                                             | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| [Project Setup Guide](./docs/project-setup-guide.md) | Full setup instructions         |
| [Cron Jobs](./docs/cron-jobs.md)                     | Auto-expire posts configuration |
| [GA4 Integration](./docs/ga4-integration.md)         | Google Analytics setup          |
| [Rate Limiting](./docs/rate-limiting.md)             | API rate limiting               |
| [Database Schema](./docs/database/schema/)           | SQL schema files                |

## 🔧 Environment Variables

See details at [docs/project-setup-guide.md#8-environment-variables](./docs/project-setup-guide.md#8-environment-variables)

**Required:**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`

## 🚢 Deployment

Deploy on Vercel:

1. Connect repository
2. Add environment variables
3. Deploy

Cron jobs will be automatically registered from `vercel.json`.

---

_Built with ❤️ using Next.js_
