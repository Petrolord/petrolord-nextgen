# API gravity is a hyperbola

Crude is priced and specified in degrees API, and the engine computes with specific gravity. The two are tied by a definition, and the shape of that definition is the first thing a blender has to understand.

{{panel:crude-assay-explorer}}

## The definition

The engine's sgFromApi is SG = A / (API + B), and apiFromSg is its inverse, API = A / SG - B. The two constants are not typed into this lesson from memory. They are read back from apiFromSg itself.

| constant | how the engine gives it | value |
| --- | --- | --- |
| A | apiFromSg(0.5) minus apiFromSg(1) | 141.5000 |
| B | A minus apiFromSg(1) | 131.5000 |

Water has a specific gravity of 1, and by the definition it is 10.0000 API. A crude lighter than water has an API above that, and the lighter the crude, the higher the API.

## A round trip

The API of each field stream in the course library converts to a specific gravity and back without loss.

| API (input) | sgFromApi | apiFromSg(sgFromApi) round trip |
| --- | --- | --- |
| 17.2 | 0.9516 | 17.2000 |
| 25.9 | 0.8990 | 25.9000 |
| 36.8 | 0.8408 | 36.8000 |
| 54.6 | 0.7603 | 54.6000 |

These four are the gravities of the four field streams you meet in the next lesson. The round trip proves that the two functions are exact inverses of each other, so moving between API and specific gravity loses nothing.

## Equal steps that are not equal

API is a hyperbola in specific gravity: equal steps of specific gravity are unequal steps of API. The engine shows it plainly when it is handed specific gravity in equal steps.

| SG (input) | apiFromSg | API step from the row above |
| --- | --- | --- |
| 0.75 | 57.1667 | first row |
| 0.8 | 45.3750 | -11.7917 |
| 0.85 | 34.9706 | -10.4044 |
| 0.9 | 25.7222 | -9.2484 |
| 0.95 | 17.4474 | -8.2749 |
| 1 | 10.0000 | -7.4474 |

Read the last column. Every row moves the specific gravity by the same amount, and the API step printed beside it is a different number each time: -11.7917 on the first step and -7.4474 on the last. A straight line would print one step five times. This table prints five different steps.

## Why the shape matters for blending

Mixing is a matter of volumes and masses. When two crudes are poured together, what is conserved is mass, and the engine takes volume as conserved as well. Specific gravity is a ratio of mass to volume, so it behaves well under mixing. API is a curved function of specific gravity, so a quantity that mixes on a straight line in specific gravity cannot mix on a straight line in API.

That is why the engine never averages API numbers. It blends specific gravity and converts the answer back to API at the end. The next module prints, blend by blend, the error a person makes by averaging API directly, beside the answer the engine gives.

## The habit to build

Whenever you see an API number in this course, hold its specific gravity beside it. The API is the number a contract quotes. The specific gravity is the number the arithmetic uses. The assay explorer shows both for every crude, and every blend you build reports the specific gravity it blended and the API it converted from it.

## Exercise

Take the equal-step table. Read the API step on the first row that carries one and the API step on the last row. Say what the two printed steps show about API as a function of specific gravity. Then explain, using the definition SG = A / (API + B), why averaging two API numbers is a different operation from averaging their two specific gravities.
