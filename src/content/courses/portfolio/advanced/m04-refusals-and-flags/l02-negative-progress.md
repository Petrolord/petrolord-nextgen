# Negative progress

The AFE engine refuses a cost item with negative progress, and it refuses an as-of date that is not a real calendar date. Both throw an `AfeInputError` and return no metrics at all.

{{panel:ec-governance-explorer}}

## Three refusals, three ways to name a line

| line named by | engine message |
| --- | --- |
| its code | Cost item "CMP-02" has negative progress (-20 percent). Progress runs from 0 to 100 percent. |
| its description | Cost item "Completion" has negative progress (-0.5 percent). Progress runs from 0 to 100 percent. |
| its index, progress given as a string | Cost item "1" has negative progress (-12.5 percent). Progress runs from 0 to 100 percent. |

The message names the line by its code, its description or its index, whichever the case supplied. Progress typed as the string "-12.5" is refused like any number, and -0.5 as firmly as -20.

## Why progress below zero is refused

Earned value is the budget times progress, summed over the lines. On OFON-1, DRL-01 earns 14200000 at 72.0000 percent, which is 10224000, and the AFE earns 15231500 against actuals of 15090000, a CPI of 1.009377. A negative progress would subtract earned value. The line would count as work undone and pull CPI and SPI down for the whole AFE, with nothing in either ratio to say why. Clamping it to zero would hide a typing error as a line not yet begun.

## What it does not refuse

The message says progress runs from 0 to 100 percent, and only the lower bound is enforced. A published case with progress beyond 100 percent is accepted and returns earned value 150.0000 against actuals of 90.0000, a CPI of 1.666667 and an SPI of 1.500000. That CPI reads as a line running far ahead on cost, when the line has earned more than its budget can hold. Read any CPI above 1 beside the progress column before believing it.

## The as-of date refused

| published case | engine message |
| --- | --- |
| not a date | asOf is not a valid date |
| month 13 | asOf is not a valid date |
| 30 February | asOf is not a valid date |
| an AFE with no dates | asOf is not a valid date |

A lenient date parser rolls 30 February forward into March and reports on a day nobody chose. The engine refuses it, and it refuses a bad as-of date even on an AFE with no window, where the date would move nothing: with no dates, time progress falls back to 1.000000. Before EC5-0 the Suite's AFE wizard asked for no dates at all.

## The mistake

The mistake is entering a correction as negative progress. A line reported at 55.0000 percent that turns out to be less advanced is fixed by typing its true progress, never by typing the difference. The quieter mistake runs the other way. CSG-02 is at 100.0000 percent with actuals of 4300000 against a budget of 3900000, and nudging its progress past 100 to improve the CPI earns value nobody budgeted, with no refusal to stop it.

## Exercise

Quote the negative progress message for the line named "Completion" exactly, and say what the engine returns when it fires. Then give the earned value, actuals, CPI and SPI of the published case with progress beyond 100 percent, and explain why 30 February is refused on an AFE whose dates would not use it.
