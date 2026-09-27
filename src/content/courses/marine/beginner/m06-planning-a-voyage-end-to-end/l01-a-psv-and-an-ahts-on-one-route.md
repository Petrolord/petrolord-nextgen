# A PSV and an AHTS on one route

{{panel:marine-voyage-calculator}}

A cluster's supply base often has more than one kind of vessel available. A platform supply vessel (PSV) is built for cargo, with a long clear deck and large tanks. An anchor handling tug supply vessel (AHTS) is built to tow and handle anchors, and carries cargo as a second role. This lesson puts both Ekene vessels on the same milk run with the same cargo and reads which one makes a plan.

## The same route, the same cargo

Both voyages sail the Ekene milk run with the rainy-season factor of 1.2 on sailing and field time, the same port and field hours and the same fuel price. Only the vessel changes.

| vessel | speed, knots | total hours | fuel t | fuel cost | binding | feasible |
| --- | --- | --- | --- | --- | --- | --- |
| PSV Ekene Star (synthetic) | 11 | 62.072727 | 19.876364 | 17292.436364 | deck area at 0.900000 | true |
| AHTS Ekene Tide (synthetic) | 12 | 60.200000 | 23.880000 | 20775.600000 | deck area at 1.309091 | false |

## Faster, dearer and too small

The AHTS sails at 12 knots, so it covers the route in fewer hours. It burns more fuel an hour in every activity, so it burns more fuel in all, even over the shorter voyage. And its smaller deck, deadweight and water tank cannot hold the cargo: deck area, deadweight and tank water are all overloaded.

The PSV is slower and carries the cargo with room on every constraint. A faster voyage that does not fit is no plan at all.

## Reading the comparison fairly

The comparison is fair because only the vessel changed. The weather factor, the activities it slows, the port and field hours and the price are the same in both rows, so every difference in the table comes from the vessel's own stated figures. Change the weather on one side and the comparison would mix two effects.

## When the AHTS is the right tool

The AHTS is no worse a vessel; it is a different one. With a lighter cargo, or on a dedicated voyage to one installation, its speed could shorten a trip that fits within its limits. The engine answers which vessel carries a stated cargo on a stated route. Which vessel a company should hire, and at what rate, is a question for the procurement course.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan". Set Start from to "Ekene PSV milk run, rainy season" and then to "Ekene AHTS milk run", and check both rows of the table against the panel. On the AHTS start, read the vessel controls and name the three stated figures that cause the three overloads. Then set "Weather factor (stated)" to 1 and predict, before reading, whether the calm AHTS voyage becomes feasible.
