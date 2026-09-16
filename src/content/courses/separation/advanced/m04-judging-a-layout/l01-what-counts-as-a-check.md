# What counts as a check

A check is a comparison between two placed items with a positive requirement. Everything that fails one of those three tests is counted somewhere else, and the ERHA station produces four separate counts from one run.

{{panel:fc-layout-explorer}}

## The counts on one station

| count | ERHA |
| --- | --- |
| checked | 69 |
| zeroRequirementPairs | 21 |
| skipped | 2 |
| unknownPairs | 12 |

Sixty-nine comparisons carried a positive requirement and were made. Twenty-one pairs had a requirement of zero. Two items could not be reached at all. Twelve pairs had a type combination the table does not carry.

Only the first of those four is a check. The other three are counted apart from it so that a reader can tell a quiet plot from an unexamined one. Two of them, the skipped items and the unknown type pairs, are what make complete false.

## A requirement of zero is not a requirement

The spacing table scores several pairs at zero on purpose. A separator to a valve requires 0.000000 m and a valve to a relief valve requires 0.000000 m, because those items are meant to sit together. A comparison against zero can never fail, so counting it as a check would inflate the count with results that were guaranteed before the distance was measured.

The published case s3ZeroRequirementPairOnly isolates this. It has one pair, the table scores it at zero, and the engine reports checked 0 with zeroRequirementPairs 1. The retired rule reported checked 1 on the same plan.

## Why the split matters to a reader

A count of 69 checks sounds like a thorough review, and on ERHA it is one. A count of 69 on a plan whose valves outnumber its vessels could be mostly zero-requirement comparisons dressed as work. The engine keeps the two apart so the question can be asked.

`checked` still depends on what happens to be on the plan. Adding six relief valves adds pairs, and a reviewer who reads only the headline number will see a bigger review where nothing more was examined. The count of zero-requirement pairs beside it is what makes that visible.

## What a check compares against

Two kinds of requirement produce a check. A table figure, which is a spacing value this engine records and does not compute. A computed setback, which comes from a duty: the ERHA flare setback of 64.6458 m from 828000.0000 kW of heat release, and the bund radius of 59.5294 m from the pool centre with 50.5294 m from the pool edge. Both kinds are compared the same way, and both count as checks when they are positive.

## The mistake

The mistake is quoting the number of checks as a measure of safety. It measures how much comparing was done, and pass, complete, the skipped list and the unknown pairs are what say whether the comparing amounted to a judgement.

The second mistake is reading a zero requirement as a cleared check. Nothing was cleared. The table declined to ask for a distance, which is a statement about the table rather than about the plot.

## Exercise

Give the four counts ERHA reports and say which one of them is a check. Then explain why a pair with a requirement of 0.000000 m is counted separately, state what the retired rule reported on s3ZeroRequirementPairOnly, and name the two kinds of requirement that produce a real check.
