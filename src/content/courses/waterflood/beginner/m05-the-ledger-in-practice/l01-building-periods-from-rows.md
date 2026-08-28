# Building periods from rows

The voidage equation needs field periods: one row per month with the field's total oil, water, gas, injection. Real data arrives as well rows. This lesson is about the aggregation between them, which is trivial arithmetic surrounded by non-trivial decisions.

## The aggregation

For each row, find its month key, and add its volumes into that month's bucket. That is the whole algorithm. The Ekene record has 216 per-well monthly rows, six wells over 36 months, which aggregate into 36 field periods.

The aggregation is verifiably lossless. Running it over the per-well rows and comparing against the committed field period table gives a maximum relative difference of $3.9364202640579826 \times 10^{-16}$ across every field of every period, which is the accumulated rounding of summing six doubles and nothing more.

## Daily rows aggregate the same way

A month's period is identical whether its volumes arrive as one monthly row or thirty daily ones, because addition is associative. That is a deliberate property: an operator who upgrades from monthly to daily reporting should not see a discontinuity in their VRR history at the changeover.

It also means the aggregation cannot tell you anything about what happened WITHIN a month. A well that produced at 100 barrels a day for fifteen days and then was shut in for fifteen looks identical to one that produced at 50 barrels a day throughout. If your question is about the timing of an event inside a month, the monthly ledger cannot answer it and no amount of care with the aggregation will change that.

## Well classification comes first

Before aggregating, the engine decides which wells are injectors and which are producers, and the rule is that **injection wins**:

> A well that ever injects, water or gas, is an injector, even if it also produced.

For Ekene this gives injectors [Ekene-2, Ekene-4] and producers [Ekene-1, Ekene-3, Ekene-5, Ekene-6], which matches the field history exactly.

The "ever" is doing real work. Ekene-2 and Ekene-4 were drilled as producers and converted. If classification were done per period, they would be producers before 2023 and injectors after, and every report that grouped by well type would have a discontinuity at the conversion date. Classifying over the whole history gives one stable answer per well.

The cost is that a genuinely converted well, one that produced oil for years and then became an injector, has its production history filed under "injector" forever. On a field with many conversions that is a real annoyance, and the honest response is to know the rule rather than to fight it.

## Rows that do not aggregate

Three kinds of row do not make it into a period.

**Unparseable dates.** A row whose date does not start with a four-digit year and a two-digit month returns a null month key and is ignored. Not defaulted, not assigned to the nearest month: ignored.

**Blank wells.** A row with no well name cannot be classified and is dropped.

**Duplicates.** In the daily surveillance engine, a repeated date and well combination is de-duplicated, keeping the first occurrence.

The daily engine reports all of this in a data quality block. Run it on a deliberately dirty set of fifteen rows containing one exact duplicate, one blank well and one row of negative rates, and it reports: 15 rows in, 13 out, 1 duplicate removed, 1 row with negatives zeroed, and one issue line reading "1 row(s) dropped for missing/invalid date or well."

Negative rates are zeroed rather than dropped, because a negative rate is usually a meter or allocation artefact on an otherwise good row, and losing the whole row loses the other fluids too.

## Why the counts matter more than they look

A data quality block that says 216 in and 216 out is a strong statement. It says the ledger you are about to read contains every row you handed it. A block that says 216 in and 198 out is telling you that eighteen rows vanished, and you need to know which, because eighteen missing injector rows and eighteen missing producer rows move the VRR in opposite directions.

The single most common way to get a wrong VRR is not an arithmetic mistake. It is a silently incomplete input, and the count is the only place it shows.

## The clean version and the dirty version

Ekene is a generated fixture, so its rows are perfect: no duplicates, no negatives, no bad dates. That is useful for learning the arithmetic and useless for learning the discipline. Whenever you meet a real ledger, run the quality block first and read it before you read a single VRR number. If the counts do not reconcile to the source, nothing downstream is worth computing.

## The misconception to avoid

"The aggregation is trivial, so it cannot be the problem." Aggregation is where scope errors hide. A ledger that silently omits one injector, or includes a well from a neighbouring block, or double-counts a well that appears under two names, produces a perfectly self-consistent set of periods and a perfectly wrong answer. Check the well list against the field's well list by name, every time.

## Exercise

First, the Ekene record has 216 rows over 36 months and 6 wells. Verify that those numbers are consistent, then state what you would conclude if the same field returned 214 rows, and what single query you would run to find out which two were missing.

Second, a well produced oil for two years and was then converted to injection. Under the "injection wins" rule, describe two specific reports that would be misleading, and propose a way of presenting the well that avoids both without changing the classification rule.
