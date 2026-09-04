# Closure and what it proves

An allocated day closes exactly. That is the property an allocation is defended with, and it is an algebraic identity that would hold just as exactly if every test on the field were wrong.

{{panel:pd-exception-explorer}}

## Why the day closes

Every share `computeAllocation` writes is the same factor times a theoretical, so the shares on a date sum to the factor times the sum of the theoreticals, which is the metered total the factor was built from. The published golden prints the residual on each day and it is zero.

| Published day | Measured oil, stb | Theoretical oil, stb | Allocated oil, stb | Closure residual |
| --- | --- | --- | --- | --- |
| 2025-01-25 | 1700.000000000 | 1733.333333333 | 1700.000000000 | 0.000000000000 |
| 2025-01-26 | 1696.000000000 | 1840.000000000 | 1696.000000000 | 0.000000000000 |
| 2025-02-05 | 1656.000000000 | 1620.000000000 | 1656.000000000 | 0.000000000000 |
| 2025-02-17 | 1608.000000000 | 1620.000000000 | 1608.000000000 | 0.000000000000 |

All of those are calendar volumes over one date. On the teaching field OGUTA, invented for this course and neither real nor published, the same identity carries the whole run: measured oil 58426.784897363 stb, allocated oil 58426.784897363 stb, closure residual 0.000000000 stb.

## What the identity does not say

Nothing about whether a well made what it was credited with. On 2024-11-20 OGUTA-2 is credited with 1233.319797595 stb of allocated oil against its own ledger row of 1014.000000000 stb, and that day closes to zero all the same.

## Where the grand total stops closing

A date whose theoretical is zero has no factor, is not allocated at all, and its metered volume simply is not in the grand allocated. The published noBasis case is two days: 830.000000000 stb of measured oil against 520.000000000 stb allocated, with 310.000000000 stb in no well and in no total. Its second day, 2025-03-02, carries null factors for oil, water and gas, a theoretical oil of 0.000000000 and an allocated oil of 0.000000000. The diagnostics are `{"no_basis":3}`.

The published allocationAged120 run does the same at scale. Measured oil is 39696.000000000 stb, allocated oil is 36372.000000000 stb, allocated water is 10673.000000000 stb against 11604.000000000 stb measured, and its diagnostics are `{"factor_out_of_band":51,"no_basis":6,"no_test_in_force":48}`.

## The mistake

Treating a closed field as a checked field. Closure is a consequence of multiplying by one factor and is not evidence that the tests, the uptimes or the meter are right. The harder version is treating grand closure as automatic: it holds only on days that had a basis, and the barrels lost on the days that did not are silent.

## What it refuses

There is no closure figure in the return. The object keys are days, diagnosticCounts, grand, settings and wells, so a consumer that wants to know whether the field closed has to subtract the grand allocated from the grand measured itself, and nothing prompts it to.

## Exercise

Take the published noBasis case and write its measured oil, its allocated oil and the difference between them.

Then say which of the two return keys you would have had to read to notice that difference existed.
