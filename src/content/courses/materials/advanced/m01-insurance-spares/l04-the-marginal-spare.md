# The marginal spare

{{panel:materials-spares-calculator}}

The cheapest number of spares can be found by reading the whole table, and it can be found faster by asking one question at each step: does one more spare save more downtime than it costs to hold? The engine answers that question in its own reason, and this lesson reads it.

## One more spare

Each spare of the ESP motor adds 37000.000000 a year of holding (derived: 185000 times 0.2). What it saves is the fall in the downtime cost from one row of the table to the next. The early spares save a great deal, because the first few orders outstanding are likely; later spares guard against ever rarer piles of orders and save less and less.

| spares | downtime cost a year | total cost a year |
| --- | --- | --- |
| 3 | 77347.405085 | 188347.405085 |
| 4 | 12003.732064 | 160003.732064 |
| 5 | 1577.882952 | 186577.882952 |

Going from four spares to five saves 10425.849112 a year of downtime (derived from the table) and adds 37000.000000 of holding. The fifth spare costs more than it saves, so four is the cheapest. The engine's reason puts the same comparison in one line, verbatim:

> 4 spares: holding 148000 a year against expected downtime 12003.73, total 160003.73, the lowest for 0 to 6; one more spare adds 37000 of holding and saves 10425.85 of downtime

The reason prints money to the cent. The figures a lesson reasons with are the fields at six decimals: a total of 160003.732064 and a saving of 10425.849112.

## Why the marginal view helps

The marginal comparison tells a planner how firm an answer is. At the ESP motor's four spares the fifth saves well under a third of its holding, so a modest change in the downtime cost will not move the answer. Doubling the downtime cost doubles every saving, and the fifth spare still saves less than it costs; four remains the cheapest. A cheaper holding charge moves it sooner, because every step of holding shrinks while the savings stay put.

## Free holding

The limit case is a holding charge of nothing. Every spare is then free to keep, each one saves some downtime, and the cheapest stock is always the largest searched. On the ESP motor with a holding rate of 0 and a search limit of 3, the engine says so, verbatim:

> 3 spares: holding 0 a year against expected downtime 77347.41, total 77347.41, the lowest for 0 to 3; the search stopped at maxSpares 3, so a larger stock may cost less

No stated holding rate can be left out: the engine refuses a missing one by name, and a rate of 0 is a stated choice with this consequence.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". From the table, compute the downtime each spare saves from 0 up to 6 and mark the first step where the saving falls below the holding step. Check that it matches the tile. Now double the downtime cost a day and predict whether the cheapest stock moves; read the tile. Restore it, set "Holding rate a year (stated)" to 0.05 and predict again: the cheapest stock moves to 5. Finally set the holding rate to 0 and "Search limit, the most spares (stated)" to 3, and compare the reason with the quotation above.
