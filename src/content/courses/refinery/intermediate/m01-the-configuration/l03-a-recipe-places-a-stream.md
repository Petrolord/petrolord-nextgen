# A recipe places a stream

A stream on its own earns nothing. It earns when a product takes it out of the refinery and sells it. The product's recipe is what connects the two, and reading the recipes tells you every home a stream can have.

{{panel:refinery-plan-explorer}}

## ABUA's six products

| product | price ($/bbl) | floor (bbl) | ceiling (bbl) | recipe |
| --- | --- | --- | --- | --- |
| Gasoline | 111.0000 | 0.00 | 450000.00 | reformate 1.0000 |
| Naphtha export | 72.5000 | 0.00 | 200000.00 | naphtha 1.0000 |
| Jet A-1 | 105.5000 | 0.00 | 380000.00 | kero 1.0000 |
| Diesel (ULSD) | 104.8000 | 0.00 | 750000.00 | ulsd 1.0000 |
| Gasoil export | 89.5000 | 0.00 | 250000.00 | gasoil 1.0000 |
| Fuel oil | 59.0000 | 0.00 | 1000000.00 | residue 1.0000 |

Each recipe here is a single stream at 1.0000: one barrel of Gasoline is one barrel of reformate, one barrel of Jet A-1 is one barrel of kero. A recipe could name more than one stream. ABUA's do not, which keeps every product tied to exactly one stream and makes the plan easy to trace.

The floor is the least the month must sell and the ceiling is the most it can. Every ABUA floor is 0.00, so no product has to be made at all, and every ceiling is a figure the plan may reach but never pass.

## Every home a stream has

Now read the recipes from the stream's side. For each stream, list the products whose recipe names it and the unit whose feed it is.

- **naphtha** goes into Naphtha export, and it is the feed of the Naphtha reformer.
- **reformate** goes into Gasoline. No unit consumes it.
- **kero** goes into Jet A-1. No unit consumes it.
- **gasoil** goes into Gasoil export, and it is the feed of the Diesel hydrotreater.
- **ulsd** goes into Diesel (ULSD). No unit consumes it.
- **residue** goes into Fuel oil. No unit consumes it.
- **offgas** goes into no product, and no unit consumes it.

Two streams, naphtha and gasoil, have a choice of homes. A barrel of naphtha can be sold as it is at the Naphtha export price, or sent through the reformer to become reformate and offgas. A barrel of gasoil can be sold as Gasoil export or hydrotreated into ulsd. Deciding between those homes, barrel by barrel, is the heart of what the plan is doing.

One stream, offgas, has no home at all. The plan still makes it, because every crude yields some and both units make some. Where it ends up is the subject of Module 3's stream balances.

## Placing is not the same as making

A recipe places a stream. It does not make one. The plan reports, for every stream, how much was made, how much units consumed and how much products placed, and any barrel left after that is surplus. A stream with no recipe and no unit to feed can only be surplus. That is a fact about the configuration, visible before the plan is solved, and the balance table confirms it after.

## Exercise

Using the recipe column and the unit feed column, name the two streams that have both a product and a unit to go to, and give the price of the product each could be sold as directly: Naphtha export at 72.5000 and Gasoil export at 89.5000 dollars a barrel. Then name the stream with neither, and say what the plan must report for it once every barrel of it has been made.
