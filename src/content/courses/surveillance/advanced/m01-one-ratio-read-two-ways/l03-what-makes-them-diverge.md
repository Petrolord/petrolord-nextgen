# What makes them diverge

A mean of daily ratios pulls away from a ratio of sums exactly as far as a low-rate day is allowed to speak for the window. Nothing else moves the gap.

{{panel:pd-reading-explorer}}

## Two day shapes on the teaching seam well

OGUTA-2 is invented by this course, not a published well, and it carries two kinds of recent day. An ordinary one books 1008.000000 stb of oil, 312.000000 stb of water and 585.000000 Mscf of gas, a watercut of 0.236363636364 as a fraction and a gas-oil ratio of 580.357142857143 scf/stb. A collapsed one books 82.000000 stb, 231.000000 stb and 141.000000 Mscf, a watercut of 0.738019169329 and a gas-oil ratio of 1719.512195121951 scf/stb.

The oil falls by a factor of 12.292682926829 between those two shapes, the water by 1.350649350649 and the gas by only 4.148936170213, so the gas-oil ratio rises by 2.962851782364. `derivePoint` forms that ratio off the collapsed row alone and `windowMean` inside `detectExceptions` then averages it in at full weight.

## The sweep

A seven-day window of those two shapes only, k of them collapsed.

| Collapsed of 7 | Mean of daily ratios, scf/stb | Volumetric, scf/stb | Ratio |
| --- | --- | --- | --- |
| 0 | 580.357142857143 | 580.357142857143 | 1.000000000000 |
| 1 | 743.093578894973 | 595.595432300163 | 1.247648216551 |
| 2 | 905.830014932803 | 616.256725595696 | 1.469890675931 |
| 3 | 1068.566450970632 | 645.862552594670 | 1.654479651557 |
| 4 | 1231.302887008462 | 691.825775656325 | 1.779787527923 |
| 5 | 1394.039323046292 | 772.877164056059 | 1.803701012112 |
| 6 | 1556.775759084122 | 954.000000000000 | 1.631840418327 |
| 7 | 1719.512195121951 | 1719.512195121951 | 1.000000000000 |

The gap is widest at 5 of 7 and closes at both ends. The watercut difference runs the same shape: 0.000000000000 at 0, 0.171621240597 at 5, 0.000000000000 at 7.

## The row this sweep is not

The sweep is a constructed demonstration, not the OGUTA-2 recent window. That window holds 7 rows, 4327.000000000 stb of oil, 1964.000000000 stb of water and 2792.000000000 Mscf of gas, and reads 1066.663410762250 scf/stb as a mean of daily ratios against 645.250751097758 scf/stb volumetrically, the first 1.653099061020 times the second. The sweep's three-collapsed row reads 1068.566450970632 and 645.862552594670 at a ratio of 1.654479651557. Its ordinary days differ slightly from each other, so the real window sits a little below the sweep, and quoting one for the other swaps a demonstration for a result.

## The mistake

Reasoning that a bigger collapse gives a bigger disagreement. At 7 of 7 the collapse is total and the two readings are identical, because a window of one day shape has nothing to weight. The disagreement is a mixture effect and it peaks where the window is most mixed.

## What the sweep refuses

No row says which reading a caller wanted. Both columns answer different questions, and the ratio column measures a seam rather than an error. `surveillance_cases.ratioSeam` is committed the same way: the golden records the size of the disagreement instead of picking a side, because both readings are in the shipped studio.

## Exercise

Work the sweep in the panel from 0 collapsed to 7 and record the ratio at each step.

Then say where the gap is widest and why the two readings meet again at 7.
