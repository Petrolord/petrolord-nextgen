# Where it actually goes

The split across flow rate, and how it moves.

{{panel:hy-rheology-explorer}}

## The table

Slant well, kcl_polymer:

| flow rate | pipe share | bit share | annulus share |
|---|---|---|---|
| 0.015 m3/s | 63.4212 % | 16.0968 % | 20.4820 % |
| 0.025 m3/s | 67.9500 % | 19.8616 % | 12.1884 % |
| 0.035 m3/s | 68.3933 % | 21.9509 % | 9.6559 % |

## Reading the three columns

**The bit share rises**, from 16 to 22 percent, because it is an exact square law and the steepest law always wins as the rate rises.

**The annulus share falls sharply**, from 20 to under 10 percent, because it is the gentlest law: its exponent against flow rate is 0.7464092669494129, which is below one.

**The pipe share rises and then flattens**, because its exponent of 1.7229931970141557 is between the other two.

## The exponents in one place

| element | exponent against flow rate |
|---|---|
| annulus | 0.7464092669494129 |
| pipe | 1.7229931970141557 |
| bit | 2.0000000000000004 |

Those three numbers explain the whole table, and each of them has a reason: laminar annulus, turbulent pipe, inertial bit.

## Why the annulus exponent is below one

Because the annular flow is laminar and the fluid is shear thinning.

In laminar flow of a power-law fluid the pressure loss goes as the velocity to the power n, and n for these muds is around 0.7 to 0.8. So the exponent inherits the mud's shear thinning directly.

That is a very useful fact: doubling the flow rate raises the equivalent circulating density by much less than double the annulus loss would suggest, because the mud thins as it goes faster.

## The practical consequence

If you need more flow rate to clean the hole, the annulus loss is the cheapest of the three to buy.

The pump pays for it steeply and the formation barely notices. That is the single most encouraging result in this course, and it is why raising the flow rate is usually possible when the pump has headroom.

## The limit

The pump. At 0.050 m3/s on this well the pump pressure is 39362479.93044558 Pa, which is far beyond a normal rig's capability.

So the flow rate is capped by the pump long before the formation objects, on this well with this string.

## Exercise

Extend the exponents to predict the annulus loss at 0.050 m3/s from the value at 0.025.

Compare against the actual 3645442.580617756 Pa and say how good the single-exponent extrapolation is.
