# The sensitivity sweep

`runSensitivityAnalysis` scales one input at a time by 0.7 and by 1.3, holds everything else at the base case and reports the NPV at each end. On ISIALA the base NPV of 81.0464 million USD becomes eight numbers, and two of the four rows are identical.

{{panel:ec-screening-explorer}}

## The four rows on ISIALA

| input | NPV at 0.7 | base NPV | NPV at 1.3 |
| --- | --- | --- | --- |
| Oil Price | -17.3893 | 81.0464 | 175.8952 |
| CAPEX | 126.2382 | 81.0464 | 32.7547 |
| OPEX | 85.3696 | 81.0464 | 76.7233 |
| Production | 4.1176 | 81.0464 | 156.4596 |

Price is the input that turns the answer: at 0.7 of 70.0000 USD per bbl ISIALA is worth -17.3893, a loss. CAPEX runs the other way, 126.2382 when capex falls to 0.7 and 32.7547 when it rises to 1.3. OPEX barely moves the value, from 85.3696 to 76.7233. Production runs with price and stops short of it, 4.1176 to 156.4596.

## What each row actually scales

The labels are shorter than the operations behind them.

- Oil Price scales `price.oil`.
- CAPEX scales `capex`.
- OPEX scales `opexFixed` ONLY. `opexVariable` is untouched.
- Production scales `production.oil` AND `opexVariable`, so the variable cost follows the barrels.

That last line is why the Production row is the narrower of the two. Both scale the same revenue by the same fraction, and only Production moves the cost the barrels carry, so at 0.7 the field keeps 4.1176 where the price bar pays every barrel's variable opex out of smaller revenue and reaches -17.3893. The published 10 year base case shows the same gap: Oil Price 95.1220 to 850.0945, Production 129.6350 to 815.5814. Before the 2026-09-15 repair the Production bar scaled volume alone and printed the price bar's pair to four decimals.

The OPEX row is small for the matching reason. ISIALA's fixed opex is 2.5 million USD a year against variable opex of 20.8780 in its first year, and only the 2.5 is scaled.

## The mistake

A careful reader takes the Production row as the price of a volume shortfall and stops there. It is the price of a smaller field, operating cost included: the 4.1176 at 0.7 already has part of the variable opex removed with the barrels, so a shortfall that leaves the operating bill where it was is worth less than that. The second mistake is to read the OPEX row as "opex does not matter". Only about a tenth of ISIALA's first year opex is in it.

## What it refuses

The sweep moves one input with the others frozen, so it can never show two things going wrong together, and it carries no correlation between inputs. It uses the same plus and minus 30 percent for every input, whether that input is known to within a few percent or could halve. It attaches no probability to either end: -17.3893 is what happens if price is 0.7 of the base, and the sweep has no view on how likely that is. Royalty, tax, the discount rate and the decline are never swept.

## Exercise

Write ISIALA's NPV at 0.7 and 1.3 for Oil Price and for OPEX. Then explain why the Production row is narrower than the Oil Price row, and name the two things each of those two rows scales.
