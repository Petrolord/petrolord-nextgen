# What a U value is referred to

A U is a resistance divided by an area, so one pipe has as many U values as there are areas you can name on it. The engine gives two of them and neither is wrong.

{{panel:pd-thermal-explorer}}

## One line, two numbers

Nothing about the pipe changes between these two rows: same layers, same films, same 4.0 ft trench, same wet soil.

| Reference | U, Btu/(hr ft2 degF) | Total resistance, hr ft degF/Btu per foot |
| --- | --- | --- |
| 6.065 in bore | 0.713200037662 | 0.883057962117 |
| 8.625 in coated outside diameter | 0.501513997498 | 0.883057962117 |

The totals are identical to 0.0000e+0 relative. The physics did not move. The ratio of the coefficients is 1.4220939819 and the ratio of the reference diameters, 8.625 / 6.065, is 1.4220939819, agreeing to 4.4409e-16. On the insulated build the pair reads 1.334879113149 against 0.938671515507, ratio 1.4220939819 again.

## The invariant

U times its reference diameter in ft is 0.360463185702 Btu/(hr ft degF) per foot whichever reference is chosen, and pi times that product is one over the total resistance. The product belongs to the pipe. The coefficient belongs to the pipe and to a choice of area, which is why a U quoted with no reference is not yet a number.

## The engine says which, and nothing listens

`overallU` reports the reference it used, in `referenceIdIn`. The three functions that consume a U in this module, the relaxation length, the steady state profile and the cooldown, each take a bare diameter instead. None accepts a `referenceIdIn` and none accepts the `overallU` result. Keeping the pair together is the caller's job, and nothing complains when the caller does not.

## The mistake

Handing a coefficient computed on the coated outside diameter to a consumer along with the bore. It is dimensionally consistent, it raises no error and it returns a confident answer. On a derived run of the published buried build, that pairing puts the relaxation length out by 42.209398 percent, which is the ratio between the two reference diameters and nothing else. The error is not noise and it does not shrink on a better pipe. It is the size of the ratio you failed to carry.

## What it refuses

Not this. A U and a diameter that were never meant for each other are accepted without a note anywhere in the return. The only defence is writing the reference down beside the number every time, in a table, in a note, in a handover.

## Exercise

Build the buried pipe referred to the 6.065 in bore and record U and the total resistance, then refer it to the 8.625 in coated outside diameter and record both again.

Multiply each coefficient by its own reference diameter in ft, then say which of the two coefficients you would put on a datasheet with no other text.
