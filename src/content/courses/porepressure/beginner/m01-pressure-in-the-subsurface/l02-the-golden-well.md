# The golden well

Every number in this course comes from one well. It is worth knowing exactly what that well is before you start computing with it, because its properties are the reason the arithmetic in later modules can be checked to the last digit.

## The fixture

The well is a synthetic. Nobody drilled it. It was constructed as a committed test fixture so that the answer to every step of the workflow is known in advance and can be checked by an independent implementation.

Its geometry is as follows.

| Property | Value |
| --- | --- |
| samples | 401 |
| depth range | 0 to 4000 m below mudline |
| sample interval | 10 m |
| water depth | 100 m |
| seawater density | 1025 kg/m3 |
| pore fluid density | 1030 kg/m3 |

Depths in this course are quoted in metres below mudline, which means below the seabed. That convention matters in a marine well, because there is 100 m of seawater above the mudline that carries weight and exerts pressure and is not part of the sediment column. A depth of 4000 m below mudline is 4100 m below sea level. Every depth you read from now on is below mudline unless it says otherwise.

The well also carries its own normal compaction trend parameters in its header: a mudline transit time of 656 us/m, a matrix transit time of 220 us/m, and a compaction constant of 0.0006 per m. Module 4 uses all three. Hold on to the fact that they are stated in the header, because module 4 ends with a lesson about what happens when a fit disagrees with a header.

## What the logs look like

Two logs run the full depth of the well: a sonic, reported as an interval transit time in us/m, and a bulk density in kg/m3. Here is a sample of both.

| z (m below mudline) | log dt (us/m) | rho (kg/m3) |
| --- | --- | --- |
| 0 | 656 | 1900 |
| 500 | 542.996744217229 | 2054.8394518500168 |
| 1000 | 459.28187333699555 | 2175.4285382011567 |
| 2000 | 351.32067639372013 | 2342.4843911799903 |
| 2500 | 317.2847498247154 | 2399.446642197867 |
| 3000 | 297.76677602422825 | 2443.808887896099 |
| 3500 | 282.5387777324301 | 2478.3582395846884 |
| 4000 | 270.92263512383806 | 2505.265301734371 |

Both columns behave the way a compacting clastic section behaves. The transit time falls with depth, from 656 us/m at the mudline to 270.92263512383806 us/m at 4000 m, because the sediment is losing porosity and sound travels faster through a tighter rock. The density rises over the same interval, from 1900 kg/m3 at the mudline to 2505.265301734371 kg/m3 at 4000 m, for the same physical reason seen from the other side. Porosity is being squeezed out, and what remains is more mineral and less water.

## Forward and inverse consistent

The phrase to attach to this fixture is forward inverse consistent. It was built by choosing a pressure profile first, then generating the logs that such a profile would produce, rather than by inventing logs and hoping they mean something.

That has a consequence which is the whole point of using a synthetic to learn on. When the Professional tier runs a pressure inversion over these transit times, it recovers the pressures that were imposed when the well was made. There is no argument about whether the answer is right, because the answer was decided before the logs existed. If your arithmetic returns something else, your arithmetic is wrong. On a real well you never have that luxury, and a wrong prognosis looks exactly like a right one until the rig finds out.

## The ramp at 2500 m

The well is not uniformly normally pressured. An overpressure ramp begins at 2500 m below mudline and continues to total depth, and it was encoded into the transit times themselves. Below 2500 m the rock is held open by pore fluid that could not escape, so it is less compacted than its burial depth would suggest, so it is slower than the compaction trend predicts.

You can see it in the numbers already given. On the well's own compaction trend, the expected transit time at 2500 m is 317.2847498247154 us/m, and the log reads 317.2847498247154 us/m. They agree exactly. The log is on the trend at the top of the ramp.

Go down 500 m and they part company. At 3000 m below mudline the trend predicts 292.070315 us/m and the log reads 297.76677602422825 us/m. The log is slower than the trend, by a small amount that grows with depth. That separation is the undercompaction signature, and it is the signal that a pressure estimate is extracted from.

## What this tier does with it

The Associate tier does not invert that ramp. That is a deliberate decision about the order of learning rather than a limitation of the fixture.

What you will do is build the frame the inversion later stands in: the hydrostatic column through seawater and sediment, the overburden by integrating the density log above, Gardner density where a density log is absent, and the normal compaction trend with an honest least squares fit through shale picks. When you finish this tier you will be able to look at the separation at 3000 m below mudline and say precisely what it is measured against and why the comparison is legitimate.

The Professional tier then turns the separation into a pressure with an Eaton inversion. The Advanced tier turns that pressure into a mud weight window at total depth and cross-checks it against a second method. Both of those rest entirely on the four curves you are about to build.

## Exercise

Without looking back at the table, state the water depth, the sample interval and the total depth of the golden well in the correct units, and say what depth below sea level the total depth corresponds to. Then explain in two sentences why a log transit time that is higher than the compaction trend at the same depth is evidence of overpressure.

Self check: the well sits in 100 m of water, is sampled every 10 m, and reaches 4000 m below mudline, which is 4100 m below sea level. A transit time above the trend means the rock is slower than a normally compacted rock at that burial depth, which means it is more porous than it should be, and porosity is retained when pore fluid cannot escape and takes part of the load, so the fluid is carrying pressure above the normal hydrostatic value.
