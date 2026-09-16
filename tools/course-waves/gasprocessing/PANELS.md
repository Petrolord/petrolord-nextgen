# FC4 PANELS TASK. Three panels over one teaching lab.

## THE THREE PLACES REPAIR HISTORY LEAKS FROM. Read this before anything else.

The engine this course teaches has just been through a 49-finding repair.
That means three files near you are FULL of sentences describing what it used
to do, and **none of them is teaching truth**:

1. **`RECON.md` and `FINDINGS.md`.** Both open with a banner saying they are
   provenance. Do not take a number or a behaviour from either.
2. **THE ENGINE SOURCE COMMENTS.** `engines/facilities/gasProcessing.js` is
   dense with them: "The 379.49 this file used to quote", "It used to carry
   two", "This function divided by one until FC4-0", "the march used to
   evaluate mu at each interval MIDPOINT PRESSURE but at the temperature it
   started with". **NOTHING GATES A WRITER READING ENGINE COMMENTS.** A
   sibling wave shipped three repair-history sentences into committed lesson
   text and the worst of the three came from an engine source comment.
   **Engine source comments are provenance, not teaching truth.**
3. **Anything you remember from a briefing.** Including this one.

**`digest.txt` is the only teaching truth.** It is swept by
`digest_prose.mjs` for exactly this, so a forbidden sentence in the digest is
worse than the same sentence in a provenance file: two of the three sibling
leaks were not the writers' fault at all, because the writers took what the
digest said.

**AND IT IS NOT ONLY WHOLE SENTENCES.** One sibling leak was a lesson H2
HEADING, "One sentence used to answer several questions". Sweep your
headings, not only your prose. A keyword sweep will not catch the worst of
it either: the worst sibling instance was plain past tense with no trigger
word at all. Read your own past-tense sentences against what the engine does
TODAY.

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
contactor)

- the coefficient across pressure, with the derivative that produces it
  beside it, digest Section 14. Draw the derivative: it is the only term in
  the relation that carries any real-gas behaviour, and a reader who sees it
  understands why the coefficient does not vanish as the pressure falls;
- the heat capacity as a divisor, with the product of it and the coefficient
  shown flat, Section 14;
- the march, with the step count against the converged answer, Section 14.
  The default is twenty steps and the panel should let a learner see what
  that default is worth;
- the cold separator: the water the gas holds at the inlet, at the arrival,
  and at the two intermediate states that separate the cooling from the
  let-down. **That four-row table is the point of the panel**, because
  letting the gas down without cooling it would let it hold MORE water, and
  a learner who has not seen that believes expansion dries gas directly;
- the march's three coefficients, the inlet one, the last-step one and the
  mean, because the Suite prints an inlet coefficient beside an arrival
  temperature that twenty other coefficients produced.

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

Every export returns an object carrying an `error` string, and since FC4-0
there is no exception: `kremserFractionRemoved` returns `{ fractionRemoved }`
or `{ error }` like everything else. **One guard shape works everywhere**,
which is what makes a render gate cheap to write correctly.

Many refusals also carry EVIDENCE beside the message: the step a march died
at and the state it died in, the ceiling an absorption factor caps a removal
at, the reduced pressure and temperature a compressibility was refused at.
A panel that shows only the message throws that away.

## Hand back

The lab's exported values, the vitest count and which exports each test pins,
and the three registered ids.
