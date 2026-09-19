# An unpriced product is named

A slate is only as complete as its price table. When a price is missing, productSlate has a choice to make, and it makes the one that keeps the reader informed: it values the product at nothing and says so by name.

{{panel:refinery-screen-explorer}}

## The case

Take the topping configuration with OKORDIA's price table, and leave the naphtha price blank. The engine returns:

| reading | topping, naphtha priced | topping, naphtha blank |
| --- | --- | --- |
| gross value per barrel of crude | 76.9400 | 63.6200 |
| unpriced | none | naphtha |

The unpriced product is named and adds nothing to the value. In the full topping slate, naphtha's row carries a yield of 0.1800, a price of 74.0000 and a value per barrel of crude of 13.3200. With the price blank, that row contributes nothing and the product appears on the unpriced list instead.

## Why a blank price is answered

The first module showed that a blank money box on the feasibility inputs is refused by name. A blank product price is handled differently: the slate is answered, and the gap is reported beside it. That is a reasonable design for a slate. A plant can make a product that has no market where it sits, and a screen should be able to say what the rest of the barrel is worth. A slate that refused would give no answer at all.

The cost of that design is that the answer looks normal. 63.6200 is a gross value per barrel of crude in the same unit and at the same precision as 76.9400. Nothing about the figure itself says a product is missing. Only the unpriced list does.

## Reading the unpriced list first

So the unpriced list is the first thing to read on any slate, before the gross value. On all three of OKORDIA's configurations, with the full price table, it reads none. That is the reading you want. Anything else means the gross value is a value of part of the barrel.

The same habit applies when you type your own prices. A product whose price box you meant to fill and did not will not stop the screen. It will leave that product's value out of the gross value, and the gross margin per barrel that follows is built on that gross value.

## When an unpriced product is right

Sometimes it is the honest input. If a product truly has no outlet, valuing it at nothing is a fair assumption for a screen, and the unpriced list documents it. The difference between that case and a forgotten price is intent, and the engine cannot see intent. It names the product so that a person can.

## The mistake

Comparing the 63.6200 slate with another configuration's gross value as if both valued the whole barrel. One of them has a product at no value. Any comparison between them is partly a comparison between a priced product and an unpriced one.

## Exercise

Read the topping slate with naphtha priced and with naphtha blank. Quote both gross values per barrel of crude, the unpriced list for each, and naphtha's value per barrel of crude in the full slate. Say what those three figures show about where the naphtha value went when its price was blank.
