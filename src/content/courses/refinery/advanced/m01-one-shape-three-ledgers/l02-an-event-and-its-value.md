# An event and its value

An event carries a quantity and a value. This lesson reads how the engine gives the quantity a direction, which events emit by their nature, and what the value of an event means for each type.

{{panel:refinery-variance-explorer}}

## The quantity is never negative

makeEvent takes a quantity that is never negative. Direction comes from the event type. The engine reads the type and returns a signed quantity for the site's own stock of that material. For an event of 100 bbl, each type signs as follows:

| event type | signedQuantity of 100 bbl | emits by its nature |
| --- | --- | --- |
| receipt | 100 | false |
| delivery | -100 | false |
| transfer | 0 | false |
| unit_run | 0 | false |
| blend | 0 | false |
| burn | -100 | true |
| flare | -100 | true |
| vent | -100 | true |
| loss | -100 | false |

Read the table as a rule set. A receipt adds to the site. A delivery, a burn, a flare, a vent and a loss take away. A transfer, a unit_run and a blend sign to 0: each moves material inside the site, so the site as a whole holds the same quantity after the event.

Three types, burn, flare and vent, emit by their nature, and the flag says so on every event of those types. A loss removes barrels and emits nothing by its nature.

## Why the type carries the direction

A user typing a signed quantity has two ways to be wrong: the size and the sign. With the sign fixed by the type, a delivery of 100 bbl and a receipt of 100 bbl are typed the same way and read the opposite way. There is one place the direction is decided, and the variance engine relies on it in module 3, where a line's direction decides whether its gap helps or hurts margin.

## The value of an event

Every ODIOMA movement carries a value in US dollars. What the value means depends on the type. A delivery's value is what it sold for. Every other event's value is what it cost. So a crude receipt's value is the cost of the crude that arrived, and a unit_run's value is the operating cost of running the unit. In the ODIOMA plan the crude unit runs 1000000.00 bbl at an operating cost of 1.4000 a barrel and carries a value of 1400000.00.

This split is what later lets the engine say which lines are revenue and which are cost. A delivery line is revenue. A receipt line and a unit_run line are cost.

## A cost left out is null

An event recorded with no cost carries cost null, which is different from a cost of 0. A cost of 0 says the movement cost nothing. A null says nobody has costed it yet. The variance marks a line built from an uncosted event as costed false, so a reader can see that the line's money is incomplete. Every ODIOMA variance line reads costed true.

This is the same rule the screen and the plan follow when a box is left blank: an absent value and a typed zero are different statements, and the engine keeps them apart.

## Exercise

Read the signed quantity of 100 bbl for a receipt, a delivery and a unit_run, and say what each one does to the site's stock. Then read which three types emit by their nature, and say why a loss, which also signs to -100, is not flagged as emitting. Finally, say what a reader of a variance line should conclude when it reads costed false.
