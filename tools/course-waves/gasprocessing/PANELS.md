# FC4 PANELS TASK. Three panels over one teaching lab.

## REPAIR HISTORY: FRAMED IS CURRICULUM, UNFRAMED IS A DEFECT.

**You may teach what this engine used to do. You must say that is what you
are doing.** An academy-wide sweep settled this: six live Economics courses
teach repair history deliberately, one of them in a module directory named
for it and a lesson titled "What was repaired and what was not", with 29
graded items on the subject. FC1's own sweep found 27 history-shaped
sentences and every one was framed and none was a defect. **Every real defect
this class has produced was UNFRAMED.**

So the rule is not "no history". The rule is:

- **A sentence about former behaviour that reads as current behaviour is a
  defect.** That is the whole of it.
- **Framing comes from the HEADING above a passage, or the line immediately
  before it.** An inline "HISTORY." prefix inside a sentence is not framing,
  and the gate does not read it as framing either. Put it in the heading, the
  way `Expert m05 l01` does.
- **Never repeat history you did not know was history.** That is what the
  three sources below are about.

## THE THREE PLACES HISTORY REACHES YOU, AND ONLY ONE IS FRAMED FOR YOU

The engine this course teaches has just been through a 49-finding repair.
That means three files near you are FULL of sentences describing what it used
to do, and **none of them is teaching truth**:

1. **`digest.txt` SECTION 20, which IS framed for you.** It is the one
   section of the digest whose subject is what this engine used to do, it
   says so in its title and its first line, and it is the only place you
   should be drawing history from. Four items, each a general lesson that
   happens to have an example here.
2. **`RECON.md` and `FINDINGS.md`.** Both open with a banner saying they are
   provenance. They describe the engine AS FOUND, in far more detail than
   Section 20, and **their numbers are stale**: fourteen of the eighteen
   graded capstone fields moved when the repair was vendored. Read them to
   understand the work. Do not take a figure from either.
3. **THE ENGINE SOURCE COMMENTS.** `engines/facilities/gasProcessing.js` is
   dense with them: "The 379.49 this file used to quote", "It used to carry
   two", "This function divided by one until FC4-0", "the march used to
   evaluate mu at each interval MIDPOINT PRESSURE but at the temperature it
   started with". **NOTHING GATES A WRITER READING ENGINE COMMENTS.** A
   sibling wave shipped three repair-history sentences into committed lesson
   text and the worst of the three came from an engine source comment.
   **Engine source comments are provenance.** Digest Section 20 counts them
   for you, by reading the source, and there are dozens across the vendored
   engines. A sibling course carries 12 history instances in its lesson text,
   5 of them H2 headings, traced to a changelog block in one engine file. The danger is
   not that the subject is forbidden. It is that **a sentence lifted out of a
   comment arrives with no frame around it**, and you cannot frame something
   you did not know was history. Before using any sentence you found in the
   source, establish whether it describes what the engine does now.
4. **Anything you remember from a briefing.** Including this one.

**`digest.txt` is the only teaching truth**, and Section 20 is the only part
of it that is history. It is swept by the kit's `digestprose.mjs` with this
wave's own claims, cleared phrases and 33 engine pins:

    node /root/dc-wavekit/digestprose.mjs \
      /root/fc-wip-gasprocessing/digest.txt \
      --rules /root/fc-wip-gasprocessing --lessons <your content dir>

**RUN IT OVER YOUR LESSONS, not only over the digest.** It sweeps lesson
headings as well as lesson prose, because one sibling leak was a lesson H2:
"One sentence used to answer several questions".

**Expect to TRIAGE rather than to get a clean binary.** The gate carries two
families. High-confidence keywords FAIL when unframed. Plain past-tense
narration WARNS, because no word list catches the worst instance this
programme has seen, which was "the object looked healthy, the coefficient was
right" with no trigger word in it. Read every warning against what the engine
does today, and either frame it or rewrite it.

This wave's own digest raises three warnings and all three are inside Section
20. They are re-read by hand on every rebuild rather than cleared, because
clearing them would make the one place carrying history the one place nobody
checks.

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

## WHERE THE DIGEST PRINTS A TABLE AND NO RATIO

The Associate writer found the right move here and it is now the house
pattern for this wave: **teach the DIRECTION the table shows, then tell the
learner not to form the ratio, and say why.**

The digest prints a ratio whenever it is entitled to one. Where it prints a
table and no ratio, that is not an oversight: it means the two figures are
not in a relationship this engine computes, and a learner who divides them
produces a number nothing stands behind. Saying so out loud turns the digest
rule into part of the curriculum rather than an invisible constraint on the
writer, and it teaches the more useful habit, which is asking whether a
quantity is entitled to be compared before comparing it.

## TOLERANCES HAVE ONE SOURCE AND THE LAB IS NOT IT

`fields.json` is the only place a graded tolerance is written down. It is
GENERATED by `make_fields.mjs` from `PRINTED_DECIMALS` in `fc4_capstone.mjs`,
where each tolerance is the stated one or half a unit in the last printed
place, whichever is LOOSER.

A sibling wave ended up with the same tolerance written in THREE places: the
generator, `fields.json`, and the lab's own copy that the panel test pinned
against. **The lab must READ `fields.json`, never restate a number from it.**
If a panel test needs a tolerance, import it; if that is awkward, say so and
the generator will export it in a shape you can use. Do not type it.

Three tolerances were widened because they were tighter than the precision
this course prints at, and a field graded tighter than it is printed is a
field nobody can answer. None of the eighteen VALUES moved when that
happened, and `make_fields.mjs` exits 1 if any field is graded tighter than
its class prints.

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
