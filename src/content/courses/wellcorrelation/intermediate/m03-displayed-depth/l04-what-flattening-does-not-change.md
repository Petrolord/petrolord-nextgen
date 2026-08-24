# What flattening does not change

Flattening is a dramatic operation to watch. Four columns slide up the screen by different amounts, a ragged surface snaps into a straight line, and the section you were looking at is replaced by one that looks nothing like it. It is worth being precise about how little actually changed. Only the display moved. This is the lesson that stops a learner reporting a flattened depth as a real one.

## Measured depths are untouched

The tops table is not edited by flattening. Ekene-2's TOP_SAND is at a measured 1565 m before you set the datum, while the panel is drawn, and after you close it. The shift is a drawing-time addition, computed once per well and applied to positions on a canvas. It is not written back anywhere.

That has a practical consequence worth stating plainly. Any question about the well itself has the same answer in the flattened view as in the structural view, because the flattened view did not change the well. Where do you set casing. How deep is total depth. What depth was the core cut at. The section on the screen is irrelevant to all of them.

## Intervals within a well are untouched

An interval is the difference between two picks in the same well. Both picks sit in the same column, so both move by the same shift, and the shift cancels:

$$(b + s) - (a + s) = b - a$$

Work Ekene-2 both ways to see the cancellation happen. Measured, its A-to-SAND interval is 1565 minus 1512, which is 53 m. Displayed, the same interval is 1503 minus 1450, which is 53 m. The same holds in every well and for every pair of picks. The sand itself is 1601 minus 1565, which is 36 m measured in Ekene-2, and 1539 minus 1503, which is 36 m read off the displayed column.

This invariance is the whole licence for flattening. If the operation changed thicknesses it would be a distortion and nobody would trust a section drawn with it. Because it cannot change thicknesses, you can move the section onto any datum you like and every thickness on it stays honest. Module four is built on that guarantee.

## Structural relief is untouched

Relief is the measured spread of one surface across the wells that carry it, and it is defined on measured depths, which flattening does not modify. So the four Ekene reliefs are the same numbers in the flattened view as in the structural one: TOP_A 35 m, TOP_SAND 49 m, BASE_SAND 45 m, and TOP_B 34 m over the three wells that reach it.

Here is where care is needed, because the panel invites a wrong reading. After flattening on TOP_A, the displayed TOP_SAND column runs 1498, 1503, 1496 and 1510 m, a displayed spread of 14 m. TOP_SAND looks far flatter than it did, and the temptation is to say that flattening reduced its relief from 49 m to 14 m. It did not. TOP_SAND still has 49 m of relief, measured from 1541 m in Ekene-3 to 1590 m in Ekene-4, and that is still the structural fact about the surface. What the flattened panel shows is a different quantity that happens to be drawn on the same line. Module four names it and takes it apart. For now, hold the rule: relief is a measured-depth statement, and no display setting can change it.

## The reporting discipline

Three sentences that keep the two worlds apart.

Never write a displayed depth without the word displayed and the datum beside it. "BASE_SAND in Ekene-4 draws at 1535 m displayed on the section flattened on TOP_A at 1450 m" is a complete statement. "BASE_SAND in Ekene-4 is at 1535" is a false one, since the measured pick is at 1615 m and nothing in that wellbore is at 1535 m.

Never let a displayed depth into an operational document. Not a drilling programme, not a completion design, not a perforation memo, not a volumetric input. Those take measured depth, always, and a displayed depth looks exactly like a depth once it has been copied into a table and lost its label.

Never quote a displayed number from a view whose datum you cannot name. If you find one in a handover pack with no datum recorded, it cannot be reconstructed and it cannot be trusted, because the same pick displays at different numbers on every datum anyone might have chosen.

## What flattening did change

For completeness, the list is short. Displayed depths changed, by one shift per well. The displayed span changed, because it is computed from displayed depths. The apparent shape of every surface other than the flattening top changed, which is the point of the exercise. That is all.

## Exercise

For Ekene-4, whose shift is -80, list what changes and what does not when you flatten on TOP_A at 1450 m. Cover the measured depth of BASE_SAND at 1615 m, the displayed depth of the same pick, the TOP_A to TOP_SAND interval given as 60 m, and the structural relief of BASE_SAND across the section, given as 45 m.

Self-check: the measured depth stays 1615 m, because flattening never edits the tops table. The displayed depth becomes 1615 minus 80, which is 1535 m displayed. The interval stays 60 m, because both of its ends moved by the same -80 and the shift cancelled. The relief of BASE_SAND stays 45 m, because relief is a measured-depth quantity across wells and no datum choice can alter it. Only one of the four numbers moved, and it is the one that exists only on the panel.
