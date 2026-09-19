# H1 Safety Performance Statistics & KPIs: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** This is
the first course of the academy's `hse` module (path order 61).

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Three
other files in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-safetystats.md`, vendored beside the oracle | PROVENANCE. The engine's validation record. Where it quotes a teachable figure, the digest recomputes it through the engine and prints it; quote the digest line. |
| `oracle_safetystats.py` | PROVENANCE. The independent scipy and mpmath oracle that wrote the golden. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest, and says so when a figure is in the FINDINGS record instead.

## THE COURSE STATEMENT, IN ONE SENTENCE

A safety rate is a count divided by exposure hours on a base somebody chose, so
the course teaches what the rate is (Associate), how sure it is (Professional)
and whether anything is changing (Expert), and grades each tier on its own
question with numbers the engine returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question, so no
tier's lessons can hand out another tier's graded answer. `structure.py` is the
authority on the module and lesson keys and it self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | WHAT IS THE RATE | rates and bases, TRIR DART LTIR, FAR severity rate PSE rate, sum then divide, the rolling rate, one report | 1 to 12 |
| Professional | HOW SURE ARE WE | the Poisson count model, the Garwood interval, zero events, comparing two rates, the p-value convention, intervals in a report | 13 to 20 |
| Expert | IS ANYTHING CHANGING | the u-chart, signals, what a signal means, benchmarking, the traps, judgement end to end | 21 to 27 |

Section 28 is the vocabulary, and every tier owns it. The digest names an owner
module in every section heading; Associate m01 owns the refusals table
(section 4), Professional m05 owns the p-value convention (section 19), and
Expert m03 owns revising the limits (section 23).

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **The base is required**, and a missing base is refused with the field named.
   UGHELLI's 9 recordables in 2318640 hours read 0.776317 per 200,000 hours,
   3.881586 per 1,000,000 and 388.158576 per 100,000,000: only the base moved.
   FAR is the one rate with a fixed base: the engine takes the IOGP
   definition. Other bodies use related framings, per worker-year or per
   working lifetime, so a FAR quoted from elsewhere needs its definition
   checked first.
2. **The severity rate has no single standard.** Days lost times a required base
   over hours, with no ANSI Z16.1 time charges added. Days per case is a
   different quantity and the engine does not compute it.
3. **The API RP 754 tier is an input.** The threshold quantity tables are
   licensed and are not in the engine, the golden or this course. The PSE rate
   takes only the 200,000 or the 1,000,000 base.
4. **Sum then divide.** KWALE's pooled rate is 0.968312 per 200,000 hours; the
   mean of its three site rates is 1.754760. IOGP's own five-year FAR is
   0.826095 by sum then divide and 0.833228 by the mean of the yearly rates.
5. **The central p-value.** On UTOROGU the engine's central p-value is 0.051759
   and the minlike p-value of R and scipy, derived, is 0.025879. The central one
   agrees with the engine's own rate-ratio interval on all 399 comparisons the
   digest sweeps; the minlike one disagrees on 14.
6. **A signal lies strictly outside its limits**, and the lower limit is floored
   at zero and flagged.

## THE REFUSALS

Digest section 4 tables 22 refusals across 9 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A refusal carries no number.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `h1_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone workplaces, their counts, their hours and their answers are NOT in
the digest and must never enter a lesson, a bank or a panel. The tolerance of
every field is made in exactly one place, `gradedTolerance.js` in the NextGen
repository. **Never type a tolerance.**

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 28 carries the rule for each.

1. **"Poisson"** already means Poisson's ratio in six live courses. Always
   "Poisson distribution" or "Poisson count model".
2. **"severity"** already means a risk-matrix category and a surveillance
   exception level. Always "severity rate".
3. **"confidence interval"** is an interval on an estimated rate. No P label is
   used anywhere in this course.
4. **"FAR"** here is an observed rate. The planned QRA course will teach a
   predicted one.

## THIS ENGINE HAS NO REPAIR HISTORY

It was written, oracle-gated and merged in one pull request. There is no history
module and no framed history section. A sentence about former engine behaviour
anywhere in this course is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Every engine string the digest quotes meets
the rule already. **Never write a contrastive of your own.**

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
