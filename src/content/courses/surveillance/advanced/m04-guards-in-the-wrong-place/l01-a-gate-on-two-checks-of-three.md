# A gate on two checks of three

`minOilRate` has a default of 5 and stands in front of the rate check and the gas-oil ratio check. It does not stand in front of the watercut check. A well can be too small for a collapse in oil to be reported and large enough for a high watercut exception on the identical rows.

{{panel:pd-reading-explorer}}

## Which comparisons the gate covers

`detectExceptions` takes the baseline window mean of the well's calendar oil column and tests it against `minOilRate` before it will raise `rate_drop`, and again before it will raise `gor_rise`. The `shut_in` branch sits inside the same gate. `watercut_rise` is formed outside it and is raised whatever the well is making. The settings around it default to `recentDays` 7, `baselineDays` 30, `rateDropPct` 20, `gorRisePct` 30 and `watercutRisePts` 10.

## The demonstration

A derived case, one small well. Its baseline window mean is 3.0 and its recent window mean is 1.2, both of them the mean of the calendar oil column over the window rather than a producing-day rate. Exceptions raised = 1, a high `watercut_rise`, message: "Watercut up 51 points: 88% vs 38% baseline."

The oil across those same two windows fell by 60.000000000 per cent, well past the `rateDropPct` trigger of 20 per cent, and no `rate_drop` appears anywhere in the return.

## The dial, swept on that well

| minOilRate | What is raised |
| --- | --- |
| 0 | high rate_drop, high watercut_rise, high gor_rise |
| 1 | high rate_drop, high watercut_rise, high gor_rise |
| 2 | high rate_drop, high watercut_rise, high gor_rise |
| 3 | high rate_drop, high watercut_rise, high gor_rise |
| 5 | high watercut_rise |
| 10 | high watercut_rise |

Nothing in a returned row names the setting that removed the other two.

## The small well that stops altogether

A second derived case. A baseline of 3.4 and a fully shut recent week raises 0 exceptions of any kind, because `shut_in` is inside the same gate and the downtime branch separately requires the mean hours to be above zero. The same rows scaled to a baseline of 840 raise one high `shut_in`. The well behaved identically in both runs.

## The mistake

Reading the exception list as a description of the well. A lone high `watercut_rise` reads as a water problem on a well that is otherwise steady, and on that first case the oil had fallen by 60.000000000 per cent with the rate check never run. A severity is the name of a threshold crossing, so the list is a function of the settings as much as of the ledger, and `minOilRate` is the setting that decides who is in it at all.

## Exercise

Take the small well in the panel and record what is raised at `minOilRate` of 3 and at the default of 5.

Then say which of the two lists you would send to a production supervisor, and write the one sentence you would have to add to the shorter one so that it is not misleading.
