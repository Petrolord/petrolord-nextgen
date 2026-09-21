# H5 Quantitative Risk Assessment: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task file
is quoted from it. The engine's FINDINGS record, the oracle and the engine's
source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares the precisions: frequencies, individual risks and PLL per year, and
probabilities, to TWELVE decimals; FAR values, ratios and fatality counts that
need not be whole to SIX; money to TWO; hours and years as whole numbers;
stated inputs as typed.

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
use a higher tier's.** An Associate lesson never computes a PLL, a FAR, an F-N
curve, an ALARP band or a cost-benefit figure. A Professional lesson never bands
an individual risk against the R2P2 thresholds and never weighs a measure. The
kit's `leakage.mjs` judges a reach by which digest section owns the figure:
sections 1 to 14 are Associate, 15 to 24 Professional, 25 to 33 Expert.

## THE SEAMS, SENTENCE BY SENTENCE

`gate_vocabulary.py` reads every sentence. A sentence that names a probit, a
dose, a plume, dispersion or a source term must say, in the same sentence, that
it belongs to the consequence course, or that the probability of death is a
stated input. A sentence that names LOPA, a SIL, a PFDavg, an IPL or a TMEL must
say it belongs to the LOPA course. A sentence that names a risk matrix must say
it belongs to the risk and change course or that this course never scores one.
Never write "severity", "likelihood", "NPV", "IRR" or "payback".

## THE REFUSALS, BY NAME

Digest section 3 tables 39 refusals across 13 functions. **Quote the engine's
message in a blockquote.** A paraphrase teaches a message the learner will never
see. The ones each tier must teach:

* Associate m01 l04: an empty branch set, a branch set that sums below one, a
  probability of death above one, both a fraction and hours, fractions that sum
  above one.
* Professional (m01 or m05): negative fatalities, no exposed hours, a criterion
  preset the engine does not have, a name every object inherits.
* Expert (m01 or m04): no thresholds, no VPF, a DF below one, a lifetime that is
  not whole years, a measure that prevents nothing.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The tree, sections 7 and 8.** EREMOR's release at 5e-4 per year gives an
   explosion frequency of 0.000054000000; taking delayed ignition as
   unconditional gives 0.000060000000, and swapping the split gives
   0.000081000000.
2. **The place, section 10.** The process deck LSIR is 0.000148150000 per year,
   and the flash fire carries 0.546743 of it.
3. **The person, section 12.** The EREMOR operator's IRPA is 0.000017541379 per
   year; summing the LSIRs with no occupancy gives 0.000154803000.
4. **The crew, sections 15 and 16.** The JISIKE crew PLL is 0.002420000000
   fatalities per year and its FAR is 2.016667; over one person's hours it
   would read 121.000000.
5. **N or more, sections 17 and 18.** F(3) is 0.000049700000 per year; reading
   "more than N" gives 0.000009700000 at the same corner.
6. **The measure, sections 29 to 31.** The EDIKAN firewall's cost over benefit
   is 8.750000 undiscounted and 9.350247 at the checklist limits, and it is
   NOT_GROSSLY_DISPROPORTIONATE only at a DF of 10.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices: nothing is invented; every
branch set sums to one within a tolerance; a probability of death is an input;
"N or more"; a threshold value in the lower band, with the snap; year-end present
values and an undiscounted count of fatalities prevented. Say what the
alternative is and why the engine did not take it, using the digest's own words.

## THE VOCABULARY

Binding. Digest section 34. "Risk" always qualified. Never "severity" or
"likelihood". FAR per 100,000,000 exposed hours. PLL is expected fatalities per
year. ICAF is the engine's cost per fatality prevented. Present value, never
"NPV".

## NO HISTORY

A sentence that begins "the engine used to" or "before the repair" is a defect
anywhere in these 78 lessons. A published source's rounding (sections 11, 28 and
32) is about the SOURCE, and a lesson says so.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" or "X and not Y" contrastive.
Headings included.

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words and the seams; the kit's
`leakage.mjs` for graded answers and cross-tier reaches; the kit's `numsweep.mjs`
and `litsweep.py` for literals that resolve against nothing;
`gate_capstone_leak.mjs` WITH ITS LESSONS DIRECTION (direction 10) and its SEAM
DIRECTION (direction 11); `lengths.py` for the band; and `gate_claims.mjs` for
every number in every brief. Read the counts rather than the exit code.
