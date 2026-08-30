# The closed rectangle

Every direction bounded, and the one case where a well test measures a volume.

{{panel:wt-diagnostic-explorer}}

## What closed means

A closed reservoir has no-flow boundaries in every direction. Nothing enters, nothing leaves except through the well. It is a tank.

The fixture is a rectangle 2000 ft by 1400 ft with the well off-centre: 600 ft to the west boundary, 1400 ft to the east, 500 ft to the south, 900 ft to the north. Planted permeability 85 mD, skin plus 2.

The engine's rectangle model takes those four distances directly and converts them to dimensionless positions in a box, which is the natural parameterisation for a well that is not in the middle.

## The three phases

**Radial flow.** Before any boundary is felt, the well behaves as though the reservoir were infinite. On this fixture that lasts to about 5 hours.

**Transition.** The boundaries are felt one at a time, nearest first. The south wall at 500 ft, then the west at 600, then the north at 900, then the east at 1400. Each one bends the derivative upward as the region available to supply the well is cut off.

**Pseudo-steady state.** Once every boundary has been felt, the situation stops changing shape. The pressure everywhere in the tank falls at the same constant rate, set by the rate of production and the compressibility of the tank's contents. The pressure drop becomes linear in TIME, and the derivative rises on a unit slope.

The engine reports the second unit-slope segment as "Boundary / pseudo-steady state", correctly, because its one ordering rule relabels a last unit slope.

## Why pseudo-steady state is different from everything else

Every other regime in this course is about how fast pressure spreads, which is a rate. Pseudo-steady state is about how much fluid the tank holds, which is a volume.

That distinction is why this fixture is the only one in the course whose answer is a volume, and why the answer is so good. During pseudo-steady state the pressure decline rate is

    dp/dt = 0.23396 q B / (ct Vp)      psi per hour

with Vp the pore volume in cubic feet. That equation has no permeability in it, no skin, no geometry, no wellbore radius. It is a material balance on a closed tank.

So a Cartesian plot of pressure against TIME, not log time, has a straight line at late time whose slope gives the pore volume directly.

## What it does not give you

The pore volume, not the oil in place. Turning one into the other needs a saturation and a formation volume factor from elsewhere.

The pore volume of the DRAINAGE VOLUME, which is the region this well is connected to, not the reservoir. A field of five wells has five drainage volumes and their sum is not necessarily the field.

And it says nothing about the shape. The same pore volume could be a square, a long channel, or an irregular compartment, and the pseudo-steady state slope is identical. Shape comes from the transition, not from the final line.

## Why the well's position matters for the transition and not the line

The four boundary distances shape the transition, because they are felt at different times. Once all four have been felt, only the enclosed volume matters.

That is a useful asymmetry. It means the LATE line gives a robust volume even if the geometry is uncertain, and the geometry has to be extracted from the messier transition if it is wanted at all.

## The condition that has to hold

Pseudo-steady state requires that the whole drainage volume is depleting together, which requires that the well has been produced at a constant rate long enough for every boundary to be felt.

That is a demanding condition. A test long enough to reach pseudo-steady state in a large compartment is rarely run, which is why closed-boundary volumes come far more often from production data over months than from a shut-in test over days. That is the Expert tier's rate transient analysis, and it is the same physics with a different time axis.

## The misconception to avoid

"Unit slope at late time means a closed reservoir." It means the pressure is falling linearly in time, which is what a closed tank does. It is also what wellbore storage does, which is why the engine has the first-and-last ordering rule. And on a short test, a late unit slope can be the beginning of a transition rather than established pseudo-steady state, in which case the volume read off it is too small.

## Exercise

The fixture's rectangle is 2000 by 1400 ft, which is 2,800,000 square feet, or a bit over 64 acres.

Using porosity 0.18 and net pay 45 ft, compute the pore volume in cubic feet and in barrels. Then compute how long it would take, at 450 stb/d with a formation volume factor of 1.25, to produce one percent of that pore volume, and comment on what that says about the length of a test that reaches pseudo-steady state.
