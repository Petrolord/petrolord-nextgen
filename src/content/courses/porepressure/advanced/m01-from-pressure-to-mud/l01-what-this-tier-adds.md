# What this tier adds

The Professional tier produced a prognosis: pore pressure 47.408579625 MPa at total depth, overpressure exactly 6, fracture pressure 76.55157117548856, onset reported at 2520 m, the encoded ramp recovered to a hundred-millionth of a pascal. A complete, defended pressure model, in megapascals, from the mudline to TD.

Hand it to a drilling engineer and watch what happens: it gets converted before it gets used. Mud is specified as a density. Casing seats are argued in equivalent mud weight. Kick margins are density differences. The rig's entire pressure vocabulary is kg/m3, and a prognosis in MPa is a document waiting for its translation.

This tier is the translation, and then the two things the translated picture makes possible: the mud-weight window, and an independent cross-check of the physics behind the floor.

## The three moves

First move: convert. Every pressure at depth $z$ becomes an equivalent mud weight by division, $P / (g\,(z + d_w))$, referenced to sea level. The pore pressure curve becomes the window's FLOOR, at TD 1179.1048116553065 kg/m3. The fracture curve becomes its CEILING, 1903.9238599165737. The gap between them, 724.8190482612672 kg/m3 at TD, is the window: every mud this section can take lives inside it. Those three numbers are the first three graded fields of the capstone.

Second move: stress-test the floor. The Professional tier showed the exponent rescales the whole anomaly and deferred the price. Here it is paid: the capstone grades the TD pore pressure at n 1.2, the low calibration used for seismic-velocity data, 43.901549937778526 MPa against n 3's 47.408579625, and module 3 converts that difference into mud units, where it stops being academic.

Third move: check the mechanism. Everything so far rides on one method. Bowers' relations connect velocity to effective stress directly, with two curves: loading, for rock that only ever compacted, and unloading, for rock whose effective stress fell after burial. The capstone grades one point of each, the loading velocity at 5 MPa, 1949.944709834568 m/s, and the effective stress the unloading form reads from 3125.8 m/s, exactly 10 MPa. Module 5 then runs Bowers against Eaton on this well's own TD sample and finds them 0.038 MPa apart, which is the cross-check saying the overpressure here is a compaction story.

## What is graded

Six fields: pore pressure as EMW at TD, tolerance 0.5 kg/m3; fracture pressure as EMW at TD, 0.5; the window between them, 0.5; the Bowers loading velocity at 5 MPa effective stress, 0.5 m/s; the effective stress Bowers unloading reads from 3125.8 m/s, 0.01 MPa; and the TD pore pressure at n 1.2, 0.01 MPa.

Notice the structure: three conversions of things you already computed, two evaluations of a new pair of curves, one rerun of the old machinery at a new setting. Nothing in the capstone is conceptually new EXCEPT Bowers; the tier's difficulty is in owning the meanings, not the arithmetic.

## What you will be able to do

Speak the rig's language about your own prognosis: floor, ceiling, window, margins, all in kg/m3, all referenced correctly. Say what the window buys and what narrows it. Price the exponent decision as a mud decision. Run Bowers in both directions, loading and unloading, know which regime a rock is in and what choosing wrongly costs, 19.24 MPa of effective stress on this tier's own graded example. And close a pressure argument the way it is closed professionally: two independent methods, one answer.

## Worked example

The tier's first conversion, done once slowly. The hydrostatic at TD, 41.408579625 MPa, as equivalent mud weight: the column from sea level is 100 m of water plus 4000 m of sediment, 4100 m. $41408579.625 / (9.80665 \times 4100) = 1029.878048780488$ kg/m3. That is the Associate tier's bracket floor, recovered by this tier's own operation: the machinery is consistent across all three tiers, and every EMW in this course divides by the same 4100 m at TD.

## Exercise

Before the next lesson: convert the overburden at TD, 91.12306695073282 MPa, to EMW, and state which two numbers you have now bracketed with your two conversions.

Self check: $91123066.95073282 / (9.80665 \times 4100) = 2266.333384047207$ kg/m3. With the hydrostatic's 1029.878 you have rebuilt the Associate bracket, and every value this tier computes, floor 1179.1, ceiling 1903.9, window walls at any depth, will land strictly inside those two, which is the standing sanity check for the whole tier.
