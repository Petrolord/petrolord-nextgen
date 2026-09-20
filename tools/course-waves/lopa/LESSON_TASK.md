# H3 Process Safety: LOPA & SIL Determination: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task file
is quoted from it. The engine's FINDINGS record, the oracle and the engine's
source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares the precisions: frequencies per year, probabilities, IPL PFDs and
PFDavg values to TWELVE decimals; risk reduction factors, hours and years to
SIX; failure rates per hour in exponent form as stated; counts and SIL numbers
as whole numbers.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and
re-run it, then `scaffold.py`.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted. `python3 lengths.py --tier <tier>` reads one tier.

Keep the H1 heading that `scaffold.py` writes (the lesson title exactly) and the
panel line where `structure.py` says one goes. An opening paragraph under it,
then short `##` sections ending in `## Exercise`: four or five `##` headings at
Associate and Expert and five or six at Professional, the Exercise included. A
small table, numbers first, and an `## Exercise` that asks the learner to DO
something with a number the lesson printed, never to recall one.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's arithmetic. **No tier's lessons may
use a higher tier's.** An Associate lesson never computes a PFDavg from failure
rates; it takes a proposed SIF's PFDavg as a stated number. A Professional
lesson never finds a longest proof test interval. The kit's `leakage.mjs` judges
a reach by which digest section owns the figure: sections 1 to 13 are
Associate, 14 to 24 Professional, 25 to 31 Expert.

## THE REFUSALS, BY NAME

Digest section 3 tables 29 refusals across 7 functions. **Quote the engine's
message in a blockquote.** A paraphrase teaches a message the learner will never
see. The ones each tier must teach:

* Associate m01 l05: an IEF of zero, no TMEL, a probability of zero, an IPL with
  no name, one IPL named twice.
* Professional m06 l03: an unknown architecture, detected failures with no MTTR,
  a redundant architecture with no beta factor or no betaD, coverage below one
  with no lifetime, and the lambda T refusal.
* Expert m01 l05: a target of one, and no intervals.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The row, sections 4 to 7.** ORONI's 0.45 per year becomes 0.013500000000
   after its enabling condition and modifiers and 0.000013500000 after its two
   credited IPLs; against a TMEL of 1e-6 that is a required RRF of 13.500000,
   SIL1, and a required PFDavg of 0.074074074074.
2. **The band is a label, section 8.** At a TMEL of 1e-7 a SIF of 0.009 is in
   the SIL 2 band and still misses the required 0.007407407407.
3. **The decade, section 11.** 3 of the 5 decade products land at
   100.00000000000001 in double; the snap bands each of them SIL1.
4. **The half, section 14.** The 1oo1 PFDavg of 0.005256000000 is half of
   lambdaDU T, 0.010512000000.
5. **Common cause, section 19.** The 1oo2 turns common cause dominated at a beta
   factor of 0.02 and the 2oo3 at 0.05.
6. **A SIL that holds, section 31.** Stretched to 3.5 years the teaching SIF
   misses its TMEL while it is still SIL 2; it drops to SIL 1 only at 4 years.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices: nothing is invented; credit
only when independent is exactly true; the required PFDavg is the binding
target; an exact decade belongs to the lower SIL, with the snap; outcome states
never clipped; the full Annex B form; no beta factor term in 2oo2; the series
sum. Say what the alternative is and why the engine did not take it, using the
digest's own words.

## THE VOCABULARY

Binding. Digest section 32. Always "beta factor". "PFDavg" for a SIF or a
subsystem, "IPL PFD" for an IPL. Never "severity". "Likelihood" only inside the
TMEL's name. RRF is the risk reduction factor.

## NO HISTORY

This engine has none. A sentence that begins "the engine used to" or "before the
repair" is a defect anywhere in these 78 lessons. The published example's
inferred inputs (Expert m04) are about the SOURCE, and a lesson says so.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included.

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the five legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; the kit's `numsweep.mjs` and
`litsweep.py` for literals that resolve against nothing; `gate_capstone_leak.mjs`
WITH ITS LESSONS DIRECTION (direction 10) for any capstone facility, distinctive
input or answer; `lengths.py` for the band; and `gate_claims.mjs` for every
number in every brief. Read the counts rather than the exit code.
