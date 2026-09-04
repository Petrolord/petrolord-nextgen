# The reference nobody accepts

`overallU` returns a field called `referenceIdIn` because a heat transfer coefficient without a named area is not a number. The three functions that consume a U take a bare diameter and none of them can see that field.

{{panel:pd-hydrate-explorer}}

## One line, two coefficients, both correct

The published buried build referred to the 6.065 in bore returns U = 0.713200037662 Btu/(hr ft2 degF). The same stack referred to the 8.625 in coated outside diameter returns 0.501513997498. Nothing about the pipe moved: both carry a total resistance of 0.883057962117 hr ft degF/Btu per foot, identical to the last figure. The ratio of the two coefficients is 1.4220939819, the ratio of the two diameters is 1.4220939819, and the two ratios differ by 4.4409e-16.

The invariant is the product. U times its own reference diameter is 0.360463185702 Btu/(hr ft degF) per foot on either reference, and pi times that is one over the total resistance, a conductance per foot that does not care what area anyone names.

## Keeping the pair together, either way

Published fluid, 180.0 degF in against a 40.0 degF ambient at 120000.0 lb/hr and Cp 0.5, buried build, 26400.0 ft.

| Route | U | Diameter handed on | Relaxation length, ft | ntu | Arrival, degF |
| --- | --- | --- | --- | --- | --- |
| Bore U, bore | 0.7132000377 | 6.065 in | 52983.477727 | 0.4982685383 | 125.06144556 |
| OD U, coated | 0.5015139975 | 8.625 in | 52983.477727 | 0.4982685383 | 125.06144556 |
| OD U, bore | 0.5015139975 | 6.065 in | 75347.484814 | 0.3503766591 | 138.61917975 |

The two correct routes agree on arrival to 1.4211e-14 degF. There is no preferred reference, only a kept pair.

## What the third row costs

That mixed call is dimensionally consistent, raises no complaint anywhere in the module and returns `ok: true`. It is wrong on relaxation length by 42.209398 percent, which is exactly the reference ratio and nothing else, and wrong on arrival by 13.55773419 degF.

## Where on the curve decides the size

The error is an error in ntu, and ntu sits inside an exponential. At 5280.0 ft the correct arrival is 166.72111348 degF against a mixed 170.52530171 degF, an error of 3.80418823 degF. At 105600.0 ft it is 59.07861872 degF against 74.47159964 degF, an error of 15.39298092 degF, ntu 1.99307415 against 1.40150664. The relaxation length is 42.209398 percent wrong in every one of them.

## The mistake

Reading a returned U as a property of the pipe. It is a property of the pipe and a chosen area together, and the function that names the area is not the function that spends it. A careful engineer picks the outside-diameter number because a coated diameter feels like the honest outside of a line, hands it to a profile with the bore, and gets an arrival tens of degF too warm with nothing to say so.

## Exercise

Build the published buried stack twice, once referred to the bore and once to the coated outside diameter, and record both coefficients and both total resistances.

Then multiply each coefficient by its own reference diameter, say what the two products have to be, and say what the mixed pair does to ntu at 105600.0 ft.
