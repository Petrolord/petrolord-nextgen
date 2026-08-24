# Seawater and sediment

This is the one calculation in the tier that you should do with a pencil rather than with software. It is short, it is exact, and doing it once by hand fixes the structure of the hydrostatic column in a way that reading about it does not.

Depths are metres below mudline.

## The equation

The pressure at the base of a static fluid column of density $\rho$ and height $h$ is

$$P = \rho\,g\,h$$

with density in kg/m3, gravity in m/s2 and height in m, which returns a pressure in Pa. Nothing else appears. There is no rock term, no temperature term and no compressibility term at this tier.

In a marine well the fluid above a given depth is not one fluid. It is seawater from sea level down to the mudline, then formation water from the mudline down to the depth of interest. Two fluids, two densities, two heights, so the column is computed in two parts and the parts are added:

$$P_{hyd}(z) = \rho_{sw}\,g\,d_{w} + \rho_{f}\,g\,z$$

where $d_w$ is the water depth and $z$ is the depth below mudline. That is the whole of module 2 in one line.

## The golden well at total depth

The inputs are given in the well header. Water depth 100 m, seawater density 1025 kg/m3, pore fluid density 1030 kg/m3, gravity 9.80665 m/s2, and the depth of interest is total depth at 4000 m below mudline.

Work the seawater part first.

$$1025 \times 9.80665 \times 100 = 1005181.625 \text{ Pa}$$

Then the sediment part.

$$1030 \times 9.80665 \times 4000 = 40403398 \text{ Pa}$$

Then add them.

$$1005181.625 + 40403398 = 41408579.625 \text{ Pa}$$

Converting to megapascals by dividing by one million,

$$41408579.625 \text{ Pa} = 41.408579625 \text{ MPa}$$

That is the hydrostatic pressure at 4000 m below mudline in this well, and it is one of the six numbers the capstone grades, to a tolerance of 0.01 MPa.

Stop and do it yourself now, on paper or on a calculator, before reading on. Multiply the two products, add them, divide by a million. If you get 41.408579625 MPa you have the structure right. If you do not, the fault is almost certainly one of the three things below.

## Three ways this goes wrong

**Forgetting the water column.** This is by far the commonest error, and it is the reason the calculation is split in two here. Computing only the sediment part gives 40403398 Pa, which is 40.403398 MPa, and misses 1005181.625 Pa. The error is a little over 1 MPa, and it is the same shortfall at every depth in the well, so it never announces itself as a trend. It quietly moves the whole baseline down, which means every departure from that baseline is overstated by the same amount and every pore pressure estimate built on it is too high.

The tell is the top of the curve. If your hydrostatic curve reads zero at the mudline, the water column is missing. In this well it should read 1.005182 MPa there.

**Using the wrong density in the wrong part.** The two densities are close, 1025 kg/m3 for seawater and 1030 kg/m3 for the pore fluid, and the temptation is to treat them as one number. They are close in this well because the formation water is only slightly more saline than the sea. That is not general. Formation waters run far more saline than seawater in many basins, and the pore fluid density can be well above 1100 kg/m3, at which point the two parts of the column are visibly different fluids. Keep them separate as a matter of habit so that the habit survives the well where it matters.

**Mixing up depth references.** In this well, 4000 m below mudline is 4100 m below sea level. If you use 4100 m as the height of the sediment column you have counted the water twice, once as seawater and once as rock pore fluid. The sediment term uses depth below mudline. The seawater term uses the water depth. Neither term ever uses total depth below sea level.

## The rest of the curve

The same two part sum at other depths gives the baseline for the whole well.

| z (m below mudline) | hydrostatic (MPa) |
| --- | --- |
| 0 | 1.005182 |
| 500 | 6.055606 |
| 1000 | 11.106031 |
| 2000 | 21.206881 |
| 2500 | 26.257305 |
| 3000 | 31.307730 |
| 3500 | 36.358155 |
| 4000 | 41.408580 |

At 0 m below mudline the sediment term is zero and the whole pressure is the seawater term, 1.005182 MPa. From there the curve rises linearly, because both densities and gravity are held constant, so the only thing changing with depth is $z$.

Notice that the last row reads 41.408580 MPa, which is the same value you computed as 41.408579625 MPa, displayed to six decimal places. Both are the same number. How many digits you carry is a display decision, and the capstone tolerance of 0.01 MPa is far wider than the difference, but carry the full precision through intermediate steps and round only when you report.

## Why the exactness matters

You will not get an exact check like this again in the course. The overburden is an integral over a logged density curve, and the compaction trend is a fit through picked points, and both of those involve choices where two competent people can differ.

The hydrostatic column has no choices in it beyond the two densities. That makes it the place to verify that your gravity constant, your unit handling and your depth reference are all correct, before those same three things are used in a calculation where an error would be much harder to see.

## Exercise

Compute the hydrostatic pressure at 2000 m below mudline in the golden well, using the two part sum with water depth 100 m, seawater 1025 kg/m3, pore fluid 1030 kg/m3 and gravity 9.80665 m/s2. Report it in MPa. Then state, in Pa, how much your answer would be in error if you omitted the seawater term, and say whether the resulting pore pressure estimates would be too high or too low.

Self check: the hydrostatic pressure at 2000 m below mudline is 21.206881 MPa. Omitting the seawater term would understate it by 1005181.625 Pa, which is the seawater part of the column and is the same shortfall at every depth in the well. A baseline that is too low makes every departure from it look larger than it is, so pore pressure estimates built on it come out too high.
