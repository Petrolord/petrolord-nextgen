# Sweeping wellhead pressure

Of everything that decides where a well sits, the pressure at the wellhead is the one an operator actually turns.

{{panel:pd-node-explorer}}

## Why this axis

The separator, the flowline and the choke are decisions; the reservoir pressure and the bubble point are conditions. Wellhead pressure also enters the outflow curve and nothing else, so a sweep moves one curve while the other stays fixed, and every change is attributable.

## It translates the curve without bending it

BONNY-7's tubing minimum stays at 627.069742 stb/d at wellhead pressures of 280, 350, 420 and 490 psia, its minimum pressure reading 1336.243252, 1406.243252, 1476.243252 and 1546.243252 psia. FORCADOS-3's stays at 1843.619418 stb/d at 860, 960, 1060 and 1160 psia, reading 2248.191408, 2348.191408, 2448.191408 and 2548.191408 psia. The dead column at zero rate tracks the wellhead the same way: 2430, 2500, 2570, 2640 psia and 4210, 4310, 4410, 4510 psia.

A fixed shape slides up a fixed inflow curve, and the operating point walks along that curve.

## The traces

| pWh, psia | BONNY-7 rate, stb/d | BONNY-7 pwf, psia |
| --- | --- | --- |
| 280 | 1424.991968 | 2027.504016 |
| 350 | 1390.819943 | 2044.590028 |
| 420 | 1355.714057 | 2062.142971 |
| 490 | 1319.581001 | 2080.209500 |

| pWh, psia | FORCADOS-3 rate, stb/d | pwf, psia | Window, stb/d |
| --- | --- | --- | --- |
| 860 | 2246.821833 | 2285.777425 | 2064.445505 |
| 960 | 2125.009203 | 2366.909222 | 1890.521117 |
| 1060 | 1990.931611 | 2453.455989 | 1695.613297 |
| 1160 | 1842.012114 | 2548.192089 | 1473.513228 |

Rate falls and flowing pressure rises, which surprises people once. The operating point is on the inflow curve throughout, and less rate means less drawdown, so every psi added at the surface is paid out of drawdown.

The window column is the one that matters: the status reads flowing and stable at all four conditions while the margin falls steadily.

## A gas well, and an acceleration

Against an open flow of 13289.296319 Mscf/d: 11648.073706 Mscf/d at 500 psia and 1516.065633 psia, 11335.720032 at 800 and 1652.175141, 10662.040573 at 1200 and 1911.167663, 9039.419053 at 1800 and 2415.008657. The last step costs far more than the first. Early on, the tubing curve rises through a steep part of the inflow curve and the crossing barely moves; later the inflow flattens toward the reservoir pressure and the same lift walks the crossing much further. A sweep that looks linear over its first steps is no licence to extrapolate.

## An axis that does bend

Sweep BONNY-7's lightening constant and the response is not monotone: the minimum rate reads 561.403918 stb/d at 187.50, 627.069742 at 375.00, 646.294276 at 750.00, then 581.492476 at 1500.00 stb/d, with minimum pressures of 1159.998265, 1476.243252, 1842.168146 and 2185.774480 psia. FORCADOS-3 turns over the same way: 1607.279673, 1843.619418, 1987.819717 and 1928.734780 stb/d.

A two point sensitivity gets the sign wrong there. A trace shows the turn; a slope does not.

## Exercise

Sweep FORCADOS-3 at 860, 960, 1060 and 1160 psia and write four rows: pressure, rate, flowing pressure, window.

Say why the flowing pressure rises while the rate falls, and what the window column tells you that the status column does not.
