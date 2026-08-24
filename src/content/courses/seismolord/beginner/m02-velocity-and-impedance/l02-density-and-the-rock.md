# Density and the rock

Velocity is only half of what a reflection responds to. The other half is density, and in this course it comes from the RHOB curve of the teaching well.

## What RHOB measures

RHOB is bulk density, recorded in grams per cubic centimetre. The word "bulk" is doing real work. The tool does not measure the density of the mineral grains, and it does not measure the density of the fluid. It measures the mass of a unit volume of formation as it actually sits in the ground, grains and pore fluids together, which is what a passing seismic wave has to move.

Three things control that number.

**Matrix mineralogy.** Different rock-forming minerals have different grain densities. A quartz sand, a limestone and a dolomite each have their own matrix value, and a shaly interval carries clay minerals with values of their own. Change the mineral mix and the bulk density moves even at constant porosity.

**Porosity.** Every unit of pore space is a unit of rock that has been replaced by fluid, and fluids are lighter than minerals. Porosity therefore pulls bulk density down. Across most clastic sections this is the single largest control on RHOB, which is why RHOB is the workhorse porosity log in petrophysics.

**Fluid fill.** The pores are not empty. Brine, oil and gas have very different densities, so the same rock at the same porosity reads differently depending on what fills it. Gas is the extreme case, and a gas-filled sand can drop the density log noticeably below its brine-filled equivalent.

## The spread in the teaching well

Across the 301 samples of the teaching log, RHOB moves over a modest range. It starts at 2.1893 g/cc at 1500 m, the top of the log, and climbs to roughly 2.43 in the tighter intervals lower down. Five depths give the shape of it:

| MD (m) | RHOB (g/cc) |
| --- | --- |
| 1500 | 2.1893 |
| 1580 | 2.4349 |
| 1582 | 2.4181 |
| 1600 | 2.2593 |
| 1650 | 2.2724 |

That is a spread of a couple of tenths of a g/cc, which sounds small next to the velocity spread of the previous lesson. It is small in percentage terms and still consequential, for reasons the next section makes precise.

Notice the pattern in the table. The two highest densities, 2.4349 and 2.4181, sit at 1580 m and 1582 m, the same depths where the previous lesson found high velocities. The lowest density, 2.1893 at the top of the log, sits with the lowest velocity. Density and velocity in clastic sections tend to move together, because the same compaction and cementation that stiffen a rock also pack more mass into each cubic centimetre. They are not locked together, though, and the places where they part company are often the interesting ones.

## Why velocity alone is not enough

A reasonable question here is why the workflow bothers with density at all. Velocity varies far more strongly in most sections, so why not just use the sonic log and be done?

The answer is that a reflection does not respond to velocity. It responds to acoustic impedance, and impedance is the product of density and velocity. Because it is a product, a rise in one factor can be cancelled by a fall in the other. A boundary where velocity increases and density decreases by a comparable proportion produces little or no impedance contrast, and therefore little or no reflection, even though the sonic log shows a clear step. Interpreters meet this as a "velocity event that does not reflect", and the density curve is what explains it.

The reverse case exists too. Two units with almost identical velocities but different densities still produce a reflection, because the impedance contrast is real. Build a synthetic from velocity alone and both situations come out wrong, and the mismatch against the real seismic then gets blamed on the wavelet or on the time-depth relationship when the cause was the missing density.

This is why the engine treats density as a first-class input. It accepts a real RHOB curve when one exists, and falls back to a single constant density when one does not. The fallback keeps the workflow running on wells with no density log, and it changes the meaning of the result: with a constant density the impedance contrast reduces to the velocity contrast, and the interpretation carries that caveat. The application surfaces which of the two was used, because the provenance of an answer matters as much as the answer.

## Reading the curve critically

Density logs are pad tools. The measurement depends on the pad being pressed against the borehole wall, so washouts, rugose hole and heavy mud cake degrade it. Before trusting RHOB in a tie, glance at the caliper and at the density correction curve if the file has one. A density that dives in a washed-out shale is a hole problem rather than a rock property, and it will inject a false impedance step into the synthetic at that depth.

## Exercise

Using the table above, rank the five anchor depths from lowest to highest bulk density, then say in one sentence what a reflection would need in order to appear at the 1500 m level given that its density is the lowest of the five.

Self-check: the ranking from lowest to highest is 1500 (2.1893), 1600 (2.2593), 1650 (2.2724), 1582 (2.4181), 1580 (2.4349). A reflection at 1500 m needs an impedance contrast against the material above or below it, so the low density there matters only in combination with the velocity at the same depth, which the next lesson makes explicit.
