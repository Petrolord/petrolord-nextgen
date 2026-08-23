# The capstone walkthrough

The Associate capstone is a reading exercise, not a memory test. It puts the Ekene section in front of you, flattened on TOP_SAND at a 1500 m datum, and grades six numbers. Every one of them is available on the panel to anyone who knows which view to be in and how the arithmetic works. This lesson walks all six so that nothing on the day is a surprise.

## The six graded quantities

**Ekene-2's flattening shift.** The shift is the datum minus the well's own datum-top depth. Ekene-2 picks TOP_SAND at 1565 m, so the shift is 1500 minus 1565, which is -65 m. Negative because the column moves up the page to reach the datum, and the largest magnitude among the wells belongs to whichever well sat deepest on that surface.

**Ekene-3's SAND zone thickness.** The zone runs from TOP_SAND to BASE_SAND. In Ekene-3 that is 1570 minus 1541, which is 29 m. Read it in either view and you get the same answer, because both ends of the interval take the same shift and the difference cancels. This is the one graded number that the flattening cannot touch.

**Ekene-4's BASE_SAND displayed depth.** Displayed depth is true depth plus the well's shift. Ekene-4 has BASE_SAND at 1615 m and takes a shift of -90 m, so it displays at 1525 m. Say what that number is and is not: it is where the surface is drawn on this panel, and it is not the depth in the ground. The stored top is still 1615 m.

**The structural relief on TOP_SAND across the section.** Relief is the deepest pick minus the shallowest: 1590 minus 1541, which is 49 m. This one carries a trap worth naming clearly. You read it in the structural view, not the flattened one, because flattening on TOP_SAND removes exactly that relief by construction. Look for it on the flattened panel and you will find zero, which is the correct reading of the wrong view. Switch views, take the number, switch back.

**The number of wells the TOP_B correlation line reaches.** Three. Ekene-4 stopped above TOP_B, so the surface has no pick there and the line ends after the third well. Count what the line touches, not how many wells are on the panel.

**Ekene-1's TOP_B displayed depth.** Same arithmetic as before: 1640 m true, shift -48 m, so it displays at 1592 m. Note that the shift belongs to the well and not to the surface. Ekene-1's shift was computed from its TOP_SAND pick, and it then applies to every top in that well, TOP_B included.

## Tolerances

The four depth and thickness answers are marked to 0.01 m, which means the arithmetic has to be right but there is no rounding trap: every one of these numbers is a whole number of metres. The well count is marked exactly. There is no partial credit on a count of three.

## What has to happen before the capstone opens

The capstone is the last thing in the course, and the server enforces that order rather than trusting the sequence to good intentions. The path is:

1. Read every lesson in a module.
2. Pass that module's quiz at 75 percent. Three failed attempts trigger a 24 hour cooldown before you can try again.
3. Clear all six modules the same way.
4. Pass the final exam at 70 percent.
5. Only then does the capstone unlock.

The cooldown is deliberate and it is not a punishment. Three failures in a row on the same quiz means the material has not landed, and another immediate attempt tends to be a guess rather than a reading. The day away is there so that the fourth attempt is worth taking.

Passing the capstone grants the Associate certification for this course. That certification is the gate on the tier above it, so the six numbers are not busywork; they are the evidence that you can take a section, put it in the right view, and read it correctly.

## How to prepare

There is nothing to memorise. Get comfortable with three habits and the capstone follows.

Know which view answers which question. Relief lives in the structural view. Displayed depths live in the flattened view. Thicknesses and counts live in both.

Know the two pieces of arithmetic by feel: shift equals datum minus datum-top depth, and displayed equals true plus shift. Every depth answer in the capstone is one of those two, applied once.

And run the quality control checks from the previous lesson on the section before you start reading. A number read confidently off a panel you have not sanity-checked is the most expensive kind of wrong.

Try it yourself: the panel below draws the Ekene section from the same engine, with the datum under your control.

{{panel:wc-section-explorer}}

## Exercise

Using the capstone view, work out Ekene-2's TOP_A displayed depth and its BASE_SAND displayed depth, then state the gross sand thickness you would report for that well.

Self-check: Ekene-2's shift is -65 m, so TOP_A at 1512 m displays at 1447 m and BASE_SAND at 1601 m displays at 1536 m. The gross sand is 36 m, which you can confirm from the displayed pair, 1536 minus 1500, and from the true pair, 1601 minus 1565. Getting the same 36 m both ways is the check that your shift is right.
