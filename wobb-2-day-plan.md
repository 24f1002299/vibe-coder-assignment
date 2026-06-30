# Wobb Take-Home: 2-Day Execution Plan

Real deadline: **Thursday, July 2, 2026 — 2:00 PM IST.** Today is Tuesday, June 30. That's two full focused days (today + tomorrow) plus a short final morning for QA and submission — not a week. This plan is built around that, at 8–10+ hrs/day, starting from a completely fresh clone.

Everything below is grounded in the actual starter repo (cloned and inspected directly), not generic assumptions. File names, bugs, and line references are real.

## Snapshot

| When | Focus | Hours |
|---|---|---|
| Day 1 — Tue, Jun 30 | Setup, real bugs, Zustand + Add to List feature, redesign foundations | ~9 |
| Day 2 — Wed, Jul 1 | Finish redesign, performance, refactor, polish, tests, deploy, README | ~9 |
| Final stretch — Thu, Jul 2, before 2:00 PM | QA only, no new features, submit with buffer | ~3–4 |

---

## Day 1 (Tuesday, June 30)

### Block 1 — Correct project setup (45 min)
The submission rules say don't fork. Set it up right from minute one:

```bash
git clone https://github.com/Wobb-ai/vibe-coder-assignment.git wobb-submission
cd wobb-submission
rm -rf .git
git init && git branch -M main
git add .
git commit -m "chore: import starter project"
```
Now create an empty repo on your own GitHub account (no README/license, so it's truly empty), then:
```bash
git remote add origin https://github.com/<you>/<repo-name>.git
git push -u origin main
```

Immediately fix the first real bug — `npm install` fails out of the box. `react-beautiful-dnd` is in `package.json` but conflicts with React 19's peer requirements, and it's never imported anywhere in the codebase:
```bash
npm pkg delete dependencies.react-beautiful-dnd
npm install
git add package.json package-lock.json
git commit -m "fix: remove unused react-beautiful-dnd causing install failure"
git push
```
Confirm `npm run dev`, `npm run build`, and `npm run lint` all run clean (they do, once that dependency is gone — there are no compile errors hiding in here, which is good news; everything else is logic/architecture/design).

### Block 2 — Orient and lock decisions (45 min)
Read through `App.tsx`, both pages, all five components, the three `utils/` files, and `types/index.ts` (it's a small codebase, this is fast). Turn on real type safety now, before you write new code on top of weak settings — `tsconfig.app.json` currently has no `"strict": true`:
```json
"strict": true,
```
Run `npm run build` again to catch anything that surfaces. Also open `src/index.css` — it's still the default Vite template (`#root { width: 1126px; text-align: center; }`, unused `h1`/`h2`/`code` styles) and will fight your redesign. Strip it down to just the Tailwind import and your own CSS variables.

Start your README now (see the template near the bottom) — jot bugs and decisions as you make them instead of reconstructing everything from memory on Day 2 evening.

### Block 3 — Fix the real bugs (2 hrs)
These are verified, not guesses:

- `src/utils/dataHelpers.ts` — `filterProfiles`: username matching isn't lowercased while fullname matching is, so searching "JOHN" won't find "john_doe" even though it should. Lowercase both sides of the comparison.
- `src/pages/ProfileDetailPage.tsx` — the "Engagement Rate" stat multiplies by `10000` instead of `100`. For the sample profile `khaby.lame`, `engagement_rate: 0.00229` should render as `0.23%`; right now it renders `22.90%`.
- Same file, the "Engagements" stat box — it's gated on `user.engagements !== undefined` but then renders `formatEngagementRate(user.engagement_rate)` instead of the actual `user.engagements` value. It's showing the wrong field entirely; it should display the real engagements count (e.g. `371,323`), not a re-formatted rate.
- Follower-count formatting is implemented three separate times with three different rounding rules: `formatFollowers` in `utils/formatters.ts`, `formatFollowersLocal` inline in `ProfileCard.tsx`, and `formatFollowersDetail` inline in `ProfileDetailPage.tsx`. Consolidate into one shared, well-typed utility (consider a `precision` option since the detail page wants 2 decimals and the card wants fewer).
- `src/components/SearchBar.tsx` exists but is never imported anywhere — `PlatformFilter.tsx` has its own duplicate inline input. Either delete `SearchBar.tsx` or refactor `PlatformFilter` to actually use it. Pick one, don't keep both.

Commit each fix separately with a real message — this is your "find and fix issues" evidence for the README and the interview.

### Block 4 — Zustand store + Add to List (2.5 hrs)
There's no existing Context anywhere in this codebase (confirmed — it's not just hidden somewhere), so this isn't a migration, it's building the feature's state layer from scratch with Zustand as required.

```bash
npm install zustand
```

```ts
// src/store/useListStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ListState {
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  isSelected: (userId: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      addProfile: (profile) => {
        if (get().selectedProfiles.some((p) => p.user_id === profile.user_id)) return;
        set((s) => ({ selectedProfiles: [...s.selectedProfiles, profile] }));
      },
      removeProfile: (userId) =>
        set((s) => ({
          selectedProfiles: s.selectedProfiles.filter((p) => p.user_id !== userId),
        })),
      isSelected: (userId) => get().selectedProfiles.some((p) => p.user_id === userId),
    }),
    { name: "wobb-selected-profiles" }
  )
);
```
That covers persistence (the `persist` middleware writes to `localStorage` automatically — survives refresh for free) and duplicate prevention (`user_id` check in `addProfile`) in one shot.

When you wire this into components, subscribe to only what you need (`useListStore((s) => s.selectedProfiles)`) rather than destructuring the whole store — avoids re-rendering components that only care about one slice.

Replace the disabled stub buttons in `ProfileCard.tsx` and `ProfileDetailPage.tsx` with real ones wired to `addProfile` / `removeProfile` / `isSelected`. Add a toast (see libraries below) on add/remove for feedback.

### Block 5 — "My List" view (1.5 hrs)
A required part of the feature is displaying and managing the selected list — give it a real screen, not just a console log. A simple new route (`/list`) reading from `useListStore` works well: empty state when nothing's selected, a remove action per item, and a count badge somewhere persistent in the nav (header or a floating element — see the design direction below).

### Block 6 — Start the redesign (1.5–2 hrs)
Read the design direction section near the bottom before this block. Rebuild `Layout.tsx` (header/nav) and `PlatformFilter.tsx` (the platform tabs + search input) with your actual design tokens. Don't touch `ProfileCard` yet — that's Day 2's first block, once the foundation is solid.

End of day: commit and push everything. You should have a working app with bug fixes, a functioning Add to List feature with persistence, and the start of a redesign.

---

## Day 2 (Wednesday, July 1)

### Block 1 — Finish the redesign (2.5 hrs)
Rebuild `ProfileCard` as a responsive grid card (replace the fixed `w-[700px]` — that's currently the single biggest reason this layout can't work on mobile at all) and `ProfileDetailPage` as a proper hero + stats layout. Cover loading, empty, and error states with real designed treatments, not bare text. Add `alt` text to every `<img>`, visible focus rings on every interactive element, and `aria-label`s where icon-only buttons don't have visible text. Test at 375px width (phone) and 1440px (desktop) at minimum.

### Block 2 — Performance pass (1.5 hrs)
Concrete, specific to this codebase:
- `SearchPage.tsx` calls `extractProfiles()` and `filterProfiles()` directly in the render body on every keystroke. Wrap both in `useMemo`.
- Debounce the search input (~300ms) before it drives filtering — a small custom hook is enough, no need for a full utility library for one function:
```ts
// src/hooks/useDebounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
```
- Wrap `ProfileCard` in `React.memo`. While you're there, drop the `searchQuery` prop being passed down to it just to set a `data-search` attribute — it does nothing functional and forces every card to re-render on every keystroke. (If you want match-highlighting as a nice extra, that's a legitimate reason to bring `searchQuery` back in — just do it deliberately.)
- Lazy-load the detail route with `React.lazy` + `Suspense` so the dashboard bundle doesn't carry profile-detail code it doesn't need yet.

### Block 3 — Code quality / structure pass (1.5 hrs)
A reasonable target structure for a project this size (don't over-build it):
```
src/
  pages/        SearchPage, ProfileDetailPage, ListPage
  components/   ProfileCard, ProfileList, PlatformFilter, VerifiedBadge, shared UI bits
  store/        useListStore.ts
  hooks/        useDebounce.ts, etc.
  utils/        formatters.ts, dataHelpers.ts, profileLoader.ts
  types/        index.ts
```
If you have time and it feels natural, grouping by feature (`features/search`, `features/list`) is a fine step further — but a flat, clean structure like above is genuinely fine to ship; don't burn hours restructuring for its own sake.

### Block 4 — Micro-interactions (1 hr)
Keep this restrained — a satisfying add-to-list moment (icon fill + toast + a small bump on the list counter), a subtle card hover lift, skeleton placeholders instead of plain "Loading..." text. Respect `prefers-reduced-motion`. This is where `framer-motion` earns its place if you install it — don't reach for it just because it's available.

### Block 5 — Tests (1 hr)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```
You don't need full coverage — 3–4 well-chosen tests show judgment: the search bug fix (`filterProfiles` is case-insensitive now), the Zustand store (`addProfile` prevents duplicates, `removeProfile` works), and one component smoke test.

### Block 6 — Deploy (1 hr)
Vercel is the fastest path — import the GitHub repo directly, it auto-detects Vite. Confirm the deployed build actually works (not just `npm run dev` locally), then put the URL in your README.

### Block 7 — README (30–45 min)
Fill in the template below properly — this is graded, not an afterthought.

End of day: final commits, push.

---

## Final stretch (Thursday, July 2, before 2:00 PM IST)

No new features today — this block is QA and submission only, because the repo's own README states commits after the deadline disqualify the submission.

- Test from zero: in a clean folder, `git clone` your own repo, `npm install`, `npm run build`, `npm run dev` — confirm it works exactly as a reviewer would experience it, not just on your already-set-up machine.
- Check responsiveness one more time at mobile width.
- Re-read the original assignment doc top to bottom and check every checklist item literally, including the small ones (public repo, not a fork, meaningful commit history).
- Double-check the repo is genuinely a new repo you created (not a fork) and is set to public.
- Submit by around 1:00 PM IST, not 1:59 PM — leave real buffer for a flaky push, a GitHub outage, or a typo in the URL you send.

---

## Design direction

Avoid the obvious AI-default looks (cream background with a serif display, near-black with a single neon accent, or a hairline-rule broadsheet layout) — none of them are wrong, they're just not a choice made for this brief.

**Color.** The starter's leftover CSS already defines an accent purple (`--accent: #aa3bff`) — it's a genuinely good, distinctive color (not a generic blue), so keep it as your single primary accent rather than starting over. Pair it with a soft, cool-toned off-white background (around `#F8F7FB`) rather than pure white or a warm cream, white card surfaces, near-black ink for headings, and a muted plum-gray for body text (close to the existing `--text: #6b6375`). Reserve the purple for actions and selected states — the Add to List button, the active platform tab, the list counter.

**Type.** Pair "Space Grotesk" for headings and all numeric stats (it has confident geometric numerals — good for follower counts and engagement rates sitting in a grid) with "Inter" or system-ui for body text. Both load via a single Google Fonts `<link>` — no build config, fast to set up.

**Layout.** Replace the current centered, fixed-width single column with a responsive card grid (1 column on mobile, 2–3 on tablet, 3–4 on desktop). On the detail page, a hero band (avatar, name, verified badge, platform, one standout stat) above a clean stats grid reads much stronger than the current flat list.

**Signature element.** Wobb's actual product is built around discovering and shortlisting creators for campaigns — this assignment is a faithful miniature of that. Lean into it: make the "your list" tray the visual centerpiece, not a bolt-on. A small persistent element (corner pill or sticky bar) showing the selected count with tiny stacked avatars, that grows as you add profiles and opens the full list — turns the assignment's actual required feature into the thing the app is memorably built around.

**Motion.** One well-built moment (the add-to-list interaction) beats five scattered ones. Hover lift on cards, a skeleton loader instead of "Loading...", and that's plenty.

---

## Libraries

| Library | Why |
|---|---|
| `zustand` | Required by the brief; also genuinely the right tool here — small, no boilerplate, built-in persist middleware |
| `clsx` | Conditional Tailwind class names without messy template strings |
| `lucide-react` | Clean icon set for search, remove, bookmark/add, platform glyphs |
| `sonner` | Lightweight toast notifications for add/remove feedback |
| `framer-motion` *(optional)* | Only if Block 4 needs it beyond what CSS transitions can do |
| `vitest` + `@testing-library/react` *(optional)* | Bonus test coverage |

Deliberately skipped: a data-fetching library (React Query/SWR). All data here is static local JSON loaded via `import.meta.glob` — there's no real network layer to manage, so adding one would be unjustified complexity. Worth a line in your README's trade-offs section; it shows restraint, not just "I added libraries because I was allowed to."

---

## README template

```markdown
# Wobb Influencer Search — Submission

## Live demo
(Vercel/Netlify URL)

## What I changed
- Fixed: npm install failure (unused react-beautiful-dnd, React 19 peer conflict)
- Fixed: case-insensitive username search
- Fixed: engagement rate calculation (was ×10000, should be ×100)
- Fixed: "Engagements" stat showing the wrong field
- Consolidated 3 duplicate follower-formatting implementations into one
- Built Add to List feature with Zustand (add/remove/duplicate-prevention/persistence)
- Full UI/UX redesign — see design notes below
- Performance: memoized filtering, debounced search, React.memo, lazy-loaded detail route
- ...

## Libraries added
(table from above, your final list)

## Assumptions
- ...

## Trade-offs
- Skipped a data-fetching library since all data is static local JSON
- ...

## Remaining improvements (with more time)
- ...
```

---

## If you're short on time

Cut in this order — stop as soon as you're back on schedule:

1. Tests (bonus, not a stated requirement)
2. Extra micro-interactions beyond the one core add-to-list moment
3. Feature-based folder restructuring (flat structure is fine to ship)
4. Match-highlighting in search results (never actually required)

Never cut: `npm run build` passing, the Add to List feature itself, Zustand as the state layer, the verified bug fixes (they're fast, do them regardless), a responsive layout, the README, and a clean git history in a real (non-forked) repo. Those are the explicit, named evaluation criteria.

## Be ready to explain in the interview

The brief says you may be asked to explain your approach — have quick, specific answers ready for: why Zustand over Context given there wasn't one to replace; how persistence actually works (`zustand/middleware persist` → `localStorage`) and its limits (no cross-device sync); how duplicates are prevented (`user_id` comparison, not reference equality); what the 4–5 concrete bugs were and how you verified each fix; why you skipped a data-fetching library; and what you'd build next with more time.
