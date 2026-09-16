# Three statuses

A sweep answers with a diameter or with a null, and when it answers null it says which of two quite different situations it is in. `preferredStatus` reads selected, none-feasible or none-in-band.

{{panel:fc-slug-explorer}}

## What each status means

Selected means a vessel qualified: some row was feasible and inside the band, and the smallest such row is the answer. None-feasible means no row in the list works at all, whatever its slenderness. None-in-band means feasible vessels exist and none of them is shaped the way the band asks for.

The two nulls call for opposite actions. None-feasible is an engineering problem, so the stream, the specification or the diameter list has to change. None-in-band is a shape problem, so the band was an input and can be argued with.

## None-feasible, on a specification

AGBAMI swept at a water droplet specification of 500.000000 micron prefers 7.000000 ft, slenderness 3.589407, reasons none. Tighten the specification to 150.000000 micron and nothing about the vessels changes except their verdicts:

| diameter ft | length ft | L/D | in band | feasible | reasons |
| --- | --- | --- | --- | --- | --- |
| 6.000000 | 34.199073 | 5.699846 | false | false | water-carryover, ld-out-of-band |
| 7.000000 | 25.125850 | 3.589407 | true | false | water-carryover |
| 8.000000 | 19.236979 | 2.404622 | false | false | water-carryover, ld-out-of-band |
| 9.000000 | 15.199588 | 1.688843 | false | false | water-carryover, ld-out-of-band |
| 10.000000 | 12.311666 | 1.231167 | false | false | water-carryover, ld-out-of-band |

Preferred is null and the status is none-feasible. A droplet verdict gates feasibility, because a vessel that carries water into the oil outlet has not separated the stream, whatever its slenderness.

## None-in-band, on the same family

Leave the specification at 500.000000 micron and narrow the band to 4.000000 to 5.000000 instead. Every row is now feasible, every row carries the single reason `ld-out-of-band`, preferred is null and the status is none-in-band. Nothing is wrong with any of those vessels. The band asked for a shape none of the offered diameters produces.

The published cases show both. verticalNoneFeasible has its 3.000000 ft and 4.000000 ft rows in a band of 1.000000 to 10.000000 and both infeasible on gas capacity, so it returns none-feasible. d1ProbeVertical4ftGasOverloaded has a 7.000000 ft row that is feasible and out of band and a 4.000000 ft row that is in band and gas overloaded, so it returns none-in-band. horizontal3DropletVerdictsGateFeasibility returns none-feasible with rows failing on gas capacity and on water carryover together.

## The retired behaviour

A retired rule with no notion of feasibility returned a diameter in every one of those cases: 3.000000 ft for verticalNoneFeasible, 4.000000 ft for d1ProbeVertical4ftGasOverloaded and 8.000000 ft for horizontal3DropletVerdictsGateFeasibility. Each is a number where the honest answer is that nothing qualified.

## The mistake

The mistake is rendering a null as a blank. A null preferred diameter with a status beside it is a finding, and a blank cell in a report is an oversight somebody will fill in by eye with the nearest row.

The second mistake is treating none-in-band as none-feasible and going back to the process engineers. Feasible vessels exist in that case and the band is the thing to revisit, which is a conversation about layout and about what a plot can take rather than about separation.

## Exercise

Name the three values of `preferredStatus` and say what each one means. Then explain, using the AGBAMI family at 150.000000 micron and the same family in a band of 4.000000 to 5.000000, how the same diameters can produce none-feasible in one run and none-in-band in another, and say what different action each one calls for.
