# Where the log leaves the trend

Everything in pore pressure prediction rests on one observation, and it is small enough to state in a sentence. A shale that is more porous than its depth would justify is a shale that never finished compacting, and a shale that never finished compacting is holding fluid it should have expelled.

That is the whole idea. The rest of the discipline is arithmetic laid on top of it. This lesson teaches you to see the observation in the golden well.

## Above 2500 m the log and the trend agree

Compare the log transit time against the well's own compaction trend down the frame table and the first thing you notice is how boring the shallow section is.

| z (m bml) | log dt (us/m) | NCT, well trend (us/m) |
|---|---|---|
|  500 | 542.996744217229   | 542.996744 |
| 1000 | 459.28187333699555 | 459.281873 |
| 2000 | 351.32067639372013 | 351.320676 |
| 2500 | 317.2847498247154  | 317.284750 |

The log sits on the trend. At 2500 m the two are the same number to every digit either of them carries, 317.2847498247154 us/m. That is the value the capstone grades, and it is the last depth at which the well behaves normally.

A section that tracks its trend is a section in hydrostatic equilibrium. The pore fluid there has been free to escape upward as the grains packed closer, so the pressure in the pores is the weight of a connected fluid column and nothing more. Boring is the correct result for most of most wells.

## Below 2500 m the log falls behind

Now read the same two columns deeper.

| z (m bml) | log dt (us/m) | NCT, well trend (us/m) |
|---|---|---|
| 3000 | 297.76677602422825 | 292.070315 |
| 3500 | 282.5387777324301  | 273.391003 |
| 4000 | 270.92263512383806 | 259.553028 |

At 3000 m the log reads 297.76677602422825 us/m and the trend says 292.070315 us/m. The log is the larger of the two, which means sound is taking longer to cross a metre of that rock than the compaction law predicted. The rock is slower than its depth implies.

Slower means more porous. More porous at 3000 m means the shale did not compact the way the 2000 m of shale above it did. It is undercompacted, and the pore space it failed to close is still full of fluid.

## Why retained fluid means overpressure

Follow the load. The overburden at 3000 m is 66.831143 MPa and something has to carry it. In a normally compacted shale the grain framework carries the part of it that the pore fluid does not, and the pore fluid carries only its own connected column, 31.307730 MPa at that depth.

If the fluid cannot leave as burial proceeds, the grains cannot pack closer, so the framework cannot take up the extra load. The fluid takes it instead. The pore pressure climbs above the hydrostatic line, and the shale is left carrying a porosity that belongs to a shallower depth. The high transit time and the high pressure are two readings of the same stalled event.

That is why a sonic log can say anything at all about pressure. It never measures pressure. It measures how compacted the rock is, and in a shale that failed to dewater, compaction and pressure are locked together.

## The gap widens with depth

Look again at the three deep rows. At 3000 m the log stands above the trend by a modest amount. At 3500 m the separation is wider, 282.5387777324301 against 273.391003. At 4000 m it is wider still, 270.92263512383806 against 259.553028.

A departure that grows steadily downward is the signature of a pressure ramp, a section where the excess builds at a roughly constant rate per metre. A departure that appears abruptly and stays flat would be a different story, and a departure that closes again with depth would be a different story again. The shape of the gap is information, not just its existence.

Notice also that the departure begins where the frame is otherwise unremarkable. The hydrostatic and overburden curves know nothing about it. They are built from densities and fluid columns, so they run smoothly through 2500 m without a flicker. Only the comparison of log against trend picks the change out.

## What the Beginner tier does with it, and what it does not

At this tier you find the departure, you state the depth it begins, and you describe its shape. You do not convert it into a pressure.

Converting it is the Professional tier's job. That is where Eaton's ratio takes the log transit time and the trend transit time at each depth, raises their ratio to an exponent, and turns the departure into a number of MPa at that depth. The method needs the frame you built here as its foundation, because it works by subtracting an effective stress from the overburden and referencing everything to the hydrostatic.

This division of labour is deliberate. A prognosis is only as trustworthy as the frame under it. An Eaton run on a hydrostatic column that forgot its water depth, or on a trend fitted to sand points, produces a confident pressure curve that is wrong at every depth and looks exactly like one that is right. Your job at this tier is to make the foundation sound, and to be able to point at 2500 m and say what happens there.

Try it yourself: step the panel below through 2000, 2500, 3000 and 3500 m and watch the log and the well trend agree, meet, and separate.

{{panel:pp-frame-explorer}}

## Exercise

Read the log transit time and the well trend transit time at 3500 m from the table above. State which is larger, say what that implies about how compacted the shale is, and say what it implies about the fluid in its pores. Then say in one sentence whose job it is to turn that into a pressure.

As a self check: at 3500 m the log reads 282.5387777324301 us/m and the well trend reads 273.391003 us/m, so the log is larger. A larger transit time means slower rock, which means more porosity than the compaction trend allows at that depth, so the shale is undercompacted. Undercompacted shale retained the pore fluid it should have expelled, so that fluid is carrying load it should not be carrying and the pore pressure sits above hydrostatic. Turning the departure into MPa is the Professional tier's work with Eaton's ratio, and it stands on the frame you built here.
