# The four outcomes of a cell

{{panel:ae-scoring-explorer}}

A cell has a label, which may be empty, and a prediction, which may be empty. Two sides, each filled or empty, give four combinations, and the engine names an outcome for each. Every cell the engine scores carries its outcome and, when it is not correct, a reason.

## The rule

The engine prints the rule in its basis:

> correct: the values match, or both are empty; wrong: both have a value and they do not match; missed: the label has a value and the prediction is empty; unsupported: the label is empty and the prediction has a value. Empty is null, absent or a blank string

| label | prediction | outcome |
| --- | --- | --- |
| filled | filled, matching | correct |
| empty | empty | correct |
| filled | filled, a different value | wrong |
| filled | empty | missed |
| empty | filled | unsupported |

Missed and unsupported are two different mistakes. A missed cell left out a value the passage states. An unsupported cell stated a value the passage does not give for that record, which is the extraction form of an unsupported claim.

## The two systems, cell by cell

Over the 180 cells:

| outcome | system A | system B |
| --- | --- | --- |
| correct | 175 | 165 |
| of which both empty | 73 | 71 |
| wrong | 2 | 7 |
| missed | 1 | 4 |
| unsupported | 2 | 4 |

## Planted cases, one of each

Every one of these was planted in the fixture, and the engine finds each with the outcome named.

System A left the water cut of EKD-020 empty where the label is 0, the planted missed zero water cut. The outcome is missed, with the reason "the label has a value and the prediction is empty". A zero is a value, and leaving it out is a miss.

System A put Ekene-6's water cut, 3.7 percent, on the EKD-027 record, which is about Ekene-3 and states no water cut for it. The label is empty, so the outcome is unsupported: "the label is empty and the prediction has a value". System A's EKD-036 prediction is the same kind: it took the 2,289 psi wellhead pressure as a reservoir pressure, and the label, which by the fixture's rule is a static reservoir pressure only, is empty.

System A wrote "near-miss" for the event of EKD-044, whose label is "near miss". The outcome is wrong, and the reason shows why:

> normalised "nearmiss" differs from "near miss"

The hyphen is dropped by the normalisation and the two words join. System B made the same kind of mistake with a well name, "Ekene 3" for "Ekene-3" on EKD-003.

## Records that were not returned

System B returned no prediction for EKD-053 or EKD-056. The engine scores a labelled record with no prediction as all empty, so every filled label on those records is missed, and every empty label is correct. B's missed count of 4 is those two records: a date and an event on EKD-053, and a well and an event on EKD-056.

## Exercise

Open the view for field extraction. It starts with the six fields, the first eight labelled records and system B's predictions for them. Read the table of cells that are not correct, and for each row say which of the four outcomes it is and why. Then edit one prediction of your own: delete a value that the label holds, and fill a field whose label is empty. Run it and find both cells in the table with their outcomes and reasons.
