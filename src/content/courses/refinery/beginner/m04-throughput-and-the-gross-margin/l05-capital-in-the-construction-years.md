# Capital in the construction years

A refinery is paid for before it earns. The screen places the capital in the construction years, spread evenly across them, and the number of construction years decides both where the capital sits and when the first barrel is run.

{{panel:refinery-screen-explorer}}

## Three ways to build OKORDIA

The same plant, with the same capital of 64000000.00, laid out with three different construction periods:

| construction years | capex by year | first producing year | years in the streams |
| --- | --- | --- | --- |
| 0 | 64000000.00 in year 0 | year 0 | 20 |
| 2 | 32000000.00, 32000000.00 | year 2 | 22 |
| 3 | 21333333.33, 21333333.33, 21333333.33 | year 3 | 23 |

With no construction period, the capital is spent in year 0, the first operating year: year 0 capex 64000000.00, year 0 crude run 1518000.00 bbl, and 20 years in the streams. With two construction years, OKORDIA's own case, the capital sits in years 0 and 1 and production starts in year 2, with 22 years in the streams. With three construction years the capital is spread evenly: 21333333.33 in each.

The screen prints the rule for the three-year case as capital / construction years = 64000000.00 / 3. Each year is printed to the cent, and the engine carries the unrounded thirds, which sum to the capital: true. So the three printed cells are rounded for display, and nothing of the 64000000.00 is lost. With three construction years the first producing year is year 3 and the streams hold 23 years. The count follows the rule the screen states: years in the streams are the construction years plus the operating years.

## Why the spread matters

Money spent earlier weighs more in a valuation than money spent later, and money earned later weighs less. So the construction period does two things to a valuation at once: it decides how the capital is spread across the early years, and it pushes every producing year further from the start. A screen that ignored construction and put the capital and the first barrel in the same year would flatter the project.

That is why the zero construction case is printed at all. It is a reference, showing the capital and the first barrels in one year. OKORDIA's two year case is the realistic one for the screen.

## Even spreading is an assumption

Real capital is not spent evenly. Engineering is cheap and early, equipment and construction heavy and late. The screen spreads evenly because it has no schedule of spend to work from. For a screen, that is proportionate. For a study, a spend profile from the contractor would replace it.

The tax treatment of capital belongs to the Expert tier, which reads the valuation.

## Where the construction years show on the panel

Change the construction years on the panel and watch three things: the capex row splits across more or fewer years, the producing flag moves its first true to a later or earlier year, and the count of years in the streams follows. The throughput, the slate and the gross margin per barrel do not move. Construction changes when the plant earns. It does not change what a barrel earns.

## The mistake

Reading a longer construction period as a higher capital cost. The capital typed into the screen is 64000000.00 in every case above. What changes is when it is spent and when production begins, and those are questions for the valuation.

## Exercise

Read the capex rows for no construction period, two construction years and three construction years. Quote the capex in each year for each case, the first producing year and the years in the streams, and the screen's check on the three-year thirds. Then say what stays the same across all three cases and what the construction period changes.
