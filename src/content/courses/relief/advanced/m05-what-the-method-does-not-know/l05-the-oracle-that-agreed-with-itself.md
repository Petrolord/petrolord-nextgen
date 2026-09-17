# The oracle that agreed with itself

Two published blocks in this engine agree with the engine to the last bits double precision holds. One agrees to about a thousandth. The second is the stronger result, and understanding why is the last thing this module has to teach.

{{panel:fc-blowdown-explorer}}

## The two blocks that agree exactly

| golden release kW | golden distance m | golden radiated fraction | golden transmissivity | published intensity kW/m2 | engine kW/m2 | relative difference |
| --- | --- | --- | --- | --- | --- | --- |
| 50000.0000 | 100.000000 | 0.300000 | 1.000000 | 0.119366 | 0.119366 | 5.116e-15 |
| 50000.0000 | 100.000000 | 0.200000 | 0.800000 | 0.063662 | 0.063662 | 5.014e-15 |
| 12000.0000 | 35.000000 | 0.250000 | 0.900000 | 0.175395 | 0.175395 | 5.064e-15 |

| golden release kW | golden allowable kW/m2 | golden radiated fraction | golden transmissivity | published distance m | engine distance m | relative difference |
| --- | --- | --- | --- | --- | --- | --- |
| 12000.0000 | 6.310000 | 0.250000 | 0.900000 | 5.835288 | 5.835288 | 2.588e-15 |
| 50000.0000 | 1.580000 | 0.300000 | 1.000000 | 27.486039 | 27.486039 | 2.585e-15 |

Those relative differences are at the size of floating-point rounding. On this route that is the expected outcome and a good one, because the oracle finds the sphere area by quadrature and the inverse by bisection on that quadrature, so two genuinely different pieces of arithmetic meet at the same sphere.

## The block that does not

The published blowdown rows carry relative differences of 1.062e-3, 1.060e-3 and 1.062e-3 on three rows and 2.654e-4 on two, against an oracle that solves the same march in closed form in SI.

Both sets of figures above are relative differences the digest prints, and the digest computes no comparison between them. Do not divide one by the other. The two numbers are answering different questions: one is how closely a quadrature reproduces a closed form, the other is how closely an explicit march reproduces the exact integral of its own balance. A quotient of the two would be a figure about nothing.

What you may say about each is what it means. A departure of that size on the march is step error, and the refinement study in the third module measured exactly that. A departure at the size of rounding on the point source means the two implementations differ only in their arithmetic order.

## Why the looser agreement is the stronger result

How close two figures come is a much weaker signal than how independent the two sides were before they were compared. Perfect agreement between an engine and a copy of the engine tells you the copy is faithful and nothing else. A modest, explainable gap between an engine and a separate derivation tells you two different roads reached the same place, which is the only thing a published case was ever able to tell you.

The blowdown block is the second kind. A march and a closed-form integral have almost nothing in common as computations, and they land a thousandth apart for a reason you can name and measure. That is a result. A shared fit reproducing itself perfectly is not, however many decimals it manages it to.

## The question to leave with

When a published case agrees exactly, ask not how close it came but how far apart the two sides were to begin with. Then ask the question this module has been circling all the way through: if the number under test moved, is there anything here that would go red.

For most of this engine the answer is yes and the digest names the route. For the Kv fit and the sphere-drag correlation the answer is no, and the digest names those too.

## Exercise

Record the relative differences on the three published radiation rows and the two setback rows, and say why exact agreement is expected there. Record the two relative differences on the published blowdown rows and name what they measure. Say in one sentence why you may not compare the two sets. Then write the rule about shared arithmetic in your own words.
