# The rejected string

Run the same candidate list at the same station under the other correlation and the winner moves down two sizes. Nothing about the well changed.

{{panel:pd-remedy-explorer}}

## The same nine candidates, under Turner

The teaching well EBOCHA-5 is not a published case. Same station, 7500.0 ft at 1500.0 psia, 653.67 degR and z 0.9142643742, same rate of 3100.0 Mscf/d.

| Candidate, in | Critical rate, Mscf/d | Ratio | Unloads |
| --- | --- | --- | --- |
| 3.958 | 4812.534009744 | 0.6441512920 | false |
| 3.826 | 4496.888954411 | 0.6893654772 | false |
| 3.740 | 4297.000817496 | 0.7214334210 | false |
| 3.548 | 3867.136076159 | 0.8016268212 | false |
| 3.476 | 3711.776069480 | 0.8351796935 | false |
| 3.068 | 2891.564887670 | 1.0720838440 | true |
| 2.441 | 1830.449664562 | 1.6935729291 | true |
| 2.041 | 1279.700210360 | 2.4224423618 | true |
| 1.610 | 796.294991209 | 3.8930296363 | true |

`largestUnloaded` is 3.068 in at a ratio of 1.0720838440. Under Coleman the same list picks 3.476 in. The critical velocity moved from 6.1224977520 ft/s to 7.3469973023 ft/s and the actual velocities did not move at all, because the rate and the areas are unchanged.

## The candidate in the middle

3.476 in reads 1.0022156322 under Coleman and 0.8351796935 under Turner. It is the pick under one name and a rejection under the other. The ratio it loses in the crossing is 0.1670359387, which is 16.666667 percent of it, and that is the twenty percent adjustment appearing as a fall rather than a rise because it lands in the denominator.

The Turner pick behaves the same way in reverse: 3.068 in reads 1.2865006128 under Coleman, comfortably clear, and 1.0720838440 under Turner. Coleman rejects 3.958, 3.826, 3.740 and 3.548. Turner rejects those four and 3.476 as well.

## Why 3.476 in is the one to look at

It is the only candidate whose verdict changes. Every other row keeps its answer under both names, clearing one comfortably or missing by a wide margin. One candidate sitting on the boundary is the normal case rather than a contrivance: the list is a shelf of standard sizes, and one of them usually lands near the threshold.

## The mistake

Describing 3.476 in as marginal and moving on. Marginal describes a ratio. This describes an assumption: the string is adequate if the wellhead pressure selected Coleman and inadequate if it selected Turner, and those two facts about the same steel are separated by a comparison against 1000.0 psia made somewhere else.

## What it refuses

The rows carry the correlation and the adjustment, so the name is recoverable from the return value. Nothing carries the pressure that chose the name. The function was handed a correlation and it will not ask where the choice came from.

## Exercise

Run the list under both correlations and record the two picks, then find the one candidate whose verdict changes.

Then say what a report must print beside a recommended tubing size for a reader to see the recommendation was contingent.
