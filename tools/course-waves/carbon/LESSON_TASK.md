# carbon LESSON TASK. Read every line before you write a word.

You are writing lessons for **`carbon`, "Carbon & Energy Efficiency"**, a
course in the NextGen `energy_transition` academy module (label "Energy
Transition"), path_order 52. The sibling course `gasvalue` ("Flare Gas to
Value & LPG/CNG", path_order 51) is being written beside you. Read "The seam
with gasvalue" before module one.

## The one sentence the course serves

**A tonne of CO2e is carbon counted atom by atom, weighted by a declared GWP
set and carried on a record that says where every factor came from, and a
tonne saved is priced over the life of the measure that saves it; the engines
refuse or name every box nobody filled (a destruction efficiency, a factor, a
safe oxygen floor, a discount rate) instead of reading it as the best case.**

## The one rule everything else serves

**`/root/et-wip-carbon/digest.txt` IS YOUR ONLY SOURCE OF NUMBERS, TABLE
ROWS, REFUSALS AND ENGINE SENTENCES.** Every figure you quote must appear in the
digest exactly as it prints there. You do not run the engine. You do not work
an efficiency, a cascade or a capital recovery factor out on paper to get a
figure the digest does not print. If something you want is not in the digest,
the lesson does not get it, and you say so in your hand back so the digest can
be extended rather than the lesson invented.

`RECON.md` in this directory, the engine source comments and
`packages/engines/tools/validation/downstream/FINDINGS-carbon.md` are
PROVENANCE. Read them to understand the work. Do not take a figure or a
sentence from any of them.

## THE GWP RULE. It binds every lesson that converts methane.

**The engine ships no global warming potential.** The digest prints four sets
(SECTION 6), each labelled with its IPCC report, the 100-year horizon and the
document the values were read from, and the course computes every inventory on
"IPCC AR6 GWP100, fossil methane". Name the set every time a lesson converts
methane to CO2e. Never write a GWP from memory, never quote a 20-year value,
and never say which report an operator should file on: that is held item H1,
taught as a stated limit (Associate m04 l05) and never as an answer.

## THE RATE RULE

**Every cost, saving, fuel price, emission factor, flow, temperature and
destruction efficiency in the digest is INVENTED for this course, and the
lesson must say so the first time it uses one.** The electricity factor and
the fuel emission factor are SYNTHETIC. Never write a published emission
factor, grid factor or carbon price, and never imply the invented ones are
current anywhere. Say "Igbogene's invented factor", never "the grid factor".

## History on this wave

This digest describes the engines as they are at f0aef14 (MD5-0). It carries NO
section about what the engine used to do. SECTION 25 states the rules MD5-0 put
in force, each in the present tense. Do not write "used to", "was changed",
"before the repair" or anything of that shape. If you want to say why a rule
exists, say what the rule prevents, in the present tense. SECTION 5 prints what
a flare read as 100 percent would report beside the flare at its stated
efficiency; teach that as the reason the box is required, and do not describe
any app as having done it.

    node /root/dc-wavekit/digestprose.mjs /root/et-wip-carbon/digest.txt \
      --rules /root/et-wip-carbon --lessons <your content dir>

Run it over your lessons as well as the digest.

## Shape

- 6 modules a tier, 26 lessons a tier, 78 in the course. `structure.py` is the
  authority for every key, title, order, estimated minute and panel tag.
- **420 to 560 PROSE WORDS**, with the per-lesson minimum from `structure.py`'s
  `MIN_WORDS`: 420 for a twelve minute lesson, 470 for thirteen, 510 for
  fourteen. Front matter, table rows, headings and `{{panel:...}}` lines do not
  count.
- The lesson file is already there with its H1. Keep the H1 exactly; write
  below it.
- Panels are tagged where `structure.py` says and nowhere else, one
  `{{panel:<id>}}` line alone on its line.
- Every lesson ends with `## Exercise`, which asks the learner to read figures
  the digest carries and say what the relationship between them shows.

## Rules that have cost this programme most

1. **A sentence may name a figure the digest prints. It may NOT characterise
   the relationship between two figures unless the digest prints that
   relationship.** No "about twice", no "most of", no "a fifth of". Where the
   digest prints a difference or a share (the flare's methane share in SECTION
   5, the set differences in SECTION 8, the LHV and HHV gap in SECTION 13, the
   shortcut's shortfall in SECTION 14, the exponent ratio in SECTION 15),
   quote it.
2. **"Computed here" lines are the generator's arithmetic on engine figures.**
   Quote them as the digest's figures, never as engine outputs. The
   percentage-point shortcut and the capital-against-one-year figures are wrong
   routes shown for contrast; never present them as an answer.
3. **A refusal is quoted verbatim or described, never re-worded inside
   quotation marks.** The digest prints each one after `REFUSED:`.
4. **Units and bases travel with every figure.** tCO2e and tonnes of methane
   are different quantities; an efficiency is on LHV or on HHV and says so;
   money in SECTIONS 15, 16, 18 to 23 is US dollars.
5. **Precision is the digest's.** Quote a figure to the decimals it prints (the
   header states them).
6. **NO ENGINE STRING IS EXEMPT FROM THE COPY RULE.** Since MD45-1 the atom
   balance method (SECTION 3), the inventory disclaimer (SECTION 7) and the
   condensate floor note (SECTION 16) are reworded in the engine and carry no
   contrastive; quote them as the digest prints them now.
7. **Held items are taught as limits, never as figures to compute with.**
   SECTION 25 lists H1 to H4.
8. **Not every engine output is oracle-checked.** SECTION 26 names what no
   oracle recomputes (carbon intensity, the curve's residual and pays-for-itself
   tonnes, composite curves, the simple payback). Teach them from the digest;
   do not call them validated.

## Owner copy rule, and it applies to headings

**No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner
reads**, including headings. Write "A is B." and then "B is not C." as two
sentences.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 | 1, 2 |
| Associate | m02 | 2, 3, 4 |
| Associate | m03 | 5 |
| Associate | m04 | 6, 8 |
| Associate | m05 | 7, 9, 10 |
| Associate | m06 | 4, 5, 7, 25, read as one inventory |
| Professional | m01 | 11 |
| Professional | m02 | 12 |
| Professional | m03 | 13 |
| Professional | m04 | 14 |
| Professional | m05 | 15, 16, 17 |
| Professional | m06 | 13, 14, 15, 17, read as one plant |
| Expert | m01 | 18, 19 |
| Expert | m02 | 20 |
| Expert | m03 | 21 |
| Expert | m04 | 22 |
| Expert | m05 | 23, 24 |
| Expert | m06 | 20, 22, 25, 26 |

The digest's own section headers carry the same map, generated from one table
in `carbon_dump.mjs` and checked against `structure.py`. A lesson does not
reach forward into a later tier's sections.

## The seam with gasvalue

- THIS course owns the inventory (sources, GWP sets, computed and reportable,
  intensity), the cost per tonne, the curve, target verdicts, the path, and
  energy efficiency (combustion, stack loss, steam, condensate, pinch).
- `gasvalue` owns the flare as a resource: what the gas is, what it is worth,
  recovery routes and yields, the credit breakeven, LPG and CNG. The flare
  appears here only as an inventory line computed by carbonAbatement. If a
  lesson needs to say what recovering the gas is worth, say so in one
  sentence and send the learner to `gasvalue`.
- No lesson teaches or computes NPV, IRR, Monte Carlo or a decision tree. The
  levelised cost per tonne is taught; the simple payback is taught as the
  engine prints it.
- No compressor thermodynamics (FC3 owns them).

## LEAKAGE BAN

The capstone runs three records of its own, written in
`carbon_fields_capstone.mjs`, `fields.json` and `capstone.json`. Lesson writers
never read those files, never name those records, never guess a capstone value,
and never print a number that is not in the digest.

## Hand back

Per tier: the lessons written, the prose word count of each against its own
minimum, every figure you wanted and could not find in the digest, every
two-figure comparison you wrote and the digest line it points at, and anything
in the digest you believe is wrong.

## LEAD RULINGS (2026-09-19, after the foundation)

1. **No unprinted glosses.** In the Commercial & Trading courses every tier's
   key-truth audit found 12 to 22 lesson sentences the digest never prints:
   domain glosses ("a temperature is not an amount"), design rationales ("the
   tool refuses because..."), definitions, benchmarking advice, course
   routing, "the engine states it" for digest prose. Each one then became a
   wrong bank key and a lesson fix. Write ONLY what a digest line prints or a
   reading of a printed row, cite the section, and put domain context in one
   clearly framed sentence ("In practice, ...") that no question can key on.
2. **F1 is being REPAIRED in the engines** (abatementCurve: a claim against a
   source that did not compute, or was not given, leaves the target verdict
   unassessed). SECTION 21's "met, as an upper bound" at the Carbon Studio
   defaults will change to an unassessed verdict. Do not teach the current
   SECTION 21 verdict as correct; write the lesson around the rule (a claim
   the curve cannot check against its source gets no verdict) and flag the
   exact digest lines you depend on in your hand back. F2 (basis label),
   F3 (refused measure named), F4-F7 (negative inputs refused, condensate
   target below current refused, choked flow tested) are repaired too: teach
   none of those behaviours from the current digest; they will print after
   the re-vendor.
