# Rate from a pressure

The forward reading substitutes a pressure into a relation. No search, no bracket, no tolerance.

{{panel:pd-ipr-explorer}}

## A straight line prices every barrel the same

The published straight-line case: reservoir pressure 3200 psia, bubble point 0 psia, productivity index 1.8 stb/d/psi.

| Flowing pressure, psia | Rate, stb/d |
| --- | --- |
| 3200 | 0.000000 |
| 2880 | 576.000000 |
| 2400 | 1440.000000 |
| 1600 | 2880.000000 |
| 800 | 4320.000000 |
| 0 | 5760.000000 |

Its inflow slope is -0.55555556 psi per stb/d at 288.0000, 1152.0000, 2880.0000, 4608.0000 and 5472.0000 stb/d alike, which is minus one over the index.

## The same operation on a bent relation

The published Vogel case, 2400 psia with an open flow of 1500 stb/d, reads 258.000000 stb/d at 2160 psia, 600.000000 at 1800 psia, 1050.000000 at 1200 psia, 1350.000000 at 600 psia and 1458.000000 at 240 psia. The first 240 psi of drawdown buys 258.000000 stb/d. The last 240 psi moves the reading from 1458.000000 to 1500.000000 stb/d.

The published Jones, Blount and Glaze case, a of 0.9 and b of 0.0015 at 2800 psia, reads 225.991128 stb/d at 2520 psia, 711.599394 at 1400 psia and 1098.809017 at 0 psia. The published Fetkovich case, C of 0.000085 and n of 0.87 at 3500 psia, reads 29.417987 stb/d at 3150 psia and 124.766308 at 0 psia.

## Where BONNY-7 stops being a multiplication

Composite, 2740 psia, bubble point 1300 psia, index 2.00000000 stb/d/psi, calibrated from 720 stb/d at 2380 psia.

| Pressure, psia | Drawdown, psi | Composite, stb/d | Straight line, stb/d |
| --- | --- | --- | --- |
| 2380 | 360.0000 | 720.000000 | 720.000000 |
| 1566 | 1174.0000 | 2348.000000 | 2348.000000 |
| 1300 | 1440.0000 | 2880.000000 | 2880.000000 |
| 1174 | 1566.0000 | 3121.144615 | 3132.000000 |
| 783 | 1957.0000 | 3731.238291 | 3914.000000 |
| 391 | 2349.0000 | 4133.021538 | 4698.000000 |
| 0 | 2740.0000 | 4324.444444 | 5480.000000 |

The gap opens at 10.855385 stb/d, reaches 182.761709, then 564.978462, then 1155.555556. The slope is -0.50000000 psi per stb/d at 216, 649, 1297, 1946 and 2595 stb/d, then -0.57666066 at 3243 and -1.57442483 at 4195 stb/d.

## The mistake

Carrying the straight line into the bent block. Nothing warns you, because 3132.000000 stb/d at 1174 psia is only 10.855385 stb/d wrong and looks like rounding. By 391 psia the same habit is 564.978462 stb/d wrong.

## What it refuses

It refuses to say the well flows: there is no tubing in the relation. It refuses to identify the family, since all three read 720.000000 stb/d at the test and land at 5480.000000, 3233.247201 and 4324.444444 stb/d at 0 psia. And it refuses to notice a stale reservoir pressure: the published straight line reads an open flow of 5760.000000 stb/d at 3200 psia and 3600.000000 stb/d at 2000 psia with equal confidence.

## Exercise

Read BONNY-7 at 2380, 1300 and 391 psia in the panel, then compute what 2.00000000 stb/d/psi times the drawdown gives at each.

Record the three gaps and say which pressure is the first where the two answers part.
