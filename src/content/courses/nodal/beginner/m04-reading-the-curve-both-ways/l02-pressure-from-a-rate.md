# Pressure from a rate

Nobody asks what a well gives at 1600 psia. They name a rate and ask what it costs.

{{panel:pd-ipr-explorer}}

## On a straight line the price never moves

The published straight-line case, 3200 psia at 1.8 stb/d/psi:

| Rate, stb/d | Flowing pressure, psia | Slope, psi per stb/d |
| --- | --- | --- |
| 288.0000 | 3040.000000 | -0.55555556 |
| 1152.0000 | 2560.000000 | -0.55555556 |
| 2880.0000 | 1600.000000 | -0.55555556 |
| 4608.0000 | 640.000000 | -0.55555556 |
| 5472.0000 | 160.000000 | -0.55555556 |

The forward reading of that relation at 1600 psia is 2880.000000 stb/d, and the inverse at 2880.0000 stb/d is 1600.000000 psia. The two directions close on each other exactly.

## On a bent one every barrel costs more than the last

| Case, rate | Pressure, psia | Slope, psi per stb/d |
| --- | --- | --- |
| Vogel, 75.0000 stb/d | 2332.489316 | -0.91168461 |
| Vogel, 750.0000 stb/d | 1620.937271 | -1.24939025 |
| Vogel, 1425.0000 stb/d | 370.820393 | -3.57770876 |
| Fetkovich, 6.2383 stb/d | 3443.621532 | -10.47290881 |
| Fetkovich, 118.5280 stb/d | 837.469311 | -66.86393931 |
| Jones, 54.9405 stb/d | 2746.025915 | -1.06482135 |
| Jones, 1043.8686 stb/d | 226.025915 | -4.03160570 |

The published composite case, bubble point 2000 psia at 1.2 stb/d/psi, holds -0.83333333 psi per stb/d at 126.6667 and 506.6667 stb/d, both above the bubble point, then reads -0.85470451 at 1266.6667, -1.33843239 at 2026.6667 and -2.55747877 at 2406.6667 stb/d. The inverse tells you which regime you are buying in as well as what the barrel costs.

## The shape of a real well

BONNY-7, open flow 4324.444444 stb/d:

| Rate, stb/d | Pressure, psia | Fraction of open flow |
| --- | --- | --- |
| 216 | 2632.000000 | 0.04994861 |
| 1297 | 2091.500000 | 0.29992292 |
| 2595 | 1442.500000 | 0.60007708 |
| 3243 | 1105.576792 | 0.74992292 |
| 3892 | 649.199606 | 0.90000000 |
| 4195 | 301.955326 | 0.97006680 |

Everything out to 0.60007708 is bought at a flat -0.50000000 psi per stb/d. From there to 0.97006680 the pressure falls from 1442.500000 psia to 301.955326 psia.

## Gas is flat at the top and steep at the bottom

The published strongly turbulent case, 3200 psia with an open flow of 88.806747 Mscf/d, reads 3160.745567 psia at 8.8807 Mscf/d, 2890.790992 at 31.0824, 2397.413173 at 53.2840 and 1265.038372 psia at 79.9261 Mscf/d. The relation works on a difference of squared pressures, and squaring flattens everything near the reservoir pressure.

## Three mistakes

Asking for a rate at or above the open flow. The published Fetkovich case tops out at 124.766308 stb/d, and what comes back beyond it is zero pressure, which is a boundary and not a solved root.

Pricing an extra 100 stb/d on BONNY-7 at -0.50000000 psi per stb/d when the well is at 4195 stb/d, where the true price is -1.57442483.

Forgetting the family. At 391 psia BONNY-7's composite reads 4133.021538 stb/d and its straight line 4698.000000.

## Exercise

Take inverse readings on BONNY-7 at the rates whose fractions of open flow are 0.29992292, 0.60007708 and 0.97006680.

Write the slope beside each and say what the third one means for anybody wanting one more percent of open flow.
