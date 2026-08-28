# Saturation pressure

The pressure at which a mixture first splits, found by search rather than by formula.

{{panel:fluid-tuning-explorer}}

## What it is

The boundary of the two-phase region at a fixed temperature. Below it the mixture splits; above it, it does not. For an oil that boundary is a bubble point; for a gas it is a dew point.

There is no closed form. The equation of state does not have a saturation pressure in it any more than it has a bubble point in it: the boundary is where the stability test changes its answer, and finding it means looking.

## How the engine finds it

Scan on a logarithmic pressure grid, evaluating the stability flag at each point, until it changes. Then bisect between the two bracketing pressures until the interval is smaller than a tolerance.

The tolerance is 0.05 psia. That is worth remembering because it has consequences beyond precision, which the tuning module returns to.

## Why the scan is logarithmic

Because saturation pressures span orders of magnitude across the fluids a tool has to handle, from a heavy oil at a few hundred psia to a rich condensate at ten thousand. A linear scan either misses the low end or wastes a great many evaluations at the high end.

## Bubble or dew

The engine classifies the boundary it found, because knowing the pressure is not enough: a bubble point and a dew point are different physical situations.

Classification is by an inset ladder, probing just inside the two-phase region at one, three and six percent, and asking which phase is the minor one. A tiny amount of vapour in mostly liquid is a bubble point; a tiny amount of liquid in mostly vapour is a dew point.

When the flash probe cannot classify, near the critical point where the two phases are similar, there is a fallback that judges by liquid-likeness from the volume ratio, and the result is marked with the source of the classification.

Marking which method produced a classification, rather than silently falling back, is the same instinct as the tier labels: the answer carries how it was obtained.

## What it costs

Far more than a correlation. Each stability evaluation is an iterative calculation, the scan does several, and the bisection does a dozen more.

A Standing bubble point is a few floating-point operations. A saturation pressure from an equation of state is thousands, and it depends on every component's characterized properties rather than on gravity and temperature.

Which is why it can be better and is not automatically better. The Professional tier measured this one at six percent from the laboratory.

## Good Oil, untuned

$$2791.100735294379 \text{ psia at } 220 \text{ F}$$

against a measured 2634.65. The tuning module's first target.

## The near-critical limit

At reduced temperatures near one the two-phase region narrows and the stability flag can change over a very small pressure interval. A scan with a fixed grid can step over it.

The engine's documentation states this limit rather than pretending the tracing is complete: narrow windows can be missed, and near-critical envelopes truncate. A tool that draws a curve without saying where its tracing stops working is inviting a reader to trust the part that is wrong.

## The misconception to avoid

"A saturation pressure from an equation of state is a first-principles calculation, so it is better than a correlation." It is a rigorous calculation on characterized inputs, a third of which came from correlations applied to a lumped pseudo-component. The rigour is in the middle of the chain. The Professional tier measured the result at six percent from a laboratory measurement, which is correlation-scale error.

## Exercise

First, describe how the engine finds a saturation pressure, in four steps, and say why the pressure scan is logarithmic.

Second, explain in two sentences why classifying a boundary as a bubble point or a dew point requires probing inside the two-phase region rather than reading anything at the boundary itself.
