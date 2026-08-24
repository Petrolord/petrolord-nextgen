# Counting wells with all tops

Three of the four Ekene wells carry all four tops. That sentence is one of the six graded answers in this tier's capstone, and it is the only one graded with a tolerance of zero. Every other answer has a 0.01 m window around it. This one has no window. You report 3 or you report nothing.

A number that must be exact deserves a lesson to itself, because the arithmetic is trivial and the definition is where people lose the mark.

## What is being counted

The count is of wells, not of picks and not of tops.

A well is counted if it has a pick for every one of the four named surfaces in the project: TOP_A, TOP_SAND, BASE_SAND and TOP_B. One blank anywhere in the well's row and the well is out. There is no partial credit at the well level any more than there is at the grading level.

Run it across the section. Ekene-1 has 1500, 1548, 1580 and 1640, so it counts. Ekene-2 has 1512, 1565, 1601 and 1662, so it counts. Ekene-3 has 1495, 1541, 1570 and 1628, so it counts. Ekene-4 has 1530, 1590 and 1615 and no TOP_B, so it does not. The count is 3.

## The three wrong answers, and where each comes from

**Four.** This is the count of wells on the section, and it is what you get if you read the panel header instead of the rows. Four wells are drawn, four wells are flattened, four wells contribute a shift and an interval. Only three of them carry a complete column. The question asks about columns, not about attendance.

**One.** This is the count of wells missing a top, which is the complement and a perfectly reasonable thing to know. It is not what the field asks for. Read the label before you read the panel.

**Fifteen.** This is the count of picks present, out of the sixteen slots that four wells and four tops make. It is a genuine data-completeness measure and it is a different one. A section of ten wells missing one top each would score 3 on nothing and would still have a very high pick count. The well count is the harsher measure and that is why it is the one reported.

## Why the count is worth reporting on any section

The count is a denominator. Every statistic you quote off a section is computed over some set of wells, and the reader has no way to know which set unless you say so.

On Ekene, the A-to-SAND growth range of 14 m is a four-well number, because all four wells carry both TOP_A and TOP_SAND. The relief on TOP_B of 34 m is a three-well number. Both are correct. They are not comparable, and a reader who assumes both were computed over the same wells will draw a conclusion neither of them supports.

Stating "3 of 4 wells carry all four tops" at the top of a section report does two jobs at once. It tells the reader that the complete-column analyses on this section rest on three wells. And it warns them that at least one number further down will have a different denominator, so they should look for the labels rather than assume.

There is a second reason, and it is about your own work. The count is a fast integrity check on the tops table. If you believe you have four complete wells and the count says three, either a well stopped short or a pick was never entered. Both are worth knowing before you compute anything. The count catches at the start what would otherwise surface as a confusing blank halfway through an analysis.

## The count does not change when you flatten

Flattening moves picks up and down the display. It does not create picks and it does not remove them. Before flattening the count is 3. After flattening on TOP_A at a 1450 m datum the count is still 3, and it would still be 3 on any other datum and any other flattening top.

That invariance is worth stating because it makes the count safe to read in whichever view you happen to be in. Unlike a displayed depth, which belongs to a view, and unlike relief, which must be read in the measured view, the well count is a property of the tops table and travels with it.

The one thing flattening can do is make the gap easier to see. On the flattened section every well's TOP_A sits on the datum line and the columns hang below it in register, so a row that runs out early stands out at a glance.

Open the panel, flatten the section, and count the rows that carry a value for all four tops.

{{panel:wc-flatten-explorer}}

## Exercise

Without looking at the section, answer three questions. First, if a fifth well joined Ekene carrying TOP_A, TOP_SAND and TOP_B but no BASE_SAND, what would the count of wells carrying all four tops become? Second, would the pick count change by the same amount? Third, would either number change if you re-flattened the enlarged section on TOP_SAND instead of TOP_A?

Self-check: the count of wells carrying all four tops stays at 3, because the new well is missing a surface and fails the test exactly as Ekene-4 does, even though the missing surface is a different one. The pick count does change, from 15 out of 16 to 18 out of 20, which shows the two measures moving independently and is the reason the capstone grades the stricter one. Neither number changes under a different flattening top or datum, because flattening shifts picks and never adds or removes them. If your answer to the first question was 4, re-read the definition: the test is every one of the four surfaces, not most of them.
