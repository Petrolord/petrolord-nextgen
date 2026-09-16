# Viscosity arrives as a correction

{{panel:fc-sizing-explorer}}

Viscosity does not appear in the liquid sizing equation. It appears in a correction applied to that equation, written Kv, and the correction is a function of one Reynolds number and nothing else.

## What the correction is worth on AKASO

Left out entirely, the AKASO area is 1.839323 in2 at a Kv of 1.000000, with no Reynolds number and no iterations. Put the stated 85.000000 cp back in and the engine returns an area of 1.867758 in2 at a Kv of 0.984776, with a Reynolds number of 17412.317969, reached in six passes, reported as converged, on a residual of 0.000000000000.

The ratio of the two areas is 1.015459516779. That figure is quoted here because the digest computes and prints it. Nothing else in this lesson divides one area by another. Where the digest prints no ratio, the two figures are not in a relationship this engine works out.

## The whole span of it

The same case with the viscosity walked from nothing to a heavy oil.

| viscosity cp (stated) | area in2 | Kv | Reynolds | iterations |
| --- | --- | --- | --- | --- |
| 0.000000 | 1.839323 | 1.000000 | n/a | 0 |
| 1.000000 | 1.839323 | 1.000000 | 1491443.555990 | 1 |
| 5.000000 | 1.839323 | 1.000000 | 298288.711198 | 1 |
| 20.000000 | 1.846802 | 0.995950 | 74421.009125 | 5 |
| 85.000000 | 1.867758 | 0.984776 | 17412.317969 | 6 |
| 300.000000 | 1.904951 | 0.965548 | 4885.090330 | 7 |
| 1200.000000 | 1.995916 | 0.921543 | 1193.117870 | 8 |
| 5000.000000 | 2.295843 | 0.801154 | 266.989810 | 12 |

Four directions come straight off that table. A more viscous liquid gives a lower Kv, a larger required area, a lower Reynolds number and more passes through the loop. All four hold across every row, and the iteration count is the engine's own report rather than something counted from outside.

The two rows at 1.000000 and 5.000000 cp are the interesting ones. Both return exactly the inviscid area of 1.839323 in2 at a Kv of 1.000000, even though a Reynolds number was computed and reported for each. The correction is held at one above a Reynolds number of 196282.561354814417, and both of those rows sit above it. So a stated viscosity that changes nothing is not a bug in the call. It is the clamp doing its declared job, and the last lesson of this module takes the clamp apart.

## The correction only ever adds area

Across the whole of that table the corrected area is at or above the inviscid one, and the correction is at or below one. That is the physical direction you would want: a viscous liquid is harder to push through an orifice, so the valve has to be larger to pass the same rate. A correction for viscous drag that made a valve smaller would be saying the opposite.

## Where the correction comes from, and what that costs

The correction is an empirical fit. One divided by Kv is the sum of three terms in the Reynolds number, and the three coefficients of those terms are 0.993500000000, 2.878000000000 and 342.750000000000.

Those three numbers are held for literature in this course. No route in this package can derive any of them, and the validation oracle shares the same three on purpose and says so in its own header, which means the oracle cannot check them either. They are taught here as a stated limit of the method. Nothing graded in this course rests on their values, and a sentence claiming the fit has been validated would be false.

## Exercise

Write down the four directions the viscosity table shows. Then explain why the rows at 1.000000 and 5.000000 cp return the inviscid area, naming the Reynolds number above which the correction is held at one.
