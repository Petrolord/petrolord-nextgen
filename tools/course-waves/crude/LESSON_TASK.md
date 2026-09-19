# crude LESSON TASK. Read every line before you write a word.

You are writing lessons for **`crude`, "Crude Assay & Blending"**, the first of
the three Commercial & Trading courses in the NextGen `downstream` module
("Midstream & Downstream"), path_order 48. Two sibling courses are written
beside you: `refinery` (Refinery Feasibility & Planning, 49) and `supply`
(Terminals, Depots & Fuel Supply, 50). Read "The seams" before module one.

## The one sentence the course serves

**Every property of a blend is computed on its own basis (gravity through
specific gravity on volume, sulfur and the other per-mass properties on mass,
viscosity through an index, yields on volume off the curve), and every
least-cost recipe is a linear programme whose binding specifications, value of
relief and infeasibility are answers in their own right.**

## The one rule everything else serves

**`/root/md-wip-crude/digest.txt` IS YOUR ONLY SOURCE OF NUMBERS, BASIS WORDS
AND ENGINE SENTENCES.** Every figure, every basis the engine names and every
refusal you quote must appear in the digest exactly as it prints there. You do
not run the engine. You do not average, subtract or convert anything yourself.
If something you want is not in the digest, the lesson does not get it, and you
say so in your hand back so the digest can be extended rather than the lesson
invented.

**EVERY FIGURE IS INVENTED AND ILLUSTRATIVE.** The digest's preamble says so.
Obigbo Light, Egbema Medium, Kwale Light and the rest are invented streams at
real places. Never present one as a real grade, a real assay, a real market
price or a regulation. A lesson that names a real Nigerian grade may do so only
to say what kind of crude the invented one resembles, never beside a figure.

`RECON.md` in this directory, the engine source comments and
`packages/engines/tools/validation/downstream/FINDINGS-crude.md` are
PROVENANCE. Read them to understand the work. Do not take a figure or a
sentence from any of them.

## History on this wave

The digest describes the engines as they are at 60ee266, after MD1-0 repaired
nineteen defects. It carries NO section about what an engine used to do. Teach
every repaired rule as how the engine works: a blank sulfur is not blended, a
typed 0 is none, a blank cost is refused, the shadow price is money per unit of
the property, T50 is interpolated, the gravity screen cannot clear a blend. Do
not write "used to", "was changed", "before the repair", "now correctly" or
anything of that shape. If you want to say why a rule exists, say what it
prevents, in the present tense. The engine source comments are dense with
history ("It used to clamp flat instead", "This module used to hand the row
price over"); nothing gates a writer reading them, so do not lift a sentence
out of one.

    node /root/dc-wavekit/digestprose.mjs /root/md-wip-crude/digest.txt \
      --rules /root/md-wip-crude --lessons <your content dir>

Run it over your lessons as well as the digest.

## Shape

- 6 modules a tier, 26 lessons a tier, 78 in the course. `structure.py` is the
  authority for every key, title, order, estimated minute and panel tag.
- **420 to 560 PROSE WORDS**, with the per-lesson minimum from `structure.py`'s
  `MIN_WORDS`: 420 for a twelve minute lesson, 470 for thirteen, 510 for
  fourteen. Front matter, table rows, headings and `{{panel:...}}` lines do not
  count.
- The lesson file is already there with its H1. Keep the H1 exactly; write below it.
- Panels are tagged where `structure.py` says and nowhere else, one
  `{{panel:<id>}}` line alone on its line.
- Every lesson ends with `## Exercise`, which asks the learner to read figures the
  digest carries and say what the relationship between them shows.

## Rules that have cost this programme most

1. **A sentence may name a figure the digest prints. It may NOT characterise the
   relationship between two figures unless the digest prints that
   relationship.** No "about twice", no "most of", no "slightly higher". Where
   the digest prints a difference column ("blend API minus that mean", "mass
   minus volume", "the two ways differ by", "marginal minus average"), quote
   that column. Where it does not, quote both figures and stop.
2. **A basis is the engine's word.** "mass", "Refutas index on mass fraction",
   "computed from the volume-blended specific gravity, never averaged
   directly", "not blended: no value for Egbema Medium". Quote them as printed.
3. **A refusal is quoted verbatim or described, never re-worded inside quotation
   marks.** The digest prints each one after `REFUSED:`. The oracles check the
   verdict and never the wording, so the words are the engine's own and nothing
   else vouches for them.
4. **Four decimals.** Every computed figure in the digest prints to four
   decimals. Quote it that way. Never round a figure to make a sentence read
   better: a rounded figure is a new number the digest does not print.
5. **The price of relief is per WHOLE unit of the property**, positive when
   relief saves money: dollars per ppm, per psi, per octane number, per kg/l.
   `rowPrice` is the row's dual and is not a price per anything a person reads;
   SECTION 23 prints both and the scale that joins them. Never call a rowPrice a
   price.
6. **Held items are taught as limits, never as figures to compute with.**
   SECTION 27 states the three: L4 (the LP's absolute tolerances), C12 (the
   Refutas index on mass, where ASTM D7152 blends on volume; SECTION 8 prints
   both) and C13 (Watson K taken at T50, a screening basis). Say what the engine
   does, say the limit, and do not tell the learner which basis is right.

## Owner copy rule, and it applies to headings

**No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner
reads**, including headings. Write "A is B." and then "B is not C." as two
sentences.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 | 1, 2, 3 |
| Associate | m02 | 4, 5, 6, 7 |
| Associate | m03 | 8 |
| Associate | m04 | 9, 10 |
| Associate | m05 | 11 |
| Associate | m06 | 3 and 12, read as one library and one export blend |
| Professional | m01 | 13 |
| Professional | m02 | 14 |
| Professional | m03 | 15 |
| Professional | m04 | 16 |
| Professional | m05 | 17 |
| Professional | m06 | 18, read with 13 to 17 as one valuation |
| Expert | m01 | 19 |
| Expert | m02 | 20, 24 |
| Expert | m03 | 21, 22 |
| Expert | m04 | 23, 24 |
| Expert | m05 | 25 |
| Expert | m06 | 26, 27, read with 21 to 25 as one pool |

The digest's own section headers carry the same map, generated from one table in
`crude_dump.mjs` and checked against `structure.py`. A lesson does not reach
forward into a later tier's sections.

## The seams

- **THIS course OWNS linear programming for the whole module.** What an LP is,
  rows and bounds, the vertex, the two phases, binding constraints, shadow
  prices as the value of one unit of relief, the marginal barrel against the
  average, giveaway, and infeasible as an answer. `refinery` will lean on these
  lessons and will not re-teach them, so teach them properly and completely in
  Expert m01, m03, m04 and m05.
- `refinery` owns the refinery plan, the schedule, the variance model and the
  modular feasibility screen. If a lesson wants to say that the same kernel
  plans a refinery, say so in one sentence and send the learner to `refinery`.
  Do not teach refinery economics here.
- `supply` owns tank strapping, the VCF, free water, stock reconciliation,
  queues, landed cost and pump price. A lesson that touches a terminal's tanks
  says what the blend is and stops.
- No NPV, IRR, Monte Carlo or decision tree anywhere: those are the Economics
  courses'.

## LEAKAGE BAN

The capstone runs three records of its own, written in
`crude_fields_capstone.mjs`, `fields.json` and `capstone.json`. Lesson writers
never read those files, never name those records, never guess a capstone
value, and never print a number that is not in the digest.

## Hand back

Per tier: the lessons written, the prose word count of each against its own
minimum, every figure you wanted and could not find in the digest, every
two-figure comparison you wrote and the digest line it points at, and anything in
the digest you believe is wrong.
