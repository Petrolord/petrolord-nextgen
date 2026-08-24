# The NCT equation

The normal compaction trend is the transit time a shale would have at a given depth if it were normally pressured. The form the engine uses is an exponential decay from a mudline value toward a matrix value:

$$dt(z) = dt_{ma} + (dt_{ml} - dt_{ma}) \, e^{-c z}$$

Depth $z$ is metres below the mudline. Transit times are in us/m. The compaction constant $c$ is in per metre inside the engine, and it is conventional to quote it in per kilometre when you talk about it, so keep track of which one you are looking at.

## Working it on this well

The golden well's own trend parameters are a mudline transit time of 656 us/m, a matrix transit time of 220 us/m, and a compaction constant of 0.0006 per m, which is 0.6 per km. At 2500 m below the mudline:

$$220 + (656 - 220) \, e^{-0.0006 \times 2500} = 317.2847498247154 \text{ us/m}$$

The bracket is 436 us/m, the amount of transit time available to be lost between a mudline suspension and a zero porosity matrix. The exponent is $-0.0006 \times 2500 = -1.5$, so the exponential has decayed to a little over a fifth of its starting value, and a little over a fifth of the 436 remains on top of the 220 floor.

That value, 317.2847498247154 us/m, is one of the six numbers the capstone grades, with a tolerance of 0.5 us/m. It is worth doing on a calculator once, because the shape of the arithmetic is the shape of the physics.

Notice also that the golden well's log reads exactly 317.2847498247154 us/m at 2500 m. The log is on the trend there. That is the depth where the overpressure ramp begins, so 2500 m is the last depth at which this well is normally pressured.

## The three parameters

Each of the three numbers in the equation means something you can point at in a rock.

The matrix transit time $dt_{ma}$ is the floor. It is the transit time of the solid mineral framework with no porosity left, 220 us/m for the shale in this well. The curve approaches it and never reaches it. Raising it lifts the whole curve and, more importantly, compresses the range the curve has to work in, because the bracket $dt_{ml} - dt_{ma}$ shrinks. It is a lithology property, so it is normally fixed from the literature or from a deep compacted shale rather than fitted.

The mudline transit time $dt_{ml}$ is the ceiling. It is where the curve starts, the transit time of the sediment as it arrives at the seabed, 656 us/m here. It is high because that material is mostly water. Raising it steepens the whole shallow part of the curve without changing the deep asymptote.

The compaction constant $c$ sets the rate. A large $c$ means the shale compacts quickly with depth, so the curve drops steeply and flattens toward the matrix value early. A small $c$ means a slow, drawn out compaction that is still well above the matrix value at TD. It carries the basin's burial history and its shale character, and it is the parameter that differs most between areas.

## The curve down the well

The well's own trend, evaluated at the depths of the frame table:

| z (m bml) | NCT on the well trend (us/m) |
|---|---|
|    0 | 656.000000 |
|  500 | 542.996744 |
| 1000 | 459.281873 |
| 2000 | 351.320676 |
| 2500 | 317.284750 |
| 3000 | 292.070315 |
| 3500 | 273.391003 |
| 4000 | 259.553028 |

Read the spacing rather than the values. Between the mudline and 500 m the trend loses over a hundred us/m. Between 3500 m and TD it loses under fifteen. The exponential does most of its work shallow, which is where porosity is easiest to squeeze out, and it flattens with depth as the rock runs out of pore space to lose.

That flattening has a practical consequence. Deep in a well the trend is nearly flat, so a small error in the trend value corresponds to a large error in the equivalent effective stress. Trend accuracy matters most exactly where the drilling risk is highest.

## Sanity checks

The engine refuses an NCT that cannot describe a rock. It requires $dt_{ml} > dt_{ma} > 0$ and throws otherwise, because a mudline value below the matrix value would describe sediment that arrives at the seabed already more compacted than its own mineral framework. It also requires a non negative depth and a finite $c$.

Beyond what the code checks, ask two questions of any trend handed to you. Is the mudline value plausibly that of a water rich sediment, in the high hundreds of us/m. Is the compaction constant within the range you would expect for the basin, a few tenths per km. A trend that passes both and still misfits the log is telling you something about the well. A trend that fails either is telling you something about the trend.

## Exercise

Evaluate the golden well's own normal compaction trend at 2500 m below the mudline by hand from its three parameters, showing the bracket and the exponent, and compare the result with the log reading at that depth.

Self check: the bracket is $656 - 220 = 436$ us/m and the exponent is $-0.0006 \times 2500 = -1.5$, giving $220 + 436 \, e^{-1.5} = 317.2847498247154$ us/m. The log at 2500 m reads the same 317.2847498247154 us/m, so the log sits exactly on the trend at that depth and the shale there is normally compacted. That is the last such depth in this well, because the overpressure ramp starts at 2500 m and the log departs from the trend below it.
