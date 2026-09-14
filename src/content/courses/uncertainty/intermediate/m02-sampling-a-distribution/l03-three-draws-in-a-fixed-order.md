# Three draws in a fixed order

Each iteration of the breakeven Monte Carlo takes exactly three draws from the generator: capex first, opex second, efficiency third.

{{panel:ec-breakeven-explorer}}

## Iteration 1 owns draws 1 to 3

The loop calls the generator once for capex, once for opex and once for efficiency, then solves the breakeven price for that trio.

| draw | u | variable | F(mode) | branch | sampled value |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.936239 | capex | 0.331225 | upper | 226.5205 |
| 2 | 0.826447 | opex | 0.233597 | upper | 24.4593 |
| 3 | 0.952306 | efficiency | 0.599919 | upper | 97.2265 |

## Iteration 2 starts at draw 4

The generator's next three draws are 0.732031, 0.064278 and 0.391443, and they belong to iteration 2 in the same order. Comparing each with its F(mode) gives the branch. Capex takes 0.732031, above 0.331225: the upper branch, a capex above the mode of 168.6738. Opex takes 0.064278, below 0.233597: the lower branch, an opex between the fitted minimum of 13.3201 and the mode of 17.4160, and below the stated 10th percentile of 16 because 0.064278 is below 0.1. Efficiency takes 0.391443, below 0.599919: the lower branch, and below the stated median of 91 because the draw is below 0.5. The course prints no sampled values for iteration 2, only the draws.

## Why order is part of the input

Draws belong to positions, not to variables. Iteration 2's capex is draw 4, never draw 2. The order is fixed inside the engine, which finds capex, opex and efficiency by name, so rearranging the variables on the input screen changes nothing. A change to the engine that added a draw or swapped two would move every sampled value in the run, even at the same seed. An iteration that cannot break even below 500 USD/bbl still consumes its three draws before the solve comes back empty, so an excluded iteration never shifts the draws of the ones after it.

## What it refuses

Three draws per iteration means three independent variables and no more. There is no fourth draw for a price, a reserve or a delay, and no way to tie capex to opex. A high draw 1 carries no information about draw 2, and the sample reflects that design.

## The mistake

The mistake is reading draw k as belonging to iteration k. A reviewer rebuilding iteration 2 by hand takes draw 2, 0.826447, as its capex, gets an upper-branch capex, and decides the engine's sample is wrong. Iteration 2's capex is draw 4, 0.732031, and its opex is the low 0.064278. The same reviewer, having got the alignment right once, can then lose it again by dropping an excluded iteration from the count, which would slide every later iteration onto the wrong draws.

## Exercise

Name the draws iteration 2 uses and assign each to its variable. For each, say which branch it takes and whether the sampled value sits above or below the stated median. Then explain why an excluded iteration does not shift the draws of the iterations after it.
