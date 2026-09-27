# A cap and the write-off

{{panel:joa-recovery-calculator}}

A contract may limit what the carriers can ever take back. A cap is a stated ceiling on the total carry recovery, and once it is reached the rest of the balance is written off: the carriers stop recovering and the carried party keeps its whole share. A carry can also end its horizon unrecovered with no cap at all. The two outcomes look alike on a total line and mean different things, so this lesson sets them side by side.

## The Ekene carry with a cap

The golden input takes the compound carry, 8.000000 percent a year on the opening balance and recovery from 50.000000 percent of NOC's share, and states a cap of 25000000.000000. The years to 2031 run exactly as before; 2032 is where the cap bites:

| year | due | available | recovered | written off | NOC keeps |
| --- | --- | --- | --- | --- | --- |
| 2030 | 34656076.800000 | 9600000.000000 | 9600000.000000 | 0.000000 | 9600000.000000 |
| 2031 | 27060562.944000 | 11200000.000000 | 11200000.000000 | 0.000000 | 11200000.000000 |
| 2032 | 17129407.979520 | 10400000.000000 | 4200000.000000 | 12929407.979520 | 16600000.000000 |

> 2032: the stated cap 25000000 is reached with 4200000 recovered this year; the rest, 12929407.98, is written off

By the end of 2031 the carriers have recovered 20800000.000000, so only 4200000.000000 of the cap is left in 2032, although 10400000.000000 is available. The balance of 12929407.979520 is written off, the tile "Recovered in year" reads none, and the carry is closed with nothing outstanding. From 2033 NOC keeps its whole share. At a discount rate of 0.100000 to 2027, NOC's NPV is 57822978.058592 with the cap, against 49870804.456959 without it.

## A cap exactly at the cost

A cap can be set so that the uplift is never paid. On a small golden ledger with parties A 60, B 20 and N 20, a compound uplift of 10 percent and a cap of 200, equal to the carried cost:

> 2028: the stated cap 200 is reached with 200 recovered this year; the rest, 20, is written off

The carriers get their cost back and the uplift of 20.000000 is written off.

## Outstanding and written off

The golden input carry-ekene-short-horizon runs the same compound carry with no cap over five years only, 2027 to 2031. It ends with 20800000.000000 recovered, 0.000000 written off and 15860562.944000 outstanding:

> 2031: 15860562.94 of the carry is not recovered by the last year

An outstanding balance is still owed; the engine reports it at the last year it was given and computes no year beyond. A written-off balance is gone under the contract's own terms. Quote a carry total with its cap and its horizon for that reason.

## Exercise

Work in the course's own recovery calculator, view "A carry and its recovery".

1. Start from "The Ekene carry with a cap". Check the 2032 row, the tiles "Written off", "Outstanding" and "Recovered in year", and NOC's NPV.
2. Clear the control "Cap (optional)" and read the same tiles. Then set the cap to 30000000 and find the year it is reached, and the amount written off.
3. Clear the cap again. In the box, delete the years 2032 to 2036 from `years`, and check the tiles against the short horizon figures above.
