# System Architecture

## Overview
Ascend OS is built on a scalable, feature-based SaaS architecture separating concern boundaries between client UI, state management, backend APIs, and persistence.

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router (Client)               │
│  ┌──────────────┐   ┌──────────────────┐   ┌─────────────┐  │
│  │ Auth Feature │   │ Character Feature│   │ Dashboard   │  │
│  └──────┬───────┘   └────────┬─────────┘   └──────┬──────┘  │
│         │                    │                    │         │
│  ┌──────┴────────────────────┴────────────────────┴──────┐  │
│  │                    Zustand Stores                      │  │
│  │      (useAuthStore, useCharacterStore, etc.)           │  │
│  └───────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ HTTP / JSON API
┌──────────────────────────────▼──────────────────────────────┐
│                    FastAPI Server (Python)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Endpoints & Routers                     │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              │ Prisma ORM                   │
│  ┌───────────────────────────▼───────────────────────────┐  │
│  │                  SQLite Database (dev.db)             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Architectural Principles
1. **Feature Co-location**: Code specific to a domain feature (components, hooks, utils) resides within `/features/<feature-name>`.
2. **Global State Boundaries**: Zustand handles persistent client-side state slices independently (Auth, Character, Theme, Navigation).
3. **Decoupled Backend**: FastAPI provides stateless RESTful JSON endpoints over Python Prisma ORM.
