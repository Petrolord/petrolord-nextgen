# A tie ranked by noise

The capex verdict picks its winner with a strict less-than inside a reduce. Such a comparison keeps the first of two equals, so an exact tie goes to list order and a near tie to rounding error.

{{panel:ec-comparison-explorer}}

## Where every quantity is the same

`cmp_never_recovers` runs the six templates on a project with capex 20000, being 10000.0000 drilling plus 10000.0000 facilities plus 0.0000 subsea million USD, against the TEST project's production, 30000 bbl/d of oil declining 12 percent with no gas and no NGL. Nothing pays back and every IRR is 0.0000. Read the capex sweep:

| regime | npv | capex sweep first point | capex sweep last point | loss (derived) |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | -15768.8129 | -12132.449284 | -23041.540193 | 10909.090909 |
| Ghana - Deepwater | -15361.7226 | -11725.358969 | -22634.449878 | 10909.090909 |
| Brazil - Concession | -15354.6816 | -11718.317943 | -22627.408852 | 10909.090909 |
| USA - Gulf of Mexico | -15701.7744 | -12065.410782 | -22974.501691 | 10909.090909 |
| Angola - Deepwater PSC | -15900.1132 | -12263.749547 | -23172.840456 | 10909.090909 |
| Generic Royalty/Tax | -15453.8510 | -11817.487326 | -22726.578235 | 10909.090909 |

Six regimes, six different NPVs, and one loss figure repeated to every printed digit.

## What the sentence says anyway

The capex verdict reads: over the swept capex range, "USA - Gulf of Mexico" gives up the least contractor NPV at 10909.1 million USD and "Nigeria - PIA (2021)" the most at 10909.1 million USD. The least and the most print the same number. The price verdict no longer joins in: every point is null and flagged undefined, so it ranks nothing and says no regime is economic from 40 to 120 USD per bbl.

The golden records the engine naming USA - Gulf of Mexico the most resilient here and the oracle's arithmetic naming Brazil - Concession. Neither is a result. The tie is exact by construction: cost recovered, profit oil and tax are unchanged across the sweep, so only the year 1 capex line moves and every regime gives up 12000 million USD discounted one year. The golden pins the ranked quantities and the gate treats a tie as a tie.

## The exact tie, on the synthetic case

`insights_ties` shows the other half. Its payback verdict reads that "Alpha" pays back in year 4, against year 4 for "Beta", and its government verdict that "Alpha" collects the most, 900.0 million USD against 900.0 million USD for "Beta". The strict comparison kept the first of the tied pair.

## Rounding, a separate trap

`insights_rounding` pins the printing. Values render at a fixed one decimal place, and 0.25 is exact in binary so JavaScript rounds the tie up to 0.3 where Python would give 0.2; 2.45 is stored just above its tie so it prints 2.5, and 0.35 just below so it prints 0.3. A reader can lose the last digit to the renderer before any ranking happens.

## The reading rule

A verdict naming a winner is only a verdict when the quantities it ranks are separated by more than the precision they are printed to. The insight sentences round to one decimal place. Two regimes whose losses print the same to one decimal have not been ranked, whatever the sentence says.

Real separation looks different: on the default project the swept capex losses run from 84.8591 for Angola - Deepwater PSC to 228.7953 for USA - Gulf of Mexico.

## The mistake

The careful mistake is trusting a verdict because it is specific. "USA - Gulf of Mexico" is a specific name attached to a quantity that six regimes share. Check the ranked column before quoting the sentence.

## Exercise

From the `cmp_never_recovers` capex sweep, state the loss for each of the six regimes and how many distinct values there are. Then say why the price verdict names no regime there.
