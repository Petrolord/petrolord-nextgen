# The three levers, pulled one at a time

Three inputs on the dehydration page move the answer for three different reasons. The spec, the circulation ratio and the reflux ratio. Each table below moves one of them and holds the rest, which is the only way to see what a lever actually does.

{{panel:fc-water-explorer}}

## The spec

| outlet spec, lb/MMscf | water out, lb/day | circulation, gpm | reboiler, MMBtu/hr |
| --- | --- | --- | --- |
| 7.000000 | 2879.9235 | 6.399830 | 0.697269 |
| 2.000000 | 3189.9235 | 7.088719 | 0.772324 |
| 0.500000 | 3282.9235 | 7.295386 | 0.794841 |

The spec moves the load, and the load carries everything with it in the same direction. It is the only one of the three levers that changes how much water leaves the gas.

## The circulation ratio

| gal per lb | circulation, gpm | Btu per gal | reboiler, MMBtu/hr |
| --- | --- | --- | --- |
| 2.000000 | 3.999894 | 2073.6650 | 0.497666 |
| 3.200000 | 6.399830 | 1815.8525 | 0.697269 |
| 5.000000 | 9.999734 | 1661.1650 | 0.996673 |

The ratio moves the gallons and the heat per gallon in opposite directions. The water removed a day does not appear in this table because the ratio does not touch it.

## The reflux ratio

| reflux ratio | overhead, Btu/gal | total, Btu/gal | reboiler, MMBtu/hr |
| --- | --- | --- | --- |
| 0.000000 | 343.7500 | 1729.9150 | 0.664270 |
| 0.250000 | 429.6875 | 1815.8525 | 0.697269 |
| 0.600000 | 550.0000 | 1936.1650 | 0.743468 |

The reflux ratio reaches the overhead term only. The circulation is absent from this table for the same reason the water removed was absent from the last one.

## Three levers, three places in the chain

The reason the three behave so differently is that they enter the chain at three different heights. The spec enters near the top, at the subtraction that makes the load, so everything below it moves. The circulation ratio enters in the middle, once the load stands in pounds a day, so it can change gallons and heat per gallon and can never change pounds. The reflux ratio enters near the bottom, inside one of the two heat terms, so its reach is the shortest of the three.

Height in the chain therefore predicts how much of an answer a lever disturbs. That is a property of any chain with no feedback in it.

## What a one at a time table is and is not

Each of these is a partial. It says what happens when one input moves and every other input on the page is pinned. That is exactly what you need for understanding a mechanism and exactly what you must not use for predicting a plant, because in a real change more than one thing moves.

A spec tightening usually arrives with a rate change. A ratio change usually arrives because something else was already in question. The tables give the direction and the mechanism of each lever. They do not give the outcome of a decision that pulls two.

Reading these tables well means holding two questions apart. What does this lever do, and what would I actually do. They answer the first completely and the second not at all.

## The lever that is missing

There is a fourth handle that does not appear on this page at all, and it is the gas temperature. Cooling the gas before the contactor lowers the inlet content, and a lower content is a smaller load before any glycol is involved. It is worth remembering that one of the strongest handles on a dehydration package sits upstream of the package itself, in the equipment that sets the temperature at which the gas arrives.

## Exercise

For each of the three tables, name the input that moved, name every column that moved with it, and name at least one quantity that is absent from that table because the lever cannot reach it.
