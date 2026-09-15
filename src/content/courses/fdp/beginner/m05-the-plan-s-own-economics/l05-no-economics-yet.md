# No economics yet

A plan with nothing in its economics section does not get a value of zero. It gets 89 percent complete and a named error: "Total CAPEX is zero or missing."

{{panel:ec-plan-explorer}}

## Nine sections, and what is in them

The studio checks nine sections: Field Data, Subsurface, Concepts, Wells, Facilities, Schedule, Economics, HSE and Risks. A full plan scores 100 percent with all 9 of 9 present, isValid true, no errors and no warnings. Take the economics out of that same plan and it scores 89 percent, with one error naming the missing capex. One section emptied, one error appeared, and the other eight sections still carry what they carried.

## What the scores look like

| plan | completeness | isValid | errors |
| --- | --- | --- | --- |
| complete plan | 100 percent | true | none |
| the same plan with no economics | 89 percent | not reported | Total CAPEX is zero or missing. |
| empty state | 0 percent | false | project name, reserves, capex |
| four sections of nine | 44 percent | false | Total CAPEX is zero or missing. |
| five sections of nine | 56 percent | false | Total CAPEX is zero or missing. |
| a gas only plan | 33 percent | true | none |

Four of nine rounds 44.44 to 44 and five of nine rounds 55.56 to 56, so the number moves in steps of roughly a ninth and a single missing section is visible in it.

## A value of zero is not the same as no value

A plan carrying a negative value still counts as economics done and scores 11 percent on an otherwise empty record. A plan carrying a value of exactly zero scores 0 percent, because the check cannot tell a zero that was calculated from a zero that was never filled in. That is a property of the check as published, and it is worth knowing before reading a completeness score as a measure of effort.

## The mistake

Treating the percent as a quality score. It counts sections that carry something. It does not ask whether the reserves are right, whether the concept capex was estimated or guessed, or whether the schedule was drawn by anybody who has built one. A gas only plan passes the reserves check and scores 33 percent with isValid true, which says the plan is consistent so far and nothing at all about whether it is any good.

## What it refuses

The studio will not produce economics for a plan that cannot be costed yet. It answers with a list of what is missing rather than a number, and the list names each thing: a project name, a reserves estimate, a total capex. Before the repair that shipped with this course, a plan whose reserves table was complete but whose summary was empty scored 78 and failed validation. It now reads the table, scores 100 percent and passes, and an unreadable reserves table reads as no reserves at all: 22 percent, isValid false, and the error "Reserves (P50) not estimated."

## Exercise

Give the completeness and the error for the full plan with its economics removed. Then say what a plan with a negative value scores against one with a value of exactly zero, and explain why a 33 percent plan can still report isValid true.
