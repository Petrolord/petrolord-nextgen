# Complete is not pass

Complete says the layout was fully judged. Pass says the comparisons that were made all cleared. They answer different questions, they move independently, and a plan can be one without the other.

{{panel:fc-layout-explorer}}

## Four answers from one run

| case | checked | zero req | violations | complete | pass | passStatus |
| --- | --- | --- | --- | --- | --- | --- |
| s4RankingsDisagree | 6 | 0 | 2 | true | false | checked |
| s3SkippedItemPassesButIncomplete | 3 | 0 | 0 | false | true | checked |
| s3ZeroRequirementPairOnly | 0 | 1 | 0 | true | null | nothing-checked |
| s3AllUnplacedNothingChecked | 0 | 0 | 0 | false | null | nothing-checked |
| radiationAndTableWithGhostSource | 2 | 0 | 2 | false | false | checked |
| unknownPairIncomplete | 1 | 0 | 1 | false | false | checked |

s4RankingsDisagree is complete and failing: every pair was judged and two of them are short. s3SkippedItemPassesButIncomplete is passing and incomplete: three comparisons cleared and one item with bad coordinates was never reached. Those two rows are the whole lesson.

## What sets each one

Complete is false when anything stopped the judgement being total: a skipped item, or a pair of types the table has no figure for. It is a statement about coverage.

Pass is false when at least one comparison that was made came up short. It is a statement about results. Pass is null when there was nothing to have a result about, which the `passStatus` field reports as nothing-checked.

A layout can therefore pass while leaving its most important item unexamined, which is why neither field is a verdict on its own. The pair of them, read together with the skipped list, is the verdict.

## ERHA is false on both

The ERHA station reports 69 checks, 21 zero-requirement pairs, 6 failed comparisons, 2 skipped items and 12 unknown type pairs, with complete false and pass false. The two falses have separate causes. Pass is false because of the 6 breaches. Complete is false because of the 2 skipped items and the 12 unknown pairs, and it would still be false if every one of the 69 comparisons had cleared.

## Why complete is false on most real plots

The spacing table carries the classic production items and very little else, so one modern package is enough to produce unknown pairs. A reviewer who treats complete false as an alarm will see an alarm on nearly every plan and will stop reading it.

The useful habit is to read complete as a pointer at the skipped list and the unknown pairs, then decide whether the remainder matters. Two skipped items that are a spare tank and a redundant source are a different remainder from two skipped items that are the flare and the control room.

## The mistake

The mistake is reporting one field. A plan signed off on pass true where complete is false has been signed off on the comparisons somebody happened to be able to make, and the reader was never shown what was left out.

The second mistake is the reverse, refusing to act on a plan because complete is false. The 6 breaches on ERHA are real findings on measured distances, and they do not become provisional because 2 other items could not be reached.

## Exercise

Say what complete measures and what pass measures, and give the case that is complete and failing and the case that is passing and incomplete. Then explain the two separate causes of ERHA reporting false on both fields, and why complete false is expected on most real plots.
