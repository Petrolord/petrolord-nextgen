# The two densities

Oil arrives as an API gravity and water as a specific gravity, and both have to become pounds per cubic foot before anything can settle in them.

{{panel:fc-separator-explorer}}

## From API to pounds

| stream | oil API | oil lb/ft3 | water SG | water lb/ft3 |
| --- | --- | --- | --- | --- |
| ABANA-1 | 33.000000 | 53.675380 | 1.040000 | 64.896000 |
| ABANA-2 | 33.000000 | 53.675380 | 1.040000 | 64.896000 |
| AGBAMI | 27.000000 | 55.707256 | 1.050000 | 65.520000 |

API runs backwards against density: the heavier oil carries the lower API. At 27.000000 API the oil weighs 55.707256 lb/ft3 and at 33.000000 API it weighs 53.675380. The scale is built from 141.5 and an offset of 131.5, and it is not linear in density.

Water is easier. A specific gravity is a ratio against fresh water, so 1.040000 times 62.4 gives 64.896000 lb/ft3 and 1.050000 gives 65.520000. The figure above 1 is dissolved salt.

## Why the gas cares

Neither density is interesting on its own. Both exist to be compared with the gas density, because settling is driven by the difference between the two phases. The ABANA gas weighs 2.239712 lb/ft3 against a liquid in the middle fifties, so the difference is large and drops fall readily.

That relationship is what makes high pressure hard and heavy oil easy. Raise the pressure and the gas density climbs toward the liquid. Lower the API and the liquid climbs away from the gas.

## Two liquids, one gas load

A vessel with oil and water in it holds two liquid densities, and the gas above them sees neither one alone. What the settling calculation needs is a single liquid density standing for the mixture the gas is sitting over, and that is a separate step with a rule of its own.

The two pure densities are inputs to that step. Reading either one straight into the settling velocity is the first place this module goes wrong, because the oil and the water differ by about ten lb/ft3 and the answer sits between them.

## What a density does not tell you

Density sets which phase ends up on top and how fast a drop crosses. It says nothing about how readily the two separate. An emulsion is held together by interfacial effects, and two crudes of identical API can behave differently in a drum. Retention time is where that judgement enters, and it arrives as an input somebody chose.

## The mistake

Using a water density of 62.4 because the specific gravity looked close to 1. On ABANA that would be 2.496000 lb/ft3 of error, which moves the mixture, the settling velocity, the required area and the diameter. Produced water is brine, its gravity is stated on the analysis, and it is above 1 on all three streams here.

## Exercise

Give the oil and water densities in lb/ft3 for each of the three streams, and say why the 27.000000 API oil is the heavier of the two crudes. Then explain what each density is compared against in the settling calculation, and why neither is used on its own where a vessel holds both oil and water.
