# Integrating density

Overburden is an integral. In words, you add up the weight of every slice of the column above the point of interest. In symbols, for a point $z$ metres below the mudline in water depth $D$:

$$S(z) = \rho_{sw} g D + g \int_0^{z} \rho(u)\, du$$

The first term is the seawater column. The second term is the bulk density log, integrated from the mudline down to the depth you want. Gravity in the engine is $g = 9.80665$ m/s2, and every pressure in this course uses that value.

## The seawater seed

The integration starts with a constant, and that constant is the water column. For the golden well:

$$1025 \times 9.80665 \times 100 = 1005181.625 \text{ Pa}$$

That is 1.005182 MPa at the mudline. The engine seeds the running sum with exactly this value before it touches the first density sample, which is why the overburden at the mudline is 1.005182 MPa and not zero.

Compare that with the hydrostatic at the mudline, which the previous module built from the same three numbers and which is also 1.005182 MPa. The two curves start at the same place because above the mudline there is nothing to distinguish them. Both are the identical 100 m of seawater. Everything that follows is about how they separate below that point.

Forgetting the water column entirely is the commonest error in this whole calculation, and it is silent. The profile still looks plausible, it is just about a megapascal light at every depth, all the way to TD.

## Gravity is not a place to round

The seed above used $g = 9.80665$ m/s2, and so does every pressure in this course. Rounding it looks harmless and is not. The whole hydrostatic column of this well is $1025 \times 100 + 1030 \times 4000 = 4222500$ kg/m2, so the pressure at TD is that mass per unit area times whatever $g$ you chose. With $g = 9.8$ the answer is 41.380500000 MPa, low by 0.028079625 MPa. With $g = 9.81$ it is 41.422725000 MPa, high by 0.014145375 MPa. With 9.80665 it is the graded 41.408579625 MPa. The capstone tolerance on that field is 0.01 MPa, so both rounded values of gravity are marked wrong. The 9.81 answer is the awkward one, because it looks right and is out by about 14 kilopascals.

## Sample by sample

Below the mudline the engine works down the density log one sample at a time. The golden well has 401 samples, one every 10 m from 0 to 4000 m below the mudline. For each step it takes the average of the density at the top of the step and the density at the bottom, multiplies by $g$ and by the step thickness, and adds the result to the running sum. That is trapezoidal integration, and it is a good match to a log that is sampled finely compared with the rate at which density changes.

Two details of the implementation are worth knowing. The first density value extends upward to the mudline, so a log that starts below the mudline does not leave a gap in the column, it fills that gap with its shallowest reading. And the sum is carried forward from sample to sample, so the overburden at any depth already contains every slice above it. There is no separate pass.

This is also why a single missing density sample is not a local problem. It shifts the running sum, so every value below it is shifted too. Gaps have to be filled before the integration runs, which is what the next lesson is about.

## The frame building with depth

Here is the golden well as the engine returns it, with the hydrostatic beside the overburden for comparison.

| z (m bml) | hydrostatic (MPa) | overburden (MPa) | rho (kg/m3) |
|---|---|---|---|
|    0 |  1.005182 |  1.005182 | 1900 |
|  500 |  6.055606 | 10.716908 | 2054.8394518500168 |
| 1000 | 11.106031 | 21.100398 | 2175.4285382011567 |
| 2000 | 21.206881 | 43.321164 | 2342.4843911799903 |
| 2500 | 26.257305 | 54.952589 | 2399.446642197867 |
| 3000 | 31.307730 | 66.831143 | 2443.808887896099 |
| 3500 | 36.358155 | 78.902159 | 2478.3582395846884 |
| 4000 | 41.408580 | 91.123067 | 2505.265301734371 |

Read the two pressure columns together. They are identical at the mudline at 1.005182 MPa. By 500 m the overburden is already well clear of the hydrostatic. By TD the overburden is 91.123067 MPa against 41.408580 MPa, more than twice the hydrostatic. The graded value at TD is 91.12306695073282 MPa, with a tolerance of 0.01 MPa.

Now read the density column alongside them. It rises from 1900 kg/m3 at the mudline to 2505.265301734371 kg/m3 at TD, which is the compaction story of this course seen from the density side. Sediment that arrives at the seabed as a soupy mixture of grains and water loses porosity as the load above it grows, so the bulk density climbs. That climb is why the overburden curve steepens with depth while the hydrostatic, built on a fixed 1030 kg/m3 pore fluid, stays straight.

## Why the shape matters

The hydrostatic is a straight line below the mudline because its density is a constant. The overburden is not straight. It bends, gently, as density increases, and the gap between the two curves widens faster than depth alone would suggest.

That widening gap is the room available for overpressure. At the mudline there is no room at all. At TD in this well there is a large interval between 41.408580 MPa and 91.123067 MPa, and any pore pressure the well can hold at that depth is somewhere inside it. The last lesson of this module puts both curves side by side and asks what that gap is telling you.

## Exercise

Reproduce the seawater seed of the overburden integration by hand from the well parameters, then say which single depth in the table it also equals in the hydrostatic column, and why.

Self check: the seawater seed is $1025 \times 9.80665 \times 100 = 1005181.625$ Pa, which is 1.005182 MPa. It equals the hydrostatic at the mudline, at 0 m below the mudline, because at that depth both quantities are the same 100 m column of seawater and neither has accumulated anything else yet. Below the mudline the overburden adds bulk rock density while the hydrostatic adds pore fluid at 1030 kg/m3, so the two separate immediately and never meet again.
