# refinery LESSON TASK. Read every line before you write a word.

You are writing lessons for **`refinery`, "Refinery Feasibility & Planning"**,
one of the three Commercial & Trading courses, in the NextGen academy module
`commercial_trading` ("Commercial & Trading"), path_order 49. The sibling
course `crude` (Crude Assay & Blending, 48) is in the same module; `supply`
(Terminals, Depots & Fuel Supply, 50) is in `supply_chain` ("Supply Chain &
Logistics"). The engine family is still engines/downstream; only the academy
module name changed. Read "The seams" before module one.

## The one sentence the course serves

**A refinery is judged on its margin per barrel of crude: the screen prices that
barrel before any capital is spent, the plan finds it with every barrel run
through the crude unit, the schedule dates it, and the actuals are read against
it line by line on what each gap did to margin.**

## The one rule everything else serves

**`/root/md-wip-refinery/digest.txt` IS YOUR ONLY SOURCE OF NUMBERS, DATES, FLAGS
AND ENGINE SENTENCES.** Every figure, date and refusal you quote must appear in
the digest exactly as it prints there. You do not run the engine. You do not do
arithmetic on digest figures and print the result. If something you want is not
in the digest, the lesson does not get it, and you say so in your hand back so the
digest can be extended rather than the lesson invented.

**PRECISION IS PART OF EVERY FIGURE.** The digest's second line states it:
barrels and US dollars to two decimals, dollars a barrel to four, percents to
two, fractions to four, the screening engine's millions to four. Quote a figure
as it prints. You may round a figure for a sentence only if you print the digest
figure beside it.

**THE PERIOD START AND THE START YEAR ARE PART OF EVERY DATE.** Every schedule is
cascaded from 2027-03-01, passed as that string; every valuation from start year
2027. Name the period start in any lesson that quotes a schedule date, and never
write "today" as if it meant the reader's today.

`RECON.md` in this directory, the engine source comments and FINDINGS-refinery.md
are PROVENANCE. Read them to understand the work. Do not take a figure or a
sentence from any of them.

## History on this wave

The digest describes the engines as they are at 60ee266 (MD2-0 repairs in). It
carries NO section about what an engine used to do. The owner decisions of
2026-09-19 are in SECTION 24 as rules in force. Do not write "used to", "was
changed", "before the repair", "MD2-0 fixed" or anything of that shape. If you
want to say why a rule exists, say what the rule prevents, in the present tense:
"a typed zero is a limit of zero, so a unit shut for a turnaround runs nothing"
(SECTION 9). SECTION 11 prints what the plan does with a crude unit given a feed;
teach it as today's behaviour for that configuration.

    node /root/dc-wavekit/digestprose.mjs /root/md-wip-refinery/digest.txt \
      --rules /root/md-wip-refinery --lessons <your content dir>

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
   relationship.** No "about twice", no "most of", no "a tenth of". The digest
   prints the ratio of the two scaling laws (SECTION 3), the margin change of each
   plan variant (SECTION 13), the margin gained per extra barrel of reformer
   capacity (SECTION 14), and the difference between the two tax totals (SECTION
   23): quote those. Anywhere else, quote both figures.
2. **A refusal is quoted verbatim or described, never re-worded inside quotation
   marks.** The digest prints each one after `REFUSED:`. The oracles check
   answers and never wording.
3. **THE SCHEDULE NOTE IS QUOTED AS THE ENGINE WRITES IT.** The schedule note
   (SECTION 15) ends "this is the shape of the month to read actuals against.
   Berth-level scheduling needs those constraints and a scheduling tool." It
   used to end in a contrastive; engines #232 recast it, so no engine string
   is exempt from the copy rule now.
4. **Crude grade names are LABELS.** "Bonny Light (illustrative)" is a label on
   invented yields and prices. Never write that a real grade yields or costs what
   the digest prints, and never quote a real market price.
5. **A stream's marginal value is the plan's, and the crude course owns the LP.**
   Say what the digest says: the value of one more barrel of the stream arriving
   from outside, the negated dual of its balance row. Do not teach what a dual,
   a basis, a binding constraint or infeasibility is; send the learner to the
   `crude` course in one sentence.
6. **Held items are taught as limits, never as figures to compute with.** H1
   (the 0.6 and 0.9 exponents are defaults a vendor's figures replace) and H2
   (capital depreciated in the year it is spent) are in SECTION 24.
7. **The NPV is taught and never presented as a graded or examined target.** The
   Economics courses own NPV and IRR. SECTIONS 22 and 23 print the feasibility
   NPV; quote it as the screen's answer. The digest prints no IRR: do not mention
   one beyond saying the Studio shows it and the Economics courses teach it.

## Owner copy rule, and it applies to headings

**No em dashes. No en dashes. No "X, not Y" contrastive anywhere a learner
reads**, including headings. Write "A is B." and then "B is not C." as two
sentences.

## Which digest section owns which module

| tier | module | digest sections |
|---|---|---|
| Associate | m01 | 1, 2 |
| Associate | m02 | 3 |
| Associate | m03 | 4 |
| Associate | m04 | 5 |
| Associate | m05 | 6, 7 |
| Associate | m06 | 8, read with 3 to 7 as one screen |
| Professional | m01 | 9, 10, 13 |
| Professional | m02 | 11 |
| Professional | m03 | 10, 12, 13 |
| Professional | m04 | 14 |
| Professional | m05 | 15, 16 |
| Professional | m06 | 17, read with 9 to 16 as one plan and one schedule |
| Expert | m01 | 18, 19 |
| Expert | m02 | 20 |
| Expert | m03 | 21 |
| Expert | m04 | 22 |
| Expert | m05 | 23 |
| Expert | m06 | 24, read with 19 to 23 as one month and one expansion |

The digest's own section headers carry the same map, generated from one table in
`refinery_dump.mjs` and checked against `structure.py`. A lesson does not reach
forward into a later tier's sections.

## The seams

- `crude` OWNS linear programming and every crudeAssay and productBlending
  output. This course uses the plan and its stream values.
- `supply` OWNS strapping, the VCF, stock reconciliation, the Erlang C queue,
  landed cost and pump price. The digest prints no material balance (RECON 3b);
  do not teach one.
- The Economics courses OWN NPV, IRR, Monte Carlo and decision trees.

## LEAKAGE BAN

The capstone runs three records of its own, written in
`refinery_fields_capstone.mjs`, `fields.json` and `capstone.json`. Lesson writers
never read those files, never name those records, never guess a capstone value,
and never print a number that is not in the digest.

## Hand back

Per tier: the lessons written, the prose word count of each against its own
minimum, every figure you wanted and could not find in the digest, every
two-figure comparison you wrote and the digest line it points at, and anything in
the digest you believe is wrong.
