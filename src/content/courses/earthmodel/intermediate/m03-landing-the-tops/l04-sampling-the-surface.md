# Sampling the surface

A landed pick almost never sits on a grid node, so "the surface's depth at the landing point" is itself a computed quantity. This lesson covers the bilinear sample, what it does at the fixture's landings, and the engine's behaviour when a landing falls off the living part of the map.

## Bilinear sampling

The framework surfaces live on the 25 by 20 frame: values at nodes, nothing between. To read a surface at an arbitrary (x, y), the engine converts to fractional grid coordinates, column $(x - 1000)/50$ and row $(y - 2000)/50$, takes the four surrounding nodes, and blends them bilinearly: linear interpolation in x along the two bracketing rows, then linear in y between those results. If ANY of the four corner nodes is null, the sample is null. There is no partial blending from three corners; a compromised neighbourhood refuses rather than degrades.

## At the fixture's landings

The vertical wells land at wellheads with friendly coordinates. W1 at (1100, 2100) is exactly on a node, column 2, row 2; the sample IS the node value, no blending at all. W3 at (1900, 2700) is node column 18, row 14. W4 at (2050, 2150) has column 21 exactly but row 3 exactly as well, again a node. That is why the vertical wells' surface reads came out as stored grid values, and why their residuals are exact.

W2's landings are the general case. Its TopA pick lands at x 1568.4455110683407, column 11.368910221366814, with row exactly 4 (y 2200 is a node row). With the row exact, the bilinear blend degenerates to a linear blend along one row: the sample mixes the nodes at columns 11 and 12 with weights 0.631 and 0.369, giving 1532.422275553417. Its other picks blend the same way at columns 13.066 and 13.914. So every W2 surface read is a weighted average of two stored values, and the weights come from the trajectory. Trajectory error does not only move the pick; it moves which nodes get read and by how much.

## Nulls are reported, never dropped

If a landing falls outside the frame, or inside it but over a null node, the surface sample is null and the tie row carries a null residual, REPORTED in the table rather than silently omitted. The design decision matters for QC: a well whose deviated toe walks off the mapped area should show up as rows with null ties, visible and countable, not as a mysteriously shorter table. In the golden set, every one of the twelve landings samples live nodes, so the golden tie table has no null rows; the capstone's numbers all exist. But the machinery's null path is real, and the Expert tier's blocks will make sampling geography matter even more.

## Two sampling subtleties worth naming

First, the clamped surfaces are the ones sampled. Ties are taken against the model as built, including the clamp's edits, not against the raw resampled surfaces. Where the clamp moved BaseB, the tie measures disagreement with the CLAMPED BaseB. Module four turns this from a footnote into the tier's biggest story.

Second, sampling commutes with nothing. The sample of a difference is not the difference of samples on a clamped stack, and a residual computed against a raw surface then "corrected" for the clamp is not the residual the engine reports. There is exactly one defensible order: clamp the stack, sample the clamped surface at the landing, subtract.

## Worked example

Reconstruct W2's TopA surface read by hand from the blend weights. The two nodes on row 4 bracketing the landing hold clamped TopA values of 1531.5 at column 11 and 1534 at column 12. The fractional column is 11.368910221366814, so the weights are 0.631089778633186 on column 11 and 0.368910221366814 on column 12. Blend: $0.631089778633186 \times 1531.5 + 0.368910221366814 \times 1534 = 1532.422275553417$, matching the engine's surface read for that tie row to the last digit. Two stored numbers and one trajectory-derived weight is all a surface read is.

## Exercise

W2's TopB pick lands at column 13.065966496214528, row 4. Write the blend weights for columns 13 and 14, and state which single trajectory quantity those weights are most sensitive to. Then explain why a 10 m error in W2's build azimuth would change not just WHERE the pick lands but WHICH nodes vote on the surface value there.
