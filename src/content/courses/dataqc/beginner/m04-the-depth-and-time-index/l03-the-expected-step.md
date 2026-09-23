# The expected step, inferred or stated

{{panel:dq-checks-explorer}}

To call a step irregular, the index check needs to know what a regular step is. It calls that the expected step, and it gets it in one of two ways. You can state it. Or you can leave it out, and the engine infers it from the index as the median of the steps in the stated direction. On EKENE-7's full depth index, left to infer, it reports this.

| EKENE-7 depth index | value |
| --- | --- |
| entries | 240 |
| expected step, ft | 0.500000 |
| expected step source | median of the steps in the stated direction |
| step tolerance, ft | 5.00e-7 |
| duplicates | 0 |
| reversals | 0 |
| irregular steps | 1 |
| monotonic | true |

The result says where the expected step came from in words, beside the number. A reader can tell an inferred step from a stated one without asking.

## Why the median

The median of the steps is the middle step once they are sorted. On a log stepped at half a foot with one skipped sample, almost every step is 0.500000 ft and one is longer. The median ignores the long one and returns the step the tool was set to. A mean of the steps would be pulled toward the long step and return a figure that matches no step in the file, and then every regular step would sit a little away from it. The median describes the typical step and is not moved by the one irregular step the check exists to find, which is why it is the engine's choice.

"In the stated direction" matters too. On the splice, the reversal from entry 4 to entry 5 is a step backward. It is left out of the median, because it is not a step in the direction the index is supposed to run. Only forward steps describe the regular spacing.

## The tolerance that comes with it

A step is regular when it differs from the expected step by no more than the step tolerance. The default tolerance is 1e-6 x expectedStep, which on EKENE-7 is 5.00e-7 ft. That is tight on purpose: room for rounding in a stored depth and little else.

The default is a choice. A looser tolerance would pass small wobbles in a depth column recorded by a tool that does not step perfectly evenly; a tighter one would flag rounding. The engine picks a default that treats a regularly sampled log as regular and states it in the result, so a caller who needs a different one can pass it.

## Stating the step yourself

You can pass `expectedStep` directly, and sometimes you should: when the index is short, when most of it is irregular, or when you know the logging step from the header and want the check measured against that. With `expectedStep` 0.5 and `stepTolerance` 0.6, both stated, the splice reads 0 irregular steps and still 2 duplicates and 1 reversal. The tolerance loosens the step test only. Duplicates and reversals do not depend on it.

That stated tolerance demonstrates what the setting does. Chosen that wide in practice, it would hide the skipped samples this module is about.

## Exercise

Open the checks explorer on the index view on the EKENE-7 splice. With the expected step box blank, read the Expected step tile and the box headed WHERE THE EXPECTED STEP CAME FROM. Now type 0.5 as the expected step and 0.6 as the step tolerance, and read the Irregular steps, Duplicates and Reversals tiles. Explain in two sentences which counts the tolerance moved and which it could not.
