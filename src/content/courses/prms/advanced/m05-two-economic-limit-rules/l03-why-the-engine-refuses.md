# Why the engine refuses

{{panel:prms-aggregation-calculator}}

On the late-dip profile of the previous lesson, the trailing trim gives 2030 and the cumulative peak gives 2027. The engine answers with neither: it refuses the call and names both years.

## The engine's words

The message, verbatim:

> forecasts.low must be a forecast on which the canonical economic limit (cashflow.ts: trailing years whose revenue less royalty less opex is negative are cut, years with capital kept) and the PRMS 3.1.3.1 limit (the year the cumulative net cash flow before tax and ADR peaks) agree; they give 2030 and 2027; got "a low forecast from 2027 to 2030"

The message names the field it refuses, states both rules and prints the two years. The engine returns no figures for the call, because any figure would rest on one rule or the other.

## Why neither answer

The trailing trim would count the barrels of 2028 to 2030 in Reserves; the cumulative peak would drop them. Either way a Reserves figure would move by a choice the caller did not make.

The canonical rule is shared: every economics course in the academy, and the Suite's economics app, takes its economic limit from cashflow.ts. Changing that function to the PRMS rule would move figures those courses teach, so that change is a separate decision for the platform. The engine keeps both rules visible by refusing where they part.

## The reading the engine states

The engine's limit is a reading stated in its basis:

> computeCashFlow of engines/economics/cashflow.ts with apply_economic_limit (JV regime at 100%, the stated royalty and tax), checked against PRMS 3.1.3.1

The alternative it names places the limit at the PRMS cumulative peak. Neither is keyed as the law in this course, and no graded figure rests on a profile where they disagree.

## What the caller can do

The refusal names both years so the caller can see which barrels are in question. Two ways forward:

1. State a forecast on which the two agree. A technical forecast that ends where the project stops paying removes the late years that cause the dip.
2. Split the project at the dip, and forecast and test the late years as a project of their own.

Either way the choice sits in the inputs, where a reader of the report can see it.

## The same check on every case

The check runs on every case. The golden case states the same dipping profile for all three; the low case is checked first, so the message names `forecasts.low`. Once the low forecast passes, a dip left on another forecast is refused under its own field name.

## Beside the other refusals

Most refusals name an input that is missing or malformed. This one names a well-formed input on which two rules give two answers: every figure the engine returns rests on a rule it can name.

## Exercise

Open the aggregation calculator on the view "The economic limit: the two rules" and start from "The two economic-limit rules disagree". Find the two years in the refusal. In the box, change the 2030 row of the low forecast to 0 barrels and say which year moved, and why. Restore it, change the 2028 row of the low forecast to 25000 barrels, and explain which field the refusal names now.
