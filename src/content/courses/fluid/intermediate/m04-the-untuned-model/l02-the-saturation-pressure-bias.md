# The saturation pressure bias

Six percent high on a heavy oil, and it is a known direction rather than a surprise.

{{panel:fluid-study-explorer}}

## The number

Measured 2634.65 psia at 220 F. Untuned model:

$$2791.100735294379 \text{ psia}$$

That is +5.938198064045652 percent.

## Where a saturation pressure comes from in the model

Not from a correlation. The model searches for the pressure at which the mixture first splits into two phases at the stated temperature.

Concretely: run a stability test at a pressure, ask whether a second phase can form, and bisect on the pressure where the answer changes. The saturation pressure is the boundary of the two-phase region and the model finds it by walking up to it.

That is a much more expensive calculation than a correlation and it is a much more informative one, because it depends on every component's properties rather than on gravity and temperature.

## Why it comes out high on heavy oils

The bias traces back to the plus fraction.

A single pseudo-component with one critical temperature stands in for a distribution of compounds ranging from C7 to something very heavy. The lump's characterized properties are an average, and averages are not what controls the onset of a phase split.

The first bubble forms because the LIGHTEST components in the mixture want to leave. A model that has smeared the heavy end into one average component gets the balance between the light and the heavy end slightly wrong, and for a black oil that error typically pushes the saturation pressure up.

The engine's own harness records the same direction across the eight Coats and Smart fluids: heavy oils tend to come out high, and lean condensate dew points tend to come out low.

## What six percent does

**To a depletion forecast.** A reservoir at 3000 psia declining a few hundred psi a year crosses its bubble point in a different year on a 2791 psia model than on a 2635 psia one. Everything about the gas handling and the well performance downstream shifts with it.

**To a comparison against a correlation.** Standing on this fluid would give some other answer, and a six percent equation-of-state error is comparable to correlation scatter. On saturation pressure alone, the untuned equation of state is not obviously better than a correlation, which is a genuinely useful thing to know.

**To the formation volume factor.** This is the big one on this fluid, and it is the next lesson but one: the model saturating above the stated reservoir pressure removes the basis for reporting Bo at all.

## Why the engine does not correct it

Because a correction applied blind is worse than a documented bias.

The direction is known but the magnitude depends on the fluid, so a general correction would fix this study and break another. What the engine does instead is pin the observed bias in its gate suite, so the number is on record and a change in it fails a test.

The right fix for a specific fluid is to tune the model to that fluid's measurements, which is the Expert tier.

## The check to run on your own fluid

If you have a measured saturation pressure, compare it before doing anything else. Six percent is ordinary for an untuned model; twenty percent says something is wrong with the composition, the characterization or the temperature.

If you do not have one, you have no way to know where on that range you are, and the report should say so.

## The misconception to avoid

"An equation of state computes the saturation pressure from physics, so it should be better than a correlation." It computes it from physics applied to a characterization that was itself correlated. The physics is exact; the inputs to it, for a third of this fluid, are constructions. Rigour in the middle of a chain does not repair the ends.

## Exercise

First, state the measured and modelled saturation pressures and the error, and say what mechanism in the characterization is thought to produce the direction of that error.

Second, explain in two sentences why a general correction for this bias would be worse than documenting it.
