# Why the curve bends

Free gas takes the oil's flow path away from it, and the slope column records exactly where.

{{panel:pd-ipr-explorer}}

## What happens in the rock

Below the bubble point gas comes out of solution. It occupies pore space, so the effective permeability to oil falls, which is the dominant effect. The oil left behind has lost its dissolved gas, so it is more viscous and it shrinks. And all of this happens near the wellbore, where the pressure is lowest and most of the drawdown is spent.

Productivity per psi therefore falls, and the curve turns toward the rate axis.

## Where it starts

| Rate, stb/d | Flowing pressure, psia | Slope, psi per stb/d |
| --- | --- | --- |
| 216 | 2632.000000 | -0.50000000 |
| 1297 | 2091.500000 | -0.50000000 |
| 1946 | 1767.000000 | -0.50000000 |
| 2595 | 1442.500000 | -0.50000000 |
| 3243 | 1105.576792 | -0.57666066 |
| 3892 | 649.199606 | -0.90088746 |
| 4195 | 301.955326 | -1.57442483 |

BONNY-7's bubble point is 1300 psia. The last flat row is at 1442.500000 psia and the first moving row at 1105.576792 psia. FORCADOS-3, at a bubble point of 2450 psia, holds minus 0.63615646 psi per stb/d at 207, 620, 1241 and 1861 stb/d, then reads minus 0.72224059 at 2482 stb/d, minus 0.90914074 at 3102, minus 1.41044926 at 3722 and minus 2.41200162 at 4012 stb/d.

The bend starts at a pressure. The rate at which it starts, 2880.000000 stb/d on one well and 1996.364220 stb/d on the other, is a consequence of three inputs and travels nowhere.

## A well that bends from the first psi

If the reservoir pressure is at or below the bubble point there is no undersaturated block at all. The published Vogel case, at a reservoir pressure of 2400 psia and an open flow of 1500.000000 stb/d, has no flat stretch anywhere: minus 0.91168461 psi per stb/d at 75.0000 stb/d, minus 0.99227788 at 300.0000, minus 1.24939025 at 750.0000, minus 1.94028500 at 1200.0000 and minus 3.57770876 at 1425.0000 stb/d.

## Which way it points

Always the same way. BONNY-7's composite falls short of its straight line by 10.855385 stb/d at 1174 psia, by 182.761709 at 783 psia, by 564.978462 at 391 psia and by 1155.555556 at 0 psia.

The bend is invisible near the top and enormous near the bottom, so anyone validating a straight line against data near the top of the curve will validate it and then use it where it fails.

## What the engine does not model

None of the physics above. There is no relative permeability curve, no PVT, no solution gas ratio, no viscosity correlation and no saturation. What it has is an empirical shape, Vogel's fitted to computed solution gas drive cases and joined to a line by Standing's construction, with Fetkovich and Jones as alternatives.

So it cannot say why a well departs from the shape, cannot separate a gas effect from a turbulence effect, and cannot predict how the shape changes as the reservoir depletes.

## Exercise

Write BONNY-7's slope at 2595 stb/d and 3243 stb/d with their flowing pressures, and say which side of the bubble point each sits on.

Then say what the Vogel case's slope of minus 0.91168461 psi per stb/d at 75.0000 stb/d tells you about its reservoir pressure.
