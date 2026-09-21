# Immediate and delayed ignition

{{panel:qr-event-tree}}

A continuous release of flammable gas can end in four ways. It can ignite at once, as a jet or pool fire. It can drift, form a vapour cloud and ignite later, and that cloud then burns as a flash fire or explodes. Or it can disperse without ever finding an ignition source. The engine's `flammableReleaseEventTree` builds this tree for you from four inputs, so every flammable release in the course has the same shape.

## EREMOR's gas release

EREMOR's gas release is stated at 5e-4 per year, with an immediate ignition probability of 0.1 and a delayed ignition probability of 0.3 GIVEN no immediate ignition, using the preset split.

| frequency per year | outcome | path |
| --- | --- | --- |
| 0.000050000000 | jet or pool fire | immediate ignition |
| 0.000081000000 | flash fire | no immediate ignition, delayed ignition, flash fire |
| 0.000054000000 | explosion | no immediate ignition, delayed ignition, explosion |
| 0.000315000000 | no ignition | no immediate ignition, no ignition |

## The shape of the tree

The first branch set asks one question: does the release ignite immediately? The answer yes carries the immediate ignition probability and ends in a jet or pool fire. The answer no carries one minus that probability and leads on to a second branch set.

The second set asks: given that nothing ignited at once, does the cloud ignite later? The answer no ends in no ignition. The answer yes leads to the third set, the split, which divides a delayed ignition between flash fire and explosion.

Every set sums to one, so the four outcome frequencies sum back to the release frequency of 5e-4 per year. Each path in the table is read from left to right as a list of answers. The no ignition outcome is the largest of the four, at 0.000315000000 per year, and it carries no fire at all, so it adds nothing to any individual risk later.

## The four inputs

| input | EREMOR, stated |
| --- | --- |
| `initiatingFrequencyPerYr` | 5e-4 |
| `immediateIgnitionProbability` | 0.1 |
| `delayedIgnitionProbability` | 0.3 |
| `vapourCloudSplit` | the preset, flash fire 0.6 and explosion 0.4 |

The first is a frequency and the rest are probabilities. Notice what is absent: nothing about the gas, the hole size or the weather. Those decide how far a cloud travels, which is consequence modelling in the consequence course. This tree only divides a stated frequency among outcomes using stated probabilities.

## Why the tree is built for you

An analyst could draw this tree by hand with `eventTree`. The dedicated function fixes the shape of a tree that is drawn again and again, so a branch can never be hung under the wrong parent by a slip of the hand. The delayed ignition branch always hangs under no immediate ignition, and the split always hangs under delayed ignition. The next lessons look at each of those choices in turn, and at what happens to the explosion frequency when either one is moved.

## Exercise

Add the four outcome frequencies in the first table and confirm that they return the stated release frequency of 5e-4 per year. Then multiply 5e-4 by the stated immediate ignition probability and check that you reach the jet or pool fire frequency of 0.000050000000 per year. Say which branch set of the tree each of your two calculations tested.
