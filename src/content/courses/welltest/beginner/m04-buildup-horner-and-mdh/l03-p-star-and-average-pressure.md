# p star and average pressure

The extrapolation is a real number with a precise meaning, and it is not the reservoir pressure.

{{panel:wt-buildup-explorer}}

## What p star is

p* is the pressure the fitted semilog line reaches when extrapolated to a Horner time of 1, that is, to infinite shut-in.

It is a property of the LINE, not of the reservoir. Change the window and p* moves. It is defined for any fitted line whether or not the line was the right one.

For an infinite-acting reservoir that has produced only a little, the extrapolation is meaningful: the reservoir really would recover to something close to the initial pressure, and p* estimates it. On the buildup in this course, whose reservoir is infinite-acting and whose initial pressure is 4800 psia, the late-window fit extrapolates to within a fraction of a psi of it. You will produce that number in the capstone.

That is a satisfying result and it is also the easiest case there is.

## Why it is not the average pressure

Once a reservoir has boundaries and has been produced, three pressures diverge.

**The initial pressure** is history. It is what the reservoir had before anything was taken out.

**The average pressure** of the drainage volume is what material balance wants and what the well can eventually be produced against. It falls as the field is depleted.

**p star** is the extrapolation of a semilog line drawn during a finite shut-in on a bounded reservoir, and it sits ABOVE the average pressure, sometimes far above.

The reason is that the semilog line describes infinite-acting flow, and extrapolating it to infinity pretends the reservoir keeps supplying from an unbounded region that does not exist. The line overshoots.

## Correcting it

The classical corrections are the Matthews-Brons-Hazebroek method and the Dietz method, which take p*, the drainage geometry, the well's position in it, and a dimensionless producing time, and return the average pressure.

They are not in this engine, and this course does not teach them. That is a scope decision and it is stated plainly: `engines/welltest` computes p* and the course grades p*. Turning p* into an average pressure needs a drainage area and a shape factor that a single-well test does not provide, and the Expert tier's closing module lists it among the things this course teaches about and does not certify.

What the course does teach is the closed-rectangle case, where the boundary is reached during the test and the pore volume falls out of the late Cartesian line directly. That is the Professional tier's module 3, and it is a measurement rather than a correction.

## What to do with p star

Three honest uses.

**As an estimate of initial pressure on a new well**, where nothing has been produced and there is no divergence to worry about.

**As an upper bound on the average pressure**, which it always is for a bounded reservoir.

**As a consistency check between tests**, because a falling p* over a sequence of tests on the same well is depletion, and that trend is informative even if no single value is the average pressure.

## The fragility

p* is the intercept of the fitted line extrapolated a long way past the data. On this buildup, the last point sits at a Horner time of about 1.45, and the extrapolation runs from there to 1. That is a short extrapolation in logarithmic terms and it is why the answer is good.

On a test shut in for only a small fraction of its producing time, the last point might sit at a Horner time of 20 or 50, and the extrapolation to 1 is then over more than a decade of a line whose slope came from a window you chose. Small errors in the slope become large errors in p*.

The rule of thumb is to distrust an extrapolation longer than the data it was fitted over.

## The misconception to avoid

"p star is the reservoir pressure." It is the intercept of a straight line. In one specific and common case it is a good estimate of the initial pressure. In the general case of a produced, bounded reservoir it is above the average pressure by an amount that needs geometry to compute, and reporting it as the reservoir pressure overstates what is left.

## Exercise

Open the panel and read p* for the window that uses every point and for a late window.

State the difference between them in psi. Then say which of the two is above the true initial pressure of 4800 psia and explain, from the shape of the Horner plot, why the badly fitted line extrapolates the way it does.
