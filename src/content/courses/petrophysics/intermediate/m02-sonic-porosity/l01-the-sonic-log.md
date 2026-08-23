# The sonic log

The density log gave you one porosity. This module adds a second, fully independent one, computed from how fast sound travels through the formation. Before the arithmetic, you need to understand what the tool actually records and in what units, because the units are the first place careless interpreters go wrong.

## What the tool measures

A sonic tool carries an acoustic transmitter and, some distance up the tool body, a pair or an array of receivers. The transmitter fires a pressure pulse; the pulse refracts along the borehole wall as a compressional head wave and arrives at each receiver in turn. The tool times the first arrival at each receiver and divides the time difference by the receiver spacing. The result is the interval transit time, written $\Delta t$ and curve-named DT: the time the compressional wave needs to cross one unit length of formation.

Transit time is the reciprocal of velocity. Fast rock means small $\Delta t$, slow rock means large $\Delta t$. That inversion trips people up on their first crossplot, so fix it now: on the typewell, the clean porous sand at 2020 m reads DT of 281.54 while the tighter shale at 2000 m reads 238.88. The sand is slower than the shale because it carries more fluid.

Modern tools are borehole compensated: they fire from transmitters above and below the receiver array and average the two readings, cancelling errors from tool tilt and modest changes in hole size. Array tools with many receivers go further and extract the arrival by waveform correlation rather than a simple threshold. For interpretation at this tier, the important point is that DT on a well-run log is one of the most repeatable measurements in the suite.

## Units, and the metre convention

Legacy charts quote transit time in microseconds per foot, and two numbers from those charts are burned into the industry memory: about 55.5 us/ft for sandstone matrix and about 200 us/ft for water. This course, like the typewell dataset, works in microseconds per metre. Since 1 ft is 0.3048 m, converting is a single division:

$$\Delta t\,[\mu s/m] = \frac{\Delta t\,[\mu s/ft]}{0.3048}$$

So 55.5 us/ft becomes 55.5 / 0.3048 = 182 us/m, and 200 us/ft becomes 656 us/m. Those are exactly the typewell's given matrix and fluid values, $\Delta t_{ma} = 182$ and $\Delta t_{fl} = 656$ us/m. When you meet a chart or a paper quoting 55.5 and 200, you are looking at the same physics in the other unit system. Always check which system a log header declares before using any matrix value.

## Why transit time responds to porosity

Sound crosses a porous rock partly through the mineral frame and partly through the pore fluid. The frame is fast: quartz transmits a compressional wave at roughly 5.5 km/s, which is the 182 us/m matrix value. Pore water is slow, roughly 1.5 km/s, the 656 us/m fluid value. Fill part of the rock with slow fluid and the composite transit time rises in proportion. More porosity, slower rock, larger DT. The next lesson turns that qualitative statement into the Wyllie time-average equation.

The contrast between 182 and 656 us/m is large, more than a factor of three, which is why the sonic makes a usable porosity tool: each porosity unit adds several microseconds per metre, comfortably above the tool's repeatability.

## What can corrupt the reading

Three environmental effects matter at this tier.

Cycle skipping. If the first arrival is weak, the timing circuit can miss it and trigger on a later cycle of the waveform. The log jumps to spuriously high DT in sharp spikes. Weak arrivals happen in gas-cut mud, large washouts, and unconsolidated formations. Spikes that reset abruptly are the signature; treat them as bad data, not as porosity.

Washouts. The head wave travels the borehole wall, so an enlarged hole lengthens the mud path. Borehole compensation removes most of it, but a severe washout still drags DT high. Read the caliper alongside the sonic before trusting any interval.

Gas. Replace liquid with gas in the pores and the rock slows dramatically; DT rises well above what the same porosity would give water-filled. Gas makes sonic porosity read too high, and the effect is strongest in unconsolidated sands. The typewell is water and oil bearing with no gas leg, so this course does not correct for it, but you must recognise the symptom.

## Where this is going

You now have a curve, DT in us/m, and two anchor values, 182 for matrix and 656 for fluid. The typewell samples every 0.5 m, and the values you will use repeatedly are the clean sand at 2020 m with DT 281.54 and the shale at 2000 m with DT 238.88. The next two lessons convert DT into porosity by two different recipes, Wyllie and Raymer-Hunt-Gardner, and the final lesson of the module tests both against the density answer across the whole well.

## Exercise

Convert 100 us/ft to metric transit time, and state whether a clean water-filled sandstone reading that value is physically plausible. As a self-check: 100 / 0.3048 = 328.1 us/m, which sits between the matrix value 182 and the fluid value 656, so it is plausible and corresponds to a substantial porosity. Then explain in one sentence why the shale at 2000 m (DT 238.88) is faster than the porous sand at 2020 m (DT 281.54) even though both are rock.
