# The swept volume

A pig does not clean a line so much as collect it. Whatever liquid is lying in the bore is gathered in front of the pig and arrives at the far end together, and the swept volume is the size of that arrival.

{{panel:fc-wall-pig-explorer}}

## Three published runs

| bore in | length ft | holdup | line volume bbl | swept bbl |
| --- | --- | --- | --- | --- |
| 6.065000 | 30000.000000 | 0.120000 | 1071.9949 | 128.6394 |
| 10.020000 | 52800.000000 | 0.050000 | 5149.6679 | 257.4834 |
| 2.067000 | 8000.000000 | 0.350000 | 33.2033 | 11.6211 |

The third line holds the highest holdup by a wide margin and delivers the smallest slug, because it is a small pipe. The second holds the lowest holdup and delivers the largest, because it is a big one. Slug size is set by the line volume first and by the holdup second.

## Why it matters that it arrives together

The liquid in a wet line is distributed along the whole bore, and the facility at the end sees it as a trickle. The pig converts that distribution into a single delivery. Nothing is created and the rate of arrival changes completely, which is why a pig run is a facilities event rather than a cleaning task.

## The guards around it

The sweep has its own two refusals, and they guard different things.

A call with no bore or no length returns "a swept volume needs a positive bore and length", which is the geometry refusing to produce a volume out of nothing. A negative sweep passed on to an interval returns "a swept volume cannot be negative", which is the next stage refusing to accept an impossible input from upstream.

Both boundaries are inclusive where they should be. A swept volume of exactly 0.000000 bbl is accepted, because a dry line really does deliver nothing, and it is -0.000001 that is refused.

## The number this hands to the next course

The swept volume is where this engine stops and the separation work starts. The slug a catcher has to hold is what this chain computes, and the vessel that holds it is sized elsewhere. The two halves meet at exactly one number, which is why that number carries its holdup with it.

## The mistake

The mistake is treating the swept volume as the liquid the line produces. It is the liquid the line was storing, so it arrives once and then the line has to fill again. A facility that plans for 128.6394 bbl every hour has misread a quantity that is only available once per run.

The second mistake is sizing on the largest published sweep in a set. These three runs are three different lines, so 257.4834 bbl says nothing about the pipe that returned 11.6211 bbl.

## Exercise

Give the swept volume for each of the three published runs with the holdup and line volume behind it, and say which of the two inputs dominates the result. Then give the two refusal messages the sweep produces, with the value on each side of the negative-sweep guard, and name the number this chain hands to the separation work.
