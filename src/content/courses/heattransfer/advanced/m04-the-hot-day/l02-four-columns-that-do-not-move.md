# Four columns that do not move

Take one bay across a range of ambients and put the answer in a table. Four of its columns hold exactly still and two of them move. That contrast is the whole mechanism, and it is easier to see in a table than to accept in a sentence.

{{panel:fc-rating-explorer}}

## The studio bay, across its design point and past it

| check ambient, degF | duty fraction | process out, degF | effectiveness | NTU | capacity ratio | UA, Btu an hour per degF |
| --- | --- | --- | --- | --- | --- | --- |
| 86.000000 | 1.058065 | 144.193548 | 0.645161 | 1.172829 | 0.300000 | 234565.8720 |
| 92.000000 | 1.019355 | 148.064516 | 0.645161 | 1.172829 | 0.300000 | 234565.8720 |
| 98.000000 | 0.980645 | 151.935484 | 0.645161 | 1.172829 | 0.300000 | 234565.8720 |
| 104.000000 | 0.941935 | 155.806452 | 0.645161 | 1.172829 | 0.300000 | 234565.8720 |
| 112.000000 | 0.890323 | 160.967742 | 0.645161 | 1.172829 | 0.300000 | 234565.8720 |
| 124.000000 | 0.812903 | 168.709677 | 0.645161 | 1.172829 | 0.300000 | 234565.8720 |

The last four columns repeat one figure six times each. That is the machine. The first two columns move down the table, and that is the weather.

Read the regime the engine labels each row with as well. The first two ambients sit below the design ambient of 95.000000 degF and come back labelled colder than design. The rest come back labelled hotter than design, and the design outlet of 150.000000 degF is reported as reached on the first two rows and not on the others. The labels are there so that a duty fraction above one is never mistaken for a duty.

## The same shape on a second machine

ANTAN is a different bay with a different duty, a different design ambient and a different air rise, and the same four columns hold still across the same six ambients. Its fixed set is an effectiveness of 0.562044, an NTU of 0.928810, a capacity ratio of 0.337662 and a UA of 186968.1844 Btu an hour per degF, while its duty fraction falls from 1.087591 at 86.000000 degF to 0.810219 at 124.000000 degF.

Two machines, two fixed sets, the same structure. A pattern that holds on one case is an anecdote. A pattern that holds on two unrelated cases, with no input in common between them, is worth calling a mechanism.

## What a flat column means to a reviewer

A column that does not move is the cheapest audit in this module. If a sheet shows an effectiveness or a UA that drifts with the ambient while claiming a fixed surface and a fixed air mass, something has been recomputed that should have been carried, and the answer is wrong before any duty is read.

The check costs nothing and needs no second calculation. It is available to a reviewer who has only the sheet in front of them, which is the usual case, and it catches a whole family of errors in which a rating quietly re-sizes the bay it was asked to rate.

Do not divide a flat column by anything. It stands still, which is the finding. No ratio is computed between these columns and the two moving ones, and a figure formed by dividing them is a figure nothing here stands behind.

## Where the two moving columns come from

The duty fraction and the process outlet are the subject of the next lesson. Read them here only as evidence that they are the outputs of this rating rather than inputs to it: they are what a fixed effectiveness and a changing inlet temperature difference produce between them.

## Exercise

Copy the table above and mark each of its columns as either machine or weather. Record ANTAN's four fixed figures and its two duty fractions. Then write the one sentence a reviewer should apply to any hot-day sheet that shows a UA moving with the ambient, and say what it implies about the calculation behind it.
