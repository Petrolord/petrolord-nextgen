# The inverse CDF and its two branches

A Monte Carlo draw starts as a uniform number between 0 and 1, and it becomes a capex, an opex or an efficiency through the triangle's inverse cumulative distribution function, `triInvCDF`.

{{panel:ec-breakeven-explorer}}

## The function

`triInvCDF(u, a, c, b)` takes a uniform draw `u`, a minimum `a`, a mode `c` and a maximum `b`. It compares `u` with `(c - a) / (b - a)`, the cumulative probability at the mode, F(mode), which equals the fit's m.

- If `u` is at or below F(mode): `a + sqrt(u * (b - a) * (c - a))`
- Otherwise: `b - sqrt((1 - u) * (b - a) * (b - c))`

The lower branch climbs from the minimum toward the mode. The upper branch works down from the maximum. They meet at the mode when `u` equals F(mode). If the minimum and maximum coincide, the function returns the minimum.

The draw `u` is a fraction of outcomes: 0.9 asks for the value that nine outcomes in ten fall below.

## Iteration 1 on ISIALA

| draw | u | variable | F(mode) | branch | sampled value |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.936239 | capex | 0.331225 | upper | 226.5205 |
| 2 | 0.826447 | opex | 0.233597 | upper | 24.4593 |
| 3 | 0.952306 | efficiency | 0.599919 | upper | 97.2265 |

All three draws sit above their F(mode), so all three take the upper branch. Capex comes out at 226.5205 million USD, above the stated 90th percentile of 220, and rightly so: its `u` of 0.936239 is above 0.9, and the fitted maximum of 252.3607 leaves room. Opex at 24.4593 sits below its stated 26 because 0.826447 is below 0.9. Efficiency at 97.2265 percent passes its stated 96 for the same reason capex passed 220, and the engine divides it by 100 before scaling the profile.

## Reading a branch

The branch says which side of the mode a draw landed on. With F(mode) of 0.233597, most opex draws land above the mode of 17.4160, and with 0.331225 most capex draws land above 168.6738.

## What it refuses

`triInvCDF` turns one draw into one variable and knows nothing about the other two, so a high capex draw says nothing about opex. It never truncates or rejects: whatever the fitted range allows comes out, an efficiency above 100 percent included. It does not check that `a`, `c` and `b` are in order either, so a hand-built triangle with its mode outside the range returns nonsense without complaint.

## The mistake

The common hand mistake is using the lower formula for every draw. That formula is valid only up to F(mode). Past the mode it always returns less than the true value, so on capex's first draw of 0.936239, and on every other upper-branch draw, it pulls the value toward the middle and shrinks the expensive tail: the endpoints error arriving by another door. The other mistake is reading `u` against the stated belief rather than the fitted triangle. A draw of 0.936239 lands between the fitted 90th percentile and the fitted maximum, and the fitted 90th percentile equals 220 only because the fit is exact.

## Exercise

For each of iteration 1's three draws, state F(mode), the branch and the sampled value. Explain why capex at 226.5205 lies above its stated 90th percentile while opex at 24.4593 lies below its own. Then say what the lower formula does to a draw above F(mode), and which tail of the distribution it shrinks.
