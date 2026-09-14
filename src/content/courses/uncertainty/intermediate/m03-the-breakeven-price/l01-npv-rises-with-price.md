# NPV rises with price

The breakeven price is the oil price that puts NPV on a target, and the search for it rests on one property: raise the price and the NPV rises.

{{panel:ec-breakeven-explorer}}

## The case the solver prices

`npvAtPrice` builds a case and hands it to the screening engine. For ISIALA at the stated medians it holds capex at 180 million USD, all of it in year 1, opex at 20 million USD a year flat, and efficiency at 0.91, which scales every year of ISIALA's production profile. Royalty is 15 percent, tax 35 percent and the discount rate 12 percent, discounted mid-year. The price is flat across all twenty years, and it is the only thing that moves.

| oil price, USD/bbl | NPV, million USD |
| --- | --- |
| 20 | -220.0581 |
| 40 | -129.7634 |
| 60 | -47.0648 |
| 70 | -6.5653 |
| 80 | 33.6477 |
| 100 | 113.5406 |
| 150 | 311.7558 |

NPV climbs from -220.0581 at 20 USD/bbl to 311.7558 at 150, and crosses zero between 70 and 80. The solve puts the crossing at 71.6277 USD/bbl.

## Why it can only rise

A dollar more on the price adds revenue in every producing year. Royalty takes 15 percent of that increase off the top. Tax takes 35 percent of what is left, but only in years whose taxable income is positive; in the rest it takes nothing. Neither ever takes the whole increase, and opex and capex do not depend on price at all. So every year's cash flow rises with price, each discount factor is positive, and the sum rises too. Nothing in the case can make the curve turn down.

The steps are not even. Each dollar between 20 and 40 USD/bbl adds more NPV than each dollar between 100 and 150, because at low prices most years pay no tax and keep more of the extra revenue. The slope falls at every price where one more year starts paying tax.

## What it refuses

The curve refuses an economic limit. All twenty years are produced and charged at every price, so late years that lose money are counted in full. It refuses a price deck: one flat price, no escalation. And the case is not ISIALA's screening ledger. The quick form splits capex over two years and charges 2.5 million USD a year fixed plus 13 USD/bbl variable opex. This case puts all capex in year 1 and charges a flat 20 million USD with no variable opex.

## The mistake

The mistake is carrying one engine's number into the other. ISIALA's quick-form NPV at 70 USD/bbl is 81.0464 million USD. The breakeven engine's NPV at the same 70 USD/bbl is -6.5653. Each is right about the case it built. A reader who sees 81.0464 and decides the breakeven must sit well below 70 has compared two different projects: the breakeven case spends all its capex in year 1, charges a flat opex, and sells only 0.91 of the volume.
## Exercise

Read the NPV at 70 and 80 USD/bbl and say where the breakeven sits. Explain, using royalty and tax, why a higher price can never lower this NPV, and why the rise per dollar is larger at low prices. Then list three ways the breakeven engine's case differs from ISIALA's quick-form case, and say why 81.0464 at 70 USD/bbl does not contradict -6.5653.
