# The sensitivity table

{{panel:lp-proof-test}}

A sensitivity table is one subsystem read at several intervals with everything else held. It is the cheapest piece of evidence in a verification file, because every row is the same hardware and the same rates, so a reader can see what the interval alone is worth. The engine produces it from one call, and the discipline of the call is the discipline of the table: if any other input moved between rows, the table would no longer be about the interval.

## Four subsystems across the same six intervals

The same six intervals, 2190 to 70080 hours, read on four subsystems. EKULAMA appears twice, once as a 1oo1 with undetected failures only and once as the full channel with detected failures, an MTTR of 8 hours, an MRT of 8 hours, a beta factor of 0.05 and a betaD of 0.02.

| T1 hours | EKULAMA 1oo1, DU only | EKULAMA full 1oo2 | EKULAMA full 2oo3 | IDU valves 1oo2 |
| --- | --- | --- | --- | --- |
| 2190 | 0.001314000000 | 0.000068932620 | 0.000073541861 | 0.000300179812 |
| 4380 | 0.002628000000 | 0.000141276391 | 0.000159173172 | 0.000611621000 |
| 8760 | 0.005256000000 | 0.000298987176 | 0.000369505528 | 0.001287026426 |
| 17520 | 0.010512000000 | 0.000666501722 | 0.000946449167 | 0.002847929478 |
| 35040 | 0.021024000000 | 0.001609902719 | 0.002725452157 | 0.006810104389 |
| 70080 | 0.042048000000 | 0.004330192328 | 0.008783920983 | 0.018095929431 |

## Reading the table down and across

Read one column downward and the shape of the subsystem shows itself. The 1oo1 with undetected failures only doubles every time the interval doubles: 0.002628000000 at 4380 hours is twice 0.001314000000 at 2190 hours, and 0.042048000000 at 70080 hours is twice 0.021024000000. The redundant columns grow faster than that, and the further down the table the faster they grow. The next lesson measures the growth directly.

Read one row across and the architectures rank. At 8760 hours the EKULAMA full 1oo2 reads 0.000298987176 and the full 2oo3 reads 0.000369505528, so the 2oo3 costs PFDavg against the 1oo2 on this channel. At 70080 hours the gap has widened to 0.004330192328 against 0.008783920983. The voting architecture buys tolerance of a channel tripping spuriously, which this engine does not compute, and the analyst weighs that outside the table.

## Why the engine builds it in one call

The table could be built by calling the subsystem calculation six times by hand, and that is how a spreadsheet usually does it. The risk in six calls is that one of them carries a different input, because a figure was edited in one column and missed in another. One call with a list of intervals removes that risk entirely: the engine holds the subsystem and varies only the interval, so the columns are guaranteed comparable. A table whose rows are not guaranteed comparable is not evidence about the interval at all.

## What a table like this is evidence for

It is evidence about one subsystem under one set of stated inputs. It says nothing about a different failure rate, a different MTTR or a different beta factor, and it carries no claim that any of the rates is data. A verification note that reproduces a sensitivity table states the inputs beside it, names the source of every rate, and says which row was chosen and against which required PFDavg. A table with no target beside it is a picture with no decision in it.

## Exercise

Take the IDU valves column. Write down the PFDavg at 8760 hours and at 35040 hours, then say how many times larger the four year figure is than the one year figure, to two decimals. Do the same for the EKULAMA full 2oo3 column across the same two intervals, and write one sentence saying which of the two subsystems is hurt more by the stretch and what in its construction explains it.
