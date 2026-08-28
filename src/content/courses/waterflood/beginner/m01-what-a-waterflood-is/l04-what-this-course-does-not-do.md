# What this course does not do

Reservoir engineering is one subject taught as several, and a great deal of confusion comes from courses that quietly reach into each other's territory. This lesson draws the boundary of this course explicitly, so that when you meet a number here you know whether we derived it or imported it, and when you need a number we do not have, you know where it lives.

## What this course owns

This course owns the bookkeeping of a flood and the decisions that follow from it. Concretely:

- **Voidage.** Converting produced and injected volumes to reservoir barrels, deciding what counts, and turning that into a ratio. This tier.
- **The ledger.** Aggregating well rows into periods, rolling windows, target bands, fill-up, and the pressure track that tests whether the ratio kept its promise. This tier.
- **Allocation and patterns.** Splitting one field's injection among producers, and discovering that a field average can hide two broken halves. The Professional tier.
- **Surveillance diagnostics.** Injectivity from injection pressure, water arrival mechanism from the water oil ratio, and the honest limits of correlating injector rates against producer rates. The Professional tier.
- **Sweep and forecast.** Vertical sweep down a layered column, areal sweep across a pattern, and a rate-time forecast that can be checked against what the field actually did. The Expert tier.

## What this course imports

**Displacement physics belongs to SCAL and Displacement.** The fraction of oil that a water front removes from the rock it passes through, the saturation at that front, the pore volumes that must be injected before water breaks through: all of that is constructed there, from relative permeability curves and a tangent line, and this course takes the answers as given. When the Expert tier's forecast needs to know that breakthrough happens after 0.33077027444818546 pore volumes, it calls the same fractional flow engine the SCAL course teaches, and it does not re-implement it. There is exactly one definition of that number in the Petrolord codebase and both courses read it.

**Volumetrics belong to ReservoirCalc.** The 12139208.107496763 stock tank barrels of oil in place is a booked, locked number from the geoscience ladder. We use it, we never recompute it, and when a flood calculation disagrees with it we treat that as information about the flood, not a correction to the booking.

**Material balance belongs to Material Balance.** The tank equation that converts cumulative production into a pressure is developed there. This course uses it in one place, to build the pressure track in module 4, and it uses the same constants and the same closed form so that the flood-era track continues the depletion-era track without a seam.

**Valuation belongs to Petroleum Economics.** When a lesson says a flood design is better or worse, it means technically better on a stated measure. Nothing here is a discounted cash flow, and no number here should be carried into an investment case without going through the economics tooling.

## Two things nobody owns yet

There are two places where this course will say "screening only" and mean it.

The first is **enhanced oil recovery**. The Expert tier discusses EOR screening because the natural question after a waterflood forecast is "what if we injected something other than water", but the Petrolord engine set has no central, validated EOR module. So EOR appears in this course as a way of thinking about a decision, with no graded number attached to it. If you see an EOR screening chart elsewhere in the industry with three significant figures on it, ask what validated it.

The second is **anything requiring a simulator**. Pattern interference, crossflow between layers, and the actual three-dimensional geometry of a flood front are simulator questions. Everything in this course is an analytical screening tool of the Craig monograph lineage, and each of those tools carries assumptions that the engines surface as warnings rather than hiding. When the Expert tier's forecast prints "vertical sweep applied as a constant multiplier on the flooded volume (screening simplification)", that warning is the engine telling you the boundary of its own competence.

## Why the boundary is worth drawing

Because the most expensive mistakes in field development are not arithmetic mistakes. They are category mistakes: a pressure number read as a recovery number, a screening estimate carried into a sanction case, a lab measurement scaled to the field without the scaling being stated. Every module in this course has at least one lesson whose real subject is which question a number answers.

## A worked example of the boundary

Here is one that recurs. The Expert tier's design forecast reports a recovery factor of 0.5545614215589451. Fifty five percent recovery sounds implausibly good for a waterflood, and it would be, if it were a recovery factor of the field. It is not. It is a recovery factor of the **flooded** oil in place in one pattern element, after the vertical sweep multiplier has already reduced that volume. Change which volume it is "of" and the same arithmetic gives a very different headline. Neither number is wrong; only one of them answers "what fraction of Ekene's oil will this flood recover", and it is not that one.

## The misconception to avoid

"If the course does not cover it, it does not matter." The opposite is usually true: the things a screening course leaves out are the things that decide real floods. What a well-drawn boundary buys you is not permission to ignore them, but the ability to say precisely what you have and have not accounted for when someone asks.

## Exercise

First, list three numbers you expect to need in a flood evaluation that this course explicitly does not produce, and name the tool or course that produces each.

Second, take the recovery factor example above. Write the one sentence you would put under that number in a report so that a reader three months later could not mistake which volume it refers to.
