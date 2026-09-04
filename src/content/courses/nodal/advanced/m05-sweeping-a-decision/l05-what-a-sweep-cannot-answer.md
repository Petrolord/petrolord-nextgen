# What a sweep cannot answer

A sweep says how the answer moves when one input moves. Several large questions sit outside that, and a trace looks equally convincing whether they were asked or not.

{{panel:pd-node-explorer}}

## The shape of the claim

Given these curves, these constants and this grid, the answer moves like this along this one axis. The trace is a property of the model read in one direction, not of the well.

## It does not test the curves

FORCADOS-3's test of 2400 stb/d at 2180 psia sits below its bubble point of 2450 psia, so a straight line through it inherits the bend as slope. At 531 psia they read 4969.870130, 3769.970299 and 3962.801404 stb/d, a straight line minus composite difference of 1007.068725 stb/d.

Sweep any one of them and the rate falls, the flowing pressure rises and the window closes, smoothly and in order. A sweep tests the response of a model, never the model. Nor does a clean calibration close it: BONNY-7's productivity index error is 0.00000000 stb/d/psi and its families still read 5480.000000 and 4324.444444 stb/d of open flow.

## It is blind to any error common to every point

The engine reads a gas inflow backwards off samples spaced evenly in pressure, so sparsely in rate where the curve is steepest: a chord bias of -1.477901 psi at 1328.9296 Mscf/d, and -12.910810 psi at 8.8807 Mscf/d where turbulence is strong. In a node that becomes a rate bias of -0.638815 Mscf/d.

The bias is the same at every step, so it cancels out of the shape of a trace and stays in its level. That is exactly what a sweep cannot see.

## It does not price anything, including time

Rates and pressures are not value. Turning 2246.821833 stb/d into a decision needs a price, a cost of the change, a duration and a discount rate, none of which live in a node model.

It also holds still the axis it is not sweeping. A straight line well taken from a reservoir pressure of 3200 psia to 2000 psia has a future absolute open flow of 3600.000000 stb/d, a move larger than any choke and one that happens whether anybody touches the surface or not.

## One line is not a surface

Wellhead pressure interacts with tubing size and with the friction constant, so two sweeps through one base case are two lines and not a surface.

The mistake is presenting either as an uncertainty analysis. It has the look of one, but there are no probabilities in it and every point assumes the base model is right.

## Exercise

Read FORCADOS-3's absolute open flow from the straight line, from Vogel and from the composite, and write the three side by side.

Then say what a wellhead sweep on each would look like, and which sweep output would reveal that two are wrong.
