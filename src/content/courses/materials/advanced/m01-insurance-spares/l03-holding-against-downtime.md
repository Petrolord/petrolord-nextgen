# Holding against downtime

{{panel:materials-spares-calculator}}

A spare on the shelf costs money every year it sits there. A failure with no spare costs money every day the unit waits. The engine prices both and adds them, and the number of spares that makes the sum smallest is the answer it returns. This lesson reads the two costs one at a time on the ESP motor.

## The holding cost

The holding charge is the unit cost times the holding rate, for each spare bought. The ESP motor costs 185000 and the stated holding rate is 0.2, so each spare adds 37000.000000 a year (derived: 185000 times 0.2). The engine charges every spare bought, whether it sits on the shelf or is in use while its replacement is on order. Its reading says so, verbatim:

> each unit waiting for a spare is one unit down, costed at downtimeCostPerDay; the holding charge falls on all n spares bought

A holding charge on the spares in stock alone is a different choice, and the last module of this tier lists it with the other conventions that are choices.

## The downtime cost

Each unit waiting for a spare is one unit down for as long as it waits. The engine multiplies the expected units down by the days a year and the downtime cost a day. The register states 18000 a day, and its note, verbatim:

> downtime cost per day: one well off production (synthetic figure)

With no spares, the expected units down are the mean orders outstanding, 0.821918, and the downtime cost is 5400000.000000 a year. Every spare added lowers the units down and raises the holding.

| spares | holding cost a year | downtime cost a year | total cost a year |
| --- | --- | --- | --- |
| 0 | 0.000000 | 5400000.000000 | 5400000.000000 |
| 2 | 74000.000000 | 409957.821135 | 483957.821135 |
| 4 | 148000.000000 | 12003.732064 | 160003.732064 |
| 6 | 222000.000000 | 179.621332 | 222179.621332 |

The total falls steeply, reaches its lowest at 4 spares, and then climbs again as holding outruns the downtime it saves.

## When downtime is cheap

The same motor with a downtime cost of 100 a day is a different decision. The engine keeps no spares, in its own words:

> 0 spares: holding 0 a year against expected downtime 30000, total 30000, the lowest for 0 to 6; one more spare adds 37000 of holding and saves 20455.05 of downtime

The failure rate, the lead time and the mean are unchanged. Only the price of waiting moved, and it moved the answer from four spares to none.

## A downtime cost below zero

A negative cost of waiting would reward failure. The engine refuses it, verbatim:

> downtimeCostPerDay must be a finite number at or above 0; got -1

A downtime cost of 0 is accepted: waiting then costs nothing, and the cheapest stock is no spares at all.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". In the table, check the holding column rises by the same step each row and the downtime column falls. Set "Downtime cost a day (stated)" to 0 and predict the cheapest number of spares before you read the tile. Set it to 100 and compare the reason with the quotation above, word for word. Then set it to -1 and read the refusal. Restore 18000 and write two sentences on which input carries the most weight in the ESP decision.
