# A seeded generator

Every uniform draw in the Probabilistic Breakeven Analyzer comes from one seeded generator, `mulberry32`, so the same seed gives the same draws in the same order on any machine.

{{panel:ec-breakeven-explorer}}

## The first six draws

`mulberry32(20260829)` starts from the breakeven engine's `DEFAULT_SEED` of 20260829. Its first six draws are:

| draw | u |
| --- | --- |
| 1 | 0.936239 |
| 2 | 0.826447 |
| 3 | 0.952306 |
| 4 | 0.732031 |
| 5 | 0.064278 |
| 6 | 0.391443 |

The generator keeps one unsigned integer of state. Each call adds a fixed odd constant to it, scrambles the bits with shifts and multiplications, and scales the result to a number at least 0 and below 1. Nothing about the clock, the machine or an earlier run enters. Start it from the same seed and it walks the same path. The screening engine's Monte Carlo uses the same generator with its own default, `DEFAULT_MC_SEED`, also 20260829.

## Why it is there

The engine used to sample with a bare `Math.random()`, which cannot be seeded. A sold, gated app returned a different breakeven every run, and nobody could reproduce a number that had been put in front of a board. Now the seed travels with the result. ISIALA's run over 5000 iterations ends its insight with "Run seed 20260829: the same inputs and seed reproduce this result exactly."

## What changes with the seed

At seed 7, ISIALA's median breakeven price over 5000 iterations is 72.8475 USD/bbl. At the default seed it is 73.3297. Neither is wrong: they are two samples of one distribution. Across seeds 1 to 10 at 5000 iterations the medians run from 72.6338 to 73.1287, and the default seed's 73.3297 sits outside that span, above every one of them. The base case at the stated medians, a single solve with no sampling at all, is 71.6277.

## What it refuses

The seed buys reproducibility and nothing else. It does not make 73.3297 more accurate than 72.8475, and it does not make the default seed special. The generator makes no claim to be cryptographic. It is also a single stream: capex, opex and efficiency take turns drawing from one sequence rather than from streams of their own, so a seed fixes the whole run and cannot hold one variable still while another moves.

## The mistake

The mistake a careful analyst makes is seed shopping without meaning to. Run at the default seed and get 73.3297, try seed 7 as a check and get 72.8475, then report whichever reads better, now with a seed to prove it reproduces. Reproducible is not the same as representative. The honest reading is the spread across seeds, which on ISIALA at 5000 iterations runs from 72.6338 to 73.1287, with the default seed above the lot. The second mistake is quoting a median to four decimals as if all four were earned. The seed makes every decimal repeatable, and the spread between seeds shows that even the first decimal moves.

## Exercise

Give the first four draws of `mulberry32(20260829)`. State ISIALA's median breakeven price at the default seed and at seed 7, and the span of medians across seeds 1 to 10. Then write one sentence for a report that quotes the median with its seed and says what the seed does and does not guarantee.
