# The price deck and the step hold

A price deck is a list of dated points and the engine reads it as a staircase. It never averages two points and never escalates past the last one.

{{panel:ec-regime-explorer}}

## How the deck is read

`getPriceForYear` walks the deck in list order and keeps the last point whose `year` the current year has reached, so a deck is a step function that holds a price until the next point arrives.

The Designer's default project declares oil at 70 in year 1, 75 in year 5 and 80 in year 10. The applied price is 70.000000 USD per bbl in years 1 through 4, 75.000000 in years 5 through 9, and 80.000000 in years 10 through 25, sixteen consecutive years at one price, because the deck has no point after year 10 and the engine does not escalate.

ODIDI declares oil at 45 in year 1, 65 in year 6 and 85 in year 12, applied as 45.000000 through year 5, 65.000000 through year 11 and 85.000000 to the end.

## What a step does to revenue

Volume falls every year and price only changes at a step, so revenue falls smoothly between steps and jumps at them. Whether the jump wins depends on the size of the step against the size of the decline.

| year | default project grossRevenue | ODIDI grossRevenue |
| --- | --- | --- |
| 4 | 197.5024 | 88.6543 |
| 5 | 191.1513 | 76.1939 |
| 6 | 171.8074 | 93.9859 |

The default project steps from 70 to 75 USD per bbl at year 5 and revenue still falls, from 197.5024 to 191.1513 million USD, because a 10 percent oil decline outruns the price step. ODIDI steps from 45 to 65 USD per bbl at year 6 and revenue rises from 76.1939 to 93.9859 million USD even though every volume fell. Same mechanism, opposite sign.

## The mistake

The careful reader assumes interpolation, because most price decks in most tools interpolate. Under that assumption years 2, 3 and 4 of the default project would carry prices between 70 and 75. They do not. Every one of them reads 70.000000 USD per bbl, and the whole move from 70.000000 to 75.000000 arrives in a single row.

The second half of the mistake is assuming escalation. Year 25 of the default project is priced at 80.000000 USD per bbl, the same as year 10, because the deck's last point is year 10. A reader who expects any annual escalation will carry a growing shortfall through every year from 10 to 25 and will not be able to find where it came from, because no column anywhere in the output reports the price.

The diagnostic is to divide gross revenue by volume in a single stream probe and read the applied price directly. It is the only way to see the deck the engine is using.

## What the deck refuses

It refuses to interpolate, to escalate, to distinguish real from nominal, and to price a stream by anything but its own dated points. It also refuses to warn you: a deck whose last point is year 1 prices all 25 years at that number, and nothing in the output says so.

## Exercise

Write the applied oil price for years 1, 5, 9, 10 and 25 of the default project, then for years 5, 6, 11 and 12 of ODIDI. Then explain why the default project's year 5 step lowered revenue while ODIDI's year 6 step raised it.
