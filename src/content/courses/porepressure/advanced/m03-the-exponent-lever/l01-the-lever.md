# The lever

The Professional tier ran the exponent dial from 1 to 5 and called it a volume knob on the evidence, then deferred the question of which volume is right. This module is where the question lands, because the capstone grades a specific alternative: the pore pressure at total depth under n 1.2, and the tier's job is to understand that number as a calibration decision with mud-program consequences.

## Why 1.2 specifically

Eaton's original exponents were fitted pairs: 3 for the sonic form, and lower values for other data types. In modern practice a family of calibrations is in live use, and 1.2 is the classic low calibration, associated with prediction from seismic interval velocities and with basins where the velocity-to-stress response is gentler than Eaton's Gulf Coast shales. The capstone's pairing of 3 and 1.2 therefore brackets the practical range: the standard sonic calibration against the low end of common use.

The honest framing from the Professional tier carries over: nothing in this well can tell you 1.2 is wrong in general. The well was built at 3, so 3 closes the loop HERE; on a well without an encoded answer, 1.2 versus 3 is an empirical question about the basin, answered by measured pressures.

## The graded number

Run the identical pipeline, ratio against the well's own trend, budget, subtraction, with the exponent at 1.2:

$$PP_{TD} = 91.12306695073282 - 49.714487325732826 \times 0.9580337483265022^{1.2} = 43.901549937778526 \ \mathrm{MPa}$$

Tolerance 0.01. The ratio to the 1.2 power is $0.9498542487938293$, so the fluid's share of the budget falls from 12.07 percent at n 3 to 5.01 percent, and the overpressure from 6 to 2.492970312778525 MPa.

Same log, same trend, same frame. The two calibrations disagree about the pore pressure at TD by 3.507029687221474 MPa, and neither run contains any information the other lacks. The disagreement is entirely about how loudly the same four percent of slowness should be read.

## The lever in mud units

Convert both floors, since this tier's language is density. At n 3: 1179.1048116553065 kg/m3. At n 1.2: $43901549.937778526 / 40207.265 = 1091.881030400315$. The lever's throw at TD is 87.22378125499152 kg/m3 of mud floor.

That is the tier's restatement of the whole issue: choosing an exponent IS choosing a mud floor 87 kg/m3 apart. On this well's wide window both choices drill, as module 2 closed by showing. On a well whose window is 150 kg/m3, an 87 kg/m3 disagreement about the floor is the difference between a drillable plan and a managed-pressure well, and the exponent argument becomes a capital-expenditure argument, which is why it gets settled by data rather than seniority.

## What the lever does not move

Worth cataloguing, since a lever's fixed points are as diagnostic as its throw. The frame: hydrostatic and overburden ignore n entirely. The onset's mechanism: the ratio leaves 1 at the same sample under any exponent, though the DETECTED onset shifts with the anomaly's loudness, 2540 m at 1.2 by the 0.05 MPa rule, as the Professional tier's detection lesson showed at 1. The Bowers tiles: no Eaton exponent exists in Bowers, which is what makes module 5's cross-check independent. And the ceiling moves only a third of the floor's move, through the mixture: 1874.84926616491 against 1903.9238599165737 at TD, a drop of 29.07 for the floor's 87.22.

## Worked example

Reproduce the graded value's key step. The ratio at TD is 0.9580337483265022. Raise to 1.2 via logarithms: $\ln(0.9580337483265022) = -0.04287227373353654$, times 1.2 is $-0.05144672848024385$, exponentiate: $r^{1.2} = 0.9498542487938293$. Fraction: $1 - 0.9498542487938293 = 0.0501457512061707$. Times the budget: $49.714487325732826 \times 0.0501457512061707 = 2.492970312778525$ MPa. Plus hydrostatic: $41.408579625 + 2.492970312778525 = 43.901549937778525$, and the engine holds ...526: agreement at the fourteenth digit. The non-integer exponent is the only new arithmetic in the whole capstone, and the logarithm route is the one your calculator is silently taking.

## Exercise

State the general relation between the two calibrations' overpressures without computing: is the n 1.2 overpressure exactly 40 percent of the n 3 value, as 1.2 over 3 might suggest?

Self check: no. The overpressure scales as $1 - r^n$, not as $n$, so the ratio of overpressures is $(1 - r^{1.2})/(1 - r^3) = 0.0501457512061707 / 0.1206891657292486 = 0.4155$, close to 0.4 only because the departures are small enough for the linearisation $1 - r^n \approx n(1-r)$ to nearly hold. At larger departures the two diverge: the linear rule of thumb degrades exactly when the pressures are large enough to matter, the same lesson the Professional tier's estimator taught, now wearing the exponent.
