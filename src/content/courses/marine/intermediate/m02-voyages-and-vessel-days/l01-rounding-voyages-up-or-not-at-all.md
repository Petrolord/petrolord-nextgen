# Rounding voyages up or not at all

{{panel:marine-voyage-calculator}}

The Ekene week needs 3.100000 voyages of demand. A vessel cannot sail a tenth of a voyage, so the plan must say what happens to the fraction. The engine does not decide: `voyageRounding` is a required input with two values, and a fleet call without it is refused.

## The two rules

"up" rounds each voyage set to whole voyages, the smallest whole number at or above the voyages needed. This is the week a planner can actually sail: four sailings carry what three could not.

"none" keeps the fraction. It is the long-run average over many periods, the right figure for a budget spread across a year, and no single week can sail it.

| rule | voyages before rounding | voyages | voyage days | vessel-days |
| --- | --- | --- | --- | --- |
| up | 3.100000 | 4 | 2.586364 | 10.345455 |
| none | 3.100000 | 3.100000 | 2.586364 | 8.017727 |

The gap between 10.345455 and 8.017727 vessel-days is the price of sailing whole voyages in one week. A plan quotes the voyage count with its rounding rule for that reason.

A third word is refused, however natural it sounds:

> voyageRounding must be one of "up", "none"; got "nearest"

## Rounding up at its boundary

Rounding up sounds simple until the voyages needed land on a whole number. The inputs are decimals, the arithmetic is binary, and a demand that is exactly three voyages can come back a hair above or below 3 in the last digit. The engine compares counts at twelve significant digits, so a ratio that agrees with 3 to twelve digits counts as 3.

The golden cases, each one dedicated installation driven by its deck area:

| deck demand, m2 | deck area capacity, m2 | voyages |
| --- | --- | --- |
| 300 | 100 | 3 |
| 0.3 | 0.1 | 3 |
| 2.1 | 0.7 | 3 |
| 300.001 | 100 | 4 |

The first three are three voyages of demand, whatever the binary arithmetic leaves in its last digit. The fourth asks for a thousandth of a square metre more than three voyages carry, and that is a real fourth voyage. The twelve-digit comparison is a convention the engine states; the alternative, a ceiling taken on the raw binary figure, would plan a fourth voyage for the case of 2.1 over 0.7. The Expert tier examines the rule at its boundaries.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Ekene week, PSV milk run".

1. Confirm 4 voyages and 10.345455 vessel-days with the control "Voyage rounding (stated)" on "up".
2. Switch the control to "none". Before you read the result, predict the voyages and the vessel-days from the table above, then confirm 8.017727.
3. Set the control to "not stated" and read the refusal. Restore "up".
4. Start from "Just over three voyages" and confirm 4. Change "installation X: deck demand, m2 (stated)" to 300 and predict the voyages before you read them.
5. Start from "A decimal ratio of three" and confirm 3 voyages.
