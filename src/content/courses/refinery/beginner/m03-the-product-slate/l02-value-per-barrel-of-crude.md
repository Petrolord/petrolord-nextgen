# Value per barrel of crude

The product slate turns a yield row and a price table into one figure: what a barrel of crude is worth once it has been refined. productSlate computes it the same way for every configuration, and the unit of the answer matters as much as the answer.

{{panel:refinery-screen-explorer}}

## The rule

productSlate values each product at its yield times its price, per barrel of crude, and adds the values into a gross value per barrel of crude. The yield is a fraction of a barrel of crude, so a yield times a price in US dollars a barrel of product gives US dollars per barrel of crude.

## Topping

| product | yield fraction | price | value per barrel of crude |
| --- | --- | --- | --- |
| lpg | 0.0200 | 52.0000 | 1.0400 |
| naphtha | 0.1800 | 74.0000 | 13.3200 |
| kerosene | 0.1400 | 97.0000 | 13.5800 |
| diesel | 0.3000 | 101.0000 | 30.3000 |
| fuelOil | 0.3400 | 55.0000 | 18.7000 |

Gross value per barrel of crude: 76.9400.

## Hydroskimming

| product | yield fraction | price | value per barrel of crude |
| --- | --- | --- | --- |
| lpg | 0.0300 | 52.0000 | 1.5600 |
| gasoline | 0.2000 | 104.0000 | 20.8000 |
| kerosene | 0.1300 | 97.0000 | 12.6100 |
| diesel | 0.3200 | 101.0000 | 32.3200 |
| fuelOil | 0.3000 | 55.0000 | 16.5000 |

Gross value per barrel of crude: 83.7900.

## Conversion

| product | yield fraction | price | value per barrel of crude |
| --- | --- | --- | --- |
| lpg | 0.0500 | 52.0000 | 2.6000 |
| gasoline | 0.3400 | 104.0000 | 35.3600 |
| kerosene | 0.1200 | 97.0000 | 11.6400 |
| diesel | 0.3300 | 101.0000 | 33.3300 |
| fuelOil | 0.1400 | 55.0000 | 7.7000 |

Gross value per barrel of crude: 90.6300.

## Why per barrel of crude

A refinery buys crude and sells products, and the two are not the same barrels. A barrel of crude does not come out as a barrel of product; it comes out as fractions of several products, plus a loss. Valuing the slate per barrel of crude puts the revenue on the same basis as the purchase. The crude cost is a price per barrel of crude, so the gross value can be set directly against it. It also lets two configurations be compared barrel for barrel, whatever size of plant they are screened at.

That is what makes the next module's margin possible. Gross value per barrel of crude, less the crude cost, less the variable operating cost, is a gross margin per barrel of crude, and every term in it is in the same unit.

## The three check lines

Under each slate the engine prints three more readings, and on all three configurations they read the same way: yields total 1.0000, yields close true, unpriced: none. The first says the yield row accounts for the whole barrel of crude. The second is the engine's verdict on that total. The third lists any product with no price. A gross value is only as complete as those three lines say it is, and the last two lessons of this module show each one reading otherwise.

## Reading a slate row

Each row answers one question: how many dollars of this product does one barrel of crude produce? In the hydroskimming slate, diesel's row reads 32.3200 and gasoline's 20.8000. Those are the dollars each product brings in per barrel of crude. Its fuelOil row carries a yield of 0.3000 and a value of 16.5000; its gasoline row a yield of 0.2000 and a value of 20.8000. Read the value column to see where the money comes from and the yield column to see where the barrels go, because the two columns answer different questions.

## The mistake

Reading a price as a value. Diesel's price is 101.0000 a barrel of diesel. Its value in the topping slate is 30.3000 a barrel of crude. Those are different quantities in different units, and only the second belongs in the margin.

## Exercise

Read the three gross values per barrel of crude and the fuelOil and gasoline rows of each slate. For each configuration, quote the fuelOil value and the gasoline value per barrel of crude, and say what the pair shows about where each configuration's gross value comes from.
