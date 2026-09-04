# The water cut gate

Below 30 percent water the shutoff is refused whatever the diagnosis says, and the refusal is issued before the mechanism is read.

{{panel:pd-channel-explorer}}

## The sweep

A derived sweep on the water cut, holding the diagnosis fixed and changing nothing else about the well row:

| Water cut, percent | Water shutoff | Reasons | Fracture reasons | Artificial lift |
| --- | --- | --- | --- | --- |
| 10.0 | no | 1 | 2 | no |
| 25.0 | no | 1 | 2 | no |
| 29.0 | no | 1 | 2 | no |
| 30.0 | candidate | 3 | 2 | no |
| 45.0 | candidate | 3 | 2 | no |
| 60.0 | candidate | 3 | 2 | no |
| 61.0 | candidate | 3 | 3 | no |
| 74.5 | candidate | 3 | 3 | consider |
| 90.0 | candidate | 3 | 3 | consider |

Nine contiguous rows and three thresholds in them. The shutoff opens at 30.0 percent. The fracture picks up a third reason between 60.0 and 61.0, the out of zone growth warning. Artificial lift moves to consider above 70 percent, which is why the row at 74.5 percent reads consider and the row at 60.0 percent reads no.

## The gate fires before the mechanism

Nothing in the first three rows is a statement about water movement. A channelling reading taken at the default late window, which on this teaching well starts at t = 250.242976 days and gives a derivative slope of 1.442132492 over 15 positive samples and 0.900620470 log cycles, buys nothing at 29.0 percent water. The water cut test sits ahead of the mechanism.

That is defensible: a well making a quarter water has no water problem worth a rig, whatever the plumbing is doing. It is worth knowing it is a policy and not a measurement.

## One point of water cut

The step from 29.0 to 30.0 percent turns a "no" with 1 reason into a candidate with 3, and the two extra reasons are the plumbing argument and the confidence caveat. Nothing about the well changed except a number that is itself the ratio of two allocated rates and is rarely known to a point.

## What the gate does not refuse

It never blocks. Every row reads blocked = false, the three refusals included. A "no" here means the screening does not apply this treatment to this well, and it carries no block reason, because no diagnosis was consulted to produce it.

## The mistake

Reading "no" at 29.0 percent as a clean well, and a candidate at 30.0 percent as evidence of a water path. The verdict moved because a policy threshold was crossed, and the reading that says whether there is a path to seal was consulted on neither row.

## Exercise

Walk the water cut in the panel from 10.0 percent to 90.0 percent and record where each of the three columns changes.

Then say which of those three changes came from the diagnosis.
