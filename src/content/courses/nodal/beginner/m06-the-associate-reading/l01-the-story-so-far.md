# The story so far

Five modules, one relation, and not a foot of tubing anywhere in them.

## Four items define a curve

A family, a reservoir pressure, a bubble point, and something to pin it: coefficients or one test. BONNY-7 is a composite at 2740 psia, bubble point 1300 psia, pinned by 720 stb/d at 2380 psia.

## Straight, then bent

Above the bubble point mobility does not change, so rate is proportional to drawdown. BONNY-7's 2.00000000 stb/d/psi turns 360.0000 psi of drawdown into 720.000000 stb/d and 1440.0000 psi into 2880.000000 stb/d, at a slope of -0.50000000 psi per stb/d held at 216, 649, 1297, 1946 and 2595 stb/d.

Below it each psi buys less: the published Vogel case reads 258.000000 stb/d at 2160 psia and 1458.000000 by 240 psia against an open flow of 1500.000000. BONNY-7's rate at the bubble point of 2880.000000 stb/d equals its undersaturated block of 2880.000000, and a saturated block of 1444.444444 gives 4324.444444 stb/d, a saturated share of 0.33401850.

| Family | Pinned by | Open flow |
| --- | --- | --- |
| straight line, 3200 psia | 1.8 stb/d/psi | 5760.000000 stb/d |
| Vogel, 2400 psia | a maximum rate | 1500.000000 stb/d |
| composite, 3000 psia | 1.2 stb/d/psi, pb 2000 psia | 2533.333333 stb/d |
| Fetkovich, 3500 psia | C 0.000085, n 0.87 | 124.766308 stb/d |
| Jones, 2800 psia | a 0.9, b 0.0015 | 1098.809017 stb/d |
| Rawlins and Schellhardt, 4000 psia | C 0.01, n 0.85 | 13289.296319 Mscf/d |
| Houpeurt, 4000 psia | a 900, b 0.35 | 5596.679697 Mscf/d |

## One test pins one curve, and every family passes

The published cases reproduce their tests at 900.000000, 700.000000, 600.000000, 1500.000000 and 1100.000000 stb/d, wrong families included. Trust turns on where the test sat: BONNY-7 above its bubble point, both families backing out 2.00000000 stb/d/psi with an error of 0.00000000; FORCADOS-3 below it, at 1.55844156 against 1.57194033, an error of -0.01349877.

## Two directions, two operations

Forwards is an evaluation. Backwards is a bracketed search between 0 psia and the reservoir pressure, safe because the relation reads zero at one end and the open flow at the other and is monotone between. The round trip closes: 2880.000000 stb/d at 1600 psia forwards, 1600.000000 psia back.

Interpolating instead has a measured price. Read a gas inflow off its forty sampled rows and it runs low every time: -1.477901 psi at 1328.9296 Mscf/d, -3.878569 at 559.6680, -12.910810 at 8.8807 on the turbulent case.

## Open flow is a scale, not a target

BONNY-7's 4324.444444 stb/d needs 649.199606 psia at 0.90000000 of it and 301.955326 at 0.97006680. One test gives 5480.000000, 3233.247201 and 4324.444444 stb/d by three families, and the published straight line moves from 5760.000000 to 3600.000000 stb/d between 3200 and 2000 psia.

## What this tier does not answer

Whether the well flows. There is no tubing, wellhead or lift in the relation, and no clock either.

## Exercise

Write BONNY-7's four defining items from memory, then the three numbers they produce: index, rate at the bubble point, open flow. Say which you would least willingly quote alone.
