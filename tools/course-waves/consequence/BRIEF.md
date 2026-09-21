# H4 Consequence Modelling: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** Slug
`consequence`, prefix `h4`, the fourth course of the academy's `hse` module.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other files in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-consequence.md`, vendored beside the oracle | PROVENANCE. The engine's validation record: sources, published goldens, errata, judgement calls, dropped scope and doubts. Where the digest restates a finding it re-measures it through the engine or reads it from the golden. |
| `oracle_consequence.py` | PROVENANCE. The independent Python oracle that wrote the golden. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |
| `fields.json` and `h4_capstone.mjs` | THE ANSWER KEY. Never quote from either in a lesson, a bank or a key truth. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest, and says so when a figure is in the FINDINGS record instead.

## THE COURSE STATEMENT, IN ONE SENTENCE

A consequence model turns a loss of containment into physical effects, so the
course teaches how much gets out and where it goes (Associate), what a pool fire
radiates (Professional) and who is hurt by a fire, a blast or a toxic cloud, with
what the engine does not model (Expert), and grades each tier on its own question
with numbers the engine returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question.
`structure.py` is the authority on the module and lesson keys and it self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | HOW MUCH GETS OUT AND WHERE DOES IT GO | what a consequence model computes, liquid through a hole, gas through a hole, pools and evaporation, the Gaussian plume, how far the plume reaches | 1 to 13 |
| Professional | WHAT DOES THE FIRE RADIATE | the burning flux, the flame length, tilt and surface emissive power, the view factor, transmissivity and the heat flux, the published pool fire reproduced | 14 to 22 |
| Expert | WHO IS HURT, AND WHAT DOES THE ENGINE NOT KNOW | TNT and the scaled distance, the blast field, probits, toxic probits, what the engine does not do, judgement end to end | 23 to 33 |

Section 34 is the vocabulary, and every tier owns it. Section 22 (the seams)
belongs to Professional m05 l04 and Expert m06 l02.

WHY THIS SPLIT. The engine has five sections: source terms, dispersion, fires,
explosions and probits. The fire section is the largest and is one chain from a
pool to a heat flux, so it is one tier's question. Dispersion takes its release
rate from a source term, so the two are one question. Blast and probits both end
at harm to a person, and the probits read the output of every other section, so
they close the course with what the engine does not do.

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Effects, never frequencies.** Nothing in the engine is a frequency or a
   risk (section 1).
2. **Every input carries its unit in its name**, pressures are absolute, and two
   molar mass units coexist: kg/mol for the source terms and g/mol for the
   concentrations (section 2).
3. **A result or a refusal.** Every result carries its model and source; every
   refusal names its field. Section 3 tables 37 refusals across 24 functions.
4. **Choked at or below the critical pressure ratio**, and a ratio exactly at it
   counts as choked with no jump in the mass rate (sections 6 and 7).
5. **No spreading model.** A pool is a bund floor or a STATED thickness, and a
   bund that overtops is refused (section 8).
6. **The ground reflects the plume**, and the plume has no calm air form
   (section 11). The distance to a concentration has three states (section 13).
7. **The solid flame model**: a cylinder of radius D/2, a named surface emissive
   power method, a view factor that refuses a flame over the target, and a
   transmissivity that is stated or Bagster within its band (sections 14 to 20).
8. **Kinney and Graham for a free air TNT burst**, over a range the engine's
   validation record calls a judgement (sections 24 and 25).
9. **Every probit preset is named by its source**, and the inverse probit is
   approximate (sections 26 to 30).
10. **Not in the engine:** two phase discharge, a puff, urban coefficients, a jet
    fire, Kingery-Bulmash, the multi-energy method, lung and eardrum probits and
    any frequency (section 31). None is taught as computed.

## THE REFUSALS

Digest section 3 tables them with the field each names and the engine's message
verbatim. **Quote a refusal in a blockquote as the engine's own words.** A
refusal carries no number.

## THE EVIDENCE BEHIND EACH GRADED QUANTITY, AND WHAT IS NEVER GRADED

Section 32 tables what catches a mistake copied into both the engine and its
oracle. A capstone grades only a quantity that a second route or a published
worked number stands behind:

| what a capstone grades | the evidence behind it |
| --- | --- |
| liquid and gas outflow | the Yellow Book worked cases and the nozzle maximisation (sections 5 and 6) |
| the pool of stated thickness | the Yellow Book pool diameter (section 8) |
| the plume and the distance to a concentration | the mass flux integral and ALOHA Table 13 (sections 10 and 11) |
| Thomas with wind, tilt, both surface emissive powers | the Yellow Book pool fire (section 21) |
| the tilted view factor and the heat flux | the numerical surface integral and the Yellow Book pool fire (sections 18 and 21) |
| Kinney and Graham forward and inverse | the published conference column (section 24) |
| the Eisenberg thermal probit and the overpressure probit | the OSD/30 printed doses and points (sections 27 and 28) |
| the Lees toxic probits | the OSD/30 columns (section 29) |

**Never graded:** Mackay and Matsugu, Bagster, Burgess, the TNT equivalence,
Thomas in still air, any Purple Book toxic preset other than as a teaching
comparison, any inverse of the normal CDF (section 30), anything section 31
lists, and any point source heat radiation, setback, frequency or risk.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `h4_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone facilities, their inputs and their answers are NOT in the digest
and must never enter a lesson, a bank or a panel. The tolerance of every field is
made in exactly one place, `gradedTolerance.js` in the NextGen repository.
**Never type a tolerance.** Quantities are graded at the six decimals the digest
prints (view factors at twelve), which is why every lesson quotes them there.

## THE SEAMS

- **Point source heat radiation and setbacks** belong to the Facilities courses
  on relief and flare systems and on layout. This course grades only the solid
  flame (section 22).
- **Frequencies and risk** (individual risk, the potential loss of life, the F-N
  curve) belong to the later quantitative risk course; the risk matrices belong
  to the risk and change course.
- **Emissions, produced water and tank vapour losses** are other courses'
  subjects.

`gate_vocabulary.py` enforces all three: the words may be NAMED only in the seam
lessons it lists, and the Facilities courses' heat radiation level figures never appear.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 34 carries the rule for each: "flux" is always qualified, "beta"
appears only inside "k beta", "dose" is always "thermal dose", "toxic load",
"toxic dose" or "lethal dose", "severity" and "likelihood" are never used, and
"radiation" is always "heat radiation" or "thermal radiation".

## THIS ENGINE HAS NO REPAIR HISTORY

It was written, oracle-gated and merged in one pull request. The errata this
course teaches (the Yellow Book Froude number, the OSD/30 TNO row, the conference
paper's printed constants) are facts about PUBLISHED SOURCES, and a lesson says
so; a sentence about former engine behaviour is a defect.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" contrastive anywhere a learner
reads, headings and titles included. **Never write a contrastive of your own.**

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
