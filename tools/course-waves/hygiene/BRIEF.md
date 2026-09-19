# H2 Occupational Hygiene: Noise, Chemical & Heat Exposure: the wave brief

**Read this before anything else, and read `digest.txt` beside it.** Slug
`hygiene`, prefix `h2`, the second course of the academy's `hse` module,
path_order 62.

## THE ONE RULE ABOUT NUMBERS

**Every figure in this brief is quoted from `digest.txt`, and so is every figure
you will write.** The digest is the only teaching truth for this course. Three
other files in and around this wave look like truth and are not:

| file | what it is |
| --- | --- |
| `FINDINGS-exposure.md`, vendored beside the oracle | PROVENANCE. The engine's record of sources, errata and judgement calls. Where the digest restates a finding it re-measures it through the engine. |
| the engine's own source comments | PROVENANCE. |
| `fields.json` and `h2_capstone.mjs` | THE ANSWER KEY. Never quote from either in a lesson, a bank or a key truth. |

`gate_claims.mjs` checks every number in every brief in this wave against the
digest.

## THE COURSE STATEMENT, IN ONE SENTENCE

An exposure figure is a measurement read against a criterion, and it means
nothing until the criterion is named, so the course reads one record three ways,
builds each metric from the formula its source prints, and says for every
formula how strong the evidence behind it is.

## THE HEAT DECISION, AND ITS REASON

**Decision.** No graded field passes through the NIOSH 2016-106 RAL or REL
equation, a margin against one, an exceedance verdict, or a WBGT built from
globe, wet bulb and dry bulb readings. The course TEACHES all of them, as "the
NIOSH 2016-106 section 8.1 equation, checked for transcription only", with that
status beside every figure in the digest, the panel and the lessons. The two
heat quantities the Expert capstone grades are one-hour time weighted averages
of readings the capstone STATES: the WBGT the instrument read out, and the
metabolic rates.

**Reason, three parts, each in the digest.**

1. The RAL constants (59.9, 14.1), the REL constants (56.7, 11.5) and the WBGT
   weights (0.7 and 0.3 indoors; 0.7, 0.2 and 0.1 outdoors) are checked for
   TRANSCRIPTION ONLY (digest section 2). The engine and the oracle each copied
   them from the same page, and FINDINGS section 6 records that planting the same
   error in both files left the suite green for the WBGT outdoor weights and the
   REL slope. A graded answer that a shared misreading would still pass is not
   graded on evidence.
2. NIOSH's own worked example disagrees with its own equation (digest section
   18): at 348.900000 W the equation gives 27.458939 C and the document prints
   27.800000 C, read off its figure; for the RAL, 24.047916 C against 25.000000 C.
   A learner who follows the document's figure would be marked wrong while doing
   exactly what the document shows.
3. The time weighted averages are ARITHMETIC BY DEFINITION: the only constant is
   the sixty-minute window. That is why they are gradeable and the limits are not.

The same rule removes three more things from grading: the NIOSH protector
derating by type, the OSHA dual-protection 5 dB, and the Brief and Scala WEEKLY
factor on its own. All three are ORACLE ONLY (digest section 2).

## THE SECOND DECISION: WHAT FIXES 16.61

OSHA Table A-1 does not separate the printed 16.61 from the exact coefficient 5
over log10 2: 0 of its 150 rows reject the exact one, because the two differ by
0.000359525563 dB and the table prints one decimal (digest section 5). NIOSH Table
1-2 does separate its printed 10.0 from the exact one, 49 of 83 rows. So the OSHA
TWA and the extended-shift action level are graded on **the coefficient the
mandatory Appendix A TEXT writes**, which is 16.61, and the table reproduces them
to its printed decimal. That is recorded as a decision rather than claimed as a
table result, and the Associate lesson on the two printed coefficients teaches
exactly this distinction.

## THE THIRD DECISION: THE WEEKLY LEX AND THE STEL

The weekly LEX has one published case, five equal days at 85 dBA giving 85,
which any averaging reproduces (digest section 2). It is graded because the
Professional capstone gives FIVE days, so the statutory divisor of 5 equals the
day count and no transcription-only constant can move the answer: the capstone
generator measures the two agree to 1e-12. The STEL is a fifteen-minute time
weighted average by definition, and its capstone prompt STATES that the rest of
the window counts as zero.

## WHAT THIS COURSE NEVER GRADES

Digest section 23 is the authority: every heat limit, margin and verdict; every
WBGT built from thermometer readings; the NIOSH derating by type; dual
protection; the Brief and Scala weekly factor on its own; any verdict word; any
licensed limit. The engine's judgement calls J1 to J10 are TAUGHT BY NAME, and no
capstone input sits on the boundary of one (digest section 23 lists which).

## THE FIGURES A LEARNER WILL MEET FIRST, ALL QUOTED FROM THE DIGEST

**One record, three criteria** (digest section 7, the OBEN walkdown):

| criterion | noise dose, percent | TWA, dBA | exceeds its limit |
| --- | --- | --- | --- |
| OSHA PEL | 27.748183 | 80.752126 | false |
| OSHA action level | 72.054478 | 87.635749 | true |
| NIOSH noise REL | 265.610944 | 89.242460 | true |

The loudest period carries 31.811200 percent of the PEL noise dose. The time left
at 95 dBA after that day is 173.404361 minutes.

**The daily and weekly levels** (sections 11 and 12): HSE L108 Figure 26 is
reproduced at 86.613302 dBA and 144.987371 points against a printed 87 and 145.
The teaching day is 86.646970 dBA. A longer day divided by 8 is 87.207845 dBA,
and the same energy over its own hours is 86.026852 dBA. The five-day week is
85.461288 dBA against an arithmetic mean of 84.860000.

**Protectors** (section 13): the OSHA Technical Manual example gives 89.000000
dBA under the field derating and 80.000000 dBA under Appendix B. The teaching
case gives 87.600000 and 77.600000 dBA.

**Chemicals** (sections 14 and 15): the partial record's 8-hour TWA is 30.125000
ppm against 35.703704 ppm averaged over its own hours; the short STEL record is
92.333333 ppm; the teaching mixture's index is 1.059500 while its largest single
term is 0.385000.

**Heat** (sections 16 and 17): indoor 30.090000 C, outdoor 31.410000 C, the same
outdoor readings through the indoor form 32.560000 C; the teaching hour averages
29.066667 C against a plain mean of 28.200000 C, at 300.000000 W.

**The long shift** (section 20): the ten-hour action-level noise dose is
57.350093 percent; rescaled to eight hours it would be 45.880074 percent, which is
not the quantity Appendix A defines.

## THE VOCABULARY COLLISIONS, LEGISLATED AND BINDING

Digest section 24 carries the rule for each. A lesson, bank question, key truth
or panel string that breaks one is a defect.

1. **"noise dose"**, never bare "dose": the Flow Assurance and Gas Processing
   courses dose inhibitors and methanol.
2. **"noise exposure", "chemical exposure", "heat exposure"**, never bare
   "exposure": three courses use it for money.
3. **"sound level"** for a reading: three courses use "noise" for scatter in data.
4. **"decibel exchange rate"**: the Economics courses have currency.
5. **"heat stress"**: the Heat Transfer course has heat duty and two Facilities
   courses have flare radiation.

And **"NIOSH noise REL" and "NIOSH heat REL"** are two different limits with the
same acronym; the OSHA "action level" and the EU "action values" are different
metrics.

## THE SCOPE SEAMS: CITE, DO NOT TEACH

Digest section 25. Flare and pool-fire radiation belongs to Separation and
Relief; BTEX as an emission to Gas Processing; incident rates to Safety
Performance Statistics, the first course of this module; the risk matrix to Risk,
Change and Learning.

## LICENSED MATERIAL

ACGIH TLVs, ISO 9612 and ISO 7243 text are licensed. **Never quote one.** Every
limit in this course is an input typed from a public OSHA or NIOSH value.

## THE SHAPE OF THE WAVE

78 lessons: 3 tiers, 6 modules a tier, 26 lessons a tier. `structure.py` is the
authority on keys, titles, minutes and panel tags and it self-checks. Each lesson
carries between its own minimum and 560 prose words: 420 at 12 minutes, 460 at 13,
500 at 14.

| tier | slice | modules |
| --- | --- | --- |
| Associate | NOISE DOSE AND ITS CRITERIA | Associate m01 the dosimeter day; Associate m02 noise dose to TWA; Associate m03 three criteria; Associate m04 reading a record; Associate m05 inverse questions; Associate m06 the capstone |
| Professional | PROTECTION AND CHEMICALS | Professional m01 LEX,8h; Professional m02 the week; Professional m03 protector estimates; Professional m04 chemical averages; Professional m05 mixtures; Professional m06 the capstone |
| Expert | HEAT, THE LONG SHIFT, AND READING THE EVIDENCE | Expert m01 WBGT; Expert m02 metabolic rate and the NIOSH limits; Expert m03 how strong each equation is; Expert m04 errata in the standards; Expert m05 the shift that is not eight hours; Expert m06 the sampling decision |

Three capstones, 6 graded fields each, 18 in all. `fields.json` is the answer key
and the tolerance of every field is made in exactly one place,
`gradedTolerance.js` in the NextGen repository. **Never type a tolerance.**

THIS ENGINE HAS NO REPAIR HISTORY. There is no history module, and a sentence
about what the engine "used to" do is a defect anywhere in this wave. Expert m04
is about the SOURCES, which print values their own formulas refute; that is
current and permanent.
