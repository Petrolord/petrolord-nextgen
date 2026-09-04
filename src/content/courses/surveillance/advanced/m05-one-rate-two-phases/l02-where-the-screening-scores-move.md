# Where the screening scores move

Swept across the bands the rules actually use, four of the six methods change score on the phase reading alone. Not one datum about the well changes anywhere in that sweep.

{{panel:pd-reading-explorer}}

## The bands a rate can cross

The ESP rules band at 150 and 500 bbl/d. The gas lift and plunger ceilings sit at 200 bbl/d. The progressing cavity pump has a floor at 50 and a ceiling at 2000, the jet pump a floor at 100, and the rod pump a reason threshold at 400. The rod duty index bands at 3 and 6 are rates only once a depth is fixed: at the teaching well's 9200 ft the index reaches 3 at 326.086956522 bbl/d and 6 at 652.173913043 bbl/d.

## The sweep, on the teaching well

Each row is one oil rate, the liquid rate it implies at that well's water cut, and the methods whose score moves between the two readings. Teaching numbers, not a published case.

| Oil, bbl/d | Liquid, bbl/d | Score moves, points |
| --- | --- | --- |
| 120.000000 | 164.598813798 | esp +20 |
| 200.000000 | 274.331356330 | gasLift +10, plunger -45 |
| 260.000000 | 356.630763229 | rodPump -15 |
| 310.000000 | 425.213602312 | rodPump -15 |
| 364.000000 | 499.283068521 | none |
| 400.000000 | 548.662712661 | esp +15 |

## The largest single move

Plunger lift scores 45 on the oil reading at 200.000000 bbl/d and 0 on the liquid reading, because the liquid rate crosses the ceiling the plunger rule is written against. A method at zero is out of consideration entirely. On that same row the recommended set goes from `gasLift esp jetPump` on the oil reading to `gasLift esp` on the liquid one, so the jet pump leaves the shortlist too.

The rod pump moves at three separate rates as the duty index crosses its two bands, losing 15 points at 260.000000 and 310.000000 bbl/d and 25 points at 500.000000 and 650.000000 bbl/d. The ESP is the only method that gains: 20 points at the lowest rate in the sweep, where it joins the recommended set on the liquid reading.

## What a printed zero means

The score is clamped at zero, so a zero means at or below zero and several differently impossible methods print the same one. The score has no unit at all. It ranks methods against each other on one well and it is not a probability of anything.

## The mistake

Reading a change in the order as news about the well. Between any two of those columns nothing about the depth, the fluid, the temperature or the facility moved. What moved is which phase the caller believed the duty was in.

## Exercise

Run the teaching well at an oil rate of 200.000000 bbl/d on both readings and record the plunger score at each.

Then say what the plunger score would have to be for the difference to be harmless, and whether any rate in the sweep gives it.
