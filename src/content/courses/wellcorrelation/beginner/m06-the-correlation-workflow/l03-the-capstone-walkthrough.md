# The capstone walkthrough

The Associate capstone is a reading exercise, not a memory test. Its brief gives you a section of its own: four wells with their TOP_A, TOP_SAND, BASE_SAND and TOP_B picks to a tenth of a metre, a flattening top and a datum. It grades six numbers. Five are read in that flattened view and one in a second flattening the brief names. This lesson walks all six on the Ekene section, which is the teaching case, so that nothing on the day is a surprise. None of the Ekene numbers is a capstone answer.

## Setting the section

The section panel opens on the Ekene wells. Choose "Type a section" and replace the Ekene lines with the brief's wells, one per line: name, TOP_A, TOP_SAND, BASE_SAND, TOP_B, with a dash for a top a well did not reach. The table and tiles print to a tenth of a metre, which is the precision the picks carry.

## The six quantities, worked on Ekene flattened on TOP_SAND at 1500 m

**A well's flattening shift.** The shift is the datum minus the well's own datum-top depth. Ekene-2 picks TOP_SAND at 1565 m, so the shift is 1500 minus 1565, which is -65 m. Negative because the column moves up the page to reach the datum.

**A well's SAND zone thickness.** The zone runs from TOP_SAND to BASE_SAND. In Ekene-3 that is 1570 minus 1541, which is 29 m. Read it in either view and you get the same answer, because both ends take the same shift. This is the one number the flattening cannot touch.

**A BASE_SAND displayed depth.** Displayed depth is true depth plus the well's shift. Ekene-4 has BASE_SAND at 1615 m and takes a shift of -90 m, so it displays at 1525 m. It is where the surface is drawn on this panel, not the depth in the ground.

**The structural relief on TOP_SAND.** Relief is the deepest pick minus the shallowest: 1590 minus 1541, which is 49 m. Read it in the structural view, not the flattened one, because flattening on TOP_SAND removes exactly that relief by construction.

**A TOP_B displayed depth on a second datum.** Re-flatten on the top and datum the brief names. Each well's shift is now the datum minus its own pick on that top, and its TOP_B displays at the true pick plus that shift. A shift belongs to a well and a datum together, so work it fresh when the datum top changes. Then put the panel back on the first datum.

**A TOP_B displayed depth on the first datum.** Same arithmetic: Ekene-1's TOP_B is 1640 m true, shift -48 m, so it displays at 1592 m. The shift belongs to the well, so it applies to every top in that well.

The capstone's section moves every one of these. The arithmetic does not move.

## Precision

The picks carry a tenth of a metre, so every answer is a tenth of a metre too, and the capstone grades each to a few thousandths. There is no rounding trap: add and subtract the stated picks exactly, and copy the tile.

## What has to happen before the capstone opens

The capstone is the last thing in the course, and the server enforces that order. The path is:

1. Read every lesson in a module.
2. Pass that module's quiz at 75 percent. Three failed attempts trigger a 24 hour cooldown before you can try again.
3. Clear all six modules the same way.
4. Pass the final exam at 70 percent.
5. Only then does the capstone unlock.

Passing the capstone grants the Associate certification for this course. That certification is the gate on the tier above it.

## How to prepare

Know which view answers which question. Relief lives in the structural view. Displayed depths live in the flattened view, and each one belongs to the datum it was read at. Thicknesses live in both.

Know the two pieces of arithmetic by feel: shift equals datum minus datum-top depth, and displayed equals true plus shift. Every depth answer in the capstone is one of those two, applied once.

Try it yourself: reproduce the Ekene numbers above on the panel below, then choose "Type a section" and move one TOP_SAND pick by 2.5 m to see which readings follow it.

{{panel:wc-section-explorer}}

## Exercise

Using the Ekene section flattened on TOP_SAND at 1500 m, work out Ekene-2's TOP_A displayed depth and its BASE_SAND displayed depth, then state the gross sand thickness you would report for that well.

Self-check: Ekene-2's shift is -65 m, so TOP_A at 1512 m displays at 1447 m and BASE_SAND at 1601 m displays at 1536 m. The gross sand is 36 m, which you can confirm from the displayed pair, 1536 minus 1500, and from the true pair, 1601 minus 1565. Getting the same 36 m both ways is the check that your shift is right.
