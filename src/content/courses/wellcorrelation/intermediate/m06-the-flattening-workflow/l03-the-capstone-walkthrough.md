# The capstone walkthrough

The Professional capstone for this course is called Growth analysis of the Ekene section. It asks you to flatten the section on TOP_A at a 1450 m datum and study the A-to-SAND interval, and it grades six numbers. This lesson walks the six in capstone order, gives the unit and tolerance of each as the assessment defines them, and says where each one is read.

## The six graded fields

| Field | Unit | Tolerance |
| --- | --- | --- |
| Ekene-4: flattening shift | m | 0.01 |
| Ekene-2: TOP_SAND displayed depth | m | 0.01 |
| Ekene-4: TOP_A to TOP_SAND interval | m | 0.01 |
| A-to-SAND growth range (max minus min) | m | 0.01 |
| Wells carrying all four tops | count | 0 |
| Displayed depth span of the section | m | 0.01 |

**1. Ekene-4: flattening shift, in m, tolerance 0.01.** The value is -80 m. Read it from the shift column of the flattened panel with TOP_A selected as the flattening top and the datum set to 1450 m. By hand it is the datum minus the well's own TOP_A, 1450 minus 1530.

**2. Ekene-2: TOP_SAND displayed depth, in m, tolerance 0.01.** The value is 1503 m displayed. Read it from Ekene-2's TOP_SAND entry in the displayed depth column of the same panel. By hand it is the measured pick plus that well's shift, 1565 plus -62.

**3. Ekene-4: TOP_A to TOP_SAND interval, in m, tolerance 0.01.** The value is 60 m. Read it from the interval column for Ekene-4, or compute it from the measured picks as 1590 minus 1530. The two agree, and that agreement is check two from the previous lesson.

**4. A-to-SAND growth range, meaning max minus min, in m, tolerance 0.01.** The value is 14 m. Read the growth range directly from the panel, or take the four intervals of 48, 53, 46 and 60 m and compute 60 minus 46. The maximum is Ekene-4 and the minimum is Ekene-3.

**5. Wells carrying all four tops, a count, tolerance 0.** The value is 3. Count the wells whose row carries a value for TOP_A, TOP_SAND, BASE_SAND and TOP_B. Ekene-4 has no TOP_B and is excluded.

**6. Displayed depth span of the section, in m, tolerance 0.01.** The value is 150 m. Read the shallowest and deepest displayed picks on the flattened panel and subtract. The shallowest is 1450 m, since every TOP_A lands on the datum. The deepest is Ekene-2's TOP_B at 1662 minus 62, which is 1600 m.

One panel, one datum, six readings. Fields 1 through 4 come from the flattened view with TOP_A at 1450 m. Field 5 comes from the tops table and is the same in any view. Field 6 comes from the flattened view as well.

## The count has a tolerance of zero

Field 5 is the only one of the six with no margin at all. Two counts sit either side of the right answer and neither scores anything. Four is the number of wells on the section. One is the number of wells missing a top. The field asks for the number of wells carrying a complete column, which is 3.

That is the correct design for a count. There is no such thing as being close to 3 wells. A count is either the number of things or it is not, so 4 is not a near miss, it is a claim that Ekene-4 has a TOP_B. Every other field on this list forgives a hundredth of a metre. This one forgives nothing.

## The shift is negative, and the sign is part of the answer

Field 1 is -80 m. It is not 80 m.

The sign is doing real work. The shift is the datum minus the well's flattening pick, and Ekene-4's TOP_A at 1530 m is deeper than the 1450 m datum, so the shift is negative and the well moves up the display to reach the datum. Every well on this section takes a negative shift, at -50, -62, -45 and -80 m, because every TOP_A is deeper than the datum.

Drop the sign and you have reported a well that moves down instead of up. Apply the unsigned number to a pick and every displayed depth in that well comes out 160 m wrong. The tolerance of 0.01 m gives you no shelter here at all: 80 is not within 0.01 of -80.

## The span is a span, not a depth

Field 6 is 150 m and it is a difference between two depths, not a depth. Its unit is metres in both cases, which is precisely why it is easy to confuse.

The two most common wrong answers are the two depths it was built from. Reporting 1600 gives the deepest displayed pick. Reporting 1450 gives the datum. Either is a real number on the panel and neither is the field.

Two further things matter here. The first is what sets the deep end. A displayed depth is 1450 plus the pick's measured distance below its own well's TOP_A, so the span is the largest such distance on the section. Those distances are 140, 150, 133 and 85 m across Ekene-1 to Ekene-4, and Ekene-2 supplies the 150 m. Ekene-4 shows why raw depth is the wrong thing to look at: it holds the deepest measured pick of every top it has and still draws shallowest, at 1450 plus 85, which is 1535 m. The second is that the span covers the picks that exist, so Ekene-4's missing TOP_B does not enter it.

Open the panel, flatten on TOP_A at 1450 m, and locate all six values in capstone order before you submit anything.

{{panel:wc-flatten-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each, and say where you would read each one. Then answer in two sentences: which field has no margin, and which two fields would you get wrong by reporting a number that is genuinely on the panel.

Self-check: Ekene-4 flattening shift in m at tolerance 0.01, which is -80; Ekene-2 TOP_SAND displayed depth in m at tolerance 0.01, which is 1503; Ekene-4 TOP_A to TOP_SAND interval in m at tolerance 0.01, which is 60; A-to-SAND growth range as max minus min in m at tolerance 0.01, which is 14; wells carrying all four tops as a count at tolerance 0, which is 3; and displayed depth span of the section in m at tolerance 0.01, which is 150. Fields 1 to 4 and field 6 are read on the flattened panel with TOP_A at 1450 m, and field 5 is read from the tops table and is view independent. The count of wells carrying all four tops has no margin. The two fields most easily filled with a real but wrong number are the shift, where 80 is on the panel as a magnitude while -80 is the answer, and the span, where 1600 and 1450 are both on the panel while 150 is the answer.
