# Man-hours, tonnage, number and spend

{{panel:pr-award-calculator}}

"Content" in this course has one meaning: Nigerian content, as a percentage, in the unit the Schedule names for the item. A pumping service is measured in man-hours. Casing is measured by tonnage. Valves are counted by number. A bid's content for an item is only comparable with the Schedule's minimum when it is measured the way the minimum is.

## The rule for an item

The engine's rule, in its basis:

> content = 100 x nigerian / total in the measured unit of the Schedule line; the item meets its minimum when content >= the minimum

For each item a bid reports three things: the measure it used, the Nigerian quantity and the total quantity. The units it accepts, listed in NC_MEASURES, are man-hours, tonnage, spend, length, number, volume and litres.

## A unit the Schedule does not use is refused

Valves are counted by number in the Schedule. A bid that reports its valves by tonnage is refused, verbatim:

> bids[0].items.valves.measure must be 'number', the unit the minimum is measured in; got 'tonnage'

The refusal protects the comparison: a tonnage share of valves can sit far from the count share, and the Schedule has already chosen the unit, so nobody picks the flattering one.

Two more checks keep the division honest. A total of zero cannot be divided by:

> bids[0].items.casing.total must be a finite number above 0

And a bid cannot report more Nigerian tonnes than it supplies:

> bids[0].items.casing.nigerian must be a number from 0 to total

## The two Ekene tenders

The well services tender measures all three of its items in man-hours, because the Schedule measures coiled tubing, pumping and stimulation services that way. The materials tender mixes units: tonnage for casing, cement and baryte, and number for valves.

On the materials tender, item by item:

| bid | casing (tonnage) | valves (number) | cement (tonnage) | baryte (tonnage) |
| --- | --- | --- | --- | --- |
| MS1 | 55.000000 | 50.000000 | 80.000000 | 55.000000 |
| MS2 | 60.000000 | 58.333333 | 82.000000 | 60.000000 |
| MS3 | 100.000000 | 62.500000 | 90.000000 | 65.000000 |
| MS4 | 55.000000 | 50.000000 | 80.000000 | 60.000000 |
| MS5 | 50.000000 | 41.666667 | 66.666667 | 50.000000 |

Each figure is a percentage in its own unit. MS2's valve content, 58.333333, is a share of valves counted; its casing content, 60.000000, is a share of tonnes. The two are not the same kind of quantity, and a single overall figure for MS2 needs a rule for combining them, which lesson 4 of this module takes.

## Spend is a unit too

NC_MEASURES lists spend beside the physical units, and the same check applies to it: the unit a Schedule line names is the only unit the engine accepts for that item. Spend also appears on the materials tender in a second role. Each materials bid weights its items by its own quoted amount for that item, the spend, when its item contents are combined into one overall figure. Lesson 4 reads that weighting.

## Exercise

Open the award calculator on the view "Nigerian content by item". It starts on the materials tender. In the first bid, change the valves measure from number to tonnage and read the refusal. Restore it, then set the first bid's casing total to 0 and read that refusal; restore it and set its casing nigerian quantity above its total. Finally restore the bid and read the reasons listed under the tables for each item below its minimum, noting the unit each reason names.
