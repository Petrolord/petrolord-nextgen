# Both sides off the same chords

The function checks its own answer, and the check passes on every tabulation it is given, including the ones that are tens of feet wrong.

{{panel:pd-unloading-explorer}}

## Two straight lines, not one

The injection pressure at any depth comes from `injectionPressureCurve`, which marches the gas column at a fixed number of samples and then reads any depth by straight line between two of them. The crossing then comes from a straight line between two rows of the flowing traverse.

So the residual reported at the crossing is the difference between one chord and another chord. It says the two agree with each other at that depth, and nothing about where either sits relative to the curve it stands in for.

## Refining the column moves nothing

Hold the published 9 row tabulation fixed and refine only the injection curve.

| Injection curve samples | Depth, ft | Reported residual, psi |
| --- | --- | --- |
| 8 | 7739.840298490 | 0.0000e+0 |
| 20 | 7739.816505557 | 4.2485e-3 |
| 40 | 7739.815725361 | 4.6770e-3 |
| 160 | 7739.814765058 | 4.8788e-3 |
| 2560 | 7739.814701286 | 4.8890e-3 |

The converged crossing against a continuous traverse and a converged column is 7741.133436499 ft. No row of that block reaches it, and the rows differ from one another only in the second decimal place. Taking the column from 8 samples to 2560 does not walk the answer toward the converged one, because the column was never what was wrong.

The engine ships 40 samples for the plotted injection curve and 20 for spacing and valve settings, so the row a design actually carries is 7739.815725361 ft.

## The residual grows while the calculation improves

At 8 samples the reported residual is exactly 0.0000e+0 psi, and that row holds the depth furthest from the converged answer of anything in the block. Refine the column and the reported residual rises to 4.2485e-3, then 4.6770e-3, then 4.8890e-3 psi.

A quantity that increases as the calculation gets better is not measuring the error. It measures how far apart the two chords have drifted, and a coarse column happened to put them on top of each other.

## Which knob is the expensive one

The column is cheap. It is built inside the module from a surface pressure, a gas gravity and a temperature profile, and any caller can ask for more samples. The traverse is not: it arrives from a nodal model outside this module and its row spacing is whatever that model chose to print. The cheap knob is the one that does nothing, and the expensive knob is the one that carries the error.

## The mistake

Running a refinement study on the column, watching the depth settle in the fourth decimal place, and reporting the answer as converged. Nine rows of traverse at 1000.0 ft spacing were never examined, and they are the reason the answer is 7739.815725361 ft rather than 7741.133436499 ft.

## Exercise

Read the crossing at 8, 40 and 2560 injection curve samples and write the three depths and the three reported residuals.

Then say which of the three residuals is smallest, which of the three depths is worst, and why those turn out to be the same row.
