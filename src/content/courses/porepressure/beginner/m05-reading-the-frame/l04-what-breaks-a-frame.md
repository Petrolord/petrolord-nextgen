# What breaks a frame

The checks in the last lesson tell you that something is wrong. This lesson tells you what it usually is. Six failure modes account for most broken pressure frames, and all of them are small bookkeeping slips that survive review because the output still looks like a pressure frame.

## Forgetting the water column

This is the most common error in offshore pore pressure work and it is worth understanding in detail, because the hydrostatic column on this well is exactly hand checkable.

The column has two parts. Seawater from sea level to the mudline, 1025 kg/m3 through 100 m of water, giving 1005181.625 Pa. Pore fluid from the mudline to total depth, 1030 kg/m3 through 4000 m, giving 40403398 Pa. Add them and you have 41408579.625 Pa, which is the 41.408579625 MPa the capstone grades at 4000 m below mudline.

Drop the water column and you are left with 40403398 Pa, the sediment part alone. That shortfall does not shrink with depth, so it is proportionally worst in the shallow section where drilling decisions are tightest. The frame still plots as two rising curves, still passes a monotonic check, and is wrong from the seabed down.

The tell is check 1 from the last lesson. If your hydrostatic starts at zero at the mudline rather than at 1.005182 MPa, the water is missing.

## Using the wrong value for g

The engine uses $g = 9.80665$ m/s2, the standard value. Typing 9.81 or 9.8 because it is what you remember feels harmless. It is not.

The whole hydrostatic column here weighs 1025 x 100 + 1030 x 4000 = 4222500 kg/m2, so the graded pressure at 4000 m below mudline is that mass times g and nothing else. Three values of g give three answers.

| g used | hydrostatic at TD | error against the engine |
|---|---|---|
| 9.8     | 41.380500000 MPa | -0.028079625 MPa |
| 9.80665 | 41.408579625 MPa | 0, the graded value |
| 9.81    | 41.422725000 MPa | +0.014145375 MPa |

The capstone tolerance on that field is 0.01 MPa, so both rounded values of g fail it. This is not a pedantic point about decimal places. A learner who uses 9.81 gets 41.422725000 MPa, a number that looks entirely right, is wrong by about 14 kilopascals, and is marked wrong. On the overburden, where the graded value at 4000 m below mudline is 91.12306695073282 MPa, the same relative error is applied to a larger number and the miss is larger still.

Take g from one named constant rather than typing it, and record which value you used alongside the frame.

## Mixing Pa with MPa

Engines work in pascals. Reports, mud programmes and capstones work in megapascals. The factor between them is a million, so a slip is never subtle in size and often subtle in appearance.

The dangerous slips are the ones that produce a plausible number. A hydrostatic of 41408579.625 in a field expecting MPa is so far out that anyone would catch it, while a pressure converted twice, or a gradient computed in Pa per m and labelled MPa per km, lands in a believable range and gets past review.

Convert once, where the engine hands the number to a person, and label every axis, column and field.

## Integrating density over the wrong depth reference

Overburden is an integral, so it depends entirely on where you start counting and how you space the samples.

Three references are in play on any offshore well: below rotary table, below sea level, and below mudline. On this well the last two differ by the 100 m of water. Integrate a density log indexed below sea level as though it were below mudline and you have started the rock at the sea surface. Integrate below rotary table without correcting and you have added the air gap as rock.

The rule for this frame is that the sediment integration starts at the mudline, at depth 0, with the seawater column added underneath it as a separate term rather than integrated as rock. That is why the overburden and the hydrostatic share the same 1.005182 MPa starting value. Uneven sample spacing is the quieter version of the same error: this well is sampled every 10 m from 0 to 4000 m, and an integration that assumes even spacing on a log with gaps will drift.

## Picking sand instead of shale for the trend

A normal compaction trend is a statement about shale. Shale compacts by expelling water in a way that follows the exponential law, so its transit time is a proxy for how much it has compacted. Sand does not behave that way, and neither does limestone, coal or a washed out interval.

Put sand points into the fit and it returns a trend anyway, confidently, with as many decimal places as a correct one. The fit cannot know what lithology the points came from, so the lithology is your responsibility.

This well makes the point sharply. The twelve picks return a mudline transit time of 650.0000000000014 us/m and a compaction constant of 0.7000000000000015 per km, while the well header labels its own trend 656 us/m and 0.6 per km. Neither is wrong. The fit is reporting what the picks say, and the picks were drawn on a different trend from the label. A fit describes the data you gave it, so give it the right data and then check that what it returns is physically sensible.

## Fitting a trend over too little depth

An exponential needs leverage. If all your picks come from a 300 m window, the curvature that separates the mudline value from the compaction constant is not in the data, and the fit trades one against the other freely. You get a trend that runs through the picks and diverges from reality above and below them.

The twelve picks on this well run from 200 m to 3500 m, and that span is what lets the fit pin both parameters at once. With less span, say so, and treat the extrapolated part of the trend as an assumption rather than a result.

## Exercise

For each of the six failure modes, write the one sanity check from the previous lesson that would catch it. Then answer in one sentence: on this well, what does the hydrostatic pressure at 4000 m below mudline become if the water column is forgotten, and why is that error worst in the shallow section?

As a self check: forgetting the water is caught by the mudline equality check, the wrong g and a Pa against MPa slip are caught by comparing against known values with units and depths attached, a wrong depth reference is caught by the mudline equality and the monotonic check, sand picks are caught by reading the fitted parameters for physical sense, and too little depth span is caught the same way. Forgetting the water leaves 40403398 Pa rather than the graded 41408579.625 Pa, a fixed shortfall of the 1005181.625 Pa seawater term at every depth, and because it does not shrink with depth it matters most near the seabed.
