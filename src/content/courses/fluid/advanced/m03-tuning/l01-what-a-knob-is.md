# What a knob is

An adjustable parameter chosen because it is unconstrained, not because it is convenient.

{{panel:fluid-tuning-explorer}}

## The distinction that governs everything

**Measured quantities** are what a laboratory determined. Composition, C7+ molecular weight and specific gravity, the four separator test numbers, the bubble point.

**Constructed quantities** are what a correlation produced because a measurement was unavailable. Every property of the C7+ pseudo-component, and the binary interaction parameter between methane and it.

Tuning adjusts constructed quantities to reproduce measured ones. It never adjusts a measured quantity.

That rule decides which parameters may be knobs, and it is the same rule the simulation course applied to its structural calibration: tune the unconstrained parameter against the constrained quantity, never the reverse.

## What that rules out

**Library component properties.** Methane's critical temperature is 343.0 degrees Rankine because it was measured. A regression that moves it is fitting away from physics to absorb an error somewhere else, and the resulting model will be wrong about methane everywhere.

**The reported composition.** It is a measurement. Adjusting mole fractions to improve a fit is discarding data in favour of a preference.

**The C7+ molecular weight and specific gravity.** Also measurements, and the two inputs the whole characterization rests on.

**The published correlations themselves.** Changing Kesler-Lee's coefficients would not be tuning, it would be publishing a new correlation on a sample of one.

## What that leaves

The characterized properties of the pseudo-component, and its interaction with the rest of the mixture.

Those are exactly the numbers that were constructed rather than measured. They are the honest place to put the adjustment, because the adjustment is admitting that the construction was uncertain.

## Why not just more knobs

Because a regression with more freedom than data will use it.

Four targets can be fitted exactly by four well-chosen parameters, and by eight parameters in infinitely many ways. The eight-parameter fit will reproduce the targets and will be worse everywhere else, because it has absorbed the measurement noise into parameters that then predict badly.

That is overfitting, and in this domain it is not academic. A model tuned with too many knobs reproduces the study it was tuned to and forecasts the field wrongly, which is the failure that costs money.

## The bound

Every knob has a range, and the range is not arbitrary. It is set so that the tuned pseudo-component remains a physically plausible hydrocarbon fraction.

A critical temperature multiplier that can range over a factor of two is not a knob, it is permission to invent a substance. A multiplier constrained to a few percent is an admission that the correlation was uncertain by a few percent, which is what it was.

## The check that the bound is doing its job

If the regression converges with a knob pressed against its bound, the fit is telling you it wants to go further than physics allows. That is a signal, not a success, and it usually means something else is wrong: the composition, the characterization method, or the target data.

The engine reports which bounds were hit. On Good Oil, none are.

## The misconception to avoid

"Tuning is fitting, so more parameters give a better model." More parameters give a better FIT to the targets and usually a worse model. The measure of a tuned model is what it predicts about things it was not tuned to, and that gets worse with freedom past a point. Four knobs against four targets is already at the edge.

## Exercise

First, sort these into measured and constructed: methane's critical temperature, the C7+ acentric factor, the reported composition, the C1 to C7+ binary interaction parameter, the C7+ specific gravity, the C7+ volume shift.

Second, explain in two sentences why a knob pressed against its bound is a signal rather than a successful fit.
