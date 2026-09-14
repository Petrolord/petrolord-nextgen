# What this sandbox models

The model takes a small handful of project inputs, manufactures everything else, and returns one table per regime. Knowing which numbers it was given and which it invented is the difference between reading a comparison and believing one.

## What it is given

A project is three production streams with an initial rate and a decline each, three capex buckets, a fixed opex figure and a variable opex rate, a discount rate, and a price deck of dated points. The Designer's default project is oil 10000 bbl/d declining 10 percent a year, gas 50 Mscf/d declining 8 percent, NGL 1500 bbl/d declining 12 percent, capex of drilling 300, facilities 150 and subsea 50 million USD, opex fixed 10 million USD a year and variable 5 USD per boe, a discount rate of 10 percent, and deck points at year 1 of oil 70, gas 3.5 and NGL 30, at year 5 of oil 75, gas 4 and NGL 35, and at year 10 of oil 80, gas 4.5 and NGL 40.

## What it manufactures

From the rates and declines it generates a production profile. From the profile and the deck it computes gross revenue. From the four regime fields it computes royalty, cost recovery, profit oil, tax, contractor net cash flow and government take. Every table in the course is a return value of one of five functions: `calculateCashFlowForRegime`, `calculateNPV`, `calculateIRR`, `deriveInsights` or `runFiscalComparison`.

`PROJECT_LIFE` is 25 rows, and that is the row count returned for every regime and every project, without exception.

## Why the manufacturing matters

Because it makes exactly one thing comparable. Run all six templates on the default project and total revenue reads 2686.9277 million USD on every line. Run them on the published test project and it reads 7001.1938 million USD on every line. The revenue column is a constant, so any difference in the answer is the regime and only the regime.

That is the whole design. On the default project contractor net cash flow ranges from 406.2057 million USD under "Nigeria - PIA (2021)" to 986.7327 million USD under "Generic Royalty/Tax", against that identical 2686.9277 million USD of sales.

## The mistake

The careful reader treats a contractor net cash flow of 986.7327 million USD as a valuation of the asset under those terms. It is not. It is the cash consequence of one manufactured profile and one deck, with no uncertainty around either, and with an internal rate of return of 44.6574 percent that would evaporate if the profile were wrong. The number answers "which instrument moved this", not "what is this worth".

## What it refuses

It refuses to be a second fiscal truth, and says so in its own header. It refuses to take a production forecast, and generates one instead. It refuses to schedule capex, spending every dollar in year 1. And it refuses a horizon: there is no input anywhere that changes 25 years to any other number.

## Exercise

List the inputs a project carries and mark each one as given or manufactured. Then explain why total revenue of 7001.1938 million USD appearing on all six test project lines is a design decision rather than a coincidence.
