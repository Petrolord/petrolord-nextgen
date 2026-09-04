# Selecting a port

The design gas rate does not size a port continuously. It picks a row out of a catalogue, so everything downstream of it moves in steps.

{{panel:pd-valve-explorer}}

## The rule

`selectPort` walks the catalogue upward and takes the first port whose throughput at that valve's differential meets the target. On westTexasOil valve 1, against a 500.0 Mscf/d target, the candidates pass 1359.548519, 2124.294562, 3058.984169, 4163.617341, 5438.194078, 8497.178247 and 12235.936675 Mscf/d, all critical at a ratio of 0.305724876. The smallest port already clears the target, so 0.25 in is chosen and the rest are never in contention. The target could move a long way without changing the answer.

## What that does to a sweep

On midDecrementKnifeEdge, spaced on 26.75 psi per valve, the stage 5 verdict on valve 4 hangs on a fraction of a psi. Walk the design gas rate and watch it.

| Target, Mscf/d | Ports chosen | Stage 5 surface margin, psi | Multipointing stages |
| --- | --- | --- | --- |
| 400 | 0.25 on every charged valve | 0.124769727 | 2, 3, 4, 5 |
| 1000 | 0.25 on every charged valve | 0.124769727 | 2, 3, 4, 5 |
| 1400 | 0.25, but 0.3125 at valve 6 | 0.124769727 | 2, 3, 4, 5 |
| 1600 | 0.3125 throughout | 15.249903355 | 2, 3, 4, 5, 6 |
| 2400 | 0.375 on every charged valve | 33.744341944 | 2, 3, 4, 5, 6, 7 |

The margin is frozen at 0.124769727 psi from 400 through 1400 Mscf/d and then jumps. The gas rate reaches the verdict only through the port, the port through R, and R through the dome and the closing pressure. Between catalogue steps there is no dependence at all.

## The resolution has to match the mechanism

A coarse sweep steps over the flip and calls the design insensitive to gas rate. A fine one finds nothing between the steps and says the same with more points, which is worse, because it feels like evidence. Neither failure is about sampling a curve too sparsely: there is no curve. The sensitivity lives in a catalogue, so the sweep that finds it runs over the catalogue. One port at a time gives 0.124769727 psi at 0.25 in, 15.249903355 at 0.3125 in, 33.744341944 at 0.375 in, 55.613320820 at 0.4375 in and 80.863315289 psi at 0.5 in.

## The mistake

Reporting a gas rate sensitivity as a slope, in psi per Mscf/d. The derivative is zero almost everywhere and undefined where it is not, so any slope quoted for it is an artefact of the two points that happened to be sampled.

## What it refuses

The only guard is a portTooSmall warning when the largest port cannot meet the target, as when a catalogue holding only a 0.125 in port is asked for 900 Mscf/d and reports valve 1 passing 340 Mscf/d. Nothing warns that a design sits one catalogue step from a different verdict.

## Exercise

Walk the design gas rate on midDecrementKnifeEdge and record the port list and the multipointing stages at each target.

Then say why halving the step size on that axis would not have found the flip any sooner.
