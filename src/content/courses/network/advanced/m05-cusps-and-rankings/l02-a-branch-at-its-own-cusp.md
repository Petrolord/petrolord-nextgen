# A branch at its own cusp

Move one conductance, change no other input, and the solve stops converging and then starts again.

{{panel:pd-fight-explorer}}

## The walk

Raising the loop leg conductance on the teaching network AGBADA WEST drives the crosslink toward zero pressure difference and past it. Nothing else moves: same wells, same separator at 265 psia, same tolerance, same cap.

| Loop leg, lb/d per root psi | Crosslink dp, psi | Crosslink flow, lb/d | Iterations | converged | Reported residual, lb/d |
| --- | --- | --- | --- | --- | --- |
| 245 | -1.193211e+0 | -589.864625 | 11 | true | 1.5461e-11 |
| 300 | -1.573794e-2 | -67.743516 | 17 | true | 1.5748e-9 |
| 340 | 2.755492e-1 | 283.461039 | 13 | true | 4.3048e-10 |
| 360 | 6.647285e-1 | 440.266762 | 19 | false | 4.5926e+1 |
| 372 | 9.895846e-1 | 537.180482 | 28 | false | 2.6983e+1 |
| 376 | 1.111514e+0 | 569.313221 | 28 | false | 2.6827e+1 |
| 378 | 1.171971e+0 | 584.591036 | 29 | false | 2.4953e+1 |
| 380 | 1.235327e+0 | 600.184455 | 30 | false | 2.4569e+1 |
| 385 | 1.399139e+0 | 638.740070 | 28 | false | 2.7868e+1 |
| 400 | 1.927574e+0 | 749.720411 | 36 | false | 2.2405e+1 |

Walk further and the branch comes out the other side: at 600 lb/d per root psi the crosslink carries 1884.858788 lb/d across 1.218345e+1 psi, and the solve takes 9 iterations for a residual of 2.7285e-12 lb/d.

## The row that is not where you expect it

The crossing happens between 300 and 340, and the solve is fine at both. The band that will not converge sits past the crossing, from 360 to 400, at pressure differences of one and two psi rather than at zero. The Jacobian step is about 0.007805 psi, so those rows are hundreds of steps from the cusp. What breaks is not one bad entry at the cusp, it is the path: the solver passes near the cusp on its way to the answer, and a chord taken while it is passing sends it somewhere it cannot recover from within its cap.

## Every failing row returns ok true

Seven of these rows report a residual of tens of pounds a day after as many as 36 iterations, and every one comes back `ok` true with a complete set of pressures, flows and well rates. `converged` is the only field that separates them from the rest.

## What it costs on a solve that does work

The converged row at 245 lb/d per root psi takes 11 iterations and reports 1.546141e-11 lb/d, and `checkConservation` on that answer gives a gap of 345 lb/d against 13300.677150912 lb/d produced, 2.593852900 percent. A branch near its own cusp is the most expensive branch on a network to solve, and nothing in the return points at it.

## Exercise

Write the two conductances that bracket the crosslink's change of sign and the two that bound the band where the solve stops converging. Then say why that band is not centred on the sign change.
