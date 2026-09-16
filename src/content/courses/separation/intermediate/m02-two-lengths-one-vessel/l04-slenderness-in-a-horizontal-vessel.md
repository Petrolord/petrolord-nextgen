# Slenderness in a horizontal vessel

Slenderness is the vessel length divided by its diameter. ABANA-2 at 8.000000 ft and 23.270539 ft long reads 2.908817, and the band it is judged against runs 3.000000 to 5.000000.

{{panel:fc-slug-explorer}}

## The ratio across the family

| diameter ft | length ft | L/D | in band |
| --- | --- | --- | --- |
| 5.000000 | 59.572579 | 11.914516 | false |
| 6.000000 | 41.369847 | 6.894974 | false |
| 7.000000 | 30.394173 | 4.342025 | true |
| 8.000000 | 23.270539 | 2.908817 | false |
| 9.000000 | 18.386599 | 2.042955 | false |
| 10.000000 | 14.893145 | 1.489314 | false |

One row of six sits inside the band. The narrow drums are too long for their bore, at 11.914516 and 6.894974, and the wide drums are too short, at 2.042955 and 1.489314. The 8.000000 ft drum misses the lower bound by a small amount and carries the reason ld-out-of-band.

## Where the ratio comes from

Neither number in the ratio was chosen for its own sake. The diameter is offered by a vendor and the length is whichever requirement controls, so slenderness is a consequence of a duty, a level and a bore. On this family the liquid sets the length on every row, which is why the ratio falls so steeply: the numerator drops from 59.572579 ft to 14.893145 ft while the denominator only doubles.

## The band is an input

The bounds of 3.000000 and 5.000000 are a typed specification. They are a piping and fabrication preference, about nozzle spacing, supports, transport and the cost of heads against shell, and they are not a result the vessel produced.

A row marked ld-out-of-band has not failed physics. It has failed a preference somebody expressed, and moving the bounds moves which rows carry the reason without changing a dimension.

## Out of band and still workable

A row can be out of band and perfectly capable. The 8.000000 ft drum at 2.908817 carries its gas with a margin of 1.668891 and holds its liquid in 23.270539 ft, and its only reason is ld-out-of-band. A row can also be in band and useless: widen the bounds to 3.000000 to 7.000000 and the 6.000000 ft drum comes inside them at 6.894974 while still failing on gas capacity.

Those are separate readings and they are reported separately. Band membership is a preference, and feasibility is a verdict about whether the vessel works.

## The mistake

The mistake is treating slenderness as a law. A ratio of 2.908817 is not a physical defect, and a design that needs a stubby drum can state a wider band and say why. The opposite mistake is worse: picking a row because it landed inside the band without reading whether that row can carry its gas.

## Exercise

Give the L/D for each of the six drums and say which sits inside a band of 3.000000 to 5.000000. Then explain why a row carrying only the reason ld-out-of-band is a different kind of finding from a row carrying gas-capacity, and what changes when the band is widened to 3.000000 to 7.000000.
