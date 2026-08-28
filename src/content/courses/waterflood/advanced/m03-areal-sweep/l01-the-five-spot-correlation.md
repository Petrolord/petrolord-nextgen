# The five-spot correlation

Vertical sweep asks how much of the column the water reaches. Areal sweep asks how much of the AREA between the wells it reaches. This lesson introduces the published correlation the forecast engine uses, its provenance, and its validity range.

## Why areal sweep is less than one

Water injected at a point and produced at another point does not fill the plane between them. Streamlines run from injector to producer, the direct ones are short and fast, the ones that swing out to the sides are long and slow, and the water arrives at the producer along the shortest path long before it has reached the corners of the pattern.

The fraction of the pattern area contacted at the moment water breaks through is the areal sweep efficiency at breakthrough, $E_{Abt}$. After breakthrough the swept area continues to grow as more water is injected, but each additional increment costs more water than the last, because the producer is now recycling.

## The mobility ratio dependence

Areal sweep depends strongly on the mobility ratio, and the mechanism is viscous fingering. At an unfavourable mobility ratio the water, being more mobile, breaks through the oil bank along the fastest path in narrow fingers rather than as a broad front, so it arrives having contacted much less area.

That is the same $M$ that appeared in the layered analysis, doing a different job in a different dimension.

## The correlation

The engine uses the regression through Craig's five-spot data, as reproduced in Ahmed's handbook:

$$E_{Abt} = 0.54602036 + \frac{0.03170817}{M} + 0.30222997\,e^{-M} - 0.00509693\,M$$

Its quoted validity range is $M$ from about 0.15 to 10, and the engine raises a warning outside it. Values:

| $M$ | $E_{Abt}$ |
|---|---|
| 0.15 | 1 (capped) |
| 0.5 | 0.7901999780890293 |
| 1.0 | 0.6838157924688618 |
| **1.2** | **0.6573574366303985** |
| 2.0 | 0.5925829635925429 |
| 5.0 | 0.5289137535193952 |
| 10.0 | 0.4982355982194101 |

At Ekene's $M = 1.2$, water reaches the producer having swept 65.7 percent of the pattern area.

## Reading the shape

At a strongly favourable mobility ratio the correlation reaches 1 and is capped: the flood front is broad and stable and sweeps essentially the whole pattern before breakthrough. That is the ideal a polymer flood chases.

At unity it is 0.684. Even with no mobility contrast at all, a third of the pattern is unswept when water arrives, purely because of the streamline geometry of an injector and a producer in a plane. That is worth pausing on: areal sweep is not a fluid problem at heart, it is a geometry problem that fluids make worse.

At $M = 10$ it is 0.498, and the curve is flattening. Beyond about 5 the marginal damage from a worse mobility ratio is small, because the flood is already fingering.

## What "five-spot" means and why it matters

The correlation is for a five-spot pattern: four injectors at the corners of a square with a producer in the middle, or its inverse. Different pattern geometries have different areal sweeps. A line drive sweeps differently from a five-spot, a nine-spot differently again, and a pattern with irregular well spacing differently from all of them.

Ekene does not have a five-spot. It has four producers and two injectors in whatever arrangement the drilling history left, and applying a five-spot correlation to it is an approximation with no error bar. That is stated here and it is worth remembering when the forecast produces a confident-looking number in module 4.

{{panel:wf-design-explorer}}

In forecast mode the areal sweep at breakthrough is a tile. Move the mobility ratio slider and watch it move, then compare its sensitivity with the vertical sweep tile in layers mode.

## The provenance question

This is a regression through experimental and simulated data from the 1950s, reproduced through several textbooks. It is a correlation, not a derivation, and it carries the character of its source data: five-spot geometry, unit end-point relative permeabilities in some of the underlying cases, and a limited range of mobility ratios.

Using it is entirely standard and it is the right tool for screening. What it is not is a physical law, and the correct way to quote a result built on it is "on the Craig five-spot correlation".

## The misconception to avoid

"Areal sweep at breakthrough is a property of the pattern." It is a property of the pattern AND the mobility ratio, and the mobility ratio can move it from 0.5 to 1.0. Quoting an areal sweep without the mobility ratio it was evaluated at is quoting half a number.

## Exercise

First, evaluate the correlation at $M = 1.2$ by hand from the four terms and confirm you get 0.6573574366303985. Report each term separately and say which dominates.

Second, compute the areal sweep at $M = 0.3$, which is where a fourfold polymer viscosity increase would put Ekene, and express the gain over $M = 1.2$ both in absolute terms and as a percentage.
