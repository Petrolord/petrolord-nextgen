# A tree of branches

{{panel:qr-event-tree}}

An event tree starts from one initiating event and asks, one question at a time, what happens next. Each question is a branch set: a list of answers, each with a probability. A path runs from the root to a leaf, and each leaf is one way the story can end. The engine's model string says the whole method in one line, verbatim: "event tree: leaf frequency = f0 x product of the branch probabilities on its path; each branch set sums to 1".

## EREMOR's tank overfill

EREMOR's tank overfill starts from an overfill at 2e-3 per year, as stated. Three questions follow, each one a branch set the engine checks on its own. Is the high level alarm answered or missed? If missed, does the bund contain the spill or is it overtopped? And wherever the liquid ends up, does it ignite?

| path | outcome | path probability | leaf frequency per year |
| --- | --- | --- | --- |
| high level alarm answered | no release | 0.950000000000 | 0.001900000000 |
| alarm missed then bund contains then ignited in the bund | pool fire | 0.003500000000 | 0.000007000000 |
| alarm missed then bund contains then not ignited in the bund | no fire | 0.031500000000 | 0.000063000000 |
| alarm missed then bund overtopped then ignited outside the bund | pool fire | 0.003750000000 | 0.000007500000 |
| alarm missed then bund overtopped then not ignited outside the bund | no fire | 0.011250000000 | 0.000022500000 |

## Reading the tree

The tree has five leaves. The answered alarm ends the story at once, so that path has one branch on it and a path probability of 0.950000000000. Every other path passes through three branch sets, and its path probability is the product of three branch probabilities.

The leaf frequency is the initiating frequency times the path probability. That is the only arithmetic an event tree does. There is no weighting, no adjustment and no default hidden anywhere in the tree; every number on it was typed by the analyst, and the engine only multiplies along each path. The first pool fire leaf is 2e-3 per year times 0.003500000000, which gives 0.000007000000 per year.

Notice that a branch can lead on to a further branch set, and that each branch set is its own small question. The engine calls a lower branch set `next`, so a tree is a branch set whose branches may each carry a `next` of their own, as deep as the story needs.

## Naming leaves and outcomes

Each leaf may carry an `outcome`, the name of what happened there. Two leaves can share an outcome: this tree has two pool fire leaves and two no fire leaves. A leaf with no `outcome` of its own takes its branch name. The engine returns every leaf with its path, its probability and its frequency, and then a total per outcome.

Naming matters because it is how leaves are grouped later. A misspelled outcome would leave one pool fire in a group of its own, and the total for pool fire would come out short with no refusal to warn you.

## Exercise

The overfill happens at 2e-3 per year. Multiply it by the path probability of the overtopped bund that ignites outside, 0.003750000000, and write the leaf frequency to twelve decimals. Check your answer against the table. Then do the same for the answered alarm path and confirm you reach 0.001900000000 per year.
