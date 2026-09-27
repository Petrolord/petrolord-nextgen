# A sum of low estimates

{{panel:prms-aggregation-calculator}}

The arithmetic 1P of the Ekene Reserves is 15.809794 MMbbl, the sum of three low estimates. Each low estimate is a P90: a quantity its project meets or exceeds with at least 90 percent probability. The total of three P90s looks like the P90 of the total. It is so in one case only, and the engine says which in every aggregation it runs.

## The engine's sentence

On the Ekene Reserves at the field level, verbatim:

> the arithmetic sum of the low estimates is not the P90 of the total: it is the P90 only when every project is totally dependent (PRMS 4.2.5.2); here the statistical low exceeds it by 1.49104 and the arithmetic high exceeds the statistical high by 1.921909

Total dependence means that when one project comes in at its low estimate, every other project does too. Then the lows arrive together, and the sum of the lows is the low of the total. With any independence between projects, a shortfall in one tends to be offset by a better outcome in another. The total's own low sits above the sum of the lows, and the total's own high sits below the sum of the highs.

## The two sides, on Ekene

| figure | arithmetic (engine) | sampled on seed 20271112, 20000 draws (an estimate) |
| --- | --- | --- |
| low | 15.809794 | 17.300834 |
| best | 26.396958 | 26.430497 |
| high | 38.387162 | 36.465253 |

The sampled figures come from the canonical seeded Monte Carlo, which the next module opens; they are estimates, and none is graded. The arithmetic figures are exact return values of the engine.

## Why the gap matters

A reader who takes 15.809794 as the P90 of the total believes the field is less likely to beat it than it is: the conservative side of the caution the engine prints above the field level. The arithmetic sum is still the figure the SEC rule asks for above that level. It is a sum of low estimates, and the report calls it that.

## What moves the gap

The correlation between projects is a stated input with no default. The arithmetic sum does not read it: 15.809794 is the same under every correlation. The sampled low reads it, and moves toward the arithmetic sum as the stated correlation rises. On Ekene, with a uniform correlation of 0.95 and the same seed and draws, the sampled P90 is 15.891238. The second module of this tier works that through.

## Where the P90 label comes from

The engine labels the low case P90 through lib/conventions/percentile.js. Its sampled low is the 0.1 quantile of the sampled totals, the value that 90 percent of the draws meet or exceed. That is a reading the engine states in its basis. The label on the arithmetic sum is an outcome label only: the engine does not claim a probability for a sum of stated estimates.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". Read the arithmetic table and the Monte Carlo table, and subtract to find the two gaps the engine's sentence prints. Then switch to "Ekene Reserves, strongly correlated" and to "Ekene Reserves, independent", and for each write the arithmetic 1P and the sampled P90 with its seed and draws. Say which start brings the two lows closest together, and why.
