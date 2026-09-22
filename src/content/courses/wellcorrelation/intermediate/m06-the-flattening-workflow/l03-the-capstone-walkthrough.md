# The capstone walkthrough

The Professional capstone gives you a section of its own, with picks to a tenth of a metre, and asks you to flatten it on TOP_A at a datum it names and study the A-to-SAND interval. It grades six numbers: five at that setting and one at a second datum it names. This lesson walks the six on the Ekene section, which is the teaching case, flattened on TOP_A at 1450 m. None of the Ekene numbers is a capstone answer.

The flatten explorer opens on the Ekene wells. Choose "Type a section", replace the Ekene lines with the brief's wells, pick the flattening top and type the datum.

## The six fields, worked on Ekene

**1. A well's flattening shift.** On Ekene, Ekene-4's is -80 m: the datum minus the well's own TOP_A, 1450 minus 1530.

**2. A well's TOP_SAND displayed depth.** On Ekene, Ekene-2's is 1503 m displayed: the measured pick plus that well's shift, 1565 plus -62.

**3. A well's TOP_A to TOP_SAND interval.** On Ekene, Ekene-4's is 60 m, from the interval column or from the measured picks as 1590 minus 1530. The two agree, and that agreement is check two from the previous lesson.

**4. The A-to-SAND growth range, maximum minus minimum.** On Ekene the four intervals are 48, 53, 46 and 60 m, so the range is 60 minus 46, which is 14 m.

**5. The shallowest displayed depth at a second setting.** Select the second flattening top the brief names, type its datum, and read the Shallowest displayed tile. By hand, give every well its new shift, the datum minus its own pick on that top, add that shift to each of its picks, and take the smallest result. On Ekene, flattened on TOP_SAND at 1480 m, it is 1420 m. Then put the panel back on the first datum before you read field 6.

**6. The displayed depth span of the section.** Read the shallowest and deepest displayed picks on the flattened panel and subtract. On Ekene the shallowest is 1450 m, since every TOP_A lands on the datum, and the deepest is Ekene-2's TOP_B at 1662 minus 62, which is 1600 m: a span of 150 m.

The capstone's section moves every one of these. The arithmetic does not move.

## The sign is part of the answer

Field 1 is negative whenever the well's flattening pick is deeper than the datum. Drop the sign and you have reported a well that moves down instead of up; apply the unsigned number to a pick and every displayed depth in that well comes out wrong by twice the shift.

## The span is a span, not a depth

Field 6 is a difference between two depths. The two most common wrong answers are the two depths it was built from: the deepest displayed pick, and the datum. Either is a real number on the panel and neither is the field. The span covers the picks that exist, so a well's missing TOP_B does not enter it.

Open the panel, flatten on TOP_A at the Ekene datum, and locate fields 1 to 4 and 6. Then flatten on TOP_SAND at 1480 m for field 5.

{{panel:wc-flatten-explorer}}

## Exercise

Without opening the panel, list the six fields in capstone order with the unit of each, and say where you would read each one. Then answer in two sentences: which field is read at a second datum, and which two fields would you get wrong by reporting a number that is genuinely on the panel.

Self-check: a flattening shift, a TOP_SAND displayed depth, a TOP_A to TOP_SAND interval, the growth range, the shallowest displayed depth at the second datum, and the displayed span, all in metres. Field 5 is the one read at a second datum. The two fields most easily filled with a real but wrong number are the shift, whose magnitude sits on the panel without its sign mattering to the eye, and the span, where the deepest displayed pick and the datum are both on the panel while the span is their difference.
