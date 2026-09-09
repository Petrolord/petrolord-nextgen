# Per-well beats the rollup

When a file carries both per-well volumes and a total column, the engine sums the wells and ignores the total. It does not add them.

{{panel:ec-ledger-explorer}}

## The published case

The per_well_beats_total_rollup upload is a single row for 2027: total_oil_bbl=100000, well1_oil_bbl=60000, well2_oil_bbl=40000. All three headers pass the volume test, total_oil_bbl included. The engine reads 2027 as oil 100000.00 bbl, not 200000. The wells are summed, and the total is dropped.

The ledger downstream: total revenue 7500000.00, total tax 3375000.00, net cash flow 3375000.00, take 55.0000 percent. No capex and no opex were uploaded, so DPI is null and payback is Year 0. Had the total been added to the wells, the revenue would have been double and every reading built on it wrong by the same factor, and nothing in the KPI panel would have looked odd.

## Why the rule is this way

A total column is a spreadsheet's convenience, and the wells are the data. If the two disagree, the wells are what the field sold, so the engine believes them. If they agree, ignoring the total loses nothing. The published cases do not show a file that carries only a total and no wells, so what the engine does with a lone total_oil_bbl is not something these lessons can state. The known-good shape is per-well columns, with or without a total beside them.

## The cost side does the opposite

Costs have a different rule, and the contrast is the lesson. When a capex row has no preferred alias, the engine sums every *_usd column and excludes the ones prefixed total_: drilling_usd=20000000 and facilities_usd=5000000 with total_usd=99 give capex 25000000.00, and the 99 never enters. For volumes the total is ignored when wells exist; for costs the total is excluded from the parts sum. In both, the engine prefers the pieces to the rollup, and in both a reader who expected the total to count gets a number they did not upload.

## What it refuses to do

It does not reconcile. If well1 and well2 sum to something other than the total, the engine reports the wells' sum and says nothing about the total it dropped. It does not warn that a total column was present. It does not use the total to check the wells. Every one of those is a check the reader does by comparing the annual volume the engine reports against the file.

## The mistake

The careful mistake is the double count, made by hand. A reader building a check spreadsheet sums every column ending in _oil_bbl, total included, gets 200000, and concludes the engine has lost half the field when it reports 100000.00. The engine is right. The reverse mistake is the reader who knows the rule, strips the wells to be safe and leaves only the total, which is the one shape the published cases do not cover. Keep the wells.

## Exercise

Load per_well_beats_total_rollup and confirm 100000.00 bbl for 2027 and revenue 7500000.00. Then write the annual oil the engine would read if the file carried well1_oil_bbl=60000 and well2_oil_bbl=40000 with no total column at all, and say why the answer is the same.
