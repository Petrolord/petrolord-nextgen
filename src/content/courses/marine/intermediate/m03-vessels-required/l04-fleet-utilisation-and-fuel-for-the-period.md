# Fleet utilisation and fuel for the period

{{panel:marine-voyage-calculator}}

Two more figures close a fleet result. Fleet utilisation says how much of the fleet's time the voyages use. Fuel for the period says what the voyages burn and what that fuel costs at the stated price. Both are simple once the vessel-days and the voyages are known, and both are easy to misread.

## Fleet utilisation

Fleet utilisation is the need over the capacity: the vessel-days the voyages take divided by the vessels times their available days. On the Ekene week with two PSVs it is 0.795804. The golden cases show the range:

| case | vessel rounding | vessel-days | vessels | fleet utilisation |
| --- | --- | --- | --- | --- |
| Ekene week, PSV milk run | up | 10.345455 | 2 | 0.795804 |
| Ekene week, calm | up | 8.954545 | 2 | 0.688811 |
| vessels not rounded | none | 9.916667 | 1.416667 | 1.000000 |
| vessels to the nearest, short | nearest | 9.916667 | 1 | 1.416667 |

Rounding vessels up keeps the fleet utilisation at or below 1. Keeping the fraction makes it exactly 1, by construction: the fleet is sized to the need. A figure above 1 is a short fleet, and the short vessel-days say by how much.

The fleet utilisation is always of the fleet. It is a different figure from a constraint's utilisation on one voyage, which the Associate tier read, and from the average utilisation of each constraint over the period, which the constraint table in this view prints beside the demand.

## Fuel for the period

Fuel for the period is the voyages of each set times the fuel of one of its voyages, added over the sets; its cost is the tonnes times the stated price. On the Ekene milk run one voyage burns 19.876364 t, and four voyages burn 79.505455 t, which costs 69169.745455 at 870 a tonne (engine). The rainy-season factor reaches the fuel through time: the calm week burns 66.494545 t and costs 57850.254545. The dedicated week, with eight voyages, burns 85.461818 t and costs 74351.781818.

Fuel follows the voyages actually sailed, so it follows the voyage rounding rule. With "none" the fuel is the average for 3.100000 voyages. It does not follow the vessel rounding: an idle vessel burns nothing in this engine, which counts voyage fuel only.

## What the figures do not include

The engine prices fuel and nothing else. There is no hire rate, no port fee and no discounting: the cost of the fleet over a year, and its present value, belong to the cash flow course. A plan quotes the fuel cost with its burns and its price.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Ekene week, PSV milk run".

1. Read the tiles "Fleet utilisation", "Fuel for the period, t" and "Fuel cost for the period", and confirm the figures above.
2. Change "Fuel price a tonne (stated)" to 1000. Predict the new fuel cost by hand, then read it. Say whether the fleet utilisation moves.
3. Restore 870 and switch "Voyage rounding (stated)" to "none". Predict the fuel tonnes from one voyage's burn, then read the tile.
4. Start from "Vessels to the nearest, short" and confirm a fleet utilisation of 1.416667 beside the short vessel-days.
