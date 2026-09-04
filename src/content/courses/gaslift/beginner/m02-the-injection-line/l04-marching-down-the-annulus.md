# Marching down the annulus

A gradient that changes at every depth cannot be multiplied by a depth. It has to be walked, and the walk has to be checked against something outside itself.

{{panel:pd-column-explorer}}

## The walk

The column is stepped from surface to depth with a predictor and a trapezoidal corrector on the gradient, which makes it second order: each doubling of the step count cuts the remaining error by about four. At its 40 step default it agrees with an independent oracle to 1.251e-4, 9.973e-4 and 1.209e-5 psi on the three published columns. That is agreement between implementations, not with physics.

## Two closed forms, not one

Pin z at 1 and hold the temperature constant and the march has an exact answer to reproduce. There are two of them. The textbook form uses a rounded coefficient, exp(0.01875 sg D / T). The engine uses its own constants, AIR_MW of 28.9625 and R of 10.7316, giving AIR_MW / (144 R) = 0.0187417041, lower by 4.4264e-4 relative. At 1014.7 psia, 8000 ft, gas gravity 0.65 and 140.0 degF they read 1193.848862916 and 1193.762984148 psia, 8.5879e-2 psi apart before a single step is taken.

| Steps | March, psia | Textbook error, psi | Engine constant error, psi |
| --- | --- | --- | --- |
| 2 | 1193.869339003 | 2.0476e-2 | 1.0635e-1 |
| 10 | 1193.767253577 | -8.1609e-2 | 4.2694e-3 |
| 40 | 1193.763251026 | -8.5612e-2 | 2.6688e-4 |
| 200 | 1193.762994823 | -8.5868e-2 | 1.0675e-5 |
| 2000 | 1193.762984255 | -8.5879e-2 | 1.0676e-7 |

## Two kinds of error in one table

One column keeps falling, 2.6688e-4 then 1.0675e-5 then 1.0676e-7 psi. That is truncation, and refinement removes it. The other parks, at -8.5868e-2 then -8.5879e-2 psi, and refinement never touches it, because it is not an error in the walk at all. It is the fourth significant figure of a constant, and 4.4264e-4 relative is the size of the floor.

## The move that settled it

This course's own reference material first printed the textbook form alone and read the flat sequence as convergence. The gate could not fail: it was measuring a fixed constant mismatch. A second reference settled it, the same move as holding a column at its wellhead temperature to find out whether compression or the geotherm sets its gradient. Hold one thing still, and the explanation doing the work shows itself.

## The mistake

Taking the coarsest row as the best because its error is smallest in size. At 2 steps the textbook error is 2.0476e-2 psi against -8.5612e-2 psi at 40 steps, but the sign flipped in between, so the 2 step march is passing through that reference on its way to the wrong side of it. Against the engine's own constant it is the worst row, at 1.0635e-1 psi.

## What it refuses

The column it walks is static. No friction, no velocity, no injection gas rate, so what comes back is a shut-in casing column.

## Exercise

March the case at 2, 10, 40, 200 and 2000 steps and write both errors at each count.

Then say which sequence measures the march, and what the other measures.
