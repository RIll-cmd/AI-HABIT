# Repository Folder Structure

```
/ (Root Workspace)
├── client/                      # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── (auth)/          # Auth Route Group (/login, /register, /guest)
│   │   │   ├── (dashboard)/     # Main App Route Group (/dashboard, /profile, /settings)
│   │   │   ├── layout.tsx       # Root Layout
│   │   │   ├── not-found.tsx    # Custom 404
│   │   │   └── page.tsx         # Root Redirect Page
│   │   ├── components/          # Shared Design Components & Layouts
│   │   ├── features/            # Feature-Based Modules
│   │   │   ├── auth/            # Auth Domain
│   │   │   ├── character/       # Character Domain
│   │   │   └── dashboard/       # Dashboard Domain
│   │   ├── hooks/               # Shared React Hooks
│   │   ├── types/               # Global TypeScript Interfaces
│   │   ├── constants/           # Global Constants
│   │   ├── lib/                 # Utilities & API Fetchers
│   │   └── store/               # Zustand Store Slices
├── server/                      # FastAPI Backend
│   ├── main.py                  # Server Entry Point & Routes
│   ├── seed.py                  # Database Seeding Script
│   ├── prisma/                  # Prisma Schema & Migrations
│   │   └── schema.prisma
│   └── venv/                    # Virtual Environment
└── docs/                        # Architecture & System Documentation
    ├── architecture.md
    ├── folder-structure.md
    ├── database.md
    ├── roadmap.md
    ├── api.md
    └── ui-guidelines.md
```
