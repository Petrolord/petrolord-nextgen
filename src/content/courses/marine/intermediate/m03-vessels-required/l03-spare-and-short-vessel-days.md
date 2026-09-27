# Spare and short vessel-days

{{panel:marine-voyage-calculator}}

Once the vessels are whole, the fleet has a supply of time to set against the need. The engine calls it the capacity in vessel-days: the vessels times the days each is available. Two figures follow from it, and a fleet result always carries both. Spare vessel-days are the capacity less the need, when the capacity is at least the need. Short vessel-days are the need less the capacity, when the need is larger. One of the two is always zero.

## The Ekene week

Two PSVs at 6.5 available days each hold more time than the milk run's 10.345455 vessel-days need, and the engine returns 2.654545 spare vessel-days (engine). Spare time is not waste in a supply plan. It is the room that absorbs a day of weather worse than the stated factor, a late cargo, or an unplanned trip to a drilling unit that has run short of barite.

## When the rule leaves the need uncovered

A shortfall can only come from a vessel rule that rounds below the need: "nearest" when the fraction is under one half, or a vessel count the planner fixes too low. The golden case with 9.916667 vessel-days over 7 available days rounds 1.416667 vessels to 1 under "nearest", and the engine returns the shortfall with a reason, verbatim:

> 1 vessel gives 7 vessel-days against 9.916667 needed: short by 2.916667 vessel-days

The reason prints the need to six decimals with trailing zeros dropped; the tile "Short vessel-days" holds the field, 2.916667, and that field is the figure to reason with. Like the long voyage of module two, this is a result with a reason. The engine computed the fleet the rule asked for and says what it fails to cover.

## The boundary

The comparison is made at twelve significant digits, and a need exactly equal to the capacity is covered. The golden case whose voyages take exactly 14.000000 vessel-days with 7 days a vessel returns 2 vessels, 0.000000 spare and 0.000000 short, with a fleet utilisation of 1.000000. There is no margin in that week at all: the smallest addition to the need tips it over.

| case | vessel rounding | vessels | spare | short |
| --- | --- | --- | --- | --- |
| Ekene week, PSV milk run | up | 2 | 2.654545 | 0.000000 |
| vessels to the nearest, short | nearest | 1 | 0.000000 | 2.916667 |
| exactly two vessels of vessel-days | up | 2 | 0.000000 | 0.000000 |

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period".

1. Start from "Vessels to the nearest, short". Read the reason and the tile "Short vessel-days", and confirm that they carry the same figure.
2. Start from "Exactly two vessels of vessel-days". Confirm 2 vessels with nothing spare and nothing short.
3. Raise "Port hours a voyage (stated)" by one hour. Before you read the result, predict whether "up" still gives 2 vessels, and what happens to the spare vessel-days.
4. Keep the extra hour and switch "Vessel rounding (stated)" to "nearest". Predict whether the fleet is short, and read the reason.
5. Start from "Ekene week, PSV milk run", switch the vessel rule to "nearest" and set "Days a vessel is available (stated)" to 3. Predict the vessels and whether a reason appears.
