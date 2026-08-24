# The displayed span

The displayed span is the deepest displayed pick on the flattened panel minus the shallowest displayed pick. On this tier's datum, TOP_A at 1450 m, the answer is 150 m and it is one of the six graded readings. This lesson gets it, and then spends most of its length on the well that supplies the deep end, because the reason it wins is the useful part.

## The shallow end is free

After flattening on TOP_A, every well's TOP_A displays at exactly 1450 m. That is the construction guarantee from the previous lesson, and it holds for all four wells. TOP_A is also the shallowest pick in each well, since nothing was picked above it. So the shallowest displayed pick on the whole panel is 1450 m, and it belongs to all four wells at once. There is no calculation to do at the shallow end and no candidate to compare.

## The deep end takes one pass

Work down each well to its deepest pick and display it.

| well | deepest pick | measured | shift | displayed |
|---|---|---|---|---|
| Ekene-1 | TOP_B | 1640 | -50 | 1590 |
| Ekene-2 | TOP_B | 1662 | -62 | 1600 |
| Ekene-3 | TOP_B | 1628 | -45 | 1583 |
| Ekene-4 | BASE_SAND | 1615 | -80 | 1535 |

Ekene-4 appears with BASE_SAND because it has no TOP_B. The well reached total depth above that surface, so its deepest pick is the base of the sand. You do not invent a pick to fill the row, and you do not leave the well out of the comparison either, because it still draws on the panel.

The deepest displayed pick is Ekene-2's TOP_B at 1600 m displayed, and

$$span = 1600 - 1450 = 150$$

The displayed span is 150 m, the graded value.

## Why Ekene-2 owns the deep end

Ekene-2 also carries the deepest measured TOP_B in the section, at 1662 m, so it is tempting to conclude that the deepest displayed pick follows from the deepest measured pick. It does not, and the section contains its own counterexample.

Ekene-4 carries the deepest measured picks in this section on every surface it reaches. Its TOP_A at 1530 m is the deepest TOP_A, its TOP_SAND at 1590 m is the deepest TOP_SAND, and its BASE_SAND at 1615 m is the deepest BASE_SAND. Yet on the flattened panel it draws at 1535 m displayed at its deepest point, which is 65 m shallower than Ekene-2's deep end and shallower than Ekene-1's and Ekene-3's as well. The deepest well in measured depth is the shallowest well on the display.

The reason is that flattening removes the measured depth of TOP_A from every column. Substitute the two formulas together and a displayed depth becomes

$$displayed = md(pick) + (1450 - md(TOP\_A)) = 1450 + (md(pick) - md(TOP\_A))$$

so a displayed depth is the datum plus the distance from that well's own TOP_A down to the pick. Nothing else survives. Measure that distance to each well's deepest pick and you get 140 m in Ekene-1, 150 m in Ekene-2, 133 m in Ekene-3 and 85 m in Ekene-4. Ekene-4 is deep in the ground and short below its own TOP_A, because it stopped drilling before TOP_B. Ekene-2 wins the deep end because it carries the largest measured distance below TOP_A, not because it is the deepest well.

Notice too that the winning distance, 150 m, is the span itself. That is a general result on this kind of datum. Since the shallow end is pinned at the datum, the span equals the largest measured distance below the flattening top anywhere in the section, and you can read it off the pick table without displaying anything.

## What the span is and is not

The span is a property of the picture. It sets how tall the panel has to be to fit every pick, which is what an auto-fit axis uses it for, and it tells you whether a section will read comfortably at a given vertical scale. Change the datum depth from 1450 m to 1400 m and every displayed depth moves by 50 m while the span stays at 150 m. Change the flattening top from TOP_A to another surface and the span changes, because the distances are then measured from a different line.

The span is not a thickness, not a relief and not a stratigraphic quantity. It mixes together the four wells and every surface on the panel, so no geological statement rests on it. Its one diagnostic use is a sanity check: if the span you compute by hand disagrees with the panel, either a shift is wrong or a pick you forgot is drawing outside the range you expected.

The panel below flattens the section on a top and datum you choose, and reports the displayed range along with every shift and displayed depth.

{{panel:wc-flatten-explorer}}

## Exercise

Without using the table above, work out which well supplies the deep end of the displayed span by computing each well's measured distance from its own TOP_A down to its deepest pick. Then state the span, and say in one sentence why Ekene-4 does not supply the deep end despite carrying the deepest measured picks in the section.

Self-check: the distances are 1640 minus 1500, which is 140 m for Ekene-1; 1662 minus 1512, which is 150 m for Ekene-2; 1628 minus 1495, which is 133 m for Ekene-3; and 1615 minus 1530, which is 85 m for Ekene-4, whose deepest pick is BASE_SAND. The largest is Ekene-2 at 150 m, so the span is 150 m and the deep end displays at 1450 plus 150, which is 1600 m displayed. Ekene-4 does not supply the deep end because flattening removes each well's own TOP_A depth, and Ekene-4 stopped drilling only 85 m below its TOP_A.
