# Equivalent mud weight, revisited

The Associate tier defined equivalent mud weight and used it twice, on the frame's two bounding curves. This tier uses it four hundred times, on every sample of every curve, so this lesson pins the operation down completely: its formula, its behaviours, and the two traps that survive into professional work.

## The operation

$$EMW(P, z) = \frac{P}{g\,(z + d_w)}$$

Pressure over g times column height, the column running from sea level: water depth $d_w$ plus depth below mudline $z$. Units resolve to kg/m3. On this well $d_w$ is 100 m and $g$ is 9.80665, both fixed for every conversion in the tier.

Read it as a question: what density, filling the whole column from sea level, would produce exactly this pressure at this depth? That phrasing keeps the two traps visible.

## Behaviour one: EMW is depth-dependent even when the physics is not

Convert the hydrostatic at several depths, engine values: 1029.5454545454547 kg/m3 at 1000 m, 1029.761904761905 at 2000, 1029.8076923076924 at 2500, 1029.878048780488 at 4000. The pore fluid never changed; only the seawater fraction of the column shrank with depth, pulling the average toward 1030 from below.

Small here, but the principle scales: an EMW is a property of a pressure AT a depth, not of a fluid, and comparing EMWs across depths silently compares different columns. The floor curve of the window inherits this: even a perfectly hydrostatic well has a floor that creeps with depth.

## Behaviour two: division compresses at depth

The same pressure difference is worth fewer kg/m3 the deeper it sits, because the divisor grows. One MPa at 1000 m is $1e6 / (9.80665 \times 1100) = 92.71$ kg/m3; at 4000 m it is $1e6 / (9.80665 \times 4100) = 24.87$. A factor of 3.7 between the same megapascal at two depths.

Consequences run both ways. Deep overpressure looks smaller in mud units: this well's 6 MPa at TD is 149.23 kg/m3, but the same 6 MPa at 1000 m would be a monstrous 556 kg/m3. And shallow hazards dominate in mud units: modest shallow overpressures produce enormous EMW spikes, which is why shallow gas is the classic shallow killer and why window plots weight the shallow section so heavily.

This compression is also why the window WIDENS with depth in mud units on this well even as overpressure grows: module 2 shows the numbers.

## Trap one: the datum, again

Last lesson quantified it: 25 m of air gap moved the TD floor by 7.15 kg/m3, fourteen tolerances. The trap's professional form is subtler: mixing curves computed on different datums in one plot. A floor referenced to sea level and a ceiling referenced to rig floor cross where they should not, and the window they enclose is fiction. One datum per plot, stated on the axis.

## Trap two: the column is not the depth

Dividing by $g z$ instead of $g(z + d_w)$, forgetting the water, gives 1208.5824319466892 kg/m3 for the TD pore pressure instead of 1179.1048116553065: 29.48 kg/m3 heavy, sixty tolerances. The check that catches it is the Associate tier's own: a hydrostatic EMW must come out marginally BELOW the pore fluid density, 1029.88 against 1030 here, because the seawater is lighter. Forget the water and the hydrostatic converts to exactly 1030.0000, a suspicious perfection, wrong in the reassuring direction.

Onshore the trap inverts: there is no water column, but there is elevation above the pressure datum, and the kelly bushing height plays the air gap's role. The rule is always the same question: what column of mud actually stands above this depth?

## Worked example

The capstone's first field, computed with the traps deliberately dodged. Datum: sea level, stated. Column at TD: $4000 + 100 = 4100$ m. Conversion: $47408579.625 / (9.80665 \times 4100)$. Denominator: $40207.265$ exactly, since $9.80665 \times 4100 = 40207.265$. Division: $47408579.625 / 40207.265 = 1179.1048116553065$ kg/m3. Tolerance 0.5, so report 1179.1. The engine's emw function performs literally this arithmetic; there is nothing else inside it.

## Exercise

Convert this tier's other TD pressure, the fracture pressure 76.55157117548856 MPa, stating datum and column, and check both traps.

Self check: sea level, 4100 m, $76551571.17548856 / 40207.265 = 1903.9238599165737$ kg/m3, the capstone's second field. Trap check one: sensible only against other sea-level values, like the floor just computed. Trap check two: the value sits far below the overburden EMW of 2266.333384047207, as a fracture pressure must; dividing by 4000 m instead would have given 1951.5, still below the overburden bracket and therefore NOT caught by the bracket check alone, which is why the column is checked at the input, not inferred from the output.
