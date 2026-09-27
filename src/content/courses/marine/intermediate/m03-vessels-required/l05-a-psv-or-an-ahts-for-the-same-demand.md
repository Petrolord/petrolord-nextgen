# A PSV or an AHTS for the same demand

{{panel:marine-voyage-calculator}}

The Ekene cluster has two vessels. The PSV Ekene Star is the cargo carrier: 800 m2 of deck, 3500 t of deadweight, large tanks, 11 knots. The AHTS Ekene Tide is built to tow and handle anchors and carries cargo as a second job: 550 m2 of deck, 2200 t of deadweight, smaller tanks, and 12 knots with a heavier fuel burn. Both are synthetic. The Associate tier put one voyage's cargo on each and found the AHTS overloaded. This lesson asks the fleet question of both, for the same week of demand.

## Four weeks side by side

Voyages rounded up, vessels rounded up, the rainy-season factor on sailing and field time, fuel at 870 a tonne:

| case | voyages by set | vessel-days | vessels before rounding | vessels | spare vessel-days | fleet utilisation | fuel t | fuel cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PSV milk run | 4 (deck area) | 10.345455 | 1.591608 | 2 | 2.654545 | 0.795804 | 79.505455 | 69169.745455 |
| AHTS milk run | 5 (deck area) | 12.541667 | 1.929487 | 2 | 0.458333 | 0.964744 | 119.400000 | 103878.000000 |
| PSV dedicated | EKA 2, EKJ 3, EKB 1, EKF 2 (minimum visits) | 11.881818 | 1.827972 | 2 | 1.118182 | 0.913986 | 85.461818 | 74351.781818 |
| AHTS dedicated | EKA 2, EKJ 3, EKB 1, EKF 2 (minimum visits) | 11.433333 | 1.758974 | 2 | 1.566667 | 0.879487 | 98.880000 | 86025.600000 |

## On the milk run the deck decides

The AHTS's usable deck is 412.5 m2 against the PSV's 600.000000, so the same 1860.000000 m2 of weekly deck demand needs 5 voyages where the PSV needs 4. A voyage plan with one voyage's cargo found the AHTS overloaded; fleet sizing answers the same shortfall by sailing more often. The AHTS's extra knot saves a little time on each voyage, and the extra voyage costs far more, so its week needs 12.541667 vessel-days. Both round to 2 vessels, and the AHTS pair is left with under half a vessel-day spare against the PSV pair's 2.654545: a week with almost no slack for weather worse than the stated factor.

## On dedicated voyages the speed decides

Sized one installation at a time, both vessels are driven by the minimum visits, so both sail the same eight voyages. Here capacity leaves them level and speed separates them: the faster AHTS spends fewer hours on each voyage and needs 11.433333 vessel-days against the PSV's 11.881818. The AHTS still burns more fuel, 98.880000 t against 85.461818, because it burns more tonnes an hour.

## What the comparison teaches

Which vessel is better depends on the route and on which figure the planner cares about. On a milk run the deck binds and the PSV wins on every line. On dedicated voyages the visits bind and the AHTS wins on time and loses on fuel. The engine does not choose: it states each figure with the route, the vessel and the rules that made it, and the planner reads them together.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period".

1. Start from "Ekene week, AHTS milk run" and confirm the second row of the table. In the constraint table, find the ratio that sets 5 voyages.
2. Change "Deck area, m2 (stated)" from 550 to 800, the PSV's deck. Before you read the result, use the constraint table to predict the new driver and the voyages. Then read them, and explain why a tank now names the count although the deck matches the PSV's.
3. Start from "Ekene week, AHTS dedicated" and "Ekene week, PSV dedicated" in turn, and confirm the last two rows.
4. For each of the four starts, write down one sentence that a planner would put in a plan, naming the route, the vessel, both rounding rules and the vessel-days.
