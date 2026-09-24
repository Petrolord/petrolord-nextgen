# The moving range chart

{{panel:dq-monitor-explorer}}

Beside the individuals chart the engine draws a second chart of the moving ranges themselves. Its upper limit is D4 times MRbar, with D4 for a moving range of two exported as `D4_N2` 3.267000 from the NIST/SEMATECH 6.3.2.1 table, and its lower limit is 0. On EKENE-3's phase one, MRbar is 4.257143 psi and the moving range upper limit is 13.908086 psi. Charted against phase one as the standard, the forty monitored days raise signals on six occasions, four of them from the moving range chart.

| day | pressure, psig | rule |
| --- | --- | --- |
| 8 | 633.800000 | individuals-above-ucl |
| 8 | 633.800000 | moving-range-above-ucl |
| 9 | 608.000000 | moving-range-above-ucl |
| 22 | 598.600000 | individuals-below-lcl |
| 23 | 615.200000 | moving-range-above-ucl |
| 25 | 602.900000 | moving-range-above-ucl |

## What the second chart watches

The individuals chart watches the level. The moving range chart watches the size of the step from one day to the next. A process can hold its level and become jumpier, and the moving range chart is where that shows. It has no lower limit above 0, because a moving range cannot be negative and a quiet run of small steps is no evidence of trouble.

## One glitch, two ranges

Day 8's reading is the planted glitch, 633.800000 psig. It signals on the individuals chart because it lies above 622.702188. It also makes a large step up from day 7, so the moving range on day 8 signals. On day 9 the pressure returns to 608.000000, and the step back down is large too, so day 9 signals on the moving range chart without its own reading being unusual. One bad reading costs two moving range signals. When you read a moving range signal, look at both days it joins before deciding which reading is at fault.

## Steps inside the shift

Days 22, 23 and 25 sit inside the shifted stretch. Day 22 reads 598.600000 psig, below the individuals lower limit of 600.057812. Day 23 reads 615.200000, and the step up from day 22 is large enough to signal on the moving range chart. Day 25 reads 602.900000 after 618.500000 on day 24, and that step down signals too. These are large day to day swings, and the chart reports them as such. It does not say the shift began on day 16; the individuals chart signals low on one day of the shifted stretch only, and the charts in the next two modules are built to see more of it.

## Reading the rule names

Every signal carries the rule that fired, so a day can appear twice, as day 8 does. A monitoring note lists the day, the rule and the value, and it counts days and signals separately. On this table there are six signals on five days.

## Exercise

Using the pressures in the table and day 24's 618.500000 psig, compute the moving range on day 23 and on day 25 by hand, and compare each with the upper limit of 13.908086. Then multiply 3.267 by phase one's MRbar, 4.257143, and check that you reproduce that limit. In the panel, change day 9 to a value close to day 8's reading and note which moving range signal moves to a different day.
