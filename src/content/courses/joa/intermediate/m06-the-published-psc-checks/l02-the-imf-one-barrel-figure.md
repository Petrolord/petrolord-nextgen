# The IMF one-barrel figure

{{panel:joa-recovery-calculator}}

The second published check is a single barrel. The IMF's Fiscal Analysis of Resource Industries methodology, Luca and Mesa Puyo, FARI TNM/16/01 (February 2016, read on 2026-09-26 from the Wayback capture of 12 October 2025, because the direct download answered 403), draws one USD100 barrel under a production sharing contract in its Figure 5 and shows where each dollar goes.

## What the figure says

The government's side of the barrel is profit oil and income tax:

> "In the PSC system, the government revenue consists of USD30 in profit oil and USD6 in income tax." (IMF FARI TNM/16/01 (February 2016), Figure 5)

The figure also states the tax base it uses, and the assumption behind it:

> "In the PSC diagram below, the base for CIT is equal to cost petroleum plus profit petroleum minus allowable tax deduction." (IMF FARI TNM/16/01 (February 2016), Figure 5)

> "Normal tax deductions in the tax/royalty regime are assumed to be equal to the cost recovery in the PSC." (IMF FARI TNM/16/01 (February 2016), Figure 5)

With the deductions equal to cost petroleum, the base for the tax is profit petroleum alone. That is why the engine, which taxes the contractor's profit oil, lands on the figure's 6.

## The engine beside the figure

The golden input states the figure's terms: one barrel at 100.000000, a limit of 50.000000 percent of revenue after royalty, a contractor profit share of 40.000000 percent and tax 30.000000 percent.

| line | printed in the figure | engine |
| --- | --- | --- |
| cost recovered | 50 | 50.000000 |
| government profit oil | 30 | 30.000000 |
| contractor profit oil | 20 | 20.000000 |
| income tax | 6 | 6.000000 |
| government | 36 | 36.000000 |

Every printed figure is reproduced. The figure's government revenue is profit oil and tax alone, with no royalty, so the limit's base makes no difference here: revenue after royalty is the whole barrel.

## Two checks, two bases

The World Bank example states its limit on gross, and the IMF figure on revenue after royalty. The engine runs both with the same call because the base is a stated input on each. The engine does not choose between the two texts: each golden input states its text's base, and both agree with their text. A limit percentage quoted without its base cannot be checked against either.

## Exercise

Work in the course's own recovery calculator, view "PSC cost recovery", starting from "IMF FARI Figure 5, one barrel".

1. Read the controls: royalty 0, a limit of 50 on revenue after royalty, a contractor share of 40 and tax of 30.
2. Check the revenue after royalty, capex, cost recovered, government profit oil, contractor profit oil, tax and government take against the engine column above.
3. Switch "Cost oil limit base (stated)" to gross. Say why nothing changes on this barrel.
