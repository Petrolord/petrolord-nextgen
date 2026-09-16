# The units and the standard cubic foot

Every constant this module uses is exported, so a reader can name it rather than infer it. They fall into three kinds, and the difference between the kinds is more useful than any of the values.

{{panel:fc-water-explorer}}

## Derived

A derived constant is computed from something else the module already exports, so there is nothing separate to check. The standard base is 14.696000 psia and 519.670000 degR, stated once. The standard cubic feet in a pound mole follow from it as the gas constant of 10.731600 times that temperature over that pressure, giving 379.483571856287.

The US gallons in a cubic foot are 7.480519480519, exact as 1728 cubic inches to the cubic foot over 231 to the gallon. The glycol density in lb per cubic foot is 69.568831168831, which is 9.300000 lb a gallon multiplied by those gallons. A derived constant cannot be wrong unless the thing it came from is wrong.

## Measured out of the engine

The interesting kind. A constant is exported under a name, and the digest then asks the engine a question whose answer is that constant and nothing else, then divides the measurement by the export. A ratio of 1.000000000000 says the name and the number actually in use are the same number.

| constant | exported | measured | measured over exported |
| --- | --- | --- | --- |
| standard cubic feet a pound mole | 379.483571856287 | 379.483571856287 | 1.000000000000 |
| the water overhead, Btu a lb | 1100.000000000000 | 1100.000000000000 | 1.000000000000 |
| the contactor liquid, lb a ft3 | 69.568831168831 | 69.568831168831 | 1.000000000000 |
| the molecular weight of water | 18.015280000000 | 18.015280000000 | 1.000000000000 |

Three more can only be measured as groups, because the engine never uses their parts apart. The minutes in a day come out as 1440.000000000. The hours in a day times the Btu in a MMBtu come out as 24000000.

## Declared

A declared constant is customary, or read off a chart, with no publication in this repository to check it against. The glycol at 9.300000 lb a gallon, the water at 8.340000, the overhead at 1100.000000 Btu a lb, the molecular weight of water at 18.015280 and the three Magnus coefficients of 0.610940, 17.625000 and 243.040000 are all declared. So is the customary circulation band of 2.000000 to 5.000000.

The module's own comment is candid about what can be done with a declared value. It can be pinned, so that changing it becomes a reviewed act rather than a quiet edit, and that is all. Pinning records who is allowed to move a number. It does not tell you the number is right, and no gate inside this repository can.

## One density, and why it matters

The glycol is 9.300000 lb a gallon and 69.568831168831 lb a cubic foot, and the vessel sizing uses exactly the second figure. The ratio of the two densities the module exports is 1.000000000000. One fluid has one density here, and nothing downstream has to work out which of two numbers it is holding.

## Exercise

Sort these five into derived, measured and declared: 379.483571856287, 9.300000, 69.568831168831, 18.015280 and 1440.000000000. Then say what a measured over exported ratio of 1.000000000000 proves, and what it does not.
