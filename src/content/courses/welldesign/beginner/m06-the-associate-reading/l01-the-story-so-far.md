# The story so far

Five modules, and one claim about every number in a well plan.

## The claim

A survey measures three numbers at a depth. Everything else, every true vertical depth, every displacement, every dogleg, every target intersection, is computed by a method somebody chose, and the choice has been wrong by twenty-five feet in two thousand.

## What each module established

**Module 1.** Measured depth, inclination and azimuth are the measurement. TVD, north, east, dogleg, vertical section and closure are all computed. Three references must be stated before any of it is usable: the depth reference, the north reference and the position reference. The well path is a curve through stations; the wellbore is a hole, and the two are not the same object.

**Module 2.** Minimum curvature assumes a circular arc between stations, which is the least-curvature shape consistent with both attitudes and close to what an assembly actually drills. Its position increment is the balanced-tangential one times the ratio factor, and that factor is 1.0006 at a five degree dogleg, so it is a small correction that is free. The methods it replaced are not all close: on the published Applied Drilling Engineering example, three agree within six tenths of a foot and the tangential method is out by twenty-five feet of TVD and forty-three of northing, systematically, in the same direction on every interval of every build.

**Module 3.** The listing is fifteen columns of which three are measured. Dogleg severity combines build and turn, weighted by the sine of the inclination, so turning is cheap when vertical and expensive when horizontal. Its two conventions differ by exactly 30.48 over 30. Vertical section needs a chosen azimuth and closure does not, and they agree only when the well ends on that azimuth.

**Module 4.** Four standard profiles, all built from holds and arcs. Build radius is the number to carry: 3 degrees per 30 m is about 573 m. The solvers are exact circle-tangent constructions and they refuse infeasible targets rather than returning a number. Toolface is the control input and it has a closed form that the engine reproduces to a hundredth of a microdegree.

**Module 5.** A design becomes a well only when it is compiled into stations, and then it goes through exactly the same mathematics as a real survey. The compiler reports the dogleg the design implies rather than the rate that was asked for, and refuses four physically impossible inputs rather than defaulting past them.

## The numbers to carry

- Build radius at 3 degrees per 30 m: about 573 m. At 3 degrees per 100 ft: about 573 ft.
- The dogleg convention factor: 30.48 over 30, exactly 1.016.
- The published ADE chapter 8 answer: TVD 1653.99 ft, north 954.93 ft at 2000 ft MD.
- The tangential method's error on it: about 25 ft shallow and 43 ft north.
- The ratio factor at a 5 degree dogleg: 1.0006351032877527.

## What this tier does not cover

Where the well actually is. Every position in this tier is quoted as though it were exact, and none of them is. The Professional tier puts an uncertainty on every one, using a published model, and shows that the uncertainty at total depth on a real validation well is tens of metres.

Nor does it cover the neighbours. A well plan that is geometrically perfect can be undrillable because it passes too close to an existing well, and the Expert tier is about that.

## Exercise

Without looking back, write down the three measured quantities and any six computed ones.

For each computed one, name the module that introduced it and state in one line what choice or convention it depends on.
