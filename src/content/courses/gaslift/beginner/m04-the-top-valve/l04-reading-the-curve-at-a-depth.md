# Reading the curve at a depth

`injectionPressureCurve` marches the column at a fixed number of samples and then answers any depth you ask for by drawing a straight line between the two nearest samples.

{{panel:pd-column-explorer}}

## Two errors, not one

A depth landing on a tabulated sample carries only the error of the march. A depth between two samples carries that plus the straight line, and the straight line is the larger of the two. Column 1, surface 1014.7 psia over 8000 ft, against a converged march of the same column.

| Samples | Spacing, ft | At the sample at 4000.0 ft, psi | Between samples, psi | Chord component, psi |
| --- | --- | --- | --- | --- |
| 4 | 2000.0000 | 7.1851e-3 | -2.0920e-2 | -2.9517e-2 |
| 8 | 1000.0000 | 1.7990e-3 | -5.6267e-3 | -7.6086e-3 |
| 16 | 500.0000 | 4.4991e-4 | -1.4590e-3 | -1.9322e-3 |
| 32 | 250.0000 | 1.1249e-4 | -3.7145e-4 | -4.8688e-4 |
| 64 | 125.0000 | 2.8122e-5 | -9.3713e-5 | -1.2220e-4 |

At every row the sample reading is positive and small while the reading between samples is negative and several times larger. The chord does most of the damage, in one direction.

## Why the sign never changes

The local gradient falls slightly with depth on these columns, 0.025405143 psi/ft at surface and 0.024893071 psi/ft at 8000 ft, which makes the pressure curve concave. A chord drawn under a concave curve sits below it, so an interpolated pressure reads low. On column 2 the same effect gives a chord component of -1.4845e-1 psi at 4 samples and -6.2803e-4 psi at 64, and on column 3, -8.3591e-3 psi and -3.3414e-5 psi. Negative in every row of every column.

## What the engine actually uses

The march runs at 20 steps for spacing and valve settings, and the plotted curve is tabulated at 40. At those resolutions the chord component is thousandths of a psi or smaller on systems of over a thousand psia, so it changes nothing in a spacing answer.

## The mistake

Reading a depth off a deliberately coarse curve because the plot looked smooth. At 4 samples on column 1 the spacing is 2000.0000 ft and the worst deviation anywhere on the curve is -3.6727e-2 psi at 960.0 ft. Smoothness on screen comes from the plotting, not from the sampling, and the curve gives no sign at all that a value was interpolated rather than marched.

## What the reading refuses

It refuses to say which of the two errors you are holding. One pressure comes back, with no flag for a sample and none for a chord, so knowing whether your depth fell on a node is your job.

## Exercise

Set the sample count to 4, read the injection pressure at a depth halfway between two samples, then raise the count to 64 and read the same depth again.

Write both values and say which direction the coarse reading erred in, then say why that direction is the same one every time.
