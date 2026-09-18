# Three regimes in one fit

{{panel:fc-fire-drum-explorer}}

Walk the droplet size across four orders of magnitude and the settling calculation passes through three quite different regimes. The correlation covers all three, and the way the iteration count moves is the clearest picture of what it is doing.

## The droplet size walked, on the ODIDI vapour

| droplet micron | dropout velocity ft/s | drag coefficient | Reynolds | passes |
| --- | --- | --- | --- | --- |
| 5.000000 | 0.029283 | 240.000000 | 0.006587 | 3 |
| 20.000000 | 0.058566 | 240.000000 | 0.052692 | 4 |
| 60.000000 | 0.249724 | 39.600545 | 0.674035 | 44 |
| 150.000000 | 1.183722 | 4.406172 | 7.987529 | 33 |
| 400.000000 | 4.005010 | 1.026414 | 72.066751 | 19 |
| 900.000000 | 7.984159 | 0.581104 | 323.253352 | 15 |
| 2000.000000 | 13.594845 | 0.445401 | 1223.138436 | 12 |
| 6000.000000 | 25.504827 | 0.379644 | 6884.065258 | 9 |

Every row converged. Read the columns rather than any single row.

## The capped regime at the top of the table

The first two rows share a drag coefficient of exactly 240.000000. That is the correlation's low-Reynolds cap, measured out of the engine: the coefficient stops moving at 240.000000000000, and the Reynolds number just inside the cap is 0.104182271364.

Inside the cap the drag coefficient is a constant, so the balance becomes an explicit expression and the loop finishes in three or four passes. That is why the two smallest droplets are the cheapest rows in the table. It is also why they are the least informative: a case sitting in the cap tells you nothing about the shape of the fit.

## The expensive middle

Read the pass column. It rises sharply once the cap is left behind, peaks in the third row, stays high in the fourth, then falls away steadily. Those two are where the fit is steepest in the Reynolds number, so each pass moves the answer a long way and the loop takes many small steps to settle.

The direction is the lesson: a slow convergence is a signal about where on the curve you are sitting rather than a sign of trouble. Every row here converged, including the slowest.

## The high-Reynolds end

At the bottom of the table the drag coefficient flattens towards the value a large sphere in turbulent flow carries, and the loop finishes in nine passes. The velocity rises the whole way down, because a larger droplet is heavier for its frontal area.

## Why the regimes matter for a drum

A flare knockout drum is usually sized for a droplet somewhere in the middle of this table, which is the part of the curve where the drag coefficient is moving fastest. That has a practical consequence: the settling velocity is sensitive to the droplet size you chose, and the droplet size is a design decision rather than a measurement.

So two engineers sizing one drum can produce different lengths with no arithmetic error between them, because they chose different droplets. The choice belongs in the case record beside the answer, as the drainage answer belongs beside a fire duty.

## Held for literature

The three terms of the drag correlation and the cap are an empirical fit. The validation oracle shares the fit with the engine deliberately and records that it does, so the four published dropout rows check the arithmetic and the unit packaging around the fit while the fit itself stands unchecked.

| published velocity ft/s | engine velocity ft/s | relative difference | engine drag coefficient |
| --- | --- | --- | --- |
| 1.738917 | 1.738915 | 9.635e-7 | 0.857357 |
| 2.529020 | 2.529018 | 8.226e-7 | 0.467610 |
| 1.202999 | 1.202998 | 1.171e-6 | 2.416716 |
| 2.353646 | 2.353644 | 8.676e-7 | 0.567839 |

Four rows agreeing to about the sixth decimal place, which is the precision the published velocities carry. Reading those rows as evidence that the correlation is right misreads what they check.

## Exercise

Give the drag coefficient cap and the Reynolds number just inside it. Then say which part of the table takes the fewest passes and which takes the most, explain why in one sentence each, and state what the four published dropout rows do and do not check.
