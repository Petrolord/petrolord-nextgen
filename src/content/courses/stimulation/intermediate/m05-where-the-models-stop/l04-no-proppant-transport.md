# No proppant transport

The schedule places a mass. Where that mass ends up is a question the model never asks.

## What the calculation actually says

The material balance gives a pump time and an efficiency. The schedule turns those into a pad and a rising concentration, and it hands back a total mass of proppant. Nothing in that chain describes motion.

When the mass is later converted into a propped fracture, it is spread over the whole face at once, as a single areal loading equal to the mass divided by the two wing faces. That one division is the entire transport model. It assumes the proppant is everywhere on the fracture at the same concentration, from the wellbore to the tip and from the top to the bottom.

Gravity does not appear. Neither does time. A grain placed in the first second and a grain placed in the last are treated identically.

## What the slurry really does

Proppant settles. In a low viscosity fluid it settles quickly, builds a bank on the bottom of the fracture, and leaves the upper part unpropped. In a viscous fluid it settles slowly and can convect instead, sinking near the wellbore where the slurry is dense and rising elsewhere.

Proppant also bridges. When the fracture width narrows to a few grain diameters the grains arch and stop, and everything behind them stops as well. The published widths give the scale of the risk. PKN gives an average width of 0.004015981871358954 m at these conditions and KGD gives 0.0104637691458403 m, a factor of 2.6055319672793997 between them, on the same 20/40 ceramic. Whether the tip region is wide enough to accept grain is therefore partly a consequence of the model you chose in module two.

And the width in the calculation is the dynamic width, held open by the fluid. It closes on the pack once pumping stops, so the width available for transport exists only while the job is live.

## The consequence

The propped half-length is usually shorter than the created half-length, and the propped height is usually less than the created height. Both of those are transport losses, and both are invisible here.

That is why a job is judged on evidence rather than on the schedule. Tracer and temperature logs say where the proppant went, the pressure record says whether a screenout occurred, and the well's own production says whether a conductive path was left behind.

## Exercise

State, in one sentence, the assumption the areal loading makes about proppant distribution.

Then list two mechanisms that break it, and for each say whether it shortens the propped length, reduces the propped height, or both.
