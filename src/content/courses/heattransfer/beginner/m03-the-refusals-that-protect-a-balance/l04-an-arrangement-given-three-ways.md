# An arrangement given three ways

This module carries three arrangements and it will name them for you. They are counter, parallel and shell1. Anything else is refused. That sounds like housekeeping and it is not, because the arrangement decides which two temperature differences the driving force is built from, and getting it wrong changes an answer without changing anything that looks like an answer.

{{panel:fc-exchanger-explorer}}

## The same four temperatures

Take the studio case at its converged terminals, which are a hot stream from 300 F to 200.000000 degF and a cold stream from 100 F to 134.375000 degF. Those four numbers do not move in this lesson. Only the arrangement does.

Given counter, the log mean is 130.064846 degF. Given parallel, on the same four temperatures, it is 120.584840 degF. Parallel flow pairs the two ends the other way round, and the driving force it produces is the lower of the two. Nothing was mistyped to get from one figure to the other. One word was changed.

## A capital letter

Give the arrangement as `Parallel`, with a capital letter, and the answer is 120.584840 degF. The engine reports its basis as parallel. Case and the spaces around the word do not decide which method runs, so an arrangement arriving from a dropdown, a saved file or somebody's typing all reach the same place.

That is a small mercy and worth naming, because a string comparison is the kind of thing that is easy to write strictly and hard to notice when it fails. A method chosen by an exact match on a string will quietly pick its default the first time the string arrives capitalised.

## An arrangement it does not carry

Ask for `crossflow` and the answer is a refusal: unknown arrangement "crossflow", this module carries counter, parallel, shell1 and will not fall back to one of them.

Two things are being done there. The message lists what is available, so you do not have to go and read the source to find out. And it states its own policy, which is that it will not substitute. Both halves are useful. The list saves a trip. The policy tells you something about every other answer this module gives.

## Why a fallback would be worse

Suppose it fell back to counter instead of refusing. On the studio terminals you would have asked for cross flow, which this module does not do, and received 130.064846 degF. It would be in range, it would be plausible, and it would be the counter-current figure under another name.

Compare that with the parallel figure of 120.584840 degF on the same four temperatures and you can see the size of the gap a silent fallback would hide. A refusal costs you a minute. A fallback costs you a driving force, and the area that comes out of it is wrong by whatever that gap works out to on your own case.

## Exercise

Write the two log means for the studio terminals with the arrangement that produced each. Then list the three arrangements this module carries and, for each, say whether you have met it yet in this course. Finish with one sentence on what you would have to check if a module in some other package answered a cross-flow request with a number.
