# What the rounding is worth

The error is a fixed percentage of whatever slug it sits on, which makes it predictable, harmless to quote in percent, and dangerous to quote in psi.

{{panel:pd-remedy-explorer}}

## A slug sweep

A contiguous sweep on a teaching liquid gravity of 1.06. These are teaching values, not a published case and not a real well.

| Slug, ft | Through 0.433, psi | Exact gradient, psi | Cost, psi | Cost, percent |
| --- | --- | --- | --- | --- |
| 120.0 | 55.0776000000 | 55.1446985089 | 0.0670985089 | 0.1216771707 |
| 180.0 | 82.6164000000 | 82.7170477634 | 0.1006477634 | 0.1216771707 |
| 240.0 | 110.1552000000 | 110.2893970179 | 0.1341970179 | 0.1216771707 |
| 300.0 | 137.6940000000 | 137.8617462723 | 0.1677462723 | 0.1216771707 |
| 360.0 | 165.2328000000 | 165.4340955268 | 0.2012955268 | 0.1216771707 |
| 420.0 | 192.7716000000 | 193.0064447813 | 0.2348447813 | 0.1216771707 |
| 480.0 | 220.3104000000 | 220.5787940357 | 0.2683940357 | 0.1216771707 |

The last column never moves. The fourth column grows in step with the slug, because the cost is the slug length times the specific gravity times 0.0005275040010 psi/ft per unit SG and nothing else.

## The division that runs backwards

A cost quoted in psi is one division away from the slug that produced it. Divide 0.2012955268 psi by the fixed fraction and by the liquid gravity and the 360.0 ft slug comes back. So a figure in percent is a statement about the engine and a figure in psi is a statement about one well. The percentage is the same on every well this function ever runs; the psi belongs to one of them.

## The cost that matters less than it looks

On the published plunger case the cost on the slug is 0.1076108162 psi and the cost on the required lift pressure is 0.1076454958 psi, which is 0.04763796 percent of it. The percentage falls because the hydrostatic term is only one term of the balance. The absolute cost barely moves between the two, because the other terms carry no error from this constant at all.

## The mistake

Applying the percentage to the wrong quantity. A tenth of a percent is the error on the hydrostatic head, not on the lift pressure, the gas per cycle or the maximum slug length. Each of those inherits a different share depending on how much of it the hydrostatic term is, and the only way to know the share is to run both gradients through the whole balance.

## What it refuses

The function will not say which gradient it used. There is no field for it, no flag and no warning that the constant is rounded, so a user comparing this engine's lift pressure against one built on an exact gradient cannot attribute the difference from the return value.

## Exercise

Confirm from the sweep that the percentage is identical on all seven slugs.

Then take one cost in psi from the table and recover the slug length that produced it.
