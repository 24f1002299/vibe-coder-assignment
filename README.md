# Wobb Frontend Assignment

A starter influencer search application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project is intentionally left in a rough-but-working state for candidates to improve.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## What's Included

- **Search / Dashboard** — filter influencers by platform (Instagram, YouTube, TikTok) and search by username or full name
- **Profile Details** — click a profile to view extended data loaded from individual JSON files
- **Routing** — `react-router-dom` with `/` (search) and `/profile/:username` (details)

Sample data lives in:

- `src/assets/data/search/` — platform search results (10 profiles each)
- `src/assets/data/profiles/` — detailed profile JSON per username

## How to Submit

1. **Download or clone** this starter project to your machine.
2. **Create a new repository** on your own GitHub account. Do not fork the original assignment repo — push your work to a repo you own.
3. Complete the tasks below and push your changes to that repository.
4. **Share the public GitHub repository URL** with us as your submission.

### Deadline (strict)

- **Due:** **2 July 2026, 2:00 PM IST** (Indian Standard Time, UTC+5:30)
- **Any git commits made after this deadline will disqualify your submission.** We will only consider the repository state as of the deadline; late commits will not be reviewed.
- Make sure your final work is pushed **before** the cutoff.

## AI Usage

You may use any AI tools (Cursor, ChatGPT, Claude, GitHub Copilot, etc.). We are evaluating your final solution and engineering decisions.

## Your Tasks

Complete the following as part of your submission:

1. **Find and fix all bugs and quality issues** — the codebase contains intentional bugs and quality issues. Identify and resolve them.

2. **Completely redesign the UI/UX** — replace the basic layout with a polished, modern interface. Focus on usability, visual hierarchy, and delight.

3. **Replace React Context with Zustand** — when you implement state management for the selected list, use [Zustand](https://github.com/pmndrs/zustand) instead of React Context.

4. **Implement "Select profile & Add to List"** — the disabled "Add to List" button is a stub. Build the full feature:
   - Select / add profiles to a persistent list
   - View and manage the selected list
   - Handle duplicates appropriately

5. **Improve code quality and project structure** — refactor as needed, add proper types, and follow React best practices.

6. **Optimize performance** — apply sensible optimizations where appropriate.

7. **Use any libraries you need** — you are not limited to the current stack. Choose tools that help you deliver a great result (UI kits, state managers, testing libraries, etc.).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run lint` | Run ESLint               |

## Submission Notes

- Document any assumptions or trade-offs in your README
- Ensure `npm run build` passes before submitting
- Focus on demonstrating your judgment — not every possible feature needs to be built, but the core assignment items should be addressed thoughtfully
- Double-check that your repo is public (or that we have access) and that the link is included in your submission
- Please make meaningful commits throughout your work. We may review your commit history.
- **Bonus:** Deploying the app (e.g. Vercel, Netlify, GitHub Pages) is optional but will be considered a plus — include the live URL in your submission if you do

Good luck!

## Bugs & Decisions Log

### Bugs Found & Fixed

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `package.json` | `react-beautiful-dnd` listed as a dependency but conflicts with React 19 peer requirements; also never imported anywhere in the codebase. | Removed the dependency entirely. |
| 2 | `tsconfig.app.json` | `strict` mode was disabled, allowing unsafe types to slip through silently. | Enabled `"strict": true` and confirmed `npm run build` still passes. |
| 3 | `src/pages/ProfileDetailPage.tsx` | Engagement rate was multiplied by `10000` instead of `100`, producing values like `350%` instead of `3.50%`. Also duplicated inline logic instead of using the existing `formatEngagementRate` helper. | Replaced inline math with `formatEngagementRate(user.engagement_rate)` for consistency. |
| 4 | `src/index.css` | Retained default Vite template element styles (`#root { width: 1126px; text-align: center; }`, `h1`, `h2`, `code`) that conflict with Tailwind utility classes and the planned redesign. | Stripped element-level styles; kept only Tailwind import, CSS variables, and dark-mode overrides. |
| 5 | `src/components/SearchBar.tsx` | Component was defined and exported but never imported or used. `PlatformFilter` has its own inline search input instead. | Left as-is for now; noted for future cleanup if an `Add to List` feature is built. |

### Decisions Made

- **State management**: Planning to use Zustand for the "selected list" feature to avoid prop-drilling and replace React Context.
- **Type safety**: Enabled full `strict` mode early so type issues are caught before new feature code is added.
- **CSS strategy**: Tailwind utilities first, CSS variables for theming (light/dark), no global element selectors.
- **Bug prioritization**: Fixed install-blocking dependency first, then silent logic bug (engagement rate), then styling conflicts.
- **Commit discipline**: Meaningful commits grouped by concern (dependency fix → type safety → styles → logic bug) rather than one giant commit.

