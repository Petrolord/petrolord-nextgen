# Annual usage value

{{panel:materials-register-calculator}}

Criticality asks how much it hurts to run out. ABC analysis asks a different question: where does the money go? A register of eighteen items rarely spreads its spending evenly, and a stores team that watches every item with the same care spends its attention badly. ABC sorts the register by the money that flows through each item in a year, so the few items that carry most of it get the closest watch.

## Usage times cost

The measure is the annual usage value: the annual usage times the unit cost. It needs two stated figures per item and nothing else.

| id | annual usage | unit cost | annual usage value |
| --- | --- | --- | --- |
| ESP-MTR | 2 | 185000 | 370000.000000 |
| CSG-958 | 240 | 1450 | 348000.000000 |
| BARYTE | 300 | 260 | 78000.000000 |
| CEM-G | 180 | 420 | 75600.000000 |
| PSV-KIT | 6 | 3800 | 22800.000000 |
| HEAT-TRC | 0 | 3100 | 0.000000 |

Two very different items sit at the top. The ESP motor is used twice a year, but each unit costs 185000. The casing is cheap by comparison, but 240 joints go out a year. Annual usage value treats both the same way: it is the money, and the money is what ABC ranks. The heat tracing controller has no usage, so its value is 0.000000 however much it cost to buy.

## The share of the total

Across the whole register the total annual usage value is 1580620.000000. Each item's share is its value over that total, in percent. The ESP motor's share is 23.408536 percent; the casing's is 22.016677. Two items, between them, account for close to half of the register's yearly spending.

## A stated policy, cited

The engine's basis for ABC cites lecture 11 slide 4 of the MIT course, and adds in its own words that the classes are arbitrary, so the cut-offs are the caller's stated policy. The source supports ranking by value; where the lines between A, B and C fall is a decision you write down. The next two lessons take the ranking and the cut-offs in turn.

## When the register cannot be ranked

A usage or a unit cost below zero is refused by name:

> items[0].annualUsage must be a finite number at or above 0; got -1

An item may have zero value, as HEAT-TRC does. A register in which every item has zero value is refused, because there is no total to share out:

> items must carry some annual usage value; every annualUsage x unitCost is 0

## Exercise

Open the register calculator, set the View to "ABC by annual usage value" and start from "The Ekene register, at-or-below". Pick three items the table above does not show, read their annual usage and unit cost from the box, and work each annual usage value and share by hand. Check your figures against the panel. Then change BARYTE's annualUsage in the box from 300 to 1200, note its new rank, and restore it.
