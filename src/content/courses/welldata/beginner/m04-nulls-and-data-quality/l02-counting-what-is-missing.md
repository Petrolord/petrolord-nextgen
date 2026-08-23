# Counting what is missing

Once the NULL flag is read correctly, the first data-quality number you compute for every curve is its null count: how many of its samples are flagged absent. The count is trivial arithmetic, but it is the single fastest way to grade a curve before anyone interprets it. This lesson walks the whole teaching set's counts and teaches you to read the patterns behind them.

## The counts across the teaching set

Engine truth for the gamma ray curve in all six files, plus the other curves of the two files this module leans on:

| File | Samples | GR nulls | RHOB nulls | NPHI nulls | DT nulls |
| --- | --- | --- | --- | --- | --- |
| basic_20 | 301 | 8 | 9 | 0 | 0 |
| feet_20 | 151 | 6 | 0 | 0 | 0 |
| irregular_20 | 121 | 4 | 9 | 0 | 0 |
| nullheavy_20 | 201 | 71 | 0 | 201 | 0 |
| quirks_20 | 81 | 3 | 9 | 0 | 0 |
| wrapped_12 | 161 | 5 | 9 | 0 | 0 |

Two of these numbers are worth memorising for the capstone: basic_20's GR null count of 8 is one of the six graded values, and nullheavy_20's NPHI count of 201 is another (it gets its own lesson next).

## Reading the patterns

The count alone grades severity; the pattern tells you the cause.

* A few nulls at the ends of a curve, like basic_20's 8 GR nulls out of 301, are the signature of run-in and run-out: the tool starts and stops recording slightly inside the logged interval. The measurements that exist are fine.
* A large contiguous block, like nullheavy_20's 71 GR nulls out of 201, means an interval was simply never logged for that curve: a skipped run, a failed section, or a splice gap. The curve is trustworthy where it reads and absent where it does not, and any zone average that straddles the gap needs a footnote.
* One hundred percent null is a dead curve, a column with no data at all. That is the next lesson.

A null count only becomes meaningful next to its sample count, so always read the pair as a fraction.

## Worked example

Convert the two headline counts to fractions:

1. basic_20 GR: 8 nulls of 301 samples. Fraction = 8 / 301 = 0.0266, so 2.7 percent of the column is absent. This is cosmetic: the curve is essentially complete, and the missing samples sit at the run boundaries.
2. nullheavy_20 GR: 71 nulls of 201 samples. Fraction = 71 / 201 = 0.353, so 35.3 percent of the column is absent. A third of the interval was never logged. The curve is still usable where it reads, but any statistic quoted for the whole interval describes only the 130 samples that exist, and your report must say so.

Same curve mnemonic, same tool physics, completely different data-management verdicts. The count and the fraction are what separate them.

## What the count feeds downstream

Null counts are not trivia. The petrophysics workflow that follows this course computes shale volume, porosity and saturation per sample; a null in any input curve makes that sample's output null too. A curve that is one third absent produces a zone summary that is one third thinner in evidence than it looks. Recording the counts at import time, in the registry alongside the curves, is what lets a later interpreter judge how much rock their averages actually stand on.

## Exercise

Compute the GR null fraction, as a percentage to one decimal, for the four files not worked above: feet_20 (6 of 151), irregular_20 (4 of 121), quirks_20 (3 of 81) and wrapped_12 (5 of 161). Rank the six files from most complete GR to least complete. As a self-check: feet_20 is 4.0 percent, irregular_20 is 3.3 percent, quirks_20 is 3.7 percent and wrapped_12 is 3.1 percent, so the ranking from most to least complete runs basic_20 (2.7), wrapped_12 (3.1), irregular_20 (3.3), quirks_20 (3.7), feet_20 (4.0), and nullheavy_20 (35.3) last by a wide margin. Note in one sentence which single file your ranking would flag for a data-quality conversation before interpretation.
