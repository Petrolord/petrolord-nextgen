# Seed, draws and what is never graded

{{panel:prms-aggregation-calculator}}

Beside the projects, a Monte Carlo figure depends on the correlation, the seed and the number of draws, each a stated input with no default. This lesson reads the seed and the draws, and the line between a sampled figure and a graded one.

## The seed

The seed starts the mulberry32 generator. The same seed gives the same sequence of draws on any machine, so the same inputs give the same sampled figure. Run the Ekene Reserves again on seed 20271112 with 20000 draws and the P90 is 17.300834 again, identical. On seed 20271113 with the same 20000 draws it is 17.414533. Both are honest estimates of one unknown quantity, and they differ by sampling error.

A call with no seed is refused, verbatim:

> seed must be an integer from 0 to 4294967295 (the mulberry32 seed; no default); got nothing

## The draws

More draws shrink the sampling error. On the 2011 Guidelines blocks, 200000 draws on seed 2011 put the sampled P90 at 76.623299, within 0.030852 of the exact 76.654150. The engine accepts from 100 to 200000 draws; fewer is refused, verbatim:

> iterations must be an integer from 100 to 200000; got 50

The work also has a cap: draws times projects may not exceed 500000, because the correlated draw grows with the square of the project count. The refusal names the most draws the stated projects allow, verbatim:

> iterations must be at most 45454 for 11 projects (iterations x projects at most 500000); got 200000

## What is graded, and what never is

Every graded number in this course is a return value of the engine on fixed inputs: a class, a category, a limit year, an arithmetic sum, a risked mean, a closing. Each has one right answer. No graded figure is a Monte Carlo draw. The sampled P90, P50, P10 and mean of an aggregation are taught with their seed and draw count. None is graded as an exact figure, even though each reproduces exactly on the same seed. A question about them asks what moves them, what they are compared with, or what a report must print beside them.

## Quoting a sampled figure

A sampled figure is quoted with its seed, its draws and its correlation, and called an estimate. The Ekene Reserves P90 is 17.300834 on seed 20271112 and 20000 draws with the stated pairs 0.5, 0.2 and 0.2. Without them it cannot be checked.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". Read the P90 and the heading of the Monte Carlo table. Set the Seed (stated) control to 20271113 and read the P90 again; set it back and confirm the first figure returns exactly. Set the Draws (stated) control to 50 and read the refusal. Then set the seed control to "not stated" and read that refusal. List which figures on the screen moved with the seed and which did not.
