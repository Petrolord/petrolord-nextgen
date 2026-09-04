# The drop along the line

A branch relation is a callback the consumer supplies. The module never computes a pipe pressure drop of its own, and the only thing it asks of the relation is that more pressure difference means more mass.

{{panel:pd-trunk-explorer}}

## Two conductances that never compare

A turbulent branch carries a conductance in lb/d per root psi, so its mass goes with the square root of the pressure difference across it and the drop goes with the square of the mass. A linear branch carries a conductance in lb/d per psi and behaves like a resistor.

Those are different quantities with different units and one is never quoted against the other. A conductance means nothing until somebody says which of the two units it is in.

## What the solo lines cost

| Flowline | Conductance, lb/d per root psi | Mass, lb/d | Drop, psi |
| --- | --- | --- | --- |
| AGBADA-2 | 275 | 6890.874160167 | 627.889543025 |
| AGBADA-6 | 365 | 3057.021085629 | 70.147329090 |
| AGBADA-9 | 198 | 4750.157046765 | 575.553310094 |
| AGBADA-12 | 126 | 985.000000000 reported | 38.714448989 |

AGBADA-9 carries 4750.157046765 lb/d on the stiffest line of the four and pays 575.553310094 psi for it. AGBADA-6 carries 3057.021085629 lb/d on the slackest and pays 70.147329090 psi. Rather less mass down a much better line costs a small fraction of the pressure, which is what a square law does to a comparison.

AGBADA-12's row is not a like for like. Its drop of 38.714448989 psi sits beside a reported rate of 985.000000000 lb/d and a conservation gap of 3.450000e+2 lb/d, relative 3.502538e-1, so the drop and the rate on that line are not describing the same mass.

## The two rules that do not survive

Two linear branches of 200 and 300 lb/d per psi in series give a wellhead of 183.333333333 psia, and the single branch of 120.000000000 lb/d per psi that the reciprocal rule predicts gives 183.333333333 psia, a difference of 0.0000e+0 psia. The same two in parallel give 120.000000000 psia, and the single branch of 500 lb/d per psi gives 120.000000000 psia, again 0.0000e+0 psia apart.

Both rules are exact, and neither one holds for a turbulent branch. Adding conductances in lb/d per root psi, or combining them by reciprocals, is arithmetic on the wrong law.

## What a branch will not do

Mass in equals mass out on every branch by construction, so nothing accumulates, nothing flashes and nothing is compressible along the way. There is no temperature anywhere, no holdup, no slugging and no transient of any kind, because every equation here is steady state.

## The mistake

Scaling a drop with a rate. Halving the mass on a turbulent branch does not halve the drop, and a spreadsheet built on the linear habit is wrong by more the further it is asked to travel.

## Exercise

Rank the four flowlines by conductance and by drop, and say why the two rankings differ.

Then take the series and parallel results and say which single fact about a linear branch makes both rules exact.
