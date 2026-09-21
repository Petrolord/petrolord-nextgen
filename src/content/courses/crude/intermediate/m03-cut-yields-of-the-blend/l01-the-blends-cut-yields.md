# The blend's cut yields

A refinery does not sell a curve. It sells cuts. This module cuts the Kwale blend's curve into the products Kwale makes.

{{panel:crude-valuation-explorer}}

## Kwale's cut set

The Kwale refinery has no vacuum unit, so its cut set ends at atmospheric residue. It draws its own cut points:

| cut | from F | to F |
| --- | --- | --- |
| LPG / Light ends | no lower bound (from 0 percent) | 90 |
| Naphtha | 90 | 330 |
| Kerosene / DPK | 330 | 480 |
| Diesel / AGO | 480 | 650 |
| Atmospheric residue | 650 | no upper bound (to 100 percent) |

A cut's yield is the curve at its upper bound minus the curve at its lower bound, in volume percent of the whole crude. The Associate tier taught that on single crudes with cutYields. Here the same function runs on the blend's own curve from module 1.

## Two routes that must agree

If yields add on volume, there are two ways to get the blend's cut yields. Run cutYields on the blend's curve. Or run cutYields on each crude's own curve and weight the yields by volume share with blendOnVolume. The lab prints both, and the difference between them.

| cut | Kwale Light | Ughelli Medium | the blend (cutYields on the blend's curve) | volume-weighted from the two crudes (blendOnVolume) | the two ways differ by | mass-weighted from the two crudes (blendOnMass) |
| --- | --- | --- | --- | --- | --- | --- |
| LPG / Light ends | 1.3043 | 0.0000 | 0.7174 | 0.7174 | 0.0000 | 0.6951 |
| Naphtha | 24.2512 | 16.0465 | 20.5591 | 20.5591 | 0.0000 | 20.4189 |
| Kerosene / DPK | 18.1944 | 13.9535 | 16.2860 | 16.2860 | 0.0000 | 16.2136 |
| Diesel / AGO | 18.8816 | 20.0000 | 19.3849 | 19.3849 | 0.0000 | 19.4040 |
| Atmospheric residue | 37.3684 | 50.0000 | 43.0526 | 43.0526 | 0.0000 | 43.2685 |
| total | 100.0000 | 100.0000 | 100.0000 | not formed | not formed | not formed |

Closes: true.

Every row of "the two ways differ by" reads 0.0000. That is the rule of module 1 confirmed at the level of products: cutting the blend's curve gives the same barrels as blending the crudes' cuts on volume. The table above prints the check row by row, and the column reads 0.0000 on all five cuts.

## Reading the crude columns

The two crude columns are each crude's own cut yields on Kwale's cuts. Ughelli Medium's LPG / Light ends reads 0.0000 because its curve starts at 0 percent at 90 F, which is exactly where Kwale's LPG cut ends: none of Ughelli Medium has distilled by the top of that cut. Kwale Light starts at 75 F, so it has 1.3043 percent in the same cut. The blend's 0.7174 carries only Kwale Light's share of those light ends.

## The third column is the trap

The last column weights the same crude yields by mass fraction. It is printed so it can be read beside the engine's. For naphtha, the blend reads 20.5591 on volume and 20.4189 on mass. For atmospheric residue it reads 43.0526 on volume and 43.2685 on mass.

The tier header names this trap: a mass-weighted yield gives a figure that looks finished. It has four decimals and it is formed from the crudes' own yields, and its weights are mass shares. The engine's rule for yields is "Yields are additive on volume", and the engine's column is the one formed on that basis.

## Closing

The blend's yields total 100.0000 and the set closes. The Associate tier set out what closing means: every cut has a yield and the total is within the engine's closing tolerance of 100 percent. The total is reported as it computes, and the engine does not scale it to 100. Lesson 3 shows a set that does not.

## Exercise

Read the Diesel / AGO row: Kwale Light 18.8816, Ughelli Medium 20.0000, the blend 19.3849, the volume-weighted figure 19.3849, the difference 0.0000 and the mass-weighted figure 19.4040. Say what the 0.0000 confirms about the two routes, and say which basis the mass-weighted figure uses. Then quote the engine's rule that names the basis yields blend on.
