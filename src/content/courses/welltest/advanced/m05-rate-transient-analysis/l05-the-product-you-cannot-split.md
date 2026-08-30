# The product you cannot split

A measurement of two things multiplied together, and no way to separate them.

{{panel:wt-regression-explorer}}

## Transient linear flow

Before a fractured well feels any boundary, flow into the fracture is linear and the rate-normalised drawdown is linear in the square root of time:

    dp / q = m_L sqrt(t) + b

with

    m_L = 4.064 B sqrt( mu / (k phi ct) ) / (h xf)

The engine's `transientLinearAnalysis` fits that line and returns the product

    xf sqrt(k) = 4.064 B sqrt( mu / (phi ct) ) / (h m_L)

## The result

On the linear-flow fixture, the fit recovers the planted product of 500 ft times root millidarcy to fifteen significant figures, at an r squared of 1 over 40 rows.

That is the most exact recovery anywhere in this course. There is no window ambiguity, no transient to wait out, no boundary to avoid: the fixture is pure linear flow and the analysis is a straight line through it.

## And it stops there

Look at what was recovered. Not the half-length. Not the permeability. Their product, with the permeability under a square root.

The same product is consistent with:

| permeability (mD) | half-length (ft) |
|---|---|
| 1 | 500 |
| 5 | about 224 |
| 10 | about 158 |
| 50 | about 71 |

Every one of those fits the data exactly as well as every other. The linear-flow data cannot distinguish between them, because they enter the solution only through that combination.

## Why this matters so much in unconventionals

A multi-fractured horizontal well in shale may produce in linear flow for its entire economic life. Boundary-dominated flow, which is where the volume comes from, arrives after years or never.

So the single most-reported number in unconventional well analysis is a product, and the split into permeability and half-length is made by ASSUMPTION.

Two engineers with the same data and different assumed permeabilities report different fracture half-lengths, and both are consistent with the data. Neither is checkable from the data. The completion is then evaluated on a number that came from an assumption about the rock.

## What breaks the degeneracy

Three things, and each of them costs something.

**Reaching boundary-dominated flow.** Once the well feels its boundaries, the volume enters and the product splits. This is why long production records are worth more than they look.

**An independent permeability.** From a pressure buildup, a core, or a nearby well. That is the standard practice and it imports the other measurement's uncertainty.

**A pressure transient on the same well.** A buildup long enough to reach radial flow gives k directly, and then the half-length follows. Long enough is often longer than anybody will authorise.

## How to report it

Report the product. It is what was measured, it is exact, and it is comparable between wells.

Then report the half-length as a function of assumed permeability, in a small table like the one above, with the permeability you used flagged and its source named.

A single half-length quoted without the permeability it assumed is not a measurement. It is a measurement times a guess, presented as a measurement.

## The pattern this closes

The course has now shown four kinds of limit on what a well test can say.

A quantity can be biased by a window choice, as the semilog permeability was. It can be biased by a mis-specified model, as the fractured well read as radial was. It can be unconstrained by the data even though the fit reports it, as the phantom fault was. And it can be measurable only in combination with another quantity, as here.

The four need different responses. The first needs a better window. The second needs a diagnosis. The third needs a perturbation check. The fourth needs another measurement, and no amount of care with this one will substitute.

## The misconception to avoid

"With more data the product would separate." Not while the flow regime is linear. More linear-flow data determine the product better and say nothing about the split. The degeneracy is in the physics of the regime, not in the quantity of data, and only a different regime or a different measurement resolves it.

## Exercise

Using the product of 500 ft times root millidarcy, compute the half-length implied by permeabilities of 0.001, 0.01 and 0.1 mD, which is the range for a shale.

State the three half-lengths and say what that spread means for evaluating a fracture design against a 300 ft target.
