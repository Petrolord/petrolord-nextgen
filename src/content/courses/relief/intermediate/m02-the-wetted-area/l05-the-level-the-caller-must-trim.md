# The level the caller must trim

{{panel:fc-fire-drum-explorer}}

The previous lesson said the height limit is the caller's job. This one is about doing that job, because trimming a level is an operation with three separate traps in it and none of them announces itself.

## Trim before the call, never after

The order matters. The route takes a level and returns an area, so a level trimmed after the call is a level that never reached the calculation. There is no field for a truncated height and no second chance further down the chain, because the duty route takes only an area and the load route takes only a duty. Whatever level goes in is the level the whole fire case is built on.

So the sequence is: establish where grade is, work out what liquid height sits below the reachable limit, type that height, then read the area.

## The horizontal clamp, which is a convenience and a hazard

On a horizontal vessel the level is clamped at the diameter. Type a level above the diameter and the route returns the same figure it returns at the diameter, because the shell cannot be more than fully wetted.

| the teaching vessel, horizontal | level ft | wetted ft2 |
| --- | --- | --- |
| at the diameter | 12.000000 | 1696.4600 |
| the whole lateral surface | 12.000000 | 1696.4600 |

That clamp is convenient. It is also a hazard, because a nonsense level produces a perfectly reasonable answer and nothing in the return says the input was clipped. A level of one diameter and a level of ten diameters give the same area, so a units slip that inflated the level by a factor of anything at all is invisible in the answer.

## The vertical branch does the opposite

A vertical vessel is wetted up its height, so a level above the diameter is entirely ordinary. The published set carries one: a vessel 10.000000 ft across and 40.000000 ft long wetted to 12.000000 ft returns 376.9911 ft2.

That is the row to remember when reading somebody else's case, because the same level figure means different things in the two branches. On a horizontal vessel a level above the diameter is a signal that something is wrong. On a vertical one it is normal.

## The empty vessel

| orientation | diameter ft | length ft | level ft | engine ft2 | relative difference |
| --- | --- | --- | --- | --- | --- |
| vertical | 8.000000 | 30.000000 | 0.000000 | 0.0000 | n/a, the empty vessel |

A level of zero returns an area of zero and the published set includes it on purpose. The relative difference is marked as unavailable rather than as zero, because a relative difference against a published zero has nothing to divide by. That is a small piece of honesty worth copying: a tolerance that cannot be computed is reported as absent instead of as a pass.

An area of zero then carries forward as a refusal. The duty route needs a positive wetted area, so an empty vessel does not produce a fire case at all, and the chain stops with an error rather than with a duty of zero.

## Exercise

State why a level has to be trimmed before the call rather than after. Then give the horizontal clamp with the level and area it produces on the teaching vessel, give the published vertical row wetted above its own diameter, and say why the empty row's relative difference is reported as unavailable.
