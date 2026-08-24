# What overburden is

Everything above a point in the ground presses down on that point. Offshore the column is a layer of seawater and then a thickness of rock with fluid in its pores. Overburden stress is the weight of that entire column, spread over unit area, at the depth you care about. It is written $S$ in most pressure work, and it is sometimes called total vertical stress or lithostatic stress.

Two properties make it the anchor of everything else in this course. It is the largest of the three pressures you carry, so it sets a ceiling on what the pore fluid can be holding. And effective stress, the quantity that actually controls how a rock compacts, is measured downward from it.

## Weight expressed as a stress

Think of a column of unit cross section standing on the point of interest and reaching all the way to sea level. Every kilogram in that column contributes its weight. Divide the total weight by the area of the column and you have a stress, in pascals. Because the numbers are large, this course quotes overburden in MPa, and always with a depth attached, because a pressure without a depth means nothing.

The column offshore has two parts. Above the mudline it is seawater at 1025 kg/m3 in this well, standing 100 m deep. Below the mudline it is bulk rock, meaning the grains and the fluid in the pore space taken together. The density log reads exactly that bulk quantity, which is why the density log is the input the overburden calculation wants.

For the golden well the two ends of the answer are these. At the mudline the overburden is 1.005182 MPa, and every pascal of it is seawater. At TD, 4000 m below the mudline, it is 91.12306695073282 MPa. That second value is one of the six numbers the capstone grades, with a tolerance of 0.01 MPa.

## The ceiling on pore pressure

Terzaghi's relation is the reason overburden matters rather than being a curiosity:

$$\sigma = S - P$$

Vertical effective stress $\sigma$ is the total stress $S$ less the pore pressure $P$. It is the part of the load carried by grain to grain contact rather than by the fluid. The grains compact under $\sigma$, not under $S$, and not under $P$.

Read that relation twice and the ceiling appears. If pore pressure rose all the way to the overburden, effective stress would reach zero. The grain framework would be carrying none of the load and the formation would part. Real rocks fail before that point, at the fracture pressure, which sits below the overburden and which the Advanced tier turns into a drilling limit. For now hold the simpler statement: pore pressure in this well lives below the overburden curve, and the overburden curve is the hard upper bound.

The lower bound is the hydrostatic column from the previous module. So the frame you are building is a pair of curves with the answer somewhere between them, and the whole of pore pressure prediction is the business of saying where in that gap the answer sits.

## Why it has to be computed

It is tempting to assume a gradient, something like a fixed number of MPa per kilometre, and multiply. That fails offshore for two reasons that this well shows clearly.

The first is the water column. Seawater is far lighter than rock, so the first 100 m of this well contributes very little stress. A single gradient applied from sea level over states the shallow section badly.

The second is that bulk density is not constant. In the golden well it runs from 1900 kg/m3 at the mudline to 2505.265301734371 kg/m3 at TD as the sediment compacts. A column whose density changes by a third over its length cannot be represented by one number without introducing an error that then propagates into every effective stress you calculate from it.

So overburden is built by integration, sample by sample down the density log, and that is the next lesson. Everything here rests on that integral being done honestly, because an overburden error does not stay put. It moves straight into $\sigma$, and from $\sigma$ into the compaction trend, and from there into the pressure prognosis at the tier above this one.

## Sanity checks worth keeping

Three habits catch most overburden mistakes before they travel.

Check that the curve increases with depth everywhere. Weight only accumulates, so a decrease means a bad density sample or a depth array out of order. The engine throws on non increasing depths and on non positive densities rather than returning a quiet NaN.

Check the shallow end against the water column alone. At the mudline the overburden must equal the weight of the seawater above it and nothing else, which for this well is 1.005182 MPa.

Check that the overburden sits above the hydrostatic at every depth below the mudline. Rock grains are denser than pore fluid, so the total stress must outrun the fluid column. At TD in this well the overburden is 91.123067 MPa against a hydrostatic of 41.408580 MPa, more than twice as large. If those two curves ever cross, something upstream is wrong.

## Exercise

Write down the overburden of the golden well at the mudline and at TD, then say in one sentence each why the mudline value matches the hydrostatic at the same depth and why the TD value does not.

Self check: the overburden is 1.005182 MPa at the mudline and 91.12306695073282 MPa at TD. The mudline values match because above the mudline both curves are the same 100 m of seawater at 1025 kg/m3, so there is nothing to tell them apart. They part company below the mudline because the overburden accumulates bulk rock density, which reaches 2505.265301734371 kg/m3 at TD in this well, while the hydrostatic accumulates only pore fluid at 1030 kg/m3. By TD the overburden is 91.123067 MPa against 41.408580 MPa, more than twice the hydrostatic.
