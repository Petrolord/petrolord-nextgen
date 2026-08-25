# Same velocity, two stresses

One velocity, 3125.808993287662 m/s. On the loading curve it means 29.240177382128643 MPa of effective stress. On the unloading curve, from a maximum of 50 with U 3, it means 10. The gap is 19.24 MPa, a factor of 2.9, and nothing in the velocity itself can tell you which is true. This lesson sits with that fact, because it is the deepest one in the module and the panel gives it a tile of its own.

{{panel:pp-window-explorer}}

## The mechanism of the ambiguity

Both curves pass through the point $(v = 3125.8)$ at SOME stress, because both are monotonic maps from stress to velocity. The rock's velocity records its stiffness, its stiffness records the TIGHTEST packing it ever reached, and the tightest packing records the MAXIMUM stress, not the current one. A loading rock's maximum is its present, so velocity reads present stress. An unloaded rock's maximum is its past, so velocity mostly reads history and the present must be recovered by discounting that history through U and sigma_max.

The ambiguity, then, is not a defect of Bowers; it is a fact about rocks that any honest method must surface. Eaton, fed an unloaded section, does not escape it, it simply answers wrongly without flagging anything: the trend ratio sees near-normal transit times and reports near-normal pressure. Bowers at least turns the question into two explicit curves and demands you choose.

## What choosing wrongly costs, in pressure

Put the 19.24 MPa through the subtraction at a concrete depth. Suppose the 3125.8 m/s shale sits at 3000 m in this well's frame, overburden 66.83114254343904 MPa. Loading reading: pore pressure $66.83114254343904 - 29.240177382128643 = 37.590965161310397$ MPa; the hydrostatic there is 31.307730125, so the loading reading claims 6.28 MPa of overpressure. Unloading reading: $66.831 - 10.000 = 56.831$ MPa, which is 25.52 MPa of overpressure, an extreme but not absurd geopressure. The two readings differ by the full 19.24 MPa, and in mud units at 3000 m, dividing by 30400.615, by 633 kg/m3 of floor. Choosing the wrong curve at this hypothetical depth is not a refinement error; it is a different well.

The direction matters as much as the size: reading an UNLOADED rock with the LOADING curve UNDER-reads pore pressure by 19 MPa, the dangerous direction, the kick direction. This is the quantitative face of the warning that has run through the course since the Professional tier's blind-spot lesson: post-compaction overpressure is the mechanism the standard tools understate.

## How the choice is actually made

Three discriminators, in practice used together. Geology first: is there a reason for unloading here, mapped uplift and erosion, or a known late charge into a sealed compartment? Without a candidate mechanism, loading is the default, not because unloading is rare but because asserting history needs evidence. The velocity profile second: unloading sections classically show a velocity REVERSAL, velocity falling with depth as effective stress drops into the overpressured zone, where undercompaction merely slows the increase. A clean reversal is the strongest single-log flag for the unloading curve. Density third, the Bowers signature pair: undercompacted rock is slow AND light, since it kept porosity; unloaded rock is slow but DENSE, since compaction was locked in and only the elastic stiffness relaxed. Sonic down, density flat is the unloading fingerprint; sonic down, density down is undercompaction.

This well shows none of the three, no mechanism, no reversal, no sonic-density split, which is why the loading curve is the right reading here and why the cross-check two lessons from now uses it.

## The tile

The panel carries this lesson as a permanent pair: the unloading inversion's 10.000 MPa beside the loading read of the same velocity, 29.240. Two numbers, one measurement. It is the only tile pair on the panel that exists purely to make a conceptual point, and it earns the space: every worked pressure in this course is downstream of a mechanism assumption, and the pair is the size of that assumption, kept visible.

## Worked example

Run the discrimination on this well's own TD sample, as rehearsal for the cross-check. Velocity 3691.0906301457703 m/s at 4000 m. Candidate mechanism for unloading: none, the well's overpressure is encoded undercompaction. Velocity profile: the sonic slows with depth relative to trend but never reverses, transit time falls monotonically, 297.77 to 270.92 us/m over the last kilometre. Density: the density log continues its compaction rise to 2505.265301734371 kg/m3 at TD, no sonic-density split. Verdict: loading rock, read the loading curve, which is exactly what the next lessons do. The rehearsal matters because the verdict PRECEDES the arithmetic: mechanism is decided on evidence, then the curve computes.

## Exercise

A shale at 2000 m in an uplifted onshore basin reads 3125.8 m/s. Regional work says the section once lay 1500 m deeper. In two or three sentences, choose your curve and defend the choice, naming what else you would check.

Self check: the mapped burial history supplies both the mechanism and a sigma_max estimate, the effective stress at maximum burial from decompaction arithmetic, so the unloading curve is the defensible choice, with U calibrated regionally or spanned 3 to 8 as a sensitivity. Before committing, check the density log against the sonic for the locked-in-compaction fingerprint and look for a velocity reversal at the top of the uplifted section. And having chosen, publish the loading answer beside it, 29.24 against roughly 10 MPa, because a reader who cannot see the assumption's price cannot audit the choice.
