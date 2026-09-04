# Productivity index

One number in stb/d/psi, one multiplication, and a curve completely determined by it.

{{panel:pd-ipr-explorer}}

## The relation

Rate is the index times the drawdown. The rate at the reservoir pressure is zero, and the rate at a flowing pressure of zero is the index times the whole reservoir pressure, which is the absolute open flow with nothing solved.

The published case carries an index of 1.8 stb/d/psi, a reservoir pressure of 3200 psia, a bubble point of 0 psia and 40 rows. That index across 3200 psi gives the printed absolute open flow of 5760.000000 stb/d exactly.

| Flowing pressure, psia | Rate, stb/d |
| --- | --- |
| 3200 | 0.000000 |
| 2880 | 576.000000 |
| 2400 | 1440.000000 |
| 1600 | 2880.000000 |
| 800 | 4320.000000 |
| 320 | 5184.000000 |
| 0 | 5760.000000 |

Read backwards, 288.0000 stb/d needs 3040.000000 psia, 1152.0000 needs 2560.000000 psia, 2880.0000 needs 1600.000000 psia, 4608.0000 needs 640.000000 psia and 5472.0000 needs 160.000000 psia. The engine gets those by a root find on the forward relation rather than by the closed form, so a new forward relation cannot leave a stale inverse behind it.

## The fingerprint

The slope is minus 0.55555556 psi per stb/d at 288.0000, 1152.0000, 2880.0000, 4608.0000 and 5472.0000 stb/d. One value across the whole curve, and it is minus one over the index.

Any curve whose slope column holds still is a straight line. BONNY-7's holds at minus 0.50000000 psi per stb/d at 216, 649, 1297, 1946 and 2595 stb/d, matching minus one over its index of 2.00000000 stb/d/psi, then moves to minus 0.57666066 at 3243 stb/d. Its own slope column says it is not a straight line all the way, with nobody inspecting its bubble point.

Two families have no index at all. Jones runs from minus 1.06482135 psi per stb/d at 54.9405 stb/d to minus 4.03160570 at 1043.8686 stb/d; Fetkovich from minus 10.47290881 at 6.2383 stb/d to minus 66.86393931 at 118.5280 stb/d.

## Where it comes from

A rate and a flowing pressure measured together, at the same datum, against a reservoir pressure. The published calibration takes 900 stb/d at 2700 psia against 3200 psia and returns 1.80000000 stb/d/psi, reading 900.000000 stb/d back.

Given somebody else's curve, the index is the slope column negated and inverted. It is not the open flow divided by the reservoir pressure unless the curve is a straight line all the way down: BONNY-7's 4324.444444 stb/d over 2740 psia is not its 2.00000000 stb/d/psi.

## What it refuses

No rate dependence, so no turbulence and no non-Darcy skin. No phase change, so it stops applying below the bubble point. No time: holding the index down to 2000 psia gives 3600.000000 stb/d, which is a modelling choice, not a measurement. And no datum check, in psia and never psig.

## Exercise

Read the rate at 2400 psia, 1600 psia and 800 psia and confirm equal steps in pressure buy equal steps in rate.

Then write the slope at 288.0000 stb/d and at 5472.0000 stb/d and say how that column alone identifies the family.
