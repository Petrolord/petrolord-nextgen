# The gas effect

This is the lesson the course exists for. Everything before it was preparation: the fluid properties, the mixing rule, the units. What follows is the single behaviour that makes seismic useful for finding hydrocarbons, and the same behaviour that makes seismic unreliable for measuring how much of them there are.

## The full saturation sweep

The engine mixed brine and gas at reservoir conditions across the whole saturation range. Moduli are in MPa and densities are in kg/m3.

| Sw | Wood K (MPa) | mixed density (kg/m3) |
| --- | --- | --- |
| 0.00 | 55.7187 | 172.66679461728904 |
| 0.10 | 61.7679 | 257.1826139055602 |
| 0.20 | 69.2905 | 341.69843319383125 |
| 0.50 | 109.1823 | 595.2458910586445 |
| 0.80 | 257.3341 | 848.7933489234579 |
| 0.90 | 469.8509 | 933.309168211729 |
| 0.95 | 800.3183 | 975.5670778558645 |
| 0.99 | 1830.0363 | 1009.373405571173 |
| 1.00 | 2697.8113 | 1017.8249875 |

Read the density column first, because it takes ten seconds. It runs in a straight line from the gas density to the brine density, as the previous lesson said it must. There is nothing in it.

Now read the modulus column, and read it from the bottom up, because that is the direction a discovery happens in.

## The first one percent

Start with a fully brine saturated sand. The pore fluid modulus is 2697.8113 MPa. Now introduce gas until the water saturation is 0.99, so one percent of the pore volume is gas. The modulus falls to 1830.0363 MPa.

That is a fall of about a third, caused by a saturation change that no logging tool can resolve and no core measurement would report as different from fully brine saturated. One percent gas, and the pore fluid has lost a third of its stiffness.

Keep going. At 5 percent gas the modulus is 800.3183 MPa, less than a third of the brine value. At 10 percent gas it is 469.8509 MPa. At 20 percent gas, the capstone case, it is 257.3341 MPa, down by a factor of ten from the brine case.

## The rest of the range does almost nothing

Now look at the other end of the table. Going from Sw 0.50 to Sw 0.00, which is to say replacing half of the pore volume with gas, moves the modulus from 109.1823 MPa to 55.7187 MPa. Half the pore volume changed hands and the modulus moved by less than the first one percent of gas moved it.

That is the shape of the whole curve. It collapses in the first few percent of gas and then flattens out. Almost all of the seismic sensitivity to saturation is spent before the saturation reaches a level anyone would call a discovery.

## Why the compliance split explains all of it

The mechanism is the one the first lesson counted out. At Sw 0.8:

- the brine term contributes 7.6 percent of the total compliance
- the gas term contributes 92.4 percent

The 20 percent gas is doing 92 percent of the softening. That split is what the table is a picture of.

The reason is the ratio between the two moduli. Brine is 48.42 times stiffer than gas at these conditions, so per unit of saturation the gas brings a compliance roughly fifty times larger into the sum. A saturation of gas therefore carries about fifty times the weight of the same saturation of brine, and the mixture reaches gas-like compliance while it is still overwhelmingly brine by volume.

Put the two effects together and you have the whole lesson. Density is weighted by volume, so 20 percent gas moves it by roughly 20 percent of the gap. Modulus is weighted by compliance, so 20 percent gas moves it most of the way to the gas value.

## What this does to a seismic response

Velocity in a saturated rock depends on the rock frame stiffened by the pore fluid, and the fluid term is the one saturation controls. A collapse in fluid modulus lowers the compressional velocity and lowers the acoustic impedance of the sand. Against a shale of unchanged impedance above it, that turns the top of the sand into a stronger negative reflection.

So a small amount of gas produces a large, easily visible amplitude change. That is the physical basis for bright spots, for direct hydrocarbon indicators, and for the AVO work at the Advanced tier of this course. It is genuinely useful and it finds fields.

The same physics produces the failure mode. Because the curve flattens above about 20 percent gas, the amplitude tells you very little about how much gas is present once there is any. A sand at 20 percent gas saturation and a sand at 80 percent gas saturation have fluid moduli of 257.3341 and 69.2905 MPa, and the resulting difference in seismic amplitude is small compared with the difference between either of them and the brine case. A commercial gas column and a residual gas saturation left behind by a migrating charge look much the same on a stack.

That is the origin of the fizz gas problem, and it has cost the industry a great many dry holes drilled on convincing amplitudes.

## What to carry forward

Three sentences are worth memorising from this table.

The pore fluid modulus is controlled by the softest phase present, not the most abundant one. A saturation change too small to log is a saturation change large enough to see on seismic. And the amplitude that proves gas is present says almost nothing about how much of it there is.

The panel below lets you move the water saturation across this range and watch the modulus and the density respond.

{{panel:rp-fluid-explorer}}

## Exercise

Using the table alone, compare two saturation changes of very different size: from Sw 1.00 to Sw 0.90, and from Sw 0.50 to Sw 0.00. State the modulus change in each case and say which one a seismic amplitude would notice.

Self check: from Sw 1.00 to Sw 0.90 the modulus falls from 2697.8113 to 469.8509 MPa, so ten percent gas removes most of the fluid stiffness there was to remove. From Sw 0.50 to Sw 0.00 it falls only from 109.1823 to 55.7187 MPa, even though fifty percent more of the pore volume changed hands. The first change is enormous and would dominate any amplitude response, the second is small and would be lost in the noise, and the two together are why seismic detects gas far better than it quantifies it.
