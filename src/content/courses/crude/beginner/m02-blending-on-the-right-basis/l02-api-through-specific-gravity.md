# API through specific gravity

A blend's API is not blended at all. The engine blends specific gravity on volume and converts the answer back to API. The basis it names for the API is exact: "computed from the volume-blended specific gravity, never averaged directly".

{{panel:crude-assay-explorer}}

## The shortcut and the answer

The tempting shortcut is to average the API numbers by volume. The engine refuses to take it. The table below prints the engine's blend API beside the shortcut. The shortcut column is computed with the engine's own volume-blending helper, blendOnVolume, so that it can be read beside the right answer.

| blend (by volume) | blend API | volume-weighted mean of the API numbers | blend API minus that mean |
| --- | --- | --- | --- |
| A 20 API crude and a 40 API crude, 50 and 50 | 29.3808 | 30.0000 | -0.6192 |
| Obigbo Light and Egbema Medium, 65 and 35 | 32.8173 | 32.9850 | -0.1677 |
| Asarama Heavy and Ubie Condensate, 50 and 50 | 33.8111 | 35.9000 | -2.0889 |
| Obigbo Light, Egbema Medium and Asarama Heavy, 50, 30 and 20 | 29.2240 | 29.6100 | -0.3860 |

Read the last column. On every row the engine's blend API minus the volume-weighted mean of the API numbers is a negative number: -0.6192, -0.1677, -2.0889 and -0.3860. The shortcut gives a plausible figure on every row, and on every row it is wrong.

The first row is the cleanest case. Half a 20 API crude and half a 40 API crude look as if they ought to make a 30 API blend, and the shortcut says 30.0000. The engine, blending the two specific gravities and converting back, gives 29.3808.

The third row pairs the heaviest and the lightest crude in the library, at 17.2 and 54.6 API, and the difference printed for them is -2.0889. Nothing in the shortcut figure itself warns you that it is wrong. The gap of -2.0889 shows only when the engine's figure is printed beside the shortcut figure in the same row.

## The reading that does work

There is one average of the API numbers that gives the right answer. API = A / SG - B, and 1 / SG is proportional to the volume one unit of mass takes up, which is what blends linearly on mass. So the mass-weighted mean of the API numbers is the blend API.

| blend (by volume) | blend API | mass-weighted mean of the API numbers | blend API minus the mass-weighted mean |
| --- | --- | --- | --- |
| A 20 API crude and a 40 API crude, 50 and 50 | 29.3808 | 29.3808 | 0.0000 |
| Obigbo Light and Egbema Medium, 65 and 35 | 32.8173 | 32.8173 | 0.0000 |
| Asarama Heavy and Ubie Condensate, 50 and 50 | 33.8111 | 33.8111 | 0.0000 |
| Obigbo Light, Egbema Medium and Asarama Heavy, 50, 30 and 20 | 29.2240 | 29.2240 | 0.0000 |

The difference column prints 0.0000 on every row. This is the same rule as blending specific gravity on volume, written in the other variable. It is useful as a check, and it shows why the volume average fails: it weights the API numbers by the wrong fraction.

The engine does not use this route, and nothing in its result is formed this way. It blends specific gravity on volume and converts. The mass-weighted mean is printed to show that the hyperbola is the whole story: once the right weights are used, API agrees with the specific gravity route to four decimals.

## What to carry forward

When someone quotes a blend API, ask how it was formed before you use it. If it came from averaging API numbers on barrels, it carries an error of the kind in the first table. If it came from blended specific gravity, it is the engine's answer, and the engine names that basis beside it.

## Exercise

Read the Asarama Heavy and Ubie Condensate row in both tables. Quote the engine's blend API, the volume-weighted mean of the API numbers, the mass-weighted mean, and both difference columns. Say what the two difference columns together show about which weights make an average of API numbers agree with the engine, and explain in terms of 1 / SG why those weights are the right ones.
