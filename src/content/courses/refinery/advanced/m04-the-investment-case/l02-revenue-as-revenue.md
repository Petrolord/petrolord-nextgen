# Revenue as revenue

The screening engine was built around a producer: a quantity of oil each year, a price for it, and costs against the revenue. A refinery also sells barrels at a price, but it has to buy every barrel of crude first. This lesson reads how the refinery's streams are fitted into that shape.

{{panel:refinery-variance-explorer}}

## What goes in

Revenue goes in as revenue: barrels at the slate's value. The production stream is the refinery's annual throughput and the price is the slate's gross value per barrel of crude.

| stream | year 0 | first operating year |
| --- | --- | --- |
| production (oil, bbl) | 0.00 | 3753600.00 |
| price (the slate's gross value) | | 92.2100 |

The crude bill goes into the cost streams. The opexFixed in the first operating year is 291.7664 million, and it is the fixed operating cost plus the crude cost. The opexVariable is 15.7651 million: the course labels it the variable operating cost, in millions, and prints it as the streams' variable opex 15765120.00 / 1000000. The cash flow's opex is their sum, and the course prints it: 291.7664 + 15.7651 = 307.5315.

## What comes out

For each operating year the screening engine prints:

| year | calendar year | gross revenue (MM) | royalty (MM) | opex (MM) | capex (MM) |
| --- | --- | --- | --- | --- | --- |
| 2 | 2029 | 346.1195 | 0.0000 | 307.5315 | 0.0000 |
| 3 | 2030 | 346.1195 | 0.0000 | 307.5315 | 0.0000 |

The same gross revenue and opex repeat in every operating year to year 21, calendar 2048. The gross revenue of 346.1195 million is the plant's product sales. The net cash flow in year 2, a year with a tax of 0.0000, reads 38.5879 million.

## Revenue goes in as revenue

The course states the rule in one line: revenue goes in as revenue, barrels at the slate's value. So the gross revenue line reads 346.1195 million of products a year, and the opex line reads 307.5315 million: opexFixed, the fixed operating cost plus the crude cost, and opexVariable, the variable operating cost. The crude bill is in the cash flow as a cost. The gross margin per barrel on the screen, 14.0100, is the gross value less the crude cost less the variable operating cost, which the Associate tier defined.

Each input sits where the course prints it. The crude cost is inside opexFixed. The slate's gross value is the price the engine is handed, 92.2100 in the first operating year. The two stay apart in the cash flow, as they stay apart in the variance lines of module 3, where a delivery is revenue and a receipt is cost.

## One consequence to read

Because the crude bill sits in opex, the opex line of a refinery carries the cost of every barrel of crude it runs. That is the business, and it is nothing to correct. A reader of the ODIOMA cash flow should expect opex of 307.5315 million beside revenue of 346.1195 million, and should read the net cash flow line as the plant's result. In year 2 that line reads 38.5879 million, and module 5 reads how tax changes it in later years.

## Exercise

Read the production in the first operating year and the price the screening engine receives. Then read the gross revenue and the opex in year 2 and the net cash flow. Say what the opex line carries that a producing field's opex would not, and why keeping revenue as revenue lets a reader see both the size of the business and the part the plant keeps.
