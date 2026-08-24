# A well that stops short

Four wells hang on the Ekene section and three of them carry a full column. Ekene-4 does not. It reached total depth above TOP_B, so the deepest surface in the project was never drilled in that hole. Ekene-4 carries TOP_A at 1530 m, TOP_SAND at 1590 m and BASE_SAND at 1615 m, and it carries no TOP_B at all.

The Associate tier met this well and learned to leave the gap alone. This tier has to do something harder. You are about to compute shifts, displayed depths, intervals and a growth range across the whole section, and you need to know precisely which of those numbers Ekene-4 can take part in and which it cannot. That question has a clean answer, and getting it right is most of what this module is for.

## What Ekene-4 actually carries

| top | Ekene-1 | Ekene-2 | Ekene-3 | Ekene-4 |
| --- | --- | --- | --- | --- |
| TOP_A | 1500 | 1512 | 1495 | 1530 |
| TOP_SAND | 1548 | 1565 | 1541 | 1590 |
| BASE_SAND | 1580 | 1601 | 1570 | 1615 |
| TOP_B | 1640 | 1662 | 1628 | missing |

All depths in that table are measured depths in metres. Fifteen of the sixteen slots are filled. The sixteenth is empty, and it is empty in a specific way that the rest of this module depends on.

## An absence is not a zero

The single most damaging thing you can do with a missing pick is let it become a number. There are two familiar ways that happens.

The first is treating the absence as a zero. A zero is a depth. If Ekene-4's TOP_B were stored as 0, the well would claim a pick at the surface, every relief calculation on TOP_B would blow out, and a mean depth across the section would collapse. Nothing about the well says zero. The well says nothing.

The second is treating the absence as an error in the well. Ekene-4 is not a faulty well and its tops table is not incomplete in the sense of needing repair. The well is a perfectly good three-top well. Its logs are fine, its picks are fine, and the only thing it lacks is a surface that lies below the bottom of the hole. There is nothing to fix, and a tops table that has been quality-controlled to death will still show that blank, because the blank is correct.

The honest reading is the plain one. A missing top is an absence of data. It records that nobody observed the surface in this well, and it makes no claim at all about where the surface is.

## What the absence does not cost you

Here is the part that surprises people. Ekene-4 is missing the deepest top, and that costs it almost nothing in this tier's analysis.

Flattening on TOP_A needs one pick from each well, the well's own TOP_A. Ekene-4 has it, at 1530 m. Its flattening shift is 1450 minus 1530, which is -80 m, and that shift is the largest in magnitude on the section. Ekene-4 flattens as cleanly as any other well.

The interval work needs TOP_A and TOP_SAND. Ekene-4 has both, and its TOP_A to TOP_SAND interval is 1590 minus 1530, which is 60 m. That is the thickest A-to-SAND interval anywhere on the section. The growth range across the four wells runs from Ekene-3 at 46 m to Ekene-4 at 60 m, so it is 14 m, and the well with the missing top supplies one of the two ends of it.

Read that again, because it settles the attitude you should have. The well with the incomplete column carries the strongest growth signal in the dataset. Discarding a well because one of its tops is absent would have thrown away the maximum of the very quantity this tier exists to measure.

## What the absence does cost you

The cost is narrow and it is real. Ekene-4 cannot contribute to anything that needs TOP_B.

Structural relief on TOP_B is 34 m, and it is a three-well number. The interval from BASE_SAND down to TOP_B exists in three wells. Any statistic on TOP_B, in the measured view or the flattened one, describes Ekene-1, Ekene-2 and Ekene-3 and is silent about Ekene-4.

The displayed span of the flattened section is subtler. After flattening on TOP_A at 1450 m, the shallowest displayed pick is 1450, because every well's TOP_A lands on the datum by construction. The deepest displayed pick is Ekene-2's TOP_B at 1662 minus 62, which is 1600 m. The span is 1600 minus 1450, which is 150 m. That span was computed over the picks that exist. It is not the span of the section as it would be if every well were complete, and it does not become wrong because Ekene-4 stopped short. It is the span of the drawn picks, which is exactly what the capstone asks for.

## Why this well stopped

Of the reasons a top can be missing, only one is knowable from this section on its own, and it is the one that applies here. Ekene-4's deepest pick is BASE_SAND at 1615 m and the hole ended below that but above TOP_B. Faulting out, erosion and a top that has not been picked yet would each need evidence from outside the section. None of them is needed. The well was not drilled deep enough, and that is a complete explanation.

Saying so plainly is worth doing in a report, because the reader's next question is always why the gap is there. An answer of "the well ended above the surface" closes the question. Silence invites somebody to invent a fault.

## Exercise

Using only Ekene-4's three picks, write down its flattening shift for a TOP_A datum of 1450 m, its TOP_A to TOP_SAND interval, and its BASE_SAND to TOP_B interval. Then state which of the three you were unable to produce and why that failure is the correct outcome rather than a gap to fill.

Self-check: the shift is 1450 minus 1530, which is -80 m, and the sign matters because the well moves up the display. The TOP_A to TOP_SAND interval is 1590 minus 1530, which is 60 m, the thickest on the section. The BASE_SAND to TOP_B interval cannot be produced, because Ekene-4 has no TOP_B. Leaving it blank is correct. Any number you could write there would be an estimate you made up, and it would be indistinguishable from a measurement the moment it entered the table.
