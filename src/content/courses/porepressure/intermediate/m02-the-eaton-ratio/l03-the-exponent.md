# The exponent

The third part of the machine is the exponent $n$, and it is the strangest of the three: a pure number, with no unit and no derivation, that scales how loudly the sonic's evidence is read. This lesson pins down what it does on this well. Which value is right, and what it costs to choose differently, are questions this course returns to twice more, here in miniature and at the Expert tier with a graded number attached.

{{panel:pp-eaton-explorer}}

## What raising a ratio to a power does

The ratio sits just below 1. Powers of such a number fall steadily: $0.9580337483265022$ cubed is $0.8793108342707514$, and the higher the power the smaller the result. So a bigger exponent converts the same slowness into a bigger handover fraction, hence more pressure. The exponent is a volume knob on the evidence.

The engine's overpressure at total depth, for the five exponents the panel offers, with everything else at capstone settings:

$n = 1$: 2.0863306869306193 MPa. $n = 2$: 4.085105895179361. $n = 3$: 6, the capstone. $n = 4$: 7.834533176889628. $n = 5$: 9.592077872774526.

Set the panel to each in turn and watch the red curve peel further from the hydrostatic while the log and the trend behind it never change. Nothing about the well is different across those five runs. Only the reading of it is.

## Two structural facts

First, the steps shrink. From 1 to 2 buys 2.00 MPa, from 2 to 3 buys 1.91, from 3 to 4 buys 1.83, from 4 to 5 buys 1.76. Overpressure is not linear in $n$; each increment multiplies the surviving fraction $r^n$ by another factor of $r$, and there is less left to hand over each time. The lever is powerful but it saturates.

Second, $n = 1$ does not switch the amplification off. It leaves the raw ratio, and the raw ratio already carries a third of the capstone's overpressure, 2.09 of 6 MPa. There is no setting on this dial that reads a slow log as normally pressured. The only way to zero the method's output is a ratio of 1, which is the trend's business, not the exponent's. Keep this asymmetry in mind: the trend can silence the method entirely, the exponent can only rescale what the trend lets through.

## Why 3

Eaton fitted the exponent to Gulf of Mexico wells where measured pressures existed, and 3 is the value that made the sonic form work there. It travelled, and 3 is now the default in most software and most basins, adjusted when local calibration demands it.

On this well, 3 is not a default, it is the truth: the ramp was encoded into the transit times by inverting Eaton at $n = 3$, so running the method at 3 closes the loop exactly. The well cannot tell you 3 is right in general. It can show you, cleanly, what kind of choice the exponent is: with the trend fixed and honest, every one of the five curves you just drew is the same well read at a different volume, and only external information, a measured pressure, a drilling event, a regional calibration, can say which volume is correct.

That external information exists at the next tier. The Expert capstone grades the pore pressure at total depth under $n = 1.2$, a low calibration in real use for velocity data, and then asks what the choice does to the driller's mud window. This tier's job is that you arrive there already knowing the shape of the answer: lower $n$, quieter reading, less pressure.

## The exponent moves the detected onset, not the real one

Step the exponent through its five values and watch the onset tile: 2540 m at $n = 1$, 2520 m at 2 and 3, 2510 m at 4 and 5.

The physics did not move. Above the ramp top the ratio is exactly 1, and 1 to any power is 1, so every exponent returns the hydrostatic there: the real departure begins at the first sample below 2500 m at every setting. What moves is the detection. The rule flags the first sample more than 0.05 MPa over hydrostatic, and the overpressure at 2510 m scales with the exponent: 0.0133 MPa at $n = 1$, 0.0267 at 2, 0.0400 at 3, 0.0533 at 4, 0.0667 at 5. At 4 and above, the 2510 m sample clears the threshold; at 3 it misses by exactly 0.01 MPa and detection waits for 2520 m; at 1, even 2530 m's sample is under and the flag lands at 2540.

So the graded onset of 2520 m is a joint property of the ramp, the grid, the threshold and the exponent. On a real well this is worth remembering in both directions: two prognoses can disagree about the onset without disagreeing about the geology, and an onset quoted without its detection rule is not a complete statement.

## Worked example

Verify the $n = 2$ figure by hand from the pieces you already own. Ratio at TD 0.9580337483265022; squared, 0.9178286629325279. Handover fraction $1 - 0.9178286629325279 = 0.0821713370674721$. Times the budget: $49.714487325732826 \times 0.0821713370674721 = 4.085105895179364$ MPa, agreeing with the engine's 4.085105895179361 in every digit that survives the two roundings.

The agreement is the point: the prognosis at any exponent is nothing but this arithmetic, repeated per sample.

## Exercise

Predict, then verify on the panel: at $n = 5$, does the fracture pressure at total depth rise by more or less than the pore pressure does, relative to their $n = 3$ values? State the two differences.

Self check: less. Pore pressure rises from 47.408579625 to 51.000657497774526 MPa, a rise of 3.592 MPa; fracture pressure rises from 76.55157117548856 to 77.74893046641338, a rise of 1.197 MPa, one third as much. The coefficient form passes exactly one third of any pore pressure change through to the fracture pressure on this well, a fraction module 5 derives.
