# A capacity ratio of zero

A capacity ratio of zero is a stream that absorbs heat without changing temperature. A boiling liquid or a condensing vapour behaves that way, because its capacity rate is effectively unbounded and the ratio of the smaller to the larger goes to nothing. At that limit the arrangement stops mattering, and all three arrangements this module carries collapse onto one curve.

{{panel:fc-rating-explorer}}

## One curve, three closed forms

| NTU | counter | parallel | 1-2 shell |
| --- | --- | --- | --- |
| 0.250000 | 0.221199 | 0.221199 | 0.221199 |
| 0.750000 | 0.527633 | 0.527633 | 0.527633 |
| 1.400000 | 0.753403 | 0.753403 | 0.753403 |
| 2.600000 | 0.925726 | 0.925726 | 0.925726 |
| 4.500000 | 0.988891 | 0.988891 | 0.988891 |
| 8.000000 | 0.999665 | 0.999665 | 0.999665 |

Every row carries one figure three times. The engine reports the three as equal on every row of that sweep, which is a measurement of the agreement rather than a claim about it. Nothing in the table is rounded to make it look that way, and the equality is asked of the engine rather than asserted by whoever wrote the table down.

## Why the arrangement drops out

An arrangement matters because it decides which end of one stream faces which end of the other. A stream that does not change temperature has no ends to pair. It presents the same temperature everywhere along the bundle, so counter-current, parallel and one shell with two tube passes all see the same driving force profile and all deliver the same fraction.

Read that as a statement about what an arrangement is for. The whole of the difference between the three arrangements is bookkeeping about which fluid has already been warmed by the time it meets a given piece of metal. Remove the warming and the bookkeeping has nothing to record.

## The ceiling goes with it

At this limit the ceiling is 1.000000 for all three arrangements. With nothing limiting the cold side there is no arrangement penalty left to pay, so the two arrangements that have a ceiling elsewhere have none that bites here. Note what the engine does: it reports 1.000000 rather than reporting nothing, because one is the value the relation actually approaches.

## Where this limit sits in the file

The published file for this module carries a row in each of the three arrangements at this limit, so the collapse is in the committed data and not only in the table above. At an NTU of 1.500000 the effectiveness at that limit is 0.776870, and the same figure stands in all three arrangements.

A limit that three separate branches of code have to reproduce independently is worth a row of its own. The next lesson is about what such a row can find that an ordinary case cannot.

It is also the cheapest row in the file to write, which is worth saying plainly. It needs no publication, no chart and no correlation. It needs only the observation that a phase change fixes a temperature, and three pieces of code that have to agree about what happens next.

## Exercise

Record the six NTU values above with the effectiveness each one produces, and note that one figure serves all three arrangements on every row. Say in your own words why a stream at constant temperature leaves an arrangement with nothing to decide. Then record the ceiling at this limit and say why it is a number here and empty for counter-current flow everywhere else.
