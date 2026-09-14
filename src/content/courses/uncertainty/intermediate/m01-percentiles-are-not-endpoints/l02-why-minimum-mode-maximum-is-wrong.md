# Why minimum, mode and maximum is wrong

The breakeven engine used to feed a stated 10th percentile, median and 90th percentile straight into a triangular as its minimum, mode and maximum. Read ISIALA's capex belief that way and the distribution stops agreeing with the belief it came from.

{{panel:ec-breakeven-explorer}}

## The same three quantiles, two readings

Take ISIALA's capex belief of 150 / 180 / 220 million USD and ask each triangle for its values at 0.1, 0.5 and 0.9 of the cumulative curve:

| triangle | at 0.1 | at 0.5 | at 0.9 |
| --- | --- | --- | --- |
| fitted, 127.2260 / 168.6738 / 252.3607 | 150.0000 | 180.0000 | 220.0000 |
| endpoints, 150 / 180 / 220 | 164.4914 | 182.5834 | 203.2668 |

The fitted triangle returns the belief. The endpoints triangle returns a different belief: a 10th percentile of 164.4914 where the engineer said 150, and a 90th percentile of 203.2668 where the engineer said 220. It is narrower on both sides than the belief that produced it.

## Where the tails went

Under the endpoints reading nothing can cost less than 150 or more than 220. The belief said a tenth of outcomes sit below 150 and a tenth above 220, so the endpoints reading deletes both tails, a fifth of the distribution, and packs that probability inside the stated range. The fitted triangle puts the tails back. Its capex runs from 127.2260 up to 252.3607, and the stretch beyond 220 is longer than the stretch short of 150, because the belief leans toward high cost.

The median moves too. A skewed triangle's mode is not its median, so a mode of 180 gives a median of 182.5834. The fit works the other way round: to return a median of 180 it needs a mode of 168.6738.

## Why it matters downstream

The run's own insight says the breakeven is most sensitive to Total CAPEX and Annual OPEX. Every capex draw that should have landed above 220 is replaced by one that cannot, so the high-price tail of the breakeven distribution shrinks, and that is the side on which the project fails. Its size is not run here; its direction is certain.

## What the fit still refuses

The fitted triangle has hard ends too. Nothing in it can cost less than 127.2260 or more than 252.3607, and nothing tells you the world agrees. Three percentiles fix a triangle; they say nothing about whether a triangle is the right shape. A belief with a long run of overruns past its 90th percentile is honoured at three points and cut off at the fitted maximum.

## The mistake

The endpoints reading feels conservative, because 150 and 220 look like a wide, careful range. It is the opposite. It claims more certainty than the engineer stated, and the certainty it adds sits on the expensive side, which is exactly where a breakeven study earns its keep. A reviewer who checks only the middle sees 182.5834 against 180, calls the gap small and passes the model. The error lives in the tails, and a median check never reads them.

## Exercise

Give the endpoints triangle's values at 0.1 and 0.9 and the stated beliefs they should have matched. Then give the fitted capex minimum and maximum and say which tail is longer. Finally, explain why a triangle with a mode of 180 does not have a median of 180.
