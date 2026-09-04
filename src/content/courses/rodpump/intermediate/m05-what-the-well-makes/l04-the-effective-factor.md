# The effective factor

The engine multiplies a swept rate by the fillage, and the swept rate had already moved with the same fillage. The factor that comes out is not the factor that went in, and its sign flips.

{{panel:pd-card-explorer}}

## The arithmetic in question

`runRodPumpDesign` computes the swept rate from the plunger stroke the march returned, then multiplies by the fillage. The plunger stroke had already moved with that fillage, because the pound down state holds the fluid load on the plunger while it travels down through the empty part of the barrel, and that travel is inside the plunger stroke.

So a fillage multiplier is charged against a swept volume the same fillage already changed. The effective factor, produced rate over produced rate at a full barrel, is what the design really applied. The nominal factor is what was typed.

## Above the nominal, for most of the range

| Fillage | Produced, bbl/d | Effective over nominal |
| --- | --- | --- |
| 0.9000 | 316.565396 | 1.031602494 |
| 0.8800 | 310.578880 | 1.035096166 |
| 0.8600 | 304.464568 | 1.038316510 |
| 0.8400 | 298.332201 | 1.041627166 |
| 0.8200 | 293.945787 | 1.051344000 |

Five contiguous teaching rows on ODUMA-4. The largest overstatement in the whole sweep is 5.134400 percent, at a fillage of 0.8200.

## And below it, further down

| Fillage | Produced, bbl/d | Effective over nominal |
| --- | --- | --- |
| 0.7000 | 247.191055 | 1.035681367 |
| 0.6500 | 219.054049 | 0.988392365 |
| 0.6000 | 200.802627 | 0.981543592 |
| 0.5500 | 183.158134 | 0.976686022 |
| 0.5000 | 171.087066 | 1.003549101 |

Five more contiguous rows on the same design. The largest understatement is 2.331398 percent, at a fillage of 0.5500, and by 0.5000 the ratio is back above one. Across the twenty contiguous rows of the sweep the effective factor sits above the nominal fillage on sixteen and below it on three.

## Why the flip settles it

A convention can be conservative or optimistic and still be a convention. This one is optimistic at 0.8200 and pessimistic at 0.5500 on the same design with one input moved, so there is no direction to defend and no correction to apply. That is an accounting mistake rather than a modelling choice.

Part of the behaviour is real: the plunger genuinely does travel further when the string stays loaded into the downstroke. What is not defensible is charging the fillage a second time against a volume it has already changed.

## The mistake

Reading the ratio as a small correction to carry and forget. It changes sign, so one case tells you nothing about the next, and any repair has to be adjudicated against the published method before the arithmetic is touched.

## Exercise

Read the produced rate at fillages of 1.0000, 0.8200 and 0.5500 in the panel, and form the effective factor at each as produced over produced at a full barrel.

Then write each beside its nominal fillage and say which way the error runs at each of the three.
