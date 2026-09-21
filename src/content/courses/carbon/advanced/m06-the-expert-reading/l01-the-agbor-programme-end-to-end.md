# The Agbor programme end to end

This lesson reads the invented AGBOR programme as one record, from six costed measures to a path with its gap. Every figure is invented for this course, money is in US dollars, and the inventory is on the course's set, IPCC AR6 GWP100, fossil methane.

{{panel:carbon-abatement-explorer}}

## Six measures, one rate

Six measures are costed at a discount rate of 0.1, a fraction, each over its own life (module one). The costs per tonne run from -167.4364 USD for Tune the fired heaters to 78.1002 USD for Flare gas recovery. Three are negative and pay for themselves.

## The curve

The curve ranks them cheapest first and tiles the axis from 0:

| output | value |
| --- | --- |
| totalAbatementTonnes | 15460.000 |
| paysForItselfTonnes | 5310.000 |
| netAnnualCostOfAll USD | 290443.84 |
| weightedAverageCostPerTonne USD | 18.7868 |
| additive | false |

The weighted average is the net annual cost of all over the total tonnes. additive false comes with the interaction table: Tune the fired heaters and the Heat integration project both act on heaters, so the cumulative curve is an upper bound.

## The target and the curve

The lab computes the target as 30 percent of the inventory total of 56100.276 tCO2e: 16830.083 tCO2e. The curve is given two sources, heaters at 34927.743 and flare at 7562.133 tCO2e. The measures that act on steam, power and vents have no emission passed, and the engine gives the curve no verdict: meetsTarget none, with the targetBasis "not assessed: no computed emission to check the claims on steam, power, vents". With every source the inventory computes passed, the verdict is still none, on steam, which has no inventory line of its own.

## The path

The lab draws the target in a straight line from 56100.276 t in 2026 to 39270.193 t in 2033, 30 percent below the baseline, and counts each measure in full from its start year. The path prints firstShortfallYear 2027, with a gap of 494.298 t that year, and finalGapTonnes 1370.083. The engine reports the end-year gap as unabated with no measure identified, and does not draw it as a wedge.

Two variants change the reading. On the partial inventory, with the electricity factor blank, the baseline is 45112.276 tCO2e, reportable false, and the final gap reads 0.000 t with the first shortfall still in 2027. The course computes the full baseline less the partial as 10988.000 tCO2e, the purchased electricity line. With Vapour recovery on the storage tanks given no start year, the measure is named in unscheduledMeasures and the final gap is 3220.083 t; that gap less 1370.083 is 1850.000 t, the vapour recovery measure's tonnes a year.

## What is checked, and what is taught as printed

The course says the carbonAbatement oracle recomputes the cost per tonne from a year-by-year present value ledger, the curve by explicit rank and the path as a year ledger. It does not recompute the curve's residual to target or paysForItselfTonnes. The 5310.000 t that pays for itself is therefore taught as the engine prints it and never graded.

## What the record says

Read end to end, the Agbor record gives a ranked curve that is an upper bound and carries no target verdict, a path that falls short in 2027 and 2028 and again in 2033, and a gap of 1370.083 t that no measure in the programme closes.

## Exercise

Read totalAbatementTonnes, additive, the target in the end year, finalGapTonnes and firstShortfallYear, and the final gap on the partial inventory. Say what those figures, read together as one record, show about the Agbor programme and about which of them rests on a complete inventory.
