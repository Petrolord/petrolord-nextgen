# Bulk tanks by product

{{panel:marine-voyage-calculator}}

Below the deck, a supply vessel carries liquids and powders in tanks. Diesel cannot share a tank with drill water, and cement cannot share one with barite, so each product has its own tank capacity. The engine checks every tank separately. This lesson reads the Ekene PSV's six tanks on the milk run.

## One tank per product

Aas, Halskau and Wallace describe bulk as carried in segregated tanks, one product to a tank, and the engine takes that idea by concept. The vessel states a tank capacity in m3 for every product the call lists, and each installation states the m3 of each product it needs. On a milk run the engine adds each product's volume over the stops and checks it against that product's tank.

| tank | load, m3 | capacity, m3 | utilisation |
| --- | --- | --- | --- |
| diesel | 460.000000 | 800.000000 | 0.575000 |
| water | 745.000000 | 1200.000000 | 0.620833 |
| mud | 200.000000 | 600.000000 | 0.333333 |
| brine | 85.000000 | 400.000000 | 0.212500 |
| cement | 60.000000 | 250.000000 | 0.240000 |
| barite | 70.000000 | 250.000000 | 0.280000 |

The water tank is the fullest of the six at 0.620833, and still well below the deck area's 0.900000. A tank is a constraint like any other, and when one is the fullest it binds the voyage. The small teaching case "A tank that binds" shows that: tank d binds at 0.900000.

## Every product needs a stated tank

The vessel must state a tank for every product in the call, even one it does not carry. A vessel with no tank for a product states that tank as 0. Leave a tank out altogether and the engine refuses:

> vessel.tanks.mud must be stated for every product (0 when the vessel has no tank for it); got nothing

The rule catches a real mistake. A planner who copies a vessel from another job may forget a product the new cluster uses, and a missing tank read as "no limit" would let the plan carry mud the vessel has nowhere to put.

## Keys must be products

A tank key must be one of the call's product ids. A tank named for a product the call does not list is refused, and the message lists the accepted ids:

> vessel.tanks.methanol is not a product id; the accepted keys of vessel.tanks are the product ids diesel, water, mud, brine, cement, barite

## Dry bulk and liquid bulk

Each product states its kind, "liquid" or "dry". Cement and barite are dry bulk in the Ekene fixture. The engine reads the kind as part of the product's description and checks the tank the same way for both: a volume against a capacity, and a weight through the density into the deadweight.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Add each product's m3 over the four installation controls and check your sums against the tank rows of the constraints table. Clear "Tank mud, m3 (stated, 0 for none)" and read the refusal; type 600 back. Change "Tank water, m3 (stated, 0 for none)" from 1200 to 745 and predict, before reading, which constraint binds and whether the voyage stays feasible. Check, then restore 1200. Finally, set Start from to "A tank that binds" and read its binding row.
