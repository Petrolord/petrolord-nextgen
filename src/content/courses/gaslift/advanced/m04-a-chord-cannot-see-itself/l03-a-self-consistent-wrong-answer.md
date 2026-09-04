# A self consistent wrong answer

On the case that ships with it this defect looks like a rounding note. Change the traverse and the same mechanism moves the answer by tens of feet.

{{panel:pd-unloading-explorer}}

## The published size

The shipped answer on the published case is 7739.815725361 ft, reported residual 4.67696e-3 psi against a 0.5 psi gate. Refined toward a continuous traverse and a converged column the crossing is 7741.133436499 ft, injection 1209.271050491 psia, production 1109.271050491 psia, residual 2.274e-13 psi.

The shipped answer sits 1.317711139 ft and 0.032909074 psi away, and the true residual at that depth is 1.58211e-1 psi, 33.83 times the residual the function reported. The continuous curve behind that comparison is a monotone cubic through the published rows, a teaching construct rather than a published curve, reproducing every published row exactly.

On its own, that is a note in a release log.

## Why it looks small there

The published traverse runs 164.7000 psia at 0.0 ft to 1146.7000 psia at 8000.0 ft in steps that barely bend, and a chord under a nearly straight line is nearly the line. Real flowing traverses curve, because holdup and friction change with depth.

## The same mechanism on a curved traverse

AKASO-3 is a teaching well and its traverse is a teaching construct, not a published case and not a measurement: an explicit smooth curve, p(D) = 144.7 + 0.11 D + 8e-6 D^2 psia from 0 to 7200.0 ft, reading 144.700000000 psia at 0.0 ft and 1351.420000000 psia at 7200.0 ft. Against a converged column at 964.7 psia surface with a 55.0 psi transfer differential its exact crossing is 5754.882957403 ft, injection 1097.686548142 psia, residual -2.274e-13 psi.

Tabulate that curve at 2400.0 ft, four rows, and the function returns 5694.462142933 ft.

| | Published case | Teaching traverse, 4 rows |
| --- | --- | --- |
| Depth error, ft | -1.317711139 | -60.420814470 |
| Reported residual, psi | 4.67696e-3 | 1.5907e-2 |
| True residual, psi | 1.58211e-1 | 1.0789e+1 |
| True over reported | 33.83 | 678.26 |

Both reported residuals pass the 0.5 psi gate comfortably. One answer is 60.420814470 ft shallow, and the residual it cannot see is 1.0789e+1 psi, far outside that gate.

## The ratio is the finding, not the magnitude

Refine the teaching tabulation and the ratio does not decay: 689.13 at 5 rows, 659.81 at 7, 674.71 at 9, 669.88 at 13, 667.53 at 17, 674.88 at 25. The error falls and the reported residual falls with it, while the factor between what the function sees and what is there stays put. That factor is a property of the mechanism, and a caller inherits it at every spacing.

## The mistake

Judging a numerical defect on the single case that ships with it. A ratio of 33.83 reads as a curiosity and a ratio of 678.26 does not, and the same code produced both. What changed was the curvature of the traverse, the one thing the published case does not exercise.

## Exercise

Write the reported residual and the true residual for the published case and for the four row teaching tabulation, then the ratio for each.

Then say in one sentence what a reader of the published case alone would conclude, and what the teaching traverse shows that conclusion missing.
