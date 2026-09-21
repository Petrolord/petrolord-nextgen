# The annual streams

A margin per barrel and a throughput are enough to judge a barrel. To judge a project, the screen lays them out over the plant's life, one row per year, and hands the rows on to be valued. Those rows are the annual streams.

{{panel:refinery-screen-explorer}}

## OKORDIA's streams

OKORDIA has 2 construction years and 20 operating years. feasibilityStreams prints:

| year | producing | crude run (bbl) | revenue | crude cost | fixed opex | variable opex | capex |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | false | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 32000000.00 |
| 1 | false | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 32000000.00 |
| 2 | true | 1518000.00 | 127193220.00 | 115368000.00 | 7500000.00 | 4857600.00 | 0.00 |
| 3 | true | 1518000.00 | 127193220.00 | 115368000.00 | 7500000.00 | 4857600.00 | 0.00 |
| 21 | true | 1518000.00 | 127193220.00 | 115368000.00 | 7500000.00 | 4857600.00 | 0.00 |

Years in the streams: 22, the construction years plus the operating years. The table shows years 0 to 3 and the last year, 21.

## Reading the columns

Producing says whether the plant runs that year. It reads false in the construction years and true from year 2.

Crude run is the annual throughput, 1518000.00 bbl, in every producing year shown. It is zero while the plant is being built.

Revenue, crude cost and variable opex are the year's money on the crude run, and the screen prints how each is built. Revenue = crude run x gross value per barrel: 1518000.00 x 83.7900 = 127193220.00. Crude cost: 1518000.00 x 76.0000 = 115368000.00. Variable opex: 1518000.00 x 3.2000 = 4857600.00. Fixed opex is the yearly figure the gross margin leaves out, and it starts in the first producing year: year 1 0.00, year 2 7500000.00. Capex carries the capital of 64000000.00, spread evenly across the construction years: 32000000.00 in year 0 and 32000000.00 in year 1.

## What the streams are for

The streams are what feasibilityEconomics hands to the screening engine. That engine values them and returns the figures the Studio shows as an NPV and an IRR; the Economics courses teach both. This tier stops at the streams, because every figure the valuation uses is already visible in them. If the valuation looks wrong, the cause is on one of these rows.

## What the streams assume

The screen checks the rows it does not print: every producing year carries the same figures as year 2, true, from the first producing year, year 2, to the last, year 21. That is the screen's simplification: one year, repeated. It keeps the valuation traceable, and it means the streams carry no ramp up after start, no price path, no change in yields with age, and no turnaround year.

The screen also places the capital before any production. The two construction years carry capex and nothing else, and the first producing year is year 2. The next lesson looks at how the construction years spread the capital.

## Working the panel

Change the crude cost on the panel and watch the crude cost column move while the revenue column stays still. Change the capacity and watch both move, together with crude run. The fixed opex column moves only when you change the fixed operating cost itself.

## The mistake

Reading the first producing year as year 1. OKORDIA's year 1 is its second construction year, with a crude run of 0.00 bbl and 32000000.00 of capex. Its first producing year is year 2, and a reader who counts from the wrong row gets every date in the valuation wrong by the length of construction.

## Exercise

Read the year 1 and year 2 rows of OKORDIA's streams. Quote the producing flag, crude run, revenue and capex for each. Then say what changes between the two years, and quote the figure the screen prints for the number of years in the streams and the two inputs it comes from.
