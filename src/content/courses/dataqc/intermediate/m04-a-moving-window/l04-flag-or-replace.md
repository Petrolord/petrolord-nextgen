# Flag or replace

{{panel:dq-outliers-explorer}}

The Hampel window returns two things. It returns flags, each with its rule and reason, and it returns a `cleaned` series in which every flagged sample is replaced by its window median. The engine does not fill, repair or delete a value on its own. Using the cleaned series is the caller's decision, and this lesson is about making it deliberately.

How the flag count on EKENE-7's gamma ray, sentinel converted, responds to the two knobs:

| halfWindow, stated | nSigma, stated | window samples | flags | both spikes flagged |
| --- | --- | --- | --- | --- |
| 3 | 3 | 7 | 11 | true |
| 3 | 4 | 7 | 8 | true |
| 3 | 5 | 7 | 6 | true |
| 5 | 3 | 11 | 11 | true |
| 5 | 5 | 11 | 3 | true |
| 10 | 3 | 21 | 4 | true |

## Reading the table

Both planted spikes, entries 70 and 170, are flagged at every setting in the table. What changes is how many other samples come with them. Raising nSigma at a seven-sample window takes the count from 11 to 8 to 6. Widening the window to eleven samples at nSigma 3 leaves the count at 11, and at nSigma 5 it falls to 3. A twenty-one sample window at nSigma 3 flags 4.

There is no setting in the table that flags the two planted spikes alone. Every setting also flags samples that were never planted, and each of those is a flag from the stated rule. The settings decide how strict the question is. They cannot decide which samples are real.

## What replacing does

Replacing a flagged sample with its window median is a despiking step, and in a petrophysics workflow it is often exactly what is wanted before the log feeds a calculation. It also erases information. If a flag marks a real thin bed, or the edge of one, replacing it with the median of its neighbours removes the geology along with the noise.

That is why the engine returns the cleaned series beside the flags and stops there. The decision to use it belongs with someone who can say why each flagged sample is noise.

## A working order

A defensible way to use the window:

* run the flags and read each one against the log, the lithology and the tool;
* decide for each flagged sample whether it is noise, and say why;
* use the replacement only for the samples you decided on, and keep the original log beside the cleaned one;
* record halfWindow, nSigma and the MAD scale, 1.4826, with the result.

The last step matters because the flag count depends so strongly on the settings. A report that says a log was despiked, without the settings, cannot be reproduced.

## Settings are choices

The MAD scale 1.4826 and nSigma 3 are the petrophysics engine's values, and the engine uses them unless told otherwise. halfWindow sets the window, and this course uses 3 throughout, a seven-sample window. None of these is a law. A wider window asks about a longer stretch of log and a larger nSigma asks for a more extreme sample, and both are stated choices.

## Exercise

Open the explorer's Hampel view with the EKENE-7 gamma ray, sentinel converted. Run it at halfWindow 3 with nSigma 3, 4 and 5 and confirm the counts of 11, 8 and 6. Then run halfWindow 5 at nSigma 5 and confirm 3 flags. For that last run, list the flagged entries and say which of them are the planted spikes, and write one sentence on whether you would use the cleaned series at that setting.
