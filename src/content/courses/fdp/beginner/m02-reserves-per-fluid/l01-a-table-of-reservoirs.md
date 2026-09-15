# A table of reservoirs

Reserves enter a plan as rows. Each row is one reservoir, carrying one fluid type, three percentiles of that fluid and a recovery factor, and the plan's reserves are whatever those rows add up to.

{{panel:ec-plan-explorer}}

## The rows EGINA carries

| reservoir | fluid | P90 | P50 | P10 | recovery factor |
| --- | --- | --- | --- | --- | --- |
| Egina Main | Oil | 60.0000 | 95.0000 | 145.0000 | 0.340000 |
| Egina Deep | Oil | 20.0000 | 35.0000 | 60.0000 | 0.280000 |
| Egina Gas Cap | Gas | 40.0000 | 70.0000 | 110.0000 | 0.650000 |

Three reservoirs, two fluids. Egina Main is the largest oil accumulation at 95.0000 MMbbl at P50 and recovers 0.340000 of what is in place. Egina Deep is smaller and tighter, 35.0000 MMbbl at P50 at a recovery factor of 0.280000. Egina Gas Cap is gas, 70.0000 Bcf at P50, and gas recovers far more of what is there at 0.650000.

## What the engine does with them

It sorts the rows by fluid and adds each column within one fluid.

| fluid | unit | rows | sum of P90 | sum of P50 | sum of P10 |
| --- | --- | --- | --- | --- | --- |
| Oil | MMbbl | 2 | 80.0000 | 130.0000 | 205.0000 |
| Gas | Bcf | 1 | 40.0000 | 70.0000 | 110.0000 |

The oil P50 of 130.0000 MMbbl is 95.0000 plus 35.0000 and nothing else. The gas row count of 1 matters as much as the total: a fluid with one row has no aggregation in it, so 70.0000 Bcf is simply the one reservoir estimate carried through.

## The fluid type is the key

A row without a readable fluid has no column to sit in, and the engine refuses it by name rather than dropping it into a default. A row with no fluid type comes back as "Unlabelled: fluid type is missing or unknown (undefined); expected one of Oil, Gas, Condensate". A row whose fluid is typed as Brine comes back as "Aquifer: fluid type is missing or unknown (Brine); expected one of Oil, Gas, Condensate". The three fluids the engine knows are Oil, Gas and Condensate.

## Named by what you called it

The message uses the reservoir name, so Unlabelled and Aquifer are what somebody typed in the name column. An unnamed row is refused by its position instead: "row 2: fluid type is missing or unknown (undefined); expected one of Oil, Gas, Condensate". Naming a reservoir is worth doing for this reason alone.

## The mistake

The mistake is to think the recovery factor column is doing work in the totals. It is not. The engine adds P90, P50 and P10 and never touches the recovery factor, so a row with 0.340000 in it and a row with 0.650000 in it add the same way. The recovery factor tells you what fraction of the oil in place the estimate assumed. It is context for the volume, and it is not an input to the sum.

## Exercise

Give the oil P50 and the gas P50 for EGINA, and show which rows each was summed from. Then write the message the engine returns for a reservoir called Aquifer whose fluid is typed as Brine, and say what makes it different from a row that has no name at all.
