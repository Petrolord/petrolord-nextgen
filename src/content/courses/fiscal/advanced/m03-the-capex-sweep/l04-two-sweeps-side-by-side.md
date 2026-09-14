# Two sweeps side by side

The comparison returns both sweeps in one object, and they are drawn to look like a matched pair when they are not.

{{panel:ec-comparison-explorer}}

## Different units, different ranges

The price sweep plots a government share in percent at nine oil prices from 40 to 120 USD per bbl. The capex sweep plots contractor NPV in million USD at seven multipliers from 0.8 to 1.4. One is a rate and belongs to the state's side of the ledger, the other is money and belongs to the contractor's. Only the capex chart's values can be added, subtracted or compared as amounts, and only the price chart's values can be compared between projects of different sizes.

## What they agree about

On the default project the two sweeps put the six templates in nearly the same order. Ranked by the price climb, largest first, and by the capex loss, smallest first:

| regime | price climb, percentage points | capex loss, million USD |
| --- | --- | --- |
| Angola - Deepwater PSC | 12.1305 | 84.8591 |
| Nigeria - PIA (2021) | 10.1420 | 97.7613 |
| Ghana - Deepwater | 7.8960 | 88.2631 |
| Brazil - Concession | 6.0391 | 108.6653 |
| Generic Royalty/Tax | -10.1897 | 208.0310 |
| USA - Gulf of Mexico | -17.2498 | 228.7953 |

That agreement is not a coincidence. A regime that takes a rising share of the upside is a regime that absorbs a share of the downside, so the contractor's NPV under it moves less when capital costs rise. The most progressive template gives up the least, 84.8591 million USD, and the two regressive templates give up the most, 208.0310 and 228.7953. The order is not identical, though: Ghana - Deepwater sits third by climb at 7.8960 and second by loss at 88.2631, so the two rankings agree in tendency and not row for row.

## Where they disagree

On ODIDI the pairing loosens. Ghana - Deepwater is the most progressive with a climb of 1.9971 percentage points and also the most resilient, giving up 150.9021 million USD, and the engine's two verdicts name it twice. Angola - Deepwater PSC breaks the pattern: its climb is -14.8244, which is not the worst on that field, while its capex loss of 215.1075 is the largest of the six.

## The mistake

Reading one sweep as a proxy for the other is the error, and reading either as a joint answer is a worse one. The price sweep holds capex at the base case at every price. The capex sweep holds price at the deck at every multiplier. Neither chart contains the case a project team actually fears, an overrun arriving at a low price, and the two curves cannot be combined into it by eye. The Angola template on the default project at three times capex reads a government share of 0.0000 at 40 USD per bbl and 2223.0766 at 50, and nothing in either sweep as drawn would have suggested that.

## What they refuse

There is no joint sweep and no way to ask for one, no way to change either range, and no third sweep on opex or the discount rate. Both sweeps also report one number per regime per point and discard the rest of the ledger they computed, so neither chart can tell you that a point it plotted came from a project that never paid back.

## Exercise

Give the unit and the number of points for each sweep. Then name the regime that wins both verdicts on ODIDI, and state the case neither sweep covers.
