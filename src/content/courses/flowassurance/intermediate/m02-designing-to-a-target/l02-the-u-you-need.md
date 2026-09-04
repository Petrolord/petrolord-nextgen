# The U you need

A design target and a hydrate boundary are the same arithmetic. The wall a line needs to land on a laboratory number is one call, and the ratio to the wall it already has is the verdict.

{{panel:pd-line-explorer}}

## A band of targets on one line

TEACHING LINE AKASO SPUR carries 90000.0 lb/hr at Cp 0.620 into a 9.562 in bore at 195.00 degF against a 45.00 degF seabed over 60000.0 ft. It is a teaching construct, not a published case and not a real line, and its 71.00 degF flowing hydrate boundary is a laboratory input chosen for it. Its overall U referred to the bore is 0.452972856617 Btu/(hr ft2 degF).

| Target arrival, degF | U needed, Btu/(hr ft2 degF) | ntu implied | Ratio to the U it has |
| --- | --- | --- | --- |
| 100.00 | 0.372732538977 | 1.003302108864 | 0.82285844 |
| 90.00 | 0.447282863507 | 1.203972804326 | 0.98743856 |
| 80.00 | 0.540647627826 | 1.455287232607 | 1.19355414 |
| 71.00 | 0.651078288819 | 1.752538756075 | 1.43734504 |
| 60.00 | 0.855423685787 | 2.302585092994 | 1.88846566 |
| 50.00 | 1.263564508066 | 3.401197381662 | 2.78949277 |

## The ratio is the whole reading

A ratio above one means the line may be worse insulated than that and still make the target. The 71.00 degF row needs 0.651078288819 against the 0.452972856617 the line has, a ratio of 1.43734504, and that single number is the same statement as saying the arrival sits above the boundary. The 90.00 degF row at 0.98743856 sits just below one, so this line misses that target and only just.

## The U you need is referred to something

The engine reports `referenceIdIn` on every U it builds, and no consumer accepts it. `relaxationLengthFt`, `steadyStateProfile` and `cooldownTime` each take a bare inside diameter. Keeping the pair together is the caller's job and nothing complains when the caller does not.

The published buried build is 0.713200037662 Btu/(hr ft2 degF) referred to the 6.065 in bore and 0.501513997498 referred to the 8.625 in coated outside diameter, one identical total resistance, a ratio of 1.4220939819 that is exactly the ratio of the two diameters.

## What the mismatch costs, in degrees

Hand the outside-diameter U of 0.5015139975 to a consumer with the 6.065 in bore, on the published fluid over 26400.0 ft, and the relaxation length comes back as 75347.484814 ft instead of 52983.477727 ft, wrong by 42.209398 percent, and the arrival as 138.61917975 degF instead of 125.06144556 degF. That is 13.55773419 degF, from an input pair that is dimensionally consistent and raises no complaint anywhere.

## The careful mistake

Taking a U from one place and a diameter from another. Both halves are correct numbers about the same line, and the answer comes back tens of degF wrong with `ok = true` on it.

## Exercise

Run AKASO SPUR against an 80.00 degF target and record the U needed and its ratio to the U the line has.

Then say what that ratio tells you that the arrival in degF does not.
