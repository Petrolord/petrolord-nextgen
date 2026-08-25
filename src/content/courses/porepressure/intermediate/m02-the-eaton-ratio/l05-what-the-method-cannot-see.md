# What the method cannot see

A method is only safe to use once you can list what it is blind to. Eaton's blind spots are structural, they follow from the equation, and this lesson maps them while the equation is fresh. None of this appears in the capstone arithmetic; all of it appears the first time you point the method at a real well.

## Blind spot one: mechanisms without a compaction signature

The ratio reads undercompaction: rock that is slow because it never compacted. That is the signature of disequilibrium compaction, where burial outran dewatering, and it is the dominant overpressure mechanism in young, rapidly loaded basins, which is why the method works so widely.

But overpressure has other sources. Fluid expansion mechanisms, gas generation from maturing kerogen, clay dehydration, and unloading by uplift or by lateral transfer all raise pore pressure in rock that has already compacted. Such rock can carry serious overpressure while its porosity, and therefore its transit time, sits near the normal trend. The ratio then reads near 1, and Eaton reports near-hydrostatic pressure that is wrong.

The velocity does respond somewhat to effective stress even in compacted rock, which is what the Bowers unloading treatment at the Expert tier is for. The point here is narrower: the Eaton form calibrated on compaction disequilibrium underestimates, systematically, wherever the mechanism is not compaction. On this synthetic well the encoded mechanism is exactly the one the method reads, which is why the loop closes; that is a property of the well, not a promise from the method.

## Blind spot two: slowness that is not pressure

The equation converts every excess microsecond into pressure, whatever caused it. The standing hazards:

Bad hole. A washed-out borehole slows the sonic. The caliper log is the defence, and it is why a prognosis quotes the intervals it excluded.

Lithology. The trend describes the shale this basin compacts. Organic-rich shale is slower than its effective stress explains, ash beds and marls do not follow the shale trend at all. Every non-shale sample fed to the ratio is a fictitious pressure.

Gas. A few percent of gas in the pore space collapses velocity, as the Rock Physics course quantifies. A gas-bearing interval read through Eaton looks like an enormous pore pressure spike. Since gas often does accompany real overpressure, separating the two is genuinely hard and takes more than one log.

The discipline that answers all three is the same one the Associate tier taught for picking trend shales: the ratio is only ever evaluated where the interpreter has affirmed the rock is trend-shale in good hole. The engine will happily compute at all 401 samples; on this synthetic well all 401 are honest, and on no real well is that true.

## Blind spot three: the fast side

What if the log is faster than the trend, so the ratio exceeds 1? Raised to the third power and handed to the machinery, a ratio above 1 makes the fluid's share negative: pore pressure below hydrostatic.

Genuine subhydrostatic pressure exists, in depleted reservoirs and some uplifted basins, but a fast shale usually means something duller: a cemented or silty interval, or a trend fitted too high. Eaton has no opinion; it extrapolates its power law symmetrically into a regime it was never calibrated for. A prognosis showing pressure below hydrostatic in undrilled section is a trend alarm before it is a pressure prediction.

This well never exercises the fast side, because its log never crosses above the trend. Notice that this is also the deliberate design of the fitted-trend error you will run in module 4: the fitted trend is low, so the error it makes is all on the overpressure side, where it is visible. A trend error in the other direction hides pressure instead of inventing it, and is the more dangerous of the two.

## What the blindness costs, and what it does not

None of this makes the method unusable; it makes it a component. In practice a prognosis is Eaton plus a caliper screen, plus a lithology screen, plus a mechanism argument, plus whatever measured pressures exist to calibrate against. The equation supplies the number; the screens decide where the number deserves to exist.

The capstone grades the number, because the number is what this tier adds. The screens are habits, and the exam bank asks about them as concepts because a wrong screen produces a wrong number with perfect arithmetic.

## Worked example

A hypothetical, computed honestly with the machinery of this module. Suppose a 10 m gas-charged interval at 3000 m slowed the log from its true 297.76677602422825 to 320 us/m, with the trend at 292.07031526461174. The ratio becomes $292.07031526461174 / 320 = 0.912719735$, its cube 0.7603478519795024, the fraction 0.2396521480204976, and on the 35.523412418439044 MPa budget the reported overpressure is 8.513 MPa against the true 2.0.

One bad interval, one spike of six and a half phantom megapascals. The caliper and resistivity logs over that interval are cheaper than the sidetrack the spike could cause in planning.

## Exercise

For each of the three blind spots, name the direction of the error it produces: does Eaton over-read or under-read the true pore pressure? One sentence each.

Self check: a non-compaction mechanism produces under-reading, since the rock is compacted and the ratio sits near 1 while the true pressure is high. Slowness that is not pressure, bad hole, wrong lithology or gas, produces over-reading, since excess transit time becomes pressure that is not there. The fast side produces under-reading of a sort, pressures below hydrostatic, though its usual meaning is that the trend, not the pressure, is wrong. The dangerous direction is under-reading, because the drilling response to it is a mud weight that is too light.
