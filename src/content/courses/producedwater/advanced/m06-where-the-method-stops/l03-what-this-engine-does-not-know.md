# What this engine does not know about produced water

The last thing an Expert reader needs is the boundary of the whole model. Not the band on one fit, and not the six held numbers, but the list of physical processes that are simply absent.

## What is not in here

No dissolved or soluble oil removal. No chemical demulsifier. No coalescer media. No re-entrainment. No reject stream or oil recovery balance. No fouling over time and no backwash cycle. And no discharge limit of its own.

Read that list slowly, because several of the items on it are the reason a real plant looks the way it does.

## Why the absences matter more than the approximations

An approximation is a number that is a bit wrong and that you can bound. An absence is a mechanism that is missing, and a missing mechanism produces answers that are confidently right about the wrong question.

Take fouling. This module computes a bed cut size from a clean bed. A real bed loads up, its capture changes, and eventually it breaks through and has to be backwashed. The module warns above the loading rate at which beds lose depth capture, which is as close as it comes, and it carries no time axis at all.

Take the reject stream. A hydrocyclone sends oil out of the overflow, and how much water leaves with it is a real design quantity that decides what the downstream oil handling has to accept. This module returns what the cyclone removes from the water and says nothing about where it goes.

Take chemical treatment. A demulsifier changes the droplet distribution itself, which is the one input every device in this module responds to, and there is no door in this engine through which that change can be described.

## The order identity, read again

The absences explain something the coupling module left open. Reordering the stages does not change the outlet in this model. A designer still puts the coarse device first, and the reasons are fouling, plugging, and how much oil each device can take in its reject. Every one of those reasons is on the list above.

So the invariance and the absence are the same fact seen twice. The model does not care about order BECAUSE it does not carry the mechanisms that make order matter.

## How to use a model with a boundary this sharp

Use it for what it is: a way of turning a stated water, a stated oil and stated equipment into a cut size, a removal and an outlet distribution, with every number traceable to the geometry and the fluid properties it came from.

Then write down, beside the answer, which of the absent mechanisms your design depends on. That list is the handover to whatever comes next, and it is a far more useful document than another decimal place.

## Exercise

Take the list of absences and mark each one as either something you can bound by hand, something you need a vendor for, or something that needs a different model entirely.

Then take one design you have worked on and say which absence would have bitten you hardest.
