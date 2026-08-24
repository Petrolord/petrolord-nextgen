# The frame on one plot

Four modules have each built one piece of the pressure frame in isolation. A hydrostatic column, an overburden integration, a Gardner density where the log is missing, and a compaction trend fitted to shale picks. None of them is worth much on its own. The frame is what they become when they are drawn together on a single depth axis, and reading that picture is the skill this module is about.

This lesson puts all four curves on one plot and teaches you how to look at it.

## Depth runs downward

The first thing that surprises people about a pressure plot is that the depth axis points down. Zero sits at the top, the deepest sample sits at the bottom, and pressure runs across the horizontal.

The reason is that the plot is a picture of the well. A curve that leans to the right as you travel down the page is a pressure that grows with depth, which is what every pressure in the subsurface does. Turning the axis the conventional way round would make you read the well upside down against every other display in the building.

On this well the top of the axis is the mudline, the seabed, with 100 m of seawater above it. Every depth quoted in this course is metres below mudline, written m bml. The mudline is depth 0 and total depth is 4000 m. Get in the habit of saying which reference a depth belongs to, because a frame built against the wrong datum fails silently.

## The four curves

Two of the curves are pressures and belong on a pressure track in MPa. Two are transit times and belong on a sonic track in us/m, sharing the same depth axis alongside. Here is the frame down the golden well.

| z (m bml) | hydrostatic (MPa) | overburden (MPa) | log dt (us/m) | rho (kg/m3) | NCT, well trend | NCT, fitted trend |
|---|---|---|---|---|---|---|
|    0 |  1.005182 |  1.005182 | 656                | 1900              | 656.000000 | 650.000000 |
|  500 |  6.055606 | 10.716908 | 542.996744217229   | 2054.8394518500168 | 542.996744 | 523.015879 |
| 1000 | 11.106031 | 21.100398 | 459.28187333699555 | 2175.4285382011567 | 459.281873 | 433.531681 |
| 2000 | 21.206881 | 43.321164 | 351.32067639372013 | 2342.4843911799903 | 351.320676 | 326.036694 |
| 2500 | 26.257305 | 54.952589 | 317.2847498247154  | 2399.446642197867 | 317.284750 | 294.722796 |
| 3000 | 31.307730 | 66.831143 | 297.76677602422825 | 2443.808887896099 | 292.070315 | 272.656264 |
| 3500 | 36.358155 | 78.902159 | 282.5387777324301  | 2478.3582395846884 | 273.391003 | 257.106242 |
| 4000 | 41.408580 | 91.123067 | 270.92263512383806 | 2505.265301734371 | 259.553028 | 246.148327 |

## The hydrostatic curve is a straight line

Read the hydrostatic column down the table and it rises evenly, from 1.005182 MPa at the mudline to 41.408580 MPa at 4000 m. Equal steps in depth add equal steps in pressure, which is exactly what a straight line means.

It is straight because the pore fluid density is a single constant, 1030 kg/m3, all the way down. Nothing about the rock enters it. That is worth holding on to, because it makes the hydrostatic curve a reference rather than a measurement. It is the pressure the formation would have if its pore fluid were connected all the way to the sea surface, and the whole discipline is built on comparing real pressures against it.

## The overburden curve bends

The overburden starts at the same 1.005182 MPa at the mudline and reaches 91.123067 MPa at 4000 m, more than twice the hydrostatic.

It does not rise evenly. The thousand metres from the mudline to 1000 m takes it from 1.005182 to 21.100398 MPa. The thousand metres from 3000 m to 4000 m takes it from 66.831143 to 91.123067 MPa, which is a larger gain over the same interval. The density column beside it says why: 1900 kg/m3 at the mudline, 2505.265301734371 kg/m3 at 4000 m. Deeper rock is denser rock, so each metre of it presses down harder than the metre above did.

A curve that bends that way is a compaction signature. If your overburden plots as a straight line you have used a single density for the whole column, and you should say so out loud rather than let the plot imply an integration you did not do.

## Both start together at the mudline

At depth 0 the two pressures are the same 1.005182 MPa. That is not a coincidence and it is not an error. Above the mudline there is nothing but seawater, so both the fluid column and the total weight of everything overhead are the same 100 m of 1025 kg/m3. The two curves are born at the same point and separate only once sediment starts contributing.

## The two transit-time curves

The log transit time falls from 656 us/m at the mudline to 270.92263512383806 us/m at 4000 m. Sound travels faster through compacted rock, so transit time shrinks as depth grows. That curve is a measurement, with all the noise and washout a real sonic carries.

The normal compaction trend is not a measurement. It is the smooth exponential a shale would follow if nothing but ordinary compaction were happening to it. Two versions sit in the table. The well trend uses the well's own header parameters and reads 656.000000 us/m at the mudline. The fitted trend, recovered by least squares from twelve shale picks, reads 650.000000 us/m there. They are close and they are not identical, and module four explained why.

## What the shapes tell you together

Take the four curves as one picture. The straight hydrostatic sets the baseline. The bending overburden sets the ceiling. The trend says what the rock ought to be doing. The log says what it is doing. Everything interesting in pore pressure work lives in the gap between the last two, and the next lesson is entirely about that gap.

Try it yourself: the panel below reads the frame at any depth you choose, and shows both trends beside the log.

{{panel:pp-frame-explorer}}

## Exercise

Using the table, write down the hydrostatic and overburden values at the mudline and at 4000 m, then answer in two sentences: why are the two equal at the top, and why does only one of them plot as a straight line?

As a self check: at the mudline both read 1.005182 MPa and at 4000 m they read 41.408580 and 91.123067 MPa. They are equal at the top because everything above the mudline is the same 100 m of 1025 kg/m3 seawater, so the fluid column and the total overburden are the same column. Only the hydrostatic is straight, because it uses one constant pore fluid density of 1030 kg/m3, while the overburden integrates a density that grows from 1900 kg/m3 at the mudline to 2505.265301734371 kg/m3 at 4000 m and therefore steepens with depth.
