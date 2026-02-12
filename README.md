# Gusto-2026 OS - Next.js

An interactive macOS-style Gusto-2026 experience built with Next.js 15.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons / Phosphor Icons
- Supabase (optional for data persistence)

## Project Structure

- `/app` - Next.js app directory with routes and layouts
- `/src/components` - React components (desktop, apps, UI, effects)
- `/src/contexts` - React context providers
- `/src/data` - Static data (filesystem, themes, etc.)
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions

## Features

- macOS-style desktop environment
- Draggable and resizable windows
- Customizable themes and wallpapers
- File system explorer
- Terminal emulator
- Games (Snake, Minesweeper)
- Email client
- PDF viewer
- System preferences
- Achievements system
- Mobile-responsive design
