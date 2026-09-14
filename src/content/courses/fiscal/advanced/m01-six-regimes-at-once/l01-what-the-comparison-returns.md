# What the comparison returns

One call returns four objects, and the table everybody reads is only the first of them.

{{panel:ec-comparison-explorer}}

## Four objects from one call

`runFiscalComparison` takes a project and a list of regimes and returns `summary`, one row per regime; `annualCashFlows`, the whole ledger for every regime; `sensitivityData`, the price and capex sweeps; and `insights`, the derived verdicts. Every ledger inside `annualCashFlows` is 25 rows long, because PROJECT_LIFE is 25 and no input changes it. The list of regimes is the only thing that grows the result: one project goes in, and each regime comes back with a complete life of its own.

On the Designer's two default regimes and its default project the summary is two rows:

| rank | regime | npv | irr | paybackPeriod | rFactorPayoutYear | govTake | effectiveTaxRate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Concessionary (Royalty/Tax) | 274.3670 | 37.4526 | 3 | 3 | 1040.6750 | 46.3452 |
| 2 | Nigerian PIA (PSC) | 173.4150 | 26.2153 | 4 | 3 | 1247.0980 | 55.5380 |

Money is millions of USD, so the Concessionary regime hands the government 1040.6750 million USD over the life while the production sharing contract hands it 1247.0980 million USD. Two further columns, `royaltyRate` and `contractorSplit`, are published by the oracle rather than returned by the engine, so the tier a row selected can be read without deriving it.

## The column that never moves

Total revenue is the same for every regime on a given project. All six templates on the default project return 2686.9277 million USD of gross revenue, and all six on the test project return 7001.1938 million USD. The regime touches neither production nor price, so revenue is a property of the field alone. Everything downstream moves a great deal: on that identical 2686.9277, lifetime contractor net cash flow is 406.2057 million USD under Nigeria - PIA (2021) and 986.7327 million USD under Generic Royalty/Tax.

A name is not a regime either. The comparison of the two Suite test regimes returns "Flat" with an NPV of 1262.3470 million USD, government take of 1881.7626 and an effective tax rate of 36.5310, which is the same row Generic Royalty/Tax returns on the test project, because the four instruments are identical.

## The mistake

The comparison looks like six scenarios and is not. It is one field, one production profile and one price deck, divided six ways. A reader who reports that a regime "adds value" has misread the arithmetic: nothing was added, and the difference between 758.7514 million USD of government take under Generic Royalty/Tax and 1339.2784 under Nigeria - PIA (2021) came out of the contractor's column on the same 2686.9277 of sales.

## What it refuses

It refuses to be a second fiscal truth. The single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine, and this model exists to compare the shape of regimes. It refuses a production forecast and generates one instead, from an initial rate and a decline over a fixed horizon of 25 years. It refuses a capex schedule: every dollar of capex is spent in year 1. And it models no abandonment, no depreciation, no loss carryforward against tax, no ring fence and no valuation date.

## Exercise

Name the four objects the call returns and say which one the six-row table comes from. Then state the gross revenue every template returns on the default project, and explain why 406.2057 and 986.7327 can both sit under it.
