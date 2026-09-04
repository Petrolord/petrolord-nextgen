# What the multiplier refuses

`skinPiMultiplier` refuses a design at one place only: where the denominator reaches zero and the productivity index goes infinite. Its refusal text then advertises a completely different limit.

{{panel:pd-channel-explorer}}

## The sweep up to the refusal

Teaching well ELELENWO-4, built for this course, has a drainage radius of 1180 ft, a wellbore radius of 0.354 ft and a minimum skin of -7.361728083. Walking the after-skin down:

| After-skin | Multiplier | Warnings | Notes |
| --- | --- | --- | --- |
| -5.000 | 6.292734624 | none | none |
| -5.500 | 7.982759790 | none | none |
| -6.000 | 10.913873530 | none | none |
| -6.500 | 17.246424216 | none | none |
| -6.800 | 26.457156986 | none | none |
| -7.400 | refused | | |

The refusal reads: "Taking the skin to -7.4 would put it below the -7.4 this geometry allows, where the productivity index goes infinite. Real treatments reach about -3 to -5 on acid and -5 to -6 on a fracture; ask for less."

## Two limits in one sentence

The sentence names the achievable range only when the arithmetic breaks. The deepest figure it calls real for a fracture is -6. An after-skin of -6.800 sits past that and returns 26.457156986 in silence, against 6.292734624 at -5.000, a factor of 4.204397383 handed back with the same confidence as the honest answer.

The refusal prints the request and the floor at the same rounding, so both read -7.4 and the message appears to compare a number against itself. The floor is -7.361728083.

`minimumSkin` is computed on every call and returned inside the successful result. It is never compared against anything but zero.

## The other two refusals

A before-skin below the floor gets a different sentence that never mentions the achievable range: "A skin of -8.5 is below the -7.4 this geometry allows, where the productivity index goes infinite. That is the equation running out, not a well."

Bad geometry gets a third: "The drainage and wellbore radii are needed, and the drainage radius has to be the larger one."

## Two failure contracts in one module

`skinPiMultiplier` returns an object carrying ok false and an error string. `pssDenominator`, `minimumSkin` and `skinFromPiRatio` return a bare NaN for the same bad geometry. Code that checks the ok flag and forgets the finite check reads a refusal as a number.

## The mistake

Treating the guard as a review. Clearing it means one thing only, that the equation still has a denominator. Everything between the range the error message names and the pole is accepted with no warning, no note and no flag.

## Exercise

Run the after-skin down to -6.800 on the teaching geometry and record the multiplier, the warnings and the notes.

Then quote the module's own sentence about what real treatments reach, and say what it implies about that design.
