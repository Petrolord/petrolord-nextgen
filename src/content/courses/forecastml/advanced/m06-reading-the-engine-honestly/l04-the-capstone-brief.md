# The capstone brief

{{panel:pf-uncertainty-explorer}}

The Expert capstone grades 6 fields, and every one answers the Expert question: how uncertain is a data-driven forecast, how does it stand against the Arps baseline, and which of the engine's rules decide the answer? Each field is a figure the engine returns, graded against the engine's own result on a field of wells you have not seen in this course.

| graded field | where it comes from |
| --- | --- |
| a P90 (low) | the residual bootstrap of a fitted damped method on the first well, at a stated step, seed and nSims |
| a P10 (high) | the same bootstrap, at the same stated step |
| a P50 | the same bootstrap, at a second stated step |
| a Di per month | the Arps baseline on the first well, Auto-Select |
| the Arps row's MASE | a comparison on the second well, from a stated first origin, horizon and step |
| the best row's MASE | the same comparison, the method it ranks first |

## What you are given

A field of two wells in the same layout as the Ekene field: one monthly rate series each, oldest month first, in bbl/d. The second well has a shut-in and a restart. The brief states every setting a field depends on: the method, h, the seed, nSims and nonNegative for the bootstrap; the model for Arps; the first origin, horizon, step, metric and refit for the comparison. None of the capstone's values appear anywhere in this course, and every figure in these lessons belongs to the Ekene wells.

## How to work it

Work each field in the panel view that teaches it. For the bootstrap, set the method, h, seed and paths exactly as stated, and read the percentile at the step asked for, with P90 as the low case and P10 as the high case. For Arps, read Di per month; the month is passed as a day, so no conversion is needed or wanted. For the comparison, set the origins as stated, rank by MASE, and read the arps row and the row the ranking puts first.

## What catches people

Reading the P90 as the 90th percentile of the paths, which is the high case. Changing the seed or the number of paths, which moves every percentile. Counting steps from 0: step 1 is the first month after the series. Converting Di to a per-day or per-year figure. Reading the best row as whatever is listed first in the table of rows, when the ranking names it. Forgetting that Arps drops the shut-in months, which changes what its fit sees at the later origins.

## A rehearsal on the Ekene wells

Every step can be rehearsed in the panel. Damped on EKENE-P1, seed 11, 1000 paths: P90 (low) 83.953419 and P10 (high) 262.377587 at step 6, and P50 137.469798 at step 12. The Arps baseline on EKENE-P1 gives Di 0.060069 per month. EKENE-P2 compared from first origin 28, horizon 6, step 3, ranked by MASE: arps 0.605968, and holt best at 0.571171. If your panel work reproduces those, your method is the engine's.

## Exercise

Before you open the capstone, run all six rehearsal steps in the panel and write each result beside the field it rehearses, with its conditions. Then mark which of the six would move if you changed the seed, and which would move if you changed the first origin.
