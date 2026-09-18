# Holdup, and when a swarm stops being one

Gas holdup is the fraction of the cell that is gas rather than water. It is the quantity that decides whether the model in front of you is still describing the thing you built.

{{panel:pw-device-explorer}}

## What holdup is here

The module computes it as the superficial gas velocity divided by the bubble rise velocity. On the KOKORI cell that is 0.145092311579.

The reasoning behind that ratio is simple bookkeeping. Gas is arriving at the bottom at a certain flux and leaving the top at the bubble rise velocity, so the amount of gas sitting in the cell at any moment is the ratio of the two.

## The declared limit, and what is on the other side of it

The module declares `gasHoldupWarn` at 0.2 and warns past it. The reason is stated in physical terms rather than as a range: past that holdup, coalescing churn means the cell is no longer a swarm of independent bubbles.

That phrase carries the whole point. Every number in this device's chain assumes bubbles that rise on their own, sweep their own volume of water and carry their own interception efficiency. Pack enough gas in and the bubbles start meeting each other instead of the water. They merge, they rise faster, they sweep differently, and the arithmetic downstream is describing a cell nobody has.

## The gas rate sweep

| gas to water ratio | superficial gas m/s | holdup | cut micron | warning |
| --- | --- | --- | --- | --- |
| 0.02 | 0.000644045755 | 0.011607384926 | 83.913617 | none |
| 0.05 | 0.001610114387 | 0.029018462316 | 53.071631 | none |
| 0.12 | 0.003864274530 | 0.069644309558 | 34.257591 | none |
| 0.25 | 0.008050571936 | 0.145092311579 | 23.734355 | none |
| 0.6 | 0.019321372648 | 0.348221547789 | 15.320460 | a gas holdup past the swarm limit |
| 1.5 | 0.048303431619 | 0.870553869473 | 9.689510 | a gas holdup past the swarm limit |

Read the last two rows carefully. The cut size keeps falling, and the module keeps reporting it, because a warning withholds nothing. What the warning says is that the model behind those two figures is outside the conditions it was built for, so the reader should treat 9.689510 micron as an extrapolation.

A warning of this kind is doing something a range check cannot. It reports the answer, names the quantity, names the threshold, and leaves the judgement with the reader who knows what cell was actually built.

## The refusals at the edges

Past a certain point the module declines entirely, and each refusal names what it was given:

- a gas to water ratio of 4: REFUSED: a gas-to-water volume ratio of 4 is past anything this module will describe as a flotation cell; it holds the ratio to 3
- a 5 micron bubble: REFUSED: the bubble diameter must lie between 20 and 2000 micron for this attachment model and this is 5
- an attachment efficiency of 0: REFUSED: the attachment efficiency is the probability that a collision sticks, so it lies between 0 and 1, and this is 0

## Exercise

Find the first row of the sweep whose holdup is past the declared limit, and say what the module still reported on that row.

Then state the difference between what the module does at a gas ratio of 1.5 and what it does at a gas ratio of 4, and say which of those two answers a reader may still use.
