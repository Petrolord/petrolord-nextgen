# What a residual proves

A residual is the difference between two evaluations. Where both evaluations rest on the same approximation, their difference reports that the approximation agrees with itself.

{{panel:pd-unloading-explorer}}

## The gate that everything passes

`deepestInjectionPoint` allows itself 0.5 psi at the crossing. On the published case it reports 4.67696e-3 psi. On a four row tabulation of the teaching traverse, a teaching construct rather than a published case, it reports 1.5907e-2 psi. Both sit well inside the gate, and one of them belongs to an answer 60.420814470 ft shallow.

## The residual does not track the error

Refine the published traverse and watch the two columns move independently.

| Rows | Depth error, ft | Reported residual, psi | True over reported |
| --- | --- | --- | --- |
| 3 | -22.800438454 | 2.8215e-2 | 97.035 |
| 9 | -1.318735072 | 4.8890e-3 | 32.386 |
| 17 | 0.371645892 | 1.5709e-3 | 28.404 |
| 33 | -0.000933670 | 5.3979e-5 | 2.077 |
| 65 | 0.002834866 | 2.5888e-5 | 13.148 |

Between 33 and 65 rows the reported residual falls while the depth error grows, so no threshold on the reported residual makes a safe acceptance rule. Sharper still is the column refinement, where a reported residual of exactly 0.0000e+0 psi at 8 injection curve samples belongs to the worst depth in that study, 7739.840298490 ft against a converged 7741.133436499 ft.

## Why the two are unrelated

Both pressures at the interpolated depth are read off straight lines, and the interpolation puts the depth exactly where those two lines cross, so the residual there is driven to near zero by construction. Whatever error each line carries against its own curve survives untouched, and the residual has no term that could report it.

That claim is not about gas lift. A small residual proves the two things being subtracted agree with each other, and nothing about either of them.

## What would prove something

Evaluate the residual at the returned depth using something the solver did not use: the same depth, with pressures taken from the continuous traverse and a converged column instead of the chords. On the published case that reads 1.58211e-1 psi, and on the four row teaching tabulation 1.0789e+1 psi.

A cheaper check is to move the tabulation and see whether the answer moves. An answer that shifts 60.420814470 ft when the rows change was never converged, whatever it reported.

## The mistake

Treating a passing internal check as verification. A self consistent wrong answer is the hardest kind to catch, because every check the code can run on itself returns clean, the warning list is empty, and the reported residual is smaller than the one you would have accepted.

## Exercise

Write the reported residual and the depth error at 3, 33 and 65 rows, then say which pair breaks the assumption that a smaller residual means a better answer.

Then state in one sentence what a residual of 4.67696e-3 psi actually establishes about the published crossing.
