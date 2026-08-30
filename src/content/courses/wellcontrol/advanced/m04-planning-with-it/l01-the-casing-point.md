# The casing point

The decision kick tolerance was invented for.

{{panel:wc-tolerance-explorer}}

## The question

How deep can this hole section be drilled before it has to be cased off?

## The constraints

**Pore pressure rising** means the mud weight has to rise to stay overbalanced.

**A fixed shoe** means the fracture pressure at the weakest point does not change.

So the mud weight climbs toward the shoe's fracture gradient, and the margin between them shrinks.

## Where kick tolerance comes in

The margin has to accommodate more than the mud. It has to accommodate an INFLUX of a design size, expanded up to the shoe.

Kick tolerance is that requirement expressed as a volume, and the section can be drilled until the tolerance falls to the design kick size.

## The sweep

The tolerance explorer's sweep is exactly this calculation: kick tolerance against mud weight, at a fixed shoe and a fixed fracture gradient.

On the slant well at a 1750 kg/m3 fracture equivalent and a 60 kg/m3 kick intensity:

| mud density | kick tolerance |
|---|---|
| 1200 kg/m3 | 7.8144842668708145 m3 |
| 1320 kg/m3 | 5.019593279024423 m3 |
| 1440 kg/m3 | 2.783680488747303 m3 |
| 1560 kg/m3 | 0.9542972967023874 m3 |
| 1680 kg/m3 | 0 m3 |

## Reading it

If the design kick is 3 m3, this section can be drilled to a mud weight of about 1430 kg/m3 and no further.

If the design kick is 1 m3, it can go to about 1555.

The choice of design kick is therefore a well design decision with a direct depth consequence, and it is made by policy rather than by calculation.

## Why the curve steepens

Because the tolerance goes to zero at the mud weight where the fracture gradient is reached, and it approaches that point with a finite slope from a value that is already small.

So the last hundred kilograms per cubic metre of mud weight costs most of the remaining tolerance.

## What happens at the casing point

Run casing, cement it, and the new shoe becomes the weakest point. It is deeper, so its fracture pressure is higher, and the whole calculation restarts with more room.

That is the entire logic of a casing programme.

## Exercise

From the table, estimate the mud weight at which the slant well's kick tolerance falls to 2 m3.

Then say what pore pressure that mud weight corresponds to at the bit, and what depth it would be reached at with a normal pressure gradient.
