# Back to the TMEL

{{panel:lp-sif-builder}}

{{panel:lp-worksheet}}

Verification only means something against a requirement. The Associate tier produced that requirement: a LOPA row gives a mitigated frequency without a function, a tolerable mitigated event likelihood gives the frequency the organisation will accept, and the ratio of the two is the risk reduction the function must supply. This lesson takes the function verified in this module back to that row and asks the only question that matters.

## The row, and what it demands

The ORONI separator overfill row, run at a tolerable mitigated event likelihood of 1e-7 per year.

| quantity | value |
| --- | --- |
| mitigated frequency without a function, per year | 0.000013500000 |
| TMEL, per year | 1e-7 |
| required RRF at a TMEL of 1e-7 | 135.000000 |
| required PFDavg at a TMEL of 1e-7 | 0.007407407407 |
| required SIL | 2 |

The row needs a function whose PFDavg is 0.007407407407 or better. That number is the target, and the band of 2 is only the label it wears.

## The IDU function against it

| quantity | value |
| --- | --- |
| achieved PFDavg | 0.001792971954 |
| required PFDavg | 0.007407407407 |
| mitigated frequency with the function, per year | 0.000000024205 |
| meets the TMEL | true |

The function achieves 0.001792971954 against a requirement of 0.007407407407, so it meets the requirement with room to spare, and the mitigated frequency lands at 0.000000024205 per year, comfortably under the tolerable 1e-7 per year. Both halves of the engine agree, and the agreement is the point: a verification that never returns to its row is an exercise in arithmetic with nothing at stake.

## A band that holds and a requirement that does not

Take a different proposed function on the same row, one whose PFDavg is 0.009. It sits inside the band 2 the row requires, so every label agrees. It still misses, because 0.009 is above the required 0.007407407407, and the mitigated frequency it gives is 0.000000121500 per year against a tolerable 1e-7 per year. The engine reports that the row does not meet its tolerable frequency. The band was never the test.

## The loop is closed by typing a number

A LOPA row on its own reports that its tolerable frequency is not met, because the row has no function in it yet. The loop closes only when a function's PFDavg is typed onto the row, and then the engine recomputes the mitigated frequency and answers the question directly. That is the whole discipline of this tier: the verification half produces a PFDavg, and the determination half says whether it is enough. Reporting a band with no row behind it tells a reader nothing about the hazard, because the same band serves rows whose requirements differ by a factor of ten.

## What a good margin is worth

The IDU function has margin, and margin is what pays for the future. Proof test intervals slip. Rates get revised upward when a plant's own failure history is collected. A function sitting a hair under its requirement on day one is a function that fails it after one missed test. Rates get revised when a plant collects its own failure history. A function at 0.001792971954 against 0.007407407407 has room for an interval to stretch, and the Expert tier is about how far that room goes and what states the engine returns when it runs out.

## Exercise

Divide the required PFDavg of 0.007407407407 by the achieved 0.001792971954 to find the margin this function holds, to six decimals. Then take the failing proposal of 0.009 and compute how much lower its PFDavg would have to be to meet the same row, as a percentage of 0.009.
