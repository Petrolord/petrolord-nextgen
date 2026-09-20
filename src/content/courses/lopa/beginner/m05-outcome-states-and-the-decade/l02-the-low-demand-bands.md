# The low demand SIL bands

{{panel:lp-worksheet}}

Every band in this course is a LOW DEMAND band. The engine has no high demand or continuous mode, so there is one table to read and one only. A band is a decade wide in PFDavg and a decade wide in risk reduction factor, and the two columns describe the same thing from either end.

## The table the engine works from

| SIL | PFDavg from, inclusive | PFDavg to, exclusive | RRF above | RRF up to, inclusive |
| --- | --- | --- | --- | --- |
| 4 | 1e-5 | 1e-4 | 10000 | 100000 |
| 3 | 1e-4 | 1e-3 | 1000 | 10000 |
| 2 | 1e-3 | 1e-2 | 100 | 1000 |
| 1 | 1e-2 | 1e-1 | 10 | 100 |

Read a row either way. SIL 2 holds a PFDavg from 1e-3 up to 1e-2, and equally a risk reduction factor above 100 and up to 1000. A smaller PFDavg is a larger risk reduction factor, so the two columns run in opposite directions and describe one band.

## What `silFromPfdAvg` does with an achieved figure

| PFDavg, stated | SIL | state |
| --- | --- | --- |
| 1 | none | NOT_SIL_RATED |
| 0.1 | none | NOT_SIL_RATED |
| 0.05 | 1 | SIL |
| 0.005 | 2 | SIL |
| 0.0005 | 3 | SIL |
| 0.00005 | 4 | SIL |
| 0.000005 | 4 | BELOW_SIL4_TABLE_FLOOR |

A PFDavg of 0.1 is NOT_SIL_RATED. It is a real number and a real function may well achieve it, and it sits above the top of the table, so no band applies. A PFDavg of 0.05 is SIL 1 and 0.005 is SIL 2.

## Off the bottom of the table

Below 1e-5 the table has no row. The engine reports SIL 4 with the state BELOW_SIL4_TABLE_FLOOR and the note: "PFDavg below 1e-5 is off the table: no claim beyond SIL 4 exists".

That is the honest answer. A calculation can return any small number it likes, and the standards stop claiming at the bottom of the SIL 4 band, so the engine reports the state and leaves the figure visible.

A function at 0.00005 is SIL 4 by the table, and the note on the band table's own floor is worth holding on to: no SIF is proposed at SIL 4 anywhere in this course. The band exists in the table, and a demand that reaches into it is read as a reason to change the process.

## Three states, and why a state is returned at all

| state | what it means |
| --- | --- |
| NOT_SIL_RATED | the PFDavg is above the top of the table |
| SIL | the PFDavg falls in a band |
| BELOW_SIL4_TABLE_FLOOR | the PFDavg is below the bottom of the table |

The alternative would have been to return a SIL number alone and use zero or some sentinel for the two edges. The engine does not take that route. A number that sometimes means a band and sometimes means an edge case is a number every reader has to decode, and a state word decodes itself.

One more habit follows from the table. The band a function achieves and the band a row requires are two different readings, made by two different calls, and they are compared at the end. This tier produces the required side. A function's achieved PFDavg, and the band it falls in, come from the verification half of the engine, and a proposal quoted only as a band has not yet been compared with anything.

## Exercise

Take ORONI's required PFDavg of 0.074074074074 and place it in the table above, naming the band and saying which of its two bounds it sits nearer. Then take the required PFDavg of 0.007407407407 that the same row demands at a tighter tolerance, place that, and say how many bands apart the two demands are.
