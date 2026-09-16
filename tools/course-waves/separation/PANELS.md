# FC1 panels. The build brief.

Three panels, one per tier, all over one teaching lab at
`src/components/course/panels/separation/separationLab.js`, plus the course
landing page. Work in the worktree `/root/wt-fc1-nextgen` (branch
`feat/fc1-separation-course`); never the shared checkout. Other agents are
writing lesson files under `src/content/courses/separation/` in the same
worktree: do not touch those, and do not commit.

The panels COMPUTE NOTHING. Every number they show is a lab return value,
and every lab return value is a return value of the vendored engines
`@petrolord/engines/engines/facilities/separatorSizing.js` and
`spacing.js` (over `engines/production/gasProperties.js` for the z factor),
except the arithmetic the digest itself labels "derived" (an absolute
pressure from a gauge pressure, a standard rate in ft3/s, an average of two
densities shown to be the wrong answer, half a pool diameter, a chord-rule
layer shown as history), which the lab performs exactly as the digest does.
Nothing in this domain reads a clock or a random number, which makes the
clock gate cheap and worth having anyway. Copy structure, styling,
mode-switch pattern and test layout from the EC6 `fdp` panels:
`src/components/course/panels/fdp/*`, `fdpLab.js`, `fdpLab.test.js`,
`panelCapstoneGuard.test.js`, and `src/pages/apps/FdpLearningPage.jsx`.

## The lab

`separationLab.js` builds the TEACHING FIELDS exactly as
`/root/fc-wip-separation/fc1_dump.mjs` defines them (copy `ABANA_1`,
`ABANA_1_SWEEP`, `ABANA_2`, `ABANA_2_SWEEP`, `ABANA_2_WIDE_BAND`,
`ABANA_2_LOW_LEVEL_FRAC`, `ABANA_SLUG`, `ABANA_FINGERS`,
`ABANA_FINGERS_FEW`, `AGBAMI`, `AGBAMI_EXPLICIT_WATER_FRAC`,
`AGBAMI_TIGHT_WATER_DROPLET_MICRON`, `AGBAMI_SWEEP`, `AGBAMI_NARROW_BAND`,
`ERHA_DATUM`, `atM`, `ERHA_ITEMS`, `ERHA_FLARE`, `ERHA_POOL`,
`ERHA_UNPLACED` and `ERHA_GHOST_SOURCE` verbatim from
`/root/fc-wip-separation/fc1_fields.mjs`, including the `conditions` chain
the dump defines) and reads the published cases from
`@petrolord/engines/test-data/facilities/goldens/separator_cases.json` and
`spacing_cases.json`. One reader per digest section (names are yours): what
the engine refuses (1), the gas at conditions (2), the K value (3), settling
(4), the vertical vessel (5), the Associate chain (6), the segments (7), the
two lengths (8), gas capacity (9), slug catchers (10), distances and
setbacks (11), the station judged (12), the three-phase split (13), droplets
and verdicts (14), the family (15), the layout reading (16), the held items
(17), the Expert chain (18).

The lab ALSO carries the capstone surface for the grader and the tests,
built from `/root/fc-wip-separation/fc1_fields_capstone.mjs`: copy
`EJULEBE_1`, `EJULEBE_2`, `EJULEBE_SLUG`, `EJULEBE_FINGERS`, `ODEAMA_FLARE`,
`ODEAMA_POOL`, `EJULEBE_3`, `EJULEBE_4`, `ADANGA_DATUM`, `ADANGA_ITEMS` and
`ADANGA_SOURCES` verbatim into a clearly separated CAPSTONE block with
`ejulebe*`, `odeama*` and `adanga*` names, a function that reproduces the
eighteen fields, and a `panelCapstoneGuard.test.js` that greps the three
panel sources and the learning page for every capstone-only export name and
fails if one appears.

## Tests

`separationLab.test.js` (vitest) rebuilds EVERY digest line from lab return
values with the dump's formatting and compares against
`/root/fc-wip-separation/digest.txt` section by section and whole, byte for
byte, the way the EC5 and EC6 labs do. The capstone block must reproduce
`/root/fc-wip-separation/fields.json` exactly, all eighteen, READ FROM THE
FILE.

Leak gate: no teaching export may return a number within ten times a graded
field's ABSOLUTE tolerance of any value in `fields.json`, under the x1, x1000
and x0.001 shiftings. Walk every number the lab exports, not only what the
digest prints. Plant a deliberate leak once, watch it go red, remove it, say
so. Refuse to run over an implausibly small export set.

A clock gate: every reader returns identical output under two faked system
dates (vitest fake timers), with a control proving the fake clock moved.
A timezone gate: the whole digest rebuild runs a second time under
`TZ=America/Los_Angeles` and must be byte-identical.
A held-items gate: assert that the four HELD quantities (the derated K, the
horizontal settling velocity used in the gas length, the API 521 labels, the
spacing table figures) are rendered with the wording that marks them as
unverified, and that no capstone field reads one.
A refusal gate: every `SeparatorInputError` the panels display carries the
engine's own message and the input name, asserted against the engine rather
than retyped.

Run the fdp, portfolio, decision, uncertainty, fiscal and cashflow lab tests
alongside yours; they must stay green. Also run the packages/engines jest
facilities suites (`facilities.separator`, `facilities.separator.dak`,
`facilities.spacing`) after any re-vendor. NextGen CI never runs vitest.
Also run eslint on your files and `npx vite build` once at the end (delete
dist).

## `fc-separator-explorer`, Associate, `SeparatorExplorer.jsx`

Modes: **conditions** (the three streams, gauge to absolute, the Sutton
pseudo-criticals, Ppr and Tpr, z, gas density, the actual rate, and the DAK
range refusals), **kvalue** (the six published rows, the derating at
pressure with its floor and warning, an override, and the held notice),
**settling** (the two liquid densities, the rate-weighted mixture, the
Souders-Brown velocity, the published cases, and the refusals), **vertical**
(the gas-required diameter, the height at each offered diameter, the margin
and the slenderness, and the published vertical cases).

## `fc-slug-explorer`, Professional and Expert, `SlugExplorer.jsx`

Modes: **segments** (the cross-section at a range of levels, the chord, the
inverse of the segment area, and the refused levels), **lengths** (the two
length requirements across the family, which controls, and the level
dropped), **capacity** (the gas velocity, the margin, the verdict, and the
pinned consequence that the gas length cannot exceed the gas height),
**slug** (the vessel and the harp, the working volume, the warning),
**threephase** (the proportional and the pinned split, the exact interface
against the retired chord rule, the two retention lengths, the droplet
velocities, the residence times and the two verdicts at both droplet
specifications), **family** (every sweep with `feasible`, `inRange`,
`reasons`, `preferred` and `preferredStatus`, and the published sweep cases
beside the row the retired rule would have taken).

## `fc-layout-explorer`, Professional and Expert, `LayoutExplorer.jsx`

Modes: **distances** (the ERHA site plan, the haversine pairs, the published
cases against Vincenty and the chord), **setbacks** (the flare and the pool
fire, the heat release, the flame height, the radius from the centre and the
setback from the edge with its status, and the published cases),
**check** (the whole layout reading: checked, zero-requirement pairs,
violations, skipped, unknown pairs, complete, pass and passStatus),
**rankings** (the two rankings side by side with the pair each names, and
the retired single ranking as history), **table** (the spacing figures used,
marked as a table with no source checked, and the null a pair the table does
not carry returns).

## The course page and its route

`SeparationLearningPage`, on the `FdpLearningPage` model, at
`/dashboard/apps/separation`, registered in `src/pages/DashboardPage.jsx`
beside the fdp route. Register the three panel ids in
`src/content/courses/panelRegistry.js` as `fc-separator-explorer`,
`fc-slug-explorer` and `fc-layout-explorer` under an `// FC1 Separation &
Slug Catching` comment.

Owner copy rule for every user-facing string: no em or en dashes, no
"X, not Y" contrastives built with a dash. Field units for the vessels,
metres for the site.

## Report

Files written; test counts (yours and the neighbouring labs); the planted
leak going red; the negative controls; the clock gate; the timezone rebuild;
eslint and build; any digest line the lab could not reproduce, and any lab
export that collided with a graded field (report it, do not paper over it).
