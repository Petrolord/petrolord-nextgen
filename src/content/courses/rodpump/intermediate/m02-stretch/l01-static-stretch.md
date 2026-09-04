# Static stretch

Hang a load on the bottom of a rod string and it gets longer. That length is subtracted from the stroke before the plunger has moved at all.

{{panel:pd-card-explorer}}

## One constant, one multiplication

`rodStretchIn` is the elastic constant Er times the load, and nothing else. Er is the compliance of the whole string, the sum of length over area for every section divided by Young's modulus, so it is fixed by the steel and the geometry. The published taper has an Er of 3.744037060e-3 in/lb and ODUMA-4 has 3.312268708e-3 in/lb.

Because it is a multiplication, the answer is linear in the load and carries no memory of how fast the load was applied.

| Load at the pump, lb | Published taper, in | Published uniform, in | ODUMA-4, in |
| --- | --- | --- | --- |
| 1000.0 | 3.744037060 | 3.925786432 | 3.312268708 |
| 2500.0 | 9.360092650 | 9.814466079 | 8.280671771 |
| 5000.0 | 18.720185299 | 19.628932158 | 16.561343542 |
| 7500.0 | 28.080277949 | 29.443398238 | 24.842015313 |
| 10000.0 | 37.440370598 | 39.257864317 | 33.122687084 |

## The size of it against a stroke

The published taper carries a fluid load of 5000.000000 lb, so it stretches 18.720185299 in under it, on a surface stroke of 64.000000 in. ODUMA-4 carries 4690.299657039 lb and stretches 15.535532787 in, which is 14.561688 percent of its 106.687716837 in surface stroke.

Close to a seventh of the stroke, then, is spent stretching rod before the plunger begins to lift.

## Longer is not automatically stretchier

The published uniform string is 6000 ft of 7/8 rod and stretches 3.925786432 in per 1000 lb. The published taper is 5000 ft and stretches 3.744037060 in. ODUMA-4 is 4800 ft and stretches least of the three at 3.312268708 in per 1000 lb.

The uniform string stretches more than the taper mostly because it is a thousand feet longer, not because it is uniform. ODUMA-4 is shorter still and starts with 1500 ft of 1 in rod, a section that carries the shortest run of the three in that string yet contributes only 22.685963 percent of its whole compliance. Compliance is what adds, and thick rod is stingy with it.

## What static stretch does not know

It has no term for time, mass or speed. Feed it the same load at half a stroke a minute and at fifteen and it returns the same inches. It also assumes the load is applied at the pump: a load distributed along the string does not stretch it by the same amount.

Neither does it say anything about what the plunger actually travels. It only says what the string gives up.

## Exercise

In the panel, read the stretch of all three strings under 2500.0 lb and under 10000.0 lb, and confirm that each column stays linear in the load.

Then compute the ODUMA-4 stretch under its own fluid load of 4690.299657039 lb and state it as a percentage of the 106.687716837 in surface stroke.
