# Homepage counts: nextgen.petrolord.com and petrolord.com

Reconciled 2026-10-05 with the Suite homepage (petrolord-suite
`docs/scope/Homepage-Counts.md` carries the same table). Every figure below
was read from the live databases (read-only) that day.

## Definitions

- **Live course**: an `academy_apps` row (NextGen project
  `txcsbtvcdaqmkjjbhbeg`) with `status = 'available'`.
- **App course**: a live course with `course_type = 'app'`, built on a
  Petrolord Suite app. The others are `engine` courses (procurement, pia,
  gsa, joa, farmout, prms) and `practice` courses (contracts).
- **Academy discipline**: an `academy_apps.module` with a live course. The
  academy has 12; the Suite sells 10 modules. They group differently, so
  the NextGen page says "academy disciplines" and the Suite page says
  "Suite modules".
- **Certification**: three per live course (Associate, Professional,
  Expert).
- **Live Suite app** (shown on petrolord.com only): a `master_apps` row with
  `status = 'Active'`, `is_built` and `is_functional`, routed on Suite main.

## The figures

| Site | Figure | Source | Old | New |
|---|---|---|---|---|
| nextgen.petrolord.com | courses | `catalogStats()` over `src/lib/homeCatalog.js` merged with live `academy_apps` | 79 once the live read returned; 68 on first paint and whenever the read failed, because 11 courses were still `coming_soon` in the static list | 79 always |
| nextgen.petrolord.com | courses built on a Suite app | `catalogStats().appCourses` (new) | "each built around a real engineering app", untrue for 7 | 72 |
| nextgen.petrolord.com | disciplines | `catalogStats()` | 12, "disciplines across the energy value chain" | 12, "academy disciplines, from geoscience to data and AI" |
| nextgen.petrolord.com | certifications | 3 per live course | 237 live, 204 on first paint | 237 always |
| nextgen.petrolord.com | meta description | `catalogStats()` | "79 courses taught inside the Petrolord Suite" | "79 courses built on the Petrolord Suite's apps and engines" |
| petrolord.com | NextGen courses | Suite `NEXTGEN_LIVE_COURSES` | 79 | 79, "72 of them built on these apps" |
| petrolord.com | apps, modules | Suite `src/data/suiteCatalog.js` | 104, 10 | 104, 10 (labelled "Suite modules") |

Not counts: the employer panel (24 seats, 71 percent, 2 inactive) is an
illustrated sample; "100 percent of capstones auto-graded" is a statement.

## Guard

`src/lib/homeCatalog.test.js` compares `HOME_COURSES` with
`src/lib/__fixtures__/academy-apps-live.json` (the 2026-10-05 snapshot)
course by course and requires the static stats to equal the live stats, so
the page cannot paint one number and then another. When a course goes live,
re-run `select slug, module, status, course_type from public.academy_apps;`
(read-only), update the snapshot and `homeCatalog.js` together, and update
the Suite's `NEXTGEN_LIVE_COURSES` and `NEXTGEN_APP_COURSES` with its
snapshot in a Suite PR.
