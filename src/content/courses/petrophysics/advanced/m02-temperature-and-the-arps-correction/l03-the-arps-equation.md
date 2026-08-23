# The Arps equation

The previous lesson established the physics: resistivity of an NaCl brine falls as it heats, roughly in inverse proportion to an offset temperature. Arps turned that behaviour into the standard correction formula, and it is the first leg of the Expert triangulation.

## The formula

$$R_{w2} = R_{w1}\,\frac{T_1 + 6.77}{T_2 + 6.77}$$

with both temperatures in degF. $R_{w1}$ is the resistivity measured at temperature $T_1$; $R_{w2}$ is the same water's resistivity at temperature $T_2$. The constant 6.77 is empirical: shifting the Fahrenheit scale by 6.77 degrees makes NaCl solution resistivity behave as a clean inverse proportionality through the origin of the shifted scale. It carries no deeper physical meaning, and it is the reason the formula must be fed degF rather than degC. This formula is implemented in the app exactly as written, and it is one of the two places (with the SP coefficient) where the engine works in degF internally while the rest of the app stays SI.

Because the formula is a pure ratio, it needs no salinity input: whatever the salinity is, it cancels, provided the water is NaCl-dominated so the empirical behaviour holds. That convenience is also its main limit, which the next lesson takes up.

## Worked example

Correct the typewell lab sample, 0.114 ohm.m at 75 degF, to the formation temperature of 180 degF. Step by step:

1. Offset the temperatures: $T_1 + 6.77 = 75 + 6.77 = 81.77$ and $T_2 + 6.77 = 180 + 6.77 = 186.77$.
2. Form the ratio: $81.77 / 186.77 = 0.437811$.
3. Scale the lab value: $0.114 \times 0.437811 = 0.049910$ ohm.m.

So the sample that reads 0.114 ohm.m on the bench is expected to read 0.0499 ohm.m in the formation. This is one of the six numbers the Expert capstone grades, with a tolerance of 0.0005 ohm.m, and notice how close it lands to the two independent routes you will meet later: the SP quicklook gives 0.0498 and the Professional-tier Pickett fit gave 0.0500. Three routes, three methods, one answer near 0.05 ohm.m.

## Intermediate stops

Run the same sample to two intermediate temperatures, partly for practice and partly to see the shape of the correction:

* To 100 degF: $0.114 \times 81.77 / 106.77 = 0.0873$ ohm.m.
* To 140 degF: $0.114 \times 81.77 / 146.77 = 0.0635$ ohm.m.

The correction is steepest early and flattens with temperature, exactly as an inverse relationship should. Plotting these three points against $1/(T + 6.77)$ would put them on a straight line through the origin, which is a good mental model to carry.

## Sanity checks

* **Identity at equal temperatures.** Set $T_2 = T_1$ and the ratio is 1: the formula returns the input unchanged. Any implementation or hand calculation that fails this check is broken.
* **Direction.** For $T_2 > T_1$ the ratio is below 1, so $R_{w2} < R_{w1}$: heating lowers resistivity, as the physics demands.
* **Reversibility.** The correction inverts cleanly. Taking the corrected 0.049910 ohm.m at 180 degF back to the bench multiplies by $186.77 / 81.77 = 2.28409$ and returns $0.049910 \times 2.28409 = 0.11400$ ohm.m, the original lab value to the last digit. Round trips like this are a free arithmetic audit; use them.

## Using it in the workflow

In the app's Learning Mode the Arps leg is a single computation from the two given temperatures and the lab value, and the result feeds two places: the triangulation comparison in module 4, and the corrected booking of SAND_A in module 5. Carry the unrounded value (0.049910) through the workflow and round only in the report; rounding to 0.05 before the water-leg check would still pass here, but the habit of premature rounding eventually costs a capstone tolerance somewhere else.

## Exercise

A different field's water sample measures 0.20 ohm.m at 68 degF, and the reservoir sits at 212 degF. Apply Arps: the offsets are $74.77$ and $218.77$, the ratio is $74.77 / 218.77 = 0.34178$, and the corrected value is $0.20 \times 0.34178 = 0.0684$ ohm.m. Then verify your arithmetic by the round trip: $0.0684 \times 218.77 / 74.77$ should return 0.20 within rounding. Finally, state in one sentence why the answer would be unchanged if the same water had twice the salinity but still measured 0.20 ohm.m at 68 degF.
