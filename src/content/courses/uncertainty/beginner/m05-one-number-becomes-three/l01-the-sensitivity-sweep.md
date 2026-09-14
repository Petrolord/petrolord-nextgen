# The sensitivity sweep

`runSensitivityAnalysis` scales one input at a time by 0.7 and by 1.3, holds everything else at the base case and reports the NPV at each end. On ISIALA the base NPV of 81.0464 million USD becomes eight numbers, and two of the four rows are identical.

{{panel:ec-screening-explorer}}

## The four rows on ISIALA

| input | NPV at 0.7 | base NPV | NPV at 1.3 |
| --- | --- | --- | --- |
| Oil Price | -17.3893 | 81.0464 | 175.8952 |
| CAPEX | 126.2382 | 81.0464 | 32.7547 |
| OPEX | 85.3696 | 81.0464 | 76.7233 |
| Production | -17.3893 | 81.0464 | 175.8952 |

Price is the input that turns the answer: at 0.7 of 70.0000 USD per bbl ISIALA is worth -17.3893, a loss. CAPEX runs the other way, 126.2382 when capex falls to 0.7 and 32.7547 when it rises to 1.3. OPEX barely moves the value, from 85.3696 to 76.7233.

## What each row actually scales

The labels are shorter than the operations behind them.

- Oil Price scales `price.oil`.
- CAPEX scales `capex`.
- OPEX scales `opexFixed` ONLY. `opexVariable` is untouched.
- Production scales `production.oil` ONLY. Variable opex does not follow the volume.

That last line is why Production and Oil Price print the same numbers to four decimals. The expanded case stores variable opex as million USD per year, 20.8780 in 2027, already worked out from the base volume at 13 USD per bbl. Scale the volume and revenue moves exactly as a price change would move it, while the variable cost stays where it was. The published 10 year base case repeats it: Oil Price 95.1220 to 850.0945, Production 95.1220 to 850.0945.

The OPEX row is small for the matching reason. ISIALA's fixed opex is 2.5 million USD a year against variable opex of 20.8780 in its first year, and only the 2.5 is scaled.

## The mistake

A careful reader looks at the Production row and concludes that a 30 percent shortfall in volume costs ISIALA as much as a 30 percent fall in price. It does not, in any real field: fewer barrels means less variable opex, so the true loss from lower volume is smaller than the engine prints, and the true gain from higher volume is also smaller. The row is an engine property, read as physics. The second mistake is to read the OPEX row as "opex does not matter". Only about a tenth of ISIALA's first year opex is in it.

## What it refuses

The sweep moves one input with the others frozen, so it can never show two things going wrong together, and it carries no correlation between inputs. It uses the same plus and minus 30 percent for every input, whether that input is known to within a few percent or could halve. It attaches no probability to either end: -17.3893 is what happens if price is 0.7 of the base, and the sweep has no view on how likely that is. Royalty, tax, the discount rate and the decline are never swept.

## Exercise

Write ISIALA's NPV at 0.7 and 1.3 for Oil Price and for OPEX. Then explain why the Production row matches the Oil Price row exactly, and say which way a real volume shortfall would move the printed -17.3893.
