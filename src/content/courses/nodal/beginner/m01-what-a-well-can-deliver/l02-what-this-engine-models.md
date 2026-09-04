# What this engine models

Five oil inflow families, two gas families, one calibration step and one depletion rule each, in field units.

## The families

`pi`, `vogel`, `composite`, `fetkovich` and `jones` for oil; `backPressure` after Rawlins and Schellhardt and `lit` after Houpeurt for gas. Each is defined by one forward function, the rate at a stated flowing pressure, and everything else is derived from it, so a family cannot carry a forward relation and an inverse that disagree.

| Published case | Inputs | Absolute open flow |
| --- | --- | --- |
| straight line | pr 3200 psia, pi 1.8 stb/d/psi | 5760.000000 stb/d |
| Vogel | pr 2400 psia, qmax 1500 stb/d | 1500.000000 stb/d |
| composite | pr 3000 psia, pb 2000 psia, pi 1.2 stb/d/psi | 2533.333333 stb/d |
| Fetkovich | pr 3500 psia, C 0.000085, n 0.87 | 124.766308 stb/d |
| Jones | pr 2800 psia, a 0.9, b 0.0015 | 1098.809017 stb/d |
| Rawlins and Schellhardt | pr 4000 psia, C 0.01, n 0.85 | 13289.296319 Mscf/d |
| Houpeurt | pr 4000 psia, a 900, b 0.35 | 5596.679697 Mscf/d |

The last two share a reservoir pressure of 4000 psia. The choice of family is not decoration.

## Two readings, two operations

Forward is one evaluation of the definition. The composite case reads 360.000000 stb/d at 2700 psia, 900.000000 at 2250 psia, 1733.333333 at 1500 psia, 2283.333333 at 750 psia and 2469.333333 at 300 psia.

Inverse is a root find on that same relation, never a closed form and never a chord off the sampled table. The Vogel case needs 1620.937271 psia for 750.0000 stb/d and 370.820393 psia for 1425.0000 stb/d.

## Calibration

One test pins one coefficient, and a supplied test beats a supplied coefficient. A straight line from 900 stb/d at 2700 psia against 3200 psia returns 1.80000000 stb/d/psi. Vogel from 700 stb/d at 1500 psia against 2400 psia returns an open flow of 1244.444444 stb/d. Fetkovich from 1100 stb/d at 2900 psia against 3500 psia returns a C of 0.0020560066733860726 and 3017.886603 stb/d.

Each reads its own test back exactly, at 900.000000, 700.000000 and 1100.000000 stb/d. Reproducing the test says nothing about the family.

## Depletion, one rule each

The straight line and the composite hold the index: 3200 psia to 2000 psia gives 3600.000000 stb/d, and the composite to 2400 psia gives 1813.333333 stb/d. Vogel follows Eickmeier's cube rule, 2400 psia to 1800 psia giving 632.812500 stb/d. Fetkovich declines its C, 3500 psia to 2500 psia giving 49.625684 stb/d.

Each answers what the curve would be at a lower pressure. None says when.

## Sampling

The curve is sampled evenly in pressure rather than rate, so both ends land exactly on an axis and the points crowd where the bend is sharpest. The published oil cases carry 40 rows, BONNY-7 carries 51 and FORCADOS-3 carries 45.

## Exercise

Write the two gas open flows at 4000 psia side by side and say what a wrong family choice would be wrong about.

Then list the calibrated cases with the rate each reproduces at its own test pressure, and say what that column does not prove.
