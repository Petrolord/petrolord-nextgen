# What the planning forms leave out

Seven omissions, named, before the capstone rather than after.

## The framing

Everything in this tier is a Lubinski planning form. That phrase appears in the engine's own header and it is a real category: a closed-form approximation designed to be computed by hand at a desk, before anybody had a computer to solve the full problem with.

They are still used, they are still taught, and they are still approximate.

## One, the buckling length term

The classical treatment has FOUR length changes. This engine computes three. The missing one is the shortening from helical buckling, and it is missing on exactly the case that buckles.

## Two, no feedback

The buckling state is computed from the force and then not used. In reality a buckled string carries part of its load as wall contact, which changes the force that reaches the packer, which changes the buckling state.

That loop is not closed here.

## Three, one temperature for the string

A single mean change, from an input or from half a linear gradient. A real thermal profile is not linear, it changes over hours after a rate change, and the transient peak can exceed the steady state.

## Four, no annulus coupling

Heat a sealed annulus and its pressure rises, sometimes by tens of megapascals. That is annular pressure buildup and it is a live safety issue on subsea completions.

Here dPo is an input. Nothing computes it from the temperature change, so a case with 45 degrees of heating and dPo of zero is describing an annulus that somehow did not warm up.

## Five, no friction

The seal assembly has friction. So does a buckled string against the casing. Both mean that force applied at one end does not fully reach the other.

Every number in this tier assumes the string transmits load perfectly along its whole length.

## Six, one clearance and one inclination

The buckling limit uses a single radial clearance and a single hole angle of 90 degrees. A real completion passes through several casing sizes and a whole trajectory, and 90 degrees is the most stable angle there is.

## Seven, no dynamics

Everything is a steady state comparison between two conditions. Starting up a well, shutting it in and bullheading are all transients, and a transient can overshoot the steady state it is heading for.

## What that adds up to

These forms will tell you whether a completion is comfortable or marginal. They will not sign off a marginal one.

The right response to a marginal answer here is a full tubing movement analysis in a dedicated package with a thermal model behind it, and the right response to a comfortable answer is to check that the inputs were right.

## Exercise

Of the seven, pick the three you would expect to matter most on a deep subsea gas well.

For each, say which of the reported numbers it would move and in which direction.
