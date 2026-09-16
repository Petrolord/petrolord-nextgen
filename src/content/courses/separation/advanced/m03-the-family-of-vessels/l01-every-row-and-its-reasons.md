# Every row, and its reasons

A sweep sizes the same duty in every diameter it is offered and reports all of them. Each row carries a length, a slenderness, two independent flags and a list of reasons, and none of the rows is hidden because it failed.

{{panel:fc-slug-explorer}}

## The whole family, reported

ABANA-2 swept across the diameters a vendor offers, against a slenderness band of 3.000000 to 5.000000:

| diameter ft | length ft | L/D | in band | feasible | reasons |
| --- | --- | --- | --- | --- | --- |
| 5.000000 | 59.572579 | 11.914516 | false | false | gas-capacity, ld-out-of-band |
| 6.000000 | 41.369847 | 6.894974 | false | false | gas-capacity, ld-out-of-band |
| 7.000000 | 30.394173 | 4.342025 | true | true | none |
| 8.000000 | 23.270539 | 2.908817 | false | true | ld-out-of-band |
| 9.000000 | 18.386599 | 2.042955 | false | true | ld-out-of-band |
| 10.000000 | 14.893145 | 1.489314 | false | true | ld-out-of-band |

Every row was sized. A vessel that cannot carry its gas still gets a length, because the length is what it would need for its liquid and the reader is entitled to see it.

## Two flags that answer different questions

`inRange` asks whether the slenderness sits inside the band that was passed in. `feasible` asks whether the vessel works: whether it carries its gas and whether its droplet verdicts clear. The two are independent, and all four combinations occur in ordinary sweeps.

The 8.000000 ft row is feasible and out of band. It separates the stream and it is a stubby drum at a slenderness of 2.908817. The 5.000000 ft row is neither: at 11.914516 it is a very long vessel and it cannot carry its gas.

## The reason vocabulary

A row's `reasons` list carries every objection to it, physical and dimensional together. The words are `gas-capacity`, `ld-out-of-band`, `water-carryover` and `none`.

Only the physical reasons make a row infeasible. A row whose sole reason is `ld-out-of-band` comes back feasible true, because slenderness is a preference about how the drum is shaped and the band that judges it was an input. A row carrying `gas-capacity` or `water-carryover` comes back feasible false, because it has failed to do the job.

## The same shape on a vertical family

ABANA-1 swept against a band of 2.000000 to 4.000000 behaves identically. The 2.000000 ft row is infeasible with reasons `gas-capacity, ld-out-of-band` at a slenderness of 8.584929. The 2.500000 ft row is feasible with `ld-out-of-band` at 5.259484. The rows at 3.000000, 3.500000 and 4.000000 ft carry no reasons at all, with lengths of 10.964382 ft, 9.647301 ft and 8.792465 ft.

## The mistake

The mistake is to filter the sweep before reading it. A reader who keeps only the feasible rows loses the fact that the two smallest diameters failed on gas, which is the shape of the problem. A reader who keeps only the in-band rows loses the working vessels at 8.000000, 9.000000 and 10.000000 ft, which may be exactly what the plot has room for.

The second mistake is reading `reasons` as a severity ranking. The list is a set of objections in no order, so a row with two reasons is not worse than a row with one. The 5.000000 ft and 6.000000 ft rows both carry two reasons, and what separates them is a gas margin the reasons list does not print.

## Exercise

For the ABANA-2 sweep, give the length and slenderness of the 5.000000 ft and 8.000000 ft rows and say why one is infeasible and the other is feasible. Then explain the difference between `inRange` and `feasible`, and say which entries in the reason vocabulary set feasible to false.
