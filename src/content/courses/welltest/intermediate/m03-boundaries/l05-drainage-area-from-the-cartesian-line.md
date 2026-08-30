# Drainage area from the Cartesian line

The most accurate number in this course, and the reason it is accurate.

{{panel:wt-diagnostic-explorer}}

## The analysis

Plot flowing pressure against TIME on ordinary linear axes. Fit a straight line to the late data, after pseudo-steady state has been established. Take the magnitude of the slope, in psi per hour, and

    Vp = 0.23396 q B / (ct m*)      cubic feet

Divide by porosity times net pay and you have a drainage area.

On the rectangle fixture, fitted over the points at 500 hours or later, this returns an area that agrees with the planted 2,800,000 square feet to a few thousandths of one percent. The r squared of the Cartesian fit is 1 to the precision printed.

## Why this one is so much better than everything else

Every other analysis in this course is an extrapolation. The semilog line extrapolates to a reference time or to infinity. The derivative plateau is approached and not reached. The fracture half-length comes from a slope over a window whose ends are judgement calls.

Pseudo-steady state is not an extrapolation. It is an equilibrium. Once every boundary has been felt, the tank is depleting uniformly and the relationship between decline rate and pore volume is an identity, not an asymptote.

There is nothing left to converge towards. The line is exactly straight and its slope is exactly the material balance.

That is why the answer is accurate to three thousandths of a percent when the permeability from the same course of study is good to a few percent at best.

## The conditions, stated plainly

The accuracy is conditional and the conditions are strict.

**Pseudo-steady state must be established.** Fitting the transition instead gives a slope that is still steepening, so the volume comes out too small. The derivative reaching a clean unit slope is the evidence.

**The rate must be constant.** The equation has q in it and assumes it has been constant long enough for the tank to settle. A rate change resets the clock.

**The compressibility must be right.** Vp is inversely proportional to ct. A total compressibility 20 percent high gives a pore volume 17 percent low, from data that fit the line just as well. This is the largest single uncertainty in the answer and it comes entirely from outside the test.

**The tank must be closed.** If any boundary leaks, or an aquifer supplies, there is no pseudo-steady state and the late line is something else.

## What to report

The pore volume, the compressibility used, and the area that follows from the porosity and net pay you divided by.

Reporting an area without the compressibility is reporting the smallest number in the chain without the biggest lever on it.

## Comparing with volumetrics

A drainage volume from a well test and a volume from a map are genuinely independent, which makes the comparison valuable.

If the test volume is smaller, the well is in a compartment: faults, pinch-outs or facies changes are cutting it off from rock the map includes.

If the test volume is larger, the well is connected to more than the map gives it, or the compressibility used was too low, or pseudo-steady state was not really established.

Either way the disagreement is a geological statement, and it is one of the few places where a pressure transient speaks directly to a static model.

## What this module established

Boundaries end the radial line, and each kind ends it differently: a sealing fault doubles the derivative, a constant-pressure boundary makes it plunge, a channel gives it a half slope, a closed system gives it a unit slope.

Fitting a semilog line past a sealing fault reports about half the permeability and inverts the skin's sign, which is the same failure as fitting one through wellbore storage and the same characteristic direction.

And when the reservoir is closed and the test reaches pseudo-steady state, the late Cartesian line measures a pore volume with an accuracy nothing else in the course approaches, because it is an equilibrium rather than an extrapolation.

## The misconception to avoid

"The drainage area is the well's share of the field." It is the pore volume the well is currently connected to, at the current well configuration, under the current rates. Drill an infill well and it changes. Shut in a neighbour and it changes. It is a dynamic quantity and it should be dated.

## Exercise

Open the panel on the closed-rectangle fixture, take the pore volume it reports, and recompute the drainage area using a total compressibility of 1.0e-5 and then 1.5e-5 per psi instead of the 1.2e-5 used.

State the three areas in acres. Then write the sentence you would put beside a drainage area in a report so that the reader knows how much of it is the test and how much is the compressibility.
