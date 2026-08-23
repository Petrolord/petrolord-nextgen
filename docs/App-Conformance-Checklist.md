# Learning-app conformance checklist (deep-course standard)

The depth program (DC1 chassis, DC2+ courses) sets a standard the
learning apps must meet: the app is the lab where the learner PRODUCES
the graded numbers, never a display that hands them over. Petrophysics
is the reference implementation (conformance wave 2026-08-23); every
other app follows this checklist when its deep tiers ship.

## The standard, per tier that has a deep course

1. **Interactive workflow, not answer tiles.** Each tier section of the
   learning page is a workflow the learner drives: parameters they set,
   fits they run, bookings they trigger. Remove any element that renders
   a capstone-graded value the learner did not produce. Givens the
   course brief supplies may be pre-filled, but they stay editable and
   the outputs recompute from them.
2. **Engines only.** Panels call `@petrolord/engines` directly or via a
   thin pure helper module (see
   `src/components/course/panels/petrophysics/typewellLab.js`). No math
   in JSX, no copied constants: read the givens from the bundled
   teaching dataset.
3. **Panels are shared components.** Interactive teaching panels live in
   `src/components/course/panels/<app>/` and serve BOTH hosts: the
   learning page tier sections and lesson embeds via `{{panel:<id>}}`
   markers resolved through `src/content/courses/panelRegistry.js`
   (lazy, print-degrading). One implementation, two surfaces.
4. **Lesson embeds are declared.** A lesson using a panel lists the id
   in its manifest `panels` array AND carries the marker line. The
   content lint (`src/lib/courseContent.test.js`) fails on unregistered
   or undeclared panel ids. Markers do not change module or lesson keys,
   so embedding panels needs no structure migration.
5. **Math pinned to the oracle.** A vitest file per app pins the panel
   helper math to the live capstone oracle values (see
   `typewellLab.test.js`): if the panels and the grader ever disagree,
   CI catches it before a learner does.
6. **Capstone stays gated.** The submit UI renders only when
   `academy_course_progress` reports the capstone unlocked (or the
   super_admin reviewer door applies). Never re-introduce a
   pass-in-minutes surface.
7. **House copy rules.** No em dashes in any user-facing copy, panels
   included.

## What a conformance PR must show

- The tier workflows on staging producing every graded capstone number
  from learner-driven inputs, within the oracle tolerances.
- vitest green: content lint + the app's panel math suite.
- `npm run build` green.
- No DDL (conformance is UI + content markers only).

## Upgrade lane

New teaching capability lands in this order: engine function in the
central engines repo (validation-first, goldens) -> panel component over
it -> lesson markers where the course teaches it -> optional new course
tier. The panel registry is the seam that keeps upgrades cheap: a new
panel is one component, one registry line, and marker lines in the
lessons that want it.

## Module expansion (beyond geoscience)

The catalog already supports new modules; adding reservoir, drilling,
economics (and the rest) is content and catalog work, not schema work:

- `academy_apps.module` is a free-text grouping the dashboard renders
  dynamically; new apps declare their module label.
- `academy_apps.school` keys the fee schedules (subsurface /
  energy_business today; a new school needs a fee-schedule row set).
- Each module picks its prerequisite ROOT (`academy_apps.prereq_slug`
  chain), the way `welldata` roots the geoscience path. Owner decision
  per module.
- The scope ladder, doors, capstone machinery and deep-course chassis
  are app-agnostic and need nothing new.
- Engines must exist before courses: any module's math lands in the
  central engines repo first (MBAL is already there; DCA and EPE follow
  the extraction runway pattern when their courses are scheduled).
