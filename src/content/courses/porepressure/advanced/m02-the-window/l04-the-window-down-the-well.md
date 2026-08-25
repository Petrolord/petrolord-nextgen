# The window down the well

The capstone grades the window at TD; a well is drilled through the window at every depth. This lesson reads the whole band, finds the one subtlety this well's shape hides, and converts the reading into the section logic a planner would apply.

{{panel:pp-window-explorer}}

## The table

Window width, ceiling minus floor, engine values by depth: 617.6616824116697 kg/m3 at 1000 m, 715.8823409383563 at 2000, 750.2832396352455 at 2500, 735.1476808049017 at 3000, 727.8508566323069 at 3500, 724.8190482612672 at 4000.

## The shape, and the subtlety

The window WIDENS to a maximum at the ramp top, 750.28 at 2500 m, and then NARROWS all the way to TD. The overpressured half of the well has a shrinking window even though this is a benign well; the maximum room sits exactly where the trouble begins.

Unpack both limbs. Above 2500 m the window grows with depth because the ceiling, driven by the overburden, climbs in mud units faster than the essentially flat hydrostatic floor. Below 2500 m the floor climbs at the full overpressure rate while the ceiling gains only a third of it through the mixture, so the band loses width, roughly two thirds of the floor's EMW climb, 15.1 kg/m3 over the first 500 m of ramp, then compounding with compression.

The subtlety: in PRESSURE units the window at these same depths runs 19.13, 22.35, 25.70, 29.14 MPa from 2500 m down, monotonically WIDENING. The two units disagree about the direction of change. Neither is wrong; they answer different questions. The MPa window grows because effective stress grows; the mud window shrinks because the same margin, divided by an ever-taller column, buys fewer density units, and the floor eats the difference. The driller's question is the density one, so below the onset this well is, honestly stated, tightening, gently, from its 2500 m maximum. A report that quotes the MPa trend to argue the well gets more comfortable with depth is committing a units error dressed as an insight.

## Section logic on the shape

Where does the shoe want to be? The operational window for a section is floor-at-bottom against ceiling-at-shoe, so a shoe placed at the window's widest depth, 2500 m here, right at the onset, protects the weak shallow ceiling before the floor starts climbing. That is the classic design: case off the normal section at the top of overpressure, then drill the ramp with mud that the 2500 m shoe's 1780.09 ceiling can tolerate. The deep section needs mud from 1179.10 up; the shoe allows up to 1780.09; the section drills to TD with one mud and 601 kg/m3 of operational room.

Run the alternative to see the logic bite: no second casing, open hole from 1000 m to TD. Ceiling at 1000 m is 1647.2071369571245; floor at TD is 1179.1048116553065; the single-mud interval is still 468 kg/m3 wide. On this well even the lazy design works, which is what benign means. Now steepen the ramp mentally: the floor at TD rises, the interval pinches, and the shoe at the onset stops being style and becomes arithmetic. The design rule, one section per window pinch, emerges from exactly this calculation repeated on harder wells.

## The n 1.2 window, previewed

Flip the panel's exponent and the whole band moves: floor down to 1091.88 at TD, window up to 782.97. But look closer, at the engine's n 1.2 windows down the ramp: 750.2832396352455 at 2500 m, 761.1573865123303 at 3000, 782.968235764595 at TD. The window now WIDENS below the onset. The shape itself flipped with the calibration.

The mechanism is the same two-limb race with a different winner: at n 1.2 the floor's climb is quiet, 62.07 kg/m3 over the whole ramp against 149.30 at n 3, and it no longer outruns the ceiling's growth. So the exponent does not merely rescale this plot, it can change the sign of the window's trend, which means it can move where the narrowest depth of a section falls. Module 3 owns the full comparison; carry from here only the warning that window SHAPE is calibration-dependent and must be re-read, not assumed, after any recalibration.

## Worked example

Verify the two-limb explanation at one depth pair with engine numbers. From 2500 to 3000 m the floor climbs $1095.6268524501886 - 1029.8076923076924 = 65.8191601424962$ kg/m3 while the ceiling climbs $1830.7745332550903 - 1780.090931942938 = 50.6836013121523$. The window change is $50.6836013121523 - 65.8191601424962 = -15.1355588303439$, matching the table's $735.1476808049017 - 750.2832396352455 = -15.1355588303438$ to the last digit. The band narrows by exactly the floor's excess climb over the ceiling's, which is the mixture algebra of the tier below, alive in mud units.

## Exercise

A planner reads the table and proposes drilling from the 2500 m shoe to TD, then asks: at what TD-extension depth would this section's operational window close to a working minimum of 150 kg/m3, if the ramp continued at 4 kPa per metre below 4000 m? Estimate with the machinery rather than solving exactly.

Self check: the operational window is the TD floor against the fixed 1780.09 shoe ceiling, currently $1780.090931942938 - 1179.1048116553065 = 600.99$ kg/m3. It reaches 150 when the floor reaches 1630.09 kg/m3. The floor at extended depth $z$ is hydrostatic EMW, near 1029.9, plus overpressure EMW, $4000(z - 2500) / (9.80665 (z + 100))$. Setting that to 1630 gives roughly $600 \times 9.80665 (z+100) = 4000 (z - 2500)$, so $z \approx 2500 + 1.4709 (z + 100)$; solving, $z$ is negative: no solution, the expression $4000(z-2500)/(9.80665(z+100))$ tends to $4000/9.80665 = 407.9$ kg/m3 as $z$ grows, so the floor NEVER reaches 1630 on this ramp. The honest answer is that a 4 kPa per metre ramp cannot close this window at any depth; a ramp has to steepen, or the ceiling has to be set shallower, for this well to pinch. Knowing when the answer is never is also window arithmetic.
