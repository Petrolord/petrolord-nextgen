# A price schedule

{{panel:materials-register-calculator}}

{{panel:materials-stock-calculator}}

At Associate the economic order quantity held one price for every unit, so the purchase cost, demand times unit cost, moved no order. A supplier who cuts the price for a larger lot changes that: the purchase cost now depends on the quantity ordered and joins the costs that choose it. This tier works in the stock calculator, which calls the same vendored engine the lessons quote. The Materials & Spares Planner in the Suite is built on the same engine, and the same inputs typed into it give the same figures.

## A schedule is a list of bands

A price schedule is a list of price bands, each with the quantity it starts from and a unit price. The engine reads the list as stated and holds no schedule of its own. On the Ekene register, which is synthetic, the casing joint CSG-958 carries three bands:

| band | from quantity | unit price |
| --- | --- | --- |
| 0 | 0 | 1450 |
| 1 | 60 | 1400 |
| 2 | 120 | 1360 |

The case also states a demand of 240 joints a year, an order cost of 3500, a holding rate of 0.2 on the price, and rounding to the nearest joint. How such a schedule is tendered and evaluated belongs to the procurement course; this course takes it as given.

## The baseline without a discount

Before it weighs any discount, the engine works the plain EOQ at the band 0 price: 76.112440 joints. Its basis names this the no-discount baseline, and every saving it reports is measured against the cost there.

## What makes a schedule usable

A schedule must price every quantity, and each band must be a real discount. The first band must start at zero:

> breaks[0].minQuantity must be 0 so that every quantity has a price; got 10

Each band must start above the one before it, and each price must fall. On a schedule priced from 50, the engine's words:

> breaks[2].minQuantity must be above the band before it (500); got 500

> breaks[1].unitPrice must be below the band before it (50); got 50

The schedule must also say how a band's price applies. Leave that out and the engine names the two types it knows:

> discountType must be 'all-units' (the band's price applies to the whole lot) or 'incremental' (each unit is priced by its own band)

## Exercise

Open the register calculator, choose the view "The economic order quantity" and start from the blank case. Type annual demand 240, cost of an order 3500, unit cost 1450, holding rate 0.2, and the rounding rule to the nearest multiple with a multiple of 1. Read the EOQ, 76.112440, and the purchase cost a year, 348000.000000.

Then open the stock calculator, view "Quantity discounts", start "The casing on the Ekene register, all-units", and confirm the band 0 EOQ matches. Set "price band 1: from quantity" to 10 and read the refusal. Restore it, set "price band 3: unit price" to 1400, and read which field is named. Restore that, set the discount type to not stated, and read the third refusal.
