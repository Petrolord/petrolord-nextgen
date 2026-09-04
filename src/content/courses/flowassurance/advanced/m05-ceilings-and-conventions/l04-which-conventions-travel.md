# Which conventions travel

Some quantities here mean the same thing wherever they are carried. Others are conventions, and a convention that does not travel with its value is a defect waiting for a second reader.

{{panel:pd-hydrate-explorer}}

## Three values of one constant

The module carries k = 2335.000000 on all four inhibitors and NIELSEN_BUCKLIN_CONSTANT_F = 129.600000 degF, and those two are not independent. For the module's own relations to meet as the aqueous phase goes dilute, the Hammerschmidt constant has to be 129.6 times 18.015, which is 2334.744000. The oracle works in Celsius with the metric constants, 1297 and 72, and converts, reaching a third value, 2334.600000. Carried against meeting is 1.0001096480, carried against metric 1.0001713356, meeting against metric 1.0000616808.

## The dilute limit says which one

Engine methanol, walking down.

| Weight percent | Hammerschmidt, degF | Nielsen-Bucklin, degF | Ratio |
| --- | --- | --- | --- |
| 1 | 0.7361379084225526 | 0.7339748803996604 | 1.0029470055 |
| 0.1 | 0.0729506035373701 | 0.0729220861281794 | 1.0003910668 |
| 0.01 | 0.0072884941427976 | 0.0072874901676978 | 1.0001377669 |
| 0.001 | 0.0007287838171765 | 0.0007287018676155 | 1.0001124597 |

The ratio walks toward 1.0001096480 and stops. What is left over is the series correction on the logarithm. The gap is a constant, not a curvature.

## What a tolerance decided instead

Every one of the 24 published inhibitor rows differs from the engine's Hammerschmidt by 1.713062e-4, the same figure on all four fluids and all six concentrations. The harness compares Hammerschmidt at a relative tolerance of 5.0000e-4 and Nielsen-Bucklin at 1.0000e-9, a ratio of 500000.0, and the gap between the carried constant and the metric one is 1.713356e-4. It fits inside the looser tolerance and would not survive the tighter one.

## What does travel

The mole fraction travels: the Hammerschmidt inverse fixes it from the depression alone, so methanol and MEG sized for the same need land on 0.2403082363926517 and 0.2403082363926517. The conductance per foot travels: on the published buried build, U times its own reference diameter in feet is 0.360463185702 Btu/(hr ft degF) per foot of pipe on either reference, and that figure is one divided by the product of pi and the total resistance.

What does not travel is `referenceIdIn`, a field the coefficient carries and no consumer accepts, and `leanWtPct`, a weight percent in the mass gross-up and a volume percent in the density blend one line later.

## The mistake

Calling any of these a rounding difference. Each is a decision somebody has to make and write down, and a tolerance wide enough to hide one makes it by default.

## Exercise

Compute both relations at 0.01 and at 0.001 weight percent methanol and take the ratio at each.

Then say which of the three constants that ratio is converging on, and which two of them the module is currently using at once.
