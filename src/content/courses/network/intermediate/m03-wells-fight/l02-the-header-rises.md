# The header rises

The mechanism behind every well losing rate to its neighbours is one number going up. More mass through the same trunk needs more pressure to push it, and the header is where every well on the system meets that pressure.

{{panel:pd-network-explorer}}

## The number that does the work

On the published ladder `wells_fight`, one separator at 180 psia and one trunk, the header goes 253.813945361 psia with one well, 370.837866311 psia with two and 670.128002137 psia with three. That is a rise of 416.314057 psi across the ladder.

Nothing was done to the trunk. A turbulent branch costs pressure faster than it gains mass, so a trunk asked to pass 9076.922229 lb/d instead of 3522.516744 lb/d costs disproportionately more. Every well is then flowing against a boundary that got worse while the well stood still.

## Every well sees it at its own wellhead

The header rise arrives at each wellhead. W-0 sits at 886.881507360 psia alone, 968.085702646 psia with one companion and 1172.493407776 psia with two. W-1 goes 928.044134340 psia and then 1116.780659716 psia. W-2 arrives at 1273.839267551 psia.

A well responds to that with its inflow curve, and the whole of the fight is that response.

## The one lever that helps every well at once

Backing the boundary off lowers the header for everybody. A derived sweep on the published three well case, moving only the separator, so these are sweep points rather than published cases. The 180 psia row is the published condition.

| Separator, psia | Header, psia | Total, lb/d | W-0, lb/d | W-1, lb/d | W-2, lb/d |
| --- | --- | --- | --- | --- | --- |
| 120 | 624.301508 | 9207.229955 | 3183.657116 | 2045.729998 | 3977.842841 |
| 150 | 647.220534 | 9142.361389 | 3160.876422 | 2026.828113 | 3954.656854 |
| 180 | 670.128002 | 9076.922229 | 3137.891322 | 2007.745062 | 3931.285845 |
| 220 | 700.654704 | 8988.773875 | 3106.923901 | 1982.015209 | 3899.834764 |
| 300 | 761.658338 | 8809.356763 | 3043.874795 | 1929.553599 | 3835.928369 |
| 400 | 837.839001 | 8579.087131 | 2962.927699 | 1862.030633 | 3754.128800 |

Every column moves the same way and no well is ever traded against another.

## Why a single-well study cannot price the lever

The separator pressure is exactly what a single-well study is told, and it is told a wellhead pressure rather than a boundary. Handing it 400 psia instead of 120 psia does not reproduce this table, because the header movement from 624.301508 psia to 837.839001 psia is a network result. Nothing about W-0 explains it.

## What was checked

Every row was returned by a solver reporting converged, and `solveNetwork` never calls `checkConservation`, so nothing in that return audits the mass. On the published condition the engine lands -4.5986e-10 psia from the independent referee at the header and 9.3905e-10 lb/d from it on W-0.

## Exercise

Reproduce the sweep at two separator pressures and record the header in each. Then say how much of the change in W-0 you could have predicted from W-0 alone.
