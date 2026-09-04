# What more steps buy

A claim that a method converges is worth nothing. The sequence it converges along is worth everything, so here is the whole sequence for published column 1, surface 1014.7 psia over 8000.0 ft.

{{panel:pd-column-explorer}}

## The sequence

| Steps | Column at depth, psia | Error, psi | Ratio to the row above |
| --- | --- | --- | --- |
| 1 | 1215.911062391 | 1.9436e-1 | |
| 2 | 1215.766386962 | 4.9682e-2 | 3.9121 |
| 4 | 1215.729194295 | 1.2489e-2 | 3.9780 |
| 5 | 1215.724703423 | 7.9981e-3 | 1.5615 |
| 10 | 1215.718706541 | 2.0012e-3 | 3.9966 |
| 20 | 1215.717205730 | 5.0041e-4 | 3.9992 |
| 40 | 1215.716830429 | 1.2511e-4 | 3.9998 |
| 80 | 1215.716736598 | 3.1277e-5 | 4.0000 |
| 160 | 1215.716713140 | 7.8189e-6 | 4.0002 |
| 320 | 1215.716707275 | 1.9543e-6 | 4.0008 |
| 640 | 1215.716705809 | 4.8819e-7 | 4.0032 |
| 1280 | 1215.716705443 | 1.2166e-7 | 4.0126 |

Errors are measured against a 20000 step march of the same column.

## Reading the ratio column

Every doubling of the step count divides the remaining error by close to 4. That is the signature of a second order method behaving exactly as its order predicts, and it is the single most informative column here. The row at 5 steps breaks the pattern with a ratio of 1.5615, which is not a defect: 5 is not a doubling of 4, so it does not get a doubling's worth of improvement.

A ratio that drifted well below 4 as the steps rose would say the method was losing its order. A ratio that collapsed toward 1 would say the error had stopped being truncation and become something else.

## The headline

20 steps gives 1215.717205730 psia and 2000 steps gives 1215.716705370 psia, a spread of 5.0036e-4 psi on a column that lifts 201.0167 psi. As a fraction of the lift that is 2.4891e-6.

The worst of the published blocks is deepHighPressure at its packer: a spread of 3.5210e-3 psi on a column lifting 407.5654 psi, a fraction of 8.6391e-6. The best is constantPressurePPO at 3.1736e-5 psi on 220.9276 psi of lift.

## The mistake

Buying steps you cannot use. Going from 20 to 1280 on column 1 recovers well under a thousandth of a psi for a large multiple of the work. Nothing downstream can see it: valve depths converge to 0.01 ft and closing tests turn on fractions of a psi. Refinement past the point where the next digit is invisible is effort spent on a report, not on a design.

## What more steps refuse to buy

Correctness of the model. Every row of that table marches the same static column with the same declared gradients, so all 1280 steps agree with each other about a well that has no friction in it.

## Exercise

Run column 1 at 10, 20 and 40 steps and record the three pressures.

Divide each error by the next and say what you would conclude if the two ratios came back near 2 instead.
