# Crudes, units, products and streams

The Associate tier priced a refinery before any capital was spent. This tier plans one that is running. The Refinery Planning Studio takes one month's configuration, solves it, and prints a plan: how much of each crude to run, how hard each unit works, how much of each product to sell and what the month earns. Every figure in this tier comes from one invented record, ABUA, Abua Coastal Refining Ltd, and every price and cost in it is illustrative, in US dollars.

{{panel:refinery-plan-explorer}}

## Four kinds of thing

A configuration is made of four kinds of thing, and the plan cannot be read until each is clear.

**Crudes** are what the refinery buys. Each crude has a cost in dollars a barrel, a volume available for the month, and a yield of each stream. ABUA offers three:

| crude | cost ($/bbl) | available (bbl) |
| --- | --- | --- |
| Bonny Light (illustrative) | 81.3000 | 1500000.00 |
| Forcados (illustrative) | 77.6000 | 1100000.00 |
| Brass River (illustrative) | 80.4000 | 600000.00 |

The grade names are labels. They sit on invented yields and invented prices, and nothing in this course says what a real cargo of any of them costs or yields.

**Units** are the plant. Each unit has a capacity for the month in barrels, an operating cost in dollars a barrel, a feed stream it consumes and the yields it makes from that feed. ABUA has three units:

| unit | capacity (bbl) | operating cost ($/bbl) | feed |
| --- | --- | --- | --- |
| Crude distillation | 2600000.00 | 1.2500 | (none: the crude unit) |
| Naphtha reformer | 420000.00 | 2.9000 | naphtha |
| Diesel hydrotreater | 650000.00 | 1.8000 | gasoil |

The crude distillation unit has no feed stream. That is not an oversight in the table. A unit with no feed is the crude unit, and Module 2 is built on that one fact.

**Products** are what the refinery sells. Each product has a price, a floor and a ceiling on the volume sold in the month, and a recipe that says which stream it is made of. ABUA sells six: Gasoline, Naphtha export, Jet A-1, Diesel (ULSD), Gasoil export and Fuel oil.

**Streams** are the named intermediate liquids that connect the other three. ABUA's streams are naphtha, reformate, kero, gasoil, ulsd, residue and offgas. A crude makes streams in the proportions of its yields. A unit consumes one stream and makes others. A product takes a stream out of the refinery and turns it into revenue.

## Why the streams matter

It is tempting to read a refinery as crude in and products out. The plan does not see it that way. It sees a balance for every stream: what is made, what units consume, what products take, and what is left over. Every question this tier asks about value comes back to a stream. The plan's answer to "what is one more barrel of naphtha worth?" is a property of the naphtha stream. It belongs to neither the crude that makes naphtha nor the product that sells it.

Read the configuration in that order: crudes make streams, units turn streams into other streams, products take streams away. When a figure in the plan surprises you, find the stream it runs through.

## Where this tier stops

The plan is a linear programme, and the `crude` course, Crude Assay & Blending, owns linear programming. This course reads what the plan prints and never re-derives how it was solved.

## Exercise

Read the three crude rows and the three unit rows above. Name the one unit whose feed column does not name a stream, and say which kind of thing in the configuration it must take its barrels from instead. Then list which of the seven streams a unit consumes, and say what that tells you about where the other streams can go.
