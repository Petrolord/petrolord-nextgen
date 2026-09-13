# The tranche the ratio selects

The R factor does no work by itself. It selects a tranche, the tranche carries a contractor split, and that split is applied to the whole of the year's profit oil.

{{panel:ec-instrument-explorer}}

## The walk

`getTieredSplit` sets the split to the first tier's split, then walks the tier list in order and keeps the split of every tier whose threshold the R factor has reached. It is the same shape of walk the sliding royalty uses on price, with the R factor in place of the oil price.

Three of the six templates split profit oil this way. "Nigeria - PIA (2021)" gives the contractor 60 percent at R 1, 40 percent at R 1.6 and 30 percent at R 2.5. "Ghana - Deepwater" gives 70 percent at R 1, 50 percent at R 1.25 and 35 percent at R 2. "Angola - Deepwater PSC" gives 70 percent at R 1, 50 percent at R 1.5 and 30 percent at R 2. In all three the contractor's share falls as the project's cumulative revenue outruns its cumulative cost.

## Reading the split off the ledger

The split is not a printed column. What is printed is profit oil and the pieces of contractor net cash flow, and their ratio names the tranche. The PIA template on the Designer's default project:

| year | rFactor | profitOil | contractor profit share | implied split |
| --- | --- | --- | --- | --- |
| 1 | 0.512217 | 48.9580 | 29.3748 | 0.600000 |
| 4 | 1.525756 | 95.8543 | 57.5126 | 0.600000 |
| 5 | 1.769792 | 148.4098 | 59.3639 | 0.400000 |
| 10 | 2.494773 | 90.1428 | 36.0571 | 0.400000 |
| 11 | 2.581420 | 80.0217 | 24.0065 | 0.300000 |

Year 1 is the important row. The R factor is 0.512217, below every threshold, and the implied split is 0.600000. The first tier's split is the default, used before any threshold is reached, exactly as the first tier's rate is on a sliding royalty. Year 4 at 1.525756 has not reached 1.6, so 0.600000 still stands. Year 10 at 2.494773 has not reached 2.5, so 0.400000 still stands.

## The mistake

Treating the tranches as marginal bands. In year 5 the whole of the 148.4098 million USD of profit oil is split at 0.400000, giving the contractor 59.3639. A reader who gives the first slice 60 percent and the rest 40 will land above 59.3639 and below what year 4's rate would have produced, which is the most plausible-looking wrong answer available.

The other mistake is reading a split off a year with no profit oil. On `harsh_split_40_royalty_20` the year 1 profit oil is 0.0000 and the implied split is null. The engine still chose a split that year. It simply had nothing to apply it to, and no ratio can recover it.

## What it refuses

The split touches profit oil only. Cost oil is not split, royalty is not split, and the tranche has no effect on either. There is no signature bonus, no production bonus and no state participation, so the government's whole share of profit oil is one minus the contractor's split. The tranche is chosen fresh every year from that year's own R factor, with no averaging and no lag.

## Exercise

Name the implied split in years 1, 5 and 11 and the R factor that selected each. Then say why year 4 and year 10 keep the split of the year before them, in terms of the thresholds they did not reach.
