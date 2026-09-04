# The stroke

The stroke is an output of the geometry. Nobody sets it, and nothing in the unit is twice the crank radius.

{{panel:pd-string-explorer}}

## One multiplication, once the beam angle is known

The beam sweeps 1.000197032783 rad on the published unit, and the polished rod stroke is that sweep times the front arm: 1.000197032783 times 106.6667 in gives 106.687716837 in. The oracle's Newton closure gives 106.689319802 in for the same unit, a difference of -1.6030e-3 in.

That gap is sampling. The engine walks 360 crank steps and takes the extremes of what it sampled, so it can only find a turning point that a whole degree lands on. It puts the bottom of the polished rod stroke at 359.000000000 deg, sample index 359 of 360.

## The upstroke is not half the revolution

The engine reports an upstroke fraction of 0.544444444444 against the oracle's 0.547222222222, a difference of -2.7778e-3, which is again one sample in 360. Either way the upstroke takes 54.444444444 percent of the turn and the downstroke takes the rest. At 10 spm that is 3.266666667 s going up and 2.733333333 s coming down.

The polished rod therefore spends longer lifting than it does dropping, on a crank that turns at one constant speed. Nothing was asked for; the shape delivered it.

## Twice the crank radius is the wrong rule

On the published unit the stroke divided by the crank radius is 3.704434612. It is not a constant of the machine either: at a crank radius of 20.000 in the same unit gives 3.497252348, and at 32.000 in it gives 3.921849154.

The front arm behaves differently. Move it from 80.0000 in to 90.0000, 100.0000, 106.6667, 110.0000 and 120.0000 in and the stroke over the front arm reads 1.000197032783 at every one of them. The arm is an exact scale factor; the crank is not.

## The mistake

Asking for a stroke and believing you got it. A stroke is requested only of the generic geometry, which scales a fixed shape rather than describing a real unit: ask it for 54.0 in and it achieves 53.999148136 in, ask for 100.0 in and it achieves 99.998422475 in, ask for 144.0 in and it achieves 143.997728363 in. The engine labels every one of them "Generic conventional geometry, scaled to the requested stroke. Not a manufacturer's unit; enter real dimensions for a real design."

## What it refuses

It refuses to give a stroke without a closed linkage. At a crank radius of 34.000 in on the published unit there is no stroke to report, only the closure message.

It also refuses to be the plunger's stroke. The 106.687716837 in belongs to the polished rod, at the top of a rod string that has not been mentioned once in this calculation.

## Exercise

Read the beam sweep and the front arm in the panel and multiply them by hand, then compare with the stroke the engine reports.

Then read the stroke at crank radii of 20.000, 28.800 and 32.000 in and write the three stroke over crank radius ratios.
