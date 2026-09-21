# MRT equal to the MTTR, inferred

{{panel:lp-sif-builder}}

The Annex B forms take two restoration times. MTTR is how long a DETECTED failure stays down once the diagnostics have found it. MRT is how long an undetected failure stays down after a PROOF TEST has revealed it. They are different quantities with different causes, and the engine keeps them apart: MRT is added to every undetected down time and MTTR is charged only against the detected share. The published paper prints one restoration time. Something had to be assumed about the other, and this lesson is about which assumption reproduces the printed table.

## The valve row, computed both ways

The valve subsystem is the one where it shows, because its restoration time is long.

| MRT hours | engine PFDavg | at three significant figures | printed |
| --- | --- | --- | --- |
| 120 | 0.001048767640 | 1.05E-03 | 1.05E-03 |
| 0 | 0.001017167254 | 1.02E-03 | 1.05E-03 |

With the restoration time after a proof test taken equal to the detected restoration time of 120 hours, the row reproduces the printed 1.05E-03. With it set to zero the engine returns 0.001017167254, which rounds to 1.02E-03 and misses the printed value at the third figure. The published table reproduces only with MRT equal to the MTTR on every row.

## This is a fact about the published source

The paper prints one restoration time and uses it in a form that takes two. That is a property of the SOURCE, recorded when the golden was built and shown here by computing the row both ways. The engine itself takes both times as separate inputs and refuses a call that has detected failures and no MTTR. The engine's validation record holds this inference; this lesson re-measures it by running the row.

## What it means for a graded answer

Every capstone in this course STATES both restoration times, so this inference never enters a graded answer. A learner is never asked to guess what a paper left out. The inference matters for a different reason: it is the model of how a reproduction should be reported. Say which input was inferred, say what the alternative value would have produced, and let the reader see how much of the agreement rests on the inference.

## The rule it teaches for your own notes

A verification note that reproduces somebody else's figures has the same duty. Name every input that the source did not print. Show the calculation with the alternative, so a reader can judge whether the reproduction is strong or lucky. Here the alternative differs by about three percent on one row, which is enough to change the printed third figure and not enough to change the band. Both of those facts belong in the note.

## Exercise

Take the two valve figures, 0.001048767640 with the restoration time after a proof test at 120 hours and 0.001017167254 with it at zero. Work out the difference as a percentage of the larger one. Then add each of them in turn to the other four subsystem figures of the published safety instrumented function and say whether the choice would have changed the printed total of 1.29E-03.
