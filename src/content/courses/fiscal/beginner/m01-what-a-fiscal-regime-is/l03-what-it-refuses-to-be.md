# What it refuses to be

Four refusals are written into the engine's own header, and a fifth list of omissions sits underneath them. Each one is a place where a reader who expects normal economics will misread a normal looking number.

## It is not a fiscal truth

The module's single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine. This model exists to compare the shape of regimes against each other. A line reading total government cash flow 1339.2784 million USD under "Nigeria - PIA (2021)" on the Designer's default project is a shape, not an assessment.

## It does not take a forecast

It generates one, from an initial rate and a decline, over a fixed horizon of 25 years. The consequence shows in the last row: on the default project year 25 still produces 0.291148 million bbl of oil, still costs 11.5851 million USD of opex, and still returns 6.4592 million USD of contractor net cash flow under "USA - Gulf of Mexico". Nothing shut the field in, because nothing in the model can.

## It does not schedule capex

Every dollar is spent in year 1. On the default project that is 500.0000 million USD in year 1 and 0.0000 million USD in each of years 2 through 25. On the teaching field ODIDI it is 420.0000 million USD in year 1 and nothing after. There is no drilling programme, no phasing, no first oil delay.

## It models none of these

No abandonment, no depreciation, no loss carryforward against tax, no ring fencing and no valuation date. A row is a year, and the year is its own discount exponent.

## What the omissions cost you

Take `never_recovers_huge_capex`, the published case that puts capex of 20000 on the test project. It reports total contractor net cash flow of -15724.0151 million USD, a closing unrecovered cost pool of 15724.0151 million USD, payback year null and payout year null. Total tax is 0.0000 million USD and total profit oil is 0.0000 million USD, so government cash flow of 875.1492 million USD is pure royalty on total revenue of 7001.1938 million USD.

A real contractor facing that would abandon. This one produces for 25 years and hands the treasury 875.1492 million USD while losing 15724.0151 million USD, because no economic limit exists to stop it and no abandonment cost exists to be paid at the end.

## The mistake

The careful reader sees payback year null and concludes the project was terminated. It was not. Null means the cumulative contractor net cash flow was never above zero in any of the 25 rows the engine returned. Every one of those rows was still computed, still taxed and still counted into the totals. Reading null as a stop is how a reader ends up quoting a 25 year royalty stream as if it were a five year one.

## Exercise

Name the four refusals in the engine header. Then say what the model would have to add before a contractor net cash flow of -15724.0151 million USD could be called a decision rather than an arithmetic result.
