# What this engine models

The screening engine behind the Suite's NPV Scenario Builder takes a case laid out year by year, runs it through one royalty and tax ledger, and reports value from the rows. Everything it knows about a field arrives through that case.

## A case in, twenty rows out

The quick form asks for a handful of numbers and `expandQuickInputs` builds the rest. For ISIALA it returns projectLife 20, fiscalType TaxRoyalty, royaltyRate 15, taxRate 35 and discountRate 12, then fills the year by year arrays. Oil volume starts at 1606000.0000 bbl in 2027 and declines. The oil price is 70.0000 in every row. Capex is split 50/50 over the first two years, 90.0000 million USD in 2027 and again in 2028. Fixed opex is 2.5000 in every row, and variable opex is oil volume times 13 USD per bbl divided by 1e6, which is 20.8780 in 2027.

Gas is modelled and empty. Every row carries a gas price of 3.5000 at a gas volume of 0, so the column exists and contributes nothing to revenue.

## What a row carries

Each year becomes one ledger row with the same columns.

| year | grossRevenue | royalty | capex | opex | tax | ncf | cumulativeNCF | govTake |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2027 | 112.4200 | 16.8630 | 90.0000 | 23.3780 | 0.0000 | -17.8210 | -17.8210 | 16.8630 |
| 2029 | 87.0580 | 13.0587 | 0.0000 | 18.6679 | 19.3660 | 35.9654 | -8.6381 | 32.4247 |

`govTake` is money, royalty plus tax, in million USD. In 2027 it equals the royalty alone because no tax was due.

## What it reports

From the twenty rows the engine reads an NPV, an IRR, a payback and a peak exposure, plus totals. For ISIALA those are npv 81.0464, irr 53.7148 percent, payback 3.2746 years, maxExposure -44.6035, totalRevenue 864.1699, totalRoyalty 129.6255, totalTax 136.0307 and totalGovTake 265.6562, all money in million USD.

Discounting is mid-year: year index i is divided by (1 + rate/100)^(i + 0.5). At 12 percent the 2027 factor is 1.058301 and the 2028 factor is 1.185297, so even the first year's cash is discounted by half a year.

Three readers of range sit around the ledger: `runSensitivityAnalysis` scales one input by 0.7 and 1.3, `generateScenarios` builds Low, Base and High, and `runMonteCarlo` samples from a generator seeded by default at 20260829.

## The mistake

The careful mistake is to read the gas price column as gas revenue. A reader scanning the case sees 3.5000 in all twenty rows and assumes the field sells gas. It sells none: gas volume is 0, and the 2027 grossRevenue of 112.4200 is 1606000.0000 bbl times 70.0000 divided by 1e6, oil alone.

The second is to discount at year end by habit. The same ISIALA rows discounted at year end give 76.5817, and the engine reports 81.0464. Both are arithmetic on the same rows, and only one is this engine's convention.

## What it models and nothing more

It models one contractor ledger of cash in and cash out. The quick form always builds TaxRoyalty, always twenty years, always oil only. A production sharing contract exists in the full engine and is never produced by the quick form.

## Exercise

For ISIALA, write the 2027 ledger row and show where grossRevenue, opex and govTake each come from. Then state the 2027 and 2028 discount factors and say what exponent the engine applies to each.
