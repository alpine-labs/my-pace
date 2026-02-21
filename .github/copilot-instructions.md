# Copilot Instructions — my-pace

React Native + Expo (v54) health & wellness tracker for older adults. TypeScript, Zustand, Expo SQLite, Expo Router.

## Commands

```bash
expo start            # Start dev server (choose platform interactively)
expo start --android  # Android emulator
expo start --ios      # iOS simulator
expo start --web      # Web browser
```

No lint or test scripts are configured yet.

## Architecture

Navigation is tab-based via Expo Router (`app/` directory). State and persistence are handled together in Zustand stores — each store in `stores/` owns both its in-memory state and the corresponding SQLite read/write operations via `lib/database.ts`. Stores re-fetch from the DB after every mutation to stay in sync.

Core business logic (USDA food API calls, walking program generation, scheduled notifications) lives in `lib/` and is called from stores, not components.

## Key conventions

- **Store-as-data-layer**: Always go through a Zustand store to read or write data. Do not call `lib/database.ts` directly from components.
- **Date format**: Dates stored and compared as `YYYY-MM-DD` strings — derive with `new Date().toISOString().split('T')[0]`.
- **Component folders are domain-scoped**: `components/exercise/`, `components/food/`, `components/walking/`, `components/charts/`, `components/ui/`. Add new components in the appropriate domain folder.
- React Native New Architecture is enabled in `app.json` — avoid libraries that are incompatible with the new arch.
- Shared TypeScript types live in `types/index.ts`; don't define domain types inline in components or stores.
