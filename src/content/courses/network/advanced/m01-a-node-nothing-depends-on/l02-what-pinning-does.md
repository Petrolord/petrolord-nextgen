# What pinning does

The pinned node keeps its pressure and leaves the system. Everything else about it is still reported as though it had been solved.

{{panel:pd-fight-explorer}}

## What is kept and what is dropped

The teaching network AGBADA WEST, four wells and three junctions against a separator at 265 psia, returns `pinned = t4`. That node comes back at 831.176261907 psia, its reported rate 985.000000000 lb/d, its flowline 640.000000000 lb/d. Its own nodal imbalance is 345.000000000 lb/d, and the engine carries that number in the returned imbalance object, where nothing consults it.

The dropped part is one row and one column of the linear system. The kept part is every field a caller reads. The solve reports `converged = true` after 11 iterations at a residual of 1.546141e-11 lb/d, while `checkConservation` on the same answer reports a gap of 345.000000000 lb/d, 2.593852900 percent of what it says was produced.

## The same well on its own line

Put AGBADA-12 alone on its flowline against the separator: wellhead 303.714448989 psia, rate 985.000000000 lb/d, line drop 38.714448989 psi, `converged = true` in 4 iterations, reported residual 0.0000e+0 lb/d, `pinned = t4`. `checkConservation` reports a gap of 345.000000000 lb/d, relative 3.502538e-1.

A two node problem, a residual of exactly zero, and a third of the production missing. The solo answer is wrong before a second well arrives.

## Why the top is flat

The drawdown from reservoir pressure to that wellhead is 1146.285551 psi, where the Vogel curve would give 1938.321311203 lb/d. The allocation of 985 lb/d holds the inflow flat, the capacity of 640 lb/d holds the branch flat, and a flat inflow on a saturated branch leaves nothing depending on the node's pressure.

## What the other three do

Solved on their own lines the other three report `pinned = none` and no warnings. AGBADA-2 stops at a residual of 9.0949e-13 lb/d with a gap of 9.094947e-13 lb/d, AGBADA-6 at 4.5475e-13 lb/d with a gap of -4.547474e-13 lb/d, AGBADA-9 at 0.0000e+0 lb/d with a gap of 0.000000e+0 lb/d.

AGBADA-9 and AGBADA-12 both report a residual of exactly zero. One is exact and the other is missing 345.000000000 lb/d. The residual does not separate them. `pinned` does, and everywhere: across seven starting guesses the six that pin the node are the six out of balance, and the one that pins nothing closes at 0.000000 lb/d. The pin is not a symptom of the bad answer, it is the mechanism, because a pinned node is dropped from `normOf`.

## What the flag does not do

It does not zero the well's reported rate, it does not adjust the flowline, and it does not appear in `flows`. A caller who reads `pressures`, `flows` and `wellRates` and never looks at `pinned` sees an ordinary answer with no mark on it.

The careful mistake is to treat the pin as a solver complaint about conditioning. It is a statement about the physics of the case: the well was given more than its line can pass, and the difference is 345.000000000 lb/d by construction.

## Exercise

Solve AGBADA-12 on its own line and record `converged`, the reported residual and the `checkConservation` gap.

Then say which single field in the return would have warned you that the two disagree, and what its value is on AGBADA-9.
