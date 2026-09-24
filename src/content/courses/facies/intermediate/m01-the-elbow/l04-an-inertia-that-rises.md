# An inertia that rises with k

{{panel:ef-judge-explorer}}

Inertia falls as k grows when every k is fitted well. So when a larger k prints a higher inertia than a smaller one, something went wrong with a fit, and the engine says so in a warning. This lesson shows one, what it means, and the engine's advice.

## The rise, on the Ekene rows

With one start per k and seed 265 (stated), on the 180 cored rows with standard scaling, k 1 to 8, the elbow prints the k 8 inertia above the k 7 one:

| k | inertia, one start, seed 265 |
| --- | --- |
| 7 | 45.153181 |
| 8 | 45.270437 |

A larger k fitted worse. With eight centres available, the best arrangement can always do at least as well as the best arrangement with seven, because one centre could sit on top of another. So the k 8 run did not find the best arrangement: it stopped in a local minimum, a set of centres where no single Lloyd pass improves the labels and yet a better set exists.

## The engine's warning

The engine lists every such k in `inertiaRises` and adds a warning, verbatim:

> inertia rises at k = 8: those runs stopped in a local minimum; raise nInit

This is a warning, and the result comes back whole. The drop at k 8 is negative, and the warning tells you to trust neither that drop nor any reading that rests on it.

## The remedy: more starts

The advice in the message is to raise nInit, the number of k-means++ starts. With the default 10 starts, the same seed 265 shows no rise: the k 8 inertia is 41.697291.

The Associate tier saw the same at k 4. With one start, 8 of the 10 seeds shown stopped above the lowest inertia, 58.289042; with ten starts, 9 of the 10 reached it. More starts make a poor stop less likely and do not rule it out. In an elbow each k is a separate run, so each k can stop poorly on its own, and the curve then carries the noise of the starts.

## Why the warning is useful even when absent

An inertia rise is the one symptom of a poor fit the elbow can detect by itself, because it breaks a rule the true minimum must obey. A poor fit that stops at a lower inertia than the k before it breaks no rule and raises no warning. So the absence of a warning is weaker evidence than its presence: it says no fit broke the rule, and says nothing about fits that stopped slightly high.

A write-up of an elbow therefore states the number of starts at every k, and if any warning was raised, it states the warning and the run that removed it.

## Exercise

In the elbow view, run the Ekene cored rows with seed 265, largest k 8 and starts set to 1. Find the warning and the k it names, and read the drop at that k. Then clear the starts back to the default and run again. Compare the two inertia columns row by row, and note at which k the one-start run stopped highest above the ten-start run.
