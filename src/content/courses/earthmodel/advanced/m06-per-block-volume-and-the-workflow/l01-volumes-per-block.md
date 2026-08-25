# Volumes per block

The tier's last computation splits the Associate anchor across the fault: zone A's 45,000,000 m3 becomes 31,001,250 in block 0 and 13,998,749.999999998 in block 1, and the split closes EXACTLY. This lesson derives the split and the mechanism of its exactness, because the closure is the tier's quality control and the capstone grades the block 1 figure.

{{panel:em-population-explorer}}

## The computation

Zone volumes per block are one pass over the frame: for each live thickness node, its bulk contribution, thickness times the 2500 m2 cell, is added into the register of ITS BLOCK LABEL, and simultaneously into the total register. Zone A has all 500 nodes live, so block 0 collects 326 nodes' worth, block 1 collects 174, and the total collects all 500.

Results: block 0 bulk 31,001,250 m3, an exact integer; block 1 bulk 13,998,749.999999998 m3; total 45,000,000 m3.

## The closure, and why it is exact

Check: $31{,}001{,}250 + 13{,}998{,}749.999999998 = 45{,}000{,}000.0$, and the engine's own subtraction of blocks-sum minus total returns literally 0. Cells close too: 326 plus 174 equals 500.

The exactness is architectural, not lucky. Because each node's contribution is added into its block register AND the total register in the same pass, from the same product of the same floats, the blocks' sum and the total are the same additions grouped differently; with these magnitudes the grouping happens to reproduce bit-for-bit, and the audit reads zero. The partition (module two's closure key) guarantees no node is skipped or doubled. So a nonzero closure can only mean structural trouble, labels misaligned with the grid, a node double-labelled, grids of different lengths, never float noise of the healthy kind. The ReservoirCalc ladder teaches the same architecture one course over, with the refinement that float-level closure degrades slightly in its longer property chains; on bulk volume here, closure is exactly zero, and the tile in the panel prints it.

## The trailing .999999998

The graded block 1 figure ends in .999999998, and the digits are worth respecting rather than rounding away. Each node contribution is thickness times 2500; zone A thicknesses are stored as resample-derived floats, and 174 additions of such products land infinitesimally shy of the round 13.99875 million a hand calculation produces from the mean thickness route. Both routes are right; the engine's route is the one pinned and graded, with a tolerance of 0.01 million m3 that accepts the hand value too. The Expert habit: when a stored value differs from your hand value in the ninth significant figure, identify WHICH route produced each before deciding anything is wrong.

## Volume follows labels, not geology

The split is bookkeeping over the SAME thickness grid; no rock moved. Zone A's thickness field is unaffected by the fault polygon, and the block volumes would change only if the LABELS changed. That is why module two's census sensitivities translate directly: move the southern boundary one cell west and about 0.8 million m3 of zone A transfers between registers while the field total stands still. Per-block volume is a projection of the census onto thickness, and every uncertainty in the polygon is an uncertainty in the SPLIT, never in the total.

Zone B tells the same story with a sharper profile: block 0 carries 3,110,000.0000000023 m3, block 1 carries 9,689,999.999999998, total 12,800,000. Block 1 holds 76 percent of zone B's volume on 35 percent of the nodes, because the clamp's pinch-out, where zone B is zero, lies in the east, which is block 0. The fault split EXPOSES spatial structure the field total averaged away, which is the constructive reason to want per-block numbers at all.

## Worked example

Reproduce block 1's bulk from the mean-thickness route. Block 1's zone A mean thickness: its bulk over its area, $13{,}998{,}750 / (174 \times 2500) = 32.181$ m, against block 0's $31{,}001{,}250 / 815{,}000 = 38.038$ m. The blocks genuinely differ in mean thickness by nearly 6 m; the field-wide 36 m mean is their area-weighted blend: $(326 \times 38.038 + 174 \times 32.181)/500 = 36.0$. One more instance of the ladder's oldest lesson: a mean without its denominator, or its block, hides the structure that matters.

## Exercise

Using only numbers in this lesson, compute what fraction of zone A's volume is in block 1 versus what fraction of the frame's nodes are in block 1. The two fractions disagree; state the direction of the gap, and use the two block mean thicknesses to settle which side of the fault zone A is thicker on, whatever your memory of the Associate tier's maps says.
