# NextGen design system

NextGen follows the Petrolord family design system. The rules, the tokens
and the component catalogue live in the Suite
(`Petrolord/petrolord-suite`, `docs/scope/DesignSystem.md`); the NextGen
rollout plan, the inventory and the as-built notes per batch live in
`docs/scope/DesignSystem-Rollout.md`. This file records the NextGen pieces a
batch builds with, starting with the two kits of batch 1B: the chart kit and
the course kit.

## 1. The chart kit (batch 1B)

Charts stay white in both themes (family rule 4). The kit is the Suite's,
with the same file names, export names, props and defaults, so a chart
written for one app reads the same in the other.

| file | exports | from the Suite |
|---|---|---|
| `src/utils/chartTheme.js` | `CHART_COLORS`, `STREAM_PALETTES`, `getStreamPalette`, `CHART_TYPOGRAPHY`, `CHART_MARGINS`, `LEGEND_PROPS`, `XAXIS_LABEL_HEIGHT`, `GRID_STYLE`, `TOOLTIP_STYLE`, `PINNED_TOOLTIP_PROPS`, `ANNOTATION_BOX_CLASSNAME`, `CHART_LOGO_PATH`, `CHART_LOGO_STYLE`, `niceTicks` | byte for byte below its header (Suite main `e7807a1da`) |
| `src/components/charts/ChartLogo.jsx` | default `ChartLogo` (`style`) | same; the image is `public/petrolord-chart-watermark.png`, the Suite's file |
| `src/components/charts/ChartFrame.jsx` | default `ChartFrame` (`height` 260, `className`, `exportFilename`, `logoHeight` 40, `header`, children: one Recharts chart) | same; its PNG export comes from `src/utils/chartExport.js` |
| `src/components/ui/chart-panel.jsx` | `ChartPanel` (`title`, `subtitle`, `actions`, `as`, `className`, `bodyClassName`) | same inside a scope; outside one see below |
| `src/utils/chartExport.js` | `exportChartAsImage(elementId, fileName)` | the Suite's helper from `utils/declineCurve/dcaExport.js` |
| `src/utils/chartSvg.js` | `CHART_SERIES`, `seriesColor`, `SVG_CHART`, `GRID_LINE_PROPS`, `AXIS_LINE_PROPS`, `REFERENCE_LINE_PROPS`, `svgTextProps`, `AXIS_TICK` | NextGen only |
| `src/components/charts/SvgChartFrame.jsx` | default `SvgChartFrame` | NextGen only |

To change the shared part, change the Suite first and copy the file here
(`chartKit.test.jsx` pins the export names and the watermark).

### A Recharts chart

```jsx
import ChartFrame from '@/components/charts/ChartFrame';
import { ChartPanel } from '@/components/ui/chart-panel';
import { GRID_STYLE, PINNED_TOOLTIP_PROPS, LEGEND_PROPS, CHART_MARGINS } from '@/utils/chartTheme';
import { seriesColor, AXIS_TICK } from '@/utils/chartSvg';

<ChartPanel title="Hookload and torque" subtitle="against open-hole friction factor">
  <ChartFrame height={260} exportFilename="friction-sweep">
    <LineChart data={rows} margin={CHART_MARGINS.legend}>
      <CartesianGrid {...GRID_STYLE} />
      <XAxis dataKey="f" tick={AXIS_TICK} />
      <YAxis tick={AXIS_TICK} />
      <Tooltip {...PINNED_TOOLTIP_PROPS} />
      <Legend {...LEGEND_PROPS} />
      <Line dataKey="hook" stroke={seriesColor(0)} strokeWidth={2} dot={false} />
      <Line dataKey="torque" stroke={seriesColor(1)} strokeWidth={2} dot={false} />
    </LineChart>
  </ChartFrame>
</ChartPanel>
```

A panel that already has its own card may use `ChartFrame` alone. The old
dark plate goes: no `bg-[#0F172A]` behind the chart, no `#334155` grid, no
`#94a3b8` ticks and no dark tooltip.

### A hand-made SVG chart

About 34 course panels draw their own `<svg>`. They move to the white plate
with `SvgChartFrame`, which is `ChartFrame` for an svg: the white
`data-canvas="chart"` surface, the reserved band with the Petrolord mark,
`header` and `exportFilename`, and the white plate drawn for you.

```jsx
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { seriesColor, GRID_LINE_PROPS, AXIS_LINE_PROPS, REFERENCE_LINE_PROPS, svgTextProps } from '@/utils/chartSvg';

<SvgChartFrame width={W} height={H} label="Porosity and temperature with depth" minWidth={460} maxWidth={720}>
  <line {...GRID_LINE_PROPS} x1={...} x2={...} y1={y} y2={y} />
  <line {...AXIS_LINE_PROPS} ... />
  <polyline points={phiPts} fill="none" stroke={seriesColor(0)} strokeWidth="1.8" />
  <line {...REFERENCE_LINE_PROPS} ... />
  <text x={...} y={...} {...svgTextProps('note')} fill={seriesColor(0)}>porosity</text>
  <text x={...} y={...} {...svgTextProps('tick')}>0 to 3000 m</text>
</SvgChartFrame>
```

- `width` and `height` are the viewBox; the svg scales to the frame.
- `label` is the accessible name (`role="img"`).
- `minWidth` keeps a wide plot legible on a phone (it scrolls sideways inside
  the frame); `maxWidth` stops a small plot from stretching on a wide screen
  (its text grows with it) and centres it. Use both for most course plots.
- `svgProps` go on the `<svg>` (event handlers for a draggable cursor, for
  example).

`SVG_CHART` holds the colours: `plate` white, `grid`, `axis`, `tick`,
`label` from `CHART_COLORS`, `note` `#475569` for annotations, `reference`
`#64748b` for guide lines and limits, and `marker` white for the outline of
a point marker. `svgTextProps('tick' | 'label' | 'note')` gives the fill,
size and family for a `<text>`.

### Series colours

`CHART_SERIES` is the family's five series colours (the design tokens,
identical to the Suite's `--chart-1..5`): blue `#2563EB`, green `#059669`,
amber `#D97706`, red `#DC2626`, violet `#7C3AED`. Each is at least 3:1 on
white (tested). Assign them in that order with `seriesColor(i)`, which wraps
after five. For oil, gas and water streams use `getStreamPalette(stream)`
from `chartTheme`, as the Suite does.

Mapping NextGen's old dark-plate colours: lime `#BFFF00` (the main series)
goes to `seriesColor(0)`; sky `#38bdf8` to `seriesColor(0)` or `(1)`
(whichever is free); red `#f87171` to `seriesColor(3)`; amber and yellow to
`seriesColor(2)`; slate labels and guides to `SVG_CHART.note` and
`REFERENCE_LINE_PROPS`; a white point outline stays white (`SVG_CHART.marker`).
Lime does not survive on a chart: it fails contrast on white.

### The canvas and the theme test

`ChartFrame`, `SvgChartFrame` and `ChartPanel` all carry
`data-canvas="chart"`. Inside a theme scope that pins the light roles, and
the legacy-chrome check skips the region, so the chart kit's own fixed
light classes (`bg-white`, `text-slate-600`) are allowed there. Nothing
outside a chart canvas may use them.

### Outside a scope

`ChartFrame` and `SvgChartFrame` render the same everywhere. `ChartPanel`
takes the theme roles inside a scope and, outside one, draws the same white
card with fixed light classes (the roles do not resolve there). So a course
app batch can move a panel's charts to the kit even though the panel still
renders in the unmigrated reader and handbook: the chart is white in both
places. Wave 7 drops `ChartPanel`'s outside-scope look.

## 2. The course kit (batch 1B)

The pieces every course app, the course reader and the handbook share. Each
is scope-aware with `useThemeClass` (`src/design/themeClass.js`): inside a
design-system scope it renders the theme roles, outside one it renders its
legacy markup byte for byte, proven by
`src/components/course/__tests__/courseKitLegacy.test.jsx` against a fixture
captured from main `af5c91747` before any kit file changed.

| piece | file | inside a scope |
|---|---|---|
| `LearningModeGate` | `components/academy/LearningModeGate.jsx` | roles for the title and copy; the actions are the themed `Button` default (petrol green) and outline variants |
| `DeepCourseBanner` | `components/course/DeepCourseBanner.jsx` | the themed card with a gold (`accent`) border and icon; primary button |
| `PanelShell`, `NumField`, `SelectField`, `Tile`, `TileGrid`, `FieldGrid`, `Note` | `components/course/panels/petrophysics/panelKit.jsx` | surface card; the Suite input styling (`border-pl-border-strong`, focus ring) for the number field and the native select; tiles on `sunken` with mono tabular values |
| `CapstoneCaseFiles` | `components/course/CapstoneCaseFiles.jsx` | sunken box, outline download buttons |
| `LockedCard` | `components/course/LockedCard.jsx` | roles; outline back button |
| `QuizRunner` | `components/course/QuizRunner.jsx` | themed cards and radios; pass, fail and cooldown lines on the success, danger and warning text roles, each with its words and icon |
| `PracticeCourseBadge` (`app` look) | `components/course/PracticeCourseBadge.jsx` | the info roles; the `home` look (regal homepage) never changes |
| `PracticeCourseNotice` | `components/course/PracticeCourseNotice.jsx` | the info roles |
| `PracticeCertificateCard` | `components/course/PracticeCertificateCard.jsx` | themed card, gold award icon, success tick, primary claim button, danger error line |

Lime is gone from every piece inside a scope: actions are `primary`,
highlights `accent` (gold).

A course app batch uses the kit as it is: once its route is registered,
the kit takes the roles on its pages. The per-course `panelBits` and lab
views are the app batch's own, scope-aware while the reader and handbook
still render them outside a scope.

### Tests

- `src/components/course/__tests__/courseKitScenes.jsx`: every kit piece in
  every state (the five gate states and loading, each quiz phase, each
  certificate outcome), shared by the two tests below.
- `courseKitLegacy.test.jsx`: outside a scope, the markup matches the
  fixture. Do not regenerate the fixture
  (`UPDATE_COURSE_KIT_LEGACY=1`) while an unmigrated screen uses the legacy
  branch.
- `courseKitTheme.test.jsx`: inside a scope, every scene has no legacy
  chrome in light and dark, no lime, the scope opens light and the toggle
  round-trips, with a negative control.
- `src/components/charts/__tests__/chartKit.test.jsx`: the chart kit's API,
  watermark, series contrast on white and the frames.

## 3. Batch 2B: admin I (as built)

Academy doors (`/dashboard/admin/academy-doors`, with `AdminSponsorPools`),
certifications (`/dashboard/admin/certifications`), the user directory
(`/dashboard/admin/users`, with `UserDetailModal` and `UserEditModal`),
audit logs (`/dashboard/admin/audit-logs`, with `AuditDetailModal`), super
admins (`/dashboard/admin/super-admins`) and system settings
(`/dashboard/admin/settings`) are on the roles and registered in
`src/design/rollout/w2b.js`.

- Every file the six screens own is used by that screen alone, so each moved
  straight to roles with no legacy branch.
- The ui kit carries the look: lime buttons became the default (petrol
  green) `Button`, and the per-page overrides on `Input`, `SelectTrigger`,
  `SelectContent`, `DropdownMenuContent`, `DialogContent`,
  `AlertDialogContent`, `TabsList` and `TabsTrigger` were dropped. Native
  `<select>`s use the Suite input styling (`border-pl-border-strong`,
  `bg-pl-surface`, focus ring). Destructive actions use the danger roles.
- Status words sit on the status roles: residency, session, certificate,
  feature flag and health states. The audit table now prints Success or
  Failure next to its icon. Role and action pills are tints of accent,
  primary, info, warning and danger, each with its word.
- Lime toast overrides (`className: 'bg-[#BFFF00] ...'`) were removed; the
  toaster's own themed default shows them.
- Empty cells show `n/a`.
- The user directory, audit logs, super admins and system settings gain the
  pilot's page padding (`px-4 py-8 md:px-8`), which they never had.
- Tests: one theme test per screen in `src/pages/__tests__/` on a shared
  harness (`admin2bHarness.jsx`, `admin2bStubs.js` with a local Supabase
  fake that answers the two table reads and throws on anything else).

## 4. The course reader and the handbook (batch 1C)

Registered in `src/design/rollout/w1c.js`: `/dashboard/apps/:slug/course/*`
(course home, module, lesson, module quiz, final exam and the capstone
redirect) and `/dashboard/admin/handbook`.

| piece | file | inside the scope |
|---|---|---|
| course home, module, lesson, module quiz, final exam | `pages/course/*.jsx` | roles only; actions are the themed `Button` (primary), module and lesson icons gold (`accent-text`), passed and read marks on `success-text` with the word beside them |
| lesson renderer | `components/course/MarkdownLesson.jsx` | headings and body on `text`, links on `primary-text`, callouts, code and tables on `sunken` with `border` hairlines; a panel slot and its loader on `sunken` |
| handbook frame | `pages/AdminCourseHandbookPage.jsx` | toolbar, course tabs, loader, error and locked states on roles |
| handbook document | the `#handbook-doc` element | a printable document: `data-canvas="document"` pinned to the light roles (`data-pl-theme="light"`) on the white chart surface, so it reads as the printed page in both themes. The print stylesheet and the HTML download are unchanged |

Both users of `MarkdownLesson` (the reader and the handbook) are in 1C, so
it moved straight to roles with no legacy branch.

### The reader-only teaching panels

Twenty-three geoscience panels are imported by no learning page, only by
the panel registry, so the reader is their one screen (the rollout plan
counts them in the lesson reader's own files): mapping (map, isochore,
validation, with `gridPlot` and the mapping case inputs), basin (burial
and heat, kinetics, charge), earth model (framework, tie, population), pore
pressure (frame, Eaton, window), rock physics (fluid, substitution, AVO),
reservoircalc (volume, block, property), seismolord (synthetic, shift,
wedge) and well correlation (flatten, prediction). They are on roles, and
every plot sits in `SvgChartFrame` (the Recharts pair in the synthetic
explorer in `ChartFrame`).

Colours come from `components/course/panels/readerChart.js`, which takes
the chart kit's values (`utils/chartSvg.js`) and adds only the hues a
lesson names: the lessons read "the white path", "each orange dot", "the
pink dashed line" and "a hollow lime circle", and teaching content is not
changed by the rollout. A light mark (the white well path and dots, the
lime P-1 circle) is drawn over an ink casing so it reads on white. The
well correlation case inputs are shared with that course's learning page
(batch 3A) and are scope-aware.

Every other course's panels still render their own legacy classes and dark
plates inside the reader until their course app batch migrates them; the
panelKit atoms around them are already on roles (1B).

### Tests

- `src/pages/course/__tests__/CourseReader.theme.test.jsx`: every reader
  page mounted as its route mounts it, with the standard four checks; the
  lesson with an embedded panel in dark, its plots in chart frames with the
  chart mark and no lime; a locked module; the capstone redirect route
  registered; an unregistered route left legacy.
- `CourseHandbook.theme.test.jsx`: the frame, the document body light in
  the dark theme, the print stylesheet kept, the locked state for a learner.
- `ReaderPanels.theme.test.jsx`: each reader-only panel in both themes
  (roles outside the plots, every plot in a chart frame, lime only on the
  P-1 circle), the correlation case inputs byte for byte outside a scope.
- `readerHarness.jsx` mounts a route inside `Layout`; `offlineSupabase.js`
  is the offline client the tests mock in.

## 5. Batch 2A: learner and account pages (as built)

As built: enroll, get started, devices, the prerequisite waiver exam, my
certificates, settings, notifications and the sponsor console
(`src/design/rollout/w2a.js`) render on theme roles. Every file they own
(the notification center, item and preferences, `SponsorProgressPanel`,
`useUserSettings`) is used by these screens only, so it moved straight to
roles with no legacy branch.

- **A certificate is a document.** `AcademyCertificatesPage` mounts
  `CertificateView` through a portal into `document.body`, inside a
  `data-canvas="document"` region and a `ThemeContext` of `null`. The
  viewer is then outside every scope: it renders its pre-rollout markup,
  colours and A4 print sheet byte for byte, and the ui `Button` in its
  toolbar takes its legacy look. Use the same pattern for any other page
  that must show legacy artwork from inside a scope.
- **Native selects** take `THEMED_INPUT` from `components/ui/input.jsx`,
  the Suite input styling.
- **Choice buttons** (tier picker, assessment answers, pool cards, the
  stored interface preference) carry `aria-pressed` and mark the chosen
  one with the primary role.
- **Toasts** lost their lime and emerald `className`: the root toaster
  themes them.
- **Tests:** `src/pages/__tests__/LearnerPages.theme.test.jsx` and
  `AccountPages.theme.test.jsx` (harness `learnerAccountHarness.jsx`,
  Supabase replaced by the 1A `frameStubs.js` stub, `fetch` counted and
  asserted unused).

## 6. Batch 3A: geoscience I course apps (as built)

Petrophysics, Well Data, Well Correlation, Seismolord and Mapping
(`/dashboard/apps/<slug>`, exact paths) are on the roles and registered in
`src/design/rollout/w3a.js`.

- The five learning pages, `petrophysics/WellPicker` and the panels the
  pages render (porosity lab, Pickett explorer, shaly-sand lab, Rw
  triangulator, LAS inspector, import and campaign explorers with
  `UserLasPicker`, the well correlation section explorer) moved straight to
  roles: their only other screen is the course reader, themed by 1C. The
  reader-only panels (flatten, prediction, seismolord, mapping) and the
  correlation case inputs are 1C's and were left as 1C built them.
- Lime buttons became the default `Button`; tier and file toggles use
  `primary` for the active one; the Learning Mode pill is an accent (gold)
  tint; certificate numbers and the award icon are `accent-text`; pass and
  fail boxes are the success and danger roles with their words; the
  capstone toasts use the success roles. On the panels a dead curve is
  `danger-text`, a non-uniform step and a missing pick `warning-text`.
- Charts: Recharts in `ChartFrame` (`GRID_STYLE`, `AXIS_TICK`,
  `TOOLTIP_STYLE`), the Mapping page structure map and the section explorer
  in `SvgChartFrame`; series by `seriesColor(n)` from the old-dark-chart map
  (pink to `seriesColor(4)`). The Mapping page contours keep their hue ramp
  at a darker lightness so they read on white.
- Copy that named a chart colour follows the new colours (Petrophysics and
  porosity lab shading, the Pickett water line). Lines touched follow the
  copy rule; the Petrophysics net-pay empty cells show `n/a`.
- Tests: `src/pages/__tests__/Geoscience3A.theme.test.jsx` (harness
  `geo3aHarness.jsx` with `HelmetProvider` and the toaster, stubs
  `geo3aStubs.js` on top of `frameStubs.js`) walks each app through its
  three tiers, both capstone outcomes, the Learning Mode gate and dark;
  `panels/__tests__/geo3aPanelsTheme.test.jsx` renders every page panel
  scene inside a scope in light and dark.

## Batch 3B: geoscience II course apps (as built)

Reservoir volumetrics (`/dashboard/apps/reservoircalc`), rock physics
(`/dashboard/apps/rockphysics`), pore pressure (`/dashboard/apps/porepressure`),
earth modeling (`/dashboard/apps/earthmodel`) and basin and charge
(`/dashboard/apps/basin`) are on the roles and registered in
`src/design/rollout/w3b.js`.

- Each learning page is the only file with colour its app owns; the course
  panels these apps teach with are reader-only and were moved by 1C. No
  shared file changed.
- The page recipe is 3A's: cards on `surface`, tiles and lessons on `sunken`,
  option and tier buttons primary when chosen, capstone results on the
  success and danger roles with their words, certificate number and award
  icon gold, lime toasts on the success roles, empty values `n/a`.
- The nine hand-drawn plots are in `SvgChartFrame` (`minWidth` 420,
  `maxWidth` 720) with kit colours: axes `AXIS_LINE_PROPS`, ticks
  `SVG_CHART.tick`, labels `SVG_CHART.label` and `note`. Old sky goes to
  `seriesColor(0)`, green to `(1)`, orange to `(2)`, the lime ramp and the
  violet layer to `(4)`; yellow guide lines (ramp top, conductivity
  interface) take `REFERENCE_LINE_PROPS`; the fault polygon is an ink dashed
  line; well posts are white markers. The oil and thickness maps keep their
  green cells ("Green cells hold oil; darker means a thicker column") on
  `seriesColor(1)`.
- The earth model well-tie table marked the worst tie by colour alone; it
  now also prints "largest tie" beside that residual.
- Tests: `src/pages/__tests__/Geoscience3B.theme.test.jsx` on
  `geo3bHarness.jsx` and `geo3bStubs.js` (the four standard checks per app,
  every tier with both capstone outcomes, the Learning Mode gate, dark, every
  plot in a chart frame with the chart mark, none of the old plate colours).

## 6. Batch 2C: admin II (as built)

Live monitoring (`/dashboard/admin/monitoring`), admin roles
(`/dashboard/admin/admin-mgmt`), system analytics
(`/dashboard/admin/analytics`), analytics and reporting
(`/dashboard/analytics`, with `AnalyticsDashboard` and `AnalyticsReports`),
the compliance centre (`/dashboard/compliance`, with `ComplianceDashboard`,
`AuditLogViewer` and `RetentionPolicies`) and compliance reports
(`/dashboard/reports`, with the `components/reports/*` panels, report views
and schedule dialog) are on the roles and registered in
`src/design/rollout/w2c.js`.

- Every file these screens own is used by 2C screens alone, so each moved
  straight to roles with no legacy branch. That includes
  `charts/DashboardWidgets` (admin roles, `/dashboard/analytics`,
  `/dashboard/compliance`) and `charts/ActionsTrendChart` (system
  analytics).
- Charts: the widgets and every chart on these screens use the 1B chart
  kit: a `ChartPanel` card with a `ChartFrame` (white plate, Petrolord mark),
  `GRID_STYLE`, `AXIS_TICK`, `PINNED_TOOLTIP_PROPS`, `LEGEND_PROPS`, and
  series colours from `seriesColor(n)`. The two pie charts without a legend
  gained one, so each colour has its name.
- `KPICard` takes `tone` (`primary`, `accent`, `info`, `success`, `warning`,
  `danger`, `neutral`) for its icon chip in place of a colour class. A
  status tone sits only on a card whose title or subtext says the status.
  The trend arrow carries a hidden up or down word.
- Lime is gone: actions are the default (petrol green) `Button`, heading
  icons gold (`accent`), and the per-page overrides on `Input`,
  `SelectTrigger`, `SelectContent`, `DialogContent`, `TabsList` and
  `TabsTrigger` were dropped. Status words sit on the status roles: event
  and audit outcomes (the live feed now prints Success or Failure next to
  its icon), severity (critical solid danger, high danger tint, medium
  warning), report detail status and system health.
- Empty cells show `n/a` (actor role and resource in the live feed, report
  detail cells, summary cards, KPI values, the report author).
- All six screens use the pilot's page padding (`px-4 py-8 md:px-8`). KPI
  grids go two across on phones; the eight report type tabs sit in a
  four-column grid (they overlapped at desktop width in eight).
- Tests: one theme test per screen in `src/pages/__tests__/` on
  `admin2cHarness.jsx` and `admin2cStubs.js` (a local Supabase fake that
  answers the admin list and the audit feed and throws on anything else).
  The harness mounts each page straight in `Layout`: DashboardPage is only
  a route table for the three admin pages, and importing it costs about
  85 s of collection per file.

## Batch 3C: reservoir course apps (as built)

- Routes (`rollout/w3c.js`): `/dashboard/apps/` `dca`, `mbal`, `scal`,
  `waterflood`, `sim`, `fluid` and `welltest`, exact. Their course reader
  pages stay on 1C's pattern entry.
- The seven learning pages are fully owned and on roles: lime is gone
  (primary for the tier toggle and the submit button, gold accent for the
  Learning Mode pill and the certificate number, the success and danger
  roles with their words for the grading result).
- The 21 panels under `components/course/panels/{dca,mbal,scal,waterflood,sim,fluid,welltest}`
  are scope-aware with `useThemeClass`: the batch started while the reader
  and the handbook (1C) were unmigrated, and they render these panels too.
  With 1C merged every screen that shows them is inside a scope, so the
  legacy branch is only reached outside any scope; wave 7 drops it. Outside
  a scope their classes match a fixture captured from main `1fbbedf34`
  before any change (`panels/__tests__/rc3cPanelsLegacy.test.jsx`, 71
  scenes); `rc3cPanelsTheme.test.jsx` walks the same scenes inside a scope.
- Every chart is on the kit in both places: 16 hand-made plots in
  `SvgChartFrame`, the two well test Recharts plots in `ChartFrame` with
  `GRID_STYLE`, `AXIS_TICK` and `TOOLTIP_STYLE`. Colours follow the map in
  section 1, with these choices: an oil and water rate pair uses
  `getStreamPalette`; a guide, a target band or an excluded point uses
  `SVG_CHART.reference`; where a lesson already named a colour (the SCAL
  "blue water curve" and "red oil curve", the DCA "blue points") the series
  keeps that name.
- Lessons that named a retired chart colour (lime, cyan, pink, orange,
  yellow) in the DCA, MBAL and waterflood courses now name the new colour.
  Only the colour word changed.

## 7. Batch 3D: drilling I course apps (as built)

Well design (`/dashboard/apps/welldesign`), torque and drag
(`/dashboard/apps/torquedrag`), hydraulics (`/dashboard/apps/hydraulics`),
well control (`/dashboard/apps/wellcontrol`), geomechanics
(`/dashboard/apps/geomech`) and casing and tubing
(`/dashboard/apps/casingtubing`) are on the roles and registered in
`src/design/rollout/w3d.js`.

- The eighteen panels (and the hydraulics `MudBoxes`) are used by their
  learning page, the lesson reader and the handbook. The reader and handbook
  are 1C's and already inside a scope, so the panels moved straight to roles
  with no legacy branch. No file is shared with 3E.
- The page recipe is 3A and 3B's: cards on `surface`, lessons and the locked
  capstone note on `sunken`, the tier buttons primary when chosen (with
  `aria-pressed`), capstone results and toasts on the success and danger
  roles with their words, certificate number and award icon gold.
- Every chart is Recharts in `ChartFrame` (the white plate with the chart
  mark): `GRID_STYLE`, `AXIS_TICK`, `TOOLTIP_STYLE`, axis titles on
  `SVG_CHART.note`. Lime goes to `seriesColor(0)`, sky to `(1)` (or `(0)` in
  the surge chart, which had no lime), amber to `(2)`, red and rose to
  `(3)`; the white overburden and north traces are ink (`SVG_CHART.label`);
  slate guides and the pore pressure trace take `SVG_CHART.reference`. No
  lesson names a chart colour. The rheology table's "Green is an exact
  reproduction" keeps green on the success text role.
- Table status colours take the status roles (PASS, WARNING, FAIL; none,
  sinusoidal, helical), each beside its word. Empty values are `n/a`.
- The mud window explorer's EMW axis now rounds its ticks: the fracture
  curve runs past the fixed domain and the stretched ticks were clipped.
- Tests: `src/pages/__tests__/DrillingApps3D.theme.test.jsx` (the four
  standard checks per app, every tier in both themes, capstone pass, fail
  and locked, the Learning Mode gate) and
  `src/components/course/panels/__tests__/DrillingPanels3D.theme.test.jsx`
  (every view of every panel in both themes, every plot on the white plate
  with the mark, every series in a kit colour with a negative control, and a
  source scan for legacy classes and retired chart colours in every branch).

## 8. Batch 4A: production I course apps (as built)

Nodal analysis (`/dashboard/apps/nodal`), gas lift (`/dashboard/apps/gaslift`)
and ESP (`/dashboard/apps/esp`) are on the roles and registered in
`src/design/rollout/w4a.js`. Their course reader pages stay on 1C's pattern
entry.

- The nine panels (`panels/{nodal,gaslift,esp}/*Explorer.jsx`) and the gas
  lift `TypedDesignFields` are used by their learning page, the lesson reader
  and the handbook, all inside a scope, so they moved straight to roles with
  no legacy branch. No file is shared with 4B or 4C. The port catalogue field
  takes `THEMED_INPUT`.
- The page recipe is 3A's: cards on `surface`, lessons and the locked
  capstone note on `sunken`, the tier buttons primary when chosen, capstone
  results and toasts on the success and danger roles with their words,
  certificate number and award icon gold, the Learning Mode pill a gold tint.
- Every chart is Recharts in `ChartFrame` (white plate, chart mark):
  `GRID_STYLE`, `AXIS_TICK`, `TOOLTIP_STYLE`, axis titles and notes on
  `SVG_CHART.note`, guides on `SVG_CHART.reference`, the old near-white
  reference lines in ink (`SVG_CHART.label`), point outlines white. The
  colour map keeps each hue the panel copy already names: sky to
  `seriesColor(0)` (blue), lime to `(1)` (green; the node explorer already
  called its lime inflow "the green curve"), orange to `(2)`, red and rose
  to `(3)`, pink to `(4)`. Charts with a legend take `LEGEND_PROPS` and
  `XAXIS_LABEL_HEIGHT`, so the axis title no longer sits under the legend.
- Table text keyed to a series takes the nearest role: lime values
  `primary-text`, sky `info-text`, orange `warning-text`, pink `accent-text`.
  Status rows (DEAD scans, unstable crossings, failed drops) are on the
  status roles beside their words. Empty values are `n/a`.
- Lesson colour words that named a retired colour now name the new one:
  orange to amber (VLP, node and lift explorers), lime to green (lift and
  power explorers), pink to gold for the valve explorer's dome columns.
- Tests: `src/pages/__tests__/Production4A.theme.test.jsx` (harness
  `prod4aHarness.jsx`, stubs `prod4aStubs.js`: the four standard checks per
  app, every tier with both capstone outcomes, the gold certificate number,
  the Learning Mode gate, dark) and
  `src/components/course/panels/__tests__/prod4aPanelsTheme.test.jsx` (every
  view of every panel in both themes, every chart frame white with the mark,
  a status row check, and a source scan for retired colours and bare
  `ResponsiveContainer`s).

## 9. Batch 3E: drilling II course apps (as built)

- Routes (`rollout/w3e.js`): `/dashboard/apps/` `cementing`, `completion`,
  `perfsand`, `stimulation`, `integrity` and `wellcost`, exact. Their course
  reader pages stay on 1C's pattern entry.
- The six learning pages follow the 3B and 3D page recipe: roles only,
  primary tier toggle with `aria-pressed`, gold accent for the Learning
  Mode pill and the certificate number, success and danger roles with their
  words for the grading result, the success toasts on the root toaster.
- The eighteen panels under
  `components/course/panels/{cementing,completion,perfsand,stimulation,integrity,wellcost}`
  moved straight to roles with no legacy branch: their only hosts are the
  learning pages, the lesson reader and the handbook, and all three are
  themed routes now (the page test asserts it).
- Every chart is Recharts, now in `ChartFrame` with `GRID_STYLE`,
  `AXIS_TICK`, `TOOLTIP_STYLE` and `LEGEND_PROPS`. Series colours: lime to
  `seriesColor(1)` (green) and sky to `seriesColor(0)` (blue), because the
  panel notes already call those lines "the green curve", "the green bars",
  "the BLUE line" and "the blue bars"; pink and the old violet to
  `seriesColor(4)`, rose to `(3)`, amber to `(2)`; grey context lines (ECD
  at the shoe, inclination, own bore, critical flowing pressure) to
  `SVG_CHART.reference`.
- Tables: pass, fail, yes, no, the element and envelope states and the
  clearance status sit on the status roles; number columns that were only
  tinted to echo a chart line are plain text; a highlighted row (the
  governing candidate, the chosen fraction, drill activities, provisions)
  is gold (`accent-text`, semibold). The AFE basis word keeps its chart
  colour as a swatch dot beside the word.
- The integrity traffic light keeps its four category words: green on
  success, yellow on warning, orange on the danger tint and red on solid
  danger (the 2C severity ladder).
- The skin table's out-of-range rpD now prints "out of range" beside the
  warning colour. Touched empty cells show `n/a`.
- No lesson in these six courses names a chart colour. Five panel notes did
  (frac, time, AFE); they now say violet, blue and gold, in their own commit.
- Screen fixes: legends no longer sit on the X axis titles, the time
  explorer's flat footage axis prints whole metres, and input rows of three
  to five boxes go two across on phones.
- Tests: `src/pages/__tests__/DrillingApps3E.theme.test.jsx` (the four
  standard checks per page, every tier in both themes, capstone pass, fail
  and locked, the Learning Mode gate, no network) and
  `src/components/course/panels/__tests__/DrillingPanels3E.theme.test.jsx`
  (every view of every panel in both themes, plots on the white plate with
  the mark, series in kit colours, a source scan with negative controls).

## 10. Batch 4B: production II course apps (as built)

Rod pump (`/dashboard/apps/rodpump`), gas well
(`/dashboard/apps/gaswell`) and flow assurance
(`/dashboard/apps/flowassurance`) are on the roles and registered in
`src/design/rollout/w4b.js`.

- The nine panels (string, card and balance explorers with
  `TypedWellFields`; droplet, profile and remedy explorers; thermal, line and
  hydrate explorers) are used by their learning page and by the course
  reader and handbook, which 1C already themes, so they moved straight to
  roles with no legacy branch. No file is shared with 4A or 4C.
- The page recipe is 3C's: cards on `surface`, lessons and the locked
  capstone note on `sunken`, the tier buttons primary when chosen, capstone
  results and toasts on the success and danger roles with their words,
  certificate number and award icon gold. The March this well button is the
  primary action; the typed unit designation takes the Suite input styling.
- Every chart (43 Recharts plots) is in `ChartFrame`: `GRID_STYLE`,
  `AXIS_TICK`, `TOOLTIP_STYLE`, `LEGEND_PROPS`, axis titles on
  `SVG_CHART.label`. Lime goes to `seriesColor(0)`, sky to `(1)`, orange to
  `(2)`, the pink guide lines to `(4)`; slate guides and the heat-loss-only
  trace take `SVG_CHART.reference`.
- Table highlights echo their chart series: a lime column is now
  `info-text` (blue, like `seriesColor(0)`), a sky column `primary-text`
  (green, like `(1)`), an orange column `accent-text`. A flagged row (loaded,
  not periodic, overstressed, opposite signs, inside the hydrate region,
  refused) and "Inputs changed since the last march" are `warning-text`,
  each beside its word. The balance explorer's "the rows above in orange" now
  reads "in amber". No lesson names a chart colour.
- Tests: `src/pages/apps/__tests__/Production4B.theme.test.jsx` (harness
  `prod4bHarness.jsx`: the four standard checks per app, every tier in both
  themes with the charts on the white plate and the mark, capstone pass and
  fail, the Learning Mode gate) and
  `src/components/course/panels/__tests__/prod4bPanelsTheme.test.jsx`
  (scenes in `prod4bScenes.jsx`: every view of every panel in light and
  dark, no retired chart colour, a flagged row on the warning role with its
  words, the primary march button).

## 11. Batch 4C: production III course apps (as built)

Production networks (`/dashboard/apps/network`), well intervention
(`/dashboard/apps/intervention`) and production surveillance
(`/dashboard/apps/surveillance`) are on the roles and registered in
`src/design/rollout/w4c.js`.

- The nine panels (and the network course's `TypedNetworkFields`) are used
  by their learning page, the lesson reader and the handbook, which 1C
  already themes, so they moved straight to roles with no legacy branch. No
  file is shared with 4A or 4B.
- The page recipe is 3D's: cards on `surface`, lessons and the locked
  capstone note on `sunken`, tier buttons primary when chosen (with
  `aria-pressed`), capstone results and toasts on the success and danger
  roles with their words, certificate number and award icon gold. The typed
  network text field takes `THEMED_INPUT`.
- Every chart (31, all Recharts) is in `ChartFrame` with `GRID_STYLE`,
  `AXIS_TICK`, `TOOLTIP_STYLE`, axis titles on `SVG_CHART.note` and
  `LEGEND_PROPS`; a labelled x-axis takes `XAXIS_LABEL_HEIGHT` (the
  titles sat on the legend before). Lime goes to `seriesColor(0)`, sky to
  `(1)` (or `(0)` where no lime was drawn), orange series and thresholds to
  `(2)`, pink to `(4)`; the grey "whole history" and "ratio slope" traces
  and the unity line take `SVG_CHART.note` and `reference`. Two charts
  follow meaning: the surveillance allocation factors use
  `getStreamPalette` for oil, water and gas (their 0.7 and 1.3 bands move
  to `reference`), and the exception severity bars read high red, medium
  amber, info blue, with the high rows of the severity tables on
  `danger-text`.
- The intervention producing-time axes are log scale and printed ticks
  with fifteen decimals; they now round to one.
- Table highlights that were lime, orange and sky take `primary-text`,
  `warning-text` and `info-text`; each flag sits on its own word or value.
  Empty values are `n/a`.
- No lesson in these three courses names a chart colour, so no lesson
  text changed.
- Tests: `src/pages/__tests__/Production4C.theme.test.jsx` (the four
  standard checks per app, every tier in both themes with no lime left,
  capstone pass, fail and locked, the Learning Mode gate) and
  `src/components/course/panels/__tests__/Production4CPanels.theme.test.jsx`
  (every view and sub-view of every panel in both themes, every plot on the
  white plate with the mark, every series in a kit colour, and a source
  scan with a negative control).

## 12. Batch 4D: economics course apps (as built)

Cash flow and NPV (`/dashboard/apps/cashflow`), fiscal regime design
(`/dashboard/apps/fiscal`), probabilistic economics
(`/dashboard/apps/uncertainty`), decision analysis
(`/dashboard/apps/decision`), capital portfolio (`/dashboard/apps/portfolio`)
and field development planning (`/dashboard/apps/fdp`) are on the roles and
registered in `src/design/rollout/w4d.js`.

- The eighteen panels, with the fiscal `FiscalDefinitions` list and the
  decision `decisionKit` atoms, are used by their learning page, the lesson
  reader and the handbook, which 1C already themes, so they moved straight to
  roles with no legacy branch. No file is shared with another batch. The
  economics labs (`*Lab.js`) and the vendored engines are untouched: every
  value, label and interaction is as before.
- The page recipe is 4C's: cards on `surface`, lessons and the locked
  capstone note on `sunken`, tier buttons primary when chosen (with
  `aria-pressed`), capstone results and toasts on the success and danger
  roles with their words, certificate number and award icon gold.
- Every chart (42, all Recharts) is in `ChartFrame` with `GRID_STYLE`,
  `AXIS_TICK`, `TOOLTIP_STYLE`, axis titles on `SVG_CHART.note` and
  `LEGEND_PROPS`; a labelled x-axis takes `XAXIS_LABEL_HEIGHT`. Lime goes to
  `seriesColor(0)`, sky and emerald to `(1)`, orange and yellow to `(2)`,
  red to `(3)` (the cash flow course's "red point" stays red), pink and
  violet to `(4)`; the six-series basis chart and fiscal comparison take the
  five kit colours in order and the ink note for the sixth. Slate guides take
  `SVG_CHART.reference`, the old slate-600 bars (low case, minus 30 percent,
  float) `SVG_CHART.note`, and hollow dots a white fill.
- The uncertainty run buttons are the primary action. Outcome P-labels and a
  highlighted row or as-of date are gold (`accent-text`); an NPV input label
  and the definition terms are `primary-text`. Flags and refusals sit on the
  warning and danger roles beside their words.
- Empty values on the pages print `n/a`. The panels' `null`, `withheld` and
  `-` readings are the engine's own answers that the lessons teach, so they
  are unchanged.
- No lesson in these six courses names a chart colour, so no lesson text
  changed.
- Screen fixes: three net cash flow bar charts coloured each bar and gave
  the bar series no fill, so the legend swatch printed black; it now shows
  the positive-year colour. The fiscal royalty threshold tooltip printed a
  raw float price and now uses the panel's six-decimal format.
- Tests: `src/pages/__tests__/Economics4D.theme.test.jsx` (the four standard
  checks per app, every tier in both themes with no lime left and the charts
  on the white plate, capstone pass, fail and locked, the Learning Mode gate,
  no network) and
  `src/components/course/panels/__tests__/Economics4DPanels.theme.test.jsx`
  (every view and sub-view of every panel in both themes, every plot on the
  white plate with the mark, every series in a kit colour, and a source scan
  with a negative control).

## 13. Batch 5A: facilities I course apps (as built)

Separation (`/dashboard/apps/separation`), line sizing
(`/dashboard/apps/linesizing`), rotating equipment
(`/dashboard/apps/rotating`), gas processing (`/dashboard/apps/gasprocessing`)
and relief (`/dashboard/apps/relief`) are on the roles and registered in
`src/design/rollout/w5a.js`. Their course reader pages stay on 1C's pattern
entry.

- The fifteen panels under
  `components/course/panels/{separation,linesizing,rotating,gasprocessing,relief}`
  are used by their learning page, the lesson reader and the handbook, all
  inside a scope, so they moved straight to roles with no legacy branch. No
  file is shared with 5B.
- The page recipe is 4C's: cards on `surface`, lessons and the locked
  capstone note on `sunken`, tier buttons primary when chosen (with
  `aria-pressed`), capstone results and toasts on the success and danger
  roles with their words, certificate number and award icon gold.
- The panels' labelled boxes take the status roles with their headings:
  HELD FOR LITERATURE and the other held items on `warning`, the engine's
  refusals on `danger`, the engine's explanations (and "the holdup is an
  input") on `info`. Explanation cards are on `sunken`.
- Every chart (62, all Recharts) is in `ChartFrame` with `GRID_STYLE`,
  `AXIS_TICK`, `TOOLTIP_STYLE` and `LEGEND_PROPS`; a labelled x-axis takes
  `XAXIS_LABEL_HEIGHT`, and axis titles sit on `SVG_CHART.note`. The colour
  map keeps each hue the panel notes already name: sky to `seriesColor(0)`
  (blue), lime to `(1)` (green), amber to `(2)`, red and rose to `(3)`, pink
  and violet to `(4)`; the grey series and guides take
  `SVG_CHART.reference` and the old near-white orifice area trace is ink
  (`SVG_CHART.label`). The absorber's seven absorption factor curves take
  the five kit colours, then ink and the slate note, so no two share a
  colour.
- No lesson in these five courses names a chart colour. Three panel notes
  named the pink line (pump and blowdown explorers); they now say violet,
  in their own commit. The blue and green lines other notes name keep
  their hues.
- Tests: `src/pages/__tests__/Facilities5A.theme.test.jsx` (the four
  standard checks per app, every tier in both themes with no lime left and
  the plots on the white plate, capstone pass, fail and locked, the
  Learning Mode gate, no network) and
  `src/components/course/panels/__tests__/Facilities5APanels.theme.test.jsx`
  (every view and sub-view of every panel in both themes, every plot on the
  white plate with the mark, every series in a kit colour, and a source
  scan with a negative control).

## 14. Batch 6B: public and auth pages (as built)

Login (`/login`), register (`/register`), certificate verify (`/verify`,
`/verify/:code`), forgot password (`/forgot-password`), reset password
(`/reset-password`), the three legal pages (`/privacy-policy`,
`/terms-of-service`, `/academic-integrity`) and the 404 page render on the
public frame, always light, with no toggle.

- **The frame** is `src/components/public/PublicPage.jsx`, a port of the
  Suite's W7C frame by way of the HSE port: `PublicPage` (a `ThemedApp`
  keyed to the anonymous user, so a learner whose own choice is dark still
  sees these pages light), `PublicBrandBar` (an ink strip, a fixed dark
  scope like the rail), `PublicScope`, and the shared class strings
  (`AUTH_CARD`, `AUTH_TITLE`, `AUTH_COLUMN`, `AUTH_ICON_TILE`, `TEXT_LINK`,
  `FIELD_LABEL`, `FIELD_ERROR`). NextGen has no wordmark image, so the bar
  carries the crest (`/favicon.png` in a gold ring) and the name set as the
  regal homepage sets it. `header` replaces the bar, `footer` adds one.
- **Routes** are listed in `PUBLIC_LIGHT_ROUTES` in
  `src/design/scopePaths.jsx` (the plan assigns that list to 6B; there is no
  `rollout/w6b.js`). Their cold-load loader paints light whatever the device
  last resolved. The 404 page uses the frame, but an unknown path cannot be
  listed, so its loader stays the legacy one. The regal homepage is
  unlisted and untouched.
- **Look only.** No handler, payload, redirect or validation rule changed.
  `src/pages/__tests__/PublicAuth.flows.test.jsx` was written against the
  legacy pages, committed first, and passes unchanged after the restyle. It
  pins `signInWithPassword({ email, password })`, `signUp` (email, password
  and `options.data.display_name` only: no redirect and no role from the
  client, as the one identity doctrine requires), `resetPasswordForEmail`
  with its `/reset-password` redirect, `updateUser({ password })`, the
  `reset-password` edge function (`check`, then `reset` with the token and
  `new_password`) and the `academy_verify_certificate` RPC for the path
  code, the `?code` query and a typed code, plus where each flow navigates.
  NextGen has no auth callback, invite, sponsor code or bridge code page
  outside the dashboard: those flows are on `/dashboard/enroll` and
  `/dashboard/certificates` (batch 2A).
- **Lime is gone.** Actions are the primary button, links are `TEXT_LINK`,
  the step bar and the policy section markers are gold. Status colour
  comes with its word: the verify result says Valid certificate,
  Certificate expired or Certificate revoked on the success, warning and
  danger roles; the two strength meters keep their percentage and their
  Weak, Medium, Strong words; each password requirement also reads "met"
  or "not met" to a screen reader. Toasts lost their lime, blue and
  emerald `className`: the root toaster themes them.
- **The verify page** shows a result card, and no certificate sheet, so
  there is no `data-canvas="document"` region on it. The practice course
  badge takes its scope-aware look there.
- **The legal kit** (`LegalPageLayout`, `PolicySection`, `Footer`) is used
  by the three legal pages only (the homepage has its own `HomeFooter`), so
  it moved straight to roles. The print and contents buttons sit in the
  brand bar; the footer is an ink strip (a fixed dark scope). The documents
  keep their `print:` variants, which the theme test allows by name. The
  `prose` classes were dropped: the typography plugin is not installed, so
  they never applied.
- **Copy.** One em dash left the register page intro (the family copy
  rule). Nothing else was reworded.
- **Tests:** `PublicAuth.flows.test.jsx` (29 behaviour pins) and
  `PublicAuth.theme.test.jsx` (per page: light in its own scope under the
  brand bar, no toggle, light when the stored choice is dark, no legacy
  chrome with a negative control, the loader theme; then every further
  state, a source scan with a negative control, and the homepage left
  alone). Harness `publicAuthHarness.jsx` mounts the real `AuthProvider`
  over `publicAuthStubs.js`, a Supabase stand-in that throws on any call
  the pages do not make; `fetch` is counted and asserted unused.
