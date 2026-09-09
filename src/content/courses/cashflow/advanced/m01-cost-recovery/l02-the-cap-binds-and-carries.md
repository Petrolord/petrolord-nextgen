# The cap binds and carries

The cost oil cap decides how fast the contractor gets its money back, and a cap that binds every year builds a pool that can outlive the field.

{{panel:ec-fiscal-explorer}}

## One year, five caps

The engine's applyPSC on a single year with 100000000.00 of revenue, a 10 percent royalty and a pool of 80000000.00, with the cap swept:

| cap | cost recovered | contractor profit oil | carried forward |
| --- | --- | --- | --- |
| 0.200000 | 18000000.00 | 36000000.00 | 62000000.00 |
| 0.400000 | 36000000.00 | 27000000.00 | 44000000.00 |
| 0.600000 | 54000000.00 | 18000000.00 | 26000000.00 |
| 0.800000 | 72000000.00 | 9000000.00 | 8000000.00 |
| 1.000000 | 80000000.00 | 5000000.00 | 0.00 |

Each step of the cap moves cost recovered up and profit oil down by the same amount, so the contractor's tax falls as its recovery rises: 18000000.00 of tax at a 0.200000 cap, 13500000.00 at 0.400000, 2500000.00 at 1.000000, where the year's net turns positive at 2500000.00. The cap is a share of revenue after royalty: 0.400000 recovers 36000000.00, not 40 percent of the gross. With 30000000 brought forward from an earlier year at the 0.4 cap, the recovery is still 36000000.00, profit oil still 27000000.00, net still -30500000.00, and only the carried amount changes, to 74000000.00. A bigger pool does not recover faster. It waits.

## AKATA at five caps

AKATA under production sharing terms (psc_royalty_pct 10, psc_cost_oil_cap_pct 60, psc_contractor_profit_share_pct 45, psc_tax_rate_pct 50) with the cap swept, the pool read by marching applyPSC over the engine's own rows:

| cap percent | NPV | IRR percent | pool at end of 2035 |
| --- | --- | --- | --- |
| 30 | -104151944.05 | -21.3161 | 207346412.26 |
| 45 | -31510890.38 | 0.9150 | 91570072.23 |
| 60 | 29960298.75 | 19.8650 | 0.00 |
| 80 | 42273746.33 | 32.2148 | 0.00 |
| 100 | 48148675.31 | 48.4048 | 0.00 |

Payback tells the same story: Beyond project life at 30 percent, 6.57 years at 45, 3.65 at 60, 2.63 at 80 and 1.98 at 100. At 30 percent the pool at each year end reads 183771360.00, 210408885.60, 199052435.86, 193780636.14, 193855432.19, 198487119.51 and 207346412.26. It never shrinks for long, because each year's opex enters faster than the cap lets cost oil out, and the field ends with more unrecovered cost than it carried out of 2029. At 60 percent the pool clears in 2034 (5291604.93 left at the end of 2033, 0.00 a year later), at 80 percent in 2031, at 100 percent in 2030. The take is 82.1085 percent at 60, at 80 and at 100: once the pool clears inside the life, the cap only moves timing, and timing is what NPV and IRR price. At 45 percent the take is 99.0577 and at 30 it is 120.4874, because a pool that never clears is revenue the contractor never sees.

## The mistake

The careful reader sees the cap as a ceiling on how much cost can be recovered. It is a ceiling on how much can be recovered per year. At 30 percent AKATA recovers 50228640.00 in 2029 and is still recovering 19797962.36 in 2035, and it recovers the rest never, because the field has stopped.

## What it refuses

No row prints the pool. The cost recovered by year and the carried amount come from the march, not from the engine's output, and nothing warns that 207346412.26 was left on the table.

## Exercise

Read the 45 percent case and write the pool at each year end. Then say at which cap the pool first clears inside the field's life and what happens to the take from there on.
