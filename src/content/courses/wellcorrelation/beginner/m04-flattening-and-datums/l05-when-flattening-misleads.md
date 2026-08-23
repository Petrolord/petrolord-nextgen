# When flattening misleads

Flattening is a good tool with sharp edges. Every one of its failure modes comes from the same source: it is a confident-looking picture built on an assumption you made, and the picture does not display the assumption. Four failures are worth knowing by name.

## A bad datum pick poisons the whole well

The datum pick is the anchor for its well. Everything else in that column is positioned relative to it, so an error in the datum pick transfers into every other surface in that well, at full size and in the same direction.

Work it through. Ekene-2's TOP_SAND is picked at 1565 m, giving a shift of $1500 - 1565 = -65$ and putting TOP_B on the display at $1662 - 65 = 1597$ m. Suppose that sand pick was 12 m too deep and should have been 1553 m. The shift becomes $1500 - 1553 = -53$, and TOP_B now displays at $1662 - 53 = 1609$ m. The TOP_B pick never changed. Its true depth is still 1662 m. But it moved 12 m on the panel, and the BASE_SAND to TOP_B interval you were comparing across the section looks 12 m different from what it is.

Worse, the error is invisible in the flattened view. The datum tops still line up perfectly at 1500 m, because they always do, whether the picks are right or wrong. The one surface that cannot show you a datum pick error is the datum surface. This is why the criterion in lesson three was *reliably picked*, and why a datum pick deserves a second look before you build anything on it.

## Flattening an unconformity implies continuity that is not there

Flattening rests on a claim: this surface was, near enough, level at one moment, so restoring it to level restores the geometry of that moment. A conformable marine flooding surface supports that claim reasonably well.

An unconformity does not. An erosional surface is a record of removal, and the material missing beneath it varies from place to place. Level the erosion surface and the section beneath it looks like a tidy layer-cake of preserved intervals, when in truth different amounts of section have been cut out at different wells. The panel implies that what you see in one well continues into the next, and the surface you flattened on is the very evidence that it may not. The same warning applies to any surface that truncates, onlaps, or was itself deformed before deposition continued.

## A flattened section says nothing about relief on its own datum

This one follows straight from lesson one, but it is the most common misreading in practice. You removed the datum surface's relief deliberately. It cannot then be recovered from the panel.

On the capstone view, TOP_SAND draws as a perfectly horizontal line at 1500 m in all four wells. Nothing on that panel tells you the sand surface has 49 m of relief, from 1541 m in Ekene-3 to 1590 m in Ekene-4. That relief exists only in the structural view. So a flattened panel is never evidence that a surface is flat, and a statement like "the sand is structurally uniform" cannot be supported by the view that made it uniform.

## An audience without the datum reads structure

Show a flattened panel to somebody who was not told the datum and they will read it as a structural cross-section, because that is what a cross-section normally is. They will see the horizontal datum line as a flat surface in the ground, and they will read the displayed depths as depths. Both readings are wrong, and neither is their fault. A panel that does not carry its own datum invites the misreading.

This is a communication failure rather than a technical one, which makes it the easiest to prevent and the easiest to forget.

## The prescription

Two habits close all four.

**Always look at both views.** The structural section and the flattened section are the same data answering different questions, and the answers are only trustworthy together. Structure first, so you know what relief exists. Then flatten, so you can compare intervals with that relief removed. Then go back, because a feature that appears in the flattened view should be checked against where it sits structurally. Neither view alone is a complete reading of the section.

**Label every panel with its datum.** A caption of the form "flattened on TOP_SAND at 1500 m" or "structural, true MD" costs nothing and removes the ambiguity permanently. It belongs on the screen, in the report figure, and in the slide. If a panel might be exported, screenshotted or pasted into somebody else's deck, assume it will be, and assume the caption is the only context that travels with it.

## Exercise

Ekene-3's TOP_SAND is picked at 1541 m and its TOP_B at 1628 m, so under the capstone datum TOP_B displays at 1587 m. Suppose the sand pick was 7 m too shallow and should have been 1548 m. Recompute the shift and the displayed TOP_B, and say what the true BASE_SAND to TOP_B interval does under the correction.

Self-check: the corrected shift is $1500 - 1548 = -48$, so TOP_B displays at $1628 - 48 = 1580$ m, 7 m higher than before. The true BASE_SAND to TOP_B interval is unchanged at $1628 - 1570 = 58$ m, because neither of those two picks moved; only the datum pick did, and it moved the whole column on the display.
