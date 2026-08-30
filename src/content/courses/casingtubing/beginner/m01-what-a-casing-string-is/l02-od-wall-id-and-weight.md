# OD, wall, ID and weight

Four numbers, of which only two are independent, and one of them is a name.

{{panel:ct-rating-explorer}}

## The four

**Outside diameter.** The size of the hole the pipe has to go into. It is the number the string is called after, and it is fixed by the bit size above it.

**Wall thickness.** The steel between inside and outside.

**Inside diameter.** Outside diameter less twice the wall.

**Nominal weight.** Pounds per foot, quoted in field units even in an SI engine, because it is the name of the row rather than a computed quantity.

## Only two are independent

Given the outside diameter and the wall, the inside diameter follows. Given the outside diameter and the inside diameter, the wall follows.

The weight is nearly determined too, because it is the steel area times the density of steel, but the published API tables round it, and the rounded value is what the row is called. So the weight is a LABEL, and the wall is the number the formulas actually use.

## The 9-5/8 inch family

| weight | wall (m) | inside diameter (m) | D over t |
|---|---|---|---|
| 36 lb/ft | 0.008940799999999999 | 0.22659339999999997 | 27.343750000000004 |
| 40 lb/ft | 0.010033 | 0.22440900000000003 | 24.367088607594937 |
| 43.5 lb/ft | 0.011049 | 0.22237700000000002 | 22.126436781609197 |
| 47 lb/ft | 0.0119888 | 0.22049739999999998 | 20.391949152542374 |
| 53.5 lb/ft | 0.013843000000000001 | 0.21678899999999998 | 17.660550458715594 |

Same outside diameter on every row. Heavier means thicker, which means a smaller bore and a smaller ratio of diameter to wall.

## Why the bore matters as much as the wall

Every extra millimetre of wall costs bore, and the bore is what the next hole section has to be drilled through. A 9-5/8 inch 53.5 lb/ft joint has 3.7 mm less bore than a 47 lb/ft one, and that can be the difference between running the next liner and not.

So casing design is never "use the strongest thing available". It is the lightest pipe that passes, because the lightest pipe leaves the most room and costs the least.

## Units

The engine stores metres, kilograms per metre and pascals. The catalog converts once, at the point where the published table is written down, using 0.0254 metres per inch and 1.4881639 kilograms per metre per pound per foot. Nothing downstream converts anything.

## Exercise

Take the 20 inch family: 94, 106.5 and 133 lb/ft, with walls of 0.0111252, 0.0127 and 0.016129 m.

Compute the ratio of diameter to wall for each. Then do the same for the 9-5/8 inch family above and say which family is the thin-walled one.
