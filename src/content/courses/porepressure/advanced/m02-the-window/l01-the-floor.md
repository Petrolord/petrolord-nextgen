# The floor

The window's lower wall is the pore pressure, converted. This lesson computes it, reads its shape, and states what it demands of the mud. One wall at a time; the ceiling is next.

{{panel:pp-window-explorer}}

## The graded value

At total depth:

$$\frac{47408579.625}{9.80665 \times 4100} = \frac{47408579.625}{40207.265} = 1179.1048116553065 \ \mathrm{kg/m^3}$$

Tolerance 0.5. Every digit of the numerator was earned at the Professional tier; the denominator is the sea-level column. The mud at TD must weigh at least this, or the formation flows into the well.

## The floor's anatomy

Split the floor value the way the prognosis splits the pressure. The hydrostatic part converts to 1029.878048780488 kg/m3. The overpressure part, 6 MPa, converts to $6000000 / 40207.265 = 149.22676287481862$ kg/m3. Sum: 1179.1048116553065, telescoping exactly.

That decomposition is worth keeping because the two parts have different sources of error. The hydrostatic part is frame arithmetic, near-certain. The overpressure part carries every uncertainty the Professional tier catalogued: trend, exponent, screening. When a driller asks how solid the 1179 is, the honest answer is that 1030 of it is arithmetic and 149 of it is interpretation, and the error bars belong to the 149.

## The shape down the well

The floor's engine values: 1029.5454545454547 kg/m3 at 1000 m, 1029.761904761905 at 2000, 1029.8076923076924 at 2500, then the break: 1095.6268524501886 at 3000, 1143.1629125531026 at 3500, 1179.1048116553065 at 4000.

Above the break, the creep of the seawater fraction, four decimal places of drift, operationally flat. Below it, a climb of 149 kg/m3 over 1500 m. Note the climb DECELERATES in mud units, 65.8 kg/m3 in the first 500 m below the break, then 47.5, then 35.9, even though the overpressure grows linearly in MPa: the deepening column divides the same 4 kPa per metre by an ever larger height. Mud units compress at depth, exactly as module 1 said, and here is the well demonstrating it.

## What the floor demands

The mud must sit above the floor at every EXPOSED depth, so what binds a section is the floor's maximum over the open hole, which for a monotonic floor is at the bottom. Drilling ahead below 2500 m, the demand tightens continuously: a mud adequate at 3000 m, say 1100 kg/m3, is 43 kg/m3 light by 3500. Every prognosis-update cycle on a real well is this line moving under a rig that has already chosen its mud.

The floor also sets the KICK behaviour if it is violated. Mud below the floor does not merely risk influx, it sets the influx's drive: the underbalance in pressure units is the floor deficit times the column, back through the same conversion. A mud 25 kg/m3 under the floor at TD is underbalanced by $25 \times 40207.265$ Pa, almost exactly 1 MPa, and that megapascal is what pushes formation fluid in. The conversion runs both directions, and reading deficits in both units is a habit the module quizzes test.

## One more reading: the floor is the prognosis, wearing overalls

Nothing in this lesson added information to the Professional tier's red curve; division by a known column is information-neutral. What changed is the question the curve answers. In MPa it answered what is the pressure. In kg/m3 it answers what mud balances it, and that phrasing is decidable at the rig. The whole tier is this manoeuvre performed carefully, which is why its capstone can be arithmetically light and still be the tier that makes the previous one consequential.

## Worked example

The floor at 3200 m, a depth between the table's rows, done from scratch. Overpressure there: $700 \times 4$ kPa $= 2.8$ MPa, the ramp 700 m below its top. Hydrostatic: $9.80665 \times (1025 \times 100 + 1030 \times 3200) = 33327900.025$ Pa. Pore pressure: $33327900.025 + 2800000 = 36127900.025$ Pa. Column: 3300 m. EMW: $36127900.025 / (9.80665 \times 3300) = 1116.3698604950969$ kg/m3, so 1116.4 to one decimal. The floor between table rows is found by running the machinery, not by interpolating mud units; module 1's compression warning explains why EMW interpolates poorly, its divisor changes with depth.

## Exercise

A mud of 1150 kg/m3 is in the hole with the bit at 3500 m. Using the floor table, state whether the well is balanced at the bit, and find to the nearest 100 m the shallowest bit depth at which this mud would become inadequate.

Self check: at 3500 m the floor is 1143.1629125531026 kg/m3, so 1150 balances with 6.8 kg/m3 to spare, thin but positive. Running the machinery deeper, the floor reads 1151.1284145162942 kg/m3 at 3600 m, so it crosses 1150 between the two, near 3590 m by a finer scan. To the nearest 100 m the mud becomes inadequate at about 3600 m. The exact crossing matters less than the habit: a mud's adequacy has a depth horizon, and the prognosis tells you where it is before the well does.
