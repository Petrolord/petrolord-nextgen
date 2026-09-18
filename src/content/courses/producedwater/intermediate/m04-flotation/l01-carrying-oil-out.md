# Carrying oil out rather than settling it

The two devices before this one both waited for a droplet to move on its own, under gravity in a basin and under a centrifugal field in a liner. A flotation cell does something different. It sends something to fetch the oil.

{{panel:pw-device-explorer}}

## What the cell does

Gas is fed into the cell. The bubbles rise through the water, oil droplets collide with them on the way up and stick, and the froth that collects at the surface is skimmed off. The oil leaves the cell attached to gas rather than by rising through the water under its own buoyancy.

That makes the cut size a RATE question rather than a settling question. There is no distance a droplet has to cross. What matters is how likely a droplet is to meet a bubble, how likely it is to stick when it does, and how long it has to get lucky. The cut is the droplet the cell removes half of in the time the water is in it.

## The chain, and every link is a return value

The model is a chain, and the module returns every link of it rather than only the answer at the end:

| link | KOKORI cell |
| --- | --- |
| gas fed per cell | 0.034502451156 m3/s |
| plan area | 4.285714 m2 |
| superficial gas velocity | 0.008050571936 m/s |
| bubble rise velocity | 0.055485861717 m/s |
| swarm holdup | 0.145092311579 |
| residence | 434.751720 s |
| cut size | 23.734355 micron |

Every one of those is a reported field. A reader who wants to know why a cut came out where it did can walk the chain and find the step that moved.

## The time this device has

Compare the residence on that list with the hydrocyclone's. A liner had 0.975987 s. This cell has 434.751720 s. The two devices are answering the same question with completely different budgets, and that is why one of them needs a field of over a thousand g and the other can work with rising bubbles.

The module carries a declared threshold for that residence, `flotationResidenceWarnS` at 60, and warns below it, because a cell that empties too quickly has not given the kinetics time to happen. The warning quotes the figure it judged against, so a reader can disagree with the threshold rather than only with the verdict.

## What the rest of this module does

The next four lessons take the chain apart in order: the gas and the area it rises through, the bubble and how fast it rises, the holdup that says when a swarm stops being a swarm, and the interception that turns all of it into a cut size.

## Exercise

State in one sentence why a flotation cut size cannot be found by asking how far a droplet has to travel.

Then read the chain table and name the two links a designer actually chooses, as opposed to the ones the model computes from them.
