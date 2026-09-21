# Stream balances and surplus

Module 1 said the plan sees a refinery as a set of streams. This lesson reads the table where that view is printed: the stream balance, one row for each of ABUA's streams.

{{panel:refinery-plan-explorer}}

## The balance

The engine gives it in one line:

made - consumed by units - placed in products = surplus, never below zero.

**Made** is every barrel of the stream that crudes and units yield. **Consumed** is every barrel a unit takes as feed. **Placed** is every barrel a product's recipe takes. **Surplus** is what is left, and the course names it plainly: surplus is the stream nobody found a home for.

The balance can never go below zero. The plan cannot consume or sell a barrel that was not made. It can leave barrels unused, and those are the surplus.

## ABUA's balance

| stream | made (bbl) | consumed (bbl) | placed (bbl) | surplus (bbl) |
| --- | --- | --- | --- | --- |
| naphtha | 407677.42 | 407677.42 | 0.00 | 0.00 |
| reformate | 346525.81 | 0.00 | 346525.81 | 0.00 |
| kero | 288354.84 | 0.00 | 288354.84 | 0.00 |
| gasoil | 650000.00 | 650000.00 | 0.00 | 0.00 |
| ulsd | 630500.00 | 0.00 | 630500.00 | 0.00 |
| residue | 633129.03 | 0.00 | 633129.03 | 0.00 |
| offgas | 103638.71 | 0.00 | 0.00 | 103638.71 |

Read the rows in three groups.

**Naphtha and gasoil** are consumed in full by units. Naphtha made 407677.42 bbl and the reformer consumed 407677.42 bbl, which is the reformer's throughput. Gasoil made 650000.00 bbl and the hydrotreater consumed 650000.00 bbl, which is the hydrotreater's throughput. Neither is placed in a product, so Naphtha export and Gasoil export sell 0.00 bbl.

Read the gasoil row once more. The crude run is set so that the gasoil made is exactly what the hydrotreater can take at its capacity of 650000.00 bbl. That is the first sign, in the balance itself, of what holds the crude run where it is.

**Reformate, kero, ulsd and residue** are placed in full by products. Each has one recipe and no unit, and each is sold to the last barrel: reformate as Gasoline, kero as Jet A-1, ulsd as Diesel (ULSD), residue as Fuel oil. The placed column matches the product volumes in Lesson 1's revenue table.

**Offgas** is made and neither consumed nor placed. Its whole make, 103638.71 bbl, is surplus. Module 1 showed why that had to be so: offgas has no recipe and no unit. The configuration gave it nowhere to go, and the balance records that.

## What surplus means

Surplus is not a loss the plan failed to prevent. It is a stream that has no home in this configuration, or one that the plan chose to leave because every home it has is worth less than nothing to the month. In ABUA it is only offgas, and only for the first reason.

A surplus on a stream that does have a product is worth a second look. It means the plan made barrels of it and preferred to leave them. That happens when every product that takes it is at its ceiling and no unit has room for the rest. The balance table is where it shows.

## The balance under the changes

The same balance is struck for every change in SECTION 13. When the hydrotreater is shut, it consumes no gasoil. Gasoil must then find its home in Gasoil export, whose ceiling is 250000.00 bbl, or be left as surplus. The crude run in that change, 735294.12 bbl, is the plan's answer to how much gasoil the month can place.

## Exercise

Read the naphtha and gasoil rows: made 407677.42 and consumed 407677.42; made 650000.00 and consumed 650000.00. Then read the offgas row: made 103638.71, placed 0.00, surplus 103638.71. Say what the first two rows show about the Naphtha export and Gasoil export products, and what the third shows about the configuration rather than the plan.
