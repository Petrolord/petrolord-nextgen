# FC4 PANELS TASK. Three panels over one teaching lab.

## Shape

One lab, `src/components/course/panels/gasprocessing/gasprocessingLab.js`,
exporting the values three panels render. **Every exported value is pinned by
vitest** in `gasprocessingLab.test.js`, against the figures the digest
prints, so a panel and a lesson can never disagree.

Register the three ids in `src/content/courses/panelRegistry.js`, which today
carries three `fc-` facilities panels, all of them FC1's.

## The three

**`fc-water-explorer`** (Associate throughout, and Expert m04 for BTEX)

- the saturation surface across pressure and temperature, which is digest
  Section 3's table, with the vapour-pressure curve alongside it so a learner
  can see that the whole temperature dependence lives in one factor and the
  pressure dependence in the other;
- the outlet spec and the water load, Section 5;
- the circulation ratio sweep with the customary band marked at both edges,
  Section 6, showing the three things that move and do not move together;
- the duty split into its two named parts, Section 7;
- the BTEX chain, Section 13.

**`fc-absorber-explorer`** (Professional throughout)

- the Kremser surface in both directions, Section 9, **with the ceiling below
  unity drawn explicitly**, because the whole teaching point of the tier is
  that a factor below one caps the removal at the factor itself however many
  stages are bought;
- the amine property table and the three amines run at their own values,
  Sections 10 and 11;
- the loading swing at both ends, Section 10;
- the contactor, Section 12, **which cites `separation` for the equation and
  does not re-draw a K-value chart**, because that course owns it.

**`fc-coldend-explorer`** (Expert m01 to m03, Professional m05 for the
contactor) is **HELD**. Every value it would export reads the Joule-Thomson
chain, digest Section 14 is withheld, and there is nothing to pin a test
against. Register the id so the manifests validate; build the panel when
FC4-0 is vendored and Section 14 is rebuilt.

## Rules

- **Chart standard.** Every Suite and NextGen chart uses the white
  `chartTheme` with the `ChartLogo` watermark. No ad-hoc dark Recharts.
- **Forward `ResponsiveContainer` width and height** through any wrapper. A
  wrapper that swallows them renders a blank chart and has done so twice in
  this programme.
- **A render gate.** Thirty panels in the Drilling series crashed until one
  was added: a panel must render its empty state before any engine value
  exists, and must never index into a result that could be an error object.
- **Every number a panel displays comes from the lab**, and every lab export
  is pinned. A panel that formats its own arithmetic is a second source of
  truth.
- No em dashes and no "X, not Y" contrastives in any label, legend or caption.

## The engine's error contract, which the panels have to respect

Every export returns an object carrying an `error` string, **except
`kremserFractionRemoved`, which returns a bare number** and therefore returns
a non-number rather than an error. The absorber panel cannot guard it with
`if (r.error)` and must check the number is finite.

## Hand back

The lab's exported values, the vitest count and which exports each test pins,
the three registered ids, and confirmation that the cold end panel is
registered and unbuilt.
