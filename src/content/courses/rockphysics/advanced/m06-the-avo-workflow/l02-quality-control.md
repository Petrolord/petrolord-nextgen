# Quality control

Six checks, and three things none of them can see.

## The intercept against normal incidence

Compute the impedance contrast directly and compare it against the Shuey intercept. They should agree to the third or fourth decimal.

At Ekene: 0.034457 against 0.034344 for brine, and -0.0629911815139045 against -0.06282494068620303 for gas.

A larger disagreement than that means the linearisation is being pushed harder than it should be, which is a warning that the contrasts are too large for Shuey to be trusted anywhere.

## The gradient decomposition

Add the three terms and confirm they give the gradient.

At Ekene, $0.028802610843132695 + 0.123952089 - 0.409318044 = -0.256563344$.

This catches sign errors in the weighting factor, which is the most common implementation mistake, and it also tells you which contrast is driving the answer, which is worth knowing whether or not the check passes.

## The exact solution at zero degrees

The exact solution at zero degrees must equal the impedance contrast exactly. If it does not, the implementation of the exact solution is wrong.

This is a good check because the exact solution is complicated enough that errors in it are hard to spot any other way.

## The imaginary part

For a pre-critical interface the exact reflection coefficient must be purely real. At Ekene the critical angle is 70.7 degrees, so the imaginary part must be zero over the whole 0 to 40 degree range.

A non-zero imaginary part inside the recorded range means either a critical angle is present, which changes the interpretation entirely, or the implementation is wrong.

## The class against the sign of the intercept

A positive intercept must give class I or II, never III or IV. A negative one must give II, III or IV, never I.

Trivial, and it catches transposed rock pairs, which are easy to make and produce plausible looking numbers with every sign reversed.

## The tuning against theory

The reported tuning thickness must be within one grid sample of $389.8484/f$ milliseconds.

At 25 Hz that is 15.594, and the engine reports 16 on a 1 ms grid. Anything further away means the wedge model or the peak search is wrong.

## What none of them can see

Three things.

Whether the overburden is right. Every number in this tier is a property of a pair, and a plausible looking model built on the wrong shale is entirely wrong and entirely self consistent.

Whether the substitution underneath is right. The gas case rocks come from the tier below with all its assumptions, and nothing here re-tests them.

And whether the interface is isolated. All six checks pass on a bed far below tuning, and the modelled coefficients then describe something the data does not contain.

## Reading it off the panel

Several of the checks can be run from the panel directly.

{{panel:rp-avo-explorer}}

The intercept tiles against the normal incidence values from module one is the first. The two error tiles measure how far the approximation drifts. The class tiles against the sign of the intercepts is the fifth. And the tuning tile against $389.8484/f$ is the sixth.

## Worked example

Run the full set on the Ekene gas case.

Intercept against normal incidence: -0.062825 against -0.062991, agreeing to the fourth decimal. Pass.

Gradient decomposition: three terms summing to -0.256563. Pass.

Exact at zero degrees: -0.0629911815139045, equal to the impedance contrast. Pass.

Imaginary part: zero throughout 0 to 40 degrees, consistent with a critical angle at 70.7 degrees. Pass.

Class against sign: intercept negative, class III, consistent. Pass.

Tuning against theory: 16 ms reported against 15.594 theoretical, within one grid sample. Pass.

Six passes, and the model could still be built on the wrong shale, which is the note to end on.

## Exercise

An AVO model returns a positive intercept and reports class III. State what has gone wrong.

Self check: class III requires an intercept below the negative threshold, so a positive intercept cannot be class III. Either the classification is reading the wrong sign convention, or the two rocks have been transposed so that the intercept was computed for the interface the other way up while the class was computed from the intended one.
