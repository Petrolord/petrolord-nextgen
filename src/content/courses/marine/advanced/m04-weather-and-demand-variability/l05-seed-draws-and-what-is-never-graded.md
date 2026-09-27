# Seed, draws and what is never graded

{{panel:marine-variability-calculator}}

A Monte Carlo figure is a function of its inputs, its seed and its draw count. Change the seed and the same inputs give a different estimate. That is why every sampled figure in this course is quoted with its seed and its draws, and why no graded answer anywhere in the course is a Monte Carlo figure.

## Another seed, another estimate

The Ekene week on its own seed, and the same inputs on seed 7 (a stated probe), both with 20000 draws:

| figure | seed 20260927, 20000 draws | seed 7, 20000 draws |
| --- | --- | --- |
| mean vessel-days | 10.239206 | 10.249964 |
| P90 (low) | 7.977705 | 8.023594 |
| P10 (high) | 11.908677 | 11.928203 |
| probability short | 0.001400 | 0.001700 |
| vessel-days at the modes (not a draw) | 10.345455 | 10.345455 |

The sampled figures move by a few hundredths. The plan at the modes does not move at all, because it is no draw. Two analysts who quote a P90 without its seed cannot tell whether they disagree or merely drew differently.

## One draw

At the other extreme, one draw on seed 0 (golden input variability-one-iteration, the Ekene inputs) returns 7.648544 vessel-days as its mean, its P90 and its P10 alike. One draw is a single sized week, and it summarises nothing. More draws make an estimate steadier, and cost time: every draw sizes every voyage set.

## The caps on draws

The engine caps the draws at 200000, verbatim:

> iterations must be a whole number from 1 to 200000; got 200001

It also caps the draws times the voyage sets at 2000000, since a dedicated route sizes one set per installation in every draw. With 11 voyage sets the most draws allowed is 181818, verbatim:

> iterations must be at most 181818 with 11 voyage sets (iterations x voyage sets is capped at 2000000); got 181819

## A seed is a whole number

A seed runs from 0 to 4294967295 and there is no default. A negative seed is refused, verbatim:

> seed must be a whole number from 0 to 4294967295 (there is no default, so every run can be reproduced); got -1

## Why nothing sampled is graded

A graded answer must have exactly one right value on any machine. Every graded figure in this course is a return value of the engine on fixed inputs, and the Expert capstone grades six such figures from the shore base. The variability calculator labels every sampled figure as not graded and prints its seed and draws in the heading. A plan still reports the Monte Carlo, with its seed and draws, because a fleet manager needs the spread: it simply is not the part that is marked.

## Exercise

Open the variability calculator on the view "The fleet under weather and demand variability" and start from "Ekene week, PSV milk run, weather and demand". Set Seed (stated) to 7 and compare the statistics table with the seed 7 column above; restore 20260927. Set Draws (stated) to 1 and Seed (stated) to 0 and read the table. Then set Draws (stated) to 200001 and read the refusal.
