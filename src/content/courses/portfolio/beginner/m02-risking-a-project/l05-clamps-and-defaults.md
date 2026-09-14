# Clamps and defaults

When an input is missing or out of range, the portfolio engine does not stop. It clamps the number into range or substitutes a default, returns a risked EMV, and says nothing about having done either.

{{panel:ec-capital-explorer}}

## Five published cases

Each case starts from a project with capex 10, `npv_p50` 80 and `fail_cost` 30, and changes one thing:

| case | input changed | risked EMV |
| --- | --- | --- |
| posAboveOneClamps | pos 1.4 | 80.0000 |
| posBelowZeroClamps | pos -0.2 | -30.0000 |
| negativeFailCostIsZero | fail_cost -30, pos 0.5 | 40.0000 |
| nonNumericPosIsDefault | pos "n/a" | 80.0000 |
| missingNpvIsZero | no npv_p50, fail_cost 8, pos 0.25 | -6.0000 |

## The clamps

`pos` is held between 0 and 1. A `pos` of 1.4 becomes 1, so the project is a certain success worth its `npv_p50`, 80.0000. A `pos` of -0.2 becomes 0, a certain failure worth minus its fail cost, -30.0000.

`fail_cost` is held at 0 or more. A fail cost of -30 becomes 0, so at `pos` 0.5 the risked EMV is the success branch alone, 40.0000, as though failure were free.

## The defaults

A `pos` that is missing or not a number takes the default of 1: "n/a" returns 80.0000, a certain success. A missing `fail_cost` is 0. A missing `npv_p50` is 0, so in `missingNpvIsZero` only the failure branch is left: 0.25 x 0 - (1 - 0.25) x 8 = -6.0000.

## The spread's fallbacks

The success spread has its own order of preference, shown by four published cases on percentiles of 200 and 50:

| case | inputs | success spread |
| --- | --- | --- |
| explicitStddev | npv_p10 200, npv_p90 50, npv_stddev 40 | 40.0000 |
| percentileFallback | npv_p10 200, npv_p90 50 | 58.5229 |
| zeroStddevFallsBack | npv_p10 200, npv_p90 50, npv_stddev 0 | 58.5229 |
| invertedPercentiles | npv_p10 50, npv_p90 200 | 0.0000 |

A positive entered standard deviation wins. Otherwise the engine uses (200 - 50) / 2.5631 = 58.5229. Percentiles entered the wrong way round give a spread of 0.0000, which removes the success range from the risk summary without a word.

## A clamp travels

A clamped or defaulted value is used everywhere the project is used. The optimizer ranks sets with it, and the seeded risk summary draws with it. A `pos` read as 1 means the project succeeds in every one of the 10000 iterations at seed 20260829, so it never contributes a failure to the portfolio's P(loss) or drags down its P90. One mistyped row can therefore make a funded set look both more valuable and safer than it is.

## The mistake

The dangerous defaults are the generous ones. A risky project with its `pos` left blank or mistyped is valued as certain, and a fail cost typed with a minus sign is valued as free. Both push a project into budgets it should not win. The engine gives no hint that a clamp or a default fired, so the risked EMV of a broken row looks exactly like the risked EMV of a careful one. Checking a row means recomputing its line by hand from what was entered. For OKONO's exploration well, 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500 matches the engine, which shows the row was read as typed.

## Exercise

For each of the five published clamp and default cases, state the value the engine actually used for the changed input and the risked EMV it returned. Then explain why a spread of 0.0000 from inverted percentiles is more dangerous than an error message would have been.
