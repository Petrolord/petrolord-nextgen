# Two ceilings

A parallel-flow exchanger and a 1-2 shell exchanger each have an effectiveness they cannot pass at any area whatsoever. Buy more surface and the answer creeps toward a number and stops there. This engine reports that number on every answer it gives, in a field of its own, so the limit is visible before a designer walks into it.

{{panel:fc-rating-explorer}}

## The two numbers, across the capacity ratio

| capacity ratio | parallel ceiling | 1-2 shell ceiling |
| --- | --- | --- |
| 0.000000 | 1.000000 | 1.000000 |
| 0.350000 | 0.740741 | 0.830054 |
| 0.650000 | 0.606061 | 0.703560 |
| 1.000000 | 0.500000 | 0.585786 |

Both fall as the capacity ratio rises, and the 1-2 shell ceiling sits above the parallel one on every row where the two differ. At a capacity ratio of 0.000000 both reach 1.000000, because with nothing limiting the cold side there is no arrangement penalty left to pay.

The reason is geometric rather than numerical. In parallel flow the two streams leave at the same end, so they can approach each other and then go no further, and the temperature they meet at is fixed by the two capacity rates alone. Area cannot move a meeting point. A 1-2 shell unit sits between the two arrangements, since one of its tube passes runs against the shell flow and the other runs with it, and its ceiling sits between the two accordingly.

## Watching a column arrive at one

The ceiling is not a bound the code applies afterwards. It is where the relation itself is heading. Parallel flow at a capacity ratio of 0.650000 returns 0.597755 at an NTU of 2.600000, then 0.605699 at 4.500000, then 0.606059 at 8.000000, against a ceiling of 0.606061.

Adding surface after that buys effectiveness in the sixth decimal place. A plant that needs more than the ceiling needs a different arrangement, and no purchase order fixes it. Those three figures are worth writing down together, because a column that flattens is much easier to recognise than a bound that is asserted.

## What the refusal hands back

Ask for an effectiveness above the ceiling and the engine refuses and puts the ceiling beside the message. Asked for 0.820000 at a capacity ratio of 0.650000 the two answers are these.

- REFUSED, a parallel unit: a parallel-flow exchanger cannot exceed an effectiveness of 0.606 at this capacity ratio, whatever its area
- REFUSED, a 1-2 shell unit: a 1-2 shell exchanger cannot exceed an effectiveness of 0.704 at this capacity ratio, whatever its area

The message rounds to three decimals for reading. The evidence field carries 0.606061 and 0.703560 at full precision, and a caller that shows only the message has thrown away the number a designer needs.

## The other refusal in this door

One more state stops a rating before it starts. A capacity ratio above one is the two capacity rates passed the wrong way round, since the ratio is the smaller over the larger by definition. Asked at 1.400000 the engine says so and names the definition rather than clamping the value and answering. Clamping would have produced a plausible effectiveness for a machine with its streams swapped, which is the kind of answer nobody checks.

## Exercise

Record the eight ceiling figures with their capacity ratios and say which arrangement stands higher at each. Record the three parallel effectivenesses at a capacity ratio of 0.650000 with their NTUs, beside the ceiling they approach. Then write what a caller loses by displaying the refusal message without the field beside it.
