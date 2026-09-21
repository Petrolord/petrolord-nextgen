# H5 Quantitative Risk Assessment: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** Slug
`qra`, prefix `h5`, the fifth and last course of the academy's `hse` module.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Four
other files in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-qra.md`, vendored beside the oracle | PROVENANCE. The engine's validation record: sources, published goldens, errata, judgement calls, fail-opens and doubts. Where the digest restates a finding it re-measures it through the engine or reads it from the golden. |
| `oracle_qra.py` | PROVENANCE. The independent oracle that wrote the golden. |
| the engine's own source comments | PROVENANCE. A sentence lifted out of a comment arrives with no check behind it. |
| `fields.json` and `h5_capstone.mjs` | THE ANSWER KEY. Never quote from either in a lesson, a bank or a key truth. |

`gate_claims.mjs` checks every number in every brief in this directory against
the digest, and says so when a figure is in the FINDINGS record instead.

## THE COURSE STATEMENT, IN ONE SENTENCE

A quantitative risk assessment turns scenario frequencies and probabilities of
death into one person's individual risk, a population's societal risk and a
test of whether a further measure is reasonably practicable, so the course
teaches how often and what one person carries (Associate), how many die at once
(Professional), and whether a further measure is reasonably practicable and
what the engine does not know (Expert), and grades each tier on its own
question with numbers the engine returns.

## WHO OWNS WHAT

Each tier owns one question and its capstone grades only that question, so no
tier's lessons can hand out another tier's graded answer. `structure.py` is the
authority on the module and lesson keys and it self-checks.

| tier | question | modules | digest sections |
| --- | --- | --- | --- |
| Associate | HOW OFTEN, AND WHAT IS ONE PERSON'S INDIVIDUAL RISK | what a QRA answers, event trees, a flammable release, location-specific individual risk, individual risk per annum, one person end to end | 1 to 14 |
| Professional | HOW MANY AT ONCE | potential loss of life, the fatal accident rate, the F-N curve, criterion lines, one published point and the boundary, societal risk end to end | 15 to 24 |
| Expert | IS A FURTHER MEASURE REASONABLY PRACTICABLE, AND WHAT DOES THE ENGINE NOT KNOW | the ALARP regions, the benefit of a measure, discounting and the ICAF, gross disproportion, what the engine does not know, judgement end to end | 25 to 33 |

Section 34 is the vocabulary, and every tier owns it. The digest names an owner
module in every section heading; Associate m01 owns the refusal table (section
3) and the consequence seam (section 4), and Expert m05 owns what the engine
does not know (section 32).

## THE ENGINE'S DECLARED CHOICES, WHICH EVERY TIER TEACHES BY NAME

1. **Nothing is invented.** Every scenario frequency, branch probability,
   probability of death, occupancy, VPF, DF and rate is an input. VPF has no
   default; the two HSE values are illustration only (section 27).
2. **Every branch set sums to one within a tolerance.** 0.7, 0.2 and 0.1 sum to
   0.9999999999999999 in double and are accepted; 0.4000001 and 0.6 are
   refused (section 6). Delayed ignition is CONDITIONAL on no immediate
   ignition (section 7).
3. **A probability of death is an input.** It comes from the consequence
   course; this course never computes one (section 4).
4. **F(N) is "N or more"**, as the Purple Book's equation says where its own
   introduction says "more than N" (section 18). **No published worked F-N
   example exists**: the curve is checked by self-consistency (section 19).
   Never present an F-N figure as published-verified.
5. **A threshold value belongs to the LOWER band** (the owner's decision): 1e-3
   is TOLERABLE for workers, 1e-6 is BROADLY_ACCEPTABLE, a cost exactly DF times
   the benefit is NOT_GROSSLY_DISPROPORTIONATE, a curve on the line TOUCHES it.
   A value within 1e-9 relative of a threshold IS the threshold: 0.1 x 0.1 x
   0.1 is 0.0010000000000000002 in double and stays TOLERABLE (section 26).
6. **Present values are year-end, every rate defaults to zero**, and the ICAF
   counts the fatalities prevented UNDISCOUNTED (sections 29 and 30).
7. **Not in the engine:** no aversion weighting, no slope for the R2P2 point, no
   successor to the repealed Bevi values, no grid or wind rose (section 32).

## THE REFUSALS

Digest section 3 tables 39 refusals across 13 functions, each with the field
it names and the engine's message verbatim. **Quote a refusal in a blockquote as
the engine's own words.** A refusal carries no number of its own.

## THE EVIDENCE BEHIND EACH GRADED QUANTITY, AND WHAT IS NEVER GRADED

H2 learned that a formula checked for transcription only must not carry a graded
answer. This engine's position, read from its validation record and re-measured
in the digest:

| what a capstone grades | the evidence behind it |
| --- | --- |
| event tree outcome frequencies | exact arithmetic on stated probabilities; the oracle checks every tree in exact Fractions. Every ignition probability AND the flash fire and explosion split are STATED in the prompt, because the Table 4.5 cells and the 0.6 and 0.4 preset rest on one reading (section 9) |
| LSIR and IRPA | exact sums of stated inputs, hours over 8760 (sections 10 and 12) |
| PLL and FAR | exact arithmetic; the FAR base is the safety statistics course's own, bit for bit (section 16) |
| the frequency of N or more, the ratio to the Dutch line, where a curve exceeds, the ratio to the R2P2 point | the engine's declared "N or more" reading, checked by self-consistency; the criterion side is published: the Bevi points lie on the line and the R2P2 point is printed (sections 17 to 22) |
| the cost to benefit ratio, the ICAF, the largest reasonably practicable cost | the published checklist example reproduces and the R2P2 margin reproduces (sections 27 and 28) |

**Never graded:** a band, state or verdict word on its own; a Table 4.5 lookup
or the 0.6 and 0.4 preset; any Fd fraction or factor (section 24); a contour
crossing distance (a presentation rule, section 13); anything through the three
functions that call the consequence engine; the Purple Book Appendix 6.B chain;
a vulnerability factor.

## WHAT IS GRADED, AND WHAT IS NEVER IN THE DIGEST

Three capstones, 6 graded fields each, 18 in all, computed by the vendored
engine in `h5_capstone.mjs` and written to `fields.json` by `make_fields.mjs`.
The capstone facilities, their inputs and their answers are NOT in the digest
and must never enter a lesson, a bank or a panel. The tolerance of every field is
made in exactly one place, `gradedTolerance.js` in the NextGen repository.
**Never type a tolerance.** Per-year quantities are graded at the twelve
decimals the digest prints them to, which is why every lesson quotes them at
twelve.

## THE SEAMS, AND THE CROSS-COURSE LEAKAGE RULE

- **The consequence course owns** source terms, dispersion, radiation,
  overpressure and every probit and dose. This course takes a probability of
  death and a frequency as INPUTS. A sentence that names a probit, a dose, a
  plume or dispersion also says, in the same sentence, that it belongs to the
  consequence course or is a stated input.
- **The risk matrix belongs to the risk and change course.** This course never
  scores a matrix cell; "severity" and "likelihood" are never used.
- **LOPA and SIL belong to the LOPA course.** Named only at the seam.
- **Flare radiation and setbacks belong to the facilities courses.** Never used.
- **Present value mechanics belong to the economics courses.** The canonical
  year-end present value is used only inside the gross disproportion test and
  the ICAF; "NPV" and "IRR" are never used.

`gate_vocabulary.py` enforces every one of these, sentence by sentence, and
`gate_capstone_leak.mjs` direction 11 keeps every graded answer of those
courses out of every H5 text.

## THE VOCABULARY, LEGISLATED AND BINDING

Digest section 34 carries the rule for each: "risk" always qualified
(individual risk, LSIR, IRPA, societal risk); never "severity" or
"likelihood"; FAR always per 100,000,000 exposed hours; PLL is expected
fatalities per year and never a probability; ICAF is the engine's cost per
fatality prevented; never "NPV" or "IRR".

## NO REPAIR HISTORY IS TAUGHT

The engine's FINDINGS record describes six fail-opens closed before it merged.
That is provenance. The course teaches what the engine does today: a preset
name it does not define, `constructor` included, is refused (section 3). A
sentence that begins "the engine used to" is a defect anywhere in these 78
lessons. The published sources' rounding (sections 11, 28 and 32) is about the
SOURCE, and a lesson says so.

## THE COPY RULE

No em dashes, no en dashes, and no "X, not Y" or "X and not Y" contrastive
anywhere a learner reads, headings and titles included. The three engine
strings the digest quotes with a ", not" are the engine's own words. **Never
write a contrastive of your own.**

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. Every lesson carries
between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13, 500
at 14. 132 questions a tier: 15 per module bank plus a 42 question exam.
