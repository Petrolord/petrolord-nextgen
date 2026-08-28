# The SPE1 reference

Every simulator is checked against published problems. SPE1 is the first of them and it is worth knowing because it is the shared reference point of the whole industry.

## What it is

The first SPE comparative solution project, published by Odeh in 1981. Nine organisations ran the same problem on their own simulators and the results were published together.

The problem is deliberately small and deliberately awkward: a three-dimensional black-oil case with gas injection into an undersaturated oil, sized so that the differences between simulators would show.

## The model

A ten by ten by three grid of 1000 ft cells, so a hundred thousand feet of reservoir across, with the top at 8325 ft. Three layers of 20, 30 and 50 ft with permeabilities of 500, 50 and 200 md, so the middle layer is a barrier and the bottom layer is the good rock.

One producer in the corner at (10, 10) completed in the bottom layer, on oil rate control at 20000 stb/d with a bottom-hole pressure floor. One gas injector at the opposite corner (1, 1) completed in the TOP layer, injecting 100000 Mscf/d.

Equilibration at 8400 ft and 4800 psia with a gas-oil contact at 8300 ft and a water-oil contact at 8450 ft. Ten years of monthly steps.

## Why it is hard

Gas is injected at the top and oil is produced from the bottom, with a low-permeability layer between them. The gas has to override, break through the barrier and reach the producer, and exactly when it does is sensitive to how the simulator handles the transition.

So the interesting result is the gas-oil ratio at the producer over time, and that is what the published comparison shows: nine curves with the same shape and visibly different breakthrough behaviour.

## What it is used for

Two things.

**Verification.** A new simulator, or a new version, runs SPE1 and its results are compared against the published envelope. Landing outside it is a bug.

**Calibration of expectations.** Reading the nine published curves tells you how much simulators legitimately disagree on a problem this well specified. That number is larger than most people expect, and it is a useful antidote to treating any single run as the answer.

## Its relationship to this course

The engine set's reference specification is the SPE1 problem expressed in the same form as the Ekene deck. It is the literature anchor for the deck-emission code: if the emitter can express SPE1 and a simulator accepts it, the emitter is producing decks a simulator understands.

That is a check on the FORMAT, not on any physics, which is the right scope for a deck-emission engine.

## What it does not tell you about Ekene

Nothing. It is a different reservoir with different fluids, different rock and a different process. Its value is that it is public, small and universally recognised, so it is the common ground when two people need to check they are talking about the same behaviour.

## The misconception to avoid

"A simulator that matches SPE1 is validated." It is verified against one published problem of one process type. SPE1 has no water injection, no aquifer, no faults and no history matching, so agreement on it says nothing about any of those. The comparative solution series has ten problems for exactly this reason.

## Exercise

First, describe the SPE1 geometry in one sentence and say why the middle layer makes the problem interesting.

Second, explain the difference between verifying a simulator against SPE1 and validating a model of Ekene, in two sentences.
