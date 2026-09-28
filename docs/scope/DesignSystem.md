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
