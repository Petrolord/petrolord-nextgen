# Where the first valve goes

Valve 1 sits where the injection line first overcomes a full column of kill fluid standing on the unloading wellhead pressure. The depth depends on the injection pressure, and the injection pressure depends on the depth.

{{panel:pd-column-explorer}}

## A circular condition, solved by iterating

westTexasOil injects at a kickoff of 1014.7 psia against an unloading wellhead of 114.7 psia with kill fluid at 0.45 psi/ft. Treat the gas as weightless and the answer is 2000.000000000 ft. That is the seed, not the answer.

| Iterate | Injection pressure at the trial depth, psia | Next depth, ft | Move, ft |
| --- | --- | --- | --- |
| 1 | 1065.351890607 | 2112.559756904 | 112.559756904 |
| 2 | 1068.193632393 | 2118.874738652 | 6.314981747 |
| 3 | 1068.353036873 | 2119.228970830 | 0.354232178 |
| 4 | 1068.361978414 | 2119.248840920 | 0.019870090 |
| 5 | 1068.362479975 | 2119.249955500 | 0.001114580 |

Every move is a small fraction of the one before it. `topValveDepth` returns 2119.249955500 ft and the published valve 1 depth is 2119.249994721 ft.

## The weight of the gas always sends it deeper

| Case | Weightless seed, ft | Top valve, ft | Deeper by, ft | Percent |
| --- | --- | --- | --- | --- |
| westTexasOil | 2000.000000000 | 2119.249955500 | 119.249955500 | 5.9625 |
| deepHighPressure | 2400.000000000 | 2606.192537300 | 206.192537300 | 8.5914 |
| constantPressurePPO | 2261.904761905 | 2410.595626808 | 148.690864903 | 6.5737 |
| midDecrementKnifeEdge | 2195.652173913 | 2354.019550242 | 158.367376329 | 7.2128 |

The direction never changes, because gas in the annulus adds pressure on the way down and that pressure buys depth against the kill fluid. The size moves: 5.9625 percent on the 1014.7 psia system and 8.5914 percent on the 1414.7 psia one, since a heavier column at a higher pressure lifts more.

## The mistake

Quoting the seed. It is quick, it looks reasonable, and it is 119.249955500 ft too shallow on westTexasOil and 206.192537300 ft too shallow on deepHighPressure. A mandrel set that high never gets the depth back, because every valve beneath it is spaced from the one above.

The second version of the same mistake is stopping early. Iterate 1 lands at 2112.559756904 ft and iterate 2 at 2118.874738652 ft. Both look settled beside a seed of 2000.000000000 ft. Neither is.

## What the answer refuses to carry

The column behind it is static. There is no friction, no velocity and no injection rate in the annulus, so the pressure setting this depth is a shut-in gas column and not a flowing one. The kill fluid gradient is declared as an input, so 0.45 psi/ft is an assertion about the well and the engine honours whatever it is handed.

## Exercise

Run westTexasOil in the panel and read the top valve, then make the injection gas as light as the panel allows and read it again.

Write both depths, and say which one the weightless seed of 2000.000000000 ft sits closer to, and why that is not a recommendation.
