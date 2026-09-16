# Three numbers to distrust

The engine reports each of these with the same confidence as everything else. A reader who knows where they come from can use them; one who does not will be wrong in a way that looks careful.

{{panel:ec-fiscal-explorer}}

## The payback of a field that ends underwater

Payback reports the first year in which the cumulative cash flow turns non-negative, and it never looks again. AKATA with a 200000000 lump sum in 2035 reports payback 3.46 years, which is exactly what the run with no abandonment at all reports, while its nominal flows sum to -58362170.82 at 0 percent, its NPV is -40359955.35 at the applied rate and its IRR is null. A field that ends with less than it started reads as paid back in its fourth year. Distrust a payback until the sign of the last row and the total beneath it have been read beside it.

## The allowance flag that reports one cap of two

computeProductionAllowance limits the per-barrel allowance twice: by the lease rate, and by pia_production_allowance_pct_of_price 20 of the year's price. Only the second limit is ever flagged. A converted lease lifting 1000000 bbl earns 2500000.00 at 80 USD/bbl and 2000000.00 at 10 USD/bbl, where the price limit cut it, and prod_alw_cap_applied reads false on both rows. The flag turns true only where the volume cap acted, as it does for a new shallow water lease at a prior cumulative of 99500000, which earns 4000000.00 on 500000.00 eligible bbl. Distrust a false flag read as a statement that no cap acted.

## The allowance beside its own eligible barrels

AKATA under the PIA at a 50 percent working interest reports a production allowance of 2750000.00 on 2200000.00 eligible bbl. The allowance is the share, halved with every other monetary line. The eligible barrels are the field's, because the tier and the volume cap have to be read on the field. Two bases sit in one row and nothing says so. pia_deep_offshore_wi_50 does the same at a larger scale, 27375000.00 of allowance beside 21900000.00 eligible bbl. Distrust any per-barrel rate got by dividing one of those columns by the other.

## The mistake

The careful mistake is to reconcile. A reader who divides 2750000.00 by 2200000.00 reports a rate the engine never applied; one who sees payback 3.46 years on a field worth -40359955.35 reruns for a stale NPV; one who reads false beside 2000000.00 concludes nothing was capped. Each number is what its method produces, and the method is not printed beside it.

## What used to stand here

Three other numbers held this place until the repair of 2026-09-15. The profile point at the applied rate was evaluated at its rounded label and missed its own headline by -21759.68 on AKATA. The IRR of a vector with several roots was whichever root Newton reached from 10 percent, unflagged. And a sinking fund at a 50 percent working interest collected 15000000.00 against a reported 30000000.00. All three are now plain readings: the point is evaluated at the exact rate, a multi-root vector returns null with a status, and the fund collects what was entered.

## Exercise

For each of the three numbers, write the one question that must be answered before the number can be used, and the row or KPI that answers it.
