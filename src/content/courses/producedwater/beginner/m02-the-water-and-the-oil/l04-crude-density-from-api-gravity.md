# Crude density from API gravity

API gravity is how the industry talks about how heavy a crude is, and it is the one fluid input in this module that most engineers can quote from memory for their own field. The engine turns it into a density in two steps and then lets the temperature act on it.

## From a degree to a specific gravity to a density

The API figure becomes a specific gravity at 60 degrees Fahrenheit by the standard relation, that specific gravity is taken against a declared reference water of 999 kg/m3, and the result is then thinned by temperature at a declared rate of 0.0007 for each degree. Run six crudes at the UZERE temperature of 41 C:

| API | sg at 60 F | kg/m3 |
| --- | --- | --- |
| 12 | 0.986063 | 967.534410 |
| 19 | 0.940199 | 922.532810 |
| 24 | 0.909968 | 892.869375 |
| 30 | 0.876161 | 859.697757 |
| 38 | 0.834808 | 819.122052 |
| 46 | 0.797183 | 782.203875 |

The UZERE oil is the middle row. Its 24 degrees API become a specific gravity of 0.909968 and a density of 892.869375 kg/m3 at treating temperature.

## Two declared numbers in a chain everybody trusts

Both the reference water and the thermal expansion rate are declared constants of this module. A reader should notice how ordinary the chain looks and how much of it is chosen. The API relation itself is standard. The water the specific gravity is taken against is a choice. The rate at which the crude thins with temperature is a choice, and it is a single rate applied to every crude in the table above, from the heaviest to the lightest. Real crudes do not all expand at one rate. That simplification is exactly the kind of thing a course should point at rather than pass over, because it is invisible in the output.

## The range the module holds API gravity to

This engine holds API gravity to a stated range and refuses outside it, naming the input that fell out of range. A crude far outside the range would still produce a number if the algebra were allowed to run, which is the reason for the guard: the formula never stops being computable, and it does stop being meaningful. The guard is cheap and the wrong answer it prevents is not, because a density is exactly the sort of intermediate figure nobody checks once it has been printed.

## What the column is actually for

Look down the density column and notice the spread. Nearly two hundred kilograms per cubic metre separate the heaviest row from the lightest, against a brine that barely moved in the last lesson. That asymmetry is the subject of the next lesson, because it is the crude, and therefore the API gravity typed into the studio, that carries most of the variation in what any of this equipment can catch.

{{panel:pw-water-explorer}}

## Exercise

Take the API gravity of a crude you know and place it in the table above. Then say which two of the three steps between a degree API and a density at treating temperature rest on a declared choice rather than a derivation.
