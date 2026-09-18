# A capacity rate is the whole of a stream

A capacity rate is a mass flow multiplied by a heat capacity, in Btu an hour per degF. It is how many Btu an hour that stream absorbs or gives up for every degree its temperature moves. And it is the whole of what an energy balance knows about a stream. Nothing else about the fluid survives the multiplication.

{{panel:fc-exchanger-explorer}}

## Four streams, four capacity rates

| stream | lb an hour | Btu per lb per degF | capacity rate, Btu an hour per degF |
| --- | --- | --- | --- |
| the studio hot stream | 50000.0000 | 0.550000 | 27500.0000 |
| the studio cold stream | 80000.0000 | 1.000000 | 80000.0000 |
| the ORON hot stream | 74000.0000 | 0.620000 | 45880.0000 |
| the ORON cold stream | 112000.0000 | 0.990000 | 110880.0000 |

The studio case is the one the Heat Exchanger & Cooling Studio opens with, so every figure on its rows can be checked against a live screen. ORON is a second exchanger this course carries alongside it, with four tube passes instead of two. The two cases share nothing, and their figures must never be mixed.

## Why the multiplication throws information away on purpose

Look at the studio cold stream. A mass flow of 80000.0000 lb an hour at a heat capacity of 1.000000 Btu per lb per degF gives a capacity rate of 80000.0000 Btu an hour per degF, because multiplying by one leaves a number where it was. The balance cannot tell that stream apart from any other stream with the same product.

That is the useful part. Once the capacity rate exists, a balance does not care whether you have a lot of a fluid with a small heat capacity or a little of a fluid with a large one. Two streams with the same capacity rate behave identically in every equation in this module. The studio hot stream, at 50000.0000 lb an hour and 0.550000 Btu per lb per degF, is 27500.0000 Btu an hour per degF, and that single number is all the balance carries forward.

## What this hides, and where to be careful

The heat capacity is treated as a constant over the whole temperature range of the exchanger. A real fluid's heat capacity moves with temperature, and this module does not track that. If your stream changes phase, or if its heat capacity moves a lot between inlet and outlet, a single capacity rate is a simplification and you should know you have made it.

## The door and its answer

The capacity rate is its own export. It is called with a named-argument object carrying the mass flow and the heat capacity, and it answers with an object carrying one key, which is the capacity rate. A non-positive mass flow is refused with a named string rather than answered with a zero, because a stream that is not flowing is not a stream the balance can use.

## Exercise

Work out each of the four capacity rates above from its own two inputs, and check each against the table. Then take the studio hot stream and invent a second stream with a different mass flow and a different heat capacity that gives the same 27500.0000 Btu an hour per degF, and say what any equation in this module could use to tell the two apart.
