# Government cash flow

The state's line is royalty plus its share of profit oil plus tax, and it is a collection rather than a profit, because the state carries none of the cost.

{{panel:ec-regime-explorer}}

## Three sources, one column

Under "USA - Gulf of Mexico" on the Designer's default project the contractor takes 100 percent of profit oil, so the state's share of the residual is nothing and `governmentTake` is royalty plus tax alone. Year 1 reads 50.9979, all of it royalty, in a year the contractor closed at -310.0117. Year 4 reads 65.4424, which is royalty of 37.0317 and tax of 28.4107. Over the life the column totals 764.5528, from royalty of 503.7989 and tax of 260.7539.

## What the two lines share

The contractor's line and the state's line divide one quantity, and the engine prints both sides of it.

| year | contractorNCF | governmentTake | the two added (derived) | grossRevenue less opex less capex (derived) |
| --- | --- | --- | --- | --- |
| 1 | -310.0117 | 50.9979 | -259.0138 | -259.0138 |
| 2 | 169.7780 | 45.8368 | 215.6148 | 215.6148 |
| 3 | 149.2243 | 43.5890 | 192.8133 | 192.8133 |
| 4 | 106.8784 | 65.4424 | 172.3208 | 172.3208 |

Run "Angola - Deepwater PSC" on the same project and the same two derived columns still agree, row for row: -259.0138, 215.6148, 192.8133 and 172.3208, against a contractor line of -323.6112, 157.5549, 140.6278 and 110.6013 and a state line of 64.5974, 58.0599, 52.1855 and 61.7195. The regime moves the split. It cannot move the quantity being split, because unrecovered cost is carried forward and paid to no one.

## Six collections on one field

The state's life collection on the default project runs 687.4682 under PIA, 758.7514 under Generic, 764.5528 under the Gulf of Mexico terms, 1121.5184 under Brazil, 1263.7523 under Angola and 1316.6067 under Ghana. The royalty rate does not order that list: Angola charges no royalty at all and collects 1263.7523, while the Gulf of Mexico terms charge the highest royalty of the six at 18.75 percent and collect 764.5528.

## The mistake

Expecting the two lines to add to gross revenue. Year 1 sold 271.9889 and the pair adds to -259.0138, because opex of 31.0027 and capex of 500.0000 are the contractor's alone. The second error is to read a high take as a good year for the state's cash: in year 1 the state collected 50.9979 out of a year that destroyed 259.0138 of value.

## The state's line does not wait

The state collects royalty from year 1 on a field that has returned none of its capex, and in every year of the life whether a residual exists or not. Year 25 pays 6.2773 on gross revenue of 24.3216.

## What it refuses

Government cash flow here is royalty, profit share and tax. The engine column is `governmentTake`; the course keeps the name government take for a ratio of this cash flow that the Expert tier meets. It holds no signature bonus, no production bonus, no state equity, no domestic supply obligation and no royalty taken in kind. It is undiscounted, and it says nothing about when the money arrives.

## Exercise

Write the state's line for years 1 and 4 and name the source of each part. Then add the two lines in year 2 and say what the answer is, and why it is not 244.4628.
