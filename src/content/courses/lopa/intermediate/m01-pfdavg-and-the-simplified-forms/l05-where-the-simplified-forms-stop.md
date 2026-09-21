# Where the simplified forms stop

{{panel:lp-sif-builder}}

The simplified forms of the last lesson are easy to hold in the head and easy to defend in a review. They are also a special case. The engine implements the full IEC 61508-6 Annex B low demand equations and nothing else, and the simplified forms fall out of them in one particular corner. Knowing which corner tells you exactly when the short forms stop being safe to use.

## The corner where they agree

Set the dangerous detected failure rate to zero and the mean repair time after a proof test to zero, and the full form collapses onto the simplified form. The engine's own basis string says so, word for word.

> IEC 61508-6:2010 Annex B.3.2.2 reliability block diagram simplified equations, low demand; reduces to the ISA-TR84.00.02 simplified forms when lambdaDD = 0 and MRT = 0

## The identity, measured

The EKULAMA channel run through the full form with lambdaDD and the mean repair time both zero, set against the simplified forms of the previous lesson.

| architecture | full form at lambdaDD and MRT zero | simplified form | comparison |
| --- | --- | --- | --- |
| 1oo1 | 0.005256000000 | 0.005256000000 | identical |
| 1oo2 | 0.000296042728 | 0.000296042728 | identical |
| 2oo2 | 0.010512000000 | 0.010512000000 | identical |
| 2oo3 | 0.000362528185 | 0.000362528185 | identical |
| 1oo3 | 0.000263048981 | 0.000263048981 | identical |

Five architectures, five identical pairs. The engine gates that identity as part of its own evidence, which is why the simplified forms can be taught here as a special case with confidence.

## What the plant adds

Where the simplified forms stop is where the plant stops being simple. Three things take a real subsystem out of the corner. Diagnostics that reveal failures while the plant runs give a dangerous detected rate above zero. A repair that takes time after a proof test reveals a hidden failure gives a mean repair time above zero. And a proof test that finds only part of what is hidden gives a coverage below one. Any one of the three, and the simplified form is answering a different question from the one you asked.

## Why the engine chose the full form

The engine could have implemented the short forms and added corrections. It implements the full form and lets the short forms emerge, because the bookkeeping the simplified forms drop is exactly the bookkeeping that matters once diagnostics exist. The equivalent down times, which the next module is about, are that bookkeeping. They are carried in every call, and when they collapse to the simple case they do so on their own.

## Reading a basis block

Every call returns a basis block alongside the number, and the block names the equations used, the channel and group equivalent down times, the proof test coverage treatment and any warning. A verification note that quotes the basis block is auditable by someone who was not in the room, because the reader can see which corner of the equations the number came from. A bare PFDavg with no basis behind it is an assertion.

## Exercise

Take the 1oo2 figure of 0.000296042728 from the simplified corner. The same channel with detected failures added, which the next module computes, returns 0.000298987176. Compute the ratio of the second to the first to six decimals and say whether the simplified form here reads high or low against the full one.
