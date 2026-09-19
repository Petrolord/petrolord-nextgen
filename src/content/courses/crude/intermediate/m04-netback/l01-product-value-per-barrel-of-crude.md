# Product value per barrel of crude

A crude is worth what the refinery can sell it as, less what it costs to turn it into that. This module builds that figure, the netback, one term at a time.

{{panel:crude-valuation-explorer}}

## The formula

netbackValue computes:

netback = sum(cut yield fraction x cut product price) x (1 - loss percent / 100) - processing cost - freight

all per barrel of crude. This lesson is about the first term, the sum. The next three lessons take the losses, the costs, and what happens when a cost is left blank.

## Two kinds of barrel

The product prices are dollars per barrel of product. A barrel of naphtha sells for the naphtha price. The netback is in dollars per barrel of crude. Converting one into the other is what the yield does.

A barrel of the Kwale blend yields 20.5591 volume percent naphtha: that fraction of every barrel of crude comes out as naphtha. Multiply the fraction by the naphtha price and you have the naphtha's contribution to the value of one barrel of crude. The engine uses the yield as a fraction for exactly that reason: it converts a price per barrel of product into a value per barrel of crude.

## The Kwale blend, cut by cut

The digest prints each cut on Kwale's cut set with Kwale's product prices, all invented:

| cut | yield volume percent | price $/bbl of product | value $/bbl of crude |
| --- | --- | --- | --- |
| LPG / Light ends | 0.7174 | 48 | 0.3443 |
| Naphtha | 20.5591 | 74 | 15.2137 |
| Kerosene / DPK | 16.2860 | 93 | 15.1460 |
| Diesel / AGO | 19.3849 | 98 | 18.9972 |
| Atmospheric residue | 43.0526 | 57 | 24.5400 |

The engine's gross product value, the sum of the last column, is 74.2412 $/bbl of crude.

## What each column is for

The yield column is the blend's own cut yields from module 3, on the blend's own curve, on volume. Those yields close: they total 100.0000, so every barrel of the blend is priced once.

The price column is per barrel of product. A price is a market figure the refinery supplies, and in this course every one is invented.

The value column is the only one in dollars per barrel of crude. It is what each product contributes to one barrel of the blend. Reading down it shows where the value sits. Atmospheric residue contributes 24.5400 $/bbl of crude at a price of 57 $/bbl of product, while LPG / Light ends contributes 0.3443 at 48. A cut's contribution depends on its price and its yield together, and neither alone tells you how much a cut matters.

## The yield in the formula

The digest's formula is netback = sum(cut yield fraction x cut product price) x (1 - loss percent / 100) - processing cost - freight, "all per barrel of crude". The yield it takes is the one cutYields returns, in volume percent of the whole crude, the blend's own yields from module 3. The price it takes is per barrel of product. Every earlier module in this tier kept yields on volume, and the formula takes them as they come.

## Gross is not the answer

74.2412 $/bbl is gross. Nothing has yet been lost in processing, paid to run the refinery, or paid to bring the crude in. The next lessons take those off, and every term is reported beside the total, so a reader can see where each dollar went.

## Exercise

Read the Naphtha and Kerosene / DPK rows: yields 20.5591 and 16.2860, prices 74 and 93, values 15.2137 and 15.1460 $/bbl of crude. Say which two figures on each row the value is formed from, and what unit each of the three figures is in. Then say what reading only the price column would miss about how much each cut contributes.
