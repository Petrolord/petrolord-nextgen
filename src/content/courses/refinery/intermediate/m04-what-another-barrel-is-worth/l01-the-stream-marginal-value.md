# The stream marginal value

Module 3 read where the plan stopped. This module reads what the plan thinks a barrel is worth at the point where it stopped. The plan prints one figure for each stream, and it is the most useful single figure a planner gets from a solved month.

{{panel:refinery-plan-explorer}}

## The definition

The digest defines it exactly, and the words matter:

marginalValue is the plan's value of one more barrel of a stream arriving from outside, in US dollars a barrel: the negated dual of the stream's balance row.

Take the phrases one at a time.

**One more barrel.** The value is a rate at the margin. It prices the next barrel, and says nothing directly about a large quantity.

**Of a stream.** It belongs to naphtha, or kero, or offgas. A crude has no marginal value in this list, and neither does a product. The stream is where the value lives.

**Arriving from outside.** Picture one extra barrel of naphtha delivered to the refinery's naphtha tank without any crude being run to make it. The marginal value is what the month's margin would gain if that barrel arrived and the plan were free to use it in the best way available.

**The negated dual of the stream's balance row.** This is where the number comes from inside the solution, and it is the `crude` course that teaches what a dual is. This course takes the plan's figure as printed and reads it.

## ABUA's stream values

| stream | marginal value ($/bbl) | surplus (bbl) | products it goes into, at their prices | unit it feeds |
| --- | --- | --- | --- | --- |
| naphtha | 91.4500 | 0.00 | Naphtha export 72.5000 | Naphtha reformer |
| reformate | 111.0000 | 0.00 | Gasoline 111.0000 | (no unit) |
| kero | 105.5000 | 0.00 | Jet A-1 105.5000 | (no unit) |
| gasoil | 94.1016 | 0.00 | Gasoil export 89.5000 | Diesel hydrotreater |
| ulsd | 104.8000 | 0.00 | Diesel (ULSD) 104.8000 | (no unit) |
| residue | 59.0000 | 0.00 | Fuel oil 59.0000 | (no unit) |
| offgas | 0.0000 | 103638.71 | (no product) | (no unit) |

The table sets each stream's value beside the two things that could explain it: the prices of the products it goes into and the unit it feeds. It lets the reader find, stream by stream, which home the plan is valuing.

## Three shapes

The next three lessons each take one shape.

Four streams, reformate, kero, ulsd and residue, have one product, no unit and no surplus. Their values print the same figures as their products' prices. Lesson 2 reads them.

Two streams, naphtha and gasoil, feed a unit. Neither value prints the same figure as its export product's price. Lesson 3 reads why a stream that feeds a unit is valued through that unit.

One stream, offgas, has no product, no unit and a surplus. Its value is 0.0000. Lesson 4 reads a stream worth nothing.

Lesson 5 then prices one more barrel of reformer capacity.

## What the value is for

A stream value answers a trading question the plan itself cannot ask. Suppose someone offers the refinery a parcel of naphtha from outside. The plan's value of naphtha, 91.4500 dollars a barrel, is the most the next barrel is worth to this month as planned. It is the benchmark against which the offer is read, for a small parcel. A large parcel changes the plan, and the plan must be solved again with it.

The value is also a map of the month. A stream worth more than any product it could be sold as is a stream a unit is turning into something better. A stream worth nothing is a stream the configuration cannot use.

## Exercise

Read the naphtha row, marginal value 91.4500, surplus 0.00, Naphtha export at 72.5000, feeds the Naphtha reformer. Then read the offgas row, marginal value 0.0000, surplus 103638.71, no product and no unit. Say what each row's value is the value of, in the digest's words, and what the offgas surplus has to do with its value.
