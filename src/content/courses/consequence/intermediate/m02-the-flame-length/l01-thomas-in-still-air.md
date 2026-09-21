# Thomas in still air

{{panel:cq-fire}}

The burning flux tells you how fast the pool burns. The flame length tells you how tall the cylinder of the solid flame model stands, and so how much of a target's view it can fill. The engine carries two correlations for the flame length, both from Thomas. This lesson takes the first, the form for still air, and explains why it is taught and never graded.

## The correlation as the engine prints it

The model string reads "Thomas (1963), still air: L/D = 42 (m" / (rho_air sqrt(g D)))^0.61". The group inside the brackets is a dimensionless burning flux: the burning flux divided by the air density and by the velocity scale sqrt(g D) of a pool of diameter D. A faster burning pool, or a smaller one, gives a larger group and a taller flame relative to its diameter. The constant 42 and the exponent 0.61 are the fit to Thomas's experiments. Gravity is the engine's own constant, `G_M_S2`, 9.80665.

## ERHA in still air

ERHA is a heptane bund fire with a stated diameter of 20 m and a stated air density of 1.2 kg/m3. Its Babrauskas burning flux is 0.101000 kg/(m2 s), already on the heptane asymptote. In still air the engine returns:

| quantity | value |
| --- | --- |
| L/D | 1.855055 |
| flame length m | 37.101102 |

A flame nearly twice as tall as the pool is wide is typical of a large hydrocarbon bund fire.

## One expression, imported

The still air form is the same expression the facilities engine uses for its own flame height. This engine imports it from there and does not restate it, so the two engines cannot drift apart. The call still names its method, and the basis block carries the Thomas citation with the number.

## Single route, taught and never graded

Thomas in still air is a single route quantity. The engine's validation record plants a mistake in both the engine and its independent oracle and asks what would still catch it. For the still air form the answer is nothing but the transcription alone: the Yellow Book's worked pool fire uses the wind form, so no published worked number stands behind the still air one. The course therefore teaches it, and no capstone grades it.

## Two correlations that disagree

The wind form, which the next lesson takes up, gives ERHA a flame length of 35.746382 m at no wind at all. The still air form gives 37.101102 m for the same fire in the same calm. They are different fits with different constants and exponents, and neither is a limiting case of the other. The engine never swaps one for the other silently: the method is named in every call, and a note quotes it beside the length.

## Exercise

In the fire panel, load ERHA and choose the still air flame length. Confirm the panel returns 37.101102 m and an L/D of 1.855055. Then switch to the wind form with the wind set to zero and record the length it returns. Write two sentences for a colleague explaining why the two numbers differ, and which one a graded answer in this course would use.
