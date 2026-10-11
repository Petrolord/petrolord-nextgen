# Oil-to-brine substitution on a log

The oil and water legs at Ekene-1 are different rock, so comparing them mixes the fluid effect with porosity and clay. Substitution removes the rock from the comparison: it keeps each oil-leg sample's own frame and replaces its pore fluid with brine, so whatever changes is the fluid alone.

{{video:qi-b5}}

## The method, sample by sample

For each oil-leg net sand sample the panel runs four steps:

1. The mineral modulus, from quartz (K 36.600000 GPa) and clay (K 20.900000 GPa) by Voigt-Reuss-Hill on the sample's Vsh (`mixMinerals`).
2. The in situ pore fluid, brine and oil mixed by Wood at the sample's Sw.
3. The new fluid, brine at Sw 1.
4. Gassmann (1951) through the dry rock with the sample's PHIT (`substituteVels`).

The shear modulus does not change. The density swaps the pore fluid: rho_new = rho + phi (rho_brine - rho_fluid). The Rock Physics course derives Gassmann's relation and its assumptions in full; here the inputs are stated and the outputs read.

## Seven samples, before and after

| depth ft | PHIT | Vsh | Sw | Vp in situ | Vp brine | Vs in situ | Vs brine | density in situ | density brine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 5082.000000 | 0.220700 | 0.325800 | 0.416600 | 2474.227000 | 2733.411573 | 1358.537000 | 1349.137957 | 2311.300000 | 2343.616460 |
| 5087.000000 | 0.232000 | 0.209400 | 0.436700 | 2755.603000 | 2966.856405 | 1589.777000 | 1578.439345 | 2275.100000 | 2307.900673 |
| 5091.000000 | 0.223100 | 0.079900 | 0.456700 | 2864.823000 | 3080.030226 | 1692.957000 | 1681.735085 | 2272.000000 | 2302.422458 |
| 5095.000000 | 0.203100 | 0.182200 | 0.481400 | 2882.678000 | 3095.863092 | 1712.475000 | 1702.757689 | 2309.600000 | 2336.036104 |
| 5099.000000 | 0.206700 | 0.313000 | 0.512900 | 2636.063000 | 2852.850224 | 1432.997000 | 1425.276554 | 2326.300000 | 2351.570488 |
| 5103.000000 | 0.194000 | 0.184200 | 0.554200 | 2832.056000 | 3039.591396 | 1614.792000 | 1607.289638 | 2319.800000 | 2341.506850 |
| 5114.000000 | 0.184200 | 0.072400 | 0.786200 | 3129.781000 | 3248.090773 | 1792.035000 | 1788.275833 | 2348.600000 | 2358.484446 |

| depth ft | mineral K GPa | in situ fluid K GPa |
| --- | --- | --- |
| 5082.000000 | 30.444339 | 1.189766 |
| 5091.000000 | 34.936601 | 1.236790 |
| 5110.000000 | 32.645206 | 1.565627 |
| 5114.000000 | 35.087723 | 1.831634 |

## Reading the rows

Vp rises at every sample tabled. Vs falls a little, because the shear modulus stays fixed while brine makes the rock denser. Density rises by the porosity times the gap between brine and the in situ fluid: at 5082.000000 ft, PHIT 0.220700, from 2311.300000 to 2343.616460 kg/m3; at 5114.000000 ft, PHIT 0.184200, from 2348.600000 to 2358.484446 kg/m3, where the in situ fluid already carries more brine.

Across the tabled rows the rise in Vp is largest at the top sample and smallest at the sample nearest the contact. At 5082.000000 ft, with Sw 0.416600, Vp moves from 2474.227000 to 2733.411573 m/s; at 5114.000000 ft, with Sw 0.786200, it moves from 3129.781000 to 3248.090773 m/s. The deep sample already holds mostly brine, and its in situ fluid modulus of 1.831634 GPa sits nearer the brine's 2.662550 GPa than the 1.189766 GPa at 5082.000000 ft. The mineral modulus moves with Vsh: the shaly sample at 5082.000000 ft carries 30.444339 GPa, the clean one at 5114.000000 ft 35.087723 GPa.

## What the study states

Every row depends on the conditions that set the two fluids, on the quartz and clay moduli, and on the kit's PHIT, Vsh and Sw at each depth. A different petrophysical interpretation gives different substituted logs, and a feasibility verdict names the one it used.

## Refusals

> vp, vs and rho must be positive.

> Porosity must be in (0, 1).

> Fractions must sum to 1.

The first two come from `substituteVels` given a negative Vp and a porosity of 0; the third from `mixMinerals` given quartz 0.7 and clay 0.2. Gassmann's engine has two more refusals, for an implied saturated modulus that is not positive and for an inverse Gassmann dry modulus that is not positive.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Fluids and substitution" and Data to "Ekene pack: Ekene-1". Set "Sample depth, ft (stated)" to 5082.000000 and check its row against the tables above, then to 5114.000000. Pick a third oil-leg depth, predict whether its Vp rise falls between the two from its Sw, and read the tiles to check. Then raise "Brine salinity, weight fraction (stated)" and say which tiles move. Restore 0.035000.
