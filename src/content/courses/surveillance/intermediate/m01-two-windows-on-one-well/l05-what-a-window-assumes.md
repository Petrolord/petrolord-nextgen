# What a window assumes

Four assumptions are built into every window mean `detectExceptions` takes, and none of them is stated in the return.

{{panel:pd-exception-explorer}}

## Every row weighs the same

`windowMean` is an unweighted arithmetic mean of the values it finds. On a rate that is defensible. On a RATIO it is a choice, and it is the choice that makes a low-rate day speak as loudly as a full one.

`detectExceptions` calls `windowMean` on the per-row `gor` and `watercut` keys, each of which `derivePoint` formed from one row alone, so its period ratio is a MEAN OF DAILY RATIOS. `computeKpis` takes the mean oil, the mean water and the mean gas first and forms the ratios off those, which is a VOLUMETRIC reading. Both ship.

The teaching well OGUTA-2, invented for this course and neither published nor real, has a recent window of 7 rows holding 4327.000000000 stb of oil, 1964.000000000 stb of water and 2792.000000000 Mscf of gas. Read as a mean of daily ratios its gas-oil ratio is 1066.663410762250 scf/stb; read volumetrically the same rows give 645.250751097758 scf/stb. Its watercut is 0.451386451920 as a mean of daily ratios and 0.312192020347 volumetrically, both fractions.

## Where the assumption costs nothing

Over the OGUTA-2 baseline window the two readings agree exactly: 580.000000000000 scf/stb either way, and 0.236641221374 either way, a difference of 0.000000000000. That window is 30 rows in which the daily ratio never moves. A window of uniform days cannot show the disagreement at all, which is why it survived into a shipped studio.

## The other three assumptions

A row is one calendar day, and nothing in the ledger says otherwise. The two windows are comparable, though only the recent one is required to be recent. And a mean represents the window, so a well that made nothing for four days and its ordinary rate for three averages to something it never produced on any day.

## The mistake

Treating the printed value as the well's condition over the window. It is the mean of one column over a date range under one reading of that column, and swapping the reading for the equally defensible other one moves the OGUTA-2 gas-oil ratio by a factor the digest records as 1.653099061020.

## What it refuses

`windowMean` skips values that are not finite rather than counting them as zero, and returns a null mean with a count of zero when the window is empty. A comparison against a null baseline is not made at all, so a well with no baseline data is silent rather than flagged.

## Exercise

Read the OGUTA-2 baseline window and its recent window in the panel and write down the gas-oil ratio each one gives.

Then say which of the two windows can hide the difference between the two readings, and why.
