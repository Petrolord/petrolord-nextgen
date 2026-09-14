# Payback and the payout year

Two year numbers sit next to each other in the summary, they are usually within a year of one another, and they are answers to different questions.

{{panel:ec-comparison-explorer}}

## Two definitions

`paybackPeriod` is the first year in which cumulative contractor net cash flow is above zero, and it is `null` when that never happens. `rFactorPayoutYear` is the first year in which the R factor is above 1.0. The R factor is cumulative revenue over cumulative cost, so payout is a gross test that ignores the government entirely, while payback is cash the contractor actually kept, after royalty, after the government's profit share and after tax.

The simplest ledger in the sandbox shows both. USA - Gulf of Mexico on the default project runs cumulative contractor net cash flow of -310.0117 million USD in year 1, -140.2337 in year 2 and 8.9905 in year 3, so payback is year 3. Its R factor reads 0.512217, then 0.922481, then 1.254640 over the same three years, so payout is year 3 too.

## When they separate

They separate as soon as the government takes a large early share. On the Designer's defaults the production sharing regime returns payback in year 4 with payout in year 3, and the concession returns 3 and 3. On the test project, Angola - Deepwater PSC pays back in year 3 and reaches payout in year 2, while the other five templates do both in year 2. Price moves them at different speeds too. The nine published price runs of the Designer's production sharing regime on the default project return:

| price, USD per bbl | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| payback year | 9 | 6 | 5 | 4 | 4 | 3 | 3 | 3 | 2 |
| payout year | 5 | 4 | 3 | 3 | 2 | 2 | 2 | 2 | 2 |

Payout runs ahead of payback at eight of those nine prices and the two meet at 120 USD per bbl.

## The mistake

The mistake is to read a `null` as a zero or as a fast result. On the comparison built with capex of 20000 every regime returns `null` in both columns, and a table that renders null as a blank cell beside an NPV of -15354.6816 million USD can be skimmed as though nothing were wrong. The second mistake is to quote payout as capital recovery. It is a gross ratio: on that same comparison it never passes 1.0 while the government still collects between 700.1194 and 1662.7835 million USD.

## What it refuses

Both are whole year numbers with no interpolation, so a project that turns positive early in a year and one that turns positive in its last week report the same year. Neither is discounted: payback is measured on undiscounted cumulative cash while the NPV column beside it is discounted. And `null` means only that it did not happen within the fixed 25 year horizon.

## Exercise

Give the payback and payout years for USA - Gulf of Mexico on the default project and say which ledger column each is read from. Then say what `null` in either column does and does not tell you.
