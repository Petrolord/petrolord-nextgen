# How it is built

The engine walks the schedule once and lets every cost line accrue on the basis it was written with, which is the whole of the construction.

{{panel:wc-risk-explorer}}

## Three rules, applied at once

A per day line accrues linearly in elapsed time. At any point on the curve it contributes its rate multiplied by the elapsed days so far.

A per metre line accrues with hole made. It contributes its rate multiplied by the metres drilled so far, which is not the same thing as depth reached, and is certainly not the same thing as time.

A lump line does not accrue at all. It arrives whole, as a vertical step, at the end of the activity it is linked to. A lump with no link lands at spud.

On the golden case the per day lines are the rig at 100,000 USD per day and the integrated services spread at 60,000, which is 160,000 USD per elapsed day between them. The per metre line is mud and consumables at 150 USD per metre. Five lump lines carry 2,050,000 USD between them.

## Breakpoints, not a sampled grid

The engine does not step through the well in fixed time slices. It evaluates only at activity boundaries: spud plus the end of each of the ten activities, which is why the published curve has exactly eleven points for a 432 hour well.

Between two boundaries both running rates are constant, so the segment is a straight line and an intermediate point would tell you nothing you cannot read off it. Every kink in the curve is an activity change, and every step is a lump.

## Following the walk by hand

| Boundary | Elapsed hr | Drilled m | Cumulative USD |
|---|---|---|---|
| spud | 0 | 0 | 0 |
| a1 | 27 | 0 | 180,000 |
| a2 | 49.5 | 500 | 405,000 |
| a3 | 63 | 500 | 745,000 |

At a1 nothing has been drilled, so the 180,000 USD is the per day lines alone over 27 hours. At a2 the surface hole has made 500 m, so the mud line joins in. At a3 the casing run drills nothing, the drilled metres stay at 500, and the 250,000 USD wellhead steps in at the end.

Reproduce those four rows and you have reproduced the method.

## Exercise

Rebuild the a1, a2 and a3 rows on paper from the rates alone, and check each against the table.

Then predict the cumulative figure at the end of a4 before you read it off the panel.
