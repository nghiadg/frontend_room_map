# FE RoomMap

A modern room map application built with Next.js and React, featuring an interactive interface for browsing and managing rental properties.

## Technical Stack

### Core Framework

- **[Next.js 15.5.4](https://nextjs.org)** - React framework with App Router
- **[React 19.1.0](https://react.dev)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Turbopack](https://nextjs.org/docs/architecture/turbopack)** - Fast bundler for development and production

### Styling

- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework
- **[class-variance-authority](https://cva.style/docs)** - CVA for component variants
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes without conflicts
- **[clsx](https://github.com/lukeed/clsx)** - Utility for constructing className strings
- **[tw-animate-css](https://www.npmjs.com/package/tw-animate-css)** - Animation utilities for Tailwind

### UI Components

- **[Shadcn UI](https://ui.shadcn.com)** - Beautifully designed components (New York style)
- **[Radix UI](https://www.radix-ui.com)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev)** - Beautiful & consistent icon toolkit

### State Management

- **[Zustand](https://zustand-demo.pmnd.rs)** - Lightweight state management solution

### Utilities

- **[Lodash](https://lodash.com)** - Modern JavaScript utility library

### Testing

- **[Jest](https://jestjs.io)** - JavaScript testing framework
- **[React Testing Library](https://testing-library.com/react)** - React component testing utilities
- **[Jest DOM](https://github.com/testing-library/jest-dom)** - Custom Jest matchers for DOM
- **[User Event](https://testing-library.com/docs/user-event/intro)** - Simulate user interactions

### Code Quality

- **[ESLint](https://eslint.org)** - JavaScript linting
- **[eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint)** - Next.js specific ESLint rules
- **[Prettier](https://prettier.io)** - Opinionated code formatter
- **[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)** - Turns off ESLint rules that conflict with Prettier

## Project Structure

```
fe-roommap/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   └── ui/              # Shadcn UI components
│   │       └── button.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useBoolean.ts
│   ├── lib/                 # Utility functions
│   │   └── utils.ts
│   ├── store/               # Zustand state stores
│   └── styles/              # Global styles
│       └── globals.css
├── public/                  # Static assets
├── components.json          # Shadcn UI configuration
├── jest.config.ts           # Jest configuration
├── jest.setup.ts            # Jest setup file
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode

## Features

- ✅ **Type-Safe Development** - Full TypeScript support
- ✅ **Modern UI** - Built with Shadcn UI components
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **State Management** - Zustand for efficient state handling
- ✅ **Testing** - Comprehensive test setup with Jest and React Testing Library
- ✅ **Code Quality** - ESLint + Prettier for consistent code style and formatting
- ✅ **Fast Refresh** - Instant feedback with Turbopack

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/components` - UI components
- `@/lib` - Utility functions
- `@/hooks` - Custom React hooks
- `@/store` - State management stores

Example:

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBoolean } from "@/hooks/useBoolean";
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Shadcn UI Documentation](https://ui.shadcn.com) - explore available components
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility-first CSS framework
- [Zustand Documentation](https://zustand-demo.pmnd.rs) - state management guide

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
