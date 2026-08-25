# Weights are measured depth

Block 0's porosity is the tier's first graded computation, a weighted mean over three wells, and the weights deserve one Expert-level pass before the number is banked: they are MD interval lengths, with everything the Professional tier said that implies, now feeding a graded value.

## The graded computation

Block 0's zone A control points: W2 (0.2935651232824187, weight 120), W3 (0.277, weight 45), W4 (0.2765, weight 46). Weighted mean:

$$\frac{0.2935651232824187 \times 120 + 0.277 \times 45 + 0.2765 \times 46}{120 + 45 + 46} = \frac{60.41192...}{211} = 0.28631191845445614$$

Graded at 0.001. The numerator's pieces: 35.227814793890244 from W2, 12.465 from W3, 12.719 from W4. W2 contributes 56.9 percent of the total weight and its value sits 0.016 above the other two; both facts shape the answer.

## The weight question, sharpened by the fault

The MD-versus-thickness issue from the Professional tier lands harder here because W2 dominates a GRADED statistic. Reweight W2 by its true vertical transit, 84.8528137423857 m, and the block 0 mean drops to 0.2848622416729035: a shift of 0.00145, which is BEYOND the grading tolerance of 0.001. On the full four-well field mean the same substitution moved the answer by only 0.0005 and nothing was graded; in block 0, after the fault removed W1's counterweight, the choice of weighting convention alone is worth more than the tolerance. Conventions are at their most consequential in small samples, and blocks MAKE small samples.

Arithmetic versus weighted, for completeness: the unweighted mean of the three values is 0.28235504109413956, a full 0.004 below the graded value. Three different defensible averages, spanning 0.282 to 0.286; the model uses one, documents it, and the capstone grades that one. The Expert skill is not picking the "true" mean, it is never letting a report show a mean without its recipe.

## What the weights are about to do next

The weighted mean is not just a summary; it is the CONSTANT method's map value, the mean kriging does NOT use (module five's subject), and the porosity that block 0's pore volume inherits if populated constant. Weight bookkeeping thus propagates into barrels downstream, through the pore volume chain that ReservoirCalc owns. The hand-off is exact: this course delivers per-block bulk and the per-block property maps; the booking is someone else's course, and the weights travel with the delivery.

## The zone B contrast

Zone B's block 0 weights are 60, 30, 30: W2 still heaviest but only 2 to 1, because zone B's MD transits are shorter and more even. Its weighted block 0 mean, 0.2838847694350735 from the fixture's stored table, sits closer to its unweighted one than zone A's does. The comparison isolates the driver cleanly: it is not deviation per se but deviation TIMES a long zone that manufactures dominant weights. A quick scan of weight SHARES per block per zone, before any means are computed, is a two-minute audit that flags every such case in a model.

## Worked example

Recompute the graded mean with full precision and watch where the digits come from, the way an auditor would. $0.2935651232824187 \times 120 = 35.22781479389024$; add $0.277 \times 45 = 12.465$ to get $47.69281479389024$; add $0.2765 \times 46 = 12.719$ to get $60.41181479389024$; divide by 211: $0.28631191845445614$. The graded value's fifteen digits reproduce exactly, and the only non-round input was W2's derived porosity. Any discrepancy in a hand check of this chain is in the checker's rounding, not the engine.

## Exercise

Compute each well's weight share of block 0's zone A mean, then recompute the mean with W3 and W4 deleted entirely. How far does the one-well "mean" move from the graded value, and what does the smallness of that move tell you about who was really setting the number all along?
