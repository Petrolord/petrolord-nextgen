# Neither reading is wrong

A mean of daily ratios answers what a typical day of this well looked like. A ratio of sums answers what this period produced. A surveillance tool needs both, and the defect is that it uses both and says so in a source comment.

{{panel:pd-reading-explorer}}

## The two questions, priced

Over the recent window of OGUTA-2, a well this course invented, 7 rows hold 4327.000000000 stb of oil, 1964.000000000 stb of water and 2792.000000000 Mscf of gas. The volumetric gas-oil ratio of that window is 645.250751097758 scf/stb. The mean of the daily ratios is 1066.663410762250 scf/stb, which is 1.653099061020 times the volumetric figure.

Both are true statements about the same seven rows. Only one of them can be multiplied by the days in the window to get back the 2792.000000000 Mscf the well actually made.

## Which function you want

To spot a well that has changed, a mean of daily ratios is the better instrument. It is sensitive to a few bad days precisely because it refuses to let a big day drown them, which is what `detectExceptions` needs.

To book a barrel or a thousand cubic feet, only the volumetric reading is admissible. `computeKpis` forms its field watercut and gas-oil ratio off the mean oil, mean water and mean gas of its window, so on the teaching field over 7 days it reports a watercut of 0.270954648876 as a fraction and a gas-oil ratio of 653.977879649 scf/stb. On the published field over the same window length the golden reports 0.337719298246 and 749.963208241 scf/stb.

## What a golden did with a disagreement

`surveillance_cases.ratioSeam` does not commit one reading as expected and the other as an error. It commits the measured gap, 19.122961825433 per cent on the published gas-oil ratio, and leaves the choice open. Both readings are live in the shipped studio, so resolving it would move numbers a running application prints. Publishing the size of a disagreement instead of quietly picking a side is the right thing to have done.

## The mistake

Deciding one is the correct formula and the other a bug, then rewriting the caller to match. The bug is not a formula. It is that two functions in one file answer different questions under the same field names, `watercut` and `gor`, and neither return says which question it answered.

## What the module refuses to tell you

No flag, no unit suffix and no note distinguishes the two. The engine header states the seam, and a header is not on screen. A reader holding a watercut of 0.451386451920 must know which function produced it before the number means anything.

## Exercise

Read the OGUTA-2 recent window in the panel and record the gas-oil ratio under both readings.

Then say which one you would hand to a production accountant and which to a surveillance engineer, naming the function each comes from.
