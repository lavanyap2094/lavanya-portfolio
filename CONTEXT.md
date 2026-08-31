# Project Context & History

This file summarizes decisions made while building this site in a previous
Claude conversation, so context isn't lost when picking this project up in
Claude Code or a new session.

## Who this is for
Lavanya Pulijala — fashion/art direction portfolio site. Recreated from a
Webflow template ("Mirrorless") using her real Webflow site as the source of
truth for content, copy, and images.

## Key design decisions (don't undo without asking)

- **Hero name overlap**: "Lavanya" / "Pulijala" is intentionally huge (16vw)
  and deliberately bleeds across the hero photo — this was a specific,
  iterated-on design choice (matching the original template's dramatic
  overlapping composition), not a bug. The photo is positioned to start
  roughly under the "y" in Lavanya.
- **Hero paragraph** ("Art Direction is how I turn the way I see the world
  into stories people can step into!") is positioned to straddle the seam
  between the name and the photo — half on each.
- **Work rail** was originally a vertical-scroll-driven horizontal animation
  (scroll-jacking), but this was intentionally REMOVED per Lavanya's request.
  It's now a native horizontally-scrollable row (`overflow-x: auto`) — a real
  two-finger horizontal swipe moves it, vertical scroll passes through
  untouched. Do not reintroduce scroll-jacking without being asked.
- **"latest." section title** (with "View All" link) was intentionally
  removed from the homepage per her request — don't re-add it.
- Color palette: background `#0d0d0d`, accent orange `#db9038`, fonts are
  DM Serif Display (headings) / Roboto (body) / Montserrat (UI/nav).

## Known open items / things to follow up on

- The `/work` (work.html) "All Series" page, pulled from her real Webflow
  source, only lists 4 of her 5 projects — "What We Carry" is missing from
  that page on her actual live site. Flagged to her, not yet resolved
  whether that's intentional.
- Individual project pages (What We Carry, Between Tides, Terry Singh NYFW,
  In Between, The Way I See) have NOT been built yet. Homepage and work.html
  currently link to placeholder filenames for these
  (e.g. `between-tides.html`) that don't exist yet — build these as she
  provides page-source content for each, same process as before (she pastes
  Webflow page source, you extract real content/images/CSS).
- Category filter dropdown on work.html is visually functional (opens/
  closes) but does NOT actually filter projects yet — that would need
  either separate category pages or JS filtering, not yet built.
- Site is not yet deployed. Plan is GitHub -> Netlify once more pages exist.

## Process notes (how she likes to work)

- Very iterative — gives feedback in small rounds via screenshots, expects
  precise pixel/positioning adjustments based on visual comparison.
- Prefers fixes to be actually tested (not just assumed) before being shown
  the result — Playwright was used throughout to verify scroll behavior,
  mobile rendering, and layout bugs before presenting changes.
- Source of truth for content/design is always her real, live Webflow site
  (lavanyapulijala.webflow.io) — when in doubt, match that over guessing.
- Wants mobile compatibility checked proactively, not just desktop.

## File structure

- `index.html` — homepage
- `work.html` — all-series work listing page
- `style.css` — shared styles (all pages)
- `script.js` — shared behavior: hero letter-reveal animation, category
  dropdown toggle. Defensively checks for element existence so it doesn't
  error on pages that lack homepage-only elements.
