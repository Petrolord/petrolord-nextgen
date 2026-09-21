# H3 Process Safety: LOPA & SIL Determination: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** Slug
`lopa`, prefix `h3`, the third course of the academy's `hse` module.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other files in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-lopa.md`, vendored beside the oracle | PROVENANCE. The engine's validation record: sources, published goldens, inferred inputs, route B departures and doubts. Where the digest restates a finding it re-measures it through the engine or reads it from the golden. |
| `oracle_lopa.py` | PROVENANCE. The independent stdlib oracle that wrote the golden in exact rationals. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |
| `fields.json` and `h3_capstone.mjs` | THE ANSWER KEY. Never quote from either in a lesson, a bank or a key truth. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest, and says so when a figure is in the FINDINGS record instead.

## THE COURSE STATEMENT, IN ONE SENTENCE

A layer of protection analysis finds how much risk reduction a scenario still
needs, and a safety instrumented function has to supply it, so the course
teaches how much is missing (Associate), what a SIF achieves (Professional) and
how long its proof test may run and what the engine does not know (Expert), and
grades each tier on its own question with numbers the engine returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question, so no
tier's lessons can hand out another tier's graded answer. `structure.py` is the
authority on the module and lesson keys and it self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | HOW MUCH RISK REDUCTION IS MISSING | the scenario and its frequency, enabling conditions and modifiers, IPLs and their credit, the TMEL and the gap, outcome states and the exact decade, one worksheet end to end | 1 to 13 |
| Professional | WHAT DOES THE SIF ACHIEVE | PFDavg and the simplified forms, the full Annex B form, common cause and the beta factor, the architectures, the SIF as a sum, the published SIF reproduced | 14 to 24 |
| Expert | HOW LONG MAY THE PROOF TEST RUN, AND WHAT DOES THE ENGINE NOT KNOW | the proof test interval, imperfect proof testing, how conservative Annex B is, the published example and its inferences, what the engine does not do, judgement end to end | 25 to 31 |

Section 32 is the vocabulary, and every tier owns it. The digest names an owner
module in every section heading; Associate m01 owns the refusal table (section
3), Associate m05 owns the decade snap (section 11), Professional m03 owns the
two out of two rule (section 20) and Expert m04 owns the inferred inputs
(section 29).

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Nothing is invented.** The initiating event frequency, every enabling
   condition and conditional modifier, every IPL PFD, every failure rate and the
   TMEL are inputs. Failure rates in this course are illustrative, never data,
   and no licensed IEC or ISA table is reproduced.
2. **IPL credit is a flag applied, never assumed.** Credit only when
   `independent` is exactly true and `auditable` is not false; one credit per
   IPL. ORONI credits two of its four IPLs, and crediting all four would take its
   required RRF from 13.500000 to 0.135000 (section 6). These rules are
   SPECIFICATION: no independent route validates them, which Expert m05 teaches.
3. **The required PFDavg is the binding target.** ORONI at a TMEL of 1e-7 needs
   0.007407407407; a SIF of 0.009 sits in the SIL 2 band it requires and still
   misses (section 8).
4. **An exact decade belongs to the lower SIL**, and a value within one part in
   a billion of a decade IS the decade. 3 of the 5 decade products the digest
   computes land at 100.00000000000001 in IEEE double, which a plain comparison
   would band SIL 2 (section 11).
5. **Outcome states, never a clipped number.** Six states, BEYOND_SIL3_REDESIGN
   carrying its required PFDavg intact (section 9).
6. **The full Annex B form**, with the simplified TR84 forms as its special case
   at no detected failures and no MRT (section 16). **Two out of two carries no
   beta factor term** (section 20).
7. **A SIF is the series sum of its subsystems** (section 22).
8. **The longest interval has explicit states**: FOUND, UNACHIEVABLE,
   INTERVAL_INDEPENDENT, CAPPED_AT_LIFETIME (section 26).
9. **Not in the engine:** no hardware fault tolerance check, no high demand mode,
   no failure-rate data (section 30).

## THE REFUSALS

Digest section 3 tables 29 refusals across 7 functions, each with the field it
names and the engine's message verbatim. **Quote a refusal in a blockquote as the
engine's own words.** A refusal carries no number.

## THE EVIDENCE BEHIND EACH GRADED QUANTITY, AND WHAT IS NEVER GRADED

H2 learned that a formula checked for transcription only must not carry a graded
answer. This engine's position, read from its validation record and re-measured
in the digest:

| what a capstone grades | the evidence behind it |
| --- | --- |
| LOPA frequencies, required RRF and PFDavg, the loop through a SIF | exact arithmetic; the oracle decides every product and every boundary in exact rationals (section 12) |
| PFDavg for 1oo1, 1oo2 and 2oo3 with detected failures, MTTR and MRT | two independent sources state the same Annex B equations, and the published worked SIF reproduces to its printed three figures with MRT equal to the MTTR (section 23); the capstones keep MRT equal to the MTTR where detected failures are present |
| 2oo2 | the Annex B form the engine prints in its formula (section 20); the simplified identity holds exactly (section 16) |
| the SIF sum and its RRF | Annex B.3.2.1 as the published total reproduces it (section 23) |
| the longest interval | the oracle solves the exact polynomial in T1 and agrees with the engine's bisection |
| proof test coverage | the 61508 Association statement of Annex B.3.2.5, which reproduces four published rows with an inferred lifetime of 10 years (section 29); every capstone STATES its lifetime, so the inference never enters a graded answer |

**Never graded:** 1oo3 (checked against the time dependent route to first order
only, with no published row, section 21), any route B value, the `auditable`
flag (its shared negative control stayed green), a SIL number or a state word on
its own, the choice of an IEF, a TMEL or an IPL PFD, and anything about hardware
fault tolerance or a high demand mode.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `h3_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone facilities, their inputs and their answers are NOT in the digest
and must never enter a lesson, a bank or a panel. The tolerance of every field is
made in exactly one place, `gradedTolerance.js` in the NextGen repository.
**Never type a tolerance.** Frequencies and PFDavg are graded at the twelve
decimals the digest prints them to, which is why every lesson quotes them at
twelve.

## THE SEAMS

- **The risk matrix is not this course.** LOPA is frequency based. The academy's
  five by five matrix belongs to the risk and change course, and the field
  development course teaches a second scale; this course never grades a matrix
  band (section 13).
- **Licensed tables are cited, never copied.** IEC 61508 and 61511 tables and
  ISA tables enter only as user inputs.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 32 carries the rule for each.

1. **"beta"** already means a vapour fraction and an orifice diameter ratio in
   live courses. Always "beta factor" (betaD for detected failures).
2. **"PFD"** is always "PFDavg" for a SIF or a subsystem; an IPL's credited
   figure is "IPL PFD".
3. **"severity"** is never used. The consequence is described in words and
   carried by its TMEL.
4. **"likelihood"** appears only inside "tolerable mitigated event likelihood".
5. **"RRF"** is the risk reduction factor, one over PFDavg.

`gate_vocabulary.py` gates all five and reports every SIL 4 mention for a human
read: SIL 4 appears only as a band, a table floor or a reason to redesign.

## THIS ENGINE HAS NO REPAIR HISTORY

It was written, oracle-gated and merged in one pull request. There is no history
module and no framed history section. The published example's inferred inputs
and its printing slip (section 29) are facts about a published SOURCE, and a
lesson says so; a sentence about former engine behaviour is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. Every engine string the digest quotes meets
the rule already. **Never write a contrastive of your own.**

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
