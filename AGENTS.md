# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the React 19 application code; feature folders group components, hooks, context, and API clients. Shared utilities live under `src/lib/`.
- `src/test/` holds Vitest setup files, mocks, and helpers that run before every test.
- `public/` stores static assets served verbatim by Vite. Update favicons or manifest files here.
- `vite.config.ts` centralizes aliases, Tailwind, and Vitest configuration; treat it as the single source of truth for build and test settings.

## Build, Test, and Development Commands
- `npm run dev` starts the local Vite dev server with hot module reloading on `http://localhost:5173`.
- `npm run build` executes the TypeScript project build and produces production assets under `dist/`.
- `npm run lint` runs ESLint with the configured React, hooks, and TypeScript rules.
- `npm run test -- --run --coverage` executes the Vitest suite once, enforces coverage thresholds, and writes reports to `coverage/`.

## Coding Style & Naming Conventions
- Use TypeScript with ES modules and the `@` alias for imports from `src/`.
- Follow ESLint guidance; fix violations with `npm run lint -- --fix` before opening a PR.
- Prefer PascalCase for React components, camelCase for functions/variables, and SCREAMING_SNAKE_CASE for constants that never change.
- Keep JSX lean; extract reusable logic into hooks under `src/hooks/`.

## Testing Guidelines
- Write unit and component tests with Vitest and React Testing Library. Co-locate specs next to the source (`ComponentName.test.tsx`) when practical.
- Maintain minimum coverage: 80% lines/statements, 70% branches, 80% functions (configured in `vite.config.ts`).
- Mock network calls with MSW (`src/test/setup.ts`) to keep tests deterministic.
- Run `npm run test -- --watch` during development for quick feedback.

## Commit & Pull Request Guidelines
- Use imperative commit messages (e.g., `Add time entry filter logic`). Squash noisy local commits before pushing.
- Each PR should describe scope, testing evidence (`npm run test` output, screenshots for UI), and link to related issues or thesis milestones.
- Keep PRs focused; favor smaller, reviewable changes over monolithic updates.

## Agent-Specific Tips
- When automating tasks, announce planned file edits and run `npm run lint` or `npm run test -- --run` after modifications.
- Store CI artifacts (coverage, dist) outside version control; they are produced automatically in workflows.

## Diploma Thesis Context
- Project underpins diploma thesis titled "Automation of the web application testing, building and delivery process".
- CI now runs on GitHub Actions in this repository.
- CD follows GitOps principles via Kubernetes and Argo CD using the `time-tracking-deployment` repository.
- Exploring modern CI/CD pipelines that incorporate AI agents.
- Frontend app code lives in `time-tracking-app-ui`.
- Backend app code lives in `time-tracking-app`.
- K8s helm charts and GitOps manifests are in the `time-tracking-deployment` repository.