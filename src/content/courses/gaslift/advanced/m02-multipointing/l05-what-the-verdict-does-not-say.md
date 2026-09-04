# What the verdict does not say

Multipointing true is a narrow claim about a static column, and almost everything a reader wants from it is not in there.

{{panel:pd-unloading-explorer}}

## It does not divide the gas

At stage 2 of midDecrementKnifeEdge valve 1 is still open and the reported gas rate is 1534.198233515 Mscf/d through valve 2. That is the rate the deeper valve would pass alone. Nothing in the module splits flow between two open valves, so the string is flagged as injecting at two depths and then modelled as if it were injecting at one.

## It does not know rate at all

The annulus column is static: no friction, no velocity, no injection rate. Every casing pressure in the sequence is a shut in gas column. The stage rate that sits beside the verdict is Thornhill and Craver, an orifice equation that does not know a real valve throttles on its stem before it is fully open, so 1534.198233515 Mscf/d is an upper bound on what the valve passes and not a prediction of it. A verdict computed on a shut in column is being asked about a well that is flowing.

## It does not carry a distance

The flag is a sign test with the number thrown away. Stage 5 of that design is true at 0.149791635 psi of margin and stage 6 is false at -6.422680805 psi on valve 5, and both arrive as a word. Nothing in the returned design says which verdicts are safe and which are arithmetic away from flipping.

## It can be confidently wrong

On a production operated string the closing test is run on the wrong fluid. The engine compares a constant surface pressure of 1114.7 psia with closing surface pressures inverted up a casing column, clears by 379.101060 to 724.986977 psi across six valves, and reports multipointing at stages 2, 3, 4, 5 and 6. The rule those valves should face, tubing at valve depth against the dome at valve temperature, misses by 31.822047 to 52.249541 psi on every valve, and the oracle finds every stage clean. Same string, same code, opposite answer on five stages out of six.

## The mistake

Acting on the word. A multipointing warning on an IPO string is worth reopening the design for, and the same warning on a PPO string is an artefact of a pinned divergence. A clean sequence on a PPO string means nothing either. The verdict has to be read together with the valve family before it is read at all.

## Exercise

Read the stage 2 verdict and the stage 2 gas rate for midDecrementKnifeEdge, and say what the engine assumes about valve 1 while it reports that rate.

Then read the same verdict on constantPressurePPO and write one sentence explaining why it should not be believed.
