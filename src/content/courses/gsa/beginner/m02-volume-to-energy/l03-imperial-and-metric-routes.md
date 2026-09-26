# Imperial and metric routes to MMBtu

{{panel:gsa-quantity-calculator}}

Gas is metered in two families of units. The imperial family counts standard cubic feet and states heating value in Btu per standard cubic foot. The metric family counts standard cubic metres and states heating value in megajoules per standard cubic metre. A contract can use either, and a seller may meet a buyer who uses the other. The engine takes both and returns MMBtu and GJ from each.

## The units the engine accepts

Volume comes in six units: scf, Mscf and MMscf on the imperial side, Sm3, MSm3 and MMSm3 on the metric side. The prefixes follow gas industry usage, where M is a thousand and MM a million. A unit outside the six is refused by name, so a volume stated in bcf has to be restated before the engine will read it.

## The imperial route

Volume in scf times heating value in Btu/scf, divided by one million, is MMBtu. No constant is involved beyond the million. A thousand Mscf at 1000 Btu/scf is exactly a thousand MMBtu:

| case | volume | heating value | MMBtu (engine) | GJ (engine) |
| --- | --- | --- | --- | --- |
| imperial | 1000 Mscf | 1000 Btu/scf gross | 1000.000000 | 1055.055853 |
| metric | 1 MMSm3 | 39 MJ/Sm3 gross | 36964.867692 | 39000.000000 |

## The metric route

Volume in Sm3 times heating value in MJ/Sm3 gives megajoules, and the engine divides by the megajoules in one MMBtu. Its rule, verbatim:

> MMBtu = volume in Sm3 x heating value in MJ/Sm3 / 1055.05585262 (MJ per MMBtu)

The divisor is the International Table Btu, 1055.05585262 joules per Btu, which NIST Special Publication 811 (2008 edition), Appendix B, gives as a defining value. The engine holds the exact figure. On the metric route the GJ tile is the plain product, 39000.000000 for one MMSm3 at 39 MJ/Sm3, and the MMBtu tile is that divided through, 36964.867692.

## One constant in each direction

Notice the symmetry in the table. On the imperial route the MMBtu figure is the plain product and the GJ figure needs the Btu constant; on the metric route it is the other way round. The engine uses the same defining constant on both routes, so the two families of units meet at one exact figure.

## Why the exact constant matters

Rounding the Btu to four figures looks harmless, but a DCQ is multiplied by every day of the year and every year of the term. A small constant error becomes a large quantity dispute over a long contract. The engine keeps the defining value and prints results at six decimals, and this course quotes them at that precision.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Volume to energy". Enter 1000 Mscf at 1000 Btu/scf gross, reference conditions "15 C and 101.325 kPa", and run it; read both tiles and the rule line. Then enter one MMSm3 at 39 MJ/Sm3 gross and run it; read both tiles and the rule line again. Write down, for each route, which tile is the plain product and which one the constant was applied to. Finally set `quantityUnit` to "bcf" and read the refusal.
