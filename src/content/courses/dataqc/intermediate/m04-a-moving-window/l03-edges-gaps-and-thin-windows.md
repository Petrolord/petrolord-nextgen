# Edges, gaps and windows too thin to judge

{{panel:dq-outliers-explorer}}

A moving window is easy to describe in the middle of a clean series. Three places need a stated rule: the two ends, where the window runs out of samples; a gap, where some neighbours are missing; and a window so thin it cannot say anything. The engine states a rule for each.

| where, stated | what the window holds | judged |
| --- | --- | --- |
| EKENE-7 GR, entry 0, halfWindow 3 | 4 samples, truncated at the top of the log | true |
| EKENE-7 RHOB, entry 79, beside the twelve-sample gap | 4 present samples | true |
| EKENE-7 RHOB, entry 80, missing | nothing: the sample is missing | false |
| 2.3, null, null, 2.9, null, null, 2.31, halfWindow 1, entry 3 | 1 present sample | false |

## The ends of the series

The window is centred on each sample, and at the ends there is nothing on one side. The engine truncates the window instead of padding it. At entry 0 of the gamma ray, with halfWindow 3, the window holds entry 0 and the three samples below it, 4 in all. The sample is still judged, against neighbours on one side only.

## Missing values never enter a window

The EKENE-7 density has a gap of twelve missing samples, entries 80 to 91. Missing values never enter a window. At entry 79, beside the gap, the window reaches three entries either side, the three on the gap side are missing and dropped, and 4 present samples remain.

Entry 80 itself is missing. A missing sample is not judged: its `judged` field is false, and it carries no flag and no replacement. Filling a gap is the caller's decision.

## A window too thin to judge

A window with fewer than three present samples is not judged. On the stated series 2.3, null, null, 2.9, null, null, 2.31 with halfWindow 1, the window around entry 3 spans entries 2 to 4. Both neighbours are missing, so it holds 1 present sample, the entry itself, and `judged` is false.

The rule exists because a median and a MAD of one or two numbers say nothing about whether a sample stands apart. With one sample the MAD is zero, and with two the median is their midpoint and each deviation is the same. The engine declines and says so in the `judged` field.

## Reading `judged`

The `judged` field is what separates a sample the rule examined and passed from a sample the rule could not examine. A report that counts unflagged samples as clean should count only judged ones. Many unjudged samples point to a completeness problem, for the Associate checks to report first.

## A note on missing values inside the import

The decision is made by the petrophysics engine's `despikeHampel`. That function's own entry point turns a null into 0. The `hampel` function converts missing values to NaN before the call, so this engine is unaffected: a missing sample stays missing and stays out of every window.

## The halfWindow must be at least 1

A halfWindow of zero would make every window a single sample. The engine refuses it by name, naming the field `halfWindow`:

> halfWindow must be a whole number, 1 or more (the window is 2 x halfWindow + 1 samples)

## Exercise

Open the explorer's Hampel view and type 2.3, null, null, 2.9, null, null, 2.31 with halfWindow 1. Confirm that entry 3 is reported as not judged. Change halfWindow to 3 and run it again, then count the present samples in entry 3's window and say whether it is judged now, using the three-sample rule.
