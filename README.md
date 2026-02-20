# yusufkaanklc.dev

Interactive terminal-style portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jose) + bcryptjs
- **Font:** JetBrains Mono

## Features

- Terminal emulation with command system (help, about, projects, skills, experience, education, contact, socials, blog, neofetch, etc.)
- Virtual file system (ls, cd, cat, pwd)
- Tab completion and command history
- 8 color themes (Dracula, Tokyo Night, Catppuccin, Synthwave, Nord, Gruvbox, Rose Pine, One Dark)
- Mobile quick command bar
- Admin panel (`sudo` command) with full CRUD for all data
- Dynamic data from MongoDB with static fallback
- Blog like (IP-based, toggle) and share (X, LinkedIn, copy link) on blog posts

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or remote)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio
ADMIN_PASSWORD_HASH=<bcrypt hash>
JWT_SECRET=<random secret>
```

Generate a password hash:

```bash
node -e "require('bcryptjs').hash('your-password', 10).then(h => console.log(h))"
```

### Seed Database

Populate MongoDB with the static data:

```bash
npm run seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the terminal.

### Build

```bash
npm run build
npm start
```

## Admin Panel

1. Type `sudo` in the terminal
2. Enter the admin password
3. Manage all site data (profile, projects, blog, skills, experience, education, contact, socials)

The admin panel is protected by JWT authentication. Routes under `/admin` and `/api/admin` require a valid session.

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── api/
│   │   ├── auth/       # Login, logout, session check
│   │   ├── blog/[slug] # Likes & readers endpoints
│   │   ├── data/       # Public read-only data endpoint
│   │   └── admin/      # Protected CRUD endpoints
│   ├── layout.tsx
│   └── page.tsx
├── commands/           # Terminal commands
├── components/
│   ├── admin/          # Admin UI components
│   ├── output/         # Terminal output components
│   ├── terminal/       # Terminal core components
│   └── ui/             # Shared UI components
├── contexts/           # React contexts (DataContext)
├── core/               # Command parser, registry, file system, tab completion
├── data/               # Static data files (fallback)
├── hooks/              # Custom hooks
├── lib/
│   ├── models/         # Mongoose models
│   ├── auth.ts         # JWT + bcrypt helpers
│   ├── mongodb.ts      # DB connection
│   └── seed.ts         # Database seeder
├── types/              # TypeScript types
└── utils/              # Utilities
```
