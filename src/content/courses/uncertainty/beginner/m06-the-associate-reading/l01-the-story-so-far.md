# The story so far

One field, one screening engine and every number this tier owns, read once from the quick inputs to the Low and High scenarios.

## The case before the ledger

ISIALA is entered as quick inputs: 4400 bopd declining 12 percent a year, oil at 70 USD per bbl, capex of 180 million USD, fixed opex of 2.5 million USD a year, variable opex of 13 USD per bbl, royalty 15 percent, tax 35 percent and a discount rate of 12 percent, starting in 2027.

The engine expands them into twenty rows from 2027 to 2046. Year 1 lifts 1606000.0000 bbl and the last year 141552.0984, because each year keeps 0.880000 of the one before and year 20 ends at 0.088140 of year 1. Capex is split 90.0000 in 2027 and 90.0000 in 2028. Variable opex is volume times 13 USD per bbl, printed in million USD: 20.8780 in 2027.
## What the engine refuses

It discounts mid-year, it always builds a 20 year life, and it has no economic limit, so every year is produced and charged. The edge field OKPOMA loses money in 2046, net cash flow -0.5576 on gross revenue of 4.4603 against opex of 4.5718. The quick form is TaxRoyalty only, with no PIA terms, no cost oil, no working interest and no inflation basis.

## The ledger

Gross revenue is volume times price over a million: 112.4200 in 2027. Royalty comes off the top, 16.8630. Capex is expensed in the year it is spent, so taxable income is negative in 2027 and 2028 and tax is 0.0000 there. Tax is positive in 18 of 20 years, and no loss is carried forward. Across the life ISIALA sells 864.1699, pays royalty of 129.6255 and tax of 136.0307, so the state takes 265.6562, and the closing cumulative net cash flow is 208.0250.

## The value

| metric | ISIALA |
| --- | --- |
| npv | 81.0464 |
| irr percent | 53.7148 |
| payback years | 3.2746 |
| maxExposure | -44.6035 |

The NPV divides each row by (1.12)^(i + 0.5), starting at 1.058301. Payback is 3 + 8.6381 / 31.4546. The IRR comes from Newton iteration and ignores the discount rate. Peak exposure is reached at the end of 2028.

## The range

The sensitivity sweep scales one input by 0.7 and 1.3: Oil Price gives -17.3893 and 175.8952, and Production gives 4.1176 and 156.4596, a narrower bar because the variable opex follows the volume. The scenarios move five inputs at once and give Low -57.8151, Base 81.0464 and High 226.0140. Low's payback is null with paybackStatus not-recovered, and High's IRR is null with irrStatus no-sign-change because its net cash flow never changes sign. None of these numbers carries a probability.

## Exercise

Write ISIALA's gross revenue, royalty, opex, tax and net cash flow for 2027, and say why tax is 0.0000. Then give its NPV, IRR, payback and peak exposure, and its Low and High scenario NPVs, and name one refusal of the engine that each of the two scenario numbers inherits.
