# The Act and its Schedule

{{panel:pr-award-calculator}}

A tender for oil and gas work in Nigeria is evaluated under a second law besides the procurement rules: the Nigerian Oil and Gas Industry Content Development Act 2010. This module measures what that Act asks a bid to contain. The next two modules apply what it does with the measurement at the award.

## The text and its edition

The course reads the Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2), commenced 22 April 2010, as enacted, read on 2026-09-26. It is a public text. The engine reads three parts of it:

* s.11 and the Schedule: the minimum Nigerian content for each listed item and the unit it is measured in;
* s.14: bids within 1% of each other at the commercial stage, which module 5 takes;
* s.16: a Nigerian indigenous company within 10 percent, which module 6 takes.

The engine returns its citation in its own words with every content result:

> Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2, commenced 22 April 2010) s.11 and the Schedule as enacted in 2010 (later Board targets are not included)

## The Schedule, as the engine holds it

The engine carries 45 lines of the Schedule, in three of its sections: MATERIALS AND PROCUREMENT (12 lines), WELL AND DRILLING SERVICES/PETROLEUM TECHNOLOGY (24 lines) and EXPLORATION, SUBSURFACE, PETROLEUM ENGINEERING AND SEISMIC (9 lines). Each line has a minimum and a measured unit. The lines the two Ekene tenders use:

| Schedule line (engine key) | item as printed in the Schedule | minimum | measured in |
| --- | --- | --- | --- |
| coiled-tubing-services | Coiled Tubing Services | 75% | man-hours |
| pumping-services | Pumping Services | 95% | man-hours |
| well-overhauling-stimulation-services | Well Overhauling/Stimulation Services | 85% | man-hours |
| steel-pipes | Steel Pipes | 100% | tonnage |
| valves | Valves | 60% | number |
| cement-portland | Cement (Portland) | 80% | tonnage |
| drilling-mud-baryte-bentonite | Drilling mud-Baryte, Bentonite | 60% | tonnage |

Every minimum here is read from the gazetted Schedule and cited to s.11.

## The 2010 Schedule only

The Act lets the Nigerian Content Development and Monitoring Board set a level for an item the Schedule does not list (s.11(2)). The course read no later Board target, so the engine carries the 2010 Schedule and nothing added since. A later target can still be used: it enters as a target the user states, with its source written beside it, and the last lesson of this module shows how.

That is the course's rule for every legal figure: read and cited, or stated by the user with its source.

## Naming a Schedule line

An item in a tender is tied to its Schedule line by the engine key. The well services tender ties its coiled tubing item to coiled-tubing-services; the materials tender ties its casing item to steel-pipes. A key the engine does not hold is refused, and the refusal says what to do instead:

> items[0].scheduleLine 'casing-and-tubing' is not a line of NC_SCHEDULE; state targetPct, measure and source instead

Choosing the line is the evaluator's judgement, and the report states it.

## Exercise

Open the award calculator and choose the view "Nigerian content by item". It starts on the materials tender's four items and five bids. Read the second table, which lists each item's minimum, its measured unit and its source as the engine returns them, and match it to the Schedule table above. Then change the casing item's scheduleLine to casing-and-tubing and read the refusal. Put it back to steel-pipes and read the note under the tables, which states how many Schedule lines the engine carries.
