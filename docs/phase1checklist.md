For this project, I'd organize the repository using a feature-based architecture from the beginning.

```
ascend-os/
│
├── app/
├── components/
├── features/
├── lib/
├── hooks/
├── prisma/
├── public/
├── styles/
├── types/
├── constants/
├── utils/
└── docs/
```

---

# PHASE 1 – FOUNDATION (2 Weeks)

## Objective

At the end of Phase 1, the user should be able to:

- Open the application
- Register/Login
- Continue as Guest
- Create a character
- Reach the dashboard
- Navigate around the application

Nothing else.

No missions.

No stats.

No EXP.

No habits.

No towers.

Just the skeleton.

Think of this as building the operating system before installing applications.

---

# STEP 1 — Initialize the Project

### Frontend

```
Next.js 15

TypeScript

TailwindCSS

shadcn/ui
```

Install

```
Node

Next.js

Tailwind

ESLint

Prettier

Husky

lint-staged
```

Then initialize Git.

```
main

develop
```

Create your GitHub repository immediately.

Never code without version control.

---

## Install UI Library

Use shadcn.

Generate components like

```
Button

Card

Input

Dialog

Avatar

Badge

Dropdown

Sheet

Sidebar

Tabs

Toast

Skeleton
```

These components will be reused everywhere.

---

# STEP 2 — Design System

Before making pages...

Create your own design language.

---

## Colors

Don't use default Tailwind.

Example

```
Background

#0B1020

Surface

#151C33

Primary

Blue

Success

Emerald

Danger

Red

Gold

#F6C453
```

---

## Fonts

Heading

```
Space Grotesk
```

Body

```
Inter
```

Numbers

```
JetBrains Mono
```

---

## Border Radius

Keep consistent.

```
Cards

20px

Buttons

16px

Inputs

14px
```

---

## Shadows

Create only

```
Small

Medium

Large
```

No random shadows.

---

# STEP 3 — Folder Structure

Instead of

```
pages/

components/
```

Use feature architecture.

```
app/

(auth)

(dashboard)

(character)

(settings)

(layout)

components/

ui/

layout/

cards/

shared/

features/

auth/

character/

dashboard/

lib/

api/

auth/

database/

utils/

hooks/

types/

constants/
```

This scales much better.

---

# STEP 4 — Routing

Even if pages are empty.

Create routes.

```
/

landing

/login

/register

/guest

/onboarding

/dashboard

/profile

/settings

/not-found
```

Every route should work.

---

# STEP 5 — Authentication

Don't overcomplicate it.

For the MVP:

### Register

Fields

```
Email

Password

Confirm Password
```

Validation

```
Email

Password

Minimum length

Uppercase

Number

Special Character
```

---

### Login

```
Email

Password
```

---

### Guest

```
Continue as Guest
```

Creates

Temporary account

```
Guest-4839
```

Later

Can convert into permanent account.

---

## Authentication Flow

```
Open App

↓

Landing

↓

Register

↓

Character Creation

↓

Dashboard
```

Existing users

```
Landing

↓

Login

↓

Dashboard
```

Guest

```
Landing

↓

Continue as Guest

↓

Character Creation

↓

Dashboard
```

---

# STEP 6 — Character Creation

Don't add stats yet.

Only identity.

Fields

## Name

```
Maximum

20 characters
```

---

## Avatar

Start simple.

Maybe

12 avatars.

Later

Users unlock more.

---

## Theme

Example

```
Blue

Purple

Green

Red

Gold
```

This changes

Accent colors.

---

## Starting Title

Purely cosmetic.

Examples

```
Wanderer

Dreamer

Scholar

Adventurer

Rookie
```

No gameplay effect.

---

## Confirmation

```
Welcome

Cyrill

Your journey begins now.
```

---

# STEP 7 — Dashboard

Everything is fake.

Seriously.

Don't implement anything.

Create placeholders.

Example

```
Dashboard

----------------

Character Card

Today's Missions

Tower

Stats

Inventory

AI Assistant

Activity

Achievements
```

Every card

Displays

```
Coming Soon
```

The point is to verify your layout.

---

# STEP 8 — Navigation

Your app should already feel polished.

---

## Sidebar

Desktop

```
Dashboard

Character

Missions

Tower

Inventory

Analytics

AI System

Settings
```

---

## Topbar

Contains

```
Logo

Search (placeholder)

Notifications

Theme Switch

Profile
```

---

## Mobile

Bottom Navigation

```
Home

Missions

Tower

Profile

Menu
```

Even if you don't optimize mobile yet, design with responsiveness in mind.

---

# STEP 9 — Layout Components

Create reusable layouts.

Instead of

Every page

Creating navigation again.

Make

```
DashboardLayout

AuthLayout

PublicLayout
```

Everything else uses them.

---

# STEP 10 — Theme System

Support

```
Dark

Light

System
```

Even if

Dark

is the default.

Store

Theme

in local storage.

---

# STEP 11 — Database

Don't create

50 tables.

Only

## User

```
id

email

password

createdAt

updatedAt
```

---

## Character

```
id

userId

name

avatar

theme

title

createdAt
```

That's enough.

Everything else comes later.

---

# STEP 12 — State Management

Don't wait.

Install

```
Zustand
```

or

```
Redux Toolkit
```

I'd recommend **Zustand** for this project because it's lightweight and works well with Next.js.

Create stores

```
Auth

Character

Theme

Navigation
```

Nothing else.

---

# STEP 13 — Error Pages

Build

```
404

Unauthorized

Loading

Empty State
```

These make the app feel complete.

---

# STEP 14 — Loading Experience

Instead of

White screen.

Create

Skeletons.

Every page

Should have

Loading placeholders.

---

# STEP 15 — Documentation

This is what most students skip.

Inside `/docs`, create:

```
docs/

architecture.md

folder-structure.md

database.md

roadmap.md

api.md

ui-guidelines.md
```

Write as you build. Recruiters love seeing a project with proper documentation because it demonstrates software engineering practices, not just coding ability.

---

# Git Workflow

Create milestones like this:

```
v0.1.0

✓ Next.js Setup

✓ Tailwind

✓ shadcn

✓ Routing

✓ Theme

✓ Layout
```

```
v0.2.0

✓ Authentication

✓ Guest Mode

✓ Character Creation
```

```
v0.3.0

✓ Dashboard

✓ Navigation

✓ Responsive Layout
```

Each milestone should leave the app in a working state.

---

# Definition of Done (End of Phase 1)

Don't move to Phase 2 until you can check every item below.

| Feature                                 | Status |
| --------------------------------------- | ------ |
| Next.js project configured              | ✅     |
| TypeScript configured                   | ✅     |
| Tailwind + shadcn installed             | ✅     |
| GitHub repository initialized           | ✅     |
| ESLint & Prettier configured            | ✅     |
| Feature-based folder structure          | ✅     |
| Routing completed                       | ✅     |
| Landing page created                    | ✅     |
| Login page working                      | ✅     |
| Register page working                   | ✅     |
| Guest mode working                      | ✅     |
| Character creation flow working         | ✅     |
| Dashboard layout completed              | ✅     |
| Sidebar, topbar, and mobile navigation  | ✅     |
| Theme switching (Light/Dark/System)     | ✅     |
| SQLite + Prisma connected               | ✅     |
| Basic User and Character models created | ✅     |
| Zustand stores configured               | ✅     |
| Placeholder pages for future modules    | ✅     |
| Deployment to Vercel successful         | ✅     |

## One recommendation that will save you a lot of work later

Instead of creating a generic dashboard with placeholders, **design it as the final dashboard from day one**. The cards can contain mock data, but the layout should already resemble your finished vision:

- Character Overview (Level, Rank, Power)
- AI System panel (currently "Initializing...")
- Today's Missions ("No missions available yet")
- Tower Access ("Locked")
- Inventory preview ("Empty")
- Recent Activity ("No activity")
- Analytics preview ("Coming in Phase 4")

By locking the layout early, every future phase becomes a matter of replacing placeholders with real functionality instead of constantly redesigning the interface. That's much closer to how professional product teams build software.
