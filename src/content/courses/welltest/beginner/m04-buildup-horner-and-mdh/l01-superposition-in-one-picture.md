# Superposition in one picture

A shut-in well is two imaginary wells, and that is not a metaphor.

## The trick

The diffusivity equation is linear. That means responses add: if you know what one rate change does to the pressure, you know what any sequence of rate changes does, by adding up the individual responses.

A buildup is the simplest case. A well produces at rate q from time zero, and at time tp it is shut in. Rather than solve a new problem with a rate that changes, superposition says: keep the original well producing at q forever, and superimpose a second, imaginary well at the same location injecting at rate q, starting at time tp.

Before tp, only the producer exists and the pressure falls. After tp, the two rates cancel, the net rate at the well is zero, and the pressure recovers. The recovery is the sum of the continuing decline of the producer and the rising response of the injector.

## What the picture explains

Three things that otherwise look arbitrary.

**Why the buildup does not return to the initial pressure.** The producer is still notionally producing in the superposition. Its response keeps growing, slowly, forever. The injector's response grows too and eventually cancels it, but only in the limit. In a truly infinite reservoir the buildup does return to the initial pressure, but only after an infinite shut-in, which is why extrapolation is needed.

**Why the buildup carries the production history.** The producer's response at any shut-in time depends on how long it has been producing, which is tp plus the shut-in time. Change tp and the whole buildup changes shape. The test is not a fresh experiment.

**Why the time axis is a ratio.** Adding the two logarithmic responses gives a difference of logarithms, which is the logarithm of a ratio. That ratio is (tp + dt) / dt, and it is Horner time.

## The algebra, once

For the two superimposed wells, each producing the logarithmic radial response, the shut-in pressure is

    pws(dt) = p_i - m log10( (tp + dt) / dt )

The producer contributes a term in log(tp + dt) and the injector a term in log(dt), with opposite signs, and the constants cancel because both wells sit at the same place with the same skin.

So pws plotted against log10((tp + dt)/dt) is a straight line with slope m, and the same slope equation gives the permeability. The skin does not cancel out of the analysis entirely, because it is still in the flowing pressure at shut-in, which is why the buildup skin formula uses that pressure as its reference.

## Where the linearity fails

Superposition needs the system to be linear, and two things in a real well test are not.

**Wellbore storage changes at shut-in.** The storage coefficient while flowing and the storage coefficient while shut in are often different, because one involves a compressible column and the other a rising liquid level. When they differ, the superposition of a constant-storage solution is wrong at early shut-in times.

**Multiphase flow near the wellbore.** Once free gas is present the mobility depends on pressure and the equation is no longer linear. Superposition is then an approximation.

Both of these damage the early part of a buildup, which is already the part you were going to discard.

## The general case

Nothing about the argument is specific to one rate change. A history of many rates is a sum of many superimposed wells, each starting at its own time with the rate change at that time, and the resulting time function is a sum of logarithms with the rate steps as weights.

That general form is the Expert tier's module 3. The engine implements it directly in `superposeDeltaP`, which walks the rate steps and accumulates the response, and in `multiRateSemilogAnalysis`, which fits the corresponding straight line.

For this tier, one rate change is enough.

## The misconception to avoid

"Superposition is an approximation." It is exact for a linear system, and the diffusivity equation for a slightly compressible fluid at constant properties is linear. What is approximate is the assumption that a real well and reservoir behave like that linear system, and where that fails, it fails for physical reasons you can name rather than because the mathematics was loose.

## Exercise

A well produces for 36 hours and is then shut in. Using the two-well picture, say what the imaginary injector is doing 1 hour into the shut-in, and what it is doing 100 hours into the shut-in.

Then explain, in terms of the two wells, why the pressure recovery is fast at first and slow later.
