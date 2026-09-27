# Rounding vessels up, to the nearest or not at all

{{panel:marine-voyage-calculator}}

The vessels before rounding are a fraction, and a fleet is whole ships. The second rounding rule, `vesselRounding`, says what to do with the fraction. It is required, with three values, and the engine refuses a call that leaves it out:

> vesselRounding must be one of "up", "nearest", "none"; got nothing

## Three rules on one need

The golden cases below state one installation whose week needs 9.916667 vessel-days, with 7 days available a vessel, so 1.416667 vessels before rounding. Only the rule changes:

| rule | vessels | capacity, vessel-days | spare | short |
| --- | --- | --- | --- | --- |
| up | 2 | 14.000000 | 4.083333 | 0.000000 |
| nearest | 1 | 7.000000 | 0.000000 | 2.916667 |
| none | 1.416667 | 9.916667 | 0.000000 | 0.000000 |

"up" never leaves the need uncovered: the fleet holds at least the vessel-days the voyages take, and the rest is spare. "nearest" takes the closer whole vessel, which here is one, and the week is short. "none" keeps the fraction, the average share of a vessel over many periods, the figure for a pooled fleet that serves several fields and for a budget line.

A planner chooses the rule by what the fleet is for. A dedicated charter for one cluster sails whole vessels, and a shortfall means cargo left on the quay, so "up" is the usual choice. A study of a shared pool may prefer "none". "nearest" is a compromise that accepts some short weeks for fewer idle days; the next lesson shows exactly what it leaves uncovered.

## The half

"nearest" needs a rule at exactly one half. The engine rounds a half up: on the golden case with 10.500000 vessel-days over 7 days, 1.500000 vessels round to 2. This is a reading the engine states. The alternative rounds halves down, which would give 1 vessel, and that week would be short. A plan that rounds to the nearest names which way its halves go.

## The Ekene week

On the Ekene PSV milk run, 1.591608 vessels round to 2 by "up" and to 2 by "nearest" as well, since the fraction is above one half. The two rules agree here, and the Ekene case sized by the nearest rule returns the same 2.654545 spare vessel-days as the one rounded up. They part company only when the fraction falls below one half. That is why a plan states both rounding rules, voyages and vessels, even when a week's figures happen to agree: next month's demand may not.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period".

1. Start from "Vessels rounded up" and confirm the first row of the table above in the tiles.
2. Switch the control "Vessel rounding (stated)" to "nearest". Before you read the result, predict the vessels, the spare and the short vessel-days, then read the tiles and the reason.
3. Switch it to "none" and confirm the third row.
4. Start from "A half rounds up" and confirm 2 vessels from 1.500000.
5. Start from "Ekene week, PSV milk run" and switch the rule to "none". Predict the vessels tile before you read it.
