# The thresholds are boundaries

`channellingSlope` sits at 1.3 and `ambiguousBand` at 0.25. Neither was measured on a well. They are lines drawn between pictures, and it is the threshold, not the physics, that decides whether a squeeze is recommended.

{{panel:pd-diagnostic-explorer}}

## Why one comparison carries everything

For any power-law history the ratio and its derivative have the same log-log slope. The golden channelling history is a t^m with m = 1.600000000 and publishes a lateDerivativeSlope of 1.600000000000; the golden displacement history is a t with m = 1.000000000 and publishes 1.000000000000. The exponent of the ratio and the slope of the derivative are one number twice.

So the shape does not separate channelling from displacement. Only steepness does, and steepness is compared against a constant somebody typed.

## The constants

| Threshold | Value | What it gates |
| --- | --- | --- |
| coningSlope | -0.1 | coning below this |
| channellingSlope | 1.3 | channelling at and above this |
| ambiguousBand | 0.25 | how close counts as doubtful |
| minR2 | 0.5 | fit quality floor |
| minSpanDecades | 0.4 | span floor, in log cycles |
| minWor | 0.1 | ratio floor, on the last sample |

Those are the shipped defaults, all overridable and all round on purpose. The band puts every derivative slope from 1.050000 to 1.550000 into doubt, a width of 0.500000.

## One history, the line crossed under it

Teaching well ELELENWO-4 is a constructed case, not a real well and not a published one. Read its 38 samples through a moving late window; nothing in the column changes down these rows.

| lateFraction | Window starts, days | Derivative slope | Slope less 1.3 | Mechanism | Water shutoff |
| --- | --- | --- | --- | --- | --- |
| 0.60 | 138.369943 | 1.387035000 | 0.087035000 | channelling | candidate |
| 0.70 | 76.510604 | 1.336892539 | 0.036892539 | channelling | candidate |
| 0.80 | 42.305954 | 1.292632524 | -0.007367476 | displacement | blocked |
| 0.90 | 23.392754 | 1.254360095 | -0.045639905 | displacement | blocked |

Four samples carry a negative derivative on every row, and the derivative fit uses the positive ones only, so the window quoted is longer than the window fitted. Across the full range of the dial the slope moves by 0.370920348, from 1.229355999 to 1.600276347.

The squeeze turns from candidate into block between a slope of 1.336892539 and one of 1.292632524. That gap is the whole spend.

## The engine says so itself

Inside the band the classifier prints: "This sits within 0.25 of the boundary between displacement and channelling, and that boundary is the weak part of the reading: for any power-law history the ratio and its derivative have the SAME log-log slope, so nothing separates the two pictures except how steep the climb is."

## The mistake

Treating 1.3 as a property of channelling. Move that constant and the same 38 samples change mechanism with no datum touched, which is a fact about the constant, not about the water.

## Exercise

Copy the four sweep rows and mark the two where the verdict flips.

Then write the margin against 1.3 on each, and say what could move the flip apart from the data.
