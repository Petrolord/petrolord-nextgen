# Utilisation against capacity

A unit's utilisation is the plan's reading of how hard that unit works in the month, printed in percent of its capacity. For the crude unit it is also a reading of how much crude the month runs, because Lesson 2 showed the crude unit's throughput is the crude run. This lesson reads ABUA's three utilisations, then the crude unit's utilisation under each of the five changes.

{{panel:refinery-plan-explorer}}

## ABUA as typed

| unit | throughput (bbl) | capacity (bbl) | utilisation (percent) |
| --- | --- | --- | --- |
| Crude distillation | 2029032.26 | 2600000.00 | 78.04 |
| Naphtha reformer | 407677.42 | 420000.00 | 97.07 |
| Diesel hydrotreater | 650000.00 | 650000.00 | 100.00 |

The hydrotreater reads 100.00 percent, and the plan lists it separately: units at capacity, Diesel hydrotreater. It is the only unit on that list. The reformer reads 97.07 percent and the crude unit 78.04 percent.

This is the first reading a planner learns to make of a refinery plan. The crude unit is not full. The month could distil more crude, the crude is there to buy (Bonny Light runs 329032.26 bbl of 1500000.00 bbl available), and the plan chooses not to. Something other than the crude unit is holding the crude run where it is, and the unit at 100.00 percent is the first place to look. Module 4 prices that unit's missing barrels.

## A utilisation needs a finite capacity above zero

The engine is explicit: the utilisation the plan reports for a unit with a blank capacity is null, and for a unit typed as 0 it is null. Both are the plan declining to divide. A blank capacity is no limit, so there is nothing to be a percent of. A capacity of zero cannot be divided into. Neither reads as 0.00 percent, and a dashboard that shows either as zero is showing something the plan did not say.

## The crude unit under the five changes

SECTION 13 prints the crude unit's utilisation for each change:

| change | total crude (bbl) | crude unit utilisation (percent) |
| --- | --- | --- |
| the plan as typed | 2029032.26 | 78.04 |
| the diesel hydrotreater typed as shut for a turnaround (capacity 0) | 735294.12 | 28.28 |
| the diesel hydrotreater capacity left blank (no limit) | 2082608.70 | 80.10 |
| the crude unit at 1900000 barrels for the month | 1900000.00 | 100.00 |
| the Forcados cargo cancelled (availability typed 0) | 1747826.09 | 67.22 |
| a jet floor of 300000 and a fuel oil floor of 700000 | 2267857.14 | 87.23 |

Read the second and third rows together. They change the hydrotreater, a unit downstream of the crude unit, and yet the crude unit's utilisation reads 28.28 percent in one and 80.10 percent in the other. The crude unit's utilisation is set by the whole plan. A shut hydrotreater leaves gasoil one home, Gasoil export, with its ceiling of 250000.00 bbl, and the crude run follows.

The fourth row is the only one where the crude unit itself reads full. SECTION 13 labels it the crude unit at 1900000 barrels for the month, and it reads 100.00 percent on a total crude of 1900000.00 bbl.

The fifth row cancels a crude. Forcados, which ran at its full availability, is typed 0, and the crude unit reads 67.22 percent on a total crude of 1747826.09 bbl. SECTION 13 prints that row's margin change: -3047230.44.

## Reading utilisation honestly

Utilisation is an output. A high number is not a target and a low one is not a failure. A crude unit at 78.04 percent in an optimal plan is where a plan that maximises the margin (SECTION 12) stopped, under these prices and these limits. The margin tells you whether the month is good. The utilisation tells you where the plan stopped.

## Exercise

Read the crude unit utilisation for the plan as typed, 78.04, and for the hydrotreater shut, 28.28, and left blank, 80.10. Say what the three together show about which unit decides how much crude ABUA runs. Then say why the plan prints null, and neither 0.00 nor 100.00, for the hydrotreater's own utilisation in the shut and blank cases.
