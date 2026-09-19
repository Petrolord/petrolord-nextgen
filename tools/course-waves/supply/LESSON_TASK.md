# supply LESSON TASK. Read every line before you write a word.

You are writing lessons for **`supply`, "Terminals, Depots & Fuel Supply"**,
a course in the NextGen `supply_chain` academy module (label "Supply Chain &
Logistics"), path_order 50, built beside the two Commercial & Trading courses
(module `commercial_trading`). The sibling
courses `crude` ("Crude Assay & Blending", path_order 48) and `refinery`
("Refinery Feasibility & Planning", path_order 49) are being written beside
you. Read "The seams with crude and refinery" before module one.

## The one sentence the course serves

**A terminal's stock, a cargo's cost and a litre's pump price are each a chain
of measured inputs walked in a stated order, and the engine refuses or names
every link nobody measured (an opening stock, a strapping entry, a coefficient,
a rate) instead of assuming it, because a figure that cannot come out wrong
proves nothing.**

## The one rule everything else serves

**`/root/md-wip-supply/digest.txt` IS YOUR ONLY SOURCE OF NUMBERS, TABLE
ROWS, REFUSALS AND ENGINE SENTENCES.** Every figure you quote must appear in the
digest exactly as it prints there. You do not run the engine. You do not
interpolate a strapping table yourself, and you do not work a queue or a
build-up out on paper to get a figure the digest does not print. If something
you want is not in the digest, the lesson does not get it, and you say so in
your hand back so the digest can be extended rather than the lesson invented.

`RECON.md` in this directory, the engine source comments and
`packages/engines/tools/validation/downstream/FINDINGS-supply.md` are
PROVENANCE. Read them to understand the work. Do not take a figure or a
sentence from any of them. The engine source comments in particular carry a
duty rate in prose; it is not a figure this course may quote.

## THE RATE RULE. It binds every lesson in the Expert tier and several others.

**Every rate, margin, levy, freight, tax, exchange rate and emission factor in
the digest is INVENTED for this course, and the lesson must say so the first
time it uses one.** The engine ships no rate by design (`RATE_DISCLAIMER`, digest
SECTION 1) and the programme forbids quoting a published rate as authority.
Never write a real duty, VAT rate, levy, margin or regulated price, and never
imply the invented ones are current in any market. Say "the course's invented
duty" or "BADAGRY's invented rate", never "the duty".

**THE VCF COEFFICIENTS ARE NOT SHIPPED AND ARE NEVER QUOTED FROM MEMORY.** The
digest shows the ASTM D1250 FORM on one SYNTHETIC coefficient row (SECTION 6),
and every stock in the course is corrected with a VCF typed off the terminal's
own tables, also invented. Do not name, round or recall a published K0, K1 or
K2 for any commodity group, and do not say the synthetic row resembles one.

## History on this wave

This digest describes the engines as they are at 13f0936 (MD3-0, MD3-1 and MD3-2). It carries NO
section about what the engine used to do. SECTION 23 states the rules MD3-0, MD3-1 and MD3-2 put
in force, each in the present tense with a measured figure. A sentence about
former behaviour that reads as current behaviour is a defect; do not write
"used to", "was changed", "before the repair" or anything of that shape. If you
want to say why a rule exists, say what the rule prevents, in the present
tense.

**THE RECONCILIATION THAT CANNOT FAIL** (Associate m05 l03) is taught as a
demonstration the digest prints (SECTION 7): an opening stock taken from
today's own closing dip balances every day. Teach it as the reason the opening
stock is an input. Do not describe any app as having done it.

    node /root/dc-wavekit/digestprose.mjs /root/md-wip-supply/digest.txt \
      --rules /root/md-wip-supply --lessons <your content dir>

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
   relationship.** No "about twice", no "most of", no "nearly all", no "a
   fraction of". Where the digest prints two volumes, quote both. SECTION 3
   prints the difference between AK-03's two tables; quote that difference
   rather than calling it small or large.
2. **A refusal is quoted verbatim or described, never re-worded inside
   quotation marks.** The digest prints each one after `REFUSED:`. The oracles
   check figures and verdicts and never the wording, so the words are the
   engine's own and nothing else vouches for them.
3. **Units travel with every figure.** m3 at standard and gross observed m3 are
   different quantities; say which. Money in SECTION 13 is US dollars, in
   SECTIONS 14 to 16 naira, in SECTION 18 US dollars and in SECTIONS 19 to 22
   naira a litre.
4. **Precision is the digest's.** Quote a figure to the decimals it prints
   (the digest header states them). Do not round a figure the digest prints and
   then quote the rounding.
5. **ONE ENGINE STRING FAMILY BREAKS THE COPY RULE AND IS QUOTED ANYWAY.** The
   engine labels an incomplete build-up with "A FLOOR" followed by a comma
   contrastive (digest SECTIONS 2, 18 and 20). You may quote the engine's
   sentence inside quotation marks as the engine's words. You may not write that
   shape yourself.
6. **Held items are taught as limits, never as figures to compute with.**
   SECTION 23 lists them: H1, charges levied at discharge billed on the
   bill-of-lading quantity; H2, no coefficient table and no rate shipped.

## Owner copy rule, and it applies to headings

**No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner
reads**, including headings. Write "A is B." and then "B is not C." as two
sentences.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 | 1, 2 |
| Associate | m02 | 3, 4 |
| Associate | m03 | 5 (and the water-cut refusals of 4) |
| Associate | m04 | 6 |
| Associate | m05 | 7, 8 |
| Associate | m06 | 3 to 8, read as one terminal and one day |
| Professional | m01 | 9, 10 |
| Professional | m02 | 10, 11 |
| Professional | m03 | 12 |
| Professional | m04 | 13 |
| Professional | m05 | 14, 15, 16 |
| Professional | m06 | 12, 14, 15, 16, read as one depot |
| Expert | m01 | 17 (and the templates of 1) |
| Expert | m02 | 18 |
| Expert | m03 | 19 |
| Expert | m04 | 20, 21 |
| Expert | m05 | 22 |
| Expert | m06 | 18 to 24 |

The digest's own section headers carry the same map, generated from one table
in `supply_dump.mjs` and checked against `structure.py`. A lesson does not
reach forward into a later tier's sections.

## The seams with crude and refinery

- THIS course owns measurement and logistics: strapping, the VCF form, free
  water, stock reconciliation, the Erlang C queue, landed cost, pump price,
  trucking and station sizing.
- `crude` owns linear programming, assays and blending. If a lesson needs to
  say where a cargo's quality comes from, say so in one sentence and send the
  learner to `crude`.
- `refinery` owns plan, schedule and actuals variance and the modular refinery
  screen. A refinery's product leaving by truck is this course's lane; its
  margin is `refinery`'s.
- No lesson teaches or computes NPV, IRR, Monte Carlo or a decision tree. The
  throughput margin in SECTION 13 is a period's margin and never a valuation.

## LEAKAGE BAN

The capstone runs three records of its own, written in
`supply_fields_capstone.mjs`, `fields.json` and `capstone.json`. Lesson writers
never read those files, never name those records, never guess a capstone value,
and never print a number that is not in the digest.

## Hand back

Per tier: the lessons written, the prose word count of each against its own
minimum, every figure you wanted and could not find in the digest, every
two-figure comparison you wrote and the digest line it points at, and anything
in the digest you believe is wrong.
