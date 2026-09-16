# Two sweeps side by side

The comparison returns both sweeps in one object, and they are drawn to look like a matched pair when they are not.

{{panel:ec-comparison-explorer}}

## Different units, different ranges

The price sweep plots government take, undiscounted, in percent at nine oil prices from 40 to 120 USD per bbl. The capex sweep plots contractor NPV in million USD at eight multipliers from 0.8 to 1.5. One is a rate and belongs to the state's side of the ledger, the other is money and belongs to the contractor's. Only the capex chart's values can be added, subtracted or compared as amounts, and only the price chart's values can be compared between projects of different sizes.

## What they agree about

On the default project the two sweeps put the six templates in nearly the same order. Ranked by the price climb, largest first, and by the capex loss, smallest first:

| regime | price climb, percentage points | capex loss, million USD |
| --- | --- | --- |
| Brazil - Concession | 20.5076 | 100.7185 |
| Angola - Deepwater PSC | 19.6873 | 88.6123 |
| Nigeria - PIA (2021) | 10.1420 | 118.3685 |
| Ghana - Deepwater | 7.8960 | 109.8425 |
| Generic Royalty/Tax | -10.1897 | 244.0782 |
| USA - Gulf of Mexico | -17.2498 | 267.7301 |

That agreement is not a coincidence. A regime that takes a rising share of the upside is a regime that absorbs a share of the downside, so the contractor's NPV under it moves less when capital costs rise. The two steepest climbers give up the least, 100.7185 and 88.6123 million USD, and the two regressive templates give up the most, 244.0782 and 267.7301. The order is not identical, though: Ghana - Deepwater sits fourth by climb at 7.8960 and third by loss at 109.8425, so the two rankings agree in tendency and not row for row.

## Where they disagree

On ODIDI the pairing comes apart. Brazil - Concession is the most progressive with a climb of 7.4752 percentage points while the most resilient is Ghana - Deepwater, giving up 181.1922 million USD, so the two verdicts name two different regimes. Angola - Deepwater PSC breaks the pattern from the other end: its climb is -8.3874, which is not the worst on that field, while its capex loss of 252.6075 is the largest of the six.

## The mistake

Reading one sweep as a proxy for the other is the error, and reading either as a joint answer is a worse one. The price sweep holds capex at the base case at every price. The capex sweep holds price at the deck at every multiplier. Neither chart contains the case a project team actually fears, an overrun arriving at a low price, and the two curves cannot be combined into it by eye. The Angola template on the default project at three times capex returns no value at 40 USD per bbl, where the point is null and flagged undefined, and a government take of 2223.0766, flagged exceeds, at 50, and nothing in either sweep as drawn would have suggested that.

## What they refuse

There is no joint sweep and no way to ask for one, no way to change either range, and no third sweep on opex or the discount rate. Both sweeps also report one number per regime per point and discard the rest of the ledger they computed, so neither chart can tell you that a point it plotted came from a project that never paid back.

## Exercise

Give the unit and the number of points for each sweep. Then name the regime each sweep verdict picks on ODIDI, and state the case neither sweep covers.
