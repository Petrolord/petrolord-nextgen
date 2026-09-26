# Why gas is sold by its energy

{{panel:gsa-quantity-calculator}}

A buyer of gas is buying heat. A power plant turns the heat into electricity, a fertiliser plant into ammonia, a tile works into fired clay. Two cubic feet of gas from different fields can carry different amounts of heat, because their compositions differ. So a gas sales agreement counts quantity in energy, and the unit this course uses is the MMBtu, one million British thermal units. Volume still matters, because meters measure volume, but the contract converts every volume to energy before it counts anything.

## The rule for the imperial route

When the volume is in standard cubic feet and the heating value in Btu per standard cubic foot, the conversion is a single product. The engine prints its rule verbatim:

> MMBtu = volume in scf x heating value in Btu/scf / 1,000,000

Take the Ekene power plant. Its contract states 20 MMscf per day at 1050 Btu/scf gross. Twenty million standard cubic feet at 1050 Btu each, divided by one million, gives 21000 MMBtu, which is the DCQ the contract prices.

| case | volume | heating value | MMBtu (engine) | GJ (engine) |
| --- | --- | --- | --- | --- |
| power plant DCQ | 20 MMscf | 1050 Btu/scf gross | 21000.000000 | 22156.172905 |
| export feed DCQ | 60 MMscf | 1050 Btu/scf gross | 63000.000000 | 66468.518715 |

## Why the GJ column is there

Much of the world outside North America prices gas in gigajoules. The engine returns both, using the exact joule value of the International Table Btu from NIST Special Publication 811 (2008 edition), Appendix B: 1 MMBtu = 1055.05585262 MJ. That is why the power plant's 21000.000000 MMBtu becomes 22156.172905 GJ. The next lessons take up the metric route and the heating value basis.

## Quantity in energy runs through the whole contract

Once the DCQ is in MMBtu, every figure built on it is in MMBtu as well: the ACQ, the MaxDCQ, each day's nomination and take, the seller shortfall and buyer shortfall, the take-or-pay quantity and the deficiency. A price is then a price per MMBtu, and a payment is a quantity in MMBtu times a price per MMBtu. The conversion in this module happens once, at the start, and everything after it rests on it.

## A heating value is a stated term

The heating value is not something the engine looks up. The contract states it, usually with the conditions it was measured at and whether it is gross or net, and the engine carries those statements through to the result. A heating value of zero is refused:

> heatingValue must be a finite number above 0; got 0

A negative quantity is refused too, while a quantity of zero is a result of zero.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Volume to energy". Run the starting case, the power plant's 20 MMscf at 1050 Btu/scf, and read both tiles. Now change `quantity` to 60 and run it; you have the export feed's DCQ. Finally set `heatingValue` to 0 and run it, and read the refusal. Restore it and set `quantity` to 0; check that the panel returns zero energy and no refusal.
