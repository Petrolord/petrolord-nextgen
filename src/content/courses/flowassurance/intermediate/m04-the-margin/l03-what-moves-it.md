# What moves it

A margin has one moving part on the engine side. With the inlet and the ambient fixed, the arrival depends on ntu and nothing else. Anything that moves a margin moves it through ntu, or through the laboratory number.

{{panel:pd-line-explorer}}

## The group everything travels through

ntu is the length measured in relaxation lengths, and the relaxation length is m Cp over U pi D. Move the mass rate, the heat capacity, the coefficient, the diameter or the length and the arrival moves. Move anything else and it does not.

Derived sweep points on a 180.0 degF inlet against a 40.0 degF ambient: ntu 0.5000 arrives at 124.9142923598 degF, ntu 1.0000 at 91.5031217640 degF, ntu 4.0000 at 42.5641894444 degF with 2.5641894444 degF of excess left. Past that a margin is an argument about a line that already arrived cold.

## Rate and heat capacity move it exactly linearly

Three published relaxation cases on the published insulated U of 1.334879072040 Btu/(hr ft2 degF) and the 6.065 in bore. Golden lengths: 14154.02315291 ft at 60000.0 lb/hr and Cp 0.50, 28308.04630582 ft at 120000.0 lb/hr and Cp 0.50, 33969.65556698 ft at that rate and Cp 0.60.

Doubling the rate multiplies the relaxation length by 2.0000000000, the rate ratio exactly. Raising Cp multiplies it by 1.2000000000, the Cp ratio exactly. A rate turndown is a hydrate question before it is a production question.

## U moves it exactly inversely

The same fluid and bore, three published builds, relaxation lengths derived:

| Build | U, Btu/(hr ft2 degF) | Relaxation length, ft |
| --- | --- | --- |
| bare steel wall | 105.9799311355 | 356.55635841 |
| steel plus 2.0 in foam | 1.3348791131 | 28308.04522908 |
| that build buried 4.0 ft | 0.7132000377 | 52983.47772700 |

The foam is worth a U ratio of 79.39290539 here, the trench 1.87167561 more. Once one resistance dominates, the next has little left to do.

## The boundary moves too, and no engine output moves with it

TEACHING LINE AKASO SPUR carries a flowing hydrate boundary of 71.00 degF and a shut-in boundary of 78.00 degF, both teaching laboratory inputs. Its heat loss arrival is 89.316029952695 degF and its flowing margin is 18.3160299527 degF. Take the shut-in boundary and the margin shrinks by the whole distance between those two numbers while every engine output stays put.

## What does not move it

The station count. On the published 105600.0 ft case, at 2, 3, 5, 11, 21, 51, 101 and 501 stations the arrival is 43.35769344274401 degF, a difference of 0.0000e+0 degF from the 21 station answer. Rerunning at finer resolution because a margin came out tight moves a number outside the group.

`relaxationLengthFt` refuses a zero U, a zero mass rate and a zero heat capacity as a bare NaN rather than an object with a reason, so an unchecked caller carries it into the margin.

## Exercise

Halve the mass rate on AKASO SPUR and say what happens to its relaxation length, its ntu and its arrival, in that order.

Then name a quantity in m Cp over U pi D you could get wrong with nothing complaining.
