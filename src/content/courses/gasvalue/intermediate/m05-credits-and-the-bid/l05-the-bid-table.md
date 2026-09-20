# The bid table

compareRoutes answers the last question in the studio's question table: how do the routes compare in a bid. It lays the routes side by side, with each route's verdict, its capital, its year and its net abatement in one row.

{{panel:gasvalue-route-explorer}}

## EGBEMA, with the study's limits

| route | verdict | capitalCost | revenuePerYear | grossMarginPerYear | valuePerMscf | netAbatementTonnesCo2ePerYear |
| --- | --- | --- | --- | --- | --- | --- |
| Compressed natural gas | passes | 29337983.06 | 23840025.00 | 21008150.00 | 7.8904 | 218032.865 |
| Mini LNG | fails | 42870938.50 | 18232134.38 | 11301509.38 | 4.2447 | none declared |
| LPG and condensate extraction | passes | 29331801.26 | 5335863.00 | 1990363.00 | 0.7476 | none declared |
| Gas to power or gas to wire | not fully screened | 32753824.67 | 12338557.50 | 7540432.50 | 2.8321 | none declared |

Every column is one this tier has read. The verdict is module 1's screen. The capital is module 3's power law. The revenue, margin and value per Mscf are module 3's year. The net abatement is module 4's counterfactual, and only the CNG route carries one declared, against diesel. The other three read none declared.

A route that fails screening stays in the table with its failure named. Mini LNG keeps its full row.

The credit test of this module's first four lessons reads one row of this table. The CNG row's gross margin, 21008150.00, and its net abatement against diesel, 218032.865, are the two route figures behind the breakeven credit price of 16.0152.

## The fields beneath the table

| field | value |
| --- | --- |
| bestByValuePerMscf | cng |
| leaderNotFullyScreened | null |
| screenedOut | Mini LNG |
| notFullyScreened | Gas to power or gas to wire |
| rankingNote | Ranked on gross margin per Mscf, which ignores the capital. Compare that against the capital column before concluding, and value the shortlist in the sanctioned economics engine. |

bestByValuePerMscf reads cng. screenedOut names mini LNG, the route that fails. notFullyScreened names gas to power, the route with Maximum inerts unchecked. leaderNotFullyScreened reads null.

## The ranking note

The ranking note says what the ranking reads and what it leaves out: "Ranked on gross margin per Mscf, which ignores the capital." Then it says what to do: "Compare that against the capital column before concluding, and value the shortlist in the sanctioned economics engine."

The capital column sits in the same table as the value per Mscf. CNG's capital is 29337983.06 and LPG's is 29331801.26. Their values per Mscf are 7.8904 and 0.7476. The table prints no ratio or difference between the columns, and this lesson draws none. The valuation of the shortlist belongs to the sanctioned economics engine, which the note names.

## As the studio opens

With every limit unset, as the studio opens, no route passes screening, and the same economics give different fields:

| field | value |
| --- | --- |
| bestByValuePerMscf | null |
| leaderNotFullyScreened | cng |
| rankingNote | No route passes screening yet, so none is ranked best. Compressed natural gas leads on value among routes not fully screened; set the limits before relying on it. |

bestByValuePerMscf reads null. The engine names no best route until one passes. CNG still leads on value, and the engine reports it in its own field, leaderNotFullyScreened, with a note: "set the limits before relying on it."

Read the two cases together. The year figures are the same in both. The limits differ. With the study's limits typed, cng is bestByValuePerMscf. With none typed, cng is leaderNotFullyScreened and nothing is best.

## One ranking, one basis

The ranking has one basis, and the note names it: gross margin per Mscf. The net abatement is a column of the table, with 218032.865 on CNG and none declared on the other three. The capital is a column too. Neither is the basis of bestByValuePerMscf, and the note sends the capital comparison, and the valuation of the shortlist, to the reader and to the sanctioned economics engine.

In the panel, clear every limit and read bestByValuePerMscf and leaderNotFullyScreened change places. Then type the EGBEMA limits back and read screenedOut and notFullyScreened fill.

## Exercise

Read the bid table's fields with the study's limits and with every limit unset. For each case, give bestByValuePerMscf and leaderNotFullyScreened. Name the route in screenedOut and the route in notFullyScreened, with the verdict each carries. Then quote the ranking note's first sentence and say which column it tells the reader to compare against.
