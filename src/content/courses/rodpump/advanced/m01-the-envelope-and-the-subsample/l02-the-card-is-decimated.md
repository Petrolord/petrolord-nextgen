# The card is decimated

The surface card the engine returns is a sample of the march, not the march. The two reported loads are read off the sample.

{{panel:pd-balance-explorer}}

## Three percent of what was computed

`cardSamples` defaults to 180. On ODUMA-4 the march computes 6110 steps in a cycle, the decimation stride comes out at 33, and 186 points are kept. That card holds 3.044190 percent of the steps the march computed. The published taper keeps 181 points from 6516 steps at 9 spm, a stride of 36, and 181 from 11728 steps at 5 spm, a stride of 65.

`prlPeakLb` and `prlMinLb` are the maximum and the minimum of that surviving subsample.

## The reported loads walking toward the real ones

Only `cardSamples` moves down these rows. Same nodes, same time step, same cycles, same well.

| cardSamples | Stride | Reported peak, lb | Reported minimum, lb |
| --- | --- | --- | --- |
| 45 | 135 | 19353.696821 | 2985.594931 |
| 60 | 101 | 19841.734514 | 3128.549847 |
| 90 | 67 | 19452.336562 | 2864.796450 |
| 120 | 50 | 19510.936507 | 2587.167815 |
| 180 | 33 | 19545.877783 | 2625.472706 |
| 240 | 25 | 19545.266440 | 2513.106558 |
| 360 | 16 | 19923.650769 | 2297.257544 |

Marching every step gives 19923.650769 lb and 2104.494479 lb. The trend is that the peak rises and the minimum falls toward those, but neither column is monotone: the 60 point card reports a higher peak than the 90 point card, because a coarse stride can land near an extreme and then miss it again.

## What the default costs on this well

The reported peak is 377.772986 lb low, 1.896103 percent. The reported minimum is 520.978227 lb high, 24.755505 percent of the real minimum, a reported over real ratio of 1.247555046. The load range is 898.751212 lb narrow, 5.043736 percent. The card area is 9148.2107 in-lb low, 1.204024 percent, and the polished rod horsepower moves with it.

A minimum suffers most because a coarse sample is least likely to land in the narrow load transfer where the card is changing fastest. The careful mistake here is to read 2625.472706 lb as a computed minimum and reason about rod compression from it. It is the smallest of 186 chosen points, and the march found 2104.494479 lb.

## The one number that does not move

Plunger stroke reads 98.526653100 in at the default and 98.526653100 in at stride 1, a difference of 0.000e+0 in. It is a peak to trough of the pump node taken over every marched step, and it is never decimated. Everything proportional to it, including the swept and produced rates, is untouched by the sampling.

## What it refuses

`runRodPumpDesign` exposes neither `cardSamples` nor `nodes`. `predictCard` accepts both, with defaults of 180 and 120, plus `maxCycles` 20 and `tol` 0.0001, and the design function forwards none of them. A studio user gets the subsampled pair and has no way to ask for the other one.

## Exercise

Run ODUMA-4 at `cardSamples` of 45, 90 and 360 and record the reported minimum at each.

Then say which of the three is closest to 2104.494479 lb, and why raising the count from 45 to 90 moved the peak the wrong way.
