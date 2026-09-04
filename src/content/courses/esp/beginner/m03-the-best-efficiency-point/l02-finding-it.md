# Finding it

`bepOf` does not solve for the best efficiency point. It scans for it in 400 steps, and the rate it returns lands on that grid.

{{panel:pd-stage-explorer}}

## A 400 step scan

The search walks the efficiency fit across the published range in 400 equal steps and keeps the largest value it sees. There is no derivative, no bracket and no convergence test. On the published golden vendor curve the range is 1500 to 3500 bbl/d, so the scan spacing is 5.0000 bbl/d and the answer, 2635.0000 bbl/d, sits on that grid rather than at a stationary point of the cubic.

The spacing is the range divided by 400, a property of how wide the published range is and nothing else. A wide range gets a coarse grid and a narrow one a fine grid, whatever the shape of the curve on it.

## Four reference stages, four grids

| Stage | Published range, bbl/d | BEP rate, bbl/d | BEP head, ft |
| --- | --- | --- | --- |
| ref-400-1000 | 500 to 1450 | 1001.1250 | 32.97028329 |
| ref-540-2500 | 1250 to 3500 | 2498.7500 | 28.00979755 |
| ref-562-4000 | 2200 to 5600 | 4002.0000 | 22.99263816 |
| ref-675-7000 | 4000 to 9800 | 7001.5000 | 17.99768547 |

Every one of those stages was generated with its BEP at a round number, 1000, 2500, 4000 and 7000 bbl/d, and not one comes back at it. The heads follow: 32.97028329, 28.00979755, 22.99263816 and 17.99768547 ft against generating heads of 33, 28, 23 and 18 ft. The curve is exactly right and the answer is still off, because the grid does not contain the true peak.

## Say scanned, not found

A rate described as found implies a solve, which implies a residual and a tolerance, and none of that exists here. The honest description is that the BEP was scanned for on a grid of 5.0000 bbl/d, and treating 2635.0000 bbl/d as the peak resolved to a barrel per day claims a resolution the scan does not have.

The scan also breaks ties toward the low side, keeping the first value strictly larger than the best so far, so a flat efficiency peak resolves to its lowest rate.

## The mistake

Sampling the efficiency by hand at a convenient spacing and calling the peak. Sweep the golden vendor curve coarsely and the highest sample is 0.73737500 fraction at 2750 bbl/d, above 0.73657143 at 2500 bbl/d, so the sweep names 2750 bbl/d. The 5.0000 bbl/d scan names 2635.0000 bbl/d at 0.739054805 fraction, above both.

## What it refuses

The scan looks only between the low and high ends of the published range, so the BEP it returns can never lie outside the published data, whatever the fit does there. And with no efficiency fit, `bepOf` returns a rate of NaN and a head of NaN rather than a guess.

## Exercise

Read the BEP rate for the vendor curve and for ref-540-2500, and work out each scan spacing from the published range.

Then sample the vendor efficiency at 2500, 2635 and 2750 bbl/d and say which of the three a coarse hand sweep would have missed.
