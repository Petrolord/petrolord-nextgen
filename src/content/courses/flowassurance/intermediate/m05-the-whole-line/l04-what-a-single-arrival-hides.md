# What a single arrival hides

An arrival temperature is one sample of a curve, taken at one station, on a build that the number itself carries no record of. Four different mistakes all come back looking like a perfectly ordinary arrival.

{{panel:pd-line-explorer}}

## One value, one station

The published run at 105600.0 ft arrives at 43.357693442744 degF with 3.3576934427 degF of excess left over ambient. Quoted alone it says nothing about where the line got cold, and on that run it got cold early: 23.8220561287 degF went in the first 5280.0000 ft and 0.6884883567 degF in the last.

## It does not identify the line

Once the inlet and the ambient are fixed, the arrival depends on ntu and on nothing else, and ntu is a group of five quantities. A derived sweep on a 180.0 degF inlet against a 40.0 degF ambient gives 91.5031217640 degF at ntu 1.0000 and 58.9469396531 degF at ntu 2.0000, whatever combination of mass rate, heat capacity, coefficient, diameter and length produced them. Two very different lines can hand back the same arrival.

## It does not say which diameter the U was referred to

The published buried build referred to the 6.065 in bore has U 0.713200037662, and the identical physics referred to the 8.625 in coated outside diameter has U 0.501513997498. Handing the second coefficient to a consumer with the bore is dimensionally consistent and raises no complaint. Derived, on the three published lengths:

| Length, ft | Correct, degF | Mixed reference, degF | Error, degF |
| --- | --- | --- | --- |
| 5280.0 | 166.72111348 | 170.52530171 | 3.80418823 |
| 26400.0 | 125.06144556 | 138.61917975 | 13.55773419 |
| 105600.0 | 59.07861872 | 74.47159964 | 15.39298092 |

The error is an error in ntu, and ntu sits in an exponent, so the same mistake is worth 3.80418823 degF on a short line and 15.39298092 degF on a long one. The relaxation length is out by 42.209398 percent in all three, which is exactly the diameter ratio 1.4220939819. `overallU` reports which reference it used, in `referenceIdIn`, and none of its three consumers can accept that field, so keeping the pair together is the caller's job and nothing complains when the caller does not.

## It does not say whether the U describes the line at all

The published pipe with its 3.0 ft trench entered as 0.3 ft returns 4 terms instead of 5 and U 1.3348791131 instead of 0.7455927364, an error of 79.035960 percent, with `ok: true` and no note. The arrival computed on it looks exactly like an arrival.

## What an arrival will not tell you

Which station it belongs to. On TEACHING LINE AKASO SPUR the margin against its 71.00 degF teaching boundary is 124.0000000000 degF at the inlet and 18.3160299527 degF at the arrival, and both are true statements about the same line.

## Exercise

Write down an arrival from the panel and then list the four things somebody reading only that number cannot recover.

Then say which single field in the `overallU` return would have caught one of them, and why no consumer reads it.
