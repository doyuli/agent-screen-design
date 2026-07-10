# Nuxt Starter

A minimal Nuxt 4 starter with TypeScript, Tailwind CSS v4, shadcn-vue, VueUse, ESLint, and Vitest.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

The app runs at `http://localhost:3000`.

## Scripts

```bash
pnpm dev          # start the dev server
pnpm build        # build for production
pnpm generate     # generate a static site
pnpm preview      # preview the production build
pnpm typecheck    # run TypeScript checks
pnpm lint         # run ESLint
pnpm lint:fix     # fix lint issues
pnpm test         # run tests
pnpm test:watch   # run tests in watch mode
```

## Notes

- UI components live in `app/components/ui`.
- Global styles and theme tokens live in `app/assets/css/tailwind.css`.
- Tests are picked up from `app/**/*.test.ts`.
- Git hooks run lint-staged and commit message checks.
