# Refusals and defaults

When an input is missing, the portfolio engine substitutes a documented default and returns a risked EMV without a word. When a chance of success is typed but cannot be read as a number from 0 to 1, it stops and names the project. Knowing which inputs fall on which side is part of reading a row.

{{panel:ec-capital-explorer}}

## Published cases the engine accepts

Each case starts from a project with capex 10, `npv_p50` 80 and `fail_cost` 30, and changes one thing:

| case | input changed | risked EMV |
| --- | --- | --- |
| posOneBoundary | pos 1 | 80.0000 |
| nullPosIsDefault | pos null | 80.0000 |
| negativeFailCostIsZero | fail_cost -30, pos 0.5 | 40.0000 |
| missingNpvIsZero | no npv_p50, fail_cost 8, pos 0.25 | -6.0000 |

A `pos` of exactly 1 is accepted as certain success, and a `pos` left out or null is the default 1, so both return the success case, 80.0000. A `pos` typed as a numeric string such as " 0.3 " is read as the number: numericStringPos returns 55.0000.

## The refusals

A `pos` outside 0 to 1, blank or non-numeric is refused with a `PortfolioInputError`, messages verbatim:

| case | pos | message |
| --- | --- | --- |
| posAboveOneRefused | 1.4 | Project "a" has a pos outside 0 to 1 (1.4); pos must be a number from 0 to 1 |
| posBelowZeroRefused | -0.2 | Project "a" has a pos outside 0 to 1 (-0.2); pos must be a number from 0 to 1 |
| nonNumericPosRefused | "n/a" | Project "a" has a pos that is not a number ("n/a"); pos must be a number from 0 to 1 |

A `pos` of 0 is inside the range and accepted: posZero is a certain failure worth minus its fail cost, -30.0000.

## What is still read as zero

`fail_cost` is held at 0 or more. A fail cost of -30 becomes 0, so at `pos` 0.5 the risked EMV is the success branch alone, 40.0000, as though failure were free. A missing `npv_p50` is 0, so in `missingNpvIsZero` only the failure branch is left: 0.25 x 0 - (1 - 0.25) x 8 = -6.0000.

## The spread's fallbacks

The success spread has its own order of preference, shown by four published cases on percentiles of 200 and 50:

| case | inputs | success spread |
| --- | --- | --- |
| explicitStddev | npv_p10 200, npv_p90 50, npv_stddev 40 | 40.0000 |
| percentileFallback | npv_p10 200, npv_p90 50 | 58.5229 |
| zeroStddevFallsBack | npv_p10 200, npv_p90 50, npv_stddev 0 | 58.5229 |
| invertedPercentiles | npv_p10 50, npv_p90 200 | 0.0000 |

A positive entered standard deviation wins. Otherwise the engine uses (200 - 50) / 2.5631 = 58.5229. Percentiles entered the wrong way round give a spread of 0.0000, which removes the success range from the risk summary without a word.

## A default travels

A defaulted value is used everywhere the project is used. The optimizer ranks sets with it, and the seeded risk summary draws with it. A `pos` read as 1 means the project succeeds in every one of the 10000 iterations at seed 20260829, so it never contributes a failure to P(loss). A mistyped `pos` is refused before the optimizer or the risk summary runs.

## The mistake

The dangerous defaults are the generous ones. A risky project with its `pos` left out is valued as certain, and a fail cost typed with a minus sign is valued as free. Both push a project into budgets it should not win, and the engine gives no hint that a default fired. Checking a row means recomputing it by hand: for OKONO's exploration well, 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500 matches the engine.

## Exercise

For each accepted case above, state the value the engine used for the changed input and the risked EMV it returned; for each refused case, quote the message. Then explain why a spread of 0.0000 from inverted percentiles is more dangerous than an error message would have been.
